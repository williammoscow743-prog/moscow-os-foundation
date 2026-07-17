![Moscow OS Logo](../assets/moscow-os-logo.png)

# GitHub Workflow

**Document ID:** DOC-008
**Version:** 1.0.0
**Status:** Active
**Owner:** Engineering Leadership
**Last Updated:** 2026-07-17

---

## Purpose

This document defines the branching, commit, and pull request conventions used for all changes to the Moscow OS repository, whether authored by human engineers or AI coding assistants.

## Scope

Applies to all commits, branches, and pull requests in the `moscow-os-foundation` repository. Complements `review-process.md` (DOC-011), which governs approval requirements rather than mechanical workflow.

---

## 1. Branching Model

- `main` is always deployable and represents the current production or production-track state.
- Feature and fix work happens on branches created from `main`, named `type/short-description` (for example, `feat/finance-invoice-export`, `fix/calendar-timezone-bug`, `docs/ai-collaboration-update`).
- Branches are merged into `main` exclusively through pull requests; direct commits to `main` are not permitted.

## 2. Commit Message Format

Commit messages follow the Conventional Commits format: `type: short description`, where `type` is one of `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, or `style`. Example: `docs: add documentation framework structure`.

- The description is written in imperative mood ("add", not "added" or "adds").
- Commit bodies, where needed, explain *why* a change was made, not just what changed, since the diff already shows what changed.

## 3. Pull Request Requirements

Every pull request must include:

- A description of what changed and why.
- A reference to the relevant Document ID(s) if the change touches documentation, or the relevant module if it touches code.
- Confirmation that CI checks have passed.
- At least one approval from the directory owner defined in `repository-standards.md` (DOC-007), Section 3, per the approval rules in `review-process.md` (DOC-011).

## 4. Continuous Integration

All pull requests trigger automated checks, including linting, type checking, and test execution. A pull request cannot be merged while any required check is failing. Documentation-only pull requests trigger a lighter check set limited to Markdown linting and link validation.

## 5. Handling Secrets and Configuration

Environment-specific values (API keys, database URLs, tokens) are never committed. Local development uses `.env` files excluded via `.gitignore`; example values are documented using placeholders, consistent with `repository-standards.md` (DOC-007), Section 6.

## 6. AI-Assisted Contributions

Contributions generated or substantially assisted by an AI coding assistant (ChatGPT, Claude, Loveable) follow the same branching, commit, and pull request rules as human contributions, with no separate workflow. The AI-assistance is noted in the pull request description for transparency, consistent with `ai-collaboration.md` (DOC-009), Section 5.

## 7. Merge Strategy

Pull requests are merged using squash merges by default, producing a single, clean commit on `main` per logical change. This keeps the `main` history readable as the repository scales toward a large, multi-contributor codebase.
