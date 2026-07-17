![Moscow OS Logo](../assets/moscow-os-logo.png)

# Release Process

**Document ID:** DOC-012
**Version:** 1.0.0
**Status:** Active
**Owner:** Engineering Leadership
**Last Updated:** 2026-07-17

---

## Purpose

This document defines how Moscow OS product releases are staged, versioned, and shipped, and how documentation releases are coordinated with product releases.

## Scope

Applies to all product releases of Moscow OS and to documentation updates that accompany them. Complements `versioning-policy.md` (DOC-005), which defines the version numbering rules applied here.

---

## 1. Release Stages

Moscow OS follows the three-stage release strategy defined in the System Overview (DOC-100), Section 12:

- **Alpha** — Core module functionality delivered to a limited, internal or closely supervised set of users, for validating core workflows. Versioned `0.x.y`.
- **Beta** — Full Version 1 scope delivered to a broader set of early external users, with continued refinement based on feedback. Versioned `0.x.y`, approaching `1.0.0`.
- **Production** — General availability of Version 1 functionality to all target user segments, with production-grade reliability, security, and support. Versioned `1.0.0` and onward per `versioning-policy.md` (DOC-005), Section 3.

## 2. Release Criteria by Stage

| Stage | Entry Criteria |
|---|---|
| Alpha | Core modules functionally complete per their module specifications (DOC-300 range); CI passing on `main` |
| Beta | All Alpha feedback triaged and addressed or explicitly deferred; security review complete per Security Overview standards |
| Production | Beta stability confirmed over a defined observation period; support processes in place; documentation for all shipped modules marked `Active` |

## 3. Documentation Requirements Per Release

No feature is considered release-ready for Beta or Production until its corresponding module documentation (DOC-300 range) is at minimum in `Draft` status with core functionality described, and reaches `Active` status before Production general availability, consistent with `documentation-framework.md` (DOC-002), Section 2.

## 4. Versioning at Each Stage

Product version numbers follow `versioning-policy.md` (DOC-005), Section 3. Alpha and Beta releases remain below `1.0.0`; the transition to `1.0.0` occurs at Production general availability and is treated as a MAJOR version milestone regardless of the specific feature delta from the final Beta build.

## 5. Release Notes

Every release, at every stage, is accompanied by release notes summarizing what changed, referencing affected module Document IDs where relevant. Release notes are retained under `docs/operations/` (DOC-400 range) as a permanent historical record.

## 6. Rollback and Hotfix Process

Production issues requiring immediate remediation follow an expedited version of `github-workflow.md` (DOC-008): a hotfix branch from `main`, an expedited review per `review-process.md` (DOC-011), and a PATCH version increment per `versioning-policy.md` (DOC-005), Section 3. Hotfixes are documented retroactively in the next regular release notes if they cannot be documented in advance.

## 7. Coordination Across Assistants and Contributors

Where release work is distributed across human contributors and AI assistants per `ai-collaboration.md` (DOC-009), release readiness is confirmed by a human owner before any stage transition, regardless of how much of the release work was AI-assisted.
