![Moscow OS Logo](../assets/moscow-os-logo.png)

# Architecture Principles

**Document ID:** ARCH-003
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

This document defines the engineering principles that every architectural decision for Moscow OS is judged against, so that decisions made independently by different engineers or AI assistants converge on a consistent system rather than diverging over time.

## Scope

Applies to every technical decision covered by `docs/architecture/`. Product-level principles (design philosophy, UX principles) are covered in the System Overview (DOC-100) and `docs/design-system/design-principles.md` (DS-002); this document covers engineering-specific principles only.

---

## 1. Managed Services Over Custom Infrastructure

Moscow OS prefers a mature managed platform (Supabase) over self-hosted infrastructure wherever the managed option meets requirements, per the System Overview (DOC-100), Section 7.2. Custom infrastructure is introduced only when a specific, documented requirement cannot be met by the managed platform, and that decision is recorded as an ADR per `architecture-decision-records.md` (ARCH-026).

## 2. Security Enforced at the Data Layer

Data isolation between organizations is enforced by Row Level Security at the PostgreSQL layer, not solely by application-layer logic. Application-layer checks may exist for user experience (hiding a button a user can't use) but are never the sole line of defense, consistent with the Security Overview (DOC-100), Section 9.3.

## 3. Type Safety End to End

TypeScript is used throughout the frontend, and database types are generated from the PostgreSQL schema rather than hand-maintained, so a schema change surfaces as a compile-time error in dependent frontend code rather than a runtime failure.

## 4. Server-Side AI Access Only

No LLM provider credential or direct database connection is ever exposed to the client. All AI Workspace functionality is mediated through server-side Edge Functions or the MCP Server, per `ai-architecture.md` (ARCH-013) and `mcp-architecture.md` (ARCH-012), consistent with the AI Consent principle in the Security Overview (DOC-100), Section 9.5.

## 5. Explicit Module Boundaries

Each of the modules described in the System Overview (DOC-100), Section 6, owns its own data domain and exposes its capabilities to other modules through defined interfaces rather than direct cross-module database queries scattered throughout the frontend, per `application-architecture.md` (ARCH-005).

## 6. Design for the Documented Scale Target

Architecture decisions are made against the scalability target in the System Overview (DOC-100), Section 3.1 — from a single user to hundreds of team members and thousands of projects — without over-engineering for scale far beyond that target prematurely. Scalability work is prioritized against `scalability.md` (ARCH-020), not spent speculatively.

## 7. Observable by Default

Every service-level component (Edge Functions, database queries at scale) emits structured logs and metrics by default, per `logging.md` (ARCH-022) and `monitoring.md` (ARCH-021), rather than observability being added reactively after an incident.

## 8. Fail Predictably

Errors surface through a consistent, documented contract at every layer, per `error-handling.md` (ARCH-023), so a failure in one module cannot silently corrupt data or state in another.

## 9. Documentation-First for Architecture Changes

Significant architectural decisions are documented as an ADR before or alongside implementation, per the Documentation-First methodology in the System Overview (DOC-100), Section 11.4, and reviewed under the elevated approval rules in `docs/framework/review-process.md` (DOC-011), Section 4.

## 10. Reversible Over Irreversible

Where two architecturally sound options exist and one is more easily reversed later than the other, the more reversible option is preferred, given the platform's early stage and the roadmap-driven evolution described in the System Overview (DOC-100), Section 5.3.

## References

`docs/product/01 - System Overview` (DOC-100), Sections 3.1, 6, 7.2, 9.3, 9.5, 11.4; `docs/design-system/design-principles.md` (DS-002); `architecture-decision-records.md` (ARCH-026); `docs/framework/review-process.md` (DOC-011).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
