// File: src/components/ChallengeCard.tsx — Memoized Challenge component

import React, { useCallback } from 'react';

interface ChallengeCardProps {
  id: string;
  title: string;
  isCompleted: boolean;
  onToggle: (id: string) => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ id, title, isCompleted, onToggle }) => {
  const handleToggle = useCallback(() => {
    if (!isCompleted) {
      onToggle(id);
    }
  }, [id, onToggle, isCompleted]);

  return (
    <div 
      className={`p-4 rounded-lg border-2 transition-all flex items-center justify-between ${
        isCompleted 
          ? 'bg-green-50 dark:bg-green-900/30 border-green-500 dark:border-green-500 opacity-80 cursor-default' 
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-500 cursor-pointer'
      }`}
      onClick={handleToggle}
      role="button"
      tabIndex={isCompleted ? -1 : 0}
      onKeyDown={(e) => {
        if (!isCompleted && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleToggle();
        }
      }}
      aria-pressed={isCompleted}
      aria-label={`Challenge: ${title}`}
    >
      <div className="flex items-center">
        <span className={`font-medium ${isCompleted ? 'text-green-800 dark:text-green-400 line-through' : 'text-gray-800 dark:text-gray-200'}`}>
          {title}
        </span>
        {isCompleted && (
          <svg className="w-4 h-4 ml-2 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
        isCompleted ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 dark:border-gray-600'
      }`}>
        {isCompleted && (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
    </div>
  );
};

export default React.memo(ChallengeCard);
