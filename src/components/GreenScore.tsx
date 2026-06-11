// File: src/components/GreenScore.tsx — Animated circular progress for sustainability score

import React from 'react';
import { SustainabilityRating } from '../types';

interface GreenScoreProps {
  score: number; // 0 to 100
  rating: SustainabilityRating;
}

const GreenScore: React.FC<GreenScoreProps> = ({ score, rating }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = () => {
    switch(rating) {
      case 'A': return 'text-green-500';
      case 'B': return 'text-green-400';
      case 'C': return 'text-yellow-400';
      case 'D': return 'text-orange-500';
      case 'F': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center relative p-4">
      <svg
        className="transform -rotate-90 w-40 h-40"
        role="img"
        aria-label={`Green score: ${score} out of 100, Rating: ${rating}`}
      >
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          className="text-gray-200 dark:text-gray-700"
        />
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`${getColor()} transition-all duration-1000 ease-out`}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-gray-800 dark:text-white">{score}</span>
        <span className={`text-xl font-extrabold ${getColor()}`}>Grade {rating}</span>
      </div>
    </div>
  );
};

export default React.memo(GreenScore);
