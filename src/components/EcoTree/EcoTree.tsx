import React from 'react';
import { useEcoTree } from '../../hooks/useEcoTree';
import { ECO_ACTIONS } from '../../constants/treeStages';
import { EcoAction } from '../../types/tree.types';

export const EcoTree: React.FC = () => {
  const { 
    treeState, 
    renderData, 
    stageProgress, 
    leavesToNext, 
    logAction, 
    recentHistory,
    toastMessage
  } = useEcoTree();

  const handleActionClick = (action: string) => {
    logAction(action as EcoAction);
  };

  const manualActions: EcoAction[] = ['walk', 'cycle', 'vegetarian', 'vegan', 'save_power', 'recycle', 'public_transport'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 overflow-hidden relative">
      {/* Toast Notification */}
      <div 
        aria-live="polite"
        className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-900 text-white px-6 py-3 rounded-full font-bold shadow-2xl transition-all duration-300 ${toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
      >
        {toastMessage}
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="inline-flex items-center px-4 py-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full font-bold text-sm tracking-wide uppercase mb-4">
          <span className="mr-2">🌳</span> {treeState.currentStage.name}
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center">
          Eco Growth Tree
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-center max-w-md">
          {treeState.currentStage.description}
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Leaves</div>
          <div className="text-2xl font-black text-green-600 dark:text-green-400">{treeState.totalLeaves}</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">CO₂ Saved (kg)</div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{treeState.totalCO2Saved}</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Day Streak</div>
          <div className="text-2xl font-black text-orange-500 dark:text-orange-400">{treeState.streak}🔥</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Badges</div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400">{treeState.badges.length}</div>
        </div>
      </div>

      {/* SVG Tree Rendering */}
      <div className="flex justify-center mb-8 relative">
        <svg 
          viewBox="0 90 340 290" 
          className="w-full max-w-md max-h-80 h-auto drop-shadow-xl overflow-visible"
          role="img"
          aria-label={`Your eco tree — ${treeState.totalLeaves} leaves, currently ${treeState.currentStage.name} stage`}
        >
          {/* Ground */}
          <ellipse cx="170" cy="350" rx="120" ry="15" fill="#dcfce7" className="dark:fill-green-900/30" />
          
          {/* Trunk */}
          {treeState.totalLeaves > 0 ? (
            <rect 
              x={renderData.trunk.x} 
              y={renderData.trunk.y} 
              width={renderData.trunk.width} 
              height={renderData.trunk.height} 
              rx={renderData.trunk.width/4} 
              fill="#78350f" // amber-900
            />
          ) : (
            <ellipse cx="170" cy="345" rx="8" ry="5" fill="#78350f" /> // Seed
          )}

          {/* Branches */}
          {renderData.branches.map((b, i) => (
            <line 
              key={`branch-${i}`}
              x1={b.x1} y1={b.y1} 
              x2={b.x2} y2={b.y2} 
              stroke="#78350f" 
              strokeWidth={b.width} 
              strokeLinecap="round" 
            />
          ))}

          {/* Leaves */}
          <g>
            <style>
              {`
                @keyframes leafPop {
                  0% { transform: scale(0); }
                  70% { transform: scale(1.1); }
                  100% { transform: scale(1); }
                }
                .leaf-animate {
                  animation: leafPop 0.5s ease-out forwards;
                  transform-origin: center;
                }
              `}
            </style>
            {renderData.leaves.map((l, i) => (
              <ellipse 
                key={l.id}
                cx={l.cx} cy={l.cy} 
                rx={l.rx} ry={l.ry} 
                fill={l.color} 
                opacity={l.opacity}
                transform={`rotate(${l.rotation} ${l.cx} ${l.cy})`}
                className={i === renderData.leaves.length - 1 ? 'leaf-animate' : ''}
              />
            ))}
          </g>

          {/* Flowers */}
          {renderData.flowers.map((f, i) => (
            <circle key={`flower-${i}`} cx={f.cx} cy={f.cy} r={f.r} fill={f.color} />
          ))}

          {/* Fruits */}
          {renderData.fruits.map((f, i) => (
            <circle key={`fruit-${i}`} cx={f.cx} cy={f.cy} r={f.r} fill={f.color} />
          ))}
        </svg>
      </div>

      {/* Progress Bar */}
      <div className="mb-10 max-w-lg mx-auto">
        <div className="flex justify-between text-sm font-bold text-gray-600 dark:text-gray-400 mb-2">
          <span>{treeState.currentStage.name}</span>
          {leavesToNext > 0 ? (
            <span>{leavesToNext} leaves to next stage 🔒</span>
          ) : (
            <span>Max Stage Reached! 👑</span>
          )}
        </div>
        <div 
          className="h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden"
          role="progressbar" 
          aria-valuenow={stageProgress} 
          aria-valuemin={0} 
          aria-valuemax={100}
        >
          <div 
            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-1000 ease-out"
            style={{ width: `${stageProgress}%` }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mb-10">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Log Daily Action</h3>
        <div className="flex flex-wrap gap-3">
          {manualActions.map(action => {
            const data = ECO_ACTIONS[action];
            return (
              <button
                key={action}
                onClick={() => handleActionClick(action)}
                aria-label={`${data.label}, saves ${data.co2Saved}kg CO2`}
                className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full hover:bg-green-50 hover:border-green-300 dark:hover:bg-gray-700 transition-colors focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                <span className="mr-2 text-xl">{data.leafEmoji}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{data.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* History */}
      {recentHistory.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Recent Growth</h3>
          <div className="space-y-3">
            {recentHistory.slice(0, 5).map(entry => (
              <div key={entry.id} className="flex justify-between items-center text-sm">
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <span className="mr-2 text-green-500">+{ECO_ACTIONS[entry.action].co2Saved}kg</span>
                  {entry.label}
                </div>
                <div className="text-gray-400 dark:text-gray-500 text-xs">
                  {new Date(entry.timestamp).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
