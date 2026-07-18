[Moscow OS Logo Placeholder]

# MOSCOW OS

**Organize. Build. Grow.**

# Typography

**Document ID:** DS-004
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

This document defines the Moscow OS type system: font families, the type scale, weights, and spacing rules that govern all text in the product.

## Scope

Covers UI typography across the web application. Does not cover marketing or brand typography used outside the product itself.

---

## 1. Font Families

| Role | Family | Fallback Stack | Usage |
|---|---|---|---|
| Primary (UI) | Inter | `-apple-system, "Segoe UI", Roboto, sans-serif` | All interface text: body, labels, navigation |
| Secondary (Display) | Inter, weight 700 | Same as Primary | Large headings, dashboard hero numbers — Moscow OS uses Inter at a heavier weight rather than a second typeface, to keep the interface visually unified |
| Monospace | JetBrains Mono | `"SF Mono", Consolas, monospace` | Code snippets, API keys, document IDs, invoice numbers |

Inter is chosen for its neutral, highly legible character at small sizes, its wide weight range, and its strong support for tabular figures — important for the Finance and Reporting modules, where numeric alignment matters.

## 2. Type Scale

| Token | Size (rem / px) | Line Height | Weight | Usage |
|---|---|---|---|---|
| `text-display` | 3rem / 48px | 1.1 | 700 | Marketing-adjacent hero numbers only (e.g. large dashboard KPI) |
| `text-h1` | 2.25rem / 36px | 1.2 | 700 | Page titles |
| `text-h2` | 1.75rem / 28px | 1.25 | 600 | Section headings |
| `text-h3` | 1.5rem / 24px | 1.3 | 600 | Card and panel titles |
| `text-h4` | 1.25rem / 20px | 1.4 | 600 | Sub-section headings, modal titles |
| `text-body-lg` | 1.125rem / 18px | 1.5 | 400 | Lead paragraphs, emphasized body text |
| `text-body` | 1rem / 16px | 1.5 | 400 | Default UI body text |
| `text-body-sm` | 0.875rem / 14px | 1.5 | 400 | Secondary text, table cell content |
| `text-caption` | 0.75rem / 12px | 1.4 | 500 | Timestamps, helper text, metadata |
| `text-label` | 0.75rem / 12px | 1.2 | 600 | Form labels, table headers — set in uppercase with `letter-spacing: 0.04em` |

## 3. Font Weights

| Token | Value | Usage |
|---|---|---|
| `weight-regular` | 400 | Default body text |
| `weight-medium` | 500 | Emphasized body text, captions |
| `weight-semibold` | 600 | Headings level H2–H4, labels |
| `weight-bold` | 700 | H1, display text, primary button labels |

## 4. Letter Spacing

| Token | Value | Usage |
|---|---|---|
| `tracking-tight` | -0.01em | Display and H1 sizes, to counteract optical looseness at large sizes |
| `tracking-normal` | 0em | Body text default |
| `tracking-wide` | 0.04em | Uppercase labels (`text-label`) |

## 5. Numeric Typography

Finance, Reporting, and Dashboard modules must use tabular (fixed-width) figures for any numeric column or aligned value, so that stacked numbers align vertically. This is a functional requirement, not a stylistic preference, given the financial data these modules display.

## 6. Text Color Pairing

Every type token above is paired with a text color token from `color-system.md` (DS-003), Section 3. `text-h1` through `text-h4` default to `text-primary`; `text-body` defaults to `text-primary` or `text-secondary` depending on emphasis; `text-caption` and `text-label` default to `text-tertiary` unless otherwise specified by the component.

## 7. Responsive Type Adjustments

On mobile viewports (per `responsive-design.md`, DS-017), `text-display` and `text-h1` scale down by one step (to the next smaller token's size) to preserve readable line lengths on narrow screens. All other type tokens remain constant across breakpoints.

## 8. Accessibility Requirements

No body text may render below `text-body-sm` (14px) as a primary reading size. Line height must not fall below 1.4 for any paragraph-length text, per WCAG 2.2 AA guidance referenced in `accessibility.md` (DS-015), Section 5.

## References

`color-system.md` (DS-003); `design-tokens.md` (DS-031); `accessibility.md` (DS-015); `responsive-design.md` (DS-017).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
