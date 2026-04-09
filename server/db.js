import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, 'expenses.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL NOT NULL,
    category_id INTEGER NOT NULL REFERENCES categories(id),
    description TEXT,
    date TEXT NOT NULL,
    receipt_path TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS budgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    month TEXT NOT NULL UNIQUE,
    amount REAL NOT NULL
  );
`);

const seedCategories = [
  'Food', 'Transport', 'Housing', 'Health', 'Entertainment', 'Infrastructure', 'Other'
];

const insert = db.prepare('INSERT OR IGNORE INTO categories (name) VALUES (?)');
for (const name of seedCategories) {
  insert.run(name);
}

export default db;
