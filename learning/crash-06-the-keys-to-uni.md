---
description: "Crash course: which accounts could end UNI if someone else took them, how they chain together, and a one-page check for each — written for a trip."
version: 1.0
owner: Paweł Milewski
updated: 2026-10-10
status: teaching document — holiday series, course 6 of 6
---

# Course 6 — The keys to UNI

Most of UNI's security work so far has been about the server: key-only SSH, a firewall, an admin panel behind three layers. That work is good. But for a one-person company, the likeliest way to lose everything isn't someone breaking into the VPS. It's someone **taking over an account** that controls the VPS, the domain or your e-mail. Those accounts sit outside every control the playbook sets up.

This course maps those accounts, shows how they chain together, and ends with a check you can do from your phone. Production isn't live yet, so nothing is at stake on this trip. This is the right time to set it up, before something is.

## 1. The chain: whoever has your e-mail has everything

Nearly every account recovers through e-mail. So the real hierarchy isn't "how important is this service" but **"what does this account let you reset"**:

```
Your personal e-mail (the address every account recovers to)
 │
 ├── Password manager ──── holds every other password, the break-glass SSH key, the 2FA recovery codes
 │
 ├── OVH account ────────── the domain + DNS ── mail for @undernoinfluence.pl, TLS certificates,
 │                │                              Search Console verification, where visitors land
 │                └──────── the VPS ─────────── console access, rescue mode, reinstall, the daily machine backup
 │
 ├── Scaleway ───────────── outgoing mail as UNI; the backup bucket
 ├── GitHub ─────────────── the code, CI
 ├── Google (Search Console), PostHog, Healthchecks.io, Tailscale
 └── later: UNI's Instagram and TikTok
```

**Two accounts are worth more than the server itself:**

- **Your e-mail.** It resets everything else.
- **OVH.** It holds both the domain and the machine. Someone in your OVH account can point the domain at their own server, which is a perfect phishing copy of UNI with a valid certificate. They can also open the VPS console and reboot it into rescue mode, which gives them the disk without ever needing your SSH key. **SSH hardening doesn't protect against the hosting account.** That's the single most important idea in this course.

## 2. What "secured" means for each key account

For your e-mail, the password manager and OVH, do all three of these:

1. **A unique, generated password** from the password manager, never reused.
2. **Two-factor authentication that can't be phished**, wherever offered. Order of preference: a **passkey or hardware key** (resists phishing completely) → an **authenticator app** (TOTP) → SMS only as a last resort. SMS can be hijacked by a SIM swap, and abroad you may not even receive it.
3. **Recovery codes stored somewhere that isn't the phone** that holds the authenticator. For example, in the password manager, plus a printed copy at home. If the phone is lost abroad and the codes were only on it, you're locked out of your own company until you get home.

Then the second tier (Scaleway, GitHub, Google, PostHog, Tailscale) needs at least 1 and 2.

**Two less-obvious settings at OVH:**

- **Domain auto-renew, and the card behind it.** An expired domain takes the site, the mail and the Search Console history with it, and expired `.pl` domains are watched and snapped up. Check that auto-renew is on and the payment card won't expire first.
- **Registrar transfer lock / DNS change protection**, if OVH offers it for `.pl`. This makes moving the domain away need an extra step.

## 3. The SSH side, briefly

Already done well (runbook Phase 0): the PC's key has a passphrase, a separate break-glass key lives only in the password manager, root can't log in, passwords can't be used for SSH. Two things are worth knowing:

- **The break-glass key's value depends on the password manager being reachable from wherever you are.** Runbook 5.3, the emergency rollback without the PC, assumes you can open the password manager on another device and use an SSH app. Once production exists, try it once from the phone, at home, before the trip on which you'd need it.
- **Deploys don't go through GitHub** (`update_code_strategy: local_archive`: the code is packed on the PC and uploaded). So a compromised GitHub account can't push code to production. It can only change what you'd pull and deploy next. Keep that property. It's quietly valuable.

## 4. Phishing aimed at small site owners

The attacks that actually reach one-person companies are dull and convincing:

- **"Your domain is about to expire / your OVH service is suspended. Pay here."** Real OVH mail doesn't need you to click a link. Open the OVH site yourself, from a bookmark.
- **"Domain registration services" invoices** for registering the same name in other countries or "search engine registration". These are scam invoices, so ignore them.
- **A fake Google Search Console or PostHog alert** linking to a login page. Same rule: never log in from a link in an e-mail.
- **Once UNI is public:** "I'm the owner of venue X, please change the contact e-mail to this one." The owner-verification work exists for exactly this reason. With the switch off in V1, contact changes are admin-only and should need the same evidence as anything else.

A password manager helps more than any training here: **it won't autofill on a fake domain.** If it doesn't offer your OVH password on a page that looks like OVH, stop.

## 5. Travelling

- **Public Wi-Fi** in hotels and airports is fine for HTTPS sites and for SSH, which are encrypted end to end. Tailscale is also encrypted. The real risk is a captive portal or a fake login page, so be suspicious of anything asking you to log in to something unexpected.
- **Don't log into `/admin` or the password manager on a shared or hotel computer.** Only on your own devices.
- **If the phone is lost or stolen:** from another device, sign out of the e-mail and password manager sessions, revoke the phone in Tailscale's admin console, and check OVH's login history. Knowing this list *before* it happens is the whole value of it.
- **A screen lock and encryption on the phone.** Android encrypts by default with a screen lock. Without a lock, anyone holding the phone holds the authenticator.

## 6. The one-page check

You can do most of this from the phone. Tick what's already true:

| # | Check | Done |
|---|---|---|
| 1 | The e-mail every account recovers to has a passkey or authenticator 2FA, and its recovery codes are stored off the phone | ☐ |
| 2 | The password manager has 2FA, and its emergency/recovery kit is stored at home | ☐ |
| 3 | OVH has 2FA (app or security key, not SMS), with recovery codes stored off the phone | ☐ |
| 4 | `undernoinfluence.pl` auto-renews, and the card on file outlasts the next renewal | ☐ |
| 5 | Scaleway, GitHub, Google, PostHog, Tailscale each have 2FA | ☐ |
| 6 | Every account above uses a unique password from the manager | ☐ |
| 7 | You know where OVH's and your e-mail's "recent logins / active sessions" pages are | ☐ |
| 8 | (After production exists) runbook 5.3 tried once from the phone | ☐ |

## Questions to bring back

1. **Should this list become a row in the deploy checklist?** It belongs with the "gates before going public": the controls that protect production from account takeover, next to the ones that protect it from network attack. I'd recommend yes.
2. **A second person with access in an emergency.** If you were unreachable for a week, with the site down or a breach in progress, could anyone act? It isn't needed for V1, but worth a thought before the owner switch, when other people start depending on UNI. Even a sealed envelope with recovery instructions counts.
3. **Who receives the alarms?** The healthcheck, backup and disk-space e-mails all go to one address. Is that an address you'll actually see within hours, on holiday included? Should the healthcheck also notify by a phone push?
