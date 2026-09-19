# Digital Seba — ডিজিটাল সেবা

A Bun-powered Turborepo monorepo for a modern Union Parishad digital service platform.

## Apps

- `apps/landing` — public citizen portal (Next.js)
- `apps/admin` — protected office dashboard shell (Next.js)
- `apps/api` — REST API foundation (NestJS)
- `packages/ui` — shared UI primitives
- `packages/database` — Prisma schema and seed
- `packages/types` — shared Zod schemas
- `packages/utils` — Bangla digit/date helpers

## Local development with Bun

```bash
bun install
docker compose up -d
bun run dev
```

Website runs on `3000`, admin on `3001`, and API on `4000`.

Demo admin: `office@digitalseba.local` / `Admin@123`.

Use Bun for all package management and scripts. The workspace uses Bun workspaces and `bun.lock`—no npm or pnpm lockfile is required.
