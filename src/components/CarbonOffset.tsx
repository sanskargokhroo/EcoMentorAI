import React, { useState } from 'react';

interface CarbonOffsetProps {
  totalCO2: number;
}

const CarbonOffset: React.FC<CarbonOffsetProps> = ({ totalCO2 }) => {
  const [isPaid, setIsPaid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [view, setView] = useState<'neutralize' | 'undo'>('undo');

  // Example cost: ₹15 per kg of CO2
  const costPerKg = 15;
  const totalCost = Math.round(totalCO2 * costPerKg);
  const treesToPlant = Math.max(1, Math.round(totalCO2 / 20)); // Assume 1 tree absorbs 20kg
  
  // Daily logic
  const dailyCO2 = Number((totalCO2 / 30).toFixed(1));
  const acHours = Math.round(dailyCO2 / 0.8); // 0.8kg per hr
  const walkKm = Math.round(dailyCO2 / 0.2); // 0.2kg saved per km walking vs driving

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);
    }, 2000);
  };

  if (isPaid) {
    return (
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 rounded-3xl shadow-lg text-center transform transition-all mt-8 animate-fade-in relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner text-4xl">
            🌳
          </div>
          <h3 className="text-2xl font-black text-white mb-2">Footprint Neutralized!</h3>
          <p className="text-green-100 font-medium text-lg">
            Thank you! You've funded the planting of <strong>{treesToPlant} trees</strong>, completely offsetting your {totalCO2} kg CO₂ emissions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md border border-gray-100 dark:border-gray-700 mt-8 overflow-hidden">
      <div className="flex border-b border-gray-100 dark:border-gray-700">
        <button 
          onClick={() => setView('undo')} 
          className={`flex-1 py-4 font-bold text-center transition-colors ${view === 'undo' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
        >
          ↩️ Undo Today
        </button>
        <button 
          onClick={() => setView('neutralize')} 
          className={`flex-1 py-4 font-bold text-center transition-colors ${view === 'neutralize' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-b-2 border-blue-500' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
        >
          🌱 Neutralize All
        </button>
      </div>

      <div className="p-8">
        {view === 'undo' ? (
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Fix Today's Impact</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md">
                You generated approximately <strong>{dailyCO2} kg CO₂</strong> today. You can completely undo this right now without spending money.
              </p>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
              <p className="text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-2">To undo {dailyCO2}kg, simply do one of:</p>
              <ul className="text-sm text-indigo-800 dark:text-indigo-400 space-y-2">
                <li>• Skip the AC for <strong>{Math.max(1, acHours)} hours</strong></li>
                <li>• Walk/Bike <strong>{Math.max(1, walkKm)} km</strong> instead of driving</li>
                <li>• Eat <strong>100% Vegan</strong> tomorrow</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in">
            <div>
              <h3 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-2">
                Neutralize Your Footprint
              </h3>
              <p className="text-blue-800 dark:text-blue-400 text-sm max-w-md">
                Erase your {totalCO2} kg CO₂ footprint by funding real-world climate projects like planting {treesToPlant} trees.
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-3xl font-black text-blue-900 dark:text-white mb-3">
                ₹{totalCost}
              </div>
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:opacity-70 disabled:transform-none"
              >
                {isProcessing ? 'Processing...' : 'Pay & Offset'}
              </button>
              <span className="text-[10px] text-gray-500 uppercase mt-2 font-bold tracking-widest">*Mock Payment*</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarbonOffset;
