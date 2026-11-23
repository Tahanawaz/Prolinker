# ProLinker

Connects customers in Pakistan with skilled and unskilled workers: plumbers, electricians, carpenters, painters, AC technicians, cleaners, masons and labourers.

| Package    | Stack                                                                                     |
| ---------- | ----------------------------------------------------------------------------------------- |
| `client`   | React 18, Vite 8, TypeScript, Tailwind CSS, React Router, TanStack Query, i18next (EN/UR) |
| `server`   | Node 20+, Express 5, TypeScript, Zod, Helmet, CORS, express-rate-limit, pino              |
| `shared`   | Zod schemas, enums, API contract and DB types used by both apps                           |
| `supabase` | SQL migrations, RLS policies, storage buckets, seed data, RLS smoke test                  |

## Prerequisites

- Node.js **20.11+** (see `.nvmrc`)
- A Supabase project (free tier works). Docker is only needed for a fully local Supabase stack.

## First-time setup

```bash
npm install

# 1. Environment files (never commit the real ones)
cp server/.env.example server/.env
cp client/.env.example client/.env.local
#    Fill both from Supabase → Project Settings → API.
#    The service-role/secret key goes ONLY in server/.env.

# 2. Apply the database (hosted project)
npx supabase login
npx supabase link --project-ref <your-project-ref>
npm run db:push:seed          # migrations + categories + bonus rules

#    Alternative without the CLI: run every file in supabase/migrations/ in order
#    in the Supabase SQL editor, then supabase/seed.sql.

# 3. Verify security policies
#    Paste supabase/tests/rls_smoke_test.sql into the SQL editor and run it.
#    Expect: NOTICE "ALL RLS SMOKE TESTS PASSED" (it rolls everything back).

# 4. Demo accounts (customer / worker / admin)
#    Set SEED_DEMO_PASSWORD in server/.env first (12+ chars, upper, lower, digit).
npm run seed:users

# 5. Regenerate DB types from the live schema (optional, recommended)
npm run db:types
```

## Daily commands

| Command             | What it does                                   |
| ------------------- | ---------------------------------------------- |
| `npm run dev`       | API on :4000 and web on :5173 (proxied `/api`) |
| `npm run lint`      | ESLint (strict, type-aware)                    |
| `npm run typecheck` | `tsc` across all packages                      |
| `npm test`          | API tests (Vitest + Supertest)                 |
| `npm run build`     | Production builds of server and client         |
| `npm run check`     | Format check, lint, typecheck and test         |

## Architecture at a glance

- **Auth:** browser ↔ Supabase Auth directly (anon key). The API verifies the access token locally (JWKS, or HS256 secret on legacy projects). It then loads the role from `profiles`, never from the token.
- **API layering:** `routes → controller (handler + Zod) → service → repository (Supabase)`.
- **Two DB clients:**
  - Per-request **user client**, so RLS still applies.
  - **Service-role client**, used only for trusted server operations.
- **Money and state changes** happen in Postgres functions (`transition_booking`, `complete_payment`, `review_fund_request`). They are atomic, row-locked, and executable only by the service role. Commission is computed from `platform_settings`, never from client input.
- **Database is deny-by-default:**
  - Clients get column-scoped GRANTs plus RLS on every table.
  - Triggers stop role escalation, worker self-verification, invalid booking transitions, and edits to paid payments or the fund ledger.
- **Responses:** always `{ success, data, error }` with stable error codes and a request id.

See `supabase/migrations/` for the full schema, policies and comments.
