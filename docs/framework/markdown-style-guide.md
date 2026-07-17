![Moscow OS Logo](../assets/moscow-os-logo.png)

# Markdown Style Guide

**Document ID:** DOC-006
**Version:** 1.0.0
**Status:** Active
**Owner:** Documentation Architecture Team
**Last Updated:** 2026-07-17

---

## Purpose

This document defines the Markdown formatting conventions used consistently across all Moscow OS documentation, ensuring a uniform reading and rendering experience regardless of the author.

## Scope

Applies to all `.md` files under `docs/`. Does not apply to code comments or non-Markdown configuration files.

---

## 1. Logo Placeholder

Every document begins with a logo placeholder using the following exact syntax:

```
![Moscow OS Logo](../assets/moscow-os-logo.png)
```

The relative path must be adjusted to correctly resolve to `docs/assets/moscow-os-logo.png` from the document's actual location. Documents must not omit this line, even before the final logo asset exists in the repository.

## 2. Headings

- H1 (`#`) is reserved for the document title and appears exactly once per document.
- H2 (`##`) is used for main sections and is always numbered in the visible section title where the document has more than three sections (for example, `## 1. Purpose`).
- H3 (`###`) is used for subsections within an H2.
- H4 (`####`) is the maximum permitted depth; anything requiring deeper nesting should be split into a separate document per `documentation-standards.md` (DOC-003), Section 3.

## 3. Metadata Blocks

Metadata immediately follows the title, using bold labels on individual lines, in this fixed order: Document ID, Version, Status, Owner, Last Updated. A horizontal rule (`---`) separates the metadata block from the Purpose section.

## 4. Tables

Tables are used for any enumerable, attributed content (comparisons, mappings, registries). Tables always include a header row. Column alignment is left-aligned by default unless numeric data benefits from right alignment.

## 5. Code Blocks

Fenced code blocks always declare a language where applicable (`markdown`, `typescript`, `bash`) to enable correct syntax highlighting. Inline code uses single backticks for file names, identifiers, commands, and Document IDs referenced mid-sentence.

## 6. Lists

- Use hyphens (`-`) for unordered lists, not asterisks or plus signs.
- Use numbered lists only where sequence or priority is meaningful (steps, ranked criteria); use unordered lists otherwise.
- Checklists use GitHub-flavored task list syntax (`- [ ]`) where a document defines a completion gate, as in `documentation-standards.md` (DOC-003), Section 6.

## 7. Links and Cross-References

- Cross-references to other Moscow OS documents follow the pattern `document-name.md (DOC-XXX)`, per `documentation-standards.md` (DOC-003), Section 4.
- External links use full URLs and descriptive link text; avoid bare URLs in prose.

## 8. Emphasis

- **Bold** is used for metadata labels, defined terms on first use, and critical warnings.
- *Italics* are used sparingly, primarily for document or file names mentioned in prose outside of code formatting.
- Do not use bold or italics for entire sentences or paragraphs; this reduces their signaling value.

## 9. Prohibited Elements

- No emojis in any Moscow OS documentation.
- No horizontal rules except immediately after the metadata block and, where used, before a Version History section.
- No embedded HTML except where Markdown cannot express a required structure (rare; requires reviewer approval per `review-process.md`, DOC-011).
