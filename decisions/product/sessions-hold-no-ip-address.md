# Sessions are kept in files and hold no IP address

**Date:** 2026-09-14
**Status:** Decided
**Executed:** 2026-09-14
**Area:** Compliance | Infrastructure

---

## Problem

Every visitor gets a session: the report form and the map's filters carry a CSRF token, and the token lives in the session. With Laravel's database driver each session row also stores the visitor's IP address and browser string for as long as the session lives. Nothing in UNI reads them, and the privacy policy said a session cookie was set only for signed-in users and named it wrongly.

## Options considered

Keep the database driver and disclose the IP address and its lifetime. Switch production to the file driver, which stores the session payload and nothing else.

## Decision

**Production sessions use the file driver** (`SESSION_DRIVER=file` in `.env.example`). The CSRF token and login state work the same; no IP address or browser string is written anywhere by a session.

## Rules

The privacy policy names the real session cookie from configuration and describes whichever driver is configured, so the sentence stays true if the driver changes; `PublishedPagesAreTrueTest` checks both branches. Rate limits key on the request, never on the session. Moving to more than one application server is the moment to revisit, because file sessions do not travel between machines.

## What this prevents

Storing personal data for no purpose on every page view, and a published policy that describes a cookie the site does not set.

## Revisit when

A second application server, or a feature that genuinely needs server-side session data shared across machines.

---

*See also: [[decisions/product/retention-follows-identifiers]] · [[decisions/product/v1-copy-truth]]*
