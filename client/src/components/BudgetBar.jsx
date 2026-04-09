import { useState } from 'react';
import { api } from '../api.js';

function barColor(pct) {
  if (pct >= 100) return 'var(--red)';
  if (pct >= 80)  return 'var(--amber)';
  return 'var(--gold)';
}

export function BudgetBar({ month, budget, spent, onBudgetUpdated }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const remaining = (budget || 0) - spent;
  const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  const isOver = spent > budget && budget > 0;

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

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') setEditing(false);
  }

  return (
    <div className="card budget-card" aria-label="Budget section">
      <div className="budget-hero">
        <p className="budget-hero__eyebrow">spent this month</p>
        <p
          className={`budget-hero__amount${isOver ? ' is-over' : ''}`}
          aria-label="Amount spent"
        >
          ${spent.toFixed(2)}
        </p>
      </div>

      <div className="budget-progress" aria-label="Budget progress">
        <div className="budget-progress__track">
          <div
            className="budget-progress__fill"
            style={{
              width: `${pct}%`,
              backgroundColor: barColor(pct),
            }}
            role="progressbar"
            aria-valuenow={Math.round(pct)}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <div className="budget-progress__labels">
          <span>$0</span>
          <span className="budget-progress__pct">{Math.round(pct)}%</span>
          <span aria-label="Budget amount">${(budget || 0).toFixed(2)}</span>
        </div>
      </div>

      <div className="budget-stats">
        <div className="budget-stat">
          <p className="budget-stat__label">Budget</p>
          <p className="budget-stat__value" aria-label="Budget amount">
            ${(budget || 0).toFixed(2)}
          </p>
        </div>
        <div className="budget-stat">
          <p className="budget-stat__label">Remaining</p>
          <p
            className={`budget-stat__value${remaining >= 0 ? ' is-positive' : ' is-negative'}`}
            aria-label="Amount remaining"
          >
            ${remaining.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="budget-actions">
        {!editing && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setValue(budget != null ? String(budget) : '');
              setEditing(true);
            }}
          >
            Set budget
          </button>
        )}
        {editing && (
          <div className="budget-edit">
            <input
              type="number"
              step="0.01"
              min="0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="form-input"
              style={{ width: 130 }}
              aria-label="Budget amount input"
              autoFocus
            />
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              Save
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
            {error && <span role="alert">{error}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
