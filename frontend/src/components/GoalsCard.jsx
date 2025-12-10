import React from 'react';

export default function GoalsCard({goal}){
  const progress = goal.targetAmount ? (goal.savedAmount/goal.targetAmount)*100 : 0;
  return (
    <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg shadow-md backdrop-blur-md">
      <h3 className="text-lg font-semibold">{goal.name}</h3>
      <p className="text-sm">Saved: {goal.savedAmount} / {goal.targetAmount}</p>
      <div className="w-full bg-gray-200 h-2 rounded mt-2">
        <div className="bg-green-500 h-2 rounded" style={{width: `${Math.min(100, progress)}%`}} />
      </div>
    </div>
  )
}
