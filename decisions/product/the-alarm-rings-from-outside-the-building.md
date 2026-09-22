# The alarm rings from outside the building

**Date:** 2026-09-16
**Status:** Decided
**Executed:** code built 14.09 and dormant; goes live when `UNI_HEALTHCHECK_PING_URL` is set at the first deploy (checklist B9)
**Area:** Infrastructure | Analytics

---

## Problem

Everything that watches this server runs on it. The admin dashboard reports whether the scheduler ran and whether the disk is filling, and both of those are useful — but a display only speaks to somebody already looking at it, and it dies with the machine it describes. The disk warning has a worse version of the same problem: it is delivered by e-mail, through the queue, so the one failure most likely to need it — a dead worker — is the failure that prevents it arriving.

That leaves three failures completely silent, and all three keep the site serving pages perfectly while they happen:

- **The scheduler stops** — a missing or wrong crontab line after a deploy. Every page still works. Nothing scheduled runs: the hourly freshness check stops, so the date badge on every venue page slowly becomes untrue; the nightly rollup stops, so every owner report is built on a gap; `uni:anonymise-expired-data` stops, so the retention periods published in the ROPA quietly stop being true.
- **The queue worker stops** — the most ordinary Laravel production failure there is. A claim approval is recorded in the database and its e-mail never sends. The owner is approved and never told. You find out when they ask.
- **Postgres refuses connections while nginx still answers** — disk full, or connection limit. Some pages cache, some error, and the pattern reads as confusing rather than broken.

None of these looks like "the site is down", which is the failure you would notice unaided and the one OVH's own monitoring already reports.

## Options considered

Rely on noticing — correct for a total outage, blind to all three above. Ploi Pro's monitoring — costs €5/month and reports that the *server* is up, which is the thing already easiest to see. An alert from inside the application — same building, same power cut. An outside dead man's switch.

## Decision

A queued job pings an outside dead man's switch every five minutes. It reads the database, fetches the site's own `/up` over its public address, then POSTs — to the plain URL when both pass, to `.../fail` with a reason when either does not. **One successful ping proves cron, the worker, Postgres, nginx, the certificate and PHP together.** When pings stop arriving for any reason, the outside service e-mails.

The service is Healthchecks.io's free tier: 20 checks, operated by SIA Monkey See Monkey Do in Latvia, data on Hetzner servers in Germany. Its free plan carries no commercial-use restriction — checked on 16.09, because the belief that it did was the original reason for declining.

## Rules

**Nothing about any visitor is ever sent.** The ping body carries our own failure string and nothing else — no addresses, no identifiers, no counts.

**The integration stays one URL in one environment variable.** No SDK, no client library, no account API. Replacing the provider — with another service, or with a cron job on a machine you own that e-mails when pings stop — must remain a change to `UNI_HEALTHCHECK_PING_URL` and nothing else. That is what keeps this from becoming a dependency.

**Dormant by default.** With no URL set the job returns immediately, so development and tests never ping anything.

**It is proven before it is relied on.** An alarm nobody has heard ring is not an alarm. Before the first deploy, stop Postgres and confirm the alert arrives; stop the web server and confirm it arrives; then stop the **worker** and confirm the check goes red on silence — that last one is the case no test can cover, because its signal is the absence of a message.

**One check, not many.** A check is a monitored thing, not a request, so this does not scale with traffic, venues or cities. The free tier's twenty is roughly ten times what a single-server application needs.

## What this prevents

Prevents the specific shape of failure this application is most exposed to: everything looking fine while the parts nobody looks at have stopped, discovered weeks later through a number that turns out to be wrong. It also prevents the disk-space warning being the only alarm, when the warning depends on the queue that may be the thing that broke.

## Revisit when

A second thing genuinely needs monitoring — the nightly backup is the likely first — at which point it is a second check on the same free tier, not a different product. Revisit the provider if the free tier changes terms; revisit the mechanism never, because silence is the only failure signal that survives the server being gone.

---

*See also: [[decisions/product/the-scheduler-reports-that-it-ran]] · [[decisions/product/personal-data-expires-rows-do-not]]*
