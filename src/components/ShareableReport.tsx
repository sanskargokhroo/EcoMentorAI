// File: src/components/ShareableReport.tsx — Component to generate and download a report card image

import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { CalculationResult } from '../types';
import GreenScore from './GreenScore';

interface Props {
  result: CalculationResult;
  userName?: string;
}

const ShareableReport: React.FC<Props> = ({ result, userName }) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    if (reportRef.current) {
      try {
        const canvas = await html2canvas(reportRef.current, { scale: 2 });
        const image = canvas.toDataURL('image/png');
        
        // Create a temporary link to download the image
        const link = document.createElement('a');
        link.href = image;
        link.download = `eco-mentor-score-${new Date().toISOString().split('T')[0]}.png`;
        link.click();
      } catch (err) {
        
      }
    }
  };

  return (
    <div className="mt-8 flex flex-col items-center space-y-4">
      {/* Hidden report card for image generation */}
      <div className="overflow-hidden w-0 h-0 opacity-0 relative">
        <div 
          className="w-[400px] bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl shadow-xl border border-green-200"
          ref={reportRef}
        >
          <h2 className="text-2xl font-bold text-green-800 text-center mb-2">
            {userName ? `${userName}'s EcoMentor Score` : 'My EcoMentor Score'}
          </h2>
          <p className="text-center text-sm text-gray-500 mb-6">{new Date().toLocaleDateString()}</p>
          
          <div className="flex justify-center mb-6">
            <GreenScore score={Math.max(0, 100 - Math.floor(result.totalCO2 / 10))} rating={result.rating} />
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-center text-gray-700">
              Total Monthly Emissions: <strong className="text-green-700">{result.totalCO2} kg CO₂</strong>
            </p>
            <p className="text-center text-sm text-gray-500 mt-2">
              {result.comparisonToIndia > 0 
                ? `${result.comparisonToIndia}% higher than India's avg`
                : `${Math.abs(result.comparisonToIndia)}% lower than India's avg`}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={handleShare}
        className="flex items-center px-6 py-3 bg-white dark:bg-gray-800 border-2 border-green-500 text-green-600 dark:text-green-400 rounded-lg font-semibold hover:bg-green-50 dark:hover:bg-green-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Share Report Card
      </button>
    </div>
  );
};

export default React.memo(ShareableReport);
