# CLAUDE.md

This file provides Claude with context about this project. Update each section as your project evolves.

---

## Project Overview

**Project Name:** expense-tracker
**Description:** A personal offline web app to track day-to-day expenses, with monthly budget tracking and receipt photo capture. Single user.
**Status:** In progress

---

## Tech Stack

**Frontend:** React (Vite)
**Backend:** Node/Express
**Database:** SQLite via `better-sqlite3`
**Auth:** None
**Hosting:** Local only (offline)
**Other tools/services:** Playwright (E2E testing)

---

## Project Structure

```
expense-tracker/
├── client/          # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   └── App.jsx
│   └── vite.config.js
├── server/          # Express + SQLite backend
│   ├── uploads/     # Receipt image files
│   ├── db.js        # SQLite setup & migrations
│   ├── routes/      # categories, expenses, budgets
│   └── index.js
├── tests/           # Playwright E2E tests
└── docs/
    └── superpowers/
        └── specs/   # Design documents
```

---

## Dev Commands

```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd client && npm install

# Start backend (from server/)
npm run dev

# Start frontend (from client/)
npm run dev

# Run Playwright tests
npx playwright test
```

---

## Environment Variables

None required — fully local/offline.

---

## Conventions & Preferences

**Language:** JavaScript ES modules
**Styling:** TBD during implementation
**Component style:** Functional components only
**State management:** TBD during implementation
**API style:** REST
**Linting/formatting:** TBD during implementation
**Testing:** Playwright (E2E only)

---

## Key Files & Directories

- `server/db.js` — SQLite setup, schema migrations, seed data
- `server/routes/` — Express route handlers (categories, expenses, budgets)
- `server/uploads/` — Receipt image files (not committed to git)
- `client/src/components/` — React UI components
- `docs/superpowers/specs/2026-04-09-expense-tracker-design.md` — Full design spec

---

## External Integrations

None.

---

## Current Goals

Implement the expense tracker per the design spec at `docs/superpowers/specs/2026-04-09-expense-tracker-design.md`.

The implementation plan is at `docs/superpowers/plans/2026-04-09-expense-tracker.md` (19 tasks total). Use the `superpowers:subagent-driven-development` skill to continue execution.

**Progress as of 2026-04-09:**
- All 19 tasks complete. Full implementation done: Express backend, React frontend, 4 Playwright E2E tests passing (4/4).
- The app is fully functional and ready to use.

---

## Known Issues / Tech Debt

None yet.

---

## What NOT to Do

- Do not add multi-user support or auth — this is a single-user app
- Do not add cloud sync — offline only for now
- Do not add CSV import/export — out of scope for now
- Do not store receipt images in the database — use the filesystem (`server/uploads/`)

---

## Notes for Claude

- Prefer small, focused changes over large rewrites
- Always explain tradeoffs when suggesting architectural changes
- Default seed categories: Food, Transport, Housing, Health, Entertainment, Infrastructure, Other
- Categories are stored in the DB and user can add new ones from the UI
- The plan prescribes exact code for each component — follow it; don't redesign
- `client/src/api.js` is the single place for all fetch calls — components never call fetch directly
- The Playwright test runner lives in `tests/` (its own package.json); run tests from there with `npx playwright test`
- `tests/playwright.config.js` uses `webServer` to auto-start both server and client before tests
