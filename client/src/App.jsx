import { useState, useEffect, useCallback } from 'react';
import { api } from './api.js';
import { ExpenseForm } from './components/ExpenseForm.jsx';
import { ExpenseList } from './components/ExpenseList.jsx';
import { BudgetBar } from './components/BudgetBar.jsx';
import { ReceiptViewer } from './components/ReceiptViewer.jsx';

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export default function App() {
  const [month, setMonth] = useState(currentMonth);
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(0);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [serverError, setServerError] = useState(false);

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
      <p role="alert">
        Server not running. Start the backend on port 3001 and refresh.
      </p>
    );
  }

  return (
    <div>
      <h1>Expense Tracker</h1>

      <div>
        <button type="button" onClick={() => changeMonth(-1)}>&#8249;</button>
        <span aria-label="Current month">{month}</span>
        <button type="button" onClick={() => changeMonth(1)}>&#8250;</button>
      </div>

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
