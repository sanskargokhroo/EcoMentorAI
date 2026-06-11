export type EcoAction =
  | 'walk'
  | 'cycle'
  | 'vegetarian'
  | 'vegan'
  | 'save_power'
  | 'recycle'
  | 'public_transport'
  | 'challenge_complete'
  | 'calculator_entry'
  | 'ai_recommendation_followed';

export interface TreeStage {
  name: string;
  minLeaves: number;
  nextLeaves: number;
  description: string;
  unlockMessage: string;
}

export interface LeafEntry {
  id: string;
  action: EcoAction;
  label: string;
  co2Saved: number;
  timestamp: number;
  leafIndex: number;
}

export interface TreeState {
  totalLeaves: number;
  totalCO2Saved: number;
  currentStage: TreeStage;
  streak: number;
  lastActionDate: string | null;
  history: LeafEntry[];
  badges: string[];
}

export interface BranchData {
  x1: number; y1: number;
  x2: number; y2: number;
  width: number;
  depth: number;
}

export interface LeafData {
  id: string;
  cx: number; cy: number;
  rx: number; ry: number;
  rotation: number;
  color: string;
  opacity: number;
}

export interface FruitData {
  cx: number; cy: number;
  r: number;
  color: string;
}

export interface TreeRenderData {
  trunk: { x: number; y: number; width: number; height: number };
  branches: BranchData[];
  leaves: LeafData[];
  fruits: FruitData[];
  flowers: FruitData[];
}
