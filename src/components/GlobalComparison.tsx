import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface GlobalComparisonProps {
  totalCO2: number;
}

const GlobalComparison: React.FC<GlobalComparisonProps> = ({ totalCO2 }) => {
  const data = [
    { name: 'You', value: totalCO2, color: '#10b981' }, // emerald-500
    { name: 'India Avg', value: 160, color: '#f59e0b' }, // amber-500
    { name: 'Global Avg', value: 400, color: '#3b82f6' }, // blue-500
    { name: 'USA Avg', value: 1200, color: '#ef4444' } // red-500
  ].sort((a, b) => a.value - b.value); // Sort ascending to show scale nicely

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-md border border-gray-100 dark:border-gray-700">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
        <span className="mr-2">🗺️</span> Global Comparison
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
        See how your carbon footprint compares to national and global monthly averages.
      </p>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} width={80} />
            <Tooltip 
              cursor={{fill: 'transparent'}}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              formatter={(value: number) => [`${value} kg CO₂`, 'Emissions']}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24} animationDuration={1500}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GlobalComparison;
