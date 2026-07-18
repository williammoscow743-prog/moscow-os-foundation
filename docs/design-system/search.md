[Moscow OS Logo Placeholder]

# MOSCOW OS

**Organize. Build. Grow.**

# Search

**Document ID:** DS-027
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

This document defines the search bar component and results presentation used across Moscow OS, distinct from the Command Palette (`command-palette.md`, DS-028), which handles keyboard-driven navigation and actions rather than content search.

## Scope

Covers global search (accessible from the Top Navigation Bar) and in-module scoped search (for example, filtering a table by keyword).

---

## 1. Global Search Trigger

The global search trigger sits in the Top Navigation Bar (`navigation.md`, DS-011, Section 1) as a compact input-styled button showing a search icon and placeholder text ("Search Moscow OS..."), expanding into a full search overlay on activation.

## 2. Global Search Overlay

On activation, global search opens as a centered overlay (per `modals.md`, DS-025, sizing conventions at `modal-lg`) with a prominent text input at the top and results grouped by entity type (Projects, Clients, Tasks, Documents) below, each group showing at most five results with a "View all results" link if more exist.

## 3. Result Item Anatomy

Each result item displays an icon indicating its entity type (per `icons.md`, DS-006), the matched title with the search term highlighted in `brand-build`, and a secondary line of contextual metadata (for example, the parent project of a matched task).

## 4. In-Module Scoped Search

Scoped search (searching within a single table or list) uses the same Text Input styling as `forms.md` (DS-008), Section 1, positioned within the page header per `layouts.md` (DS-019), Section 2, and filters the visible content directly rather than opening an overlay.

## 5. Debounce and Loading

Search queries debounce at 300ms after the last keystroke before firing, to avoid excessive requests while the user is still typing. While results are loading, the previous result set remains visible with a subtle loading indicator rather than clearing to an empty or skeleton state, avoiding visual flicker during fast typing.

## 6. Empty Search Results

A search with no matches uses the empty-state pattern in `empty-states.md` (DS-022), with copy suggesting a broader search term or a spelling check rather than a bare "No results."

## 7. Keyboard Interaction

Global search opens via a keyboard shortcut (documented in `command-palette.md`, DS-028, Section 4, since the two share the same activation key with different modes) and supports arrow-key navigation through results with `Enter` to select, without requiring the mouse.

## 8. AI-Assisted Search

Where global search results include an AI Workspace-generated answer (for example, a natural-language query answered by summarizing matching records) rather than a direct record match, that result is visually distinguished using the AI-attribution treatment defined in `cards.md` (DS-009), Section 6.

## References

`navigation.md` (DS-011); `modals.md` (DS-025); `forms.md` (DS-008); `icons.md` (DS-006); `empty-states.md` (DS-022); `command-palette.md` (DS-028); `cards.md` (DS-009).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
