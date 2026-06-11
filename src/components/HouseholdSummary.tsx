import React, { useState, useEffect } from 'react';

interface FamilyMember {
  id: string;
  name: string;
  co2: number;
}

interface HouseholdSummaryProps {
  primaryUserCO2: number;
  primaryUserName: string;
}

const HouseholdSummary: React.FC<HouseholdSummaryProps> = ({ primaryUserCO2, primaryUserName }) => {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCO2, setNewCO2] = useState<number | ''>('');

  useEffect(() => {
    const saved = localStorage.getItem('eco_mentor_family');
    if (saved) {
      setMembers(JSON.parse(saved));
    }
  }, []);

  const saveMembers = (newMembers: FamilyMember[]) => {
    setMembers(newMembers);
    localStorage.setItem('eco_mentor_family', JSON.stringify(newMembers));
  };

  const handleAdd = () => {
    if (!newName || !newCO2) return;
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: newName,
      co2: Number(newCO2)
    };
    saveMembers([...members, newMember]);
    setNewName('');
    setNewCO2('');
    setIsAdding(false);
  };

  const removeMember = (id: string) => {
    saveMembers(members.filter(m => m.id !== id));
  };

  const totalHouseholdCO2 = primaryUserCO2 + members.reduce((sum, m) => sum + m.co2, 0);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-md border border-gray-100 dark:border-gray-700">
      <div className={`flex justify-between items-center ${(members.length > 0 || isAdding) ? 'mb-6' : 'mb-4'}`}>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <span className="mr-2">👨‍👩‍👧‍👦</span> Household Footprint
        </h3>
        <span className="text-lg font-black text-blue-600 dark:text-blue-400">
          {totalHouseholdCO2.toFixed(1)} kg Total
        </span>
      </div>

      {members.length > 0 && (
        <div className="space-y-3 mb-6 animate-fade-in">
        {/* Primary User */}
        <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center text-sm font-bold mr-3">
              {primaryUserName ? primaryUserName[0].toUpperCase() : 'U'}
            </div>
            <span className="font-medium text-gray-800 dark:text-gray-200">{primaryUserName || 'You'} (Primary)</span>
          </div>
          <span className="font-bold text-gray-600 dark:text-gray-400">{primaryUserCO2} kg</span>
        </div>

        {/* Family Members */}
        {members.map(member => (
          <div key={member.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-bold mr-3 text-gray-600 dark:text-gray-300">
                {member.name[0].toUpperCase()}
              </div>
              <span className="font-medium text-gray-800 dark:text-gray-200">{member.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bold text-gray-600 dark:text-gray-400">{member.co2} kg</span>
              <button onClick={() => removeMember(member.id)} className="text-red-400 hover:text-red-600">×</button>
            </div>
          </div>
        ))}
        </div>
      )}

      {isAdding ? (
        <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-200 dark:border-gray-600 animate-fade-in">
          <div className="flex gap-2 mb-3">
            <input 
              type="text" 
              placeholder="Name" 
              value={newName} 
              onChange={e => setNewName(e.target.value)}
              className="flex-1 p-2 rounded border dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm"
            />
            <input 
              type="number" 
              placeholder="CO2 (kg)" 
              value={newCO2} 
              onChange={e => setNewCO2(e.target.value ? Number(e.target.value) : '')}
              className="w-24 p-2 rounded border dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-bold">Add</button>
            <button onClick={() => setIsAdding(false)} className="px-4 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 rounded-lg text-sm font-bold">Cancel</button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsAdding(true)}
          className={`w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 font-bold hover:border-blue-400 hover:text-blue-500 transition-colors ${members.length === 0 ? 'py-2 text-sm' : 'py-3'}`}
        >
          + Add Family Member
        </button>
      )}
    </div>
  );
};

export default HouseholdSummary;
