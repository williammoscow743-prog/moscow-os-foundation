[Moscow OS Logo Placeholder]

# MOSCOW OS

**Organize. Build. Grow.**

# Animations

**Document ID:** DS-016
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

This document defines the motion standards for Moscow OS: transition durations, easing curves, and where animation is and is not used, in service of the Performance-Focused principle in `design-principles.md` (DS-002), Section 10.

## Scope

Covers all UI motion — hover transitions, state changes, loading animation, and page-level transitions.

---

## 1. Duration Scale

| Token | Duration | Usage |
|---|---|---|
| `duration-instant` | 100ms | Micro-interactions: hover background fades, checkbox toggle |
| `duration-fast` | 150ms | Button state changes, tooltip appearance |
| `duration-base` | 200ms | Dropdown and popover open/close, tab switching |
| `duration-moderate` | 300ms | Modal open/close, drawer slide-in |
| `duration-slow` | 400ms | Page-level transitions (used sparingly) |

No animation in the product exceeds `duration-slow`; longer durations read as sluggish and work against the Fast principle referenced in the System Overview (DOC-100), Section 10.

## 2. Easing Curves

| Token | Curve | Usage |
|---|---|---|
| `easing-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Default for most transitions: balanced acceleration and deceleration |
| `easing-decelerate` | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering the screen (modals, drawers, dropdowns opening) |
| `easing-accelerate` | `cubic-bezier(0.4, 0, 1, 1)` | Elements exiting the screen (modals, drawers, dropdowns closing) |

## 3. Hover and Focus Transitions

Hover and focus state changes (color, background, border) use `duration-instant` or `duration-fast` with `easing-standard`, so feedback feels immediate rather than delayed, per `buttons.md` (DS-007), Section 4.

## 4. Overlay Transitions

Modals (`modals.md`, DS-025), drawers (`sidebars.md`, DS-026), and dropdowns animate in with `duration-base` or `duration-moderate` using `easing-decelerate`, and animate out slightly faster using `easing-accelerate`, reflecting that exits should feel snappier than entrances.

## 5. Loading Animation

Skeleton loading states (`loading-states.md`, DS-023) use a subtle shimmer animation at a fixed 1.5-second loop, using `easing-standard`. Spinners rotate at a constant linear speed rather than an eased one, since eased rotation reads as mechanically unnatural for a continuous loop.

## 6. Page Transitions

Navigating between top-level pages does not use a full-page transition animation; content updates directly to avoid perceived delay, consistent with the Fast principle. Transitions are reserved for state changes within a page (opening a modal, expanding a row), not for navigation itself.

## 7. Reduced Motion

When the operating system's `prefers-reduced-motion` setting is enabled, all durations above `duration-fast` are reduced to `duration-instant` and no transform-based motion (slide, scale) is applied — opacity-only crossfades are used instead where a transition is still functionally necessary, per `accessibility.md` (DS-015), Section 9.

## 8. What Is Never Animated

Text content changes (e.g. a number updating on a KPI card) are not animated with a counting/tweening effect by default, since this can misrepresent data currency. Table row reordering from a live data update is not animated, to avoid disorienting the user during data-dense review.

## References

`design-principles.md` (DS-002); System Overview (DOC-100), Section 10; `buttons.md` (DS-007); `modals.md` (DS-025); `sidebars.md` (DS-026); `loading-states.md` (DS-023); `accessibility.md` (DS-015).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
