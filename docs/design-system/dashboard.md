[Moscow OS Logo Placeholder]

# MOSCOW OS

**Organize. Build. Grow.**

# Dashboard

**Document ID:** DS-012
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

This document defines the layout and widget conventions specific to the Dashboard module described in the System Overview (DOC-100), Section 6.1, which serves as the primary situational-awareness surface of Moscow OS.

## Scope

Covers dashboard-specific widget types and grid behavior. General card styling is defined in `cards.md` (DS-009); this document covers what makes a dashboard widget a specialized card variant.

---

## 1. Dashboard Grid

The dashboard uses a 12-column responsive grid (per `grids.md`, DS-021) into which widgets are placed at fixed column spans: full-width (12), half-width (6), one-third (4), or quarter-width (3). Widgets do not use arbitrary spans outside this set, so the dashboard remains visually orderly as widgets are added or rearranged.

## 2. Widget Types

| Widget Type | Typical Span | Purpose |
|---|---|---|
| KPI Card | 3 | A single key metric with a trend indicator (e.g. "Active Projects: 12, up 2 this week") |
| List Widget | 4 or 6 | A short, scannable list (e.g. upcoming deadlines, overdue tasks) |
| Chart Widget | 6 or 12 | A visualization per `charts.md` (DS-013) |
| Activity Feed | 4 | Recent changes across projects, clients, and documents |
| AI Summary Widget | 6 or 12 | AI Workspace-generated summary, styled per the AI-attribution rule in `cards.md` (DS-009), Section 6 |

## 3. KPI Card Anatomy

A KPI Card displays, top to bottom: a `text-label` metric name, a `text-display` or `text-h1` value, and a compact trend indicator combining a directional arrow icon and a percentage or delta value in the relevant semantic color (`semantic-success` for positive trends, `semantic-danger` for negative ones, with the polarity of "positive" defined per metric — for example, a rising overdue-task count is a negative trend despite being an upward arrow).

## 4. Widget Header Actions

Every widget includes a minimal header with its title (`text-h4`) and, where applicable, a single overflow menu (Icon button) for widget-level actions (refresh, configure, remove). Widgets do not carry more than one primary action in their header, consistent with the Minimal principle in `design-principles.md` (DS-002), Section 2.

## 5. Widget Loading and Empty States

Each widget independently manages its own loading (`loading-states.md`, DS-023) and empty (`empty-states.md`, DS-022) state, so a slow-loading widget does not block the rest of the dashboard from rendering.

## 6. Refresh Behavior

Dashboard data refreshes automatically at a defined interval and the Dashboard displays a subtle "Updated [time]" timestamp in `text-caption` in the page header, so the user always knows the currency of what they are viewing without needing to manually refresh.

## 7. Responsive Behavior

Below the `md` breakpoint (per `responsive-design.md`, DS-017), all widgets collapse to full width (span 12) and stack vertically in priority order: KPI Cards first, then Chart Widgets, then List Widgets and Activity Feed.

## References

`cards.md` (DS-009); `grids.md` (DS-021); `charts.md` (DS-013); `loading-states.md` (DS-023); `empty-states.md` (DS-022); `responsive-design.md` (DS-017); System Overview (DOC-100), Section 6.1.

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
