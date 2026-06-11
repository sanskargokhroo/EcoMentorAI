import React from 'react';

interface EcoBadgesProps {
  streak: number;
  cyclesWon: number;
  dietType: string;
  transportType: string;
}

const EcoBadges: React.FC<EcoBadgesProps> = ({ streak, cyclesWon, dietType, transportType }) => {
  const badges = [
    {
      id: 'streak-5',
      name: 'Streak Master',
      description: 'Maintained a 5-day challenge streak.',
      icon: '🔥',
      unlocked: streak >= 5
    },
    {
      id: 'vegan-warrior',
      name: 'Plant Powered',
      description: 'Selected a Vegan diet.',
      icon: '🥗',
      unlocked: dietType === 'vegan'
    },
    {
      id: 'green-commute',
      name: 'Green Commuter',
      description: 'Used a Bike, Bus, or Train.',
      icon: '🚲',
      unlocked: ['bike', 'bus', 'train'].includes(transportType)
    },
    {
      id: 'cycle-winner',
      name: 'Challenge Champ',
      description: 'Completed a full cycle of 5 challenges.',
      icon: '🏆',
      unlocked: cyclesWon > 0
    }
  ];

  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-md border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <span className="mr-2">🏅</span> Trophy Cabinet
        </h3>
        <span className="text-sm font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full">
          {unlockedCount} / {badges.length}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {badges.map(badge => (
          <div 
            key={badge.id} 
            className={`p-4 rounded-2xl flex flex-col items-center text-center transition-all duration-500 ${
              badge.unlocked 
                ? 'bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-800/50 shadow-sm' 
                : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 opacity-60 grayscale'
            }`}
          >
            <div className={`text-4xl mb-2 ${badge.unlocked ? 'animate-bounce' : ''}`}>
              {badge.icon}
            </div>
            <h4 className={`font-bold text-sm mb-1 ${badge.unlocked ? 'text-yellow-800 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400'}`}>
              {badge.name}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-2">
              {badge.unlocked ? badge.description : 'Locked'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EcoBadges;
