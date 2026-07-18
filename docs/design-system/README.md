[Moscow OS Logo Placeholder]

# MOSCOW OS

**Organize. Build. Grow.**

# Moscow OS Design System

**Document ID:** DS-001
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
| 1.0.0 | 2026-07-18 | Design Systems Architecture Team | Initial publication of the Design System |

## Table of Contents

*[Insert generated table of contents here once the document's section structure is finalized.]*

---

## Purpose

This directory contains the official Moscow OS Design System: the single source of truth for how every Moscow OS surface looks, behaves, and feels, across every module and every current or future application built on the platform. It exists so that a button, a table, or a dashboard card is built the same way regardless of which engineer, designer, or AI assistant produces it.

## Scope

This Design System governs the visual language of the Moscow OS product — color, typography, spacing, components, layout, motion, and accessibility. It does not govern documentation formatting (see `docs/framework/markdown-style-guide.md`, DOC-006) or repository code structure (see `docs/framework/repository-standards.md`, DOC-007), though it is built to the same standard of consistency as both.

---

## Folder Structure

| File | Document ID | Covers |
|---|---|---|
| `design-principles.md` | DS-002 | The values and rules that guide every design decision |
| `color-system.md` | DS-003 | Full color palette, dark-theme hierarchy, semantic and chart colors |
| `typography.md` | DS-004 | Font families, type scale, weights, line heights |
| `spacing.md` | DS-005 | The 8-point spacing scale and its application |
| `icons.md` | DS-006 | Icon sizing, stroke width, and usage rules |
| `buttons.md` | DS-007 | Button variants, sizes, and states |
| `forms.md` | DS-008 | Inputs, dropdowns, checkboxes, radios, switches, date pickers |
| `cards.md` | DS-009 | Card anatomy and variants |
| `tables.md` | DS-010 | Data table structure and behavior |
| `navigation.md` | DS-011 | Top navigation, breadcrumbs, tabs |
| `dashboard.md` | DS-012 | Dashboard-specific layout and widget conventions |
| `charts.md` | DS-013 | Chart types and charting conventions |
| `notifications.md` | DS-014 | Toasts, in-app notifications, badges |
| `accessibility.md` | DS-015 | WCAG 2.2 AA compliance requirements |
| `animations.md` | DS-016 | Motion, transitions, and easing standards |
| `responsive-design.md` | DS-017 | Breakpoints and responsive behavior |
| `component-library.md` | DS-018 | Full inventory of every UI component in use |
| `layouts.md` | DS-019 | Page-level layout patterns |
| `elevation.md` | DS-020 | Shadow and surface elevation scale |
| `grids.md` | DS-021 | Grid system and column structure |
| `empty-states.md` | DS-022 | Empty-state content and layout standards |
| `loading-states.md` | DS-023 | Skeletons, spinners, and progress indicators |
| `error-states.md` | DS-024 | Error messaging and recovery patterns |
| `modals.md` | DS-025 | Dialogs and modal behavior |
| `sidebars.md` | DS-026 | Sidebar navigation and drawer patterns |
| `search.md` | DS-027 | Search bar and results presentation |
| `command-palette.md` | DS-028 | Command palette behavior and shortcuts |
| `data-visualization.md` | DS-029 | Cross-cutting data visualization standards |
| `themes.md` | DS-030 | Dark and light theme definitions |
| `design-tokens.md` | DS-031 | The canonical, implementation-ready token reference |

## How to Use This Design System

- **Designers** start with `design-principles.md` (DS-002), then reference `color-system.md` (DS-003) and `typography.md` (DS-004) before producing new screens.
- **Engineers** implementing UI should treat `design-tokens.md` (DS-031) as the canonical source for exact values, and `component-library.md` (DS-018) as the canonical source for component behavior — both take precedence over any value found only in a narrower document.
- **AI assistants** (ChatGPT, Claude, Loveable) generating or modifying UI must be given `design-tokens.md` (DS-031), `component-library.md` (DS-018), and the specific component document relevant to the task, consistent with `docs/framework/ai-collaboration.md` (DOC-009).
- **Anyone proposing a new pattern** not covered here follows the contribution process below before implementing it ad hoc.

## Contribution Guidelines

1. Check whether an existing pattern in `component-library.md` (DS-018) already solves the problem before proposing a new one.
2. Propose new tokens or components as a change to the relevant document, following the review process in `docs/framework/review-process.md` (DOC-011).
3. Never introduce a one-off color, spacing value, or font size outside the token set defined in `design-tokens.md` (DS-031); extend the token set instead, so the change benefits every future consumer.
4. Update `component-library.md` (DS-018) in the same change that introduces or modifies a component, so the inventory never drifts from what is actually implemented.

## Versioning

The Design System follows the semantic versioning rules in `docs/framework/versioning-policy.md` (DOC-005). A MAJOR version change indicates a token or component change that is not backward compatible (for example, a renamed color token); a MINOR version adds new tokens or components without breaking existing usage; a PATCH corrects documentation without changing any value or behavior.

## Relationship with the Documentation Framework

This Design System is governed by the same rules that govern every other Moscow OS document: numbering, versioning, review, and Markdown style, all defined in `docs/framework/`. It is a sibling to `docs/templates/` (the Template Library) — where the Template Library defines how documents are structured, this Design System defines how the product itself looks and behaves. Every document in this directory uses the `DS-###` identifier scheme, kept distinct from the `DOC-###` scheme used for product, architecture, and module documentation, and from the `TPL-###` scheme used for document templates, per the same rationale documented in `docs/templates/README.md` (TPL-001).

---

## References

`docs/framework/documentation-standards.md` (DOC-003); `docs/framework/document-numbering.md` (DOC-004); `docs/framework/versioning-policy.md` (DOC-005); `docs/framework/markdown-style-guide.md` (DOC-006); `docs/framework/review-process.md` (DOC-011); `docs/templates/README.md` (TPL-001).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
