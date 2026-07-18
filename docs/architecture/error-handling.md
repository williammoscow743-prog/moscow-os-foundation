![Moscow OS Logo](../assets/moscow-os-logo.png)

# Error Handling

**Document ID:** ARCH-023
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

This document defines the consistent error contract used across the Moscow OS architecture, supporting the Fail Predictably principle in `architecture-principles.md` (ARCH-003), Section 8, and the presentation patterns in `docs/design-system/error-states.md` (DS-024).

## Scope

Covers error propagation from the database and Edge Functions through to the client. Client-side presentation of errors is covered in `docs/design-system/error-states.md` (DS-024); this document covers how errors are structured and propagated.

---

## 1. Error Response Contract

Every API surface (PostgREST, Edge Functions, MCP tools) returns errors in a consistent shape: an error code, a human-readable message safe to display to the end user, and an optional technical detail field intended for logging rather than direct display, mirroring the Error Copy Standards in `docs/design-system/error-states.md` (DS-024), Section 4.

## 2. Error Categories

| Category | Example | HTTP-Equivalent Status |
|---|---|---|
| Validation | Malformed input to an Edge Function | 400 |
| Authentication | Missing or expired session token | 401 |
| Authorization | RLS policy rejects the operation | 403 |
| Not Found | Referenced record does not exist or is not visible to the user | 404 |
| Conflict | A concurrent update conflict | 409 |
| Rate Limited | Request exceeds a configured rate limit, per `mcp-architecture.md` (ARCH-012), Section 9 | 429 |
| Upstream Failure | The LLM Provider or another external dependency is unavailable | 502/503 |
| Internal | An unexpected server-side failure | 500 |

## 3. Authorization vs. Not-Found Distinction

Per `authorization-architecture.md` (ARCH-010), Section 7, a request for a record the user cannot access due to RLS returns a Not Found response rather than a Forbidden one wherever revealing the record's existence itself would leak information (for example, confirming that a specific client record exists in another organization). Where the distinction carries no information-leakage risk, a Forbidden response is used for clearer user messaging, per `docs/design-system/error-states.md` (DS-024), Section 6.

## 4. Retry Semantics

Errors in the Rate Limited and Upstream Failure categories are retryable by the client, following the Retry Behavior guidance in `docs/design-system/error-states.md` (DS-024), Section 5. Validation, Authorization, and Not Found errors are not retryable without the user changing their input or context.

## 5. Frontend Error Handling

The frontend's data layer (TanStack Query, per `frontend-architecture.md`, ARCH-006, Section 4) maps the error contract in Section 1 to the appropriate presentation defined in `docs/design-system/error-states.md` (DS-024): field-level errors to inline form messaging, action-level errors to toasts, and view-level or application-level failures to their respective in-place or full-page error states.

## 6. Error Boundaries

Unhandled frontend exceptions are caught by module-level error boundaries, per `frontend-architecture.md` (ARCH-006), Section 8, preventing a failure in one module from taking down the application shell.

## 7. Logging of Errors

Every error at the Internal or Upstream Failure level is logged per `logging.md` (ARCH-022), Section 2, at Error level, with the correlation ID described in `logging.md` (ARCH-022), Section 7, allowing an error surfaced to a user to be traced back to its full server-side context.

## References

`architecture-principles.md` (ARCH-003); `docs/design-system/error-states.md` (DS-024); `authorization-architecture.md` (ARCH-010); `mcp-architecture.md` (ARCH-012); `frontend-architecture.md` (ARCH-006); `logging.md` (ARCH-022).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
