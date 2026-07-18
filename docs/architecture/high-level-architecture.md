![Moscow OS Logo](../assets/moscow-os-logo.png)

# High-Level Architecture

**Document ID:** ARCH-004
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

This document provides the top-level component map for Moscow OS: the major subsystems, how they connect, and where each is documented in detail elsewhere in `docs/architecture/`.

## Scope

Covers the system's major components and their connections at a summary level. Each component is documented in full in its own dedicated document, referenced throughout.

---

## 1. Component Map

| Layer | Component | Detailed In |
|---|---|---|
| Client | React SPA (TypeScript, Vite, TanStack Router) | `frontend-architecture.md` (ARCH-006) |
| Backend | Supabase (Postgres, Auth, Storage, Edge Functions, Realtime) | `backend-architecture.md` (ARCH-007) |
| Data | PostgreSQL with Row Level Security | `database-architecture.md` (ARCH-008) |
| Identity | Supabase Auth, OAuth 2.1 | `authentication-architecture.md` (ARCH-009) |
| AI Access | MCP Server | `mcp-architecture.md` (ARCH-012) |
| AI Features | AI Workspace, LLM integration | `ai-architecture.md` (ARCH-013) |
| Events | Supabase Realtime, database triggers | `event-architecture.md` (ARCH-014) |
| Files | Supabase Storage | `file-storage.md` (ARCH-016) |
| Delivery | GitHub Actions CI/CD | `deployment-architecture.md` (ARCH-019) |

## 2. Request Flow (Standard Data Operation)

1. The React SPA, routed via TanStack Router, renders a view requiring data.
2. The client issues a request through the Supabase client library (`supabase-js`), carrying the user's JWT.
3. PostgREST (Supabase's auto-generated API layer) receives the request and evaluates it against Row Level Security policies for the requesting user, per `database-architecture.md` (ARCH-008), Section 4.
4. Postgres returns only the rows the policy permits; PostgREST serializes the response.
5. The client's data layer (TanStack Query, per `frontend-architecture.md`, ARCH-006, Section 4) caches the response and updates the UI.

## 3. Request Flow (Business Logic Operation)

For operations requiring logic beyond what RLS and direct table access can express (for example, generating an invoice PDF or validating a multi-table business rule), the client calls a Supabase Edge Function instead of querying tables directly. The Edge Function runs server-side with its own scoped credentials, performs the operation, and returns a result, per `backend-architecture.md` (ARCH-007), Section 3.

## 4. Request Flow (AI-Grounded Operation)

1. The user issues a natural-language request in the AI Workspace or Command Palette.
2. The request is sent to a server-side Edge Function, which constructs a call to the LLM Provider.
3. Where the LLM needs access to the user's own organization data to ground its response, it does so exclusively through MCP Server tool calls, per `mcp-architecture.md` (ARCH-012), scoped to that user's authenticated session and organization.
4. The LLM's response is returned to the client, rendered with the AI-attribution pattern defined in `docs/design-system/component-library.md` (DS-018), Section 10.

## 5. Realtime Update Flow

Supabase Realtime subscribes the client to relevant Postgres changes (for example, a task's status changing) via websocket, scoped by the same Row Level Security policies as standard queries, so a client only receives realtime events for data it is already permitted to see. Full detail in `event-architecture.md` (ARCH-014).

## 6. What Is Explicitly Not Present in Version 1

Consistent with the Product Scope in the System Overview (DOC-100), Section 5.2, this architecture does not include: a separately hosted application server (business logic lives in Edge Functions, not a standalone backend service), a message broker or queue system (Realtime and database triggers cover Version 1's event needs, per `event-architecture.md`, ARCH-014, Section 6), or a dedicated caching layer beyond client-side and CDN caching, per `caching-strategy.md` (ARCH-015), Section 5.

## References

`docs/product/01 - System Overview` (DOC-100), Section 7; `frontend-architecture.md` (ARCH-006); `backend-architecture.md` (ARCH-007); `database-architecture.md` (ARCH-008); `mcp-architecture.md` (ARCH-012); `event-architecture.md` (ARCH-014); `deployment-architecture.md` (ARCH-019).

## Appendices

*[A full component diagram is pending and will be added here once produced.]*

---

© 2026 Moscow OS
All Rights Reserved
