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
      setNewName('');
      setAdding(false);
      setError('');
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div>
      <select value={value} onChange={(e) => onChange(e.target.value)} required>
        <option value="">Select category</option>
        {categories.map((c) => (
          <option key={c.id} value={String(c.id)}>
            {c.name}
          </option>
        ))}
      </select>
      {!adding && (
        <button type="button" onClick={() => setAdding(true)}>
          + Add category
        </button>
      )}
      {adding && (
        <div>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New category name"
            aria-label="New category name"
          />
          <button type="button" onClick={handleAdd}>Save</button>
          <button type="button" onClick={() => { setAdding(false); setError(''); }}>Cancel</button>
          {error && <span role="alert">{error}</span>}
        </div>
      )}
    </div>
  );
}
