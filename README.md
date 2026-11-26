# ProLinker

Connects customers in Pakistan with skilled and unskilled workers: plumbers, electricians, carpenters, painters, AC technicians, cleaners, masons and labourers.

> **Current focus: UI first.** The Express API and Supabase schema were removed to build the frontend first. The full backend is preserved in git: `git checkout backup-phase1-full -- server supabase` restores it.

| Package  | Stack                                                                                     |
| -------- | ----------------------------------------------------------------------------------------- |
| `client` | React 18, Vite 8, TypeScript, Tailwind CSS, React Router, TanStack Query, i18next (EN/UR) |
| `shared` | Zod schemas, enums and types shared across the app                                        |

## Setup

```bash
npm install                                  # always from the repo root
cp client/.env.example client/.env.local     # Supabase URL + publishable key
npm run dev                                  # http://localhost:5173
```

## Commands

| Command             | What it does                  |
| ------------------- | ----------------------------- |
| `npm run dev`       | Start the web app on :5173    |
| `npm run build`     | Production build              |
| `npm run lint`      | ESLint (strict, type-aware)   |
| `npm run typecheck` | `tsc` across all packages     |
| `npm run check`     | Format check, lint, typecheck |
