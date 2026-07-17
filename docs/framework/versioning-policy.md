![Moscow OS Logo](../assets/moscow-os-logo.png)

# Versioning Policy

**Document ID:** DOC-005
**Version:** 1.0.0
**Status:** Active
**Owner:** Documentation Architecture Team
**Last Updated:** 2026-07-17

---

## Purpose

This document defines how version numbers are assigned and incremented for both Moscow OS documentation and the Moscow OS product itself, ensuring the two versioning tracks remain distinct but consistently understood.

## Scope

Applies to all documents under `docs/` and to the Moscow OS platform release versioning referenced in `release-process.md` (DOC-012). Does not define individual module feature-flag versioning, which is an implementation detail outside the scope of this document.

---

## 1. Semantic Versioning Format

Both documents and product releases use semantic versioning in the form `MAJOR.MINOR.PATCH` (for example, `1.0.0`).

## 2. Document Versioning Rules

For an individual document:

- **MAJOR** increments when the document's scope, structure, or core guidance changes such that prior versions would mislead a reader (for example, a full restructure of a module specification after a redesign).
- **MINOR** increments when new sections or substantial new guidance are added without invalidating existing content.
- **PATCH** increments for corrections, clarifications, formatting fixes, or small updates that do not change guidance.

A document's version is independent of every other document's version. There is no single global documentation version number.

## 3. Product Versioning Rules

Product versioning follows the release strategy defined in `release-process.md` (DOC-012):

- **MAJOR** increments correspond to significant scope expansions, such as the roadmap items described in the System Overview (DOC-100), Section 5.3 — for example, the introduction of full RBAC.
- **MINOR** increments correspond to new features delivered within existing scope.
- **PATCH** increments correspond to fixes and refinements within existing functionality.

Pre-general-availability releases (Alpha, Beta) are versioned as `0.x.y`, transitioning to `1.0.0` at Production general availability, per `release-process.md` (DOC-012), Section 3.

## 4. Version History Requirement

Every document must retain a version history at the bottom of the file once it has been revised at least once:

```
## Version History
| Version | Date | Summary of Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial publication |
```

New rows are appended; prior rows are never edited or removed, preserving an audit trail consistent with `review-process.md` (DOC-011).

## 5. Version and Status Interaction

A document's `Status` field (`Draft`, `Active`, `Deprecated`, `Superseded`, per `documentation-framework.md` (DOC-002), Section 2) is independent of its version number. A document can reach version `1.0.0` and later be marked `Deprecated` without any further version increment, since deprecation is a status change, not a content change.

## 6. Breaking Changes

A breaking change — one that invalidates guidance a reader may have already acted on — always requires a MAJOR increment, regardless of how small the edited text appears. Determining whether a change is breaking is a reviewer responsibility under `review-process.md` (DOC-011).
