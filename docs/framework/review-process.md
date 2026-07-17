![Moscow OS Logo](../assets/moscow-os-logo.png)

# Review Process

**Document ID:** DOC-011
**Version:** 1.0.0
**Status:** Active
**Owner:** Engineering Leadership
**Last Updated:** 2026-07-17

---

## Purpose

This document defines how documentation and code changes to Moscow OS are reviewed and approved before merging, ensuring quality and accountability regardless of whether the change originated from a human or an AI assistant.

## Scope

Applies to all pull requests in the `moscow-os-foundation` repository, covering both code and documentation changes. Complements `github-workflow.md` (DOC-008), which defines the mechanical process rather than approval criteria.

---

## 1. Standard Review Requirement

Every pull request requires at least one approval from the owner of the affected directory, as defined in `repository-standards.md` (DOC-007), Section 3, before it can be merged.

## 2. Review Criteria by Change Type

| Change Type | Reviewer Checks |
|---|---|
| Documentation | Compliance with `documentation-standards.md` (DOC-003) and `markdown-style-guide.md` (DOC-006); correct Document ID registration per `document-numbering.md` (DOC-004) |
| Code | Correctness, test coverage, adherence to module specification, no committed secrets per `repository-standards.md` (DOC-007), Section 6 |
| Architecture | Consistency with existing architecture documents (DOC-200 range) and, where applicable, an accompanying Architecture Decision Record |

## 3. Elevated Approval: Framework Documents

Changes to any document within `docs/framework/` (the DOC-001 through DOC-013 range) are treated as governance changes. These require approval from the Documentation Architecture Team specifically, regardless of who else may have reviewer permissions on the repository, because these documents govern how every other document is written.

## 4. Elevated Approval: Architecture Changes

Changes that alter core data model relationships or introduce new external dependencies require approval from Engineering Leadership in addition to the standard directory owner, given their potential for cascading impact across modules, consistent with the technical risk noted in the System Overview (DOC-100), Section 13.1.

## 5. Handling Disagreement

Where a reviewer and an author disagree on a change, the disagreement is resolved by discussion referencing the relevant standard or specification document, not by reviewer authority alone. If no applicable standard resolves the disagreement, the directory owner makes the final call and the outcome is noted in the pull request for future reference.

## 6. Review Turnaround

Pull requests should receive an initial review response within a timeframe appropriate to the change's urgency, with documentation-only changes reviewed promptly given their lower risk profile relative to code changes.

## 7. Post-Merge Review

Merged changes remain subject to review through normal version control history. A document's Version History section, required under `versioning-policy.md` (DOC-005), Section 4, provides a durable record of what was reviewed and when.
