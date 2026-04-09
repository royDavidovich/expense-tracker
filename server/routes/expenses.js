import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = Router();

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

router.get('/', (req, res) => {
  const { month } = req.query;
  let query = `
    SELECT e.*, c.name as category_name
    FROM expenses e
    JOIN categories c ON e.category_id = c.id
  `;
  const params = [];
  if (month) {
    query += ` WHERE strftime('%Y-%m', e.date) = ?`;
    params.push(month);
  }
  query += ` ORDER BY e.date DESC, e.created_at DESC`;
  const expenses = db.prepare(query).all(...params);
  res.json(expenses);
});

router.get('/:id', (req, res) => {
  const expense = db.prepare(`
    SELECT e.*, c.name as category_name
    FROM expenses e
    JOIN categories c ON e.category_id = c.id
    WHERE e.id = ?
  `).get(req.params.id);
  if (!expense) return res.status(404).json({ error: 'Not found' });
  res.json(expense);
});

router.post('/', upload.single('receipt'), (req, res) => {
  const { amount, category_id, description, date } = req.body;
  if (!amount || !category_id || !date) {
    return res.status(400).json({ error: 'amount, category_id, and date are required' });
  }
  const receipt_path = req.file ? req.file.filename : null;
  const result = db.prepare(`
    INSERT INTO expenses (amount, category_id, description, date, receipt_path)
    VALUES (?, ?, ?, ?, ?)
  `).run(parseFloat(amount), parseInt(category_id), description || null, date, receipt_path);
  const expense = db.prepare(`
    SELECT e.*, c.name as category_name
    FROM expenses e
    JOIN categories c ON e.category_id = c.id
    WHERE e.id = ?
  `).get(result.lastInsertRowid);
  res.status(201).json(expense);
});

router.use((err, req, res, next) => {
  if (err.message === 'Only image files are allowed') {
    return res.status(400).json({ error: err.message });
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large. Max 5MB.' });
  }
  next(err);
});

export default router;
