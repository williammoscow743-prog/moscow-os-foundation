[Moscow OS Logo Placeholder]

# MOSCOW OS

**Organize. Build. Grow.**

# Accessibility

**Document ID:** DS-015
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

This document defines the accessibility standards every Moscow OS component and screen must meet, operationalizing the Highly Accessible principle in `design-principles.md` (DS-002), Section 6, and the Accessible principle in the System Overview (DOC-100), Section 10.

## Scope

Covers WCAG 2.2 Level AA compliance requirements applicable to the Moscow OS web application. This document is the authoritative accessibility reference; component-specific documents reference it rather than restating these rules.

---

## 1. Conformance Target

Moscow OS targets WCAG 2.2 Level AA across all authenticated product surfaces. Level AAA criteria are adopted opportunistically where they carry no design trade-off, but AA is the mandatory bar for release, per the Quality Checklist model in `docs/framework/documentation-standards.md` (DOC-003), Section 6, applied here to design rather than documentation.

## 2. Keyboard Navigation

Every interactive element must be reachable and operable via keyboard alone, in a logical order matching visual reading order. No functionality may depend exclusively on mouse hover or drag interaction without a keyboard-operable equivalent. Keyboard traps (a focus state from which Tab cannot escape) are not permitted, including within modals, where focus must be trappable only intentionally (see Section 3) and always escapable via `Esc`.

## 3. Focus Indicators

Every focusable element displays a visible focus indicator: a 2px `brand-build` outline with 2px offset, per `color-system.md` (DS-003), Section 8. This indicator is never removed via `outline: none` without a compliant replacement. Modal dialogs trap focus within themselves while open, per `modals.md` (DS-025), Section 5, returning focus to the triggering element on close.

## 4. Color Contrast

All text must meet a contrast ratio of at least 4.5:1 against its background (3:1 for text 18px and larger, or 14px and larger when bold), per `color-system.md` (DS-003), Section 10. Meaning is never conveyed by color alone — status, required fields, and validation states always pair color with an icon, text label, or pattern, per `navigation.md` (DS-011), Section 7, and `forms.md` (DS-008), Section 3.

## 5. Typography and Readability

Body text does not render below 14px as a primary reading size, and line height does not fall below 1.4, per `typography.md` (DS-004), Section 8. Text must remain readable and layout must not break when a user increases browser zoom up to 200%.

## 6. ARIA and Semantic HTML

Semantic HTML elements are used in preference to ARIA roles wherever a native equivalent exists (a `<button>` over a `div` with `role="button"`). Where ARIA is required, form fields associate labels and errors via `aria-labelledby`/`aria-describedby` (per `forms.md`, DS-008, Section 11), icon-only controls use `aria-label` (per `icons.md`, DS-006, Section 6), and dynamic content (toasts, live status changes) uses `aria-live` regions (per `notifications.md`, DS-014, Section 7).

## 7. Touch and Click Targets

Every interactive element has a minimum touch target of 40×40px, achieved through padding when the visual element is smaller, per `buttons.md` (DS-007), Section 8. Adjacent interactive elements maintain sufficient spacing to prevent accidental activation, using `space-2` as the minimum gap.

## 8. Data and Chart Accessibility

Every chart provides a text-based data table alternative, per `charts.md` (DS-013), Section 8. Every data table uses semantic markup with proper header association, per `tables.md` (DS-010), Section 9.

## 9. Motion and Reduced Motion

All animation respects the user's operating-system-level `prefers-reduced-motion` setting: when set, transition durations are reduced to near-zero and non-essential animation (page transitions, decorative motion) is disabled entirely, while essential state-change feedback remains present in a near-instant form, per `animations.md` (DS-016), Section 7.

## 10. Screen Reader Testing

Every new component is validated with at least one screen reader (NVDA or VoiceOver) before being marked complete in `component-library.md` (DS-018), confirming that its name, role, and state are correctly announced.

## References

`design-principles.md` (DS-002); System Overview (DOC-100), Section 10; `color-system.md` (DS-003); `typography.md` (DS-004); `forms.md` (DS-008); `buttons.md` (DS-007); `icons.md` (DS-006); `tables.md` (DS-010); `charts.md` (DS-013); `modals.md` (DS-025); `animations.md` (DS-016).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
