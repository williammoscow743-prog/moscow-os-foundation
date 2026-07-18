![Moscow OS Logo](../assets/moscow-os-logo.png)

# Monitoring

**Document ID:** ARCH-021
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

This document defines what Moscow OS monitors, how, and why, in support of the Observable by Default principle in `architecture-principles.md` (ARCH-003), Section 7.

## Scope

Covers metrics, dashboards, and alerting. Structured log content is covered separately in `logging.md` (ARCH-022).

---

## 1. What Is Monitored

| Category | Metrics | Source |
|---|---|---|
| Application availability | Uptime, error rate | Frontend and Edge Function health checks |
| Database performance | Query latency, connection pool saturation, slow query log | Supabase platform metrics |
| Edge Function performance | Invocation count, duration, error rate, cold start frequency | Supabase platform metrics |
| AI Workspace | LLM Provider call volume, latency, cost, failure rate | AI Workspace Edge Functions, per `ai-architecture.md` (ARCH-013) |
| Frontend performance | Page load time, bundle size, Core Web Vitals | Real-user monitoring |
| MCP Server | Tool call volume, latency, denied-by-consent rate | MCP Server logs, per `mcp-architecture.md` (ARCH-012), Section 6 |

## 2. Dashboards

A primary operational dashboard aggregates application availability, database performance, and Edge Function health, providing the first place an engineer checks during an incident, consistent with the crisis-response posture in `disaster-recovery.md` (ARCH-025). A secondary AI Workspace dashboard tracks LLM Provider cost and performance separately, given its distinct cost profile per `caching-strategy.md` (ARCH-015), Section 4.

## 3. Alerting Thresholds

| Condition | Severity | Response |
|---|---|---|
| Error rate exceeds a defined threshold over a rolling window | Critical | Immediate on-call notification |
| Database connection pool saturation approaching capacity | High | Notification to Engineering Leadership |
| Edge Function cold-start rate significantly elevated | Medium | Reviewed in next working-hours check |
| AI Workspace cost trending significantly above baseline | Medium | Reviewed by module owner |

Specific numeric thresholds are maintained in the monitoring platform's configuration rather than duplicated here, so they can be tuned without requiring a documentation update for every adjustment; this document defines the categories and response posture, which change far less often than the thresholds themselves.

## 4. Relationship to Business Objectives

Monitoring data directly informs the Business Intelligence and scaling-trigger decisions described in `scalability.md` (ARCH-020), Section 6, and the Success Metrics defined in the System Overview (DOC-100), Section 14 — for example, engagement and reliability metrics draw on the same underlying monitoring data.

## 5. Incident Escalation

A Critical alert initiates the process defined in `docs/templates/incident-response-template.md` (TPL-025). Monitoring data referenced during an incident is captured in that incident's report per that template's Section 10.

## 6. Synthetic Monitoring

In addition to real-user and infrastructure metrics, synthetic checks periodically exercise core user flows (authentication, a representative data read) from outside the Moscow OS infrastructure, catching availability issues that might not otherwise trigger an internal metric threshold.

## References

`architecture-principles.md` (ARCH-003); `ai-architecture.md` (ARCH-013); `mcp-architecture.md` (ARCH-012); `caching-strategy.md` (ARCH-015); `scalability.md` (ARCH-020); `disaster-recovery.md` (ARCH-025); `docs/product/01 - System Overview` (DOC-100), Section 14; `docs/templates/incident-response-template.md` (TPL-025).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
