---
version: 1.0
owner: Paweł Milewski
updated: 2026-09-16
status: active — not yet run
---

# The compliance hour

Nine items, about seventy-five minutes, none of which needs the laptop for more than a browser. Nothing else in the project waits on any of it, which is exactly why it has been listed as "parallel, this week" four times and never done. **It needs a date, not a label.**

Two of its items close gaps that exist *right now* on a page that is already published, which is the argument for doing it before the first deploy rather than after.

## The nine items

| # | Item | What it actually involves | Min | Done |
|---|---|---|---|---|
| 1 | **Ploi DPA** | E-mail `info@ploi.io` requesting one — they confirmed on their Discord that they offer it. File the request and the reply in `vendors/`. They hold root on a box that will hold claim contact details, so this is Art. 28, not diligence theatre | 10 | ☐ |
| 2 | **PostHog DPA** | Generate it in the PostHog dashboard — a self-serve form — and file it. **PostHog is already named in the published privacy policy**, so this is a live gap | 10 | ☐ |
| 3 | **Scaleway DPA** | Already a processor: Transactional E-Mail handles recipient addresses today, and will hold backups later. Their DPA is published in their terms — the job is to record it, not request it | 5 | ☐ |
| 4 | **`ropa.md` retention column** | Every processing activity currently reads `Retention: TODO` while the code enforces real windows. Fill from the table below | 15 | ☐ |
| 5 | **The three registers** | `vendors/`, `dpa/`, `incidents/` are templates. `vendors/README.md` is worse than empty — it carries placeholder rows reading "Hosting provider / TODO / TBD". Real entries: OVH, Ploi, Scaleway (mail + storage), PostHog, OpenFreeMap, Healthchecks.io | 15 | ☐ |
| 6 | **DPIA: decide and write one line** | My read is **no DPIA required** — no large-scale special-category data, no systematic monitoring of a public space, no profiling with legal effect. "We considered it and concluded no, for these reasons" is defensible; "we never considered it" is not | 5 | ☐ |
| 7 | **GDPR audit's dead citations** | `audits/gdpr.md` cites five files that were deleted. It is the document you would hand to somebody who asked | 5 | ☐ |
| 8 | **`cis.md` and `nis2.md` Tailscale claims** | Both describe Tailscale protecting the admin panel **in the present tense**, on a production server that does not exist. Change to a planned control | 5 | ☐ |
| 9 | **Privacy policy: name the recipients** | It names no host, no panel operator and no storage provider. Add **OVH**, **Ploi** and **Scaleway**. An undisclosed recipient is a live gap on a published page and a standard audit finding | 5 | ☐ |

## Retention, for item 4

The principle first, because Art. 30 asks for the period and a regulator asks why that period and not another: **GDPR sets no retention periods.** Art. 5(1)(e) says personal data may be kept no longer than necessary for the purpose it was collected for. So the only question is *does this row identify a person, and is the purpose still live* — and a row identifying nobody has no legal horizon at all.

| Data | Identifies a person? | Period | Mechanism | Why this period |
|---|---|---|---|---|
| `venue_offer_logs.user_id` | Yes | **24 months**, then nulled; the row is kept forever | `uni:anonymise-expired-data`, daily | A listing dispute arrives months late. The anonymous half is the offer history that pairs with `venue_stats`, which is never pruned |
| `audit_logs.actor_id` | Yes | **24 months**, then nulled; the row is kept forever | same | An ownership dispute surfaces well past a year. Raised from 12 on 16.09 |
| `venue_claims` contact fields and `registry_lookup` | Yes, directly — the registry result names the business and the people who may act for it | **12 months** after the decision, then emptied; the row is kept | same | The decision ends the purpose. An approved owner's clock starts when ownership ends, not when they claimed. `registry_lookup` added 19.09 with the owner check |
| `venue_inaccuracy_reports.contact_email` | Yes, directly | **12 months** after the report is closed, then emptied; the row is kept | same | Same principle. What was reported and what was done about it survives |
| `failed_jobs` | Incidentally — recipient addresses in payloads | **30 days** | `queue:prune-failed`, daily | Long enough to investigate any failure |
| `venue_stats`, `venue_category_stats`, `search_stats` | **No** | **Indefinite** | none, deliberately | Counts with no identifier. Nothing requires deletion, and they are the only thing in the product that cannot be recreated after the fact |
| `events` | **No** | **Indefinite** | none, deliberately | `raw-events-are-kept-not-pruned` |
| Consent decisions | Yes, on the visitor's own device | The cookie's own life | the browser | Art. 7(1) — demonstrable consent |
| Sessions | **No IP address stored** | Session lifetime | file driver | `sessions-hold-no-ip-address` |

**Nothing in this application deletes a row to satisfy retention.** Retention is anonymisation — see [`../decisions/product/personal-data-expires-rows-do-not.md`](../decisions/product/personal-data-expires-rows-do-not.md).

## Rules for keeping this true

A new retention window is added **here and in `ropa.md` in the same commit that adds the mechanism**, never after. A window with no stated reason is a number somebody picked, and it is the first thing challenged.

A new processor is added to `vendors/` **before** it processes anything, and to the privacy policy's recipients in the same pass.

---

*See also: [`ropa.md`](ropa.md) · [`../decisions/product/personal-data-expires-rows-do-not.md`](../decisions/product/personal-data-expires-rows-do-not.md) · [`../roadmap/deploy-checklist.md`](../roadmap/deploy-checklist.md)*
