export const CHALLENGE_POOL = [
  { id: 'c1', title: 'No Car Friday' },
  { id: 'c2', title: 'Energy Saver Week' },
  { id: 'c3', title: 'Plant-Based Day' },
  { id: 'c4', title: 'Zero Waste Day' },
  { id: 'c5', title: 'Walk to Work' },
  { id: 'c6', title: 'Unplug Electronics Overnight' },
  { id: 'c7', title: 'Cold Wash Laundry' },
  { id: 'c8', title: 'Bring Reusable Bags to Grocery' },
  { id: 'c9', title: 'Meatless Monday' },
  { id: 'c10', title: 'Take a 5-Minute Shower' },
  { id: 'c11', title: 'Use Public Transit Once' },
  { id: 'c12', title: 'Buy Local Produce' },
  { id: 'c13', title: 'Air Dry Clothes' },
  { id: 'c14', title: 'Turn Off Lights When Leaving Room' },
  { id: 'c15', title: 'Use a Reusable Water Bottle' },
  { id: 'c16', title: 'Compost Food Scraps' },
  { id: 'c17', title: 'Skip the Straw' },
  { id: 'c18', title: 'Carpool with a Friend/Colleague' },
  { id: 'c19', title: 'Adjust Thermostat by 2 Degrees' },
  { id: 'c20', title: 'Fix a Leaky Faucet' }
];

// Helper to get 5 random challenges
export const getRandomChallenges = (count: number = 5) => {
  const shuffled = [...CHALLENGE_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
