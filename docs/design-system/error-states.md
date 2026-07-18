[Moscow OS Logo Placeholder]

# MOSCOW OS

**Organize. Build. Grow.**

# Error States

**Document ID:** DS-024
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

This document defines how Moscow OS presents errors — failed requests, invalid input, and unavailable content — so failures are communicated clearly and, where possible, recoverably.

## Scope

Covers system-level error presentation (failed loads, server errors) and complements `forms.md` (DS-008), Section 9, which covers field-level validation errors specifically.

---

## 1. Error Severity Tiers

| Tier | Example | Presentation |
|---|---|---|
| Field-level | Invalid email format | Inline, per `forms.md` (DS-008), Section 9 |
| Action-level | Save failed due to network issue | Toast, per `notifications.md` (DS-014), Section 1 |
| View-level | A table failed to load its data | In-place error state replacing the expected content |
| Application-level | The application cannot reach the backend at all | Full-page error state |

## 2. View-Level Error Anatomy

A view-level error state replaces the region that failed to load with: an icon (`icon-lg`, `semantic-danger`), a plain-language headline (`text-h4`) avoiding technical jargon (for example, "We couldn't load your projects" rather than a raw error code), supporting text explaining next steps, and a "Retry" button (`buttons.md`, DS-007, Secondary variant).

## 3. Application-Level Error Anatomy

A full-page error state (for example, total loss of connectivity to the backend) follows the same anatomy as Section 2 at a larger scale (`icon-xl`, `text-h1` headline), centered in the viewport, and includes a persistent connection-status indicator if the error is ongoing rather than a one-time failure.

## 4. Error Copy Standards

Error messages state what happened and, where known, what the user can do about it — never a raw stack trace, HTTP status code, or internal error identifier alone. A technical reference code may be included in small `text-caption` text for support purposes, but never as the primary message.

## 5. Retry Behavior

Retryable errors always provide an explicit "Retry" action rather than requiring a full page refresh. Automatic retry (without user action) is used only for background operations the user is not actively waiting on, and never silently replaces a user-facing error for an operation they are actively waiting on.

## 6. Permission and Not-Found Errors

A 403 (forbidden) or 404 (not found) condition uses the same anatomy as Section 2 but with distinct, accurate copy — "You don't have access to this project" versus "This project no longer exists" — since conflating the two misleads the user about the actual cause and appropriate next step.

## 7. Color and Iconography

Error states use `semantic-danger` for the icon and any accent element, per `color-system.md` (DS-003), Section 6, reserved exclusively for genuine error conditions, never for neutral or informational empty states (`empty-states.md`, DS-022).

## 8. Accessibility

Error headlines are rendered as actual heading elements and announced via `aria-live="assertive"` when they appear as a result of a user action, per `accessibility.md` (DS-015), Section 6.

## References

`forms.md` (DS-008); `notifications.md` (DS-014); `buttons.md` (DS-007); `color-system.md` (DS-003); `empty-states.md` (DS-022); `accessibility.md` (DS-015).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
