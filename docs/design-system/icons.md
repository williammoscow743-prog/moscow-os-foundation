[Moscow OS Logo Placeholder]

# MOSCOW OS

**Organize. Build. Grow.**

# Icons

**Document ID:** DS-006
**Version:** 1.0.0
**Status:** Active
**Author:** Design Systems Architecture Team
**Reviewer:**
**Approved By:**
**Created:** 2026-07-18
**Updated:** 2026-07-18
**Classification:** Internal

---

## Revision History

| Version | Date | Author | Summary of Changes |
|---|---|---|---|
| 1.0.0 | 2026-07-18 | Design Systems Architecture Team | Initial publication |

## Table of Contents

*[Insert generated table of contents here once the document's section structure is finalized.]*

---

## Purpose

This document defines the icon system used across Moscow OS: source library, sizing, stroke treatment, and usage rules.

## Scope

Covers interface icons used in navigation, buttons, forms, and status indicators. Does not cover illustration or marketing graphics.

---

## 1. Icon Library

Moscow OS uses the Lucide icon set exclusively, chosen for its consistent stroke-based style, broad glyph coverage, and native compatibility with the shadcn/ui component layer referenced in the System Overview (DOC-100), Section 8. Custom icons are only introduced when no equivalent Lucide glyph exists, and any custom icon must be built to match Lucide's stroke weight and grid conventions exactly.

## 2. Icon Sizes

| Token | Size | Usage |
|---|---|---|
| `icon-sm` | 16px | Inline with `text-body-sm` or `text-caption`, dense table rows |
| `icon-md` | 20px | Default size: buttons, form fields, navigation items |
| `icon-lg` | 24px | Section headers, empty-state illustrations, standalone action icons |
| `icon-xl` | 32px | Empty states, onboarding, feature highlights |

## 3. Stroke Width

All icons use a consistent 1.5px stroke at `icon-md` and above, scaling proportionally at `icon-sm` where Lucide's default rendering already compensates for size. Stroke width is never manually adjusted per instance; changing perceived weight is done by size, not stroke thickness.

## 4. Icon Color

Icons inherit `text-secondary` by default and shift to `text-primary` on hover or when adjacent to active/selected text, using the same color tokens defined in `color-system.md` (DS-003), Section 3. Icons conveying semantic meaning (success, warning, danger, info) use the corresponding semantic token from `color-system.md` (DS-003), Section 6, never a neutral color.

## 5. Spacing Around Icons

| Context | Gap to Adjacent Text |
|---|---|
| Icon inside a button, before label | `space-2` |
| Icon inside a navigation item | `space-3` |
| Standalone icon button padding | `space-2` on all sides |

## 6. Icon-Only Buttons

Every icon-only interactive element must have an accessible label via `aria-label`, since no visible text is present to convey its purpose, per `accessibility.md` (DS-015), Section 6. Icon-only buttons never rely on a tooltip alone to convey their function.

## 7. Naming Convention

Icon usage in code references Lucide's own component naming directly (e.g. `ChevronDown`, `Trash2`) with no Moscow OS-specific aliasing layer, so that icon usage stays traceable to its source library without an extra translation step.

## 8. Usage Rules

- Icons are never used as the sole conveyor of meaning without an accompanying text label, except in a small, explicitly documented set of universally understood cases (search, close, more options) listed in `component-library.md` (DS-018).
- The same icon is never used for two different meanings within the same view.
- Decorative icons (with no functional meaning) are marked `aria-hidden="true"`.

## References

`design-tokens.md` (DS-031); `color-system.md` (DS-003); `accessibility.md` (DS-015); `component-library.md` (DS-018); System Overview (DOC-100), Section 8.

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
