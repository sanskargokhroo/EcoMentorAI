import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const EMISSION_FACTORS = {
  Walking: 0,
  Bicycle: 0,
  Metro: 0.04,
  Bus: 0.08,
  Scooter: 0.15,
  Car: 0.25,
  SUV: 0.35
};

const COLORS = {
  Walking: '#22c55e', // Green
  Bicycle: '#22c55e', // Green
  Metro: '#3b82f6',   // Blue
  Bus: '#eab308',     // Yellow
  Scooter: '#f97316', // Orange
  Car: '#ef4444',     // Red
  SUV: '#991b1b'      // Dark Red
};

const RouteComparator: React.FC = () => {
  const [distance, setDistance] = useState<number>(10);

  const data = Object.entries(EMISSION_FACTORS).map(([mode, factor]) => ({
    name: mode,
    co2: Number((distance * factor).toFixed(2)),
  }));

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-md border border-gray-100 dark:border-gray-700 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <span className="mr-3 text-3xl">🛣️</span> Route Emissions Comparator
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">See how different transport modes compare for your journey.</p>
        </div>
        
        <div className="w-full md:w-1/3 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Trip Distance: <span className="text-blue-600 dark:text-blue-400">{distance} km</span>
          </label>
          <input 
            type="range" 
            min="1" 
            max="100" 
            value={distance} 
            onChange={(e) => setDistance(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1km</span>
            <span>100km</span>
          </div>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <XAxis dataKey="name" stroke="#888888" tick={{ fill: '#888888' }} />
            <YAxis stroke="#888888" tick={{ fill: '#888888' }} label={{ value: 'CO₂ (kg)', angle: -90, position: 'insideLeft', fill: '#888888' }} />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              formatter={(value: number) => [`${value} kg`, 'CO₂ Emission']}
            />
            <Bar dataKey="co2" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-xl">
        <p className="text-sm text-green-800 dark:text-green-300">
          <strong>Insight:</strong> Choosing the Metro over a Car for this {distance}km trip saves <strong className="text-green-600 dark:text-green-400">{((EMISSION_FACTORS.Car - EMISSION_FACTORS.Metro) * distance).toFixed(2)} kg</strong> of CO₂! Small changes make a massive difference over time.
        </p>
      </div>
    </div>
  );
};

export default RouteComparator;
