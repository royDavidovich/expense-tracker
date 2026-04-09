export function ExpenseList({ expenses, onSelectExpense }) {
  const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  if (expenses.length === 0) {
    return <p>No expenses this month.</p>;
  }

  return (
    <div>
      <p aria-label="Running total">
        Total: <strong>${total.toFixed(2)}</strong>
      </p>
      <ul>
        {expenses.map((e) => (
          <li key={e.id}>
            <span>{e.date}</span>
            <span>{e.category_name}</span>
            <span>{e.description}</span>
            <span>${parseFloat(e.amount).toFixed(2)}</span>
            {e.receipt_path && (
              <button type="button" onClick={() => onSelectExpense(e)}>
                View receipt
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
