import { EcoAction, TreeStage } from '../types/tree.types';

export const TREE_STAGES: TreeStage[] = [
  { name: 'Seed', minLeaves: 0, nextLeaves: 5, description: 'Your journey begins. A seed is planted.', unlockMessage: '🌱 A new seed is planted!' },
  { name: 'Sprout', minLeaves: 5, nextLeaves: 15, description: 'Your seed has sprouted!', unlockMessage: '🌿 Your seed has sprouted!' },
  { name: 'Sapling', minLeaves: 15, nextLeaves: 30, description: 'A healthy sapling is growing.', unlockMessage: '🌳 You reached the Sapling stage!' },
  { name: 'Young Tree', minLeaves: 30, nextLeaves: 50, description: 'Your tree is strong and leafy.', unlockMessage: '🍃 Your sapling is now a Young Tree!' },
  { name: 'Grown Tree', minLeaves: 50, nextLeaves: 75, description: 'Your tree is fully grown and bearing fruit.', unlockMessage: '🍎 Your tree is Grown and bearing fruit!' },
  { name: 'Elder Tree', minLeaves: 75, nextLeaves: 100, description: 'An Elder Tree, blooming with flowers.', unlockMessage: '🌸 You have nurtured an Elder Tree!' },
  { name: 'Ancient Tree', minLeaves: 100, nextLeaves: 999999, description: 'A legendary Ancient Tree. Your impact is massive!', unlockMessage: '🌲 Amazing! You have grown an Ancient Tree!' }
];

export const ECO_ACTIONS: Record<EcoAction, { label: string; co2Saved: number; leafEmoji: string }> = {
  walk:                      { label: 'Walked instead of drove',     co2Saved: 2.1,  leafEmoji: '🚶' },
  cycle:                     { label: 'Cycled to work',              co2Saved: 3.0,  leafEmoji: '🚲' },
  vegetarian:                { label: 'Ate vegetarian today',        co2Saved: 1.5,  leafEmoji: '🥗' },
  vegan:                     { label: 'Ate vegan today',             co2Saved: 2.5,  leafEmoji: '🌱' },
  save_power:                { label: 'Saved electricity',           co2Saved: 1.0,  leafEmoji: '⚡' },
  recycle:                   { label: 'Recycled waste',              co2Saved: 0.8,  leafEmoji: '♻️' },
  public_transport:          { label: 'Used public transport',       co2Saved: 2.8,  leafEmoji: '🚌' },
  challenge_complete:        { label: 'Completed weekly challenge',  co2Saved: 5.0,  leafEmoji: '🏆' },
  calculator_entry:          { label: 'Tracked carbon footprint',    co2Saved: 0.5,  leafEmoji: '📊' },
  ai_recommendation_followed:{ label: 'Followed AI recommendation',  co2Saved: 1.2,  leafEmoji: '🤖' },
};
