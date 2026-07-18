![Moscow OS Logo](../assets/moscow-os-logo.png)

# Architecture Decision Records — Index

**Document ID:** ARCH-026
**Version:** 1.0.0
**Status:** Active
**Owner:** Engineering Leadership
**Last Updated:** 2026-07-18

---

## Revision History

| Version | Date | Author | Summary of Changes |
|---|---|---|---|
| 1.0.0 | 2026-07-18 | Engineering Leadership | Initial publication; establishes the ADR index |

## Table of Contents

*[Insert generated table of contents here once the document's section structure is finalized.]*

---

## Purpose

This document is the index of every Architecture Decision Record (ADR) written for Moscow OS. Individual ADRs are recorded as their own documents using `docs/templates/architecture-decision-record-template.md` (TPL-027) and listed here for discoverability, per `docs/framework/documentation-framework.md` (DOC-002), Section 6.

## Scope

Covers the index and process for ADRs. The rationale and content of any individual decision lives in that decision's own ADR document, not here.

---

## 1. What Warrants an ADR

An ADR is written for any decision that: introduces a new external dependency, changes a core entity relationship or Row Level Security pattern (per `database-architecture.md`, ARCH-008), alters a security boundary (per `security-architecture.md`, ARCH-018), or deviates from a principle stated in `architecture-principles.md` (ARCH-003) for a specific, justified reason. Routine implementation choices within an already-decided architecture do not require an ADR.

## 2. ADR Location and Numbering

Individual ADRs live under `docs/architecture/decisions/`, numbered sequentially and independently of the `ARCH-###` document range used by this directory's main architecture documents, per `docs/framework/documentation-framework.md` (DOC-002), Section 6. Each ADR file is named `ADR-###-short-title.md`.

## 3. ADR Index

| ADR | Title | Status | Summary |
|---|---|---|---|
| ADR-001 | *[Reserved for the first recorded decision]* | *[Proposed / Accepted / Deprecated / Superseded]* | *[One-line summary]* |

*[This table is populated as ADRs are written. No ADRs have been formally recorded as of this document's initial publication; the architecture described across `docs/architecture/` at Version 1.0.0 reflects the foundational decisions made in establishing this documentation set, most of which predate formal ADR tracking and are described in their respective subsystem documents rather than as individual ADRs.]*

## 4. Process for Adding an ADR

1. Copy `docs/templates/architecture-decision-record-template.md` (TPL-027) to `docs/architecture/decisions/ADR-###-short-title.md`, using the next sequential number.
2. Complete the ADR following that template's structure.
3. Add a row to the index table in Section 3 above, in the same pull request.
4. Submit for review under the elevated architecture-change approval rules in `docs/framework/review-process.md` (DOC-011), Section 4.

## 5. Superseding a Decision

When a new ADR supersedes an earlier one, both are retained: the earlier ADR's Status is updated to "Superseded," referencing the new ADR's number, per `docs/templates/architecture-decision-record-template.md` (TPL-027), Section 1. The index table in Section 3 reflects the current status of every ADR, superseded or otherwise, preserving the historical record.

## References

`docs/framework/documentation-framework.md` (DOC-002), Section 6; `docs/templates/architecture-decision-record-template.md` (TPL-027); `architecture-principles.md` (ARCH-003); `docs/framework/review-process.md` (DOC-011).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
