[Moscow OS Logo Placeholder]

# MOSCOW OS

**Organize. Build. Grow.**

# Sidebars

**Document ID:** DS-026
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

This document defines the primary sidebar navigation and the drawer pattern used for secondary side-anchored panels across Moscow OS.

## Scope

Covers the module-switching sidebar and generic drawers. Settings-specific secondary navigation is covered in `layouts.md` (DS-019), Section 6.

---

## 1. Primary Sidebar

The primary sidebar is the main mechanism for switching between Moscow OS modules (Dashboard, Projects, CRM, Finance, Calendar, Documents, AI Workspace, Reporting, Administration, per the System Overview, DOC-100, Section 6), and is persistent across all authenticated views except where collapsed per responsive rules.

| State | Width | Content |
|---|---|---|
| Expanded | 280px | Module icon + label, organization switcher, user account area |
| Collapsed | 72px | Module icon only, with label shown via tooltip on hover |

## 2. Sidebar Item States

| State | Treatment |
|---|---|
| Default | `text-secondary` label and icon |
| Hover | `bg-surface` background fade-in, `text-primary` |
| Active (current module) | `brand-build-subtle` background, `brand-build` left accent bar (3px), `text-primary` label |

## 3. Sidebar Structure

Top to bottom: Moscow OS logo/mark (collapses to a compact mark when the sidebar is collapsed), primary module navigation list, a divider, secondary items (Settings, Help), and the user account area anchored to the bottom.

## 4. Collapse Behavior

The sidebar's expanded/collapsed state is a persistent user preference, stored per user, not reset on every session. The collapse toggle lives in the Top Navigation Bar per `navigation.md` (DS-011), Section 1.

## 5. Mobile Sidebar (Drawer)

Below `bp-md` (per `responsive-design.md`, DS-017), the sidebar is hidden by default and accessed via a hamburger trigger in the Top Navigation Bar, opening as a full-height drawer sliding in from the left, using `elevation-3` and `duration-moderate` per `animations.md` (DS-016), Section 4. The drawer closes on item selection, backdrop click, or `Esc`.

## 6. Generic Drawers

Beyond the mobile sidebar, drawers are used elsewhere for secondary side-anchored content that benefits from remaining connected to its trigger context (for example, a task's detail panel opened from a list without full navigation away from the list). Drawers use `modal-md`-equivalent width (560px) when right-anchored on desktop, and share the focus-trapping and dismissal rules defined for modals in `modals.md` (DS-025), Sections 5–6.

## 7. Accessibility

The sidebar's current module is exposed via `aria-current="page"` on the active item, not conveyed by styling alone, per `accessibility.md` (DS-015), Section 6. Drawers, like modals, trap focus while open and are announced to screen readers as dialogs when they overlay content, or as navigation landmarks when persistent.

## References

`navigation.md` (DS-011); `animations.md` (DS-016); `modals.md` (DS-025); `responsive-design.md` (DS-017); `accessibility.md` (DS-015); System Overview (DOC-100), Section 6.

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
