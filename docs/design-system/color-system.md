[Moscow OS Logo Placeholder]

# MOSCOW OS

**Organize. Build. Grow.**

# Color System

**Document ID:** DS-003
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

This document defines the complete Moscow OS color palette and the rules for applying it, with dark theme as the primary, canonical experience per the Dark-Theme-First principle in `design-principles.md` (DS-002), Section 11.

## Scope

Covers background, surface, border, text, brand, semantic, chart, and interactive-state colors for both dark and light themes. Implementation-ready token names and values are the authoritative reference in `design-tokens.md` (DS-031); this document explains the rationale and usage rules behind those values.

---

## 1. Background Hierarchy (Dark Theme)

Moscow OS uses a four-level background hierarchy so that stacked surfaces (a card on a page, a dropdown on a card) are visually distinguishable without relying on shadow alone.

| Token | Hex | Usage |
|---|---|---|
| `bg-canvas` | `#0A0B0D` | The page background; the darkest layer |
| `bg-surface` | `#131417` | Cards, panels, sidebar background |
| `bg-surface-raised` | `#1B1D21` | Modals, popovers, raised panels |
| `bg-surface-overlay` | `#212328` | Dropdown menus, context menus, tooltips |

## 2. Borders

| Token | Hex | Usage |
|---|---|---|
| `border-subtle` | `#26282E` | Default dividers, table row separators |
| `border-default` | `#33353C` | Card borders, input borders (resting state) |
| `border-strong` | `#46484F` | Emphasized borders, hover state on bordered elements |

## 3. Text Colors

| Token | Hex | Usage |
|---|---|---|
| `text-primary` | `#F5F6F7` | Headings, primary body text |
| `text-secondary` | `#A6A9B0` | Secondary body text, descriptions |
| `text-tertiary` | `#75787F` | Captions, metadata, placeholder text |
| `text-disabled` | `#4B4D53` | Disabled control labels |
| `text-inverse` | `#0A0B0D` | Text placed on light or brand-colored surfaces |

## 4. Brand Colors

The brand palette maps to the three words of the Moscow OS tagline, giving each a distinct functional role rather than using them interchangeably.

| Token | Hex | Tagline Association | Usage |
|---|---|---|---|
| `brand-organize` | `#F5A623` | Organize | Structural and categorization UI (tags, milestones markers) |
| `brand-build` | `#4F6BFF` | Build | Primary actions, primary buttons, active navigation, links |
| `brand-grow` | `#00C2A8` | Grow | Growth and progress indicators, positive trend lines |

`brand-build` is the platform's primary interactive color and is used for the majority of primary buttons and active states; `brand-organize` and `brand-grow` are used more sparingly, for accenting and categorization, per the Minimal principle in `design-principles.md` (DS-002), Section 2.

## 5. Brand Color States

| Token | Hex | Usage |
|---|---|---|
| `brand-build-hover` | `#6B84FF` | Hover state on `brand-build` elements |
| `brand-build-active` | `#3C56E0` | Pressed/active state on `brand-build` elements |
| `brand-build-subtle` | `#1A2140` | Subtle background fill (selected nav item, badge background) |

## 6. Semantic Colors

Semantic colors are reserved exclusively for their stated meaning and are never used decoratively elsewhere in the interface, so their meaning stays unambiguous.

| Purpose | Token | Hex | Surface Token | Surface Hex |
|---|---|---|---|---|
| Success | `semantic-success` | `#22C55E` | `semantic-success-surface` | `#10281A` |
| Warning | `semantic-warning` | `#F5A623` | `semantic-warning-surface` | `#2B2210` |
| Danger | `semantic-danger` | `#F04848` | `semantic-danger-surface` | `#2B1414` |
| Info | `semantic-info` | `#4F9CFF` | `semantic-info-surface` | `#12212F` |

Note that `semantic-warning` shares a hex value with `brand-organize`; this is intentional — both represent "needs attention" in different contexts (categorization versus status) — but they are never used together on the same screen in a way that could cause confusion between the two meanings.

## 7. Chart Colors

A fixed, ordered eight-color categorical palette is used across all data visualization so that a given series color is not reused for an unrelated series within the same view. Full usage rules are in `data-visualization.md` (DS-029).

| Order | Token | Hex |
|---|---|---|
| 1 | `chart-1` | `#4F6BFF` |
| 2 | `chart-2` | `#00C2A8` |
| 3 | `chart-3` | `#F5A623` |
| 4 | `chart-4` | `#F04848` |
| 5 | `chart-5` | `#A855F7` |
| 6 | `chart-6` | `#22C55E` |
| 7 | `chart-7` | `#FF6B9D` |
| 8 | `chart-8` | `#38BDF8` |

## 8. Interactive States

| State | Rule |
|---|---|
| Hover | Background or border shifts one step up the relevant hierarchy (e.g. `bg-surface` → `bg-surface-raised`), or brand color shifts to its `-hover` token |
| Active/Pressed | Brand color shifts to its `-active` token; non-brand elements darken by approximately 8% |
| Focus | A 2px `brand-build` outline with 2px offset, applied consistently regardless of element type, per `accessibility.md` (DS-015), Section 3 |
| Disabled | Element opacity reduced to 40%; text falls back to `text-disabled`; no hover or active state is rendered |

## 9. Light Theme

Moscow OS supports a light theme derived from the same token structure, defined in full in `themes.md` (DS-030). The dark theme remains canonical: new components are designed against dark theme values first, and light theme equivalents are derived from them, not designed independently.

## 10. Accessibility Requirement

Every text/background color pairing used in the product must meet a minimum contrast ratio of 4.5:1 for body text and 3:1 for large text (18px+ or 14px+ bold), per WCAG 2.2 AA as required in `accessibility.md` (DS-015), Section 4. All token pairings listed above have been selected to meet this minimum in their documented usage.

## References

`design-principles.md` (DS-002); `design-tokens.md` (DS-031); `themes.md` (DS-030); `accessibility.md` (DS-015); `data-visualization.md` (DS-029).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
