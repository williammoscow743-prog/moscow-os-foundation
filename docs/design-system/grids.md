[Moscow OS Logo Placeholder]

# MOSCOW OS

**Organize. Build. Grow.**

# Grids

**Document ID:** DS-021
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

This document defines the Moscow OS grid system: the column structure that underlies dashboard widgets, card layouts, and page composition.

## Scope

Covers the grid's column count, gutters, and responsive behavior. Breakpoint definitions themselves are defined in `responsive-design.md` (DS-017); this document defines the grid built on top of them.

---

## 1. Column Count by Breakpoint

| Breakpoint | Columns | Gutter |
|---|---|---|
| `bp-xs` / `bp-sm` | 4 | `space-4` |
| `bp-md` | 8 | `space-4` |
| `bp-lg` / `bp-xl` | 12 | `space-4` |

## 2. Column Spans

Elements placed in the grid span a whole number of columns; fractional spans are not used. At the 12-column breakpoint, the standard spans available are 12 (full), 6 (half), 4 (third), and 3 (quarter), matching the Dashboard widget spans defined in `dashboard.md` (DS-012), Section 1. At the 8-column breakpoint, spans reduce proportionally: 8 (full), 4 (half). At the 4-column breakpoint, only full-width (4) spans are typically used.

## 3. Gutters and Margins

The gutter between columns is `space-4` at all breakpoints, per `spacing.md` (DS-005). Outer page margins are `space-6` on desktop (`bp-lg`/`bp-xl`) and `space-4` on mobile and tablet (`bp-xs` through `bp-md`).

## 4. Card Grids

Card grids (used for list views showing cards rather than tables, per `layouts.md`, DS-019, Section 2) use the same column structure: a card grid at `bp-lg` typically spans 4 columns per card (three cards per row within 12 columns), adjusting to 2 columns per card at `bp-md` and full width at `bp-xs`/`bp-sm`.

## 5. Nested Grids

A grid may be nested within a single column of a parent grid (for example, a detail page's main content column containing its own internal two-column layout for related widgets). Nested grids restart their own column count relative to their container's width, not the page's total width.

## 6. Alignment

Grid items align to the top of their row by default. Where visual balance requires it (for example, a row of KPI cards with a taller neighboring widget), items may be configured to stretch to match the row's tallest item, applied consistently within that specific layout rather than left inconsistent.

## References

`spacing.md` (DS-005); `responsive-design.md` (DS-017); `dashboard.md` (DS-012); `cards.md` (DS-009); `layouts.md` (DS-019).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
