[Moscow OS Logo Placeholder]

# MOSCOW OS

**Organize. Build. Grow.**

# Empty States

**Document ID:** DS-022
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

This document defines how Moscow OS presents views with no data to show, ensuring an empty view still helps the user understand what to do next rather than appearing broken.

## Scope

Covers empty states for lists, tables, dashboards, and search results. Error conditions, where data failed to load rather than legitimately not existing, are covered in `error-states.md` (DS-024).

---

## 1. When an Empty State Applies

An empty state is shown whenever a view's primary content collection has zero items, distinct from a loading state (data not yet fetched, per `loading-states.md`, DS-023) and an error state (data failed to fetch, per `error-states.md`, DS-024).

## 2. Anatomy

An empty state consists of: an icon (`icon-xl`, `text-tertiary`) representing the entity type, a short headline (`text-h4`) stating the absence plainly (for example, "No projects yet"), a single line of supporting text (`text-body-sm`, `text-secondary`) explaining why or what to do, and, where a next action exists, a Primary button (`buttons.md`, DS-007) to take that action.

## 3. Categories of Empty State

| Category | Example | Copy Approach |
|---|---|---|
| First-use (nothing created yet) | New organization's Projects list | Encouraging, action-oriented ("Create your first project to get started") |
| Filtered-to-zero | Table filtered to a status with no matches | Neutral, offers a way to reset ("No tasks match your filters" + a "Clear filters" action) |
| Completed / cleared | Inbox with no unread notifications | Positive framing ("You're all caught up") |
| Permission-restricted | Module section hidden pending upgrade or role | Explains the restriction plainly, without implying it is an error |

## 4. Placement and Sizing

Full-page empty states (an entire module with no data) center within the Content Area with `space-16` vertical padding. Widget-level empty states (a single dashboard widget with no data) use `space-8` padding and a smaller icon (`icon-lg`), scaled to the widget's size rather than the full page.

## 5. Tone

Empty-state copy avoids humor or playful illustration, consistent with the Professional principle in `design-principles.md` (DS-002), Section 3, since these views may be seen in client-facing or investor-facing contexts (a shared Project view, for instance).

## 6. Accessibility

The empty-state headline is rendered as an actual heading element (not merely styled text) so screen reader users navigating by heading can identify the empty condition without reading full paragraph content.

## References

`design-principles.md` (DS-002); `loading-states.md` (DS-023); `error-states.md` (DS-024); `buttons.md` (DS-007); `icons.md` (DS-006).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
