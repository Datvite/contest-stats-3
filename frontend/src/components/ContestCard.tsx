import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { BookOpenCheck, BookCheck } from 'lucide-react';

/**
 * ContestCard component - displays individual contest information
 * Features smooth animations and interactive buttons
 */
interface ContestCardProps {
  contestName: string;
  preNumber: number;
  contestUrl: string;
  solutionUrl: string;
}

export const ContestCard: React.FC<ContestCardProps> = ({
  contestName,
  preNumber,
  contestUrl,
  solutionUrl,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
      className="rounded-xl shadow-md p-6 bg-white border border-gray-100 transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{contestName}</h3>
          <p className="text-sm text-gray-500 mt-1">Pre #{preNumber}</p>
        </div>
        <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
          Pre {preNumber}
        </span>
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
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(solutionUrl, '_blank')}
          className="flex-1 gap-2"
        >
          <BookOpenCheck/>
          Solution
        </Button>
      </div>
    </motion.div>
  );
};
