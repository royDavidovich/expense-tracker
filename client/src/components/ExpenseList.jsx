const TAG_COLORS = [
  { bg: 'rgba(74,125,196,0.15)', color: '#7aa5d4' },
  { bg: 'rgba(74,158,105,0.15)', color: '#72b88a' },
  { bg: 'rgba(196,120,74,0.15)', color: '#d4936a' },
  { bg: 'rgba(158,74,125,0.15)', color: '#c47aaa' },
  { bg: 'rgba(74,144,196,0.15)', color: '#7ab4d4' },
  { bg: 'rgba(196,168,74,0.15)', color: '#d4c06a' },
];

function tagStyle(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
  return TAG_COLORS[h % TAG_COLORS.length];
}

function fmtDate(str) {
  const [y, m, d] = str.split('-');
  return new Date(+y, +m - 1, +d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function ExpenseList({ expenses, month, onSelectExpense }) {
  const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const [y, m] = (month || '').split('-');
  const label = month ? new Date(+y, +m - 1).toLocaleDateString('en-US', { month: 'long' }) : 'Expenses';

  return (
    <div className="card expense-list" style={{ marginTop: 16 }}>
      <div className="expense-list__header">
        <p className="section-title" style={{ border: 'none', padding: 0, margin: 0 }}>{label} Expenses</p>
        {expenses.length > 0 && (
          <span className="expense-list__total" aria-label="Running total">${total.toFixed(2)}</span>
        )}
      </div>
      {expenses.length === 0
        ? <p className="expense-list__empty">No expenses this month.</p>
        : (
          <ul className="expense-items">
            {expenses.map((e, i) => {
              const ts = tagStyle(e.category_name || '');
              return (
                <li key={e.id} className="expense-item" style={{ '--i': i }}>
                  <span className="expense-item__date">{fmtDate(e.date)}</span>
                  <span className="expense-tag" style={{ background: ts.bg, color: ts.color }}>
                    {e.category_name}
                  </span>
                  <span className="expense-item__desc">{e.description}</span>
                  <span className="expense-item__amount">${parseFloat(e.amount).toFixed(2)}</span>
                  {e.receipt_path
                    ? <button type="button" className="receipt-btn" onClick={() => onSelectExpense(e)} aria-label="View receipt">📎</button>
                    : <span />}
                </li>
              );
            })}
          </ul>
        )}
    </div>
  );
}
