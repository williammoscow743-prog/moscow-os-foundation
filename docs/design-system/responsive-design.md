[Moscow OS Logo Placeholder]

# MOSCOW OS

**Organize. Build. Grow.**

# Responsive Design

**Document ID:** DS-017
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

This document defines the Moscow OS breakpoint system and the rules for adapting layout and components across screen sizes, operationalizing the Responsive and Mobile-first principles in the System Overview (DOC-100), Section 10.

## Scope

Covers breakpoint definitions and cross-cutting responsive behavior. Component-specific responsive rules are defined in each component's own document and reference this one.

---

## 1. Breakpoints

| Token | Range | Typical Device |
|---|---|---|
| `bp-xs` | 0–479px | Small mobile |
| `bp-sm` | 480–767px | Large mobile |
| `bp-md` | 768–1023px | Tablet |
| `bp-lg` | 1024–1439px | Desktop |
| `bp-xl` | 1440px+ | Large desktop |

## 2. Mobile-First Implementation

Styles are written mobile-first: base styles target `bp-xs`, with progressively larger breakpoints layered on top via `min-width` media queries. This ensures the smallest, most constrained experience is never an afterthought derived from a desktop layout.

## 3. Layout Adaptation by Breakpoint

| Breakpoint | Sidebar | Grid Columns | Dashboard Widgets |
|---|---|---|---|
| `bp-xs` / `bp-sm` | Hidden, accessible via drawer (`sidebars.md`, DS-026) | 4 | Full width, stacked (`dashboard.md`, DS-012, Section 7) |
| `bp-md` | Collapsed (icon-only), expandable | 8 | Full or half width |
| `bp-lg` / `bp-xl` | Expanded by default | 12 | Full range of spans available |

## 4. Touch vs. Pointer Considerations

Below `bp-md`, all interactive targets meet the 40×40px minimum defined in `accessibility.md` (DS-015), Section 7, regardless of visual size, and hover-only interactions (such as a table row's hover-revealed action icons) are replaced with always-visible or tap-to-reveal equivalents, since hover has no reliable touch equivalent.

## 5. Typography Adjustment

`text-display` and `text-h1` scale down by one type-scale step below `bp-md`, per `typography.md` (DS-004), Section 7. All other type tokens remain constant.

## 6. Table Adaptation

Below `bp-md`, data tables either scroll horizontally within a bounded container with a persistent identifying column, or convert to a stacked card-per-row layout, chosen per table based on column count, per `tables.md` (DS-010), Section 8.

## 7. Modal and Drawer Adaptation

Below `bp-sm`, modals expand to full-screen rather than a centered floating panel, per `modals.md` (DS-025), Section 7, to make full use of the limited viewport.

## 8. Testing Requirement

Every new screen or component is validated at `bp-xs`, `bp-md`, and `bp-xl` at minimum before being marked complete, to confirm behavior at the smallest, an intermediate, and the largest common viewport.

## References

System Overview (DOC-100), Section 10; `sidebars.md` (DS-026); `dashboard.md` (DS-012); `accessibility.md` (DS-015); `typography.md` (DS-004); `tables.md` (DS-010); `modals.md` (DS-025).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
