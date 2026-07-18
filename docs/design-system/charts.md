[Moscow OS Logo Placeholder]

# MOSCOW OS

**Organize. Build. Grow.**

# Charts

**Document ID:** DS-013
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

This document defines the chart types and styling conventions used in Moscow OS Reporting, Finance, and Dashboard views.

## Scope

Covers chart type selection and per-chart styling. Cross-cutting data visualization rules (color assignment, legends, tooltips) that apply across all chart types are defined in `data-visualization.md` (DS-029); this document defines the charts themselves.

---

## 1. Chart Type Selection

| Data Shape | Chart Type | Example Use |
|---|---|---|
| Trend over time | Line Chart | Revenue over the last 12 months |
| Comparison across categories | Bar Chart | Profitability by client |
| Part-to-whole | Donut Chart | Task status distribution |
| Cumulative progress | Area Chart | Cumulative invoiced amount over a project's lifetime |
| Correlation between two variables | Scatter Plot | Project duration versus profitability |

Pie charts (as distinct from donut charts) are not used in Moscow OS; a donut chart is used in every part-to-whole case, since its center space can display a total or key figure, giving it a functional advantage with no styling cost.

## 2. Axis Styling

| Property | Value |
|---|---|
| Axis line | `border-subtle` |
| Axis labels | `text-caption`, `text-tertiary` |
| Gridlines | `border-subtle` at 40% opacity, horizontal only (no vertical gridlines, to reduce visual noise) |

## 3. Series Styling

| Chart Type | Treatment |
|---|---|
| Line Chart | 2px stroke, no fill beneath the line unless explicitly an Area Chart variant |
| Bar Chart | `radius-sm` applied to the top corners only of vertical bars |
| Donut Chart | 60% inner radius relative to outer radius, 2px gap between segments |

## 4. Color Assignment

Chart series colors are assigned from the `chart-1` through `chart-8` token sequence defined in `color-system.md` (DS-003), Section 7, always in the same fixed order for a given data set across sessions, so a returning user does not see a metric's color change between visits.

## 5. Interactivity

All charts support hover-triggered tooltips (per `data-visualization.md`, DS-029, Section 3) showing the exact value at the hovered point. Line and bar charts support click-to-filter where the surrounding view supports filtering (for example, clicking a bar in a "Tasks by Assignee" chart filters the adjacent task table to that assignee).

## 6. Empty and Insufficient Data States

A chart with no data uses the empty-state pattern in `empty-states.md` (DS-022) rather than rendering an empty axis grid. A chart with data insufficient to be meaningful (for example, a trend line with only one data point) displays an explanatory message instead of a misleading single-point rendering.

## 7. Responsive Behavior

On mobile viewports, charts reduce axis label density (showing fewer tick labels) rather than shrinking text below `text-caption` size, and horizontal legends convert to a vertical stacked list, per `responsive-design.md` (DS-017).

## 8. Accessibility

Every chart includes a text-based data table alternative, accessible via a "View as table" toggle, since chart data cannot be reliably conveyed to screen reader users through the visual rendering alone, per `accessibility.md` (DS-015), Section 8.

## References

`data-visualization.md` (DS-029); `color-system.md` (DS-003); `empty-states.md` (DS-022); `responsive-design.md` (DS-017); `accessibility.md` (DS-015).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
