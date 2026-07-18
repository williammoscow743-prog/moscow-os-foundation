![Moscow OS Logo](../assets/moscow-os-logo.png)

# Security Architecture

**Document ID:** ARCH-018
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

This document consolidates the technical security architecture of Moscow OS, drawing together mechanisms defined individually elsewhere in `docs/architecture/` into a single security-focused reference, operationalizing the Security Overview in the System Overview (DOC-100), Section 9.

## Scope

Covers the platform's technical security model end to end. Organizational security policy (as opposed to technical architecture) is covered by `docs/templates/security-policy-template.md` (TPL-024)-based documents, not this one.

---

## 1. Security Model Summary

| Concern | Mechanism | Detailed In |
|---|---|---|
| Identity | Supabase Auth, OAuth 2.1, JWT sessions | `authentication-architecture.md` (ARCH-009) |
| Tenant isolation | Row Level Security | `database-architecture.md` (ARCH-008) |
| Authorization | RLS + role model (Version 1), planned RBAC | `authorization-architecture.md` (ARCH-010) |
| AI data access | MCP Server, consent-gated | `mcp-architecture.md` (ARCH-012), `ai-architecture.md` (ARCH-013) |
| File access | Storage policies mirroring RLS | `file-storage.md` (ARCH-016) |
| Transport security | TLS for all client-server and server-server communication | This document, Section 3 |
| Secrets management | Managed by Supabase and CI/CD secret stores | This document, Section 4 |

## 2. Defense in Depth

No single mechanism above is treated as sufficient alone. RLS is the authoritative enforcement point for data isolation, but application-layer checks, MCP-layer consent gates, and audit logging (`logging.md`, ARCH-022) each provide an additional layer, consistent with the Security Enforced at the Data Layer principle in `architecture-principles.md` (ARCH-003), Section 2, while not being the only layer relied upon.

## 3. Transport Security

All communication between the client, Supabase, Edge Functions, and the LLM Provider occurs over TLS. No component of the Moscow OS architecture communicates over unencrypted HTTP at any layer.

## 4. Secrets Management

Application secrets (LLM Provider API keys, service-role credentials) are stored in Supabase's and the CI/CD platform's managed secret stores, never committed to the repository, per `docs/framework/repository-standards.md` (DOC-007), Section 6, and `docs/framework/github-workflow.md` (DOC-008), Section 5. Secrets are scoped to the minimum environment and function that requires them.

## 5. Encryption at Rest

Data at rest in PostgreSQL and Supabase Storage is encrypted using Supabase's managed platform encryption, consistent with the Managed Services Over Custom Infrastructure principle in `architecture-principles.md` (ARCH-003), Section 1 — Moscow OS does not implement custom at-rest encryption on top of the managed platform's guarantees.

## 6. Least Privilege

Service-role database access (bypassing RLS) is granted only to specific, documented Edge Functions with a justified need, per `backend-architecture.md` (ARCH-007), Section 5, never as a default convenience.

## 7. AI-Specific Security Boundaries

No LLM Provider credential is ever exposed client-side (`ai-architecture.md`, ARCH-013, Section 3); no organization data reaches the LLM Provider without passing through consent-gated MCP tool calls (`mcp-architecture.md`, ARCH-012, Section 5); every such data access is audit-logged (`mcp-architecture.md`, ARCH-012, Section 6).

## 8. Vulnerability and Dependency Management

Frontend and Edge Function dependencies are kept current through routine update review as part of standard engineering practice, per the Continuous Improvement principle in the System Overview (DOC-100), Section 11.5. Security-relevant dependency updates are treated as elevated-priority per `docs/framework/review-process.md` (DOC-011).

## 9. Incident Response

A suspected security incident follows `docs/templates/incident-response-template.md` (TPL-025) and, where it involves a security policy area, `docs/templates/security-policy-template.md` (TPL-024). Rollback and hotfix mechanics are covered in `docs/framework/release-process.md` (DOC-012), Section 6.

## References

`docs/product/01 - System Overview` (DOC-100), Section 9, 11.5; `authentication-architecture.md` (ARCH-009); `database-architecture.md` (ARCH-008); `authorization-architecture.md` (ARCH-010); `mcp-architecture.md` (ARCH-012); `ai-architecture.md` (ARCH-013); `file-storage.md` (ARCH-016); `backend-architecture.md` (ARCH-007); `logging.md` (ARCH-022); `docs/framework/repository-standards.md` (DOC-007); `docs/templates/incident-response-template.md` (TPL-025); `docs/templates/security-policy-template.md` (TPL-024).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
