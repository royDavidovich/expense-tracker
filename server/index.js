import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import categoriesRouter from './routes/categories.js';
import expensesRouter from './routes/expenses.js';
import budgetsRouter from './routes/budgets.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/categories', categoriesRouter);
app.use('/expenses', expensesRouter);
app.use('/budgets', budgetsRouter);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
