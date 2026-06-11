import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200 mt-auto">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <div className="flex justify-center items-center">
            <span className="text-xl font-extrabold text-gray-900 dark:text-white mr-2">
              <span className="text-green-600 dark:text-green-400">Eco</span>Mentor AI
            </span>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium flex items-center">
            Developed by Sanskar Gokhroo <span className="text-red-500 ml-1 animate-pulse">❤️</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
