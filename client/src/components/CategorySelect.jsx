import { useState } from 'react';
import { api } from '../api.js';

export function CategorySelect({ categories, value, onChange, onCategoryAdded }) {
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');

  async function handleAdd() {
    const name = newName.trim();
    if (!name) return setError('Name is required');
    try {
      const category = await api.addCategory(name);
      onCategoryAdded(category);
      onChange(String(category.id));
      setNewName(''); setAdding(false); setError('');
    } catch (e) { setError(e.message); }
  }

  return (
    <div className="category-select">
      <select className="form-input" value={value} onChange={(e) => onChange(e.target.value)} required>
        <option value="">Select category</option>
        {categories.map((c) => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
      </select>
      {!adding && <button type="button" className="btn-link" onClick={() => setAdding(true)}>+ new category</button>}
      {adding && (
        <div className="category-add-row">
          <input className="form-input" value={newName} onChange={(e) => setNewName(e.target.value)}
            placeholder="Category name" aria-label="New category name" autoFocus />
          <button type="button" className="btn btn-primary" onClick={handleAdd}>Add</button>
          <button type="button" className="btn btn-ghost" onClick={() => { setAdding(false); setError(''); }}>✕</button>
        </div>
      )}
      {error && <span role="alert">{error}</span>}
    </div>
  );
}
