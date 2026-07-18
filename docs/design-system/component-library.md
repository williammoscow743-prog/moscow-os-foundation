[Moscow OS Logo Placeholder]

# MOSCOW OS

**Organize. Build. Grow.**

# Component Library

**Document ID:** DS-018
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

This document is the complete inventory of every UI component currently in use across Moscow OS. It exists so that no component is built twice under different names, and so that any engineer, designer, or AI assistant can confirm what already exists before creating something new, consistent with the Contribution Guidelines in `docs/design-system/README.md` (DS-001).

## Scope

Covers every reusable UI component in the Moscow OS web application. Components with substantial standalone documentation are summarized here with a reference to their full document; components without a dedicated document are fully specified here.

---

## 1. How to Read This Inventory

Each component entry states its Purpose, Usage guidance, Variants, States, key Properties, Accessibility notes, and Best Practices. Where a component has a dedicated document elsewhere in `docs/design-system/`, this entry is a summary and the dedicated document is authoritative for full detail.

## 2. Components with Dedicated Documents

| Component | Document |
|---|---|
| Buttons | `buttons.md` (DS-007) |
| Inputs, Dropdowns, Checkboxes, Radio Buttons, Switches, Date Pickers | `forms.md` (DS-008) |
| Tables | `tables.md` (DS-010) |
| Cards | `cards.md` (DS-009) |
| Dialogs (Modals) | `modals.md` (DS-025) |
| Drawers | `sidebars.md` (DS-026), Section 6 |
| Notifications (Toasts, Notification Center) | `notifications.md` (DS-014) |
| Badges | `notifications.md` (DS-014), Section 4 |
| Breadcrumbs, Tabs | `navigation.md` (DS-011) |
| Search Bars | `search.md` (DS-027) |
| Command Palette | `command-palette.md` (DS-028) |
| Loading Skeletons | `loading-states.md` (DS-023) |
| Empty States | `empty-states.md` (DS-022) |
| Charts | `charts.md` (DS-013) |
| Dashboard Widgets | `dashboard.md` (DS-012) |

## 3. Tooltip

**Purpose:** Provide brief, supplementary information tied to a specific element, typically on hover or keyboard focus.

**Usage:** Used for icon-only button labels (in addition to, not instead of, `aria-label` per `icons.md`, DS-006, Section 6), truncated text reveal, and brief contextual hints. Never used to convey information required to complete a task, since tooltips are not reliably discoverable on touch devices.

**Variants:** Default (single line), Multi-line (up to three lines, for slightly longer explanations).

**States:** Hidden (default) → Visible (after a 400ms hover delay, or immediately on keyboard focus).

**Properties:** `bg-surface-overlay` background, `elevation-3`, `text-caption` text, `radius-sm` corners, `space-2` padding, small directional arrow pointing to the trigger element.

**Accessibility:** Associated with its trigger via `aria-describedby`; dismissible via `Esc`; never the sole carrier of essential information, per `accessibility.md` (DS-015), Section 6.

**Best Practices:** Keep tooltip text under roughly 80 characters; do not place interactive elements inside a tooltip.

## 4. Avatar

**Purpose:** Represent a user or organization visually, using an image, initials, or icon fallback.

**Usage:** Used in the Top Navigation (`navigation.md`, DS-011, Section 4), task assignment, comment threads, and team member lists.

**Variants:** Image, Initials (two-letter fallback on a `chart-#`-derived background color assigned consistently per user), Icon (generic placeholder for system or unassigned states).

**Sizes:** `avatar-xs` (20px, dense lists), `avatar-sm` (24px, table rows), `avatar-md` (32px, default), `avatar-lg` (40px, profile headers), `avatar-xl` (64px, profile pages).

**States:** Default; Stacked (overlapping group of avatars for multiple assignees, showing a "+N" overflow indicator beyond three).

**Accessibility:** Always includes an accessible name (the represented person's or organization's name), never relying on the image alone.

**Best Practices:** Initials fallback color is deterministic (hashed from user ID) so a given person's color stays constant across sessions and views.

## 5. Tag

**Purpose:** Label a record with a short, often user-defined categorization distinct from system Status (which uses Badge, per `notifications.md`, DS-014, Section 4).

**Usage:** Used for project tags, client categorization, and document labels.

**Variants:** Neutral (default `bg-surface-overlay`), Colored (user- or system-assigned color from the `chart-#` set for visual differentiation across many tags).

**States:** Default, Removable (includes a small close icon, used in filter chip contexts per `tables.md`, DS-010, Section 4), Hover (on removable tags only).

**Properties:** `text-caption`, `weight-medium`, `radius-full` corners, `space-1` vertical / `space-2` horizontal padding — visually similar to Badge but distinguished by being user-manageable rather than system-derived.

**Accessibility:** Removable tags expose their remove action with an `aria-label` of "Remove [tag name]", not an unlabeled icon alone.

**Best Practices:** Limit visible tags per record to a reasonable number (typically five) with a "+N more" overflow, to prevent tag lists from overwhelming the surrounding UI.

## 6. Accordion

**Purpose:** Progressively disclose content, hiding secondary detail until requested, per the Progressive Disclosure principle referenced in the System Overview (DOC-100), Section 2.4.

**Usage:** Used for FAQ-style content, long-form settings pages, and secondary detail sections within a Detail View (`layouts.md`, DS-019, Section 3) that would otherwise overwhelm the primary content.

**Variants:** Single-open (expanding one item collapses others, used for FAQs), Multi-open (independent expand/collapse, used for settings sections).

**States:** Collapsed (default), Expanded, Hover (header row).

**Properties:** Header row uses `text-h4` with a chevron icon (`icon-sm`) that rotates 180 degrees on expand, animated at `duration-fast` per `animations.md` (DS-016).

**Accessibility:** Header is a `<button>` with `aria-expanded` reflecting current state and `aria-controls` referencing the panel's ID, per `accessibility.md` (DS-015), Section 6.

**Best Practices:** Do not nest accordions more than one level deep; deeper nesting indicates the content should be restructured.

## 7. Progress Bar

**Purpose:** Communicate determinate completion progress.

**Usage:** File uploads in Documents, multi-step onboarding, milestone completion percentage on Project cards.

**Variants:** Linear (default), Circular (compact contexts, such as inline with a file name).

**States:** In progress (animated fill), Complete (`semantic-success` fill), Error (`semantic-danger` fill with a retry affordance).

**Properties:** Track uses `bg-surface-overlay`; fill uses `brand-build` by default, or the relevant semantic color per state; `radius-full` on both track and fill.

**Accessibility:** Uses `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`, per `accessibility.md` (DS-015), Section 6.

**Best Practices:** Do not use Progress Bar for indeterminate-duration operations; use a Spinner instead, per `loading-states.md` (DS-023), Section 2.

## 8. Stepper

**Purpose:** Guide a user through a defined, ordered, multi-step process.

**Usage:** Multi-step onboarding flows (for example, initial organization setup) and multi-stage forms too long for a single Modal, per `layouts.md` (DS-019), Section 4.

**Variants:** Horizontal (default, desktop), Vertical (mobile, or when step labels are long).

**States:** Upcoming (`text-tertiary`, unfilled marker), Current (`brand-build` marker and label), Completed (`semantic-success` checkmark marker, `text-secondary` label).

**Properties:** Steps connected by a horizontal or vertical line using `border-default`, filled with `brand-build` up to the current step to show overall progress at a glance.

**Accessibility:** Exposed as an ordered list with the current step indicated via `aria-current="step"`.

**Best Practices:** Limit to five or fewer steps; longer processes are broken into a saved-progress flow rather than a single long stepper.

## 9. Pagination

**Purpose:** Navigate large data sets in fixed-size pages, as the default pattern for tables per `tables.md` (DS-010), Section 7.

**Usage:** Below any table or card grid exceeding its single-page item threshold.

**Variants:** Numbered (page 1, 2, 3…, used for tables), Range-only ("1–25 of 340" with next/previous only, used for narrower or mobile contexts).

**States:** Default page button, Current page (`brand-build-subtle` background, `text-primary`), Disabled (first/previous on page one; last/next on the final page).

**Properties:** Page buttons share sizing with `button-sm` per `buttons.md` (DS-007), Section 3.

**Accessibility:** Wrapped in a `<nav>` with `aria-label="Pagination"`; the current page button carries `aria-current="page"`.

**Best Practices:** Persist the user's page position when they navigate away and back within the same session where reasonably possible, to avoid losing their place in a large data set.

## 10. AI-Attributed Content Pattern

**Purpose:** A cross-cutting pattern, not a single component, ensuring AI Workspace-generated content is always visually distinguishable from user-entered data, per the AI-Native principle in `design-principles.md` (DS-002), Section 5.

**Usage:** Applied to any Card (`cards.md`, DS-009, Section 6), Dashboard Widget (`dashboard.md`, DS-012, Section 2), Notification (`notifications.md`, DS-014, Section 6), or Search/Command Palette result (`search.md`, DS-027, Section 8; `command-palette.md`, DS-028, Section 6) that originates from the AI Workspace.

**Treatment:** A 4px `brand-build` accent bar and a small "AI" or "AI Summary" label in `text-caption`, applied consistently regardless of host component.

**Accessibility:** The AI-origin label is included in the element's accessible name or description, not conveyed by the accent bar's color alone, per `accessibility.md` (DS-015), Section 4.

## References

Every component-specific document in `docs/design-system/`; `design-principles.md` (DS-002); System Overview (DOC-100), Section 2.4; `accessibility.md` (DS-015); `animations.md` (DS-016).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
