[Moscow OS Logo Placeholder]

# MOSCOW OS

**Organize. Build. Grow.**

# Tables

**Document ID:** DS-010
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

This document defines the standard data table used across Moscow OS — task lists, client records, invoices, and reports — since tables are the primary way dense, enterprise-scale data is presented, per the Enterprise principle in `design-principles.md` (DS-002), Section 4.

## Scope

Covers table structure, states, sorting, filtering, and row-level interactions. Chart-based data presentation is covered separately in `charts.md` (DS-013).

---

## 1. Structure

| Element | Styling |
|---|---|
| Header row | `bg-surface`, `text-label` styling per `typography.md` (DS-004), sticky on vertical scroll |
| Body row | `bg-canvas`, `border-subtle` bottom divider, `space-3` vertical / `space-4` horizontal cell padding |
| Row (hover) | `bg-surface` background fade-in, `duration-instant` |
| Row (selected) | `brand-build-subtle` background, persists independent of hover |

## 2. Column Types

| Type | Alignment | Notes |
|---|---|---|
| Text | Left | Default |
| Numeric / Currency | Right | Uses tabular figures per `typography.md` (DS-004), Section 5 |
| Status | Left | Rendered as a Badge component, per `component-library.md` (DS-018) |
| Date | Left | Uses relative formatting ("2 days ago") with absolute date on hover tooltip |
| Actions | Right | Icon buttons or overflow menu, per `buttons.md` (DS-007) |

## 3. Sorting

A sortable column header displays a directional chevron icon (`icon-sm`) that appears on hover and persists once a sort is active. Only one column is sorted at a time by default; multi-column sort, where supported, is indicated with a numbered badge on each active sort column.

## 4. Filtering

Column-level filters are accessed via an icon trigger in the header cell, opening a popover per `color-system.md` (DS-003) overlay conventions. Active filters are indicated by a filled (rather than outline) filter icon and are also surfaced as removable filter chips above the table.

## 5. Row Selection

Selectable tables include a checkbox column, left-most, using the Checkbox component from `forms.md` (DS-008), Section 5. A header checkbox supports select-all, with an indeterminate state when some but not all visible rows are selected.

## 6. Empty and Loading States

An empty table (no rows matching current filters) follows `empty-states.md` (DS-022). A loading table uses skeleton rows per `loading-states.md` (DS-023) rather than a centered spinner, so the table's column structure remains visible while data loads.

## 7. Pagination

Tables exceeding 25 rows use pagination controls below the table, right-aligned, showing current range ("1–25 of 340") and next/previous navigation. Infinite scroll is not used for primary data tables, since it conflicts with the ability to reference a specific row position in conversation or documentation.

## 8. Responsive Behavior

On mobile viewports, tables either horizontally scroll within a bounded container with a persistent left-most identifying column, or collapse into a card-per-row layout per `responsive-design.md` (DS-017), Section 6 — the choice is made per table based on column count and is documented in the relevant module's UI/UX design document.

## 9. Accessibility

Tables use semantic `<table>`, `<th>`, and `scope` attributes rather than div-based grid layouts, so screen readers can navigate rows and columns natively. Sortable column headers expose their current sort state via `aria-sort`, per `accessibility.md` (DS-015), Section 6.

## References

`design-tokens.md` (DS-031); `typography.md` (DS-004); `component-library.md` (DS-018); `empty-states.md` (DS-022); `loading-states.md` (DS-023); `responsive-design.md` (DS-017); `accessibility.md` (DS-015).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
