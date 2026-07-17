![Moscow OS Logo](../assets/moscow-os-logo.png)

# Documentation Standards

**Document ID:** DOC-003
**Version:** 1.0.0
**Status:** Active
**Owner:** Documentation Architecture Team
**Last Updated:** 2026-07-17

---

## Purpose

This document defines the writing, structural, and quality standards that every Moscow OS document must meet, regardless of category or author. It exists to ensure consistency across documents written by different human contributors and different AI assistants over time.

## Scope

Applies to all documents defined under `documentation-framework.md` (DOC-002). Does not apply to informal working notes, meeting minutes, or draft brainstorms that are not intended to enter the permanent documentation set.

---

## 1. Required Header Elements

Every document must begin with, in order:

1. Logo placeholder image reference
2. H1 title matching the document's registered name in `document-numbering.md` (DOC-004)
3. A metadata block containing: Document ID, Version, Status, Owner, Last Updated
4. A horizontal rule
5. A `## Purpose` section (one to three sentences: what this document is for)
6. A `## Scope` section (what this document covers and, where useful, what it explicitly does not cover)
7. A second horizontal rule before the main content begins

Documents missing any of these elements are non-compliant and must not be marked `Active`.

## 2. Writing Standards

- Write in plain, direct, professional English. Avoid marketing language, superlatives, and filler transitions.
- Every section must provide practical, actionable, or reference-grade content. Sections that restate the section heading in prose without adding information must be removed or merged.
- Use active voice and present tense for descriptions of current system behavior. Use future tense only for explicitly labeled roadmap or planned content.
- Define acronyms and Moscow OS-specific terms on first use per document, or link to `glossary.md` (DOC-013).
- Avoid duplicating content that already exists in another document. Reference the authoritative document by ID instead of restating its content.

## 3. Structural Standards

- Use numbered `##` sections for main content, in the order a reader needs them (foundational concepts before advanced ones).
- Use tables for any content that is naturally tabular (comparisons, enumerations with attributes, mappings) rather than bulleted prose.
- Limit heading depth to three levels (`##`, `###`, `####`). Deeper nesting indicates the document should be split.
- Every document longer than approximately 15 sections should be evaluated for splitting into two documents under `document-numbering.md` (DOC-004) rather than growing indefinitely.

## 4. Cross-Referencing Standards

- Reference other documents as `document-name.md (DOC-XXX)` on first mention within a section.
- Do not use bare hyperlinks to other framework documents without the Document ID; filenames may change during future refactors, and the ID is the stable identifier.
- When a document depends on a concept fully defined elsewhere (for example, versioning rules), reference it rather than re-explaining it.

## 5. Ownership and Update Standards

- Every substantive change to an `Active` document must update the `Last Updated` field.
- Version increments follow `versioning-policy.md` (DOC-005); the `Last Updated` date alone does not indicate a version change.
- A document owner (per `documentation-framework.md`, Section 4) must approve any change before it is merged, per `review-process.md` (DOC-011).

## 6. Quality Checklist

Before a document is marked `Active`, it must satisfy:

- [ ] Header elements complete (Section 1)
- [ ] No filler or marketing language (Section 2)
- [ ] Section structure follows numbering and depth rules (Section 3)
- [ ] All cross-references use Document IDs (Section 4)
- [ ] Reviewed and approved per `review-process.md` (DOC-011)
- [ ] Registered in `document-numbering.md` (DOC-004) with a permanent Document ID

## 7. Standards for AI-Authored Content

Documents authored or substantially drafted by an AI assistant are held to the same standards as human-authored documents — there is no separate quality bar. AI assistants generating documentation must be given this document, `markdown-style-guide.md` (DOC-006), and `document-numbering.md` (DOC-004) as context before drafting, consistent with `ai-collaboration.md` (DOC-009).
