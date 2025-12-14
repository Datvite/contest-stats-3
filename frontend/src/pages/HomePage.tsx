import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { ContestCard } from '../components/ContestCard';
import { api } from '../lib/api';

/**
 * HomePage - Main page displaying contests organized by class and year
 * Features class selection, sidebar with years, and contest cards for selected year
 */
interface Contest {
  id: number;
  class_level: string; // Backend returns string: "9", "10", "11", "12", or "other"
  year: number;
  contest_name: string;
  contest_url: string;
  solutions: { problem_name: string; solution_url: string }[];
}

export const HomePage: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<number | "other">(9);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(false);

  // Helper function to convert selectedClass to string for comparison
  const getClassLevelString = (cls: number | "other"): string => {
    return cls === "other" ? "other" : String(cls);
  };

  // Fetch contests on component mount
  useEffect(() => {
    fetchContests();
  }, []);

  // Set default year when contests are loaded or class changes
  useEffect(() => {
    if (contests.length > 0 && selectedClass) {
      const classLevelStr = getClassLevelString(selectedClass);
      const filteredContests = contests.filter(c => c.class_level === classLevelStr);
      const years = [...new Set(filteredContests.map(c => c.year))].sort((a, b) => b - a);
      if (years.length > 0 && !selectedYear) {
        setSelectedYear(years[0]);
      }
    }
  }, [contests, selectedClass]);

  const fetchContests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/contests');
      setContests(response.data);
    } catch (error) {
      console.error('Failed to fetch contests:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter contests by selected class and year
  const classLevelStr = getClassLevelString(selectedClass);
  const filteredContests = contests.filter(
    c => c.class_level === classLevelStr && (selectedYear === null || c.year === selectedYear)
  );

  // Group contests by year for sidebar
  const contestsByYear = contests.filter(c => c.class_level === classLevelStr).reduce((acc, contest) => {
    if (!acc[contest.year]) {
      acc[contest.year] = [];
    }
    acc[contest.year].push(contest);
    return acc;
  }, {} as Record<number, Contest[]>);

  return (
    <div className="min-h-screen bg-background">
      <Header selectedClass={selectedClass} onSelectClass={(classLevel) => setSelectedClass(classLevel)} />

      <div className="flex">
        {selectedClass && (
          <Sidebar 
            years={Object.keys(contestsByYear).map(Number).sort((a, b) => b - a)}
            selectedYear={selectedYear}
            onSelectYear={setSelectedYear}
          />
        )}

        {/* Main content */}
        <main className="flex-1 p-6">
          <div>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Loading contests...</p>
              </div>
            ) : selectedYear === null ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Select a year from the sidebar to view contests</p>
              </div>
            ) : filteredContests.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">No contests available for this year.</p>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedClass === "other" ? "Other" : `Class ${selectedClass}`} - Year {selectedYear}
                </h2>
                <p className="text-gray-600 text-sm mb-8">
                  {filteredContests.length} contest{filteredContests.length !== 1 ? 's' : ''} found
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredContests
                    .sort((a, b) => a.contest_name.localeCompare(b.contest_name))
                    .map((contest) => (
                      <ContestCard
                        key={contest.id}
                        contestName={contest.contest_name}
                        contestUrl={contest.contest_url}
                        solutions={contest.solutions}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
