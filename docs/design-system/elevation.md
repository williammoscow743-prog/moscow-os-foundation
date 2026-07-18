[Moscow OS Logo Placeholder]

# MOSCOW OS

**Organize. Build. Grow.**

# Elevation

**Document ID:** DS-020
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

This document defines the elevation system Moscow OS uses to convey stacking order and hierarchy between surfaces, working in tandem with the background hierarchy in `color-system.md` (DS-003), Section 1.

## Scope

Covers shadow definitions and their assignment to component layers.

---

## 1. Why Elevation Is Restrained in Dark Theme

Because Moscow OS is dark-theme-first (`design-principles.md`, DS-002, Section 11), elevation is conveyed primarily through the background hierarchy (progressively lighter surfaces) rather than heavy drop shadows, which read poorly against dark backgrounds. Shadow is used as a secondary, subtle reinforcement, not the primary signal.

## 2. Elevation Scale

| Token | Shadow Value | Paired Background | Usage |
|---|---|---|---|
| `elevation-0` | none | `bg-canvas` | Page background |
| `elevation-1` | none (1px `border-subtle` only) | `bg-surface` | Cards, panels at rest |
| `elevation-2` | `0 2px 8px rgba(0,0,0,0.4)` | `bg-surface-raised` | Hovering interactive cards, dropdown menus |
| `elevation-3` | `0 8px 24px rgba(0,0,0,0.5)` | `bg-surface-raised` | Modals, popovers, notification panel |
| `elevation-4` | `0 16px 48px rgba(0,0,0,0.6)` | `bg-surface-overlay` | Command palette, top-level overlays above modals |

## 3. Assignment Rules

An element's elevation token is determined by its role in the stacking order, not by visual preference: a dropdown opened from within a modal uses `elevation-4` (one level above the modal's `elevation-3`) so it visibly sits above it, per the z-index pairing defined in `design-tokens.md` (DS-031), Section 9.

## 4. Elevation on Hover

Interactive cards (`cards.md`, DS-009, Section 3) transition from `elevation-1` to `elevation-2` on hover, using `duration-fast` per `animations.md` (DS-016), Section 3, giving tactile feedback that the element is actionable.

## 5. What Does Not Use Shadow

Inline elements (badges, buttons, form fields) never carry elevation shadow; their state is conveyed through border and background changes only, per `buttons.md` (DS-007) and `forms.md` (DS-008). Shadow is reserved for elements that visually float above the base content layer.

## References

`color-system.md` (DS-003); `design-tokens.md` (DS-031); `cards.md` (DS-009); `modals.md` (DS-025); `animations.md` (DS-016).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
