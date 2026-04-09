import { api } from '../api.js';

export function ReceiptViewer({ expense, onClose }) {
  if (!expense) return null;

  return (
    <div role="dialog" aria-label="Receipt viewer" aria-modal="true">
      <h3>Receipt — {expense.description || expense.category_name}</h3>
      <img
        src={api.receiptUrl(expense.receipt_path)}
        alt="Receipt"
        style={{ maxWidth: '100%' }}
      />
      <button type="button" onClick={onClose}>Close</button>
    </div>
  );
}
