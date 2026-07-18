![Moscow OS Logo](../assets/moscow-os-logo.png)

# Backend Architecture

**Document ID:** ARCH-007
**Version:** 1.0.0
**Status:** Active
**Owner:** Engineering Leadership
**Last Updated:** 2026-07-18

---

## Revision History

| Version | Date | Author | Summary of Changes |
|---|---|---|---|
| 1.0.0 | 2026-07-18 | Engineering Leadership | Initial publication |

## Table of Contents

*[Insert generated table of contents here once the document's section structure is finalized.]*

---

## Purpose

This document defines the Moscow OS backend, built entirely on Supabase's managed platform, per the System Overview (DOC-100), Section 7.2, and the Managed Services principle in `architecture-principles.md` (ARCH-003), Section 1.

## Scope

Covers the backend components: the Postgres database's API surface, Edge Functions, Storage, and Realtime. Database schema itself is covered in `database-architecture.md` (ARCH-008).

---

## 1. Backend Components

| Component | Purpose |
|---|---|
| PostgreSQL | Primary data store for all module domains, per `database-architecture.md` (ARCH-008) |
| PostgREST (auto-generated API) | Exposes tables and views as a queryable REST API, consumed via `supabase-js` |
| Supabase Auth | Identity, session, and token issuance, per `authentication-architecture.md` (ARCH-009) |
| Edge Functions | Server-side business logic beyond what RLS and direct table access can express |
| Supabase Storage | File object storage for the Documents module, per `file-storage.md` (ARCH-016) |
| Supabase Realtime | Websocket-based change notification, per `event-architecture.md` (ARCH-014) |

## 2. Why No Separate Application Server

Moscow OS does not run a separately hosted, always-on application server in Version 1. Standard CRUD operations are served directly by PostgREST against RLS-protected tables; business logic requiring server-side execution runs in Edge Functions, which are deployed independently and scale automatically per invocation. This avoids operating and scaling a persistent server process for logic that fits a request-scoped execution model, consistent with `architecture-principles.md` (ARCH-003), Section 1.

## 3. Edge Functions

Edge Functions are used for: operations spanning multiple tables that require transactional guarantees beyond a single RLS-protected query, integration with external services (the LLM Provider, per `ai-architecture.md`, ARCH-013), and computation not expressible in SQL (PDF generation for Documents, complex financial calculations for Finance). Each Edge Function is scoped to a single responsibility and documented using `docs/templates/api-specification-template.md` (TPL-005).

## 4. Edge Function Invocation Pattern

The client calls an Edge Function via an authenticated HTTPS request carrying the user's JWT. The function verifies the JWT, applies its own scoped logic (which may itself query Postgres using the calling user's permissions, preserving RLS enforcement rather than bypassing it with a service-role key except where explicitly required and documented).

## 5. Service-Role Access

Edge Functions that require elevated, cross-organization access (for example, a scheduled maintenance task) use a service-role credential explicitly and only where documented as necessary in that function's own specification, per the least-privilege posture required by `security-architecture.md` (ARCH-018), Section 4. Service-role access is never used merely to avoid writing a correct RLS policy.

## 6. Database Migrations

Schema changes are managed through Supabase CLI-tracked migrations, version-controlled in the repository alongside application code, per `docs/framework/repository-standards.md` (DOC-007). Every migration is reviewed under the elevated architecture-change approval rules in `docs/framework/review-process.md` (DOC-011), Section 4, given the cascading impact risk noted in the System Overview (DOC-100), Section 13.1.

## 7. Environment Separation

Each deployment environment (local development, staging, production) uses its own Supabase project, with no shared database between environments, per `deployment-architecture.md` (ARCH-019), Section 2.

## 8. Backend Observability

Edge Function invocations, errors, and Postgres query performance are monitored through Supabase's built-in observability tooling and any supplementary monitoring described in `monitoring.md` (ARCH-021).

## References

`docs/product/01 - System Overview` (DOC-100), Sections 7.2, 13.1; `architecture-principles.md` (ARCH-003); `database-architecture.md` (ARCH-008); `authentication-architecture.md` (ARCH-009); `ai-architecture.md` (ARCH-013); `security-architecture.md` (ARCH-018); `deployment-architecture.md` (ARCH-019); `monitoring.md` (ARCH-021); `docs/framework/review-process.md` (DOC-011).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
