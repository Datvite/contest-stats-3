import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from './Button';
import { BookOpenCheck, BookCheck, X } from 'lucide-react';

/**
 * ContestCard component - displays individual contest information
 * Features smooth animations and interactive buttons
 */
interface ContestCardProps {
  contestName: string;
  contestUrl: string;
  solutions: { problem_name: string; solution_url: string }[];
}

export const ContestCard: React.FC<ContestCardProps> = ({
  contestName,
  contestUrl,
  solutions,
}) => {
  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);

  return (
    <>
      <div
        className="rounded-xl shadow-md p-6 bg-white border border-gray-100 transition-all duration-300"
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{contestName}</h3>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="default"
            size="sm"
            onClick={() => window.open(contestUrl, '_blank')}
            className="flex-1 gap-1"
          >
            <BookCheck/>
            Contest
          </Button>
          {solutions.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSolutionModalOpen(true)}
              className="flex-1 gap-2"
            >
              <BookOpenCheck/>
              Solution
            </Button>
          )}
        </div>
      </div>

      {/* Solutions Modal */}
      <Dialog.Root open={isSolutionModalOpen} onOpenChange={setIsSolutionModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg shadow-xl p-6">
            <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Solutions
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            <div className="space-y-2">
              {solutions.map((solution, index) => (
                <a
                  key={index}
                  href={solution.solution_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium text-gray-900 hover:text-blue-600"
                >
                  Solution {solution.problem_name}
                </a>
              ))}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};
