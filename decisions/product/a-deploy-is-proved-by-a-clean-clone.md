# A deploy is proved by a clean clone, never by the machine that built it

**Date:** 2026-09-22
**Status:** Decided
**Executed:** yes — it is step B5 of the migration, and four tests came out of applying it
**Area:** Infrastructure | Process

---

## Problem

The laptop has been the only environment for six months, and it quietly satisfies dependencies that nothing else does. Three claims about how to run UNI were made from it on 22.09 and all three were wrong: that the suite passes with no built assets (it passed because a Vite dev server was running, so `public/hot` existed and Laravel never read the manifest); that PHP 8.3 was enough (`composer.json` said `^8.3`, `composer.lock` demanded `8.4.1`); and that `.env.example` was fit to copy to production (it shipped a key empty against a config default, so **every artisan command threw**).

Each was a real measurement with a conclusion that did not follow from it. What they share is the source: a machine with six months of accumulated state, answering a question about a machine with none.

## Options considered

Read the configuration files carefully and trust them. Test on the development machine and infer. Build the thing somewhere empty and run it.

## Decision

**A claim about how to deploy this application is proved by cloning it somewhere empty and running it — not by reading a file that describes it, and not by testing on a machine that already works.**

The sequence, in order, because the order is where two of the three failures appeared:

```
composer install → .env + key → npm install && npm run build → php artisan test
```

**`npm run build` is not optional.** Views call `@vite`, so without a manifest 261 rendering tests fail — invisible on any machine that has run `npm run dev`.

## Rules

Where a file declares a requirement and another file enforces it, the enforcing one is authoritative and the declaring one is tested against it — `composer.json` claims, `composer.lock` installs, and a test now fails if the first is looser than the second. A dependency that "works here" is not established until it works in a directory created five minutes ago. `.env.example` is verified by booting the application from it, not by reading it, because a key present-but-empty silently overrides the config default that appears to protect it. And when a measurement supports a conclusion, name the thing that would have to be absent for the conclusion to be false, then check that it is absent.

## What this prevents

Prevents the class of defect that only appears on a fresh machine, which is every machine that matters: the first server, a collaborator's laptop, a rebuilt box after an incident. All three of 22.09's were of this class, and two of them would have stopped a production deploy at the first command — on a bare box, with no styling, nothing in any log, and no working `artisan` to ask.

## Revisit when

Never. When CI exists it automates this rather than replacing it, and the clone it makes is the same clone.

---

*See also: [[decisions/product/a-release-is-a-tag-deployed-from-git]] · [[decisions/product/three-environments-and-what-each-is-for]] · [[tech/home-server-setup]] · [[roadmap/deploy-checklist]]*
