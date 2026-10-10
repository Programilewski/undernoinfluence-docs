---
description: "The learning series: reading order and when to read which."
---

# UNI Learning Docs

A series of documents explaining how the app works, from the whole-app request flow down to the `/mapa` discovery page specifically.

Read in order — each doc builds on the previous.

---

## Documents

0. **[00-app-flow-overview.md](00-app-flow-overview.md)** — Whole-app tour: routes, controllers, the `Venue` model, analytics architecture, write-path actions, Filament admin/owner panels, the claim flow
1. **[01-overview.md](01-overview.md)** — The big picture: files, technologies, and who owns what
2. **[02-data-flow.md](02-data-flow.md)** — How venues travel from the database to map pins
3. **[03-filters-and-livewire.md](03-filters-and-livewire.md)** — How filters work (Livewire state, PHP queries)
4. **[04-map-markers-and-clustering.md](04-map-markers-and-clustering.md)** — Marker creation, category icons, clustering
5. **[05-interactivity.md](05-interactivity.md)** — Hover highlight, card click, pin select, popups
6. **[06-url-management.md](06-url-management.md)** — Why URLs are managed two different ways
7. **[07-alpine-component.md](07-alpine-component.md)** — How Alpine.js connects everything

---

## Suggested Reading Path

**First time:** Read 00 for the whole-app picture, then 01 → 02 → 03 for the discovery map specifically.

**When debugging the map:** Go to 04 → 05.

**When URLs/links are broken:** Go to 06.

**When something feels broken between list and map:** Go to 07 (how Livewire and Alpine talk).

---

## Crash courses (written for the 10–16.10.2026 trip)

What starts the day the site is public, tied to UNI's own code and records. Start at **[crash-00-start-here.md](crash-00-start-here.md)**; each course ends with "Questions to bring back".

1. **[crash-01-seo-for-a-new-site.md](crash-01-seo-for-a-new-site.md)**: how Google treats a new domain; Search Console; the first 90 days
2. **[crash-02-running-the-live-server.md](crash-02-running-the-live-server.md)**: the box in one picture, symptom → first look, alarms, disk, reboots
3. **[crash-03-postgresql-survival.md](crash-03-postgresql-survival.md)**: looking safely, migrations on live data, backups, growth
4. **[crash-04-gdpr-for-the-privacy-policy.md](crash-04-gdpr-for-the-privacy-policy.md)**: what Article 13 requires, the V1 data-flow inventory, DPAs, cookies
5. **[crash-05-measuring-with-small-numbers.md](crash-05-measuring-with-small-numbers.md)**: noise, the funnel already in `events`, the weekly review
6. **[crash-06-the-keys-to-uni.md](crash-06-the-keys-to-uni.md)**: the accounts that could end UNI, and a phone-sized check
7. **[crash-07-ansible.md](crash-07-ansible.md)**: desired state and idempotence, what the playbook owns, when to run it, reading a failed run
8. **[crash-08-deployer.md](crash-08-deployer.md)**: build beside then switch, the four acts of a deploy, what each guard prevents, rollback's limits
9. **[crash-09-the-deployment-cycle.md](crash-09-the-deployment-cycle.md)**: the loop from PC to production and its variants (hotfix, migration, `.env`, server, dependencies, new box)
