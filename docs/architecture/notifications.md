![Moscow OS Logo](../assets/moscow-os-logo.png)

# Notification Architecture

**Document ID:** ARCH-017
**Version:** 1.0.0
**Status:** Active
**Owner:** Engineering Leadership
**Last Updated:** 2026-07-18

---

## Revision History

| Version | Date | Author | Summary of Changes |
|---|---|---|---|
| 1.0.0 | 2026-07-18 | Engineering Leadership | Initial publication |

## Table of Contents

*[Insert generated table of contents here once the document's section structure is finalized.]*

---

## Purpose

This document defines the technical delivery architecture behind the Notifications module described in the System Overview (DOC-100), Section 6. Its visual and interaction specification is covered separately in `docs/design-system/notifications.md` (DS-014); this document covers how a notification is generated, stored, and delivered.

## Scope

Covers notification generation, storage, and delivery channels.

---

## 1. Notification Generation

Notifications are generated as a database-triggered side effect, per `event-architecture.md` (ARCH-014), Section 8: an action in any module (a task assignment, an approaching deadline, an AI Workspace flag) triggers a database function that inserts a notification record, addressed to the relevant user(s).

## 2. Notification Storage

Notification records live in a dedicated `notifications` table, scoped by `organisation_id` and recipient `user_id`, with standard Row Level Security ensuring a user can only ever query their own notifications, per `database-architecture.md` (ARCH-008), Section 4.

## 3. Delivery Channels

| Channel | Mechanism | Status |
|---|---|---|
| In-app notification center | Supabase Realtime push to the client, per `event-architecture.md` (ARCH-014), Section 2 | Version 1 |
| Toast (immediate, session-active) | Same Realtime channel, rendered per `docs/design-system/notifications.md` (DS-014), Section 1 | Version 1 |
| Email | External transactional email provider integration | Planned, per the integration roadmap in the System Overview (DOC-100), Section 5.3 |

## 4. Delivery Guarantee

In-app notification delivery is at-least-once: a notification record, once created, is always retrievable by the recipient on next login even if the Realtime push was missed while they were offline, since the notification center (per `docs/design-system/notifications.md`, DS-014, Section 2) reads directly from the persisted table rather than relying solely on the transient push.

## 5. User Preferences

Delivery is filtered per the user's notification preferences (System Overview, DOC-100, Section 6.12; `docs/design-system/notifications.md`, DS-014, Section 5) at generation time — a notification a user has opted out of is not created at all, rather than being created and then filtered client-side, avoiding unnecessary storage and reducing the chance of a preference being bypassed by a client-side bug.

## 6. AI-Originated Notifications

Notifications originating from AI Workspace analysis (per the Future Vision in the System Overview, DOC-100, Section 15) are generated through the same Edge Function and MCP-mediated grounding path described in `ai-architecture.md` (ARCH-013), writing to the same `notifications` table with an origin flag distinguishing them for the AI-attribution UI treatment in `docs/design-system/notifications.md` (DS-014), Section 6.

## 7. Read State and Cleanup

A notification's read state is tracked per-recipient. Notification records are retained per the data retention rules referenced in `database-architecture.md` (ARCH-008), Section 8, and are not deleted merely upon being read, preserving them for the notification center's historical view.

## References

`docs/product/01 - System Overview` (DOC-100), Sections 6, 6.12, 15; `docs/design-system/notifications.md` (DS-014); `event-architecture.md` (ARCH-014); `database-architecture.md` (ARCH-008); `ai-architecture.md` (ARCH-013).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
