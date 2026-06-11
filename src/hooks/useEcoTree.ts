import { useState, useEffect, useMemo, useCallback } from 'react';
import { EcoAction, TreeState, TreeRenderData, LeafEntry } from '../types/tree.types';
import { ECO_ACTIONS } from '../constants/treeStages';
import { 
  getStageFromLeaves, 
  getStageProgress, 
  getLeavesToNextStage, 
  generateTreeRenderData,
  calculateStreak,
  calculateBadges
} from '../utils/treeCalculations';

const STORAGE_KEY = 'ecomentor_tree_state';

const defaultState: TreeState = {
  totalLeaves: 0,
  totalCO2Saved: 0,
  currentStage: getStageFromLeaves(0),
  streak: 0,
  lastActionDate: null,
  history: [],
  badges: []
};

export function useEcoTree(): {
  treeState: TreeState;
  renderData: TreeRenderData;
  stageProgress: number;
  leavesToNext: number;
  logAction: (action: EcoAction) => void;
  logExternalAction: (action: EcoAction) => void;
  resetTree: () => void;
  recentHistory: LeafEntry[];
  toastMessage: string | null;
} {
  const [state, setState] = useState<TreeState>(defaultState);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse tree state', e);
      }
    }
  }, []);

  const saveState = useCallback((newState: TreeState) => {
    setState(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const logAction = useCallback((action: EcoAction) => {
    const actionData = ECO_ACTIONS[action];
    if (!actionData) return;

    setState(prevState => {
      const newEntry: LeafEntry = {
        id: crypto.randomUUID(),
        action,
        label: actionData.label,
        co2Saved: actionData.co2Saved,
        timestamp: Date.now(),
        leafIndex: prevState.totalLeaves + 1
      };

      const newHistory = [newEntry, ...prevState.history];
      const newLeaves = prevState.totalLeaves + 1;
      const newCO2 = prevState.totalCO2Saved + actionData.co2Saved;
      
      const newStreak = calculateStreak(newHistory);
      const newStage = getStageFromLeaves(newLeaves);
      
      let stageUnlocked = false;
      if (newStage.name !== prevState.currentStage.name) {
        stageUnlocked = true;
      }

      const newState: TreeState = {
        totalLeaves: newLeaves,
        totalCO2Saved: Number(newCO2.toFixed(2)),
        currentStage: newStage,
        streak: newStreak,
        lastActionDate: new Date().toISOString(),
        history: newHistory,
        badges: []
      };
      
      // Calculate badges with new state
      newState.badges = calculateBadges(newState);
      
      // Save
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      
      // UI feedback
      if (stageUnlocked) {
        setTimeout(() => showToast(newStage.unlockMessage), 100);
      } else {
        showToast(`+1 leaf — ${actionData.label}`);
      }

      return newState;
    });
  }, []);

  const logExternalAction = useCallback((action: EcoAction) => {
    logAction(action);
  }, [logAction]);

  const resetTree = useCallback(() => {
    if (confirm('Are you sure you want to reset your Eco Tree? All progress will be lost.')) {
      saveState(defaultState);
    }
  }, [saveState]);

  const renderData: TreeRenderData = useMemo(() => {
    return generateTreeRenderData(state.totalLeaves);
  }, [state.totalLeaves]);

  const stageProgress = useMemo(() => getStageProgress(state.totalLeaves), [state.totalLeaves]);
  const leavesToNext = useMemo(() => getLeavesToNextStage(state.totalLeaves), [state.totalLeaves]);

  return {
    treeState: state,
    renderData,
    stageProgress,
    leavesToNext,
    logAction,
    logExternalAction,
    resetTree,
    recentHistory: state.history.slice(0, 10),
    toastMessage
  };
}
