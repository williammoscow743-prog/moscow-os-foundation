[Moscow OS Logo Placeholder]

# MOSCOW OS

**Organize. Build. Grow.**

# Buttons

**Document ID:** DS-007
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

This document defines every button variant, size, and state used in Moscow OS, so buttons behave and appear identically everywhere they occur.

## Scope

Covers standard buttons, icon buttons, and button groups. Does not cover links styled as text, which are covered in `navigation.md` (DS-011).

---

## 1. Purpose of Each Variant

| Variant | Purpose | Example |
|---|---|---|
| Primary | The single most important action on a screen | "Create Project", "Save Changes" |
| Secondary | A supporting action alongside a primary action | "Cancel", "Save as Draft" |
| Tertiary (Ghost) | A low-emphasis action, often repeated inline | "View Details", table row actions |
| Destructive | An action that deletes or irreversibly changes data | "Delete Project", "Remove Client" |
| Icon | A compact, icon-only action | Table row overflow menu trigger |

Only one Primary button may appear within a single view or modal at a time, so the user's next step is always unambiguous.

## 2. Variant Styling

| Variant | Background | Text | Border | Hover |
|---|---|---|---|---|
| Primary | `brand-build` | `text-inverse` (white on the brand blue) | none | `brand-build-hover` |
| Secondary | `bg-surface` | `text-primary` | `border-default` | `bg-surface-raised` |
| Tertiary | transparent | `text-secondary` | none | `bg-surface` background fade-in |
| Destructive | `semantic-danger` | `text-inverse` | none | darken 8% |
| Icon | transparent | `text-secondary` | none | `bg-surface` circular fill |

## 3. Sizes

| Token | Height | Horizontal Padding | Font Token |
|---|---|---|---|
| `button-sm` | 32px | `space-3` | `text-body-sm` |
| `button-md` (default) | 40px | `space-4` | `text-body` |
| `button-lg` | 48px | `space-5` | `text-body-lg` |

## 4. States

| State | Treatment |
|---|---|
| Default | As defined in Section 2 |
| Hover | Per Section 2's hover column; `duration-fast` transition, per `animations.md` (DS-016) |
| Active/Pressed | Background shifts to the variant's `-active` token; no additional transform or shadow |
| Focus | 2px `brand-build` outline, 2px offset, per `accessibility.md` (DS-015), Section 3 |
| Disabled | 40% opacity, `cursor: not-allowed`, no hover or active response |
| Loading | Label replaced with a spinner sized to `icon-md`; button width does not change during the transition, to avoid layout shift |

## 5. Icon Placement

An icon within a button uses `icon-md` (or `icon-sm` inside `button-sm`), placed before the label with `space-2` gap, per `icons.md` (DS-006), Section 5. Icon-only buttons use equal padding on all sides and always include an `aria-label`.

## 6. Button Groups

When multiple related buttons appear together (for example, a set of view-toggle buttons), they are visually joined with a shared border and no gap between them, distinguishing the group from a set of unrelated standalone buttons separated by `space-2` or `space-3`.

## 7. Content Rules

Button labels use `weight-semibold`, start with a verb where the action is not already obvious from context ("Create Project", not "Project"), and never exceed roughly 25 characters — longer actions are shortened or moved to a secondary explanatory line below the button.

## 8. Accessibility

Every button has a minimum touch target of 40x40px regardless of visual size, achieved through padding if the visual button is smaller, per `accessibility.md` (DS-015), Section 7. Disabled buttons remain in the tab order only if their disabled reason is important for the user to discover; otherwise they are removed from the tab order.

## References

`design-tokens.md` (DS-031); `color-system.md` (DS-003); `icons.md` (DS-006); `animations.md` (DS-016); `accessibility.md` (DS-015).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
