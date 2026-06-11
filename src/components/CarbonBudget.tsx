import React, { useState, useEffect } from 'react';

interface CarbonBudgetProps {
  totalCO2: number;
}

const CarbonBudget: React.FC<CarbonBudgetProps> = ({ totalCO2 }) => {
  // Default to ~160kg (approx India average per month)
  const [budget, setBudget] = useState(160);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(160);

  useEffect(() => {
    const saved = localStorage.getItem('eco_mentor_budget');
    if (saved) {
      setBudget(Number(saved));
      setEditValue(Number(saved));
    }
  }, []);

  const handleSave = () => {
    setBudget(editValue);
    setIsEditing(false);
    localStorage.setItem('eco_mentor_budget', editValue.toString());
  };

  const percentUsed = Math.min(100, Math.round((totalCO2 / budget) * 100));
  const isOverBudget = totalCO2 > budget;
  const remaining = Math.max(0, budget - totalCO2).toFixed(1);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-md border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <span className="mr-2">📉</span> Monthly Carbon Budget
        </h3>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="text-sm text-green-600 dark:text-green-400 hover:underline">Edit Goal</button>
        ) : null}
      </div>

      {isEditing ? (
        <div className="flex items-center gap-3 mb-4">
          <input 
            type="number" 
            value={editValue} 
            onChange={e => setEditValue(Number(e.target.value))}
            className="w-24 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            min="10"
          />
          <span className="text-gray-500 text-sm">kg CO₂</span>
          <button onClick={handleSave} className="bg-green-600 text-white px-3 py-1 rounded text-sm">Save</button>
        </div>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Goal: <strong>{budget} kg</strong> | Remaining: <strong>{remaining} kg</strong>
        </p>
      )}

      <div className="relative w-full h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out ${isOverBudget ? 'bg-red-500' : percentUsed > 80 ? 'bg-orange-400' : 'bg-green-500'}`}
          style={{ width: `${percentUsed}%` }}
        />
      </div>
      
      <div className="flex justify-between mt-2 text-xs font-bold text-gray-500">
        <span>0%</span>
        <span className={isOverBudget ? 'text-red-500' : ''}>{percentUsed}% Used</span>
      </div>

      {isOverBudget && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm rounded-lg border border-red-200 dark:border-red-800">
          ⚠️ You have exceeded your monthly carbon budget. Check the AI coach recommendations to get back on track!
        </div>
      )}
    </div>
  );
};

export default CarbonBudget;
