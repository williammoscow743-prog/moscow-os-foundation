# services/

Client-safe service modules that wrap external systems (Supabase queries,
REST APIs, MCP calls). Import these from React components and TanStack
Query hooks instead of hitting `supabase` directly, so business logic stays
testable and swappable.

- `*.functions.ts` — TanStack `createServerFn` handlers (client-safe to import).
- `*.server.ts` — server-only helpers, never imported by components.

Server functions and edge-only helpers live under `src/routes/api/**` when
they need raw HTTP access; everything else belongs here.
