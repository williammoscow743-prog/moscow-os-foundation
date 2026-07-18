[Moscow OS Logo Placeholder]

# MOSCOW OS

**Organize. Build. Grow.**

# Data Visualization

**Document ID:** DS-029
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

This document defines the cross-cutting rules that apply to every data visualization in Moscow OS, regardless of chart type, in support of the Business Intelligence objective in the System Overview (DOC-100), Section 3.4.

## Scope

Covers legends, tooltips, data labeling, and color-assignment rules shared across all charts. Chart-type-specific styling is defined in `charts.md` (DS-013).

---

## 1. Legends

A legend is shown whenever a visualization has more than one series and the series cannot be unambiguously identified by axis or label alone. Legends use `text-caption` labels with a small color swatch matching the series' assigned `chart-#` token, positioned below the chart on mobile and to the right on desktop, per `responsive-design.md` (DS-017), Section 7.

## 2. Legend Interaction

Clicking a legend item toggles that series' visibility within the chart, allowing users to isolate specific data without needing a separate filter control. A hidden series' legend item renders at reduced opacity (`text-tertiary`) to indicate its inactive state.

## 3. Tooltips

Hovering (or, on touch devices, tapping) a data point displays a tooltip using the overlay styling from `color-system.md` (DS-003), Section 1 (`bg-surface-overlay`, `elevation-3`), showing the precise value, the series name, and the axis label (e.g. the date) for that point. Tooltips never require more than a glance to read — no more than three lines of content.

## 4. Number Formatting

All values follow the tabular figure and currency formatting rules in `typography.md` (DS-004), Section 5. Large numbers are abbreviated in axis labels (e.g. "$12.4K") but shown in full precision within tooltips, so at-a-glance scanning and precise reading are both supported.

## 5. Color Assignment Consistency

A given data category (for example, a specific client or a specific task status) is assigned the same `chart-#` token everywhere it appears across the product, not re-assigned per view, so a user who has learned "blue means Client A" on the Dashboard does not need to relearn the mapping on the Reports page.

## 6. Comparative Visualizations

Where a visualization compares a metric against a prior period or a target (for example, actual revenue versus forecast), the comparison series uses a consistent visual treatment — a dashed line or reduced-opacity fill — rather than a second solid `chart-#` color, so it reads clearly as a reference rather than an equal peer series.

## 7. Avoiding Misleading Representation

Bar and column chart axes always start at zero unless a truncated axis is explicitly labeled and justified (for example, a zoomed view of a narrow value range), to avoid visually exaggerating differences. Dual-axis charts (two different scales on one chart) are avoided wherever a single-axis alternative can convey the same comparison, since dual axes are a common source of misread data.

## 8. Accessibility

Every visualization provides the text-table alternative required in `charts.md` (DS-013), Section 8, and color is never the sole means of distinguishing series — a distinct pattern, marker shape, or direct labeling is used alongside color wherever feasible, per `accessibility.md` (DS-015), Section 4.

## References

System Overview (DOC-100), Section 3.4; `charts.md` (DS-013); `color-system.md` (DS-003); `typography.md` (DS-004); `responsive-design.md` (DS-017); `accessibility.md` (DS-015).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
