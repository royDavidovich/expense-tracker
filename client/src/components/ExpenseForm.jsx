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
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) e.amount = 'Valid amount required';
    if (!categoryId) e.category = 'Category required';
    if (!date) e.date = 'Date required';
    if (receipt) {
      if (!receipt.type.startsWith('image/')) e.receipt = 'Only image files allowed';
      else if (receipt.size > 5 * 1024 * 1024) e.receipt = 'File too large (max 5MB)';
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
      setAmount(''); setCategoryId(''); setDescription('');
      setDate(new Date().toISOString().slice(0, 10));
      setReceipt(null); setErrors({});
    } catch (err) {
      setErrors({ server: err.message === 'SERVER_UNREACHABLE' ? 'Server not running.' : err.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="card expense-form" onSubmit={handleSubmit} noValidate>
      <p className="section-title">Add Expense</p>
      {errors.server && <span role="alert">{errors.server}</span>}

      <div className="form-row">
        <div className="form-field">
          <label className="form-label">Amount</label>
          <input className="form-input" type="number" step="0.01" min="0.01"
            value={amount} onChange={(e) => setAmount(e.target.value)} aria-label="Amount" />
          {errors.amount && <span role="alert">{errors.amount}</span>}
        </div>
        <div className="form-field">
          <label className="form-label">Category</label>
          <CategorySelect categories={categories} value={categoryId}
            onChange={setCategoryId} onCategoryAdded={onCategoryAdded} />
          {errors.category && <span role="alert">{errors.category}</span>}
        </div>
        <div className="form-field">
          <label className="form-label">Date</label>
          <input className="form-input" type="date" value={date}
            onChange={(e) => setDate(e.target.value)} aria-label="Date" />
          {errors.date && <span role="alert">{errors.date}</span>}
        </div>
      </div>

      <div className="form-row form-row--full" style={{ marginBottom: 12 }}>
        <div className="form-field">
          <label className="form-label">Description</label>
          <input className="form-input" type="text" value={description}
            onChange={(e) => setDescription(e.target.value)} placeholder="optional" aria-label="Description" />
        </div>
      </div>

      <div className="form-row form-row--receipt">
        <div className="form-field form-field--grow">
          <label className="form-label">Receipt</label>
          <label className={`file-label${receipt ? ' has-file' : ''}`}>
            <span>📎</span>
            <span className="file-label__text">{receipt ? receipt.name : 'Attach image…'}</span>
            <input type="file" accept="image/*"
              onChange={(e) => setReceipt(e.target.files[0] || null)} aria-label="Receipt" />
          </label>
          {errors.receipt && <span role="alert">{errors.receipt}</span>}
        </div>
        <button type="submit" className="btn btn-primary" disabled={submitting}
          style={{ alignSelf: 'flex-end' }}>
          {submitting ? 'Saving…' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
}
