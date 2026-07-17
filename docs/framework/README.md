![Moscow OS Logo](../assets/moscow-os-logo.png)

# Moscow OS Documentation Framework

**Document ID:** DOC-001
**Version:** 1.0.0
**Status:** Active
**Owner:** Documentation Architecture Team
**Last Updated:** 2026-07-17

---

## Purpose

This document is the entry point to the Moscow OS documentation system. It orients any reader — human or AI — to what documentation exists, how it is organized, and where to go next depending on their role and task.

## Scope

This README applies to the `docs/framework/` directory only: the set of foundational documents that govern how all other Moscow OS documentation (product specs, module docs, API references, runbooks, etc.) is created, structured, versioned, and maintained. It does not itself contain product or feature documentation.

---

## What This Framework Governs

The Moscow OS documentation system is designed to scale from its current foundational state to a mature library of 250–400 pages spanning product specifications, architecture records, module references, operational runbooks, and AI-collaboration guides — without losing consistency or navigability.

This framework directory defines the rules that make that scale possible:

| Document | Document ID | Purpose |
|---|---|---|
| `documentation-framework.md` | DOC-002 | Defines the overall structure and lifecycle of Moscow OS documentation |
| `documentation-standards.md` | DOC-003 | Defines writing, structure, and quality standards for every document |
| `document-numbering.md` | DOC-004 | Defines the DOC-ID scheme and category ranges |
| `versioning-policy.md` | DOC-005 | Defines how documents and the product itself are versioned |
| `markdown-style-guide.md` | DOC-006 | Defines Markdown formatting conventions |
| `repository-standards.md` | DOC-007 | Defines repository structure and file/folder naming rules |
| `github-workflow.md` | DOC-008 | Defines branching, commit, and pull request conventions |
| `ai-collaboration.md` | DOC-009 | Defines how ChatGPT, Claude, Loveable, and human contributors work together |
| `prompt-writing-guide.md` | DOC-010 | Defines how to write effective prompts against this codebase and documentation |
| `review-process.md` | DOC-011 | Defines how documents and code changes are reviewed and approved |
| `release-process.md` | DOC-012 | Defines how product and documentation releases are staged and shipped |
| `glossary.md` | DOC-013 | Defines canonical terminology used across all Moscow OS documentation |

## How to Use This Framework

- **New human contributors** should read `documentation-framework.md`, `repository-standards.md`, and `github-workflow.md` before their first contribution.
- **AI coding assistants** (ChatGPT, Claude, Loveable) should be given `ai-collaboration.md` and `prompt-writing-guide.md` as grounding context before being asked to generate or modify documentation or code.
- **Reviewers and approvers** should follow `review-process.md` for every documentation and code change.
- **Anyone writing a new document** should follow `documentation-standards.md`, `document-numbering.md`, and `markdown-style-guide.md` together — these three files define what a compliant Moscow OS document looks like.

## Document Lifecycle Summary

Every document in the Moscow OS system carries a Document ID, a semantic version, an owner, and a status (`Draft`, `Active`, `Deprecated`, or `Superseded`). Full lifecycle rules are defined in `documentation-framework.md` (DOC-002) and `versioning-policy.md` (DOC-005).

## Maintaining This Framework

Changes to any file in `docs/framework/` are treated as governance changes, not content changes, and require review under the elevated approval rules defined in `review-process.md` (DOC-011), Section 4.
