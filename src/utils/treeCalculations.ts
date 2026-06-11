import { TreeStage, LeafEntry, TreeState, TreeRenderData, BranchData, LeafData, FruitData } from '../types/tree.types';
import { TREE_STAGES } from '../constants/treeStages';

/**
 * Returns current TreeStage object based on leaf count
 */
export function getStageFromLeaves(leaves: number): TreeStage {
  for (let i = TREE_STAGES.length - 1; i >= 0; i--) {
    if (leaves >= TREE_STAGES[i].minLeaves) {
      return TREE_STAGES[i];
    }
  }
  return TREE_STAGES[0];
}

/**
 * Returns progress percentage (0-100) within current stage
 */
export function getStageProgress(leaves: number): number {
  const currentStage = getStageFromLeaves(leaves);
  if (currentStage.name === 'Ancient Tree') return 100;
  
  const stageMin = currentStage.minLeaves;
  const stageMax = currentStage.nextLeaves;
  const progress = ((leaves - stageMin) / (stageMax - stageMin)) * 100;
  
  return Math.min(100, Math.max(0, Math.floor(progress)));
}

/**
 * Returns leaves needed to reach next stage
 */
export function getLeavesToNextStage(leaves: number): number {
  const currentStage = getStageFromLeaves(leaves);
  if (currentStage.name === 'Ancient Tree') return 0;
  return currentStage.nextLeaves - leaves;
}

/**
 * Deterministic pseudo-random number generator (seed-based)
 * MUST use mulberry32 algorithm so tree looks same every render
 */
export function seededRandom(seed: number): () => number {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

/**
 * Returns full TreeRenderData for given leaf count
 * Generates ALL positions deterministically
 */
export function generateTreeRenderData(leafCount: number): TreeRenderData {
  const random = seededRandom(42);
  
  const data: TreeRenderData = {
    trunk: { x: 170, y: 350, width: 0, height: 0 },
    branches: [],
    leaves: [],
    fruits: [],
    flowers: []
  };

  if (leafCount === 0) {
    return data; // Seed state
  }

  // Trunk grows with leaves
  const trunkHeight = Math.min(140, 20 + leafCount * 1.5);
  const trunkWidth = Math.min(20, 4 + leafCount * 0.15);
  data.trunk = { x: 170 - trunkWidth/2, y: 350 - trunkHeight, width: trunkWidth, height: trunkHeight };

  // Branches
  const numBranches = Math.min(14, Math.floor(leafCount / 4));
  const branchEndpoints: { x: number, y: number }[] = [];
  
  for (let i = 0; i < numBranches; i++) {
    const isLeft = i % 2 === 0;
    const startY = 350 - trunkHeight * (0.3 + (i / numBranches) * 0.6);
    
    const length = 30 + random() * 40;
    const angle = isLeft ? Math.PI + (random() * 0.5) : - (random() * 0.5);
    
    const endX = 170 + Math.cos(angle) * length;
    const endY = startY + Math.sin(angle) * length - 20; // curve upwards
    
    data.branches.push({
      x1: 170, y1: startY,
      x2: endX, y2: endY,
      width: Math.max(2, trunkWidth * 0.5 - (i * 0.5)),
      depth: 1
    });
    
    branchEndpoints.push({ x: endX, y: endY });

    // Sub-branches
    if (leafCount > 20 && random() > 0.5) {
      const subLength = 15 + random() * 20;
      const subAngle = angle + (random() > 0.5 ? 0.5 : -0.5);
      const subEndX = endX + Math.cos(subAngle) * subLength;
      const subEndY = endY + Math.sin(subAngle) * subLength - 10;
      
      data.branches.push({
        x1: endX, y1: endY,
        x2: subEndX, y2: subEndY,
        width: Math.max(1, trunkWidth * 0.25),
        depth: 2
      });
      branchEndpoints.push({ x: subEndX, y: subEndY });
    }
  }

  // If no branches yet but we have leaves, add a dummy endpoint at top of trunk
  if (branchEndpoints.length === 0) {
    branchEndpoints.push({ x: 170, y: 350 - trunkHeight });
  }

  // Leaves
  const colors = ['#22c55e', '#16a34a', '#15803d', '#10b981']; // Tailwind greens
  for (let i = 0; i < leafCount; i++) {
    const endpoint = branchEndpoints[Math.floor(random() * branchEndpoints.length)];
    const offsetX = (random() - 0.5) * 40;
    const offsetY = (random() - 0.5) * 40;
    
    data.leaves.push({
      id: `leaf-${i}`,
      cx: endpoint.x + offsetX,
      cy: endpoint.y + offsetY,
      rx: 6 + random() * 4,
      ry: 3 + random() * 2,
      rotation: random() * 360,
      color: colors[Math.floor(random() * colors.length)],
      opacity: 0.8 + random() * 0.2
    });
  }

  // Fruits (50+ leaves)
  if (leafCount >= 50) {
    const numFruits = Math.floor((leafCount - 40) / 10);
    for (let i = 0; i < numFruits; i++) {
      const endpoint = branchEndpoints[Math.floor(random() * branchEndpoints.length)];
      data.fruits.push({
        cx: endpoint.x + (random() - 0.5) * 20,
        cy: endpoint.y + (random() - 0.5) * 20,
        r: 4 + random() * 2,
        color: '#ef4444' // red-500
      });
    }
  }

  // Flowers (75+ leaves)
  if (leafCount >= 75) {
    const numFlowers = Math.floor((leafCount - 60) / 8);
    for (let i = 0; i < numFlowers; i++) {
      const endpoint = branchEndpoints[Math.floor(random() * branchEndpoints.length)];
      data.flowers.push({
        cx: endpoint.x + (random() - 0.5) * 30,
        cy: endpoint.y + (random() - 0.5) * 30,
        r: 3 + random() * 1.5,
        color: '#fdf4ff' // fuchsia-50
      });
    }
  }

  return data;
}

/**
 * Returns true if user has maintained streak (action logged on consecutive days)
 */
export function calculateStreak(history: LeafEntry[]): number {
  if (history.length === 0) return 0;
  
  // Sort descending by timestamp
  const sorted = [...history].sort((a, b) => b.timestamp - a.timestamp);
  
  let currentStreak = 1;
  let currentDate = new Date(sorted[0].timestamp);
  currentDate.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // If last action was before yesterday, streak is lost (0)
  const daysSinceLastAction = Math.floor((today.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
  if (daysSinceLastAction > 1) {
    return 0; // Streak broken
  }
  
  for (let i = 1; i < sorted.length; i++) {
    const prevDate = new Date(sorted[i].timestamp);
    prevDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      currentStreak++;
      currentDate = prevDate;
    } else if (diffDays > 1) {
      break; // Streak broken here
    }
    // If diffDays === 0, it's the same day, continue checking previous entries
  }
  
  return currentStreak;
}

/**
 * Returns array of badge names earned for given leaf count + history
 */
export function calculateBadges(state: TreeState): string[] {
  const badges = new Set<string>();
  
  if (state.totalLeaves >= 50) badges.add('Half Century');
  if (state.totalLeaves >= 100) badges.add('Centurion');
  
  if (state.streak >= 3) badges.add('3-Day Streak');
  if (state.streak >= 7) badges.add('Weekly Warrior');
  
  const veganCount = state.history.filter(h => h.action === 'vegan').length;
  if (veganCount >= 5) badges.add('Plant Powered');
  
  const cycleCount = state.history.filter(h => h.action === 'cycle').length;
  if (cycleCount >= 5) badges.add('Tour de Carbon');
  
  return Array.from(badges);
}
