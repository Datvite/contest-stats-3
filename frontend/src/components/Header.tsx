import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react'
import { Button } from './Button';

/**
 * Header component - main navigation header with class selection
 * Sticky positioning with smooth animations
 */
interface HeaderProps {
  selectedClass: number | null;
  onSelectClass: (classLevel: number) => void;
}

export const Header: React.FC<HeaderProps> = ({ selectedClass, onSelectClass }) => {
  const navigate = useNavigate();
  const classes = [9, 10, 11, 12];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Logo and title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">PREHSG Contest Hub</h1>
          </div>

          {/* Navigation and controls */}
          <div className="flex items-center gap-6">
            {/* Class selection buttons */}
            <div className="flex gap-2">
              {classes.map((classLevel) => (
                <button
                  key={classLevel}
                  onClick={() => onSelectClass(classLevel)}
                  className={`flex gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                    selectedClass === classLevel
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <GraduationCap/>
                  Class {classLevel}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};
