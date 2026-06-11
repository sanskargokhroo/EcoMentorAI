import React from 'react';

interface TreeVisualizerProps {
  totalCO2: number;
}

const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ totalCO2 }) => {
  // Rough estimate: A mature tree absorbs ~20kg of CO2 per year.
  // So to offset 1 month of emissions, you need (totalCO2 / (20/12)) trees growing for a month,
  // or simply "It takes X trees a whole year to absorb your 1 month of emissions".
  const treesNeeded = Math.max(1, Math.ceil(totalCO2 / 20));

  // Max trees to render to avoid lagging the DOM
  const displayTrees = Math.min(treesNeeded, 100);
  const excessTrees = treesNeeded > 100 ? treesNeeded - 100 : 0;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-md border border-gray-100 dark:border-gray-700">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
        <span className="mr-2">🌲</span> The Forest Impact
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
        It would take exactly <strong>{treesNeeded} mature trees</strong> a full year to absorb your <strong>{totalCO2} kg</strong> of emissions from just this month.
      </p>

      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl border border-green-100 dark:border-green-800 flex flex-wrap gap-2 justify-center max-h-60 overflow-y-auto">
        {Array.from({ length: displayTrees }).map((_, i) => (
          <div 
            key={i} 
            className="text-2xl animate-fade-in"
            style={{ animationDelay: `${(i % 20) * 0.05}s` }}
            title="1 Tree"
          >
            🌲
          </div>
        ))}
        {excessTrees > 0 && (
          <div className="flex items-center justify-center bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 font-bold px-3 py-1 rounded-full text-sm animate-fade-in">
            + {excessTrees} more
          </div>
        )}
      </div>
    </div>
  );
};

export default TreeVisualizer;
