---
owner: Paweł Milewski
updated: 2026-09-19
status: prepared at the end of 19.09 for the next working session. Supersedes, for planning, `commute-2026-09-16_5.md`, which was written on 16.09 and describes the project as it was then (774 tests, `UNI_OWNER_PANEL`).
---

# Next session — 20.09.2026

**Where things stand.** Everything up to the owner check is committed and pushed to `v1`. The last session of 19.09 — the 14-day flag and reminder, this brief, the journal's session 3 — is in the working tree until you say commit. **1038 tests pass.** The owner side is complete behind `UNI_OWNER_ACCESS`: one request page (`/zglos-lokal`), the owner check (registry lookup, link or Instagram code, approval gated on a confirmed channel), chains, and a reminder for requests waiting over 14 days. Owner access stays **off** until the check's checklist is done (§3, step 6). Nothing needs a decision before you can work — but one question has waited since 18.09, and your standing instruction is that it comes first.

---

## 1. First: which V2 features get built now, behind a switch?

On 18.09 the owner panel was built complete behind its switch, so that V2 is a switch and not a build. You asked to decide the rest feature by feature, from a table. Here it is, from [`v2.md`](v2.md), checked against the records — several were narrowed or overtaken since it was written.

`v2.md`'s own entry trigger is **20+ daily "Nawiguj" clicks and 10+ claimed venues**. Today there are no real venues and no traffic.

| Feature                                                                                            | Where it stands today                                                                                                    | What building it now would take                                                                                           | What the records say                                                                                                      | Recommendation                                                                                                                                                                                                                          |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **F1 Post-visit confirmation** — "Did you make it? Was the menu right?" 30 minutes after "Nawiguj" | Not built                                                                                                                | A way to reach the visitor afterwards: an account, e-mail or push notifications. Every one of them identifies the visitor | The analytics store no identifier of any kind, by design; `browse-only-v1` has no accounts                                | **Not now.** It collides with the privacy architecture, not just with scope. Revisit with accounts. Answer: It's for V3 and further I'd say                                                                                             |
| **F2 Saves and collections**                                                                       | Not built                                                                                                                | With accounts: accounts first. Without: saves kept only in the visitor's browser — no account, nothing on our side        | `browse-only-v1` says *no saved venues* in V1 — written because saves meant accounts                                      | **Not now as written.** Worth a conversation: **browser-only saves** process no personal data and would need only an amendment to `browse-only-v1` answer: we'd need it in V2 so build it under the condition mentioned in commute file |
| **F3 Owner analytics dashboard**                                                                   | **Built** behind the switch (19.09): the dashboard shows what the venue's plan includes; the free plan has monthly views | Nothing                                                                                                                   | `analytics-three-tiers`: price and package the paid tier from observed owner behaviour                                    | **Done.** The paid tier waits for real owners, as recorded                                                                                                                                                                              |
| **F4 Community reporting**                                                                         | The no-account version exists: "Coś się nie zgadza?" on every venue, read by a person                                    | The account-weighted version needs public accounts                                                                        | `community-reporting-needs-accounts`: built together with accounts, never before                                          | **Not now**. Answer: we can build it under the condition from commute file                                                                                                                                                              |
| **F5 Tiered badges**                                                                               | Not built                                                                                                                | Tier definitions need F1's data                                                                                           | ADR-004 (one binary checkmark); `what-the-badges-claim`: a badge states a fact, never a judgement — "Gold" is a judgement | **Not now, and probably never in this form**. Let us focus more on it. We need to define the system of badges and anything else appearing on tiles. We need to mark what is for v1,V2 and further                                       |
| **F6 Owner-managed opening hours**                                                                 | Not built; venue pages link to Google Maps for hours                                                                     | A panel field, display, and keeping hours fresh (stale hours hurt more than none)                                         | `no-opening-hours-v1`: revisit when claimed owners want to self-manage and commit to it                                   | **Not now** — the record's trigger is owners asking. That would be a difficult thing to maintain. It's V3 or even further                                                                                                               |
| **F7 Moderated venue images**                                                                      | Not built                                                                                                                | Upload, storage, moderation, and faces in photos under GDPR                                                               | `no-venue-photos-v1`: revisit on owner demand **and** moderation capacity                                                 | .**Not now** that is too for V3 if not further                                                                                                                                                                                          |

**Owner-side follow-ups already recorded with their own triggers** — not V2 features, listed so nothing is lost: automating the dispute when someone claims a managed venue (when disputes happen); matching Instagram codes through Meta's API (at about ten requests a day); a one-step path for chains (when a chain signs up); owner-added managers and agencies (when an owner asks).

**My recommendation: none of F1–F7 now.** The one worth ten minutes of discussion is browser-only saves. Everything else is either blocked by the absence of accounts, which is a deliberate V1 choice, or waits on a trigger its record names. The time is better spent on the path to production (§3). **Say which, if any, and it becomes a build session behind a switch.**

---

## 2. Findings raised unprompted

Ranked by consequence.

1. **Nothing scheduled or queued has ever run on any machine this project has lived on** (deploy checklist A1, A2). Today that stopped being abstract: the 08:00 reminder of waiting requests, the registry lookup's retries, every claim e-mail, the backups and the anonymisation all need `schedule:run` in cron and a queue worker. On a server without them, the owner check sends nothing and looks up nothing. It is the first thing the home-server session must prove.
2. **UNI's Instagram account is now a dependency of V2, not only of marketing.** The owner check's second path asks claimants to message UNI's account. Creating the account (faceless, as decided 18.09) serves both — and it does not need a laptop.
3. **Three files in the project folder are yours and uncommitted:** `signal-desktop-keyring.gpg` and `signal-desktop.sources` (from installing Signal — they had been swept into a commit and were taken out before the push), and `docs/additions.txt`. Worth moving the first two out of the project folder, so a future `git add -A` cannot catch them again.
4. **Three docs still describe phone calls to check menus** — `product/rules/Venue Rules.md` §4, `ADR-002` point 8, `business/Growth Strategy.md`. That is menu enrichment, not owner verification, so they were left alone; if you do not phone venues for menus either, they are out of date.
5. **The research said something false about KRS**, and it is recorded: KRS masks board members' names (first letter and length), so a claimant can only ever be a "possible" match. Anyone reading the second report should read the 19.09 journal's assessment with it.

---

## 3. The forward plan — in order, and what gates what

| # | Session | What it needs | What it unlocks |
|---|---|---|---|
| 1 | **Your answer to §1** — five minutes | — | If you pick a feature: a build session behind a switch |
| 2 | **The cleanup session**: research files out of the repository (`research-files-out-of-the-repo`, 91 MB), the ADR-006 and ADR-002 records closed | Nothing | Step 3 — the migration should not carry 91 MB of research into a new history |
| 3 | **The repository migration** (`tech/repository-migration.md`): the credential out of four tracked files, the new repository | An uninterrupted sitting; step 4 cannot be redone after the squash | Step 4 — the home server deploys from the new repository |
| 4 | **The home server**: cron (A1), queue worker (A2), mail (B2, B3), backups with object lock (A6), the first admin (A10) | Steps 2–3 | Step 5, and the owner check's first end-to-end try on a real mail path |
| 5 | **Production**, then the first real venues by hand (60–70) | Step 4 rehearsed | Launch |
| 6 | **The day owner access opens** — the checklist in [`product/features/Owner Verification.md`](../product/features/Owner%20Verification.md): Instagram account and `UNI_INSTAGRAM_HANDLE`, mail and queue running, one request on each path, the privacy policy's date line | Step 5, and the first owner who asks | V2 |

**Alongside, without a laptop:** create UNI's Instagram account (finding 2); give [the compliance hour](../compliance/the-compliance-hour.md) a date — nine items, about 75 minutes, deferred five times, two of them live gaps on a published page.

---

## 4. Open questions

| # | Question | Recommendation |
|---|---|---|
| 1 | **Which V2 features, if any, get built now behind a switch?** (§1) | **None of F1–F7.** Discuss browser-only saves if you want one thing |
| 2 | **UNI's Instagram handle** | Pick it when you create the account; it goes into `UNI_INSTAGRAM_HANDLE` on the server, without the @ |
| 3 | **The Signal files and `docs/additions.txt`** | Move the Signal files out of the project folder. Keep `additions.txt` as your notes inbox if you like it — then I would add it to `.gitignore` |
| 4 | **Do you check menus by phone?** (finding 4) | If not, three docs get one sentence each: "online menu or a visit" |
| 5 | **A date for the compliance hour** | This week, before the home server |

---

## 5. To pick up where 19.09 left off

- **Try the owner side locally:** `composer run dev` (it runs the queue listener), owner access is already on in your `.env`, and every e-mail lands in `storage/logs/laravel.log`. The browser checklists are in the 19.09 journal — session 1 (the page, the tabs, the venue page's owner line) and session 2 (both confirmation paths, the approval gate, the registry lookup).
- **The reminder by hand:** `php artisan uni:remind-waiting-claims` (it only writes when a request has waited over 14 days).
- **Everything:** `php artisan test --compact` — 1038 tests, about 25 seconds.
