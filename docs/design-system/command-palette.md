[Moscow OS Logo Placeholder]

# MOSCOW OS

**Organize. Build. Grow.**

# Command Palette

**Document ID:** DS-028
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

This document defines the Command Palette: a keyboard-first, universal entry point for navigation and actions across Moscow OS, reflecting the AI-Native and power-user-friendly character of the platform.

## Scope

Covers the Command Palette's structure and behavior, distinct from Search (`search.md`, DS-027), which is content-lookup-focused rather than action-focused, though the two share a unified activation model described below.

---

## 1. Activation

The Command Palette opens via `Cmd/Ctrl + K` from anywhere in the authenticated application, overlaying the current view. This is the single, consistent shortcut across all modules — no module defines a conflicting local override.

## 2. Structure

The palette opens as a centered overlay (`modal-md` width, `elevation-4` per `elevation.md`, DS-020, Section 2) with a text input at the top and a scrollable, categorized result list below: Recent, Navigation (jump to a module or page), Actions (e.g. "Create Project", "Invite Team Member"), and Content Results (entities matching the typed query, sharing result presentation with `search.md`, DS-027, Section 3).

## 3. Query Behavior

An empty query shows Recent and top-level Navigation options. As the user types, results re-rank across all categories using fuzzy matching, with Actions and Navigation prioritized above Content Results unless the query strongly matches a specific entity name.

## 4. Keyboard Interaction

| Key | Behavior |
|---|---|
| `Cmd/Ctrl + K` | Open/close the palette |
| `↑` / `↓` | Move selection between results |
| `Enter` | Execute the selected action or navigate to the selected result |
| `Esc` | Close the palette without action |
| `Tab` | Switch between result categories, where categories are large enough to warrant it |

## 5. Action Items

Action items in the palette execute directly (for example, selecting "Create Project" opens the Project creation modal per `modals.md`, DS-025) rather than merely navigating to a page where the user must then click to start the action, minimizing steps for keyboard-first users.

## 6. AI Workspace Integration

The Command Palette is the primary entry point for direct, ad hoc AI Workspace queries: typing a natural-language question that does not match a navigation or action item is offered as an "Ask AI Workspace" option, styled with the AI-attribution treatment from `cards.md` (DS-009), Section 6, once a response is returned.

## 7. Discoverability

The keyboard shortcut is surfaced in the search trigger in the Top Navigation Bar (`navigation.md`, DS-011, Section 1) as a small shortcut hint (`Cmd K`) rendered in `text-caption`, so the capability is discoverable without requiring documentation.

## 8. Accessibility

The Command Palette is fully operable via keyboard by definition, and its result list uses `role="listbox"` with `aria-activedescendant` tracking the currently highlighted item, so screen reader users receive equivalent navigation feedback to sighted keyboard users, per `accessibility.md` (DS-015), Section 2.

## References

`search.md` (DS-027); `modals.md` (DS-025); `elevation.md` (DS-020); `navigation.md` (DS-011); `cards.md` (DS-009); `accessibility.md` (DS-015).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
