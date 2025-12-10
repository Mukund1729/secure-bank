import React from 'react';

export default function BudgetCard({budget}) {
  return (
    <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg shadow-md backdrop-blur-md">
      <h3 className="text-lg font-semibold">{budget.category}</h3>
      <p className="text-sm">Budget: {(budget.amountCents/100).toFixed(2)}</p>
      <p className="text-sm">Spent: {(budget.spentCents/100).toFixed(2)}</p>
    </div>
  );
}
