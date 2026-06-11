import React, { useState, useEffect } from 'react';
import { getTimeMachineLetter } from '../services/api';
import { UserInputData } from '../types';

const CarbonTimeMachine: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [letter, setLetter] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [displayedText, setDisplayedText] = useState('');

  const generateLetter = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      setLetter(null);
      setDisplayedText('');

      const savedData = localStorage.getItem('eco_mentor_latest');
      if (!savedData) {
        throw new Error("No user data found. Please calculate your footprint first.");
      }

      const parsedData = JSON.parse(savedData);
      const userInput: UserInputData = parsedData.input;
      
      const response = await getTimeMachineLetter(userInput);
      if (response.success && response.data) {
        setLetter(response.data);
      } else {
        throw new Error("Failed to generate letter");
      }
    } catch (err: any) {
      setError(err.message || "A temporal anomaly occurred. Try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Typewriter effect
  useEffect(() => {
    if (!letter) return;
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= letter.length) {
        setDisplayedText(letter.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 30); // 30ms per character

    return () => clearInterval(interval);
  }, [letter]);

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-8 rounded-3xl shadow-2xl border border-indigo-500/30 text-white relative overflow-hidden group">
      {/* Background portal effects */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-400 via-purple-900 to-transparent animate-pulse pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 flex items-center">
              <span className="mr-3 text-3xl">⏳</span> Carbon Time Machine
            </h3>
            <p className="text-indigo-200 mt-2">Receive a message from yourself in the year 2050.</p>
          </div>
          
          {!letter && !isGenerating && (
            <button 
              onClick={generateLetter}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.5)] hover:shadow-[0_0_25px_rgba(79,70,229,0.8)] transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <span>Travel to 2050</span>
              <svg className="w-5 h-5 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-xl mb-4">
            ⚠️ {error}
          </div>
        )}

        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full border-t-4 border-b-4 border-indigo-400 animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-l-4 border-r-4 border-purple-400 animate-spin-reverse"></div>
              <div className="absolute inset-0 flex items-center justify-center text-3xl animate-pulse">🌀</div>
            </div>
            <p className="text-indigo-300 font-mono animate-pulse">Establishing temporal connection...</p>
          </div>
        )}

        {letter && (
          <div className="mt-6 bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-indigo-500/30 relative">
            <div className="absolute top-4 right-4 flex space-x-2">
              <button 
                onClick={() => setLetter(null)} 
                className="text-xs text-indigo-400 hover:text-white px-2 py-1 rounded bg-indigo-900/50"
              >
                Close Portal
              </button>
            </div>
            <div className="font-mono text-sm md:text-base text-indigo-100 whitespace-pre-wrap leading-relaxed min-h-[150px]">
              {displayedText}
              <span className="inline-block w-2 h-4 bg-purple-400 animate-pulse ml-1 align-middle"></span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin 2s linear infinite reverse;
        }
      `}</style>
    </div>
  );
};

export default CarbonTimeMachine;
