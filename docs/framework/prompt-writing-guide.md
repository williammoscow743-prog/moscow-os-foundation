![Moscow OS Logo](../assets/moscow-os-logo.png)

# Prompt Writing Guide

**Document ID:** DOC-010
**Version:** 1.0.0
**Status:** Active
**Owner:** Documentation Architecture Team
**Last Updated:** 2026-07-17

---

## Purpose

This document defines how to write effective prompts when directing an AI assistant to generate, modify, or review Moscow OS code or documentation, so that output is consistent, grounded, and requires minimal rework.

## Scope

Applies to prompts directed at any AI assistant working on the Moscow OS repository, including ChatGPT, Claude, and Loveable. Complements `ai-collaboration.md` (DOC-009), which defines roles and responsibilities rather than prompt construction.

---

## 1. Core Principles

- **State the deliverable explicitly.** Specify the exact file, document type, or artifact expected, not just the topic.
- **Provide grounding context, not assumptions.** Reference or attach the specific standards documents that apply (see Section 2) rather than assuming the assistant has them in context.
- **Specify scope boundaries.** State what is explicitly out of scope for the request, especially when working within a defined Product Scope such as the System Overview (DOC-100), Section 5.
- **Avoid ambiguous quantities.** State exact counts, ranges, or structures (for example, "13 files" rather than "several files") to avoid inconsistent output.

## 2. Required Context by Task Type

| Task Type | Required Context to Provide |
|---|---|
| New documentation file | `documentation-standards.md` (DOC-003), `markdown-style-guide.md` (DOC-006), `document-numbering.md` (DOC-004) |
| Code implementation | Relevant module spec (`docs/modules/`), `repository-standards.md` (DOC-007) |
| Repository operations (commits, branches) | `github-workflow.md` (DOC-008) |
| Architecture change | Relevant architecture document (`docs/architecture/`), and any related ADRs |
| Review or audit of existing content | The document(s) under review plus the standards they must meet |

## 3. Prompt Structure

An effective prompt for Moscow OS work generally includes, in order:

1. The role or perspective the assistant should take (for example, "You are the Documentation Architect for Moscow OS").
2. The deliverable, stated precisely.
3. The exact file or folder structure expected, where applicable.
4. The standards or constraints that apply, referenced by Document ID.
5. The output format expected (inline chat output, a created file, a committed change).

## 4. Common Failure Modes to Avoid

- **Under-specifying output format**, leading to ambiguity about whether the assistant should create files, commit changes, or simply display content in chat.
- **Omitting Document ID context**, resulting in duplicate or conflicting numbering.
- **Requesting filler content** implicitly by asking for documents "as long as possible" rather than "as complete as necessary" — Moscow OS documentation standards explicitly prohibit filler, per `documentation-standards.md` (DOC-003), Section 2.
- **Assuming persistent memory across sessions.** Each new session with an AI assistant should restate or re-attach relevant grounding context rather than assuming prior context carries forward.

## 5. Example Prompt Pattern

```
You are [role] for Moscow OS.
Task: [precise deliverable]
Structure: [exact file/folder structure, if applicable]
Standards: Follow [Document IDs] for structure and style.
Output: [inline / file creation / repository commit]
```

## 6. Iterating on AI Output

When requesting revisions, reference the specific section or requirement that was not met rather than requesting a full regeneration, unless the structural issue is pervasive. This produces more targeted, reviewable diffs consistent with the pull request practices in `github-workflow.md` (DOC-008), Section 3.
