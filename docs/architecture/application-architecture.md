![Moscow OS Logo](../assets/moscow-os-logo.png)

# Application Architecture

**Document ID:** ARCH-005
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

This document defines how the Moscow OS application is structured internally by module, and the rules governing how modules interact with one another.

## Scope

Covers module boundaries and cross-module interaction patterns. Frontend-specific folder structure is covered in `frontend-architecture.md` (ARCH-006); database schema per module is covered in `database-architecture.md` (ARCH-008).

---

## 1. Module Inventory

Moscow OS is organized into the modules defined in the System Overview (DOC-100), Section 6, plus supporting technical modules: Authentication, Notifications, Administration, MCP Server, and API. Each owns a distinct data and functional domain.

| Module | Owns |
|---|---|
| Dashboard | No independent data; aggregates from other modules |
| Projects | Project records |
| Milestones | Milestone records (child of Projects) |
| Tasks | Task records (child of Milestones) |
| CRM (Clients) | Client records |
| Finance | Invoices, expenses, financial calculations |
| Calendar | No independent data; aggregates time-relevant data from other modules |
| Documents | Document files and metadata |
| Reporting | No independent data; queries across modules |
| AI Workspace | AI session state, grounding requests |
| Notifications | Notification records |
| Administration | Organization configuration, user/team management |

## 2. Module Boundary Rule

A module's data is only written to directly by that module's own code path (frontend feature module and, where applicable, its Edge Functions). Other modules read that data through defined query patterns (foreign-key-scoped Supabase queries) or, for derived/aggregate views (Dashboard, Reporting), through dedicated read-only views rather than ad hoc cross-module joins scattered across the frontend.

## 3. Module Interdependency

Module interdependency mirrors the hierarchy described in the System Overview (DOC-100), Section 6: Tasks depend on Milestones, which depend on Projects, which depend on Clients. Finance depends on Projects and Clients for billing context. This dependency direction is one-way — a lower-level module (Tasks) never depends on a higher-level module's presence to function, preserving the ability to use Moscow OS at any scale of adoption per the Scalable principle in `docs/design-system/design-principles.md` (DS-002), Section 8.

## 4. Aggregate Modules

Dashboard, Calendar, and Reporting are aggregate modules: they own no primary data of their own and instead compose data from other modules into a unified view, per their descriptions in the System Overview (DOC-100), Sections 6.1, 6.7, 6.11. These modules are implemented as read paths only; they never write to another module's tables.

## 5. Cross-Module Communication Pattern

Synchronous cross-module reads use direct, RLS-scoped Supabase queries against the owning module's tables. Asynchronous cross-module side effects (for example, a Finance invoice being marked paid updating a Project's financial summary) use the event pattern defined in `event-architecture.md` (ARCH-014), rather than tightly coupled direct calls between module code.

## 6. Shared Infrastructure

All modules share: the authentication and session context (`authentication-architecture.md`, ARCH-009), the design system component library (`docs/design-system/component-library.md`, DS-018), and the MCP Server's tool registry for AI-facing capability exposure (`mcp-architecture.md`, ARCH-012). No module maintains its own parallel version of these.

## 7. Adding a New Module

A new module follows the pattern established by existing modules: its own database schema domain (per `database-architecture.md`, ARCH-008), its own frontend feature folder (per `frontend-architecture.md`, ARCH-006, Section 2), and, if it exposes capability to AI systems, its own MCP tool definitions (per `mcp-architecture.md`, ARCH-012). This is documented as a new Software Requirements Specification using `docs/templates/software-requirements-specification-template.md` (TPL-003).

## References

`docs/product/01 - System Overview` (DOC-100), Section 6; `frontend-architecture.md` (ARCH-006); `database-architecture.md` (ARCH-008); `event-architecture.md` (ARCH-014); `mcp-architecture.md` (ARCH-012); `docs/design-system/design-principles.md` (DS-002).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
