![Moscow OS Logo](../assets/moscow-os-logo.png)

# AI Architecture

**Document ID:** ARCH-013
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

This document defines how the AI Workspace module and other AI-assisted product features are built, grounded, and constrained, per the System Overview (DOC-100), Section 6.10.

## Scope

Covers the AI Workspace's technical implementation. The controlled data-access layer it depends on is covered in `mcp-architecture.md` (ARCH-012).

---

## 1. AI Feature Inventory

| Feature | Description | Grounding Mechanism |
|---|---|---|
| Summarization | Project/client status summaries | MCP tool calls retrieving current record state |
| Drafting | Client communication and document drafting | MCP tool calls for context, LLM generation for prose |
| Natural-language query | Command Palette "Ask AI Workspace" (`docs/design-system/command-palette.md`, DS-028, Section 6) | MCP tool calls resolving the query against organization data |
| Proactive suggestions (future) | Flagging at-risk projects, overdue receivables | Planned per the Future Vision in the System Overview (DOC-100), Section 15 |

## 2. Request Flow

1. The client sends the user's request to a dedicated AI Workspace Edge Function.
2. The Edge Function determines what grounding data is required and issues MCP Server tool calls (per `mcp-architecture.md`, ARCH-012) to retrieve it, scoped to the user's session.
3. The Edge Function constructs a prompt combining the user's request and the retrieved grounding data, and calls the LLM Provider.
4. The LLM Provider's response is returned to the client and rendered using the AI-attribution pattern in `docs/design-system/component-library.md` (DS-018), Section 10.

## 3. No Direct Client-to-LLM Calls

The client never calls the LLM Provider directly; every AI feature is mediated by a server-side Edge Function, per `architecture-principles.md` (ARCH-003), Section 4, so that LLM Provider credentials are never exposed client-side and every request can be scoped, logged, and rate-limited server-side.

## 4. Explainability

Every AI-generated output is traceable to the specific grounding data (MCP tool calls) that produced it, satisfying the explainability requirement in the Security Overview (DOC-100), Section 9.5. AI Workspace responses are presented as reviewable suggestions, not autonomous, unreviewable actions, per the System Overview (DOC-100), Section 6.10.

## 5. Consent Enforcement

AI Workspace features respect the AI Consent settings described in the Security Overview (DOC-100), Section 9.5, enforced at the MCP Server layer per `mcp-architecture.md` (ARCH-012), Section 5, before any organization data reaches the LLM Provider.

## 6. Cost and Rate Management

LLM Provider calls carry a direct cost per invocation; the AI Workspace Edge Functions apply per-user and per-organization rate limits and, where applicable, response caching for identical or near-identical queries within a short window, per `caching-strategy.md` (ARCH-015), Section 4.

## 7. Data Sent to the LLM Provider

Only the specific grounding data retrieved through scoped MCP tool calls is included in a given prompt — never a bulk export of organization data — minimizing the data surface exposed to the external LLM Provider per request.

## 8. Failure Handling

If the LLM Provider is unavailable or a request fails, the AI Workspace surfaces a clear, non-blocking error per `docs/design-system/error-states.md` (DS-024), Section 2, and the rest of the application remains fully functional — no core Moscow OS workflow depends on AI Workspace availability to function.

## 9. Future: Proactive and Agentic Assistance

The Future Vision in the System Overview (DOC-100), Section 15, describes AI Workspace evolving toward proactive, agentic assistance. This will be implemented as scheduled or event-triggered Edge Function invocations (per `event-architecture.md`, ARCH-014) using the same MCP-mediated grounding and consent model described above, rather than a separate, less-constrained access path.

## References

`docs/product/01 - System Overview` (DOC-100), Sections 6.10, 9.5, 15; `mcp-architecture.md` (ARCH-012); `architecture-principles.md` (ARCH-003); `caching-strategy.md` (ARCH-015); `event-architecture.md` (ARCH-014); `docs/design-system/component-library.md` (DS-018); `docs/design-system/error-states.md` (DS-024); `docs/design-system/command-palette.md` (DS-028).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
