![Moscow OS Logo](../assets/moscow-os-logo.png)

# Caching Strategy

**Document ID:** ARCH-015
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

This document defines where and how caching is applied across Moscow OS to support the Fast principle in `docs/design-system/design-principles.md` (DS-002), Section 2, and the Performance-Focused principle, Section 10.

## Scope

Covers client-side, CDN, and AI-response caching. Database-level query optimization is covered in `database-architecture.md` (ARCH-008), Section 6, and `performance.md` (ARCH-024).

---

## 1. Caching Layers

| Layer | Mechanism | Purpose |
|---|---|---|
| Client data cache | TanStack Query | Avoid redundant Supabase queries within a session |
| Static asset cache | CDN (frontend build output) | Fast delivery of the Vite-built application bundle |
| AI response cache | Edge Function-level, short TTL | Avoid redundant LLM Provider calls for repeated identical queries |

## 2. Client-Side Data Caching

TanStack Query, per `frontend-architecture.md` (ARCH-006), Section 4, caches query results client-side with a stale-while-revalidate model: cached data is shown immediately while a background refetch confirms currency. Cache entries are invalidated precisely by query key when a related mutation occurs, rather than clearing the entire cache on any write.

## 3. Static Asset Caching

The Vite production build's output (JavaScript, CSS, and static assets) is served through a CDN with long-lived cache headers on content-hashed filenames, so a new deployment is always served fresh (the hash changes) while unchanged assets remain cached indefinitely, per `deployment-architecture.md` (ARCH-019), Section 4.

## 4. AI Response Caching

Given the direct cost of LLM Provider calls (`ai-architecture.md`, ARCH-013, Section 6), identical or near-identical AI Workspace queries within a short time window (per-organization, per-query) may be served from a short-lived cache rather than re-invoking the LLM Provider, provided the underlying grounding data has not changed since the cached response was generated.

## 5. No Dedicated Server-Side Cache in Version 1

Moscow OS does not operate a dedicated caching layer (such as Redis) in front of PostgreSQL in Version 1. Query performance is instead addressed through the indexing strategy in `database-architecture.md` (ARCH-008), Section 6, and Supabase's own connection pooling. A dedicated cache layer is introduced only if `monitoring.md` (ARCH-021) data demonstrates a specific bottleneck that indexing and pooling cannot resolve, recorded as an ADR per `architecture-decision-records.md` (ARCH-026).

## 6. Cache Invalidation on Realtime Events

Where a Realtime event (`event-architecture.md`, ARCH-014, Section 2) indicates underlying data has changed, the corresponding TanStack Query cache entry is invalidated or directly updated, so client-side caching never causes a user to see stale data for changes made by their own collaborators.

## 7. Cache Correctness Priority

In every caching decision, correctness (never showing meaningfully stale or wrong data) takes priority over cache hit rate. Where a trade-off must be made, Moscow OS prefers a shorter cache lifetime or an extra refetch over a risk of stale data, particularly for Finance and CRM data.

## References

`docs/design-system/design-principles.md` (DS-002); `frontend-architecture.md` (ARCH-006); `database-architecture.md` (ARCH-008); `ai-architecture.md` (ARCH-013); `event-architecture.md` (ARCH-014); `deployment-architecture.md` (ARCH-019); `performance.md` (ARCH-024); `architecture-decision-records.md` (ARCH-026).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
