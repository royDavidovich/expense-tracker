import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/:month', (req, res) => {
  const budget = db.prepare('SELECT * FROM budgets WHERE month = ?').get(req.params.month);
  if (!budget) return res.json({ month: req.params.month, amount: 0 });
  res.json(budget);
});

router.put('/:month', (req, res) => {
  const { amount } = req.body;
  if (amount === undefined || isNaN(parseFloat(amount))) {
    return res.status(400).json({ error: 'amount is required and must be a number' });
  }
  db.prepare(`
    INSERT INTO budgets (month, amount) VALUES (?, ?)
    ON CONFLICT(month) DO UPDATE SET amount = excluded.amount
  `).run(req.params.month, parseFloat(amount));
  const budget = db.prepare('SELECT * FROM budgets WHERE month = ?').get(req.params.month);
  res.json(budget);
});

export default router;
