# Doc Cycle Base Stack Transfer Guide

The goal of this document is to capture the reusable configuration patterns from Doc Cycle App so you can reproduce the same foundation in a fresh Next.js project.

## 1. Stack Snapshot
- **Runtime / Framework**: Next.js 15 App Router with React 19 (`package.json`).
- **Database Layer**: PostgreSQL + Drizzle ORM with dual Neon/local connectivity (`src/db/db.ts`).
- **Authentication**: BetterAuth wired to Google OAuth (`src/lib/auth.ts`, `src/app/api/auth/[...all]/route.ts`).
- **Styling**: Tailwind CSS v4 (PostCSS plugin) + shadcn/ui + custom design tokens (`src/app/globals.css`).
- **Tooling**: Biome for lint/format, tsx for scripts, Docker Compose for local Postgres, dotenv-based env loader.

## 2. Package Baseline (copy into new `package.json`)

| Purpose | Packages |
| --- | --- |
| Next.js / React | `next@15.4.6`, `react@19.1.0`, `react-dom@19.1.0` |
| Database | `drizzle-orm@0.44.4`, `postgres@3.4.7`, `@neondatabase/serverless@1.0.1`, `dotenv@17.2.1` |
| Authentication | `better-auth@1.3.6` |
| UI & State | `jotai@2.13.1`, `@radix-ui/react-*`, `class-variance-authority`, `clsx`, `lucide-react`, `react-dropzone`, `tailwind-merge` |
| Tooling (dev) | `drizzle-kit@0.31.4`, `@biomejs/biome@2.2.0`, `tsx@4.20.4`, `typescript@5.x`, `@tailwindcss/postcss@^4`, `tailwindcss@^4.1.12`, `@types/*`, `tw-animate-css` |

Replicate the script section as-is to retain the DX helpers (DB commands, linting, setup automation).

## 3. Environment Bootstrap
- Load environment files on import via `src/lib/env.ts`: prioritize `.env.local`, then mode-specific (`.env.development` / `.env.production`), then fall back to `.env`.
- Provide `.env.local` with BetterAuth + Google + database secrets (see sample in `CLAUDE.md` and `.env.production.example`).
- Extend TypeScript env typings in `types/env.d.ts` for stricter checks.

## 4. Drizzle ORM Setup
1. **CLI config** (`drizzle.config.ts`):
   - Pulls `.env.local` / `.env` before config.
   - Points `schema` to `./src/db/schema.ts` and outputs generated SQL to `./drizzle`.
   - Enables `verbose` + `strict` for safety.
2. **Runtime client** (`src/db/db.ts`):
   - Detects Neon URLs and swaps between `neon-serverless` pool and `postgres` client automatically.
   - Exposes both `db` (ORM client) and `migrationClient` for CLI usage.
3. **Schema organization** (`src/db/schema.ts`):
   - Separate tables for BetterAuth (`users`, `sessions`, `accounts`, `verifications`) and domain entities (`equipments`, schedules, logs, todos).
   - Use Drizzle `relations` helpers and `.$defaultFn` for timestamps.
4. **Utilities**:
   - `src/db/health.ts` + `src/db/utils.ts` for connection checks and diagnostics.
   - `src/db/seed.ts` seeds sample users/equipment and doubles as a template for new domains.

When cloning this setup, keep the same directory layout (`src/db/*`) and reuse the CLI scripts (`npm run db:*`).

## 5. Database Tooling & Local Infra
- **Docker Compose** (`docker-compose.yml`): Postgres 16-alpine with healthcheck, init SQL drop-in directory (`docker/postgres/01-init.sql`), named volume & network.
- **One-shot setup script** (`scripts/setup-dev.sh`): boots Docker, waits, runs health check (`src/db/health.ts` via `tsx`), pushes schema, seeds data.
- **NPM scripts** (`package.json`): `docker:*`, `db:push`, `db:migrate`, `db:studio`, `db:seed`, `db:setup`, etc. Port them to keep parity across projects.

## 6. BetterAuth + Google OAuth Integration
1. **Server config** (`src/lib/auth.ts`):
   - Wraps Drizzle adapter with Postgres schema mappings.
   - Enables only Google as a social provider (email/password disabled) and sets 7-day rolling sessions.
2. **API route bridge** (`src/app/api/auth/[...all]/route.ts`):
   - Exposes BetterAuth to Next.js via `toNextJsHandler` GET/POST handlers.
3. **Client utilities** (`src/lib/auth-client.ts`):
   - Creates BetterAuth React client, re-exporting `signIn`, `signOut`, `useSession` hooks.
4. **Middleware guard** (`src/middleware.ts`):
   - Checks BetterAuth cookie variants, redirects unauthenticated users to `/login`, respects `callbackUrl` param, and whitelists public routes.
5. **Login and test pages** (`src/app/login/page.tsx`, `src/app/auth-test/page.tsx`):
   - Client-side components using `authClient.signIn.social` and `useSession` for UX.
6. **Environment variables**:
   - `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `DATABASE_URL`.
   - Google Console settings documented in `GOOGLE_OAUTH_SETUP.md` (origins, redirect URIs, scopes).

## 7. Next.js App Shell & Styling
- **Layout** (`src/app/layout.tsx`): registers Geist font pairings and applies Tailwind tokens.
- **Global styles** (`src/app/globals.css`): Tailwind v4 directives, animation plugin import, CSS custom properties for light/dark palettes, generic `@layer base` resets.
- **Config** (`next.config.ts`): allow Google profile images via `lh3.googleusercontent.com` remote pattern.
- **TypeScript** (`tsconfig.json`): strict mode, `@/*` path alias, `moduleResolution: bundler`.
- **PostCSS** (`postcss.config.mjs`): single Tailwind v4 plugin entry.

## 8. State & UI Practices (from `CLAUDE.md`)
- Treat Jotai as the global client-state layer for UI toggles, multi-step form buffers, filters, and notifications.
- Organize atoms per feature file (`src/store/ui.ts`, `src/store/filters.ts`, …) rather than monolithic state blobs.
- Keep auth state inside BetterAuth (`authClient.useSession()`), and fetch server data with dedicated data-fetching tools instead of Jotai.
- Prefer shadcn/ui components for shared UI primitives and Tailwind tokens for theming consistency.

## 9. Development Workflow Conventions
- Default commands: `npm run dev`, `npm run dev:full` (with Docker), `npm run build`, `npm run start`.
- Quality gates: `npm run lint`, `npm run lint:fix`, `npm run format:write`, `npm run check` (Biome suite).
- DB lifecycle: `npm run docker:up`, `docker:down`, `db:push`, `db:studio`, `db:migrate`, `db:seed`.
- Middleware + Edge runtime constraints: avoid Node APIs in middleware and rely on cookie inspection only.
- Follow the checklist from `CLAUDE.md` for new features: confirm protected routes, update schema + run `db:push`, reuse shadcn components, validate timezone/i18n for scheduling features.

## 10. Transfer Checklist
1. Start a fresh Next.js 15 project and install the packages listed in section 2.
2. Copy the following directories/files and adjust namespaces as needed:
   - `src/lib/env.ts`, `src/lib/auth.ts`, `src/lib/auth-client.ts`, `src/lib/auth-utils.ts`
   - `src/db/*`, `drizzle.config.ts`, `drizzle/` (if you want existing migrations)
   - `src/app/api/auth/[...all]/route.ts`, `src/middleware.ts`, auth-related pages (`/login`, `/auth-test`)
   - Styling setup (`src/app/globals.css`, `src/app/layout.tsx`, Tailwind/PostCSS configs)
   - `docker-compose.yml`, `docker/postgres/01-init.sql`, `scripts/setup-dev.sh`
3. Replicate `package.json` scripts and tooling sections; rerun `npm install` to sync lockfile.
4. Recreate environment files (`.env.local`, `.env.production`) with project-specific secrets.
5. Update schema/entity names as required, then run `npm run db:push` and `npm run db:seed` to bootstrap data.
6. Validate Google OAuth integration using `/auth-test` before rolling out protected pages.

With these pieces in place, the new application will inherit the Doc Cycle App foundation: Drizzle-powered Postgres access, BetterAuth + Google sign-in, Tailwind/shadcn UI styling, and the Biome-driven workflow.
