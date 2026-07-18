![Moscow OS Logo](../assets/moscow-os-logo.png)

# Logging

**Document ID:** ARCH-022
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

This document defines Moscow OS's logging standards: what is logged, in what format, and for how long, supporting both operational troubleshooting and the audit requirements described in `mcp-architecture.md` (ARCH-012), Section 6.

## Scope

Covers structured application and audit logging. Metrics and alerting are covered in `monitoring.md` (ARCH-021).

---

## 1. Logging Principles

Every Edge Function and server-side operation emits structured (not free-text) logs by default, per the Observable by Default principle in `architecture-principles.md` (ARCH-003), Section 7, so logs are machine-parseable for both automated alerting and after-the-fact investigation.

## 2. Log Levels

| Level | Usage |
|---|---|
| Error | An operation failed and requires attention |
| Warn | An unexpected but non-fatal condition (e.g. a retried operation) |
| Info | A significant, expected event (e.g. a completed AI Workspace request) |
| Debug | Detailed diagnostic information, enabled selectively, never in Production by default |

## 3. Required Log Fields

Every structured log entry includes, at minimum: timestamp, log level, the originating Edge Function or component, a correlation ID tying related log entries across a single request's lifecycle, and, where applicable, the acting user's ID and `organisation_id` — never the user's raw personal data beyond identifiers necessary for correlation, consistent with the User Privacy principles in the System Overview (DOC-100), Section 9.4.

## 4. MCP and AI Audit Logging

Every MCP Server tool invocation is logged per `mcp-architecture.md` (ARCH-012), Section 6, including the invoking user, tool name, and outcome. AI Workspace Edge Function invocations log the grounding tool calls made and the LLM Provider call's success/failure, without logging the full prompt or response content by default, to limit sensitive data retention in logs while preserving enough detail for explainability and troubleshooting.

## 5. What Is Never Logged

Passwords, full authentication tokens, LLM Provider API keys, and raw payment or financial account details are never written to logs, even at Debug level, consistent with `security-architecture.md` (ARCH-018), Section 4.

## 6. Log Retention

Logs are retained for a duration sufficient to support incident investigation and the audit requirements referenced above, after which they are purged per the platform's data retention configuration, consistent with the User Privacy principles in the System Overview (DOC-100), Section 9.4. Retention duration is a configuration value maintained in the logging platform, not fixed in this document.

## 7. Correlation Across Layers

A single correlation ID, generated at the point a client request originates, is propagated through the frontend request, the Edge Function(s) it triggers, and any MCP tool calls made on its behalf, so a single user-facing action can be traced end to end across the architecture described in `high-level-architecture.md` (ARCH-004).

## 8. Access to Logs

Log access is restricted to Engineering roles with an operational need, consistent with the least-privilege posture in `security-architecture.md` (ARCH-018), Section 6.

## References

`architecture-principles.md` (ARCH-003); `mcp-architecture.md` (ARCH-012); `ai-architecture.md` (ARCH-013); `security-architecture.md` (ARCH-018); `high-level-architecture.md` (ARCH-004); `docs/product/01 - System Overview` (DOC-100), Section 9.4; `monitoring.md` (ARCH-021).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
