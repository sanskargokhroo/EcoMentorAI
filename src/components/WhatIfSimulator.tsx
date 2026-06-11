import React, { useState, useMemo } from 'react';
import { UserInputData } from '../types';
import { calculateFootprint } from '../utils/carbonCalculator';

interface WhatIfSimulatorProps {
  currentInput: UserInputData;
  currentCO2: number;
}

const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({ currentInput, currentCO2 }) => {
  const [goVegan, setGoVegan] = useState(false);
  const [useEV, setUseEV] = useState(false);
  const [reduceElectricity, setReduceElectricity] = useState(false);

  const simulatedCO2 = useMemo(() => {
    const simulatedInput: UserInputData = {
      ...currentInput,
      dietType: goVegan ? 'vegan' : currentInput.dietType,
      // If EV is toggled, and they drive a car, we slash travel emissions by switching to "bike" equivalent or just reducing km.
      // To keep it simple, if EV is checked, we set transportType to "bike" (which has much lower emissions)
      transportType: useEV ? 'bike' : currentInput.transportType,
      monthlyElectricityKWh: reduceElectricity ? currentInput.monthlyElectricityKWh * 0.5 : currentInput.monthlyElectricityKWh
    };
    
    return calculateFootprint(simulatedInput).totalCO2;
  }, [currentInput, goVegan, useEV, reduceElectricity]);

  const savings = Math.max(0, currentCO2 - simulatedCO2).toFixed(1);
  const percentSaved = currentCO2 > 0 ? Math.round((Number(savings) / currentCO2) * 100) : 0;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-3xl shadow-md border border-purple-100 dark:border-purple-800/30">
      <h3 className="text-xl font-bold text-purple-900 dark:text-purple-300 mb-2 flex items-center">
        <span className="mr-2">🔮</span> "What If" Simulator
      </h3>
      <p className="text-purple-700 dark:text-purple-400 text-sm mb-6">
        Toggle lifestyle changes to see how much CO₂ you could save instantly.
      </p>

      <div className="space-y-4 mb-6">
        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input type="checkbox" className="sr-only" checked={goVegan} onChange={() => setGoVegan(!goVegan)} />
            <div className={`block w-10 h-6 rounded-full transition-colors ${goVegan ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${goVegan ? 'transform translate-x-4' : ''}`}></div>
          </div>
          <div className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">Go 100% Vegan</div>
        </label>

        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input type="checkbox" className="sr-only" checked={useEV} onChange={() => setUseEV(!useEV)} />
            <div className={`block w-10 h-6 rounded-full transition-colors ${useEV ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${useEV ? 'transform translate-x-4' : ''}`}></div>
          </div>
          <div className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">Switch to an Electric Vehicle (EV)</div>
        </label>

        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input type="checkbox" className="sr-only" checked={reduceElectricity} onChange={() => setReduceElectricity(!reduceElectricity)} />
            <div className={`block w-10 h-6 rounded-full transition-colors ${reduceElectricity ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${reduceElectricity ? 'transform translate-x-4' : ''}`}></div>
          </div>
          <div className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">Cut Electricity Usage in Half</div>
        </label>
      </div>

      <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-2xl text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Projected Footprint</p>
        <div className="text-3xl font-black text-purple-600 dark:text-purple-400 mb-1">
          {simulatedCO2} kg
        </div>
        {Number(savings) > 0 && (
          <div className="text-sm font-bold text-green-600 dark:text-green-400 animate-pulse">
            ↓ {savings} kg ({percentSaved}% reduction)
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatIfSimulator;
