![Moscow OS Logo](../assets/moscow-os-logo.png)

# Scalability

**Document ID:** ARCH-020
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

This document defines how the Moscow OS architecture scales along the dimensions defined in the Scalability business objective in the System Overview (DOC-100), Section 3.1: data volume, user count, and workflow complexity.

## Scope

Covers architectural scaling strategy and headroom. Day-to-day performance tuning is covered in `performance.md` (ARCH-024).

---

## 1. Scaling Dimensions

| Dimension | Current Approach | Headroom Strategy |
|---|---|---|
| Data volume (records per organization) | Indexed Postgres tables, per `database-architecture.md` (ARCH-008), Section 6 | Additional indexing, query optimization guided by `monitoring.md` (ARCH-021) |
| User count (per organization and platform-wide) | Row Level Security scoped queries, connection pooling via Supabase | Read replicas (future), if platform-wide connection load requires it |
| Concurrent sessions | Stateless Edge Functions, auto-scaling per invocation | No architectural change required; scales with Supabase platform capacity |
| Workflow complexity (feature growth) | Modular application architecture, per `application-architecture.md` (ARCH-005) | New modules added without restructuring existing ones |

## 2. Database Scaling

PostgreSQL scaling is handled first through query and index optimization (`database-architecture.md`, ARCH-008, Section 6) and Supabase's managed connection pooling. Vertical scaling of the underlying database instance is the next lever as load grows. Read replicas and, if eventually necessary, horizontal partitioning by organization are noted as future options, evaluated against actual `monitoring.md` (ARCH-021) data rather than adopted preemptively, per `architecture-principles.md` (ARCH-003), Section 6.

## 3. Compute Scaling

Edge Functions scale automatically per invocation under Supabase's serverless model, requiring no manual capacity planning for typical load growth. The frontend, being a static CDN-served bundle, scales inherently with CDN capacity and requires no application-level scaling work.

## 4. Multi-Tenancy Scaling

Because all organizations share a single logical database distinguished by `organisation_id` and Row Level Security (`database-architecture.md`, ARCH-008, Section 3), adding organizations does not require provisioning new infrastructure per tenant. This keeps operational overhead flat as the platform grows from a single-user account to the hundreds-of-organizations scale implied by the System Overview (DOC-100), Section 3.1.

## 5. AI Workload Scaling

AI Workspace load (LLM Provider calls) scales independently of core platform load, since it is mediated through dedicated Edge Functions with their own rate limiting, per `ai-architecture.md` (ARCH-013), Section 6. A surge in AI usage does not degrade core CRUD performance, since the two paths do not share a bottleneck beyond the shared database, which AI queries access through the same RLS-scoped, indexed paths as any other read.

## 6. Scaling Triggers

Architectural scaling changes (read replicas, dedicated caching, partitioning) are triggered by specific, monitored thresholds defined in `monitoring.md` (ARCH-021) — not adopted speculatively — and are recorded as an ADR per `architecture-decision-records.md` (ARCH-026) when implemented.

## 7. Relationship to Business Objectives

This scaling strategy directly supports the Scalability business objective in the System Overview (DOC-100), Section 3.1: the architecture is designed to support growth from a single freelancer to a multi-department enterprise without requiring an architectural rewrite at any point along that path.

## References

`docs/product/01 - System Overview` (DOC-100), Section 3.1; `database-architecture.md` (ARCH-008); `application-architecture.md` (ARCH-005); `ai-architecture.md` (ARCH-013); `monitoring.md` (ARCH-021); `performance.md` (ARCH-024); `architecture-decision-records.md` (ARCH-026); `architecture-principles.md` (ARCH-003).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
