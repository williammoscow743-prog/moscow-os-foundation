[Moscow OS Logo Placeholder]

# MOSCOW OS

**Organize. Build. Grow.**

# Themes

**Document ID:** DS-030
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

This document defines the Dark and Light theme implementations for Moscow OS and the rules for how a theme is derived and switched.

## Scope

Covers the two supported themes and theme-switching behavior. The full token values referenced by name in this document are defined authoritatively in `design-tokens.md` (DS-031).

---

## 1. Dark Theme (Canonical)

Dark theme is the default and canonical experience, per the Dark-Theme-First principle in `design-principles.md` (DS-002), Section 11. All values defined throughout `color-system.md` (DS-003) describe the Dark theme directly. Every new component is designed and reviewed against Dark theme first.

## 2. Light Theme (Derived)

Light theme is derived from Dark theme using a consistent inversion mapping, not designed independently, so the two themes never drift into inconsistent visual languages.

| Role | Dark Theme | Light Theme |
|---|---|---|
| `bg-canvas` | `#0A0B0D` | `#F7F8FA` |
| `bg-surface` | `#131417` | `#FFFFFF` |
| `bg-surface-raised` | `#1B1D21` | `#FFFFFF` (with `elevation-2` shadow, since Light theme relies more on shadow than the surface hierarchy) |
| `bg-surface-overlay` | `#212328` | `#FFFFFF` (with `elevation-3` shadow) |
| `border-subtle` | `#26282E` | `#E4E6EA` |
| `border-default` | `#33353C` | `#D3D6DC` |
| `text-primary` | `#F5F6F7` | `#14161A` |
| `text-secondary` | `#A6A9B0` | `#5B5E66` |
| `text-tertiary` | `#75787F` | `#84878E` |
| `brand-build` | `#4F6BFF` | `#3552E8` (darkened for sufficient contrast on white) |

Semantic and chart colors retain their Dark theme hue but are adjusted in lightness/saturation as needed to preserve the same 4.5:1 minimum contrast ratio against Light theme backgrounds, per `accessibility.md` (DS-015), Section 4.

## 3. Elevation in Light Theme

Because Light theme surfaces cannot be distinguished by background lightness the way Dark theme surfaces can (white cannot get "more white"), Light theme relies more heavily on shadow at every elevation level above `elevation-0`, per `elevation.md` (DS-020).

## 4. Theme Switching

Users select Dark, Light, or "Match System" in Settings (System Overview, DOC-100, Section 6.12). "Match System" follows the operating system's `prefers-color-scheme` setting and updates live if the system setting changes while Moscow OS is open. The selected theme is a persistent per-user preference.

## 5. No Per-Module Theme Variation

A single theme applies across the entire application at all times; no module is permitted to force its own theme independent of the user's selection, preserving the Consistent principle in `design-principles.md` (DS-002), Section 9.

## 6. Chart Color Theme Adjustment

The `chart-1` through `chart-8` sequence (`color-system.md`, DS-003, Section 7) retains its ordering and hue identity across both themes; only lightness is adjusted per theme to maintain contrast against each theme's background, so a given series' color identity does not change when a user switches theme.

## References

`design-principles.md` (DS-002); `color-system.md` (DS-003); `elevation.md` (DS-020); `design-tokens.md` (DS-031); `accessibility.md` (DS-015); System Overview (DOC-100), Section 6.12.

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
