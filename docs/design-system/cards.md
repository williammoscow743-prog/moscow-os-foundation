[Moscow OS Logo Placeholder]

# MOSCOW OS

**Organize. Build. Grow.**

# Cards

**Document ID:** DS-009
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

This document defines the standard card component used to group related content across Moscow OS — dashboard widgets, project summaries, client records, and document previews.

## Scope

Covers the card container and its standard anatomy. Content-specific card variants (dashboard widgets) are covered further in `dashboard.md` (DS-012).

---

## 1. Anatomy

A standard card consists of, top to bottom: an optional header (title plus optional action), a body, and an optional footer (usually metadata or actions). Every part beyond the body is optional, but the body's padding and background rules apply regardless of which optional parts are present.

## 2. Base Styling

| Property | Value |
|---|---|
| Background | `bg-surface` |
| Border | `border-subtle`, 1px |
| Corner Radius | `radius-lg` |
| Padding | `space-5` |
| Elevation | `elevation-1` (border only) at rest; `elevation-2` on hover if the card is interactive |

## 3. Variants

| Variant | Usage | Distinguishing Treatment |
|---|---|---|
| Static | Displays information only, not clickable | No hover state |
| Interactive | Clickable, navigates or opens detail | `elevation-2` and `border-strong` on hover; `duration-fast` transition |
| Selected | Part of a selectable set (e.g. template picker) | `brand-build` border, `brand-build-subtle` background tint |
| Compact | Dense list contexts (e.g. a card-based task list) | Padding reduced to `space-4`, header/footer omitted |

## 4. Header

The card header uses `text-h4` for the title and, when an action is present (such as an overflow menu), right-aligns it using an Icon button per `buttons.md` (DS-007), Section 1. Header bottom margin to body is `space-4`.

## 5. Footer

The card footer is separated from the body by a `border-subtle` divider with `space-4` top padding. Footer content uses `text-caption` for metadata (e.g. "Updated 2 hours ago") or standard buttons for actions.

## 6. Cards Containing AI-Generated Content

Per the AI-Native principle in `design-principles.md` (DS-002), Section 5, any card whose body content was generated or summarized by the AI Workspace displays a small `brand-build` accent bar (4px) along its top edge and a label reading "AI Summary" in `text-caption`, so AI-attributed content is never visually indistinguishable from user-entered data.

## 7. Grid Placement

Cards are placed in a responsive grid per `grids.md` (DS-021), with `space-4` gap between cards at all breakpoints.

## 8. Accessibility

Interactive cards are implemented as a single focusable element (not nested interactive elements competing for focus), receive a visible focus ring per `accessibility.md` (DS-015), Section 3, and expose their full clickable purpose to assistive technology via an accessible name, not only via a visually separate "View" link inside the card.

## References

`design-tokens.md` (DS-031); `color-system.md` (DS-003); `elevation.md` (DS-020); `grids.md` (DS-021); `dashboard.md` (DS-012); `accessibility.md` (DS-015).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
