[Moscow OS Logo Placeholder]

# MOSCOW OS

**Organize. Build. Grow.**

# Spacing

**Document ID:** DS-005
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

This document defines the Moscow OS spacing system and the rules for applying it consistently across margins, padding, containers, and layout sections.

## Scope

Covers all spacing decisions in the product UI. Grid-specific column and gutter spacing is covered in `grids.md` (DS-021), which builds on the scale defined here.

---

## 1. The 8-Point Scale

Moscow OS uses an 8-point base unit with 4px half-steps available for fine adjustments at small sizes. Every spacing value in the product must come from this scale — no arbitrary pixel values are permitted, consistent with the Consistent principle in `design-principles.md` (DS-002), Section 9.

| Token | Value (px / rem) | Typical Usage |
|---|---|---|
| `space-0` | 0px | Reset |
| `space-1` | 4px / 0.25rem | Icon-to-label gap, tight inline spacing |
| `space-2` | 8px / 0.5rem | Compact padding, small gaps between related elements |
| `space-3` | 12px / 0.75rem | Default gap between form fields |
| `space-4` | 16px / 1rem | Default card padding, standard element gap |
| `space-5` | 20px / 1.25rem | Comfortable card padding |
| `space-6` | 24px / 1.5rem | Section internal padding |
| `space-8` | 32px / 2rem | Gap between major page sections |
| `space-10` | 40px / 2.5rem | Large section separation |
| `space-12` | 48px / 3rem | Page-level top padding on desktop |
| `space-16` | 64px / 4rem | Hero or empty-state vertical spacing |
| `space-20` | 80px / 5rem | Maximum standard spacing value |
| `space-24` | 96px / 6rem | Reserved for exceptional full-page empty states |

## 2. Padding Conventions

| Component Type | Padding Token |
|---|---|
| Button (medium) | `space-2` vertical, `space-4` horizontal |
| Card | `space-5` |
| Modal | `space-6` |
| Input field | `space-2` vertical, `space-3` horizontal |
| Table cell | `space-3` vertical, `space-4` horizontal |

## 3. Margin and Gap Conventions

| Context | Token |
|---|---|
| Gap between form fields in a stacked form | `space-4` |
| Gap between cards in a grid | `space-4` |
| Gap between dashboard widgets | `space-6` |
| Gap between icon and adjacent label | `space-2` |
| Gap between page header and page content | `space-8` |

## 4. Containers

| Container | Max Width | Horizontal Padding |
|---|---|---|
| Standard page content | 1440px | `space-6` (desktop), `space-4` (mobile) |
| Modal (medium) | 560px | `space-6` |
| Modal (large) | 800px | `space-6` |
| Sidebar | 280px (expanded), 72px (collapsed) | `space-3` |

## 5. Section Spacing

Page-level sections (for example, the distinct blocks within a Reports view) are separated by `space-8` on desktop and `space-6` on mobile, reflecting the reduced available vertical space rather than reducing information density.

## 6. Responsive Spacing Adjustment

On mobile viewports, all padding and gap values one step above `space-6` are reduced by one step (for example, `space-8` becomes `space-6`) to preserve content density without crowding, per `responsive-design.md` (DS-017). Values `space-6` and below remain constant across breakpoints, since they are already small enough not to require adjustment.

## References

`design-principles.md` (DS-002); `design-tokens.md` (DS-031); `grids.md` (DS-021); `responsive-design.md` (DS-017).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
