[Moscow OS Logo Placeholder]

# MOSCOW OS

**Organize. Build. Grow.**

# Forms

**Document ID:** DS-008
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

This document defines the standards for every form control in Moscow OS: text inputs, dropdowns, checkboxes, radio buttons, switches, and date pickers.

## Scope

Covers form control appearance, states, and validation behavior across all modules. Page-level form layout composition is covered in `layouts.md` (DS-019).

---

## 1. Text Input

| Property | Value |
|---|---|
| Height | 40px (`button-md` equivalent, for visual alignment with adjacent buttons) |
| Padding | `space-2` vertical, `space-3` horizontal |
| Background | `bg-surface` |
| Border (default) | `border-default` |
| Border (focus) | `brand-build`, 2px, with 2px outer glow using `brand-build-subtle` |
| Border (error) | `semantic-danger` |
| Text | `text-primary`, `text-body` |
| Placeholder | `text-tertiary` |
| Corner Radius | `radius-md` |

## 2. Labels and Helper Text

Every input has a visible label using `text-label` styling (per `typography.md`, DS-004, Section 2), positioned above the field with `space-2` gap. Helper text, when present, sits below the field in `text-caption` and `text-tertiary`, switching to `semantic-danger` when displaying a validation error.

## 3. Required Field Indication

Required fields are marked with a trailing asterisk in `semantic-danger` immediately after the label text, never by color alone, so the requirement is conveyed to screen reader users and colorblind users alike via the underlying `aria-required` attribute.

## 4. Dropdowns (Select)

Dropdowns share the Text Input's resting, focus, and error styling. The expanded option list uses `bg-surface-overlay` per `color-system.md` (DS-003), Section 1, with `elevation-3` per `elevation.md` (DS-020), and options highlight with `bg-surface-raised` on hover or keyboard focus.

## 5. Checkboxes

| Property | Value |
|---|---|
| Size | 18px square |
| Unchecked | `border-default` border, transparent fill |
| Checked | `brand-build` fill, white checkmark |
| Corner Radius | `radius-sm` |
| Label gap | `space-2` |

## 6. Radio Buttons

| Property | Value |
|---|---|
| Size | 18px circle |
| Unchecked | `border-default` border, transparent fill |
| Checked | `brand-build` border, filled inner circle at 60% of total diameter |
| Label gap | `space-2` |

## 7. Switches (Toggles)

| Property | Value |
|---|---|
| Track size | 36px × 20px |
| Track off | `bg-surface-overlay` |
| Track on | `brand-build` |
| Thumb | 16px circle, white, animated with `duration-fast` per `animations.md` (DS-016) |

Switches are used for settings that take effect immediately upon interaction; checkboxes are used within forms that require an explicit save action. This distinction is a functional rule, not a stylistic choice, and must be applied consistently.

## 8. Date Pickers

Date pickers use the Text Input styling for the trigger field and an overlay calendar panel styled per Section 4's dropdown conventions. Selected dates use `brand-build` fill; today's date (if not selected) is indicated with a `brand-build` outline only.

## 9. Validation Behavior

Field-level validation runs on blur, not on every keystroke, to avoid presenting errors while the user is still typing. Form-level validation runs on submit attempt. An invalid field receives `border: semantic-danger` and associated helper text; the first invalid field on submit receives keyboard focus automatically.

## 10. Disabled and Read-Only States

| State | Treatment |
|---|---|
| Disabled | 40% opacity, `bg-surface` background, no focus ring, excluded from tab order |
| Read-only | Full opacity, `bg-canvas` background (visually flatter than an editable field), remains in tab order for screen reader review |

## 11. Accessibility

Every form control is programmatically associated with its label via `<label for>` or `aria-labelledby`. Error messages are associated with their field via `aria-describedby` and announced via `aria-live="polite"` when they appear, per `accessibility.md` (DS-015), Section 6.

## References

`design-tokens.md` (DS-031); `color-system.md` (DS-003); `typography.md` (DS-004); `elevation.md` (DS-020); `animations.md` (DS-016); `accessibility.md` (DS-015).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
