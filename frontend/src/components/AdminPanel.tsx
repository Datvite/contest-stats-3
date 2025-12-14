import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Plus, Trash2, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { api } from '../lib/api';

/**
 * AdminPanel component - complete CRUD interface for managing contests
 * Features dialog forms for adding/editing and table view for management
 */
interface Contest {
  id: number;
  class_level: string; // Backend returns string: "9", "10", "11", "12", or "other"
  year: number;
  contest_name: string;
  contest_url: string;
  solutions: { problem_name: string; solution_url: string }[];
}

interface SolutionFormData {
  problem_name: string;
  solution_url: string;
}

interface FormData {
  class_level: string;
  year: string;
  contest_name: string;
  contest_url: string;
  solutions: SolutionFormData[];
}

export const AdminPanel: React.FC = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    class_level: '',
    year: '',
    contest_name: '',
    contest_url: '',
    solutions: [{ problem_name: '', solution_url: '' }],
  });

  // Fetch contests on component mount
  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      setLoading(true);
      setError(''); // Clear previous errors
      const response = await api.get('/contests');
      setContests(response.data || []);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.detail || err?.message || 'Failed to fetch contests';
      setError(`Error: ${errorMessage}. Please check if the backend server is running.`);
      console.error('Failed to fetch contests:', err);
      setContests([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.class_level || !formData.year || !formData.contest_name) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      // Backend expects string for class_level: "9", "10", "11", "12", or "other"
      const classLevelValue = formData.class_level === "other" ? "other" : formData.class_level;
      const payload = {
        class_level: classLevelValue,
        year: parseInt(formData.year),
        contest_name: formData.contest_name,
        contest_url: formData.contest_url,
        solutions: formData.solutions
          .filter(s => s.problem_name.trim() && s.solution_url.trim())
          .map(s => ({
            problem_name: s.problem_name,
            solution_url: s.solution_url,
          })),
      };

      if (editingId) {
        await api.put(`/contests/${editingId}`, payload);
      } else {
        await api.post('/contests', payload);
      }

      await fetchContests();
      resetForm();
      setIsDialogOpen(false);
    } catch (err) {
      setError('Failed to save contest');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (contest: Contest) => {
    setFormData({
      class_level: String(contest.class_level),
      year: String(contest.year),
      contest_name: contest.contest_name,
      contest_url: contest.contest_url,
      solutions: contest.solutions.length > 0 
        ? contest.solutions.map(s => ({ problem_name: s.problem_name, solution_url: s.solution_url }))
        : [{ problem_name: '', solution_url: '' }],
    });
    setEditingId(contest.id);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this contest?')) return;

    try {
      setLoading(true);
      setError(''); // Clear previous errors
      
      // Check if token exists
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setError('You are not authenticated. Please login again.');
        return;
      }

      await api.delete(`/contests/${id}`);
      await fetchContests();
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setError('Authentication failed. Please login again.');
        // Clear invalid token
        localStorage.removeItem('admin_token');
        // Reload to show login form
        window.location.reload();
      } else {
        const errorMessage = err?.response?.data?.detail || err?.message || 'Failed to delete contest';
        setError(`Error: ${errorMessage}`);
      }
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      class_level: '',
      year: '',
      contest_name: '',
      contest_url: '',
      solutions: [{ problem_name: '', solution_url: '' }],
    });
    setEditingId(null);
    setError('');
  };

  const addSolution = () => {
    setFormData({
      ...formData,
      solutions: [...formData.solutions, { problem_name: '', solution_url: '' }],
    });
  };

  const removeSolution = (index: number) => {
    if (formData.solutions.length > 1) {
      setFormData({
        ...formData,
        solutions: formData.solutions.filter((_, i) => i !== index),
      });
    }
  };

  const updateSolution = (index: number, field: keyof SolutionFormData, value: string) => {
    const updatedSolutions = [...formData.solutions];
    updatedSolutions[index] = { ...updatedSolutions[index], [field]: value };
    setFormData({ ...formData, solutions: updatedSolutions });
  };

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) resetForm();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-10 py-6"
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <Dialog.Root open={isDialogOpen} onOpenChange={handleOpenChange}>
          <Dialog.Trigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Contest
            </Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg shadow-xl p-6">
              <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  {editingId ? 'Edit Contest' : 'Add New Contest'}
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </Dialog.Close>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class Level *
                  </label>
                  <select
                    value={formData.class_level}
                    onChange={(e) => setFormData({ ...formData, class_level: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">Select class</option>
                    <option value="9">Class 9</option>
                    <option value="10">Class 10</option>
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year *
                  </label>
                  <input
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="2030"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contest Name *
                  </label>
                  <input
                    type="text"
                    value={formData.contest_name}
                    onChange={(e) => setFormData({ ...formData, contest_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Enter contest name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contest URL
                  </label>
                  <input
                    type="url"
                    value={formData.contest_url}
                    onChange={(e) => setFormData({ ...formData, contest_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Solutions
                    </label>
                    <button
                      type="button"
                      onClick={addSolution}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add Solution
                    </button>
                  </div>
                  <div className="space-y-3">
                    {formData.solutions.map((solution, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={solution.problem_name}
                            onChange={(e) => updateSolution(index, 'problem_name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                            placeholder="Problem name (e.g., Problem 1)"
                          />
                          <input
                            type="url"
                            value={solution.solution_url}
                            onChange={(e) => updateSolution(index, 'solution_url', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                            placeholder="Solution URL"
                          />
                        </div>
                        {formData.solutions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSolution(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1"
                            title="Remove solution"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOpenChange(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? 'Saving...' : editingId ? 'Update' : 'Add'}
                  </Button>
                </div>
              </form>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={() => {
                setError('');
                fetchContests();
              }}
              className="text-sm text-red-600 hover:text-red-800 underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Contests Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">Loading contests...</p>
          </div>
        ) : contests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">No contests yet. Add one to get started!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Class</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Year</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contest Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contest URL</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Solutions</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <AnimatePresence>
                  {contests.map((contest) => (
                    <motion.tr
                      key={contest.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {contest.class_level === "other" ? "Other" : `Class ${contest.class_level}`}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{contest.year}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{contest.contest_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <a href={contest.contest_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          View
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {contest.solutions.length} solution{contest.solutions.length !== 1 ? 's' : ''}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(contest)}
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(contest.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};
