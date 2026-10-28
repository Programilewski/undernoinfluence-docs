---
description: "What is left of the 28.10 engineering audit: F1 done in the evening; four decisions to take one at a time (F3 next), and two follow-ups."
owner: Paweł Milewski
updated: 2026-10-28
status: prepared at the end of the 28.10 afternoon; updated at the end of the 28.10 evening (suite run, F1 built). Follows `audit-2026-10-28.md`; read that for the full evidence behind each finding.
---

# Next session: the audit's open decisions

**On 28.10 the findings that needed no decision were fixed, tested and committed** (six commits on `main` in the application repository, not pushed). What is left needs your answer first. Take it one problem at a time: read the item, decide, then I build, test and commit it before we move to the next.

## Already done on 28.10

| Finding | What changed |
|---|---|
| F2, F10 | The search rollup counts only finished searches (`discovery_searched`), so an empty search counts once and partial words get no row. Each day's delete and insert run in one transaction; the day filter uses the `(type, created_at)` index. |
| F4 | A production deploy stops unless `shared/.env` has `APP_ENV=production`, `APP_DEBUG=false`, `SESSION_ENCRYPT=true` and `SESSION_SECURE_COOKIE=true`. The home server is exempt (plain HTTP). |
| F5, F11 | The 100-character search limit counts characters, not bytes. District IDs that aren't digits are dropped. Both were reproduced as error pages (500) in tests on the old code. |
| F7 | `EventLogger::log()` logs a failed write and carries on, inside its own savepoint, so no page fails because its event couldn't be saved. |
| F12 | The owner erasure modal warns a chain owner that deleting the account releases their other venues. |
| F14 | The nginx `/admin` comment says what the allowlist does not cover. Config unchanged. |

**Done in the evening:** the full suite ran green on these commits (1,149 tests), then F1 was built (below); 1,160 tests green after it. Nothing is pushed.

## Where to pick up

**F3 is next.** Describe it, take the answer, build, test, commit, then F6, F8, the `.env.example` rule, and the two follow-ups. The evening's journal (`journals/2026-10-28.md`, Session 3) has the F1 details.

## Two follow-ups from those fixes

1. **Re-run the search rollup over past days.** Days rolled up before the 28.10 fix still carry the double-counted zero results and the prefix rows. `php artisan analytics:roll-up --days=N` replaces them; it is idempotent. On the home server too, if it has rolled-up days.
2. **Check production's `shared/.env` before the next prod deploy.** The new F4 check refuses the deploy unless all four values are set. `SESSION_ENCRYPT=true` is the one most likely to be missing: it is in the baseline's "REQUIRED" block, but nothing checked it before.

## The decisions

### 1. ✅ F1: limits on the owner-request form, done 28.10 evening

**Decided by me, on your "do as you deem appropriate":** one request e-mail per address per rolling 24 hours; at most 50 in any 24 hours; automatic registry lookups stop at 80 a Warsaw day and wait for the next, leaving 20 for your button. Over a limit, the request is still saved and its link waits for "Wyślij link potwierdzający". The request e-mail no longer contains any name the sender typed, and every Markdown e-mail escapes links and HTML. Each number is one line in `config/uni.php`. What follows is the original write-up, kept for the record.

**The problem.** `/zglos-lokal` (and the claim form) sends a confirmation email to whatever address is typed, with a venue name the sender typed, from the `tx.` sending subdomain. The name is put into a Markdown mail, so `[tekst](https://…)` becomes a real link. The only limits are 5 posts a minute per IP and the honeypot. Each post also uses one VAT white-list lookup, of which there are 100 a day; once they run out, real owners' claims get `registry_lookup.error = unavailable` until midnight, and so does the admin's on-demand lookup. Off in production today: the routes return 404 while the switch is off.

**What needs deciding:**
- **Per-recipient limit.** Suggestion: one request email per address per 24 hours; a second request still saves the claim but says "check your inbox".
- **Overall daily cap on request emails.** Suggestion: a number well above real volume at launch (e.g. 50 a day), so a spam run is capped but a normal day never is.
- **When the registry budget is spent.** Suggestion: keep a reserve for the admin (e.g. stop automatic lookups at 80), and mark further claims "pending lookup" to be looked up the next day, instead of calling the API and failing.
- **Venue name in mail.** No decision really needed: it will be written as plain text (escape Markdown or `Markdown::withSecuredEncoding()`). Listed so you know it is part of the change.

### 2. F3: contact details on requests nobody decides — NEXT

**The problem.** Anonymisation clears contacts 12 months after a claim is decided or a report closed (`AnonymiseExpiredData` requires `reviewed_at IS NOT NULL`). A claim or report that is never decided keeps the email, NIP and registry extract forever. Rejected erasure requests keep `requester_name` and `requester_email` forever too ("kept — it is the evidence"). Claims get a morning reminder, so they are unlikely to sit forever; reports have nothing that nudges you.

**What needs deciding:**
- **The horizon for undecided rows**, counted from `created_at`. Suggestion: the same 12 months, so there is one number to remember.
- **Rejected erasure requests:** does the evidence need the requester's email, or only the dates, the venue and the reason? Suggestion: keep the dates and the reason, null the name and email on the same 12-month clock.

`database/schema.md` gets updated in the same commit.

### 3. F6: the old `ClaimVenue` owner page

**The problem.** An owner with no venues can still reach this page by URL. It offers "Telefon" as a contact method, against "nobody is phoned", and creates the claim directly: no confirmation token, no registry lookup, no confirmation email. Approval still requires a confirmed channel or a written reason, so nothing gets approved through it unchecked, but it is a second way to claim a venue with different rules.

**Options:**
- **Delete the page and its view** (suggested): claims are made from the public venue page through `SubmitVenueClaimAction`, which already exists.
- Keep it as a panel entry point, routed through `SubmitVenueClaimAction`, with the phone option removed.

### 4. F8: what a product's `is_active` / `is_approved` mean

**The problem.** The drink page, the sitemap and the menu resolver respect these flags. Venue pages, discovery, the breadth counts and the owner's "attach product" picker ignore them. So a product you deactivate keeps showing on every venue that carries it, and owners can still attach it.

**Options:**
- **Hidden everywhere:** an inactive product disappears from venue pages, discovery and counts, and can't be attached.
- **Retired:** it stays on the venues that already carry it, but can't be attached any more and gets no drink page.

Once you pick, it becomes one scope used in every place, so the rule lives in one spot.

### 5. F4 follow-up: the `.env.example` rule contradicts the file

**The problem.** `.ai/rules/general.md` and the "`.env.example` is production" memory say the file is copied to production as-is, so every value ships. But it ships `APP_ENV=local` and `APP_DEBUG=true`, with the safe values in a commented "Production Baseline" block. The deploy now refuses those values, so nothing unsafe can ship, but the rule and the file still disagree.

**Options:**
- **Change the file:** put production values in it (`APP_ENV=production`, `APP_DEBUG=false`, secure cookies) and set local values only in your own `.env`. The rule stays true as written.
- **Change the rule's wording:** say the file is the starting point, and the baseline block must be applied when production's `.env` is written. The deploy check enforces it.

## Left alone, by the audit's own recommendation

F9 (discovery loads everything; measure at 1–2k venues first), F13 (no CSP; little gain today for the cost of Alpine's CSP build), F15 (admin-entered SVG printed unescaped; fine while you are the only admin).
