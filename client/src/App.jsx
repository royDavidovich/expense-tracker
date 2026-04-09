import { useState, useEffect, useCallback } from 'react';
import { api } from './api.js';
import { ExpenseForm } from './components/ExpenseForm.jsx';
import { ExpenseList } from './components/ExpenseList.jsx';
import { BudgetBar } from './components/BudgetBar.jsx';
import { ReceiptViewer } from './components/ReceiptViewer.jsx';
import './App.css';

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function formatMonth(month) {
  const [y, m] = month.split('-');
  return new Date(+y, +m - 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

export default function App() {
  const [month, setMonth] = useState(currentMonth);
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(0);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [serverError, setServerError] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const loadData = useCallback(async () => {
    try {
      const [cats, exps, bud] = await Promise.all([
        api.getCategories(),
        api.getExpenses(month),
        api.getBudget(month),
      ]);
      setCategories(cats);
      setExpenses(exps);
      setBudget(bud.amount || 0);
      setServerError(false);
    } catch (e) {
      if (e.message === 'SERVER_UNREACHABLE') setServerError(true);
    }
  }, [month]);

  useEffect(() => { loadData(); }, [loadData]);

  function handleExpenseAdded(expense) {
    setExpenses((prev) => [expense, ...prev]);
  }

  function handleCategoryAdded(category) {
    setCategories((prev) =>
      [...prev, category].sort((a, b) => a.name.localeCompare(b.name))
    );
  }

  const spent = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  function changeMonth(delta) {
    const [y, m] = month.split('-').map(Number);
    const d = new Date(y, m - 1 + delta);
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }

  if (serverError) {
    return (
      <div className="server-error">
        <p role="alert">Server not running. Start the backend on port 3001 and refresh.</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-title-group">
          <h1 className="app-title">Expense Tracker</h1>
          <span className="app-eyebrow">personal ledger</span>
        </div>
        <button
          type="button"
          className="theme-toggle"
          onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
          data-light={String(theme === 'light')}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          <span className="theme-toggle__icon theme-toggle__icon--moon">☽</span>
          <span className="theme-toggle__thumb" aria-hidden="true" />
          <span className="theme-toggle__icon theme-toggle__icon--sun">☀</span>
        </button>
        <nav className="month-nav" aria-label="Month navigation">
          <button
            type="button"
            className="month-nav__btn"
            onClick={() => changeMonth(-1)}
            aria-label="Previous month"
          >
            ←
          </button>
          <span className="month-nav__label" aria-label="Current month">
            {formatMonth(month)}
          </span>
          <button
            type="button"
            className="month-nav__btn"
            onClick={() => changeMonth(1)}
            aria-label="Next month"
          >
            →
          </button>
        </nav>
      </header>

      <BudgetBar
        month={month}
        budget={budget}
        spent={spent}
        onBudgetUpdated={(amount) => setBudget(amount)}
      />

      <ExpenseForm
        categories={categories}
        onExpenseAdded={handleExpenseAdded}
        onCategoryAdded={handleCategoryAdded}
      />

      <ExpenseList
        expenses={expenses}
        month={month}
        onSelectExpense={setSelectedExpense}
      />

      {selectedExpense && (
        <ReceiptViewer
          expense={selectedExpense}
          onClose={() => setSelectedExpense(null)}
        />
      )}
    </div>
  );
}
