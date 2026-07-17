![Moscow OS Logo](../assets/moscow-os-logo.png)

# Glossary

**Document ID:** DOC-013
**Version:** 1.0.0
**Status:** Active
**Owner:** Documentation Architecture Team
**Last Updated:** 2026-07-17

---

## Purpose

This document defines canonical terminology used across all Moscow OS documentation, ensuring that terms are used consistently regardless of which document or author introduces them.

## Scope

Applies to all documents under `docs/`. Terms defined here take precedence over any conflicting informal usage elsewhere in the documentation set.

---

## 1. Product and Business Terms

| Term | Definition |
|---|---|
| Moscow OS | The AI-native Business Operating System described in the System Overview (DOC-100); a unified platform for project delivery, client management, finance, scheduling, documents, and AI-assisted operations. |
| Business Operating System | The long-term product category Moscow OS occupies: a single platform on which an organization's core operations run, as opposed to a point solution addressing one function. |
| Organisation | A single customer account within Moscow OS, encapsulating its own users, clients, projects, and data, isolated from other organisations per the Security Overview. |
| Module | One of the eight functional areas of Moscow OS: Projects, CRM, Finance, Calendar, Documents, AI Workspace, Reporting, and Administration. |

## 2. Module Terms

| Term | Definition |
|---|---|
| Projects | The module managing project records, their milestones, and tasks. |
| CRM | The module managing client relationship records, referred to as "Clients" in the System Overview (DOC-100), Section 6.5. |
| Finance | The module managing invoicing, expenses, and profitability reporting. |
| Calendar | The module providing a unified, time-based view of deadlines and scheduled events aggregated from other modules. |
| Documents | The module managing storage, organization, and templated generation of business documents. |
| AI Workspace | The module through which users interact with AI assistance grounded in their own organisation's data. |
| Reporting | The module providing configurable views of business performance across projects, clients, and finance. |
| Administration | The module managing organisation configuration, users, integrations, and platform billing. |

## 3. Architecture and Technical Terms

| Term | Definition |
|---|---|
| MCP Server | Model Context Protocol Server; the controlled interface through which AI systems query and act upon Moscow OS data without direct database access. |
| Row Level Security (RLS) | A PostgreSQL enforcement mechanism, managed through Supabase, that restricts data access to a user's own organisation at the database layer. |
| RBAC | Role-Based Access Control; a planned future capability providing configurable roles, permissions, and department-level scoping, per the System Overview (DOC-100), Section 9.6. |
| Edge Function | A Supabase-hosted function implementing backend logic that cannot be expressed declaratively at the database layer. |

## 4. Documentation and Process Terms

| Term | Definition |
|---|---|
| Document ID (DOC-ID) | The permanent, unique identifier assigned to a document under `document-numbering.md` (DOC-004), independent of filename. |
| ADR | Architecture Decision Record; a permanent record of a specific architectural decision, numbered independently under `docs/architecture/decisions/`. |
| Active / Draft / Deprecated / Superseded | The four lifecycle states a document may hold, defined in `documentation-framework.md` (DOC-002), Section 2. |
| Framework Document | Any document under `docs/framework/` (DOC-001 through DOC-013) governing how documentation itself is produced. |

## 5. Adding New Terms

New terms are added to this glossary at the time they are introduced in any other document, in the same pull request, rather than being backfilled later. Terms are added to the section that best matches their category in Sections 1 through 4 above; a fifth section may be added if a new category of terminology emerges that does not fit the existing four.
