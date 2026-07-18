[Moscow OS Logo Placeholder]

# MOSCOW OS

**Organize. Build. Grow.**

# Modals

**Document ID:** DS-025
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

This document defines the standard modal (dialog) pattern used across Moscow OS for focused, blocking tasks that interrupt the current view.

## Scope

Covers centered modal dialogs. Side-anchored panels are covered in `sidebars.md` (DS-026) under Drawers.

---

## 1. When to Use a Modal

Modals are used for short, focused tasks that require the user's full attention before returning to the underlying view: confirmations, short creation forms, and single-record quick edits. Modals are not used for tasks requiring extensive scrolling or multi-step complexity — those use a dedicated page per the Form View Template in `layouts.md` (DS-019), Section 4.

## 2. Sizes

| Token | Max Width | Usage |
|---|---|---|
| `modal-sm` | 400px | Confirmations, single-field prompts |
| `modal-md` | 560px | Standard creation/edit forms |
| `modal-lg` | 800px | Forms with multiple sections or a preview pane |

## 3. Anatomy

A modal consists of: a header (title in `text-h4`, close icon button top-right), a body with `space-6` padding, and a footer with right-aligned action buttons — Secondary (Cancel) to the left of Primary (Confirm/Save), per the button order convention that the primary, forward-moving action is always the right-most and visually final element.

## 4. Backdrop

The backdrop behind a modal uses `bg-canvas` at 70% opacity over the underlying view, sufficient to visually recede the background per the elevation model in `elevation.md` (DS-020), Section 2, while the modal itself uses `bg-surface-raised` at `elevation-3`.

## 5. Focus Management

On open, focus moves to the modal's first focusable element (or the modal container itself if the first action is destructive, to prevent accidental activation). Focus is trapped within the modal — Tab cycles only through the modal's own focusable elements — and returns to the triggering element on close, per `accessibility.md` (DS-015), Section 3.

## 6. Dismissal

A modal can be dismissed via the close icon, the Cancel button, the `Esc` key, or a backdrop click — except for modals confirming a destructive, irreversible action, where backdrop click and `Esc` are disabled to prevent accidental dismissal that could be mistaken for confirmation.

## 7. Responsive Behavior

Below `bp-sm` (per `responsive-design.md`, DS-017), modals expand to full-screen rather than a centered floating panel, with the header's close icon replaced by a back arrow to match mobile navigation conventions.

## 8. Nested Modals

Moscow OS avoids opening a modal from within another modal. Where a sub-task would traditionally require a nested modal (for example, creating a new client while creating a project), the sub-task is instead handled inline within the parent modal or as a full replacement of the modal's content with a clear back action.

## References

`layouts.md` (DS-019); `elevation.md` (DS-020); `buttons.md` (DS-007); `accessibility.md` (DS-015); `responsive-design.md` (DS-017).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
