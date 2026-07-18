![Moscow OS Logo](../assets/moscow-os-logo.png)

# MCP Architecture

**Document ID:** ARCH-012
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

This document defines the architecture of the MCP (Model Context Protocol) Server, the controlled interface through which AI systems interact with Moscow OS data, per the System Overview (DOC-100), Section 7.5.

## Scope

Covers the MCP Server's structure, tool model, and access controls. How the AI Workspace product feature uses this interface is covered in `ai-architecture.md` (ARCH-013).

---

## 1. Why an MCP Server Exists

Rather than granting AI systems direct database access, Moscow OS exposes a defined, narrow set of tools through the MCP Server, ensuring AI-driven data access is auditable, scoped, and consistent with the platform's Row Level Security model, per the System Overview (DOC-100), Section 7.5, and `architecture-principles.md` (ARCH-003), Section 4.

## 2. Tool Model

Each MCP tool corresponds to a specific, well-defined capability (for example, "list a client's active projects", "summarize a project's task completion status") rather than exposing raw SQL query access. Tools are versioned and documented individually using `docs/templates/api-specification-template.md` (TPL-005), Section 10.

## 3. Tool Registry

Each module that exposes AI-facing capability registers its tools with the MCP Server, per `application-architecture.md` (ARCH-005), Section 6. The registry is the single source of truth for what capability is available to any AI caller, internal (AI Workspace) or external (AI coding assistants operating on the codebase, which use a distinct, non-production-data tool set).

## 4. Access Scoping

Every MCP tool call executes within the context of the requesting user's authenticated session (per `authentication-architecture.md`, ARCH-009, Section 8) and is subject to the same Row Level Security policies as a direct user action, per `database-architecture.md` (ARCH-008), Section 4. No MCP tool grants access beyond what the invoking user could already access directly.

## 5. Consent Enforcement

Tool calls that access an organization's data honor the AI Consent settings described in the Security Overview (DOC-100), Section 9.5. A tool call against data for which AI access has not been consented to is rejected at the MCP Server layer before it reaches the database.

## 6. Audit Logging

Every MCP tool invocation is logged with the invoking user, the tool called, its parameters (excluding sensitive payload content where appropriate), and its outcome, per `logging.md` (ARCH-022), Section 4, supporting the explainability requirement in the Security Overview (DOC-100), Section 9.5.

## 7. Tool Output Handling

Tool results returned to an AI caller are treated as untrusted input by the calling system's own guardrails; the MCP Server's responsibility ends at returning correctly scoped data, not at policing what the calling AI system does with it downstream.

## 8. Separation from the Public API

The MCP Server is architecturally distinct from any future public API (`api-architecture.md`, ARCH-011, Section 6): it is purpose-built for AI tool-calling patterns (structured, discrete operations) rather than general-purpose external integration, and is not intended to be repurposed as a general external API surface.

## 9. Rate and Cost Controls

Given that MCP tool calls may be invoked automatically and repeatedly by an AI system during a single user interaction, the MCP Server enforces per-session and per-organization rate limits to bound both load and any downstream LLM Provider cost associated with AI Workspace usage, per `ai-architecture.md` (ARCH-013), Section 6.

## References

`docs/product/01 - System Overview` (DOC-100), Sections 7.5, 9.5; `architecture-principles.md` (ARCH-003); `authentication-architecture.md` (ARCH-009); `database-architecture.md` (ARCH-008); `ai-architecture.md` (ARCH-013); `logging.md` (ARCH-022); `docs/templates/api-specification-template.md` (TPL-005).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
