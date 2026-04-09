# Expense Tracker

A personal offline web app for tracking day-to-day expenses, with monthly budget tracking and receipt photo capture.

## Features

- Add expenses with amount, category, description, date, and optional receipt image
- Monthly budget with an animated progress bar (gold → amber → red as you approach the limit)
- Navigate between months to review past spending
- Attach and view receipt photos
- Dark / light theme toggle — *Obsidian Ledger* and *Aged Parchment*
- All data stored locally — no accounts, no cloud, no tracking

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | SQLite via `better-sqlite3` |
| Testing | Playwright (E2E) |

## Running locally

```bash
# Backend (from /server)
npm install
npm run dev

# Frontend (from /client)
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies API calls to the backend on port `3001`.

## Running tests

```bash
# From /tests
npx playwright test
```

Playwright auto-starts both server and client before the test suite runs.

---

## About this project

This was a fun little side project — an excuse to build something real while trying out new Claude Code skills and plugins, including the `frontend-design` skill for the UI redesign and the `superpowers` plugin for structured, plan-driven development.

The app itself is intentionally simple: single user, fully offline, no auth. Just a clean tool for keeping an eye on where the money goes.
