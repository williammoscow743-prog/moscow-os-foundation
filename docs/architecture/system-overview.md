![Moscow OS Logo](../assets/moscow-os-logo.png)

# Architecture System Overview

**Document ID:** ARCH-002
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

This document establishes the architectural system context for Moscow OS: the actors that interact with it, the systems it depends on, and the boundaries between them. It is the technical counterpart to the product-level description in the System Overview (DOC-100), and every other document in `docs/architecture/` assumes this context.

## Scope

Covers system-level context only — actors, external dependencies, and boundary definitions. Internal component structure is covered in `high-level-architecture.md` (ARCH-004).

---

## 1. Actors

| Actor | Description |
|---|---|
| End User | An authenticated member of an organization using the Moscow OS web application |
| Organization Administrator | An end user with elevated permissions over their organization's configuration, per the System Overview (DOC-100), Section 9.6 |
| AI Assistant (via AI Workspace) | An AI system operating within a user's session, grounded in that user's own organization data |
| AI Coding Assistant (ChatGPT, Claude, Loveable) | A development-time actor operating on the Moscow OS codebase itself, not the running product, per `docs/framework/ai-collaboration.md` (DOC-009) |
| External Integrator (future) | A third-party system consuming Moscow OS data via API, per the integration roadmap in the System Overview (DOC-100), Section 5.3 |

## 2. External Systems

| System | Role |
|---|---|
| Supabase | Managed backend: PostgreSQL database, authentication, storage, Edge Functions, and Realtime |
| GitHub | Source control and CI/CD, per `docs/framework/github-workflow.md` (DOC-008) |
| Lovable | Frontend development tooling used during implementation, per the System Overview (DOC-100), Section 7.9 |
| LLM Provider(s) | Underlying model provider(s) powering AI Workspace features, accessed through a controlled server-side integration layer, never directly from the client |

## 3. System Boundary

Moscow OS's system boundary encloses the frontend application and the Supabase project (database, auth, storage, functions) provisioned for it. Everything within this boundary is subject to the Row Level Security and organization-scoping rules defined in `security-architecture.md` (ARCH-018). Everything outside it — the LLM provider, GitHub, Lovable — is treated as an external dependency accessed through a defined, narrow interface, never given direct access to the database.

## 4. Context Diagram (Description)

*[A visual context diagram is a pending appendix item; until produced, the boundary is as follows.]* The End User's browser communicates exclusively with the Supabase project (via `supabase-js` and Edge Function HTTP calls) and, indirectly, with the LLM Provider through server-side Edge Functions or the MCP Server — never directly. The AI Coding Assistant actor operates entirely outside the running system, against the GitHub repository and this documentation set, and has no runtime access to production data.

## 5. Trust Boundaries

| Boundary | Enforcement |
|---|---|
| Browser ↔ Supabase | JWT-based authentication (`authentication-architecture.md`, ARCH-009) and Row Level Security (`database-architecture.md`, ARCH-008) |
| Supabase ↔ LLM Provider | Server-side only, via Edge Functions or the MCP Server (`mcp-architecture.md`, ARCH-012), with no LLM Provider credential ever exposed to the client |
| Organization ↔ Organization | Enforced entirely by Row Level Security at the database layer; no organization's data is ever visible to another organization's queries |

## 6. Relationship to the Product System Overview

This document assumes and does not repeat the product context established in the System Overview (DOC-100): the module list (Section 6), the target user segments (Section 4), and the Product Scope (Section 5). Where this document and the System Overview appear to describe the same concept at different levels of detail, the System Overview is authoritative for product intent, and this document (and the rest of `docs/architecture/`) is authoritative for technical implementation.

## References

`docs/product/01 - System Overview` (DOC-100), Sections 4, 6, 7; `high-level-architecture.md` (ARCH-004); `security-architecture.md` (ARCH-018); `authentication-architecture.md` (ARCH-009); `mcp-architecture.md` (ARCH-012).

## Appendices

*[A visual context diagram is pending and will be added here once produced.]*

---

© 2026 Moscow OS
All Rights Reserved
