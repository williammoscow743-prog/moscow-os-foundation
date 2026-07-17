![Moscow OS Logo](../assets/moscow-os-logo.png)

# Documentation Framework

**Document ID:** DOC-002
**Version:** 1.0.0
**Status:** Active
**Owner:** Documentation Architecture Team
**Last Updated:** 2026-07-17

---

## Purpose

This document defines the overall structure, categories, and lifecycle of all documentation produced for Moscow OS. It exists to ensure that as the documentation set grows from its current foundation to an estimated 250–400 pages, it remains navigable, non-redundant, and consistently structured regardless of who — or what — authored any given page.

## Scope

This document applies to every piece of written documentation produced for Moscow OS, including product documentation, architecture records, module specifications, API references, operational runbooks, and this framework directory itself. It does not apply to inline code comments, which are governed by language-specific conventions defined in `repository-standards.md` (DOC-007).

---

## 1. Documentation Categories

Moscow OS documentation is organized into five categories. Every document must belong to exactly one category.

| Category | Prefix Range | Location | Description |
|---|---|---|---|
| Framework | DOC-001 – DOC-099 | `docs/framework/` | Governance documents defining how documentation itself works |
| Product | DOC-100 – DOC-199 | `docs/product/` | Vision, scope, business objectives, and user-facing product definition |
| Architecture | DOC-200 – DOC-299 | `docs/architecture/` | System design, data models, integration architecture |
| Modules | DOC-300 – DOC-399 | `docs/modules/` | Per-module specifications (Projects, CRM, Finance, Calendar, Documents, AI Workspace, Reporting, Administration) |
| Operations | DOC-400 – DOC-499 | `docs/operations/` | Runbooks, release procedures, incident response, support processes |

The full numeric scheme, including reserved ranges for future categories, is defined in `document-numbering.md` (DOC-004).

## 2. Document Lifecycle

Every document moves through a defined lifecycle, tracked in its header metadata:

- **Draft** — Under active authorship. Not yet authoritative. May be incomplete or contain open questions.
- **Active** — Reviewed, approved, and authoritative for its scope. This is the default state for published documentation.
- **Deprecated** — No longer recommended for use but retained for historical or audit purposes. Must state its replacement.
- **Superseded** — Formally replaced by a specific newer document. Must link to the superseding document ID.

Transitions between these states follow the approval rules in `review-process.md` (DOC-011).

## 3. Document Anatomy

Every Moscow OS document, regardless of category, shares a common anatomy:

1. Logo placeholder (see `markdown-style-guide.md`, Section 2)
2. Title
3. Metadata block: Document ID, Version, Status, Owner, Last Updated
4. Purpose statement
5. Scope statement
6. Numbered content sections
7. Cross-references to related documents by Document ID, not by filename alone (filenames may change; IDs do not)

This anatomy is enforced in detail by `documentation-standards.md` (DOC-003).

## 4. Ownership Model

Each document has a single named owner (a team or role, not necessarily an individual) responsible for its accuracy. Ownership does not imply the owner writes every update — it means the owner is accountable for reviewing and approving changes to that document, consistent with `review-process.md` (DOC-011).

## 5. Cross-Referencing Rules

Documents must reference each other by Document ID with the filename as a secondary aid, for example: `versioning-policy.md (DOC-005)`. This ensures links remain resolvable even if a file is renamed, provided the numbering registry in `document-numbering.md` (DOC-004) is kept current.

## 6. Scaling to 250–400 Pages

This framework is designed to scale by category, not by flattening everything into a single directory. As the documentation set grows:

- New module documents are added under `docs/modules/` using the next available ID in the DOC-300 range, one document per module.
- Architecture decisions that need permanent record (not just current-state description) are captured as Architecture Decision Records (ADRs) under `docs/architecture/decisions/`, numbered independently as ADR-001, ADR-002, etc., and referenced from the relevant architecture document.
- Operational runbooks are added incrementally under `docs/operations/` as new operational processes are formalized, without requiring changes to existing runbooks.

This category-based growth model ensures the framework documents in `docs/framework/` remain stable even as the total documentation set expands by an order of magnitude.

## 7. Relationship to Product Documentation

The System Overview document (the first Product-category document, DOC-100) and subsequent product documents are written *within* this framework, not alongside it. Any product document that does not conform to the anatomy in Section 3 is considered non-compliant and must be corrected before being marked `Active`.
