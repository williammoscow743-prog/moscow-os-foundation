![Moscow OS Logo](../assets/moscow-os-logo.png)

# API Architecture

**Document ID:** ARCH-011
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

This document defines the API surfaces Moscow OS exposes, both internally (to its own frontend) and, per the future roadmap, externally.

## Scope

Covers API surface architecture. Individual endpoint contracts are documented per-service using `docs/templates/api-specification-template.md` (TPL-005). The MCP Server's distinct tool-based API is covered separately in `mcp-architecture.md` (ARCH-012).

---

## 1. API Surfaces

| Surface | Consumer | Mechanism |
|---|---|---|
| PostgREST (auto-generated) | Moscow OS frontend | Direct table/view access via `supabase-js`, RLS-enforced |
| Edge Function endpoints | Moscow OS frontend | HTTPS calls for business logic per `backend-architecture.md` (ARCH-007), Section 3 |
| MCP Server tools | AI Workspace, AI coding assistants | Controlled tool contracts, per `mcp-architecture.md` (ARCH-012) |
| Public API (future) | External Integrators | Per the integration roadmap in the System Overview (DOC-100), Section 5.3; not present in Version 1 |

## 2. API Design Principles

Edge Function endpoints follow REST conventions where a resource-oriented model fits, and RPC-style naming where the operation is an action rather than a resource (for example, `generate-invoice-pdf` rather than forcing an artificial resource model onto it). Every endpoint returns a consistent response envelope and error shape, per `error-handling.md` (ARCH-023), Section 2.

## 3. Versioning

API versioning follows `docs/framework/versioning-policy.md` (DOC-005). Version 1 does not expose a public, externally-versioned API; internal Edge Function endpoints are versioned implicitly through the deployment process described in `deployment-architecture.md` (ARCH-019), with breaking changes coordinated directly with the single (first-party) consumer, the Moscow OS frontend, rather than requiring parallel version support.

## 4. Authentication for API Calls

Every API call (PostgREST or Edge Function) carries the caller's JWT, per `authentication-architecture.md` (ARCH-009), Section 2. No API surface accepts unauthenticated requests except the initial authentication endpoints themselves.

## 5. Rate Limiting

Rate limiting is enforced at the Supabase platform level for PostgREST and Edge Functions. Endpoints with higher abuse potential (for example, AI Workspace query endpoints, given their downstream LLM Provider cost) may implement additional application-level rate limiting, documented in that endpoint's own API Specification.

## 6. Public API (Future)

When a public, external API is introduced per the System Overview (DOC-100), Section 5.3, it will be versioned explicitly (e.g., `/v1/`), authenticated via scoped API keys or OAuth 2.1 client credentials distinct from end-user session tokens, and will expose only the subset of data and operations explicitly designed for external consumption — never a direct passthrough to internal PostgREST access.

## 7. Documentation Requirement

Every API endpoint, internal or future-external, is documented using `docs/templates/api-specification-template.md` (TPL-005) before being considered complete, per the Release Strategy documentation requirement in `docs/templates/release-notes-template.md` (TPL-018) and `docs/framework/release-process.md` (DOC-012), Section 3.

## References

`docs/product/01 - System Overview` (DOC-100), Section 5.3; `backend-architecture.md` (ARCH-007); `mcp-architecture.md` (ARCH-012); `error-handling.md` (ARCH-023); `deployment-architecture.md` (ARCH-019); `docs/templates/api-specification-template.md` (TPL-005); `docs/framework/versioning-policy.md` (DOC-005).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
