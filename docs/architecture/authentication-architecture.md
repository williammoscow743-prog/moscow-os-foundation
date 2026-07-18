![Moscow OS Logo](../assets/moscow-os-logo.png)

# Authentication Architecture

**Document ID:** ARCH-009
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

This document defines how Moscow OS establishes and maintains a user's identity, building on the platform-wide Authentication principle in the System Overview (DOC-100), Section 9.1.

## Scope

Covers identity establishment and session management. Permission enforcement once identity is known is covered in `authorization-architecture.md` (ARCH-010).

---

## 1. Identity Provider

Supabase Auth is the sole identity provider for Moscow OS, supporting email/password and OAuth 2.1-based sign-in through supported third-party providers, per the System Overview (DOC-100), Sections 7.4 and 8.

## 2. Token Model

Upon successful authentication, Supabase Auth issues a JSON Web Token (JWT) representing the user's session, including their user ID and organization membership claims. This JWT is attached to every subsequent request to PostgREST and Edge Functions, and is the credential Row Level Security policies evaluate against, per `database-architecture.md` (ARCH-008), Section 4.

## 3. Token Storage

The session token is stored client-side using Supabase's client library default secure storage mechanism, refreshed automatically ahead of expiry without requiring the user to re-authenticate mid-session.

## 4. Token Refresh

Supabase Auth issues a refresh token alongside the access token. The client library manages silent refresh in the background; a refresh failure (for example, the refresh token itself expiring) redirects the user to re-authenticate rather than allowing the application to continue in an ambiguous authentication state.

## 5. OAuth 2.1 Flow

Third-party OAuth sign-in follows the standard OAuth 2.1 authorization code flow with PKCE, redirecting through the identity provider and back to Moscow OS, where Supabase Auth exchanges the authorization code for a session, per the System Overview (DOC-100), Section 8.

## 6. Multi-Organization Session Handling

A user belonging to more than one organization (per the Organization Switcher in `docs/design-system/navigation.md`, DS-011, Section 4) maintains a single authenticated identity with an explicit "active organization" context, which determines the `organisation_id` scope applied to Row Level Security evaluation for the duration of that context, per `database-architecture.md` (ARCH-008), Section 3.

## 7. Sign-Out

Sign-out invalidates the current session token client-side and, where supported, revokes the refresh token server-side, ensuring a signed-out session cannot be replayed.

## 8. AI Assistant Authentication Context

When the AI Workspace or MCP Server acts on a user's behalf, it operates within that user's authenticated session context — it does not authenticate independently with elevated privilege — so that AI-driven data access is subject to the exact same Row Level Security restrictions as the user's own direct actions, per the AI Consent principle in the Security Overview (DOC-100), Section 9.5, and `mcp-architecture.md` (ARCH-012), Section 4.

## 9. Future Enhancements

Multi-factor authentication and enterprise SSO (SAML/OIDC federation) are noted as future enhancements aligned with the Future Enterprise Customers segment in the System Overview (DOC-100), Section 4.7, and are not implemented in Version 1.

## References

`docs/product/01 - System Overview` (DOC-100), Sections 4.7, 7.4, 8, 9.1, 9.5; `authorization-architecture.md` (ARCH-010); `database-architecture.md` (ARCH-008); `mcp-architecture.md` (ARCH-012); `docs/design-system/navigation.md` (DS-011).

## Appendices

*[None.]*

---

© 2026 Moscow OS
All Rights Reserved
