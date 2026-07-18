[Moscow OS Logo Placeholder]

# MOSCOW OS

**Organize. Build. Grow.**

# Layouts

**Document ID:** DS-019
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

This document defines the page-level layout patterns used across Moscow OS modules, so that structurally similar pages (a list view, a detail view, a form view) are composed consistently regardless of module.

## Scope

Covers the shell layout and standard page templates. Individual component styling is defined in each component's own document.

---

## 1. Application Shell

Every authenticated view is composed of three persistent regions: the Sidebar (`sidebars.md`, DS-026) on the left, the Top Navigation Bar (`navigation.md`, DS-011, Section 1) across the top of the content area, and the Content Area filling the remaining space. This shell does not change between modules; only the Content Area's contents change.

## 2. List View Template

Used for module landing pages showing a collection of records (Projects, Clients, Tasks). Structure, top to bottom: page header (title, primary action button, search/filter bar), then either a Table (`tables.md`, DS-010) or a card grid (`cards.md`, DS-009), depending on the data type.

## 3. Detail View Template

Used for a single record's full view (a specific Project, Client, or Document). Structure: page header (entity name, breadcrumb per `navigation.md`, DS-011, Section 2, primary actions), Tabs (`navigation.md`, DS-011, Section 3) dividing the record's sub-views, and tab content filling the remainder.

## 4. Form View Template

Used for creation and editing flows. Short forms render within a Modal (`modals.md`, DS-025); long, multi-section forms (such as full Client onboarding) render as a dedicated page with a single-column form, maximum width 640px, so line length stays readable per `typography.md` (DS-004).

## 5. Split View Template

Used where a list and a detail need to be visible simultaneously (for example, a Documents module showing a folder tree alongside document contents). The list/tree pane uses a fixed width (280–360px); the detail pane fills the remainder and scrolls independently.

## 6. Settings Layout

Used throughout the Administration and Settings module (System Overview, DOC-100, Section 6.12). Structure: a secondary, static left navigation listing setting categories (distinct from the primary Sidebar), with the selected category's form content in the remaining space, following the Form View Template's single-column conventions.

## 7. Page Header Anatomy

Every template's page header follows the same structure: title (`text-h1`), optional descriptive subtitle (`text-body`, `text-secondary`), and right-aligned primary action button(s), separated from page content below by `space-8` per `spacing.md` (DS-005), Section 3.

## 8. Content Max Width

Content Area contents do not exceed 1440px max width on ultra-wide displays; content is centered with equal margins beyond that width rather than stretching indefinitely, preserving readable line lengths and consistent widget proportions.

## References

`sidebars.md` (DS-026); `navigation.md` (DS-011); `tables.md` (DS-010); `cards.md` (DS-009); `modals.md` (DS-025); `spacing.md` (DS-005); `typography.md` (DS-004); System Overview (DOC-100), Section 6.12.

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
