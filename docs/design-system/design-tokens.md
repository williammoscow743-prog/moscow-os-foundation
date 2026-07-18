[Moscow OS Logo Placeholder]

# MOSCOW OS

**Organize. Build. Grow.**

# Design Tokens

**Document ID:** DS-031
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

This document is the single, canonical, implementation-ready reference for every design token used in Moscow OS. Where any other Design System document and this document appear to conflict, this document's values take precedence, and the conflicting document must be corrected.

## Scope

Covers color, typography, spacing, radius, elevation, opacity, animation, breakpoint, and z-index tokens. Rationale and usage guidance for these values lives in each token category's own document; this document exists for exact, copy-ready values.

---

## 1. Color Tokens

*[Full values and rationale in `color-system.md`, DS-003, and `themes.md`, DS-030.]*

| Token | Dark Value | Light Value |
|---|---|---|
| `bg-canvas` | `#0A0B0D` | `#F7F8FA` |
| `bg-surface` | `#131417` | `#FFFFFF` |
| `bg-surface-raised` | `#1B1D21` | `#FFFFFF` |
| `bg-surface-overlay` | `#212328` | `#FFFFFF` |
| `border-subtle` | `#26282E` | `#E4E6EA` |
| `border-default` | `#33353C` | `#D3D6DC` |
| `border-strong` | `#46484F` | `#B9BCC4` |
| `text-primary` | `#F5F6F7` | `#14161A` |
| `text-secondary` | `#A6A9B0` | `#5B5E66` |
| `text-tertiary` | `#75787F` | `#84878E` |
| `text-disabled` | `#4B4D53` | `#B9BCC4` |
| `brand-organize` | `#F5A623` | `#B87200` |
| `brand-build` | `#4F6BFF` | `#3552E8` |
| `brand-build-hover` | `#6B84FF` | `#4F6BFF` |
| `brand-build-active` | `#3C56E0` | `#2C41C4` |
| `brand-build-subtle` | `#1A2140` | `#E8ECFF` |
| `brand-grow` | `#00C2A8` | `#008C78` |
| `semantic-success` | `#22C55E` | `#15803D` |
| `semantic-success-surface` | `#10281A` | `#DCFCE7` |
| `semantic-warning` | `#F5A623` | `#B87200` |
| `semantic-warning-surface` | `#2B2210` | `#FEF3C7` |
| `semantic-danger` | `#F04848` | `#DC2626` |
| `semantic-danger-surface` | `#2B1414` | `#FEE2E2` |
| `semantic-info` | `#4F9CFF` | `#2563EB` |
| `semantic-info-surface` | `#12212F` | `#DBEAFE` |
| `chart-1` – `chart-8` | `#4F6BFF, #00C2A8, #F5A623, #F04848, #A855F7, #22C55E, #FF6B9D, #38BDF8` | Same hues, lightness adjusted per `themes.md` (DS-030), Section 6 |

## 2. Typography Tokens

*[Full rationale in `typography.md`, DS-004.]*

| Token | Size | Line Height | Weight |
|---|---|---|---|
| `text-display` | 3rem | 1.1 | 700 |
| `text-h1` | 2.25rem | 1.2 | 700 |
| `text-h2` | 1.75rem | 1.25 | 600 |
| `text-h3` | 1.5rem | 1.3 | 600 |
| `text-h4` | 1.25rem | 1.4 | 600 |
| `text-body-lg` | 1.125rem | 1.5 | 400 |
| `text-body` | 1rem | 1.5 | 400 |
| `text-body-sm` | 0.875rem | 1.5 | 400 |
| `text-caption` | 0.75rem | 1.4 | 500 |
| `text-label` | 0.75rem | 1.2 | 600 |

Font families: `font-primary: "Inter"`, `font-mono: "JetBrains Mono"`, per `typography.md` (DS-004), Section 1.

## 3. Spacing Tokens

*[Full rationale in `spacing.md`, DS-005.]*

`space-0: 0px` · `space-1: 4px` · `space-2: 8px` · `space-3: 12px` · `space-4: 16px` · `space-5: 20px` · `space-6: 24px` · `space-8: 32px` · `space-10: 40px` · `space-12: 48px` · `space-16: 64px` · `space-20: 80px` · `space-24: 96px`

## 4. Radius Tokens

| Token | Value | Usage |
|---|---|---|
| `radius-sm` | 4px | Checkboxes, small controls |
| `radius-md` | 8px | Inputs, buttons |
| `radius-lg` | 12px | Cards, modals |
| `radius-xl` | 16px | Large containers, feature panels |
| `radius-full` | 9999px | Badges, avatars, switches |

## 5. Elevation Tokens

*[Full rationale in `elevation.md`, DS-020.]*

| Token | Shadow |
|---|---|
| `elevation-0` | none |
| `elevation-1` | none (1px `border-subtle`) |
| `elevation-2` | `0 2px 8px rgba(0,0,0,0.4)` |
| `elevation-3` | `0 8px 24px rgba(0,0,0,0.5)` |
| `elevation-4` | `0 16px 48px rgba(0,0,0,0.6)` |

## 6. Opacity Tokens

| Token | Value | Usage |
|---|---|---|
| `opacity-disabled` | 0.4 | Disabled controls |
| `opacity-hover-overlay` | 0.08 | Subtle hover fills on transparent elements |
| `opacity-backdrop` | 0.7 | Modal backdrop |
| `opacity-inactive-legend` | 0.4 | Toggled-off chart legend items |

## 7. Animation Tokens

*[Full rationale in `animations.md`, DS-016.]*

`duration-instant: 100ms` · `duration-fast: 150ms` · `duration-base: 200ms` · `duration-moderate: 300ms` · `duration-slow: 400ms`

`easing-standard: cubic-bezier(0.4, 0, 0.2, 1)` · `easing-decelerate: cubic-bezier(0, 0, 0.2, 1)` · `easing-accelerate: cubic-bezier(0.4, 0, 1, 1)`

## 8. Breakpoint Tokens

*[Full rationale in `responsive-design.md`, DS-017.]*

`bp-xs: 0px` · `bp-sm: 480px` · `bp-md: 768px` · `bp-lg: 1024px` · `bp-xl: 1440px`

## 9. Z-Index Tokens

| Token | Value | Usage |
|---|---|---|
| `z-base` | 0 | Default document flow |
| `z-dropdown` | 100 | Dropdown menus, select options |
| `z-sticky` | 200 | Sticky table headers, sticky page headers |
| `z-overlay` | 300 | Drawers, sidebar mobile overlay |
| `z-modal` | 400 | Modal dialogs |
| `z-popover` | 500 | Popovers triggered from within a modal |
| `z-toast` | 600 | Toast notifications |
| `z-command-palette` | 700 | Command palette |
| `z-tooltip` | 800 | Tooltips (always topmost, must never be obscured) |

## 10. Token Naming Convention

Tokens follow `category-variant-modifier` naming (for example, `brand-build-hover`), lowercase, hyphen-separated, matching the naming convention used throughout this Design System and consistent with `docs/framework/repository-standards.md` (DOC-007), Section 2.

## References

Every document in `docs/design-system/` references this document as the canonical value source; this document in turn is authored consistently with `color-system.md` (DS-003), `typography.md` (DS-004), `spacing.md` (DS-005), `elevation.md` (DS-020), `animations.md` (DS-016), `responsive-design.md` (DS-017), and `themes.md` (DS-030).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
