// File: src/pages/Calculator.tsx — Main calculator page

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CarbonForm from '../components/CarbonForm';
import { calculateCarbonFootprint } from '../services/api';
import { UserInputData } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { useEcoTree } from '../hooks/useEcoTree';

const Calculator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { logExternalAction } = useEcoTree();

  const handleCalculate = async (data: UserInputData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await calculateCarbonFootprint(data);
      // Save to localStorage for history and dashboard
      const dashboardData = {
        name: data.name,
        input: data,
        result: response.data.footprint,
        aiCoach: response.data.aiCoach,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('eco_mentor_latest', JSON.stringify(dashboardData));
      
      // Update history
      const historyStr = localStorage.getItem('eco_mentor_history');
      const history = historyStr ? JSON.parse(historyStr) : [];
      history.push({
        date: new Date().toISOString().split('T')[0],
        totalCO2: response.data.footprint.totalCO2
      });
      localStorage.setItem('eco_mentor_history', JSON.stringify(history));

      logExternalAction('calculator_entry');
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to calculate footprint. Please try again.');
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
          <span className="text-green-600 dark:text-green-400">Eco</span>Mentor AI
        </h2>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
          {t('app.tagline')}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-400 dark:border-red-500 p-4 mb-6 rounded-md" role="alert">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors duration-200">
        <div className="p-1 bg-gradient-to-r from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600"></div>
        <div className="p-8">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{t('form.submit')}</h3>
          <CarbonForm onSubmit={handleCalculate} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Calculator;
