import { api } from '../api.js';

export function ReceiptViewer({ expense, onClose }) {
  if (!expense) return null;
  return (
    <div className="receipt-overlay" role="dialog" aria-modal="true" aria-label="Receipt viewer" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="receipt-modal">
        <div className="receipt-modal__header">
          <span className="receipt-modal__title">{expense.description || expense.category_name}</span>
          <button type="button" className="receipt-modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="receipt-modal__body">
          <img className="receipt-modal__image" src={api.receiptUrl(expense.receipt_path)} alt="Receipt" />
        </div>
      </div>
    </div>
  );
}
