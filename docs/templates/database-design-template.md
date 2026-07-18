[Moscow OS Logo Placeholder]

# MOSCOW OS

**Organize. Build. Grow.**

# [Module or Domain Name] — Database Design

**Document ID:** [DOC-2XX]
**Version:** [0.0.0]
**Status:** [Draft / Active / Deprecated / Superseded]
**Author:** [Name or Team]
**Reviewer:** [Name or Team]
**Approved By:** [Name or Team]
**Created:** [YYYY-MM-DD]
**Updated:** [YYYY-MM-DD]
**Classification:** [Internal / Confidential / Public]

---

## Revision History

| Version | Date | Author | Summary of Changes |
|---|---|---|---|
| 0.1.0 | [YYYY-MM-DD] | [Name] | Initial draft |

## Table of Contents

*[Insert generated table of contents here once the document's section structure is finalized.]*

---

## 1. Purpose

*[State which part of the Moscow OS PostgreSQL schema this document defines.]*

## 2. Scope

*[State which tables and relationships are covered. Reference related domains covered elsewhere by Document ID (for example, the Finance schema referencing the Clients schema it depends on).]*

## 3. Entity Relationship Overview

*[Describe, or reference an appendix diagram of, how the entities in this domain relate to one another and to entities owned by other modules, consistent with the module interdependencies described in the System Overview (DOC-100), Section 6.]*

## 4. Table Definitions

*[Repeat the structure below for each table in scope.]*

### 4.1 Table: [table_name]

**Description:** [What this table represents]

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | uuid | Primary Key | [description] |
| organisation_id | uuid | Foreign Key, Not Null | Owning organisation, per Row Level Security scoping |
| [column] | [type] | [constraints] | [description] |

**Indexes:**

| Index Name | Columns | Type | Purpose |
|---|---|---|---|
| [index_name] | [columns] | [btree/gin/etc.] | [purpose] |

## 5. Relationships

*[List foreign key relationships between tables in this domain and tables in other domains, including cascade behavior on delete/update.]*

| From Table | From Column | To Table | To Column | On Delete |
|---|---|---|---|---|
| [table] | [column] | [table] | [column] | [cascade/restrict/set null] |

## 6. Row Level Security Policies

*[Describe the RLS policy applied to each table in this domain, consistent with the Security Overview in the System Overview (DOC-100), Section 9.3. State the scoping rule in plain language (e.g. "Users may only select rows where organisation_id matches their authenticated organisation").]*

## 7. Migration Notes

*[Describe any considerations for migrating existing data when this schema changes, including backfill requirements and rollback strategy.]*

## 8. Data Retention and Deletion

*[Describe how long data in this domain is retained and what happens on organisation or record deletion, consistent with the User Privacy principles in the System Overview (DOC-100), Section 9.4.]*

## References

*[List every other Moscow OS document referenced in this document, using its Document ID.]*

## Appendices

*[Include the full entity relationship diagram, sample seed data, or other supplementary material. State "None" if not applicable.]*

---

© 2026 Moscow OS
All Rights Reserved
