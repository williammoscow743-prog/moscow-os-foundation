[Moscow OS Logo Placeholder]

# MOSCOW OS

**Organize. Build. Grow.**

# Navigation

**Document ID:** DS-011
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

This document defines the navigation patterns used across Moscow OS: top navigation, breadcrumbs, and tabs. Sidebar navigation, being the primary module-switching mechanism, is covered separately in `sidebars.md` (DS-026).

## Scope

Covers persistent and contextual navigation elements shared across modules.

---

## 1. Top Navigation Bar

| Property | Value |
|---|---|
| Height | 56px |
| Background | `bg-surface` |
| Border | `border-subtle` bottom, 1px |
| Contents (left to right) | Sidebar collapse toggle, contextual page title, global search trigger, notifications icon, AI Workspace quick-access, user avatar menu |

The top navigation bar is persistent across all authenticated views and never scrolls out of view.

## 2. Breadcrumbs

Breadcrumbs appear directly below the top navigation bar when the current view is nested more than one level deep (for example, Projects → [Project Name] → Milestones → [Milestone Name]). Each segment except the current (final) one is an interactive link styled in `text-secondary`; the current segment is `text-primary` and not interactive. Segments are separated by a `ChevronRight` icon at `icon-sm`.

## 3. Tabs

| Property | Value |
|---|---|
| Underline (active) | 2px `brand-build`, positioned under the active tab label |
| Label (active) | `text-primary`, `weight-semibold` |
| Label (inactive) | `text-secondary`, `weight-medium` |
| Label (hover, inactive) | `text-primary` |

Tabs are used to switch between views of the same entity (for example, a Project's Overview, Tasks, Files, and Activity tabs) — never used as a substitute for primary navigation between modules, which is the sidebar's responsibility per `sidebars.md` (DS-026).

## 4. User Avatar Menu

The user avatar in the top navigation opens a dropdown (per `color-system.md`, DS-003, overlay conventions) containing profile settings, organization switcher (for users belonging to multiple organizations), and sign out, in that fixed order.

## 5. Contextual Page Title

The page title area in the top navigation reflects the current view's primary entity (a project name, a client name) rather than the module name alone, giving the user constant confirmation of their location without relying on breadcrumbs alone.

## 6. Keyboard Navigation

All navigation elements are reachable via keyboard in a logical tab order: sidebar, top navigation, breadcrumbs, tabs, then page content. The Command Palette (`command-palette.md`, DS-028) provides a keyboard-first alternative path to any destination reachable through visual navigation.

## 7. Active State Indication

The currently active navigation item, at every level (sidebar, tabs), is indicated redundantly through both color (`brand-build`) and a persistent visual marker (underline for tabs, filled background for sidebar items) rather than color alone, satisfying the non-color-dependent indication requirement in `accessibility.md` (DS-015), Section 4.

## References

`design-tokens.md` (DS-031); `sidebars.md` (DS-026); `command-palette.md` (DS-028); `color-system.md` (DS-003); `accessibility.md` (DS-015).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
