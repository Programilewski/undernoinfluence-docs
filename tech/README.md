---
version: 0.4
owner: Paweł Milewski
updated: 2026-09-21
status: draft
---

# Technical Documentation

Technical source of truth for the Laravel marketplace backend and supporting systems.

## Documents

- `stack.md` - language, framework, infrastructure, and toolchain.
- `architecture.md` - application boundaries, modules, data ownership, and runtime architecture.
- `dependencies.md` - dependency inventory and technical risk notes.
- `analytics.md` - event capture, entitlement modules, and the GDPR approach.
- `security.md` - access control, logging, and vendor access.
- `obsidian-sync.md` - opening `docs/` as an Obsidian vault and syncing it to the homeserver and phone.
- `migrating-to-a-new-machine.md` - the runbook for rebuilding this environment on another machine. Executed and corrected on 2026-08-25; the only document here proven by use.
- `migration-lessons.md` - the nine rules that migration produced. Machine-agnostic; read before any environment move.
- `going-to-production.md` - what those rules mean for the preprod and production servers, and what a laptop-to-laptop move never tested.
- `repository-migration.md` - the plan for moving to a fresh repository with one initial commit. Not yet executed; needs a session of its own.
- `scheduled-work.md` - the ten scheduled commands and the queue worker, what each one does, and what is untrue while it does not run. None of it has ever run.
- `freshness-and-verification.md` - what the two venue badges mean, which columns drive them, and the three columns that look like them and are not.

Architecture decision records live in `../decisions/adr/`.

## Principles

- Document the current production intent, not speculative architecture.
- Link to compliance documents when a technical decision affects personal data.
- Keep dependency and vendor notes aligned with `../compliance/vendors/README.md`.
