// File: src/components/DashboardCharts.tsx — Recharts implementation for dashboard analytics

import React, { useMemo } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as PieTooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as LineTooltip
} from 'recharts';
import { EmissionBreakdown } from '../types';
import { useTheme } from '../hooks/useTheme';

interface Props {
  breakdown: EmissionBreakdown;
  history?: { date: string; totalCO2: number }[];
}

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'];

const DashboardCharts: React.FC<Props> = ({ breakdown, history = [] }) => {
  const { theme } = useTheme();
  
  const pieData = useMemo(() => [
    { name: 'Transport', value: breakdown.transport },
    { name: 'Electricity', value: breakdown.electricity },
    { name: 'Diet', value: breakdown.diet },
    { name: 'Shopping', value: breakdown.shopping },
  ].filter(item => item.value > 0), [breakdown]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 text-center">Emission Breakdown</h3>
        <div className="h-64" role="img" aria-label="Donut chart showing emission breakdown by category">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <PieTooltip 
                formatter={(value: number) => `${value} kg CO₂`}
                contentStyle={{ backgroundColor: theme === 'dark' ? '#374151' : '#fff', borderColor: theme === 'dark' ? '#4B5563' : '#e5e7eb', color: theme === 'dark' ? '#fff' : '#000' }}
              />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: theme === 'dark' ? '#e5e7eb' : '#374151' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 text-center">Monthly Trend</h3>
        <div className="h-64" role="img" aria-label="Line chart showing historical carbon emissions">
          {history.length > 1 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{fontSize: 12}} stroke="#9ca3af" />
                <YAxis tick={{fontSize: 12}} stroke="#9ca3af" />
                <LineTooltip 
                  formatter={(value: number) => [`${value} kg`, 'Total CO₂']}
                  contentStyle={{ backgroundColor: theme === 'dark' ? '#374151' : '#fff', borderColor: theme === 'dark' ? '#4B5563' : '#e5e7eb', color: theme === 'dark' ? '#fff' : '#000' }}
                />
                <Line type="monotone" dataKey="totalCO2" stroke="#22c55e" strokeWidth={3} dot={{ r: 4, fill: '#22c55e' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500 text-sm">
              Not enough historical data to show trend. Calculate again next month!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(DashboardCharts);
