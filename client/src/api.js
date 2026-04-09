const BASE = 'http://localhost:3001';

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, options);
  } catch {
    throw new Error('SERVER_UNREACHABLE');
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  getCategories: () => request('/categories'),
  addCategory: (name) =>
    request('/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    }),
  getExpenses: (month) => request(`/expenses${month ? `?month=${month}` : ''}`),
  getExpense: (id) => request(`/expenses/${id}`),
  addExpense: (formData) =>
    request('/expenses', { method: 'POST', body: formData }),
  getBudget: (month) => request(`/budgets/${month}`),
  setBudget: (month, amount) =>
    request(`/budgets/${month}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    }),
  receiptUrl: (filename) => `${BASE}/uploads/${filename}`,
};
