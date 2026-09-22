# Transactional Email Provider: Scaleway TEM over US Providers

**Date:** 2026-06-29
**Status:** Decided — **upheld 2026-09-09 after EmailLabs was evaluated against it, with one open test that could still overturn it**
**Executed:** no — decided, not configured; SMTP and DNS are production steps (deploy checklist B2, B3)
**Area:** Infrastructure / Compliance

---

## Problem

V1 needs to actually send transactional email — claim approved/rejected, erasure responses, email verification, password resets. Until now the mailer was `log` and nothing left the app. The provider choice isn't cosmetic: every one of these emails carries a venue owner's address and name, so the provider becomes a personal-data processor. The rest of the stack was deliberately built EU-resident (PostHog EU, genuinely anonymous events, breach runbook), so a careless pick that ships owner data to the US would be the one inconsistent seam — and would create a legal dependency we don't control.

## Options considered

Resend (US, great DX, EU-US DPF certified). Postmark / Amazon SES (US, same transfer question). Brevo (French, but priced as a marketing platform with bundled volume plans and a "Sent with Brevo" footer on the free tier). Scaleway TEM (French sovereign cloud, pure transactional, pay-as-you-go). Self-hosted Postfix (full control but fragile deliverability).

## Decision

We use Scaleway TEM for transactional email, EU-hosted, sending from a dedicated `tx.undernoinfluence.pl` subdomain via the standard SMTP mailer. It is pure pay-as-you-go (300 emails/month free, then €0.25 per 1,000), needs no EU→US transfer mechanism, and sends clean unbranded mail even on the free tier. Marketing email, if it ever exists, goes to a separate provider on a separate subdomain — never through this channel.

## Rules

Transactional mail only, through Scaleway TEM, on `tx.undernoinfluence.pl` with its own SPF, DKIM and DMARC records. Marketing, newsletters, and cold B2B outreach must never use the transactional domain or provider — they require a separate subdomain (e.g. `news.undernoinfluence.pl`), a separate provider, and recorded consent. The privacy policy lists Scaleway SAS as an Article 28 sub-processor (EU/France, no transfer outside the EEA). The Scaleway DPA must be signed before the first real claim is processed. Local and dev environments stay on the `log` mailer; only production carries live SMTP credentials.

## What this prevents

It avoids leaning on the EU-US Data Privacy Framework for owner data — a framework whose redress court has been non-functional since January 2025 and which is under fresh CJEU challenge, after both its predecessors (Safe Harbor, Privacy Shield) were struck down. It keeps the compliance story consistent with the EU-resident analytics posture, so there is nothing awkward to explain to UODO. The subdomain split stops a future marketing-complaint spike from poisoning the deliverability of password-reset and claim emails. And the pay-as-you-go model means no 12-month contract draining money while the idea is still being validated.

## Revisit when

Marketing email becomes a real need — at that point choose a marketing ESP and stand up the `news.` subdomain separately. Or when transactional volume approaches ~1.2M emails/month, where Scaleway's €80 Scale plan (dedicated IP + 99.9% SLA) starts to win on both price and deliverability. Or if Scaleway changes TEM pricing or its EU-residency guarantee.

---

## Revisited 2026-09-09 — EmailLabs (Vercom S.A.) compared, decision stands

Paweł raised **EmailLabs**, a Polish transactional provider, and it is a serious candidate rather than a distraction. This section records the comparison so the next session does not run it again from scratch, and names the one thing that would reverse the outcome.

### The pricing pages point the wrong way

EmailLabs advertises a free tier and Scaleway advertises a per-thousand rate, so EmailLabs looks cheaper. It is, in one narrow band, by about two euro.

| Emails per month | Scaleway Essential | EmailLabs |
|---|---|---|
| 300 | €0 | €0 |
| 9 000 | **€2.18** | €0 (300/day cap) |
| 30 000 | **€7.43** | €29 (Essential 30) |
| 100 000 | **€24.93** | €68 (Essential 100) |

Scaleway Essential carries **no base fee**: 300 emails included, then €0.25 per 1 000. EmailLabs is free to 9 000 and then steps to a **fixed monthly subscription**. Above 9 000 Scaleway is four to ten times cheaper, and the €29 step is the shape of recurring spend that the V1 rule exists to refuse.

### But volume is not what decides this, because UNI barely sends any mail

V1 is browse-only ([[decisions/product/browse-only-v1]]), so transactional mail is claim verification, claim approved and rejected, erasure responses and password resets. **At fifty venues that is on the order of 150 emails a year** — below 300 a *month* by a wide margin. **Both providers cost €0 for UNI, plausibly through the whole of V1 and V2.**

So the question is not price. It is whether the mail arrives, and whether we can find out what happened when an owner says it did not.

### What actually separates them

**EmailLabs' free tier keeps one day of logs.** That is the wrong shape for this workflow: a claim is approved on Friday, the owner writes on Tuesday saying nothing came, and the record is already gone. It is the same reasoning that put `venue_offer_logs` on a 24-month horizon — **the dispute arrives late, because the thing being disputed takes time to reach the person who disagrees with it.** The tier that fixes it is €29 a month to send perhaps thirty emails, which costs more than the VPS and Ploi combined.

**Scaleway Essential includes one webhook per domain.** Delivery and bounce events can be written into our own tables, at which point the vendor's own log retention stops mattering. The EmailLabs free tier does not list webhooks at all.

### Where EmailLabs genuinely wins, and it is not nothing

It is a Polish company — Vercom S.A., **to be verified as current before any switch** — with Polish infrastructure, a Polish-language processing agreement, and the same supervisory authority we would answer to. Its claim of *"sendings adjusted to local provider requirements"* is a real advantage rather than marketing: **venue owners in Poland plausibly use wp.pl, o2.pl, interia.pl or onet.pl**, and international senders often carry weaker reputation with those than with Gmail. Its paid tiers also carry Certified Senders Alliance certification, which several European mailbox providers respect. The free tier does not.

### The open test, and it is the only thing that would reverse this

**Neither a pricing page nor either party's reasoning can establish deliverability into Polish consumer mailboxes.** Both providers have free tiers, so the question is answerable directly:

> Send the real claim-approval template from both providers to a **wp.pl, o2.pl, interia.pl, onet.pl and gmail.com** address, and record inbox versus spam for each.

An afternoon, no cost. **If Scaleway lands clean, it stays** — the record is written, the privacy policy already names Scaleway SAS as an Article 28 sub-processor, and switching costs a record rewrite, a policy edit and redoing the SPF, DKIM and DMARC work. **If Scaleway lands in spam at a Polish provider and EmailLabs does not, that single fact outweighs every argument above and we switch**, accepting the log-retention limitation and solving it with our own event storage.

The test belongs with the SMTP work, not before it — it needs the sending domain, which needs the hosting decision. Tracked as **B2** in [`../../roadmap/deploy-checklist.md`](../../roadmap/deploy-checklist.md).

### What did not change

The subdomain split, the marketing separation, the DPA obligation and the rejection of US providers are all independent of which EU provider wins. Whichever it is: transactional mail only, on `tx.undernoinfluence.pl`, with its own SPF, DKIM and DMARC; marketing never on that domain or that provider; **the processing agreement signed before the first real claim is processed**; and the provider named in the privacy policy before the first real visitor loads a page.

---

*See also: [[decisions/product/city-agnostic-homepage]] · [[decisions/product/browse-only-v1]]*
