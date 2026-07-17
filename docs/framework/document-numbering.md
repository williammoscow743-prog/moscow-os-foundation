![Moscow OS Logo](../assets/moscow-os-logo.png)

# Document Numbering Scheme

**Document ID:** DOC-004
**Version:** 1.0.0
**Status:** Active
**Owner:** Documentation Architecture Team
**Last Updated:** 2026-07-17

---

## Purpose

This document defines the Document ID (DOC-ID) scheme used to uniquely and permanently identify every document in the Moscow OS documentation set, independent of filename or location.

## Scope

Applies to all documents under `docs/`. Does not apply to code comments, pull request descriptions, or informal notes.

---

## 1. ID Format

Every document has a unique identifier in the form `DOC-###`, using a zero-padded three-digit number (for example, `DOC-001`, `DOC-042`). IDs are assigned once, at document creation, and never reused or reassigned — even if the document is later deprecated.

## 2. Category Ranges

| Range | Category | Directory |
|---|---|---|
| DOC-001 – DOC-099 | Framework | `docs/framework/` |
| DOC-100 – DOC-199 | Product | `docs/product/` |
| DOC-200 – DOC-299 | Architecture | `docs/architecture/` |
| DOC-300 – DOC-399 | Modules | `docs/modules/` |
| DOC-400 – DOC-499 | Operations | `docs/operations/` |
| DOC-500 – DOC-599 | Reserved (Compliance & Security) | `docs/compliance/` |
| DOC-600 – DOC-699 | Reserved (Integrations & Partners) | `docs/integrations/` |
| DOC-700+ | Reserved for future categories | TBD at time of need |

Each range provides up to 100 document slots, which is expected to comfortably support the 250–400 page target across the framework's operational lifetime without renumbering.

## 3. Current Registry

| ID | Document | Category |
|---|---|---|
| DOC-001 | README.md | Framework |
| DOC-002 | documentation-framework.md | Framework |
| DOC-003 | documentation-standards.md | Framework |
| DOC-004 | document-numbering.md | Framework |
| DOC-005 | versioning-policy.md | Framework |
| DOC-006 | markdown-style-guide.md | Framework |
| DOC-007 | repository-standards.md | Framework |
| DOC-008 | github-workflow.md | Framework |
| DOC-009 | ai-collaboration.md | Framework |
| DOC-010 | prompt-writing-guide.md | Framework |
| DOC-011 | review-process.md | Framework |
| DOC-012 | release-process.md | Framework |
| DOC-013 | glossary.md | Framework |
| DOC-100 | 01 - System Overview | Product |

This table is the single source of truth for ID assignment. Any new document must be added here at the time of creation, before the document is merged.

## 4. Assigning a New ID

1. Identify the correct category from Section 2.
2. Take the next unused number in that category's range from the registry in Section 3.
3. Add a new row to the registry in the same pull request that introduces the document.
4. Use the assigned ID in the new document's metadata block, per `documentation-standards.md` (DOC-003), Section 1.

## 5. Sub-Numbering for Large Categories

Where a category requires structured sub-numbering (for example, Modules), documents should additionally use a descriptive suffix in their filename (for example, `DOC-301-projects.md`, `DOC-302-crm.md`) while the registry remains the authoritative ID-to-document mapping.

## 6. Deprecation and Renumbering

IDs are never reused. If a document is deprecated or superseded per `documentation-framework.md` (DOC-002), Section 2, its ID remains permanently associated with that document in the registry, marked accordingly, rather than being freed for reassignment.
