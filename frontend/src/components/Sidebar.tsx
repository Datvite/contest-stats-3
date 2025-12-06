import React, { useState } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown, Calendar, GraduationCap } from 'lucide-react';
import { ContestCard } from './ContestCard';
import { motion } from 'framer-motion';

/**
 * Sidebar component - displays contests organized by year and class
 * Uses Radix UI Accordion for expandable year sections
 */
interface Contest {
  id: number;
  class_level: number;
  year: number;
  pre_number: number;
  contest_url: string;
  solution_url: string;
}

interface SidebarProps {
  contests: Contest[];
  selectedClass: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ contests, selectedClass }) => {
  // Filter contests by selected class
  const filteredContests = contests.filter(c => c.class_level === selectedClass);

  // Group contests by year
  const contestsByYear = filteredContests.reduce((acc, contest) => {
    if (!acc[contest.year]) {
      acc[contest.year] = [];
    }
    acc[contest.year].push(contest);
    return acc;
  }, {} as Record<number, Contest[]>);

  const years = Object.keys(contestsByYear)
    .map(Number)
    .sort((a, b) => b - a); // Sort descending (recent first)

  return (
    <motion.aside
      initial={{ x: -256, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto h-full"
    >
      <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide mb-6">
        <GraduationCap/>Class {selectedClass}
      </h2>

      <Accordion.Root type="single" collapsible defaultValue={`year-${years[0]}`}>
        {years.map((year) => (
          <Accordion.Item key={year} value={`year-${year}`} className="mb-2">
            <Accordion.Header className="flex">
              <Accordion.Trigger className="group flex-1 flex items-center justify-between px-4 py-3 text-left text-sm font-semibold text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                <span className="flex items-center gap-2">
                  {year}
                  <Calendar className="w-4 h-4 text-gray-500" />
                </span>
                <ChevronDown
                  className="w-4 h-4 text-gray-500 transition-transform duration-300 group-data-[state=open]:rotate-180"
                />
              </Accordion.Trigger>
            </Accordion.Header>

            <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
              <div className="space-y-3 pt-2 pl-4">
                {contestsByYear[year]
                  .sort((a, b) => a.pre_number - b.pre_number)
                  .map((contest) => (
                    <ContestCard
                      key={contest.id}
                      contestName={`PREHSG ${year} Class ${contest.class_level}`}
                      preNumber={contest.pre_number}
                      contestUrl={contest.contest_url}
                      solutionUrl={contest.solution_url}
                    />
                  ))}
              </div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>

      {years.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">No contests found for this class.</p>
        </div>
      )}
    </motion.aside>
  );
};
