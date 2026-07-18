![Moscow OS Logo](../assets/moscow-os-logo.png)

# Architecture Glossary

**Document ID:** ARCH-027
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

This document defines architecture-specific terminology used across `docs/architecture/`, complementing the product-level glossary in `docs/framework/glossary.md` (DOC-013), which this document does not duplicate.

## Scope

Covers technical architecture terms only. Product, module, and documentation-process terms are defined in `docs/framework/glossary.md` (DOC-013); this glossary is additive to, not a replacement for, that one.

---

## 1. Platform and Infrastructure Terms

| Term | Definition |
|---|---|
| Edge Function | A Supabase-hosted, serverless function executing backend logic, per `backend-architecture.md` (ARCH-007) |
| PostgREST | The auto-generated REST API layer Supabase provides over PostgreSQL tables and views |
| Row Level Security (RLS) | See `docs/framework/glossary.md` (DOC-013), Section 3; this glossary does not redefine it |
| Service-Role Credential | An elevated database credential that bypasses Row Level Security, used only in specific, documented Edge Functions per `backend-architecture.md` (ARCH-007), Section 5 |
| Realtime Channel | A Supabase websocket subscription delivering live database change events to a client, per `event-architecture.md` (ARCH-014) |

## 2. Frontend Terms

| Term | Definition |
|---|---|
| TanStack Router | The type-safe client-side routing library used across the Moscow OS frontend, per `frontend-architecture.md` (ARCH-006) |
| TanStack Query | The server-state data-fetching and caching library used across the Moscow OS frontend, per `frontend-architecture.md` (ARCH-006), Section 4 |
| Code Splitting | Dividing the frontend bundle so a module's code loads only when navigated to, per `frontend-architecture.md` (ARCH-006), Section 3 |
| Optimistic UI | Updating the interface immediately upon a user action, before server confirmation, per `docs/design-system/loading-states.md` (DS-023), Section 6 |

## 3. AI and MCP Terms

| Term | Definition |
|---|---|
| MCP Tool | A single, defined capability exposed through the MCP Server, per `mcp-architecture.md` (ARCH-012), Section 2 |
| Grounding | Supplying an AI system with specific, retrieved organization data (via MCP tool calls) so its output is based on real data rather than general knowledge, per `ai-architecture.md` (ARCH-013) |
| LLM Provider | The external large language model service Moscow OS integrates with for AI Workspace features, per `ai-architecture.md` (ARCH-013) |
| Tool Registry | The catalog of MCP tools each module exposes, per `mcp-architecture.md` (ARCH-012), Section 3 |

## 4. Reliability and Operations Terms

| Term | Definition |
|---|---|
| RPO (Recovery Point Objective) | The maximum acceptable amount of data loss, measured in time, in a recovery scenario, per `disaster-recovery.md` (ARCH-025), Section 2 |
| RTO (Recovery Time Objective) | The maximum acceptable time to restore service after a disruption, per `disaster-recovery.md` (ARCH-025), Section 2 |
| Correlation ID | An identifier propagated across a request's full lifecycle to tie related log entries together, per `logging.md` (ARCH-022), Section 7 |
| Idempotency | The property that an operation can be safely repeated with the same input without duplicating its effect, required of event-triggered functions per `event-architecture.md` (ARCH-014), Section 5 |

## 5. Adding New Terms

New architecture-specific terms are added to this glossary at the time they are introduced in another `docs/architecture/` document, in the same change, following the same process as `docs/framework/glossary.md` (DOC-013), Section 5.

## References

`docs/framework/glossary.md` (DOC-013); every document in `docs/architecture/` referenced above.

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
