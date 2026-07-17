![Moscow OS Logo](../assets/moscow-os-logo.png)

# Repository Standards

**Document ID:** DOC-007
**Version:** 1.0.0
**Status:** Active
**Owner:** Engineering Leadership
**Last Updated:** 2026-07-17

---

## Purpose

This document defines the structural, naming, and organizational standards for the Moscow OS codebase and documentation repository, so that contributors — human or AI — can predictably locate and place files.

## Scope

Applies to the `moscow-os-foundation` repository in its entirety: source code, configuration, and documentation. Complements `documentation-framework.md` (DOC-002), which governs documentation content specifically.

---

## 1. Top-Level Repository Structure

```
moscow-os-foundation/
├── docs/
│   ├── framework/
│   ├── product/
│   ├── architecture/
│   ├── modules/
│   ├── operations/
│   └── assets/
├── src/
├── supabase/
├── public/
├── tests/
└── README.md
```

The root `README.md` is the entry point for the codebase as a whole and is distinct from `docs/framework/README.md` (DOC-001), which is the entry point for documentation specifically.

## 2. File Naming Conventions

- Documentation files use lowercase, hyphen-separated names (`versioning-policy.md`), matching the pattern established across `docs/framework/`.
- Source files follow the naming convention of their language and framework (PascalCase for React components, camelCase for TypeScript utility modules).
- No spaces, underscores, or mixed casing in file or folder names within `docs/`.

## 3. Directory Ownership

Each top-level directory under `docs/` has a designated owning team, recorded in the relevant category's index document. Ownership determines who is required as a reviewer under `review-process.md` (DOC-011) for changes within that directory.

## 4. Module Directory Structure

Each Moscow OS module (Projects, CRM, Finance, Calendar, Documents, AI Workspace, Reporting, Administration) has a corresponding subdirectory under `docs/modules/` and, where applicable, `src/modules/`, using a consistent slug (for example, `finance`, `ai-workspace`). The documentation and source directory slugs must match exactly to keep code and documentation navigable in parallel.

## 5. Assets

Shared documentation assets (logo, diagrams, screenshots) live under `docs/assets/` and are referenced with relative paths, never absolute paths or external hosting, to ensure the repository remains self-contained.

## 6. Environment and Secrets

No credentials, API keys, or tokens are ever committed to the repository, including in documentation examples. Example configuration uses placeholder values (for example, `SUPABASE_URL=your-project-url`) as detailed in `github-workflow.md` (DOC-008), Section 5.

## 7. Repository Hygiene

- Every merged pull request must leave the repository in a buildable state.
- Generated or build output directories are excluded via `.gitignore` and never committed.
- Empty placeholder files (such as those initializing a new documentation structure) are permitted temporarily but must be populated before the corresponding document is marked `Active`, per `documentation-framework.md` (DOC-002), Section 2.
