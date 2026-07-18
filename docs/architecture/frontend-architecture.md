![Moscow OS Logo](../assets/moscow-os-logo.png)

# Frontend Architecture

**Document ID:** ARCH-006
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

This document defines the frontend technology choices and internal structure of the Moscow OS client application.

## Scope

Covers the React/TypeScript/Vite/TanStack Router application. Component visual specification is covered in `docs/design-system/`; this document covers code structure, routing, and data-fetching architecture.

---

## 1. Core Technologies

| Technology | Role |
|---|---|
| React | UI rendering, per the System Overview (DOC-100), Section 8 |
| TypeScript | Type safety across the entire frontend, per `architecture-principles.md` (ARCH-003), Section 3 |
| Vite | Development server and production build tooling, per the System Overview (DOC-100), Section 8 |
| TanStack Router | Type-safe, file-based client-side routing |
| TanStack Query | Server-state data fetching, caching, and synchronization against Supabase |
| Tailwind CSS + shadcn/ui | Styling and component primitives, per the System Overview (DOC-100), Section 8, and `docs/design-system/` |

## 2. Folder Structure

```
src/
├── modules/
│   ├── dashboard/
│   ├── projects/
│   ├── milestones/
│   ├── tasks/
│   ├── crm/
│   ├── finance/
│   ├── calendar/
│   ├── documents/
│   ├── reporting/
│   ├── ai-workspace/
│   ├── notifications/
│   └── administration/
├── components/        (shared design-system components)
├── routes/             (TanStack Router route definitions)
├── lib/                (Supabase client, MCP client, utilities)
└── hooks/               (shared cross-module hooks)
```

Each entry under `modules/` corresponds to a module defined in `application-architecture.md` (ARCH-005), Section 1, and its directory naming matches the slug convention required in `docs/framework/repository-standards.md` (DOC-007), Section 4.

## 3. Routing

TanStack Router provides fully type-checked routes, meaning a route's expected parameters are validated at compile time against the components that consume them. Routes are organized to mirror the module structure, with nested routes reflecting the Project → Milestone → Task hierarchy described in `application-architecture.md` (ARCH-005), Section 3. Route-level code-splitting is used so that a module's code is only downloaded when the user navigates to it, per the performance budget in `performance.md` (ARCH-024).

## 4. Data Fetching and Caching

TanStack Query wraps every Supabase read, providing stale-while-revalidate caching, automatic refetch on window refocus, and optimistic update support consistent with the Optimistic UI pattern in `docs/design-system/loading-states.md` (DS-023), Section 6. Query keys are namespaced per module and per entity, so a mutation in one module can precisely invalidate only the affected cache entries elsewhere.

## 5. State Management

Server state (data originating from Supabase) is managed exclusively through TanStack Query; no server data is duplicated into a separate global store. Local, client-only UI state (form input, modal open/closed) uses React's built-in state primitives, scoped as close to the component that needs it as possible, avoiding unnecessary global state.

## 6. Supabase Client Integration

A single, shared Supabase client instance (in `src/lib/`) is used across the application, carrying the authenticated user's session. All module-level data hooks are built on top of this shared client rather than each module instantiating its own connection.

## 7. Realtime Integration

Components that require live updates (for example, a Task list reflecting another user's edits) subscribe to Supabase Realtime channels via a shared hook, which updates the relevant TanStack Query cache entries directly on incoming events, per `event-architecture.md` (ARCH-014), Section 3.

## 8. Error Boundaries

Each module's route tree is wrapped in a React error boundary, so an unhandled error in one module's rendering does not take down the entire application shell (sidebar, top navigation remain functional), consistent with `error-handling.md` (ARCH-023), Section 5.

## 9. Build and Bundling

Vite produces a production build with automatic code-splitting per route. Bundle size budgets per module are defined in `performance.md` (ARCH-024), Section 2.

## References

`docs/product/01 - System Overview` (DOC-100), Section 8; `application-architecture.md` (ARCH-005); `docs/design-system/` (DS-001 through DS-031); `event-architecture.md` (ARCH-014); `error-handling.md` (ARCH-023); `performance.md` (ARCH-024); `docs/framework/repository-standards.md` (DOC-007).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
