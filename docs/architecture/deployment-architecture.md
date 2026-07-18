![Moscow OS Logo](../assets/moscow-os-logo.png)

# Deployment Architecture

**Document ID:** ARCH-019
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

This document defines how Moscow OS is built, deployed, and promoted across environments, operationalizing `docs/framework/github-workflow.md` (DOC-008) and `docs/framework/release-process.md` (DOC-012) for this specific architecture.

## Scope

Covers environment topology and the deployment pipeline. Step-by-step operational procedure for a specific environment is documented using `docs/templates/installation-deployment-guide-template.md` (TPL-011).

---

## 1. Environment Topology

| Environment | Purpose | Supabase Project | Frontend Hosting |
|---|---|---|---|
| Local Development | Individual engineer development | Local Supabase instance or shared dev project | Vite dev server |
| Staging | Pre-production validation | Dedicated Supabase project | CDN-hosted preview build |
| Production | Live customer traffic | Dedicated Supabase project | CDN-hosted production build |

Each environment uses a fully separate Supabase project with no shared database, per `backend-architecture.md` (ARCH-007), Section 7, so staging data and experimentation never risk production data integrity.

## 2. Frontend Deployment

The Vite production build output is a static asset bundle, deployed to a CDN-backed hosting platform. Deployment is triggered automatically on merge to `main` (per `docs/framework/github-workflow.md`, DOC-008, Section 1) for Staging, and via an explicit promotion step for Production, consistent with the Release Stages defined in the System Overview (DOC-100), Section 12.

## 3. Backend Deployment

Database migrations and Edge Functions are deployed via the Supabase CLI as part of the same CI/CD pipeline, per `database-architecture.md` (ARCH-008), Section 9, and `backend-architecture.md` (ARCH-007), Section 6. Migrations are applied before the corresponding frontend build is promoted, so a deployed frontend never runs against a schema it does not yet expect.

## 4. CI/CD Pipeline

| Stage | Action |
|---|---|
| Pull Request | Lint, type check, automated tests, per `docs/framework/github-workflow.md` (DOC-008), Section 4 |
| Merge to `main` | Build, deploy to Staging, run migration |
| Production Promotion | Explicit approval gate, then deploy build and migration to Production |

## 5. Configuration Management

Environment-specific configuration (Supabase project URL, public keys) is injected at build time via environment variables, never hardcoded, per `docs/framework/repository-standards.md` (DOC-007), Section 6. Secrets used by Edge Functions are managed per `security-architecture.md` (ARCH-018), Section 4.

## 6. Rollback

A failed Production deployment is rolled back per the Rollback and Hotfix process in `docs/framework/release-process.md` (DOC-012), Section 6: the frontend reverts to the previous build artifact, and, if a migration is implicated, a compensating migration is applied rather than a destructive schema rollback, to avoid data loss.

## 7. Zero-Downtime Deployment

Frontend deployments are zero-downtime by nature of CDN-based static hosting (the new build is published atomically). Backend migrations are written to be backward-compatible with the currently deployed frontend for the duration of a deployment window, avoiding a hard cutover that could break in-flight client sessions.

## 8. Release Stage Alignment

This deployment architecture directly supports the Alpha, Beta, and Production release stages defined in the System Overview (DOC-100), Section 12: each stage maps to a combination of environment (Staging for Alpha/Beta validation, Production for general availability) and feature-flag configuration, rather than requiring a structurally different deployment pipeline per stage.

## References

`docs/product/01 - System Overview` (DOC-100), Section 12; `docs/framework/github-workflow.md` (DOC-008); `docs/framework/release-process.md` (DOC-012); `backend-architecture.md` (ARCH-007); `database-architecture.md` (ARCH-008); `security-architecture.md` (ARCH-018); `docs/templates/installation-deployment-guide-template.md` (TPL-011).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
