// File: src/components/RecommendationItem.tsx — Memoized individual recommendation component

import React, { useState } from 'react';
import { Recommendation } from '../types';
import { useEcoTree } from '../hooks/useEcoTree';

interface Props {
  recommendation: Recommendation;
}

const RecommendationItem: React.FC<Props> = ({ recommendation }) => {
  const [isCommitted, setIsCommitted] = useState(false);
  const { logExternalAction } = useEcoTree();

  const handleCommit = () => {
    setIsCommitted(true);
    logExternalAction('ai_recommendation_followed');
  };

  const getBadgeColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Hard': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <li className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-lg font-bold text-gray-800 dark:text-white">{recommendation.title}</h4>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(recommendation.difficulty)}`}>
          {recommendation.difficulty}
        </span>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{recommendation.description}</p>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center text-sm font-semibold text-green-600 dark:text-green-400">
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Save ~{recommendation.impactCO2} kg CO₂/mo
        </div>
        
        {isCommitted ? (
          <span className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Committed!
          </span>
        ) : (
          <button 
            onClick={handleCommit}
            className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            I'll do this!
          </button>
        )}
      </div>
    </li>
  );
};

export default React.memo(RecommendationItem);
