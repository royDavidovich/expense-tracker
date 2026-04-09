import { useState } from 'react';
import { api } from '../api.js';
import { CategorySelect } from './CategorySelect.jsx';

export function ExpenseForm({ categories, onExpenseAdded, onCategoryAdded }) {
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [receipt, setReceipt] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const e = {};
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0)
      e.amount = 'Valid amount required';
    if (!categoryId) e.category = 'Category required';
    if (!date) e.date = 'Date required';
    if (receipt) {
      if (!receipt.type.startsWith('image/'))
        e.receipt = 'Only image files allowed';
      else if (receipt.size > 5 * 1024 * 1024)
        e.receipt = 'File too large (max 5MB)';
    }
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('amount', amount);
      formData.append('category_id', categoryId);
      formData.append('description', description);
      formData.append('date', date);
      if (receipt) formData.append('receipt', receipt);
      const expense = await api.addExpense(formData);
      onExpenseAdded(expense);
      setAmount('');
      setCategoryId('');
      setDescription('');
      setDate(new Date().toISOString().slice(0, 10));
      setReceipt(null);
      setErrors({});
    } catch (err) {
      if (err.message === 'SERVER_UNREACHABLE') {
        setErrors({ server: 'Server not running. Start the backend and try again.' });
      } else {
        setErrors({ server: err.message });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Expense</h2>
      {errors.server && <p role="alert">{errors.server}</p>}

      <label>
        Amount
        <input
          type="number"
          step="0.01"
          min="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          aria-label="Amount"
        />
        {errors.amount && <span role="alert">{errors.amount}</span>}
      </label>

      <label>
        Category
        <CategorySelect
          categories={categories}
          value={categoryId}
          onChange={setCategoryId}
          onCategoryAdded={onCategoryAdded}
        />
        {errors.category && <span role="alert">{errors.category}</span>}
      </label>

      <label>
        Description
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          aria-label="Description"
        />
      </label>

      <label>
        Date
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          aria-label="Date"
        />
        {errors.date && <span role="alert">{errors.date}</span>}
      </label>

      <label>
        Receipt (optional)
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setReceipt(e.target.files[0] || null)}
          aria-label="Receipt"
        />
        {errors.receipt && <span role="alert">{errors.receipt}</span>}
      </label>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Saving...' : 'Add Expense'}
      </button>
    </form>
  );
}
