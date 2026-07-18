![Moscow OS Logo](../assets/moscow-os-logo.png)

# Event Architecture

**Document ID:** ARCH-014
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

This document defines how Moscow OS propagates real-time updates to clients and how cross-module side effects are triggered, without a dedicated message broker in Version 1.

## Scope

Covers Realtime client updates and database-trigger-driven side effects. Notification delivery built on top of this layer is covered in `notifications.md` (ARCH-017).

---

## 1. Two Event Mechanisms

| Mechanism | Purpose |
|---|---|
| Supabase Realtime | Push live data changes to connected clients (UI updates) |
| PostgreSQL triggers / Edge Function webhooks | Trigger server-side cross-module side effects |

## 2. Supabase Realtime

Realtime subscribes clients to changes on specific tables or filtered subsets thereof, delivered over websocket. Subscriptions are evaluated against the same Row Level Security policies as standard queries, per `database-architecture.md` (ARCH-008), Section 4, so a client only receives events for rows it is already permitted to see — there is no separate Realtime-specific authorization model to maintain.

## 3. Client Integration

The frontend's shared Realtime hook (`frontend-architecture.md`, ARCH-006, Section 7) subscribes to the tables relevant to the currently rendered view and updates the corresponding TanStack Query cache entries directly on incoming events, avoiding a full refetch for small, incremental changes.

## 4. Database-Triggered Side Effects

Cross-module side effects (for example, marking a Finance invoice paid updating the associated Project's financial summary, per `application-architecture.md`, ARCH-005, Section 5) are implemented via PostgreSQL triggers calling a Supabase database webhook, which invokes the relevant Edge Function to perform the cross-module update. This keeps the side effect's logic server-side and auditable rather than relying on the client to make multiple, potentially inconsistent writes.

## 5. Idempotency

Every event-triggered Edge Function is designed to be idempotent — safely re-runnable with the same input without duplicating its effect — since webhook delivery does not guarantee exactly-once execution. This is a required property of any new event-triggered function, not an optional enhancement.

## 6. Why No Message Broker in Version 1

Supabase Realtime and database triggers are sufficient for Version 1's event volume and complexity, per the Product Scope in the System Overview (DOC-100), Section 5.2. A dedicated message broker or queue system is deferred until a specific requirement — such as ordered, guaranteed cross-service delivery at a volume Realtime and triggers cannot support — is documented and justified via an ADR, per `architecture-principles.md` (ARCH-003), Section 1.

## 7. Event Failure Handling

A failed database webhook delivery is retried per Supabase's platform-level retry policy. Failures exhausting retries are logged per `logging.md` (ARCH-022), Section 3, and, for side effects with financial or data-integrity significance, surfaced through the standard Issue Report process (`docs/templates/issue-report-template.md`, TPL-021) rather than failing silently.

## 8. Notification Generation

Notification records (`notifications.md`, ARCH-017) are created as a database-triggered side effect per Section 4 above — a notification-generating event is itself just another cross-module side effect, using the same mechanism as any other.

## References

`docs/product/01 - System Overview` (DOC-100), Section 5.2; `database-architecture.md` (ARCH-008); `application-architecture.md` (ARCH-005); `frontend-architecture.md` (ARCH-006); `notifications.md` (ARCH-017); `logging.md` (ARCH-022); `architecture-principles.md` (ARCH-003).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
