[Moscow OS Logo Placeholder]

# MOSCOW OS

**Organize. Build. Grow.**

# Loading States

**Document ID:** DS-023
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

This document defines how Moscow OS communicates that content is loading, in service of the Performance-Focused principle in `design-principles.md` (DS-002), Section 10 — managing perceived wait time even when actual load time cannot be reduced further.

## Scope

Covers skeleton loading, spinners, and progress indicators used throughout the product.

---

## 1. Skeleton Loading (Primary Pattern)

Skeleton loading — gray placeholder shapes matching the layout of the content about to appear — is the default loading pattern for any view with a predictable structure: tables (`tables.md`, DS-010, Section 6), cards, and dashboard widgets. Skeletons use `bg-surface-overlay` with the shimmer animation defined in `animations.md` (DS-016), Section 5.

## 2. Spinners

A circular spinner (`icon-md` or `icon-lg`, `brand-build` stroke) is used only where skeleton loading is impractical: inside a button during a submit action (`buttons.md`, DS-007, Section 4), or for a short, indeterminate-length operation with no predictable layout to skeleton.

## 3. Progress Bars

A determinate progress bar (showing percentage complete) is used only where actual progress is knowable — for example, a multi-file upload in the Documents module. It is never used to simulate progress for an operation whose completion time is unknown; a spinner or skeleton is used instead in that case.

## 4. Full-Page vs. Partial Loading

A full-page loading state (used only on initial application load or full navigation) uses a centered spinner over `bg-canvas`. Once the application shell has rendered, all subsequent loading is scoped to the specific region being updated (a widget, a table, a modal) — the shell itself never re-shows a full-page loading state during normal use, consistent with the Dashboard module's independent per-widget loading in `dashboard.md` (DS-012), Section 5.

## 5. Minimum Display Duration

Loading states that resolve in under 300ms are not shown at all, avoiding a jarring flash of loading UI for near-instant operations. Loading states that take longer are shown for a minimum of 300ms once triggered, to avoid an equally jarring flash of loading UI that disappears almost immediately.

## 6. Optimistic UI

For actions with a high likelihood of success (for example, marking a task complete), Moscow OS updates the UI immediately and reconciles with the server response afterward, rather than showing a loading state and waiting — reverting the optimistic change only if the action ultimately fails, in which case an error toast per `notifications.md` (DS-014), Section 1, explains the reversal.

## 7. Accessibility

Loading regions are marked with `aria-busy="true"` for the duration of loading, and a visually hidden "Loading" label is available to screen readers where the loading indicator itself is not text-based, per `accessibility.md` (DS-015), Section 6.

## References

`design-principles.md` (DS-002); `animations.md` (DS-016); `tables.md` (DS-010); `buttons.md` (DS-007); `dashboard.md` (DS-012); `notifications.md` (DS-014); `accessibility.md` (DS-015).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
