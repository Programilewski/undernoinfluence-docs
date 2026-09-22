# robots.txt Is Served By The Application, Never From public/

**Date:** 2026-09-08
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** Infrastructure | Analytics

---

## Problem

Two robots.txt files existed. `SitemapController::robots()` rendered `resources/views/robots.blade.php` on the `/robots.txt` route, blocking sixteen AI crawlers and disallowing `/admin/`, `/panel/` and `/api/`, and it had tests. `public/robots.txt` was a static file committed in the first working version, naming five AI crawlers, allowing the panels, and hardcoding a production sitemap address. Under any normal Laravel web server configuration `try_files $uri` serves the static file and the request never reaches PHP — so the file with the tests was dead code, and the file in production was two years of decisions out of date. Nothing surfaced the divergence, because the route kept passing its own tests while never being served.

## Options considered

Keep the static file and regenerate it at deploy time from the same source. Keep both and make the route the canonical source that writes the static file. Delete the static file and let the route serve every request. Move the whole thing into the web server configuration.

## Decision

`public/robots.txt` is deleted and the route is the only robots.txt. A test asserts the file's absence, because the failure is invisible from inside the application: the route keeps working in tests, in `php artisan serve`, and in every local check, while production quietly serves something else. A deploy-time generator was rejected as a second source of truth that drifts the same way, more slowly.

## Rules

Nothing is placed in `public/` that shadows an application route — robots.txt and sitemap.xml in particular. Crawler policy lives in `resources/views/robots.blade.php` and the sitemap address comes from `route('sitemap')`, so it follows `APP_URL` rather than a hardcoded domain. Any change to the AI-crawler list is made in that view and nowhere else. The absence test runs with the rest of the SEO suite.

## What this prevents

It closes a silent revert: every decision recorded in `block-all-ai-crawlers` was, in production, not in force. It also removes the class of bug rather than the instance — a static file in `public/` that shadows a route cannot be caught by any test that exercises the route, so the only reliable assertion is that the file does not exist.

## Revisit when

Robots policy needs to differ per environment or per host, at which point the view takes the condition — not a second file.

---

*See also: [[decisions/product/block-all-ai-crawlers]], [[decisions/product/empty-landing-pages-noindex]]*
