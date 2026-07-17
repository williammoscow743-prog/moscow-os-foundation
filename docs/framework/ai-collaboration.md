![Moscow OS Logo](../assets/moscow-os-logo.png)

# AI Collaboration Guide

**Document ID:** DOC-009
**Version:** 1.0.0
**Status:** Active
**Owner:** Documentation Architecture Team
**Last Updated:** 2026-07-17

---

## Purpose

This document defines how ChatGPT, Claude, Loveable, and human contributors collaborate on the Moscow OS codebase and documentation, ensuring consistent output regardless of which assistant produces it.

## Scope

Applies to any use of an AI assistant to generate, modify, or review Moscow OS code or documentation. Does not cover the AI Workspace product module itself, which is an end-user-facing feature defined in the Modules documentation set (DOC-300 range).

---

## 1. Why a Shared Collaboration Model Is Needed

Moscow OS is built with contributions from multiple AI assistants, each with different strengths, alongside human engineers and designers. Without a shared model for how these contributors hand off work to one another, documentation and code drift apart in style, structure, and accuracy. This document exists to prevent that drift.

## 2. Roles by Assistant

| Assistant | Primary Role in Moscow OS Development |
|---|---|
| ChatGPT | Product reasoning, planning, and drafting long-form documentation and specifications |
| Claude | Structured document generation, codebase-aware editing, and repository operations |
| Loveable | Rapid frontend implementation and iteration in coordination with the design system |
| Human Contributors | Final review, architectural decisions, approval, and judgment calls not delegable to AI |

These roles are a working default, not a hard restriction — any assistant may be used for any task where it produces better results, provided the output meets the standards in `documentation-standards.md` (DOC-003) or the engineering standards in `repository-standards.md` (DOC-007).

## 3. Grounding Context Requirement

Before an AI assistant generates or modifies Moscow OS documentation or code, it must be given the relevant grounding context rather than working from general knowledge alone:

- For documentation tasks: `documentation-standards.md` (DOC-003), `markdown-style-guide.md` (DOC-006), and `document-numbering.md` (DOC-004).
- For code tasks: the relevant module's specification under `docs/modules/`, and `repository-standards.md` (DOC-007).
- For prompt construction itself: `prompt-writing-guide.md` (DOC-010).

Output produced without this grounding context should be treated as a first draft requiring additional review, not as directly mergeable.

## 4. Consistency Across Assistants

Because different assistants may draft different parts of the same document set over time, all AI-generated content is subject to the same non-negotiable requirements:

- No filler or marketing language, per `documentation-standards.md` (DOC-003), Section 2.
- Consistent Document ID and metadata usage, per `document-numbering.md` (DOC-004).
- No fabricated technical claims about the system's current state; roadmap or aspirational content must be clearly labeled as such, consistent with the distinction drawn in the System Overview (DOC-100), Section 5.

## 5. Attribution and Traceability

Pull requests containing AI-assisted work note which assistant was used, consistent with `github-workflow.md` (DOC-008), Section 6. This is for traceability, not restriction — it allows future contributors to understand the provenance of a given document or code change if questions arise later.

## 6. Human Review Remains Mandatory

No AI-generated documentation or code is merged without human review, per the approval rules in `review-process.md` (DOC-011). AI assistants may draft, structure, and even self-check against the standards referenced above, but final judgment on correctness, scope, and business fit remains a human responsibility.

## 7. Handling Disagreement Between Assistants

Where two AI-assisted contributions conflict (for example, differing architectural suggestions), the conflict is resolved by a human reviewer with reference to the authoritative architecture documents under `docs/architecture/` (DOC-200 range), not by preferring one assistant's output over another by default.
