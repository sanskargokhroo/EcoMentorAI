// File: src/components/Header.tsx — Application navigation and language toggle

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../hooks/useTheme';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-2xl font-bold text-green-600">
              <Link to="/" aria-label="EcoMentor AI Home">
                {t('app.title')}
              </Link>
            </h1>
          </div>
          
          <nav className="flex space-x-4 items-center">
            <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium">
              {t('nav.home')}
            </Link>
            <Link to="/calculate" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium">
              Calculator
            </Link>
            <Link to="/scanner" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium">
              Scanner
            </Link>
            <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium">
              {t('nav.dashboard')}
            </Link>
            
            <button
              onClick={toggleTheme}
              className="ml-2 p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Toggle dark mode"
            >
              <span role="img" aria-hidden="true">{theme === 'dark' ? '☀️' : '🌙'}</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default React.memo(Header);
