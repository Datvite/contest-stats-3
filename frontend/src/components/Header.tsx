import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { Button } from './Button';
import logo from '../assets/logo.png';

// Import the logo image
/**
 * Header component - main navigation header with class selection
 * Sticky positioning with smooth animations
 */
interface HeaderProps {
  selectedClass: number | "other" | null;
  onSelectClass: (classLevel: number | "other") => void;
}

export const Header: React.FC<HeaderProps> = ({ selectedClass, onSelectClass }) => {
  const navigate = useNavigate();
  const classes = [9, 10, 11, 12];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
  <div className="max-w-7xl mx-auto px-6 py-6"> {/* tăng từ py-4 -> py-6 */}
    <div className="flex items-center justify-between gap-8">

      {/* Logo and title */}
      <div className="flex items-center gap-4 -ml-20">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-black to-gray-900 flex items-center justify-center shadow-md">
          <img src={logo} alt="Logo" className="w-9 h-9 object-contain" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          PREHSG Contest Hub
        </h1>
      </div>

      {/* Navigation and controls */}
      <div className="flex items-center gap-6">
        <div className="flex gap-3">
          {classes.map((classLevel) => (
            <button
              key={classLevel}
              onClick={() => onSelectClass(classLevel)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-200 text-base ${
                selectedClass === classLevel
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              <GraduationCap className="w-5 h-5"/>
              Class {classLevel}
            </button>
          ))}
          <button
            onClick={() => onSelectClass("other")}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-200 text-base ${
              selectedClass === "other"
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
            }`}
          >
            <GraduationCap className="w-5 h-5"/>
            Other
          </button>
        </div>
      </div>

    </div>
  </div>
</header>
);
};