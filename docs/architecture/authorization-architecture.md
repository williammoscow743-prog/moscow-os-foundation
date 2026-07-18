![Moscow OS Logo](../assets/moscow-os-logo.png)

# Authorization Architecture

**Document ID:** ARCH-010
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

This document defines how Moscow OS determines what an authenticated user is permitted to do, building on the Authorization principle in the System Overview (DOC-100), Section 9.2.

## Scope

Covers permission enforcement, current (Version 1) and planned (future RBAC). Identity establishment is covered separately in `authentication-architecture.md` (ARCH-009).

---

## 1. Enforcement Layers

Authorization is enforced at two layers: Row Level Security at the database layer (`database-architecture.md`, ARCH-008, Section 4), which is the authoritative and non-bypassable enforcement point, and application-layer checks in the frontend, which exist only to shape the user experience (hiding actions a user cannot perform) and are never relied upon as a security boundary on their own.

## 2. Version 1 Permission Model

Version 1 implements a foundational, organization-scoped permission model: every authenticated user is a member of one or more organizations, and within an organization holds one of a small, fixed set of roles (Owner, Administrator, Member), per the System Overview (DOC-100), Section 9.2. RLS policies reference this role alongside `organisation_id` for operations requiring elevated privilege within an organization (for example, only Administrators can modify organization billing settings, per `docs/design-system/layouts.md`, DS-019, Section 6).

## 3. Role Definitions (Version 1)

| Role | Typical Permissions |
|---|---|
| Owner | Full access, including billing and organization deletion |
| Administrator | Full access to configuration and user management, per `docs/templates/administrator-guide-template.md` (TPL-010) |
| Member | Access to assigned projects, clients, and standard module functionality; no organization configuration access |

## 4. Resource-Level Permissions

Beyond organization-level roles, certain modules (Projects, in particular) support resource-level assignment (a Member may only see Projects they are assigned to, depending on organization configuration), implemented as an additional RLS condition joining through an assignment table rather than a separate permission system.

## 5. Future RBAC

Full Role-Based Access Control — configurable custom roles, department-level scoping, and granular per-module permissions — is planned per the System Overview (DOC-100), Section 9.6, to serve the Future Enterprise Customers segment (DOC-100, Section 4.7). This will extend, not replace, the RLS-based enforcement model: custom roles will resolve to the same underlying policy evaluation, preserving the principle in `architecture-principles.md` (ARCH-003), Section 2, that enforcement always lives at the data layer.

## 6. Authorization for AI-Driven Actions

Actions taken through the AI Workspace or suggested by AI are subject to the same authorization checks as the equivalent action taken directly by the user; the AI Workspace holds no elevated privilege beyond the acting user's own, per `authentication-architecture.md` (ARCH-009), Section 8, and `mcp-architecture.md` (ARCH-012).

## 7. Authorization Failure Handling

An authorization failure (an RLS policy rejecting an operation) surfaces to the client as a defined error per `error-handling.md` (ARCH-023), Section 3, and is presented to the user per the Permission and Not-Found Errors pattern in `docs/design-system/error-states.md` (DS-024), Section 6, distinguishing "you don't have access" from "this doesn't exist."

## References

`docs/product/01 - System Overview` (DOC-100), Sections 4.7, 9.2, 9.6; `database-architecture.md` (ARCH-008); `authentication-architecture.md` (ARCH-009); `mcp-architecture.md` (ARCH-012); `error-handling.md` (ARCH-023); `docs/design-system/error-states.md` (DS-024); `docs/templates/administrator-guide-template.md` (TPL-010).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
