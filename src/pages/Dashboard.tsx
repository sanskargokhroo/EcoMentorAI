// File: src/pages/Dashboard.tsx — User analytics and AI recommendations dashboard

import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import GreenScore from '../components/GreenScore';
import DashboardCharts from '../components/DashboardCharts';
import ChallengeCard from '../components/ChallengeCard';
import RecommendationItem from '../components/RecommendationItem';
import ShareableReport from '../components/ShareableReport';
import AQIBadge from '../components/AQIBadge';
import CarbonOffset from '../components/CarbonOffset';
import TreeVisualizer from '../components/TreeVisualizer';
import CarbonBudget from '../components/CarbonBudget';
import GlobalComparison from '../components/GlobalComparison';
import EcoBadges from '../components/EcoBadges';
import WhatIfSimulator from '../components/WhatIfSimulator';
import HouseholdSummary from '../components/HouseholdSummary';
import CarbonTimeMachine from '../components/CarbonTimeMachine';
import RouteComparator from '../components/RouteComparator';
import { EcoTree } from '../components/EcoTree';
import { useEcoTree } from '../hooks/useEcoTree';
import { CalculationResult, AICoachResponse } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { getRandomChallenges } from '../constants/challenges';

interface DashboardState {
  name?: string;
  input?: unknown;
  result: CalculationResult | null;
  aiCoach: AICoachResponse | null;
  history: { date: string; totalCO2: number }[];
}

type TabId = 'overview' | 'analytics' | 'tools' | 'challenges';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { logExternalAction } = useEcoTree();
  const [data, setData] = useState<DashboardState>({ result: null, aiCoach: null, history: [] });
  const [completedChallenges, setCompletedChallenges] = useState<Record<string, boolean>>({});
  const [currentChallenges, setCurrentChallenges] = useState<{id: string, title: string}[]>([]);
  const [cyclesWon, setCyclesWon] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  useEffect(() => {
    // Load data from localStorage
    const latestStr = localStorage.getItem('eco_mentor_latest');
    const historyStr = localStorage.getItem('eco_mentor_history');
    const challengesStr = localStorage.getItem('eco_mentor_challenges');
    const currentChallengesStr = localStorage.getItem('eco_mentor_current_challenges');
    const cyclesStr = localStorage.getItem('eco_mentor_cycles_won');
    const streakStr = localStorage.getItem('eco_mentor_streak');

    if (latestStr) {
      const parsed = JSON.parse(latestStr);
      setData(prev => ({ ...prev, name: parsed.name, input: parsed.input, result: parsed.result, aiCoach: parsed.aiCoach }));
    }
    if (historyStr) {
      setData(prev => ({ ...prev, history: JSON.parse(historyStr) }));
    }
    if (challengesStr) {
      setCompletedChallenges(JSON.parse(challengesStr));
    }
    if (streakStr) {
      setStreak(Number(streakStr));
    }
    if (cyclesStr) {
      setCyclesWon(Number(cyclesStr));
    }
    
    // Initialize challenges if empty
    if (currentChallengesStr) {
      setCurrentChallenges(JSON.parse(currentChallengesStr));
    } else {
      const newChallenges = getRandomChallenges(5);
      setCurrentChallenges(newChallenges);
      localStorage.setItem('eco_mentor_current_challenges', JSON.stringify(newChallenges));
    }
  }, []);

  const handleToggleChallenge = useCallback((id: string) => {
    setCompletedChallenges(prev => {
      const isCurrentlyCompleted = !!prev[id];
      const nextCompleted = { ...prev, [id]: !isCurrentlyCompleted };
      
      localStorage.setItem('eco_mentor_challenges', JSON.stringify(nextCompleted));
      
      if (!isCurrentlyCompleted) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        localStorage.setItem('eco_mentor_streak', newStreak.toString());
        
        logExternalAction('challenge_complete');
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
      return nextCompleted;
    });
  }, [streak, logExternalAction]);

  const handleNextCycle = () => {
    const newChallenges = getRandomChallenges(5);
    setCurrentChallenges(newChallenges);
    setCompletedChallenges({});
    
    const newCycles = cyclesWon + 1;
    setCyclesWon(newCycles);
    
    localStorage.setItem('eco_mentor_current_challenges', JSON.stringify(newChallenges));
    localStorage.setItem('eco_mentor_challenges', JSON.stringify({}));
    localStorage.setItem('eco_mentor_cycles_won', newCycles.toString());
  };

  if (!data.result || !data.aiCoach) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">No data found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Please calculate your footprint first.</p>
        <Link to="/calculate" className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
          Go to Calculator
        </Link>
      </div>
    );
  }

  // Calculate score (0-100)
  const score = Math.max(0, 100 - Math.floor(data.result.totalCO2 / 10));
  const firstName = data.name ? data.name.split(' ')[0] : '';

  return (
    <div className="space-y-8 pb-12 relative animate-fade-in">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden bg-black/10 backdrop-blur-sm transition-all">
          <div className="text-8xl animate-bounce drop-shadow-2xl">🎉🌿✨</div>
        </div>
      )}

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-green-50 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/20 p-8 rounded-3xl border border-green-100 dark:border-green-800/50 shadow-sm">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 drop-shadow-sm">
            {firstName ? `Welcome, ${firstName}!` : t('nav.dashboard')}
          </h2>
          <p className="text-lg text-green-700 dark:text-green-300 font-medium">Your personalized sustainability overview</p>
        </div>
        <div className="flex items-center gap-6 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
          <div className="text-center px-6 border-r border-gray-200 dark:border-gray-700">
            <span className="block text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold mb-1">{t('challenge.streak')}</span>
            <span className="block text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
              🔥 {streak}
            </span>
          </div>
          <div className="text-center px-6">
            <span className="block text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold mb-1">{t('challenge.longest')}</span>
            <span className="block text-2xl font-bold text-gray-800 dark:text-gray-200">{Math.max(streak, 5)}</span>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto gap-2 p-2 bg-white/60 dark:bg-gray-800/60 rounded-2xl mb-8 shadow-sm border border-gray-100 dark:border-gray-700/50 backdrop-blur-md hide-scrollbar w-full max-w-full">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'analytics', label: 'Analytics', icon: '📈' },
          { id: 'tools', label: 'AI Coach & Tools', icon: '🤖' },
          { id: 'challenges', label: 'Challenges & Rewards', icon: '🎯' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabId)}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-green-600 text-white shadow-lg transform scale-[1.02] border-b-4 border-green-800'
                : 'text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/30'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-8 animate-fade-in">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Quick Tools Menu */}
            <div className="flex flex-wrap gap-4 mt-2 mb-2">
              <Link to="/scanner" className="flex-1 min-w-[200px] bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center hover:shadow-md hover:border-green-300 dark:hover:border-green-600 transition-all group">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center text-2xl mr-4 group-hover:scale-110 transition-transform">📱</div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Product Scanner</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Scan barcodes for eco-impact</p>
                </div>
              </Link>
              <button onClick={() => setActiveTab('tools')} className="flex-1 min-w-[200px] text-left bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all group">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-2xl mr-4 group-hover:scale-110 transition-transform">🌱</div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Carbon Offset</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Neutralize today's footprint</p>
                </div>
              </button>
              <button onClick={() => setActiveTab('tools')} className="flex-1 min-w-[200px] text-left bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center hover:shadow-md hover:border-purple-300 dark:hover:border-purple-600 transition-all group">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center text-2xl mr-4 group-hover:scale-110 transition-transform">🔮</div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">What-If Simulator</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Test lifestyle changes instantly</p>
                </div>
              </button>
            </div>

            <div className="bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-gray-800/80 p-8 rounded-3xl shadow-lg border border-green-100 dark:border-gray-700 flex flex-col md:flex-row items-center justify-around transform transition-all hover:scale-[1.01]">
              <div className="mb-6 md:mb-0 text-center md:text-left">
                <div className="inline-block px-4 py-1 rounded-full bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 text-sm font-bold tracking-wide uppercase mb-3">
                  Performance
                </div>
                <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">{t('dashboard.greenScore')}</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-xs text-lg">
                  Your score is based on your total emissions compared to global targets.
                </p>
              </div>
              <div className="drop-shadow-xl">
                <GreenScore score={score} rating={data.result.rating} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <HouseholdSummary primaryUserCO2={data.result.totalCO2} primaryUserName={firstName} />
              <CarbonBudget totalCO2={data.result.totalCO2} />
            </div>

            <EcoTree />
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-fade-in">
            <RouteComparator />
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-md border border-gray-100 dark:border-gray-700">
              <DashboardCharts breakdown={data.result.breakdown} history={data.history} />
            </div>
            <GlobalComparison totalCO2={data.result.totalCO2} />
            <TreeVisualizer totalCO2={data.result.totalCO2} />
          </div>
        )}

        {/* AI COACH & TOOLS TAB */}
        {activeTab === 'tools' && (
          <div className="space-y-8 animate-fade-in">
            <AQIBadge />
            <CarbonTimeMachine />
            
            {data.input && (
              <WhatIfSimulator currentInput={data.input} currentCO2={data.result.totalCO2} />
            )}
            
            <CarbonOffset totalCO2={data.result.totalCO2} />

            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-md border border-gray-100 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center mr-4 shadow-inner">
                  <span className="text-2xl">🤖</span>
                </div>
                {t('dashboard.aiCoach')}
              </h3>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800/50 mb-8">
                <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Top Emission Sources
                </h4>
                <ul className="space-y-3">
                  {data.aiCoach.topSources.map((src, i) => (
                    <li key={i} className="flex items-start bg-white/60 dark:bg-gray-800/60 p-3 rounded-lg">
                      <span className="text-blue-500 mr-2 mt-0.5">•</span>
                      <span className="text-blue-900 dark:text-blue-100">
                        <strong className="font-bold">{src.source}:</strong> {src.explanation}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <ul className="space-y-4">
                {data.aiCoach.recommendations.map(rec => (
                  <RecommendationItem key={rec.id} recommendation={rec} />
                ))}
              </ul>
              
              <div className="mt-8 p-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl shadow-lg text-center transform transition-all hover:-translate-y-1">
                <p className="text-white font-medium text-lg">
                  If you follow these recommendations, you could save an estimated <br/>
                  <strong className="text-3xl font-black mt-2 block drop-shadow-md">{data.aiCoach.estimatedSavings} kg CO₂</strong>
                  <span className="text-green-100 text-sm mt-1 block">next month!</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CHALLENGES & REWARDS TAB */}
        {activeTab === 'challenges' && (
          <div className="space-y-8 animate-fade-in">
            <EcoBadges 
              streak={streak} 
              cyclesWon={cyclesWon} 
              dietType={data.input?.dietType || 'omnivore'} 
              transportType={data.input?.transportType || 'car'} 
            />
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-md border border-gray-100 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/50 rounded-2xl flex items-center justify-center mr-4 shadow-inner">
                  <span className="text-2xl">🎯</span>
                </div>
                {t('dashboard.challenges')}
              </h3>
              <div className="space-y-4">
                {currentChallenges.map(challenge => (
                  <ChallengeCard
                    key={challenge.id}
                    id={challenge.id}
                    title={challenge.title}
                    isCompleted={!!completedChallenges[challenge.id]}
                    onToggle={handleToggleChallenge}
                  />
                ))}
              </div>
              
              {/* Show "Next Cycle" button if all current challenges are completed */}
              {currentChallenges.length > 0 && currentChallenges.every(c => completedChallenges[c.id]) && (
                <div className="mt-6 p-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl border border-yellow-200 dark:border-yellow-800 text-center animate-fade-in">
                  <h4 className="text-xl font-bold text-yellow-800 dark:text-yellow-400 mb-2">Cycle Completed! 🏆</h4>
                  <p className="text-yellow-700 dark:text-yellow-500 mb-4">Amazing work! You've completed all challenges for this cycle.</p>
                  <button
                    onClick={handleNextCycle}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all focus:outline-none focus:ring-4 focus:ring-yellow-500/50"
                  >
                    Start Next Cycle
                  </button>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('dashboard.share')}</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Inspire others by sharing your amazing sustainability score!
              </p>
              <ShareableReport result={data.result} userName={data.name} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
