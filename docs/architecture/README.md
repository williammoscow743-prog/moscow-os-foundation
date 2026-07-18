![Moscow OS Logo](../assets/moscow-os-logo.png)

# Software Architecture Documentation

**Document ID:** ARCH-001
**Version:** 1.0.0
**Status:** Active
**Owner:** Engineering Leadership
**Last Updated:** 2026-07-18

---

## Revision History

| Version | Date | Author | Summary of Changes |
|---|---|---|---|
| 1.0.0 | 2026-07-18 | Engineering Leadership | Initial publication of the Software Architecture documentation set |

## Table of Contents

*[Insert generated table of contents here once the document's section structure is finalized.]*

---

## Purpose

This directory contains the complete Software Architecture documentation for Moscow OS: how the system is built, how its parts communicate, where its security boundaries sit, and how it is deployed and operated. It is the authoritative technical reference for engineers, AI coding assistants, and future contributors implementing or extending the platform.

## Scope

This README applies to `docs/architecture/` only. It does not duplicate the product-level description already given in the System Overview (DOC-100); architecture documents assume that context and go one level deeper into implementation.

---

## Document Registry

| Document | Document ID | Covers |
|---|---|---|
| `system-overview.md` | ARCH-002 | The architectural system context: actors, boundaries, and major subsystems |
| `architecture-principles.md` | ARCH-003 | The engineering principles every architectural decision is judged against |
| `high-level-architecture.md` | ARCH-004 | The top-level component map and how major subsystems connect |
| `application-architecture.md` | ARCH-005 | How the application is structured internally, by module |
| `frontend-architecture.md` | ARCH-006 | React, TypeScript, Vite, TanStack Router, and client-side structure |
| `backend-architecture.md` | ARCH-007 | Supabase-managed backend: Postgres, Edge Functions, Storage, Realtime |
| `database-architecture.md` | ARCH-008 | Schema organization, migrations, and Row Level Security strategy |
| `authentication-architecture.md` | ARCH-009 | Identity, session, and token management |
| `authorization-architecture.md` | ARCH-010 | Permission enforcement, current and planned |
| `api-architecture.md` | ARCH-011 | The API surfaces exposed by the platform |
| `mcp-architecture.md` | ARCH-012 | The MCP Server's role, tool contracts, and access model |
| `ai-architecture.md` | ARCH-013 | How AI Workspace features are built and grounded |
| `event-architecture.md` | ARCH-014 | Realtime events, triggers, and cross-module side effects |
| `caching-strategy.md` | ARCH-015 | Client and infrastructure caching layers |
| `file-storage.md` | ARCH-016 | Document and file storage architecture |
| `notifications.md` | ARCH-017 | Notification delivery architecture (distinct from its UI, DS-014) |
| `security-architecture.md` | ARCH-018 | The consolidated technical security model |
| `deployment-architecture.md` | ARCH-019 | Environments, CI/CD, and release mechanics |
| `scalability.md` | ARCH-020 | How the architecture scales with load and organization count |
| `monitoring.md` | ARCH-021 | Observability and alerting |
| `logging.md` | ARCH-022 | Logging standards and retention |
| `error-handling.md` | ARCH-023 | Error contracts and propagation across layers |
| `performance.md` | ARCH-024 | Performance budgets and optimization strategy |
| `disaster-recovery.md` | ARCH-025 | Backup, recovery, and business continuity |
| `architecture-decision-records.md` | ARCH-026 | The index of individual Architecture Decision Records |
| `glossary.md` | ARCH-027 | Architecture-specific terminology |

## How This Relates to Other Documentation

This directory sits within the numbering scheme defined in `docs/framework/document-numbering.md` (DOC-004), using the dedicated `ARCH-###` identifier range for architecture documents, distinct from the general `DOC-###` product/module range, the `TPL-###` template range (`docs/templates/`), and the `DS-###` design range (`docs/design-system/`). This mirrors the precedent set by those two directories: architecture documents are their own governed category with its own registry, cross-referenced from, but not numbered within, the core Documentation Framework.

Every document in this directory follows the header, metadata, and structural conventions defined in `docs/framework/documentation-standards.md` (DOC-003) and `docs/framework/markdown-style-guide.md` (DOC-006), and is subject to the elevated architecture-change review rules in `docs/framework/review-process.md` (DOC-011), Section 4.

## How to Use This Documentation

- Start with `system-overview.md` (ARCH-002) and `architecture-principles.md` (ARCH-003) for context before reading any subsystem document.
- `high-level-architecture.md` (ARCH-004) is the map; every other document in this directory zooms into one part of it.
- When implementing a feature, consult the relevant subsystem document(s) and `architecture-decision-records.md` (ARCH-026) for any prior decision that constrains the approach.
- When a new architectural decision is made, it is recorded as an individual ADR using `docs/templates/architecture-decision-record-template.md` (TPL-027) and indexed in `architecture-decision-records.md` (ARCH-026).

## References

`docs/product/01 - System Overview` (DOC-100); `docs/framework/document-numbering.md` (DOC-004); `docs/framework/documentation-standards.md` (DOC-003); `docs/framework/review-process.md` (DOC-011); `docs/design-system/README.md` (DS-001); `docs/templates/README.md` (TPL-001).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
