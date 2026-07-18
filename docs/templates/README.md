[Moscow OS Logo Placeholder]

# MOSCOW OS

**Organize. Build. Grow.**

# Documentation Template Library

**Document ID:** TPL-001
**Version:** 1.0.0
**Status:** Active
**Author:** Documentation Architecture Team
**Reviewer:**
**Approved By:**
**Created:** 2026-07-17
**Updated:** 2026-07-17
**Classification:** Internal

---

## Purpose

This directory contains the official Moscow OS Documentation Template Library. Every document produced for Moscow OS — whether written by a human contributor or drafted by an AI assistant (ChatGPT, Claude, Loveable) — begins from one of these templates rather than being structured freely. This ensures that as the documentation set grows toward its 250–400 page target, every document shares the same header, metadata, revision control, and section discipline, regardless of who authored it or when.

This library sits alongside, and is governed by, the Documentation Framework in `docs/framework/`. Where the Framework defines the *rules* (numbering, versioning, style, review process), this library provides the *starting point* documents that already comply with those rules.

---

## How to Use These Templates

1. Identify the type of document you need to produce (requirements spec, API reference, meeting minutes, incident report, etc.) and locate the matching template below.
2. Copy the template file into the correct location under `docs/` per the category structure defined in `document-numbering.md` (DOC-004) in `docs/framework/`.
3. Replace every bracketed placeholder and metadata field (Document ID, Author, Reviewer, Approved By, Created, Updated, Classification) with real values.
4. Assign a permanent Document ID from the appropriate DOC-### range per `document-numbering.md` (DOC-004), and register it in that document's registry table.
5. Fill in each section using the guidance text provided in that section — the guidance text itself is always removed once real content is written; templates must never ship with their own instructional text left in place.
6. Submit the completed document for review per `review-process.md` (DOC-011) in `docs/framework/`.

## Template Numbering: The TPL-### Scheme

Templates are identified with a `TPL-###` prefix, distinct from the `DOC-###` scheme used for actual project documents. This separation exists because templates are reusable authoring tools, not standalone project records — a template does not "belong" to the Product, Architecture, Modules, or Operations categories the way a finished document does. A completed document created from a template is assigned its own `DOC-###` ID at creation time, per `document-numbering.md` (DOC-004); the `TPL-###` ID stays with the template itself.

## Template Registry

| Template ID | Template File | Use For |
|---|---|---|
| TPL-001 | `README.md` | This document |
| TPL-002 | `document-template.md` | Generic base template for any document type not otherwise covered |
| TPL-003 | `software-requirements-specification-template.md` | Functional and non-functional requirements definition |
| TPL-004 | `software-architecture-document-template.md` | System and module-level architecture description |
| TPL-005 | `api-specification-template.md` | REST/API endpoint and contract documentation |
| TPL-006 | `database-design-template.md` | Schema, table, and data model documentation |
| TPL-007 | `ui-ux-design-template.md` | Interface design, flows, and design system documentation |
| TPL-008 | `developer-handbook-template.md` | Engineering onboarding and internal development reference |
| TPL-009 | `user-guide-template.md` | End-user-facing product documentation |
| TPL-010 | `administrator-guide-template.md` | Organization administrator and configuration reference |
| TPL-011 | `installation-deployment-guide-template.md` | Environment setup and deployment procedures |
| TPL-012 | `testing-strategy-template.md` | Overall approach to quality assurance |
| TPL-013 | `test-plan-template.md` | Specific test coverage for a feature or release |
| TPL-014 | `sprint-report-template.md` | Sprint outcome and retrospective summary |
| TPL-015 | `meeting-minutes-template.md` | Meeting record and action items |
| TPL-016 | `project-charter-template.md` | Project initiation and authorization record |
| TPL-017 | `roadmap-template.md` | Forward-looking planning and milestone document |
| TPL-018 | `release-notes-template.md` | Customer-facing summary of a shipped release |
| TPL-019 | `changelog-template.md` | Running technical log of changes by version |
| TPL-020 | `risk-register-template.md` | Tracked risks, likelihood, impact, and mitigation |
| TPL-021 | `issue-report-template.md` | Bug or defect report |
| TPL-022 | `change-request-template.md` | Formal request to change scope, process, or system behavior |
| TPL-023 | `decision-log-template.md` | Running record of project decisions and rationale |
| TPL-024 | `security-policy-template.md` | Security rules, controls, and responsibilities |
| TPL-025 | `incident-response-template.md` | Record of a specific security or operational incident |
| TPL-026 | `ai-prompt-template.md` | Reusable, versioned prompt for AI-assisted work |
| TPL-027 | `architecture-decision-record-template.md` | Single architectural decision record (ADR) |

## Naming Conventions

- Template files use lowercase, hyphen-separated names ending in `-template.md`, consistent with `repository-standards.md` (DOC-007) in `docs/framework/`.
- Documents created *from* a template do not retain the `-template` suffix; they are named for their actual content (for example, `finance-module-srs.md`, not `finance-module-srs-template.md`).

## Versioning

Templates follow the same semantic versioning rules as any other Moscow OS document, defined in `versioning-policy.md` (DOC-005) in `docs/framework/`:

- **MAJOR** — a structural change to the template (sections added, removed, or reordered) that would make documents built on the prior version inconsistent with new documents.
- **MINOR** — new optional sections or expanded guidance added without invalidating existing documents built from the template.
- **PATCH** — wording, formatting, or clarification fixes with no structural impact.

A version increment to a template does not retroactively change documents already created from an earlier version. Existing documents are only updated to a newer template structure as a deliberate, reviewed decision.

## Document IDs in Practice

Every document created from a template must receive its own permanent `DOC-###` ID at creation time, assigned per the process in `document-numbering.md` (DOC-004). The template itself never appears in a finished document's metadata — only the finished document's own ID, version, and status are recorded.

## Best Practices

- Never delete a required section from a template because it feels inapplicable; instead write "Not applicable — [reason]" so the omission is visible and intentional rather than an oversight.
- Keep the Revision History table current on every substantive edit, per `versioning-policy.md` (DOC-005), Section 4.
- Populate the Table of Contents only once the document's section structure is stable; regenerate it whenever sections are added, removed, or reordered.
- Reference other Moscow OS documents by Document ID, per `documentation-standards.md` (DOC-003), Section 4, not by filename alone.
- When an AI assistant is asked to complete a template, provide it the template file itself along with `documentation-standards.md` (DOC-003) and `markdown-style-guide.md` (DOC-006), consistent with `ai-collaboration.md` (DOC-009) and `prompt-writing-guide.md` (DOC-010).

## References

*[This document references every template in the library above by ID. See `docs/framework/document-numbering.md` (DOC-004) for the Document ID scheme applied to documents created from these templates.]*

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
