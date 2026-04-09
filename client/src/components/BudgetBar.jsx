import { useState } from 'react';
import { api } from '../api.js';

export function BudgetBar({ month, budget, spent, onBudgetUpdated }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const remaining = (budget || 0) - spent;

  async function handleSave() {
    const amount = parseFloat(value);
    if (isNaN(amount) || amount < 0) return setError('Enter a valid amount');
    try {
      const updated = await api.setBudget(month, amount);
      onBudgetUpdated(updated.amount);
      setEditing(false);
      setError('');
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div aria-label="Budget section">
      <h3>Budget for {month}</h3>
      <p aria-label="Budget amount">Budget: ${(budget || 0).toFixed(2)}</p>
      <p aria-label="Amount spent">Spent: ${spent.toFixed(2)}</p>
      <p aria-label="Amount remaining">Remaining: ${remaining.toFixed(2)}</p>
      {!editing && (
        <button type="button" onClick={() => { setValue(String(budget || '')); setEditing(true); }}>
          Set budget
        </button>
      )}
      {editing && (
        <div>
          <input
            type="number"
            step="0.01"
            min="0"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            aria-label="Budget amount input"
          />
          <button type="button" onClick={handleSave}>Save</button>
          <button type="button" onClick={() => setEditing(false)}>Cancel</button>
          {error && <span role="alert">{error}</span>}
        </div>
      )}
    </div>
  );
}
