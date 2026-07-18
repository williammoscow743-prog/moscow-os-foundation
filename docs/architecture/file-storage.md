![Moscow OS Logo](../assets/moscow-os-logo.png)

# File Storage

**Document ID:** ARCH-016
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

This document defines how Moscow OS stores, organizes, and secures file objects, primarily in support of the Documents module described in the System Overview (DOC-100), Section 6.8.

## Scope

Covers file object storage architecture. Document metadata (as opposed to the underlying file bytes) is covered by the Documents module's own Database Design document, per `docs/templates/database-design-template.md` (TPL-006).

---

## 1. Storage Platform

Supabase Storage, built on object storage with a Postgres-backed metadata layer, per the System Overview (DOC-100), Section 7.2.

## 2. Bucket Organization

Files are organized into buckets scoped by module and access pattern (for example, a `documents` bucket for user-uploaded business documents, an `avatars` bucket for profile images). Within a bucket, objects are namespaced by `organisation_id` as the top-level path segment, mirroring the multi-tenancy model in `database-architecture.md` (ARCH-008), Section 3.

## 3. Access Control

Storage access is governed by Storage policies functionally equivalent to Row Level Security, evaluated against the requesting user's `organisation_id` and role, per `authorization-architecture.md` (ARCH-010). A user can never retrieve a file object belonging to another organization, regardless of whether they know or guess its storage path.

## 4. Upload Flow

Clients upload directly to Supabase Storage using a signed, scoped upload credential issued after the client's request is authorized, rather than routing file bytes through an Edge Function, minimizing latency and server-side load for large file uploads.

## 5. Document Versioning

The Documents module (System Overview, DOC-100, Section 6.8) requires version history for uploaded documents. Each new version is stored as a distinct object, with a metadata table (per that module's Database Design document) tracking the version lineage and current-version pointer, rather than overwriting objects in place.

## 6. File Size and Type Constraints

Upload constraints (maximum file size, accepted MIME types) are enforced both client-side (for immediate user feedback, per `docs/design-system/forms.md`, DS-008) and server-side (as the authoritative check, since client-side validation can be bypassed).

## 7. Generated and Templated Documents

Documents generated from templates (per `docs/templates/`, TPL-001 through TPL-027, as an authoring pattern, and the Documents module's own in-product templating described in the System Overview, DOC-100, Section 6.8) are produced by an Edge Function and written to Storage using the same upload and access-control path as user-uploaded files, so generated and uploaded documents are indistinguishable in their storage and security treatment.

## 8. Retention and Deletion

File objects are deleted when their owning record is deleted, via the same cascade behavior described in `database-architecture.md` (ARCH-008), Section 8, consistent with the User Privacy principles in the Security Overview (DOC-100), Section 9.4.

## References

`docs/product/01 - System Overview` (DOC-100), Sections 6.8, 7.2, 9.4; `database-architecture.md` (ARCH-008); `authorization-architecture.md` (ARCH-010); `docs/design-system/forms.md` (DS-008); `docs/templates/database-design-template.md` (TPL-006).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
