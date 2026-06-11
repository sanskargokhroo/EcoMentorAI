// File: src/components/AILoadingSkeleton.tsx — Skeleton UI for AI response loading state

import React from 'react';

const AILoadingSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-6" aria-live="polite" aria-label="Loading AI recommendations">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-gray-200 rounded-xl w-full"></div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(AILoadingSkeleton);
