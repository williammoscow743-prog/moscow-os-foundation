![Moscow OS Logo](../assets/moscow-os-logo.png)

# Database Architecture

**Document ID:** ARCH-008
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

This document defines the overall database architecture for Moscow OS: schema organization, multi-tenancy strategy, and the Row Level Security model that enforces data isolation.

## Scope

Covers cross-cutting database architecture. Table-by-table schema detail for a specific module belongs in that module's own Database Design document, created from `docs/templates/database-design-template.md` (TPL-006).

---

## 1. Database Platform

PostgreSQL, managed by Supabase, per the System Overview (DOC-100), Section 7.3. A single logical database serves all organizations (multi-tenant, not database-per-tenant), with isolation enforced by Row Level Security rather than physical separation.

## 2. Schema Organization by Module

Each module defined in `application-architecture.md` (ARCH-005), Section 1, owns a coherent set of tables reflecting its domain. Table names are prefixed or namespaced by module where ambiguity would otherwise exist (for example, `projects`, `milestones`, `tasks`, `clients`, `invoices`).

## 3. Multi-Tenancy Model

Every tenant-scoped table includes an `organisation_id` foreign key column, populated at insert time from the authenticated user's session context. This is the single mechanism by which all tenant data isolation is achieved; there is no secondary or alternative isolation path.

## 4. Row Level Security Strategy

Every tenant-scoped table has RLS enabled with, at minimum, a `SELECT` policy restricting visible rows to those matching the authenticated user's `organisation_id`, and equivalent `INSERT`/`UPDATE`/`DELETE` policies, per the Security Overview (DOC-100), Section 9.3. Policies are defined declaratively in migrations (per `backend-architecture.md`, ARCH-007, Section 6) and are never bypassed from client-side code; any legitimate bypass need is handled through a documented, service-role Edge Function per `backend-architecture.md` (ARCH-007), Section 5.

## 5. Entity Hierarchy

The core entity hierarchy mirrors the module interdependency in `application-architecture.md` (ARCH-005), Section 3: Organizations contain Clients, Clients are associated with Projects, Projects contain Milestones, Milestones contain Tasks. Foreign keys enforce this hierarchy with `ON DELETE CASCADE` or `ON DELETE RESTRICT` chosen per entity based on whether child records are meaningful without their parent.

## 6. Indexing Strategy

Every foreign key column is indexed by default. Additional indexes are added based on observed query patterns from `monitoring.md` (ARCH-021) rather than speculatively, keeping write performance from degrading under unnecessary index maintenance.

## 7. Generated TypeScript Types

The frontend's TypeScript types for database entities are generated directly from the live schema via the Supabase CLI, per the Type Safety End to End principle in `architecture-principles.md` (ARCH-003), Section 3, rather than hand-maintained, so a schema change is immediately visible as a type error in dependent frontend code.

## 8. Data Retention and Deletion

Organization or record deletion cascades per the foreign key rules in Section 5, consistent with the User Privacy principles in the Security Overview (DOC-100), Section 9.4. Soft-delete (a status flag rather than physical deletion) is used for entities that require an audit trail (Finance records) and is documented per-table in that module's Database Design document.

## 9. Migration and Change Process

Schema changes follow the migration process in `backend-architecture.md` (ARCH-007), Section 6, and any migration altering core entity relationships is treated as an elevated-risk change per `architecture-principles.md` (ARCH-003), Section 9, requiring an ADR.

## References

`docs/product/01 - System Overview` (DOC-100), Section 9.3, 9.4; `application-architecture.md` (ARCH-005); `backend-architecture.md` (ARCH-007); `security-architecture.md` (ARCH-018); `architecture-principles.md` (ARCH-003); `docs/templates/database-design-template.md` (TPL-006).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
