# Owner requests are not verified by phone; the method that replaces it is open

**Date:** 2026-09-19
**Status:** Decided — the phone call is dropped; its replacement was decided and built the same day ([[decisions/product/owner-requests-are-checked-through-the-venues-own-channels]])
**Executed:** 2026-09-19 — no public copy promises a call; requests are saved with `verification_method = email`; the phone field was made optional, then **removed from the form** later the same day (the column stays); the replacement is built. Research: two reports in `roadmap/research-results/`, assessed in the 19.09 journal
**Area:** Venues | Strategy

---

## Problem

Every owner record written up to 19.09 rested on one step: before approving a request, the admin phones the claimant and checks the NIP. Two things are wrong with it.

**It does not fit how UNI grows.** Paweł: *"We are not phoning, we add 60-70 at launch, then work on SEO, if I want to grow, calling each venue will get me not much, I need to build presence."* And later: *"in time, if we get 10 venues a day or more, it will be troublesome."*

**It proves very little.** Paweł: *"today the calls can be made up, people can impersonate others, fake the company etc."* The claimant gives the number, so a call proves only that they answer their own phone. A NIP is public, so knowing one proves nothing.

## Options considered

**Keep the call until something better exists.** It keeps a check that does not scale and does not work, and the forms keep promising a call nobody will make.

**Replace it now with a code sent from the venue's own Instagram or Facebook account**, or an e-mail on the venue's own domain. Promising, but chosen without looking at what platforms that verify ownership at scale actually do, or what Polish registries (KRS, CEIDG, REGON, the VAT white list) can prove.

**Drop the call now, and research the replacement before building it.** Paweł: *"I like your line of reasoning regarding that issue, but let us investigate further."*

## Decision

**Nobody is phoned to verify an owner request.** The replacement is researched first. The prompt is [[roadmap/research-prompts/owner-verification]]; it asks for a tiered design for ten or more requests a day at under two minutes each, and whether owner-panel access should need a stronger check than the badge.

**Owner access is not switched on until the replacement exists** — decided later the same day ([[decisions/product/owner-access-opens-only-once-owners-can-be-checked]]). Paweł: *"switch on is turned after having a way to check owners."*

**The phone number stays, as an optional field.** Paweł: *"I am not sure about removing the phone number… while putting the effort we might as well get the phone as it might be useful… I fear removing that from DB now would be expensive to implement later again."* The column, the admin field and its retention are unchanged. The form no longer requires it, because a required field needs a reason the person is given, and "we will call you" is no longer one.

**Amended later the same day — the field is hidden.** The two research reports disagreed on whether an optional, unused field holds under data minimisation. Paweł: *"As for the phone field, hide it as you recommend it."* The form no longer asks for a phone, a posted one is not kept, and the privacy policy no longer mentions it. **The column stays**, which was the cost Paweł wanted to avoid; showing the field again is one line if a step of the check ever uses it.

## Rules

- Public copy never promises a call. The forms say: *"sprawdzimy NIP i to, że zgłoszenie naprawdę pochodzi z lokalu"*, and that the answer comes by e-mail. `/jak-to-dziala` says the owner takes over the profile *"gdy potwierdzimy, że prowadzi lokal"*.
- Requests from the form are saved with `verification_method = email` — the column records the contact channel, and nobody is phoned. The column's allowed values are unchanged until the replacement is designed.
- NIP stays required. It checks the business against a registry and its address; it is never proof on its own.
- **Extended 21.09 — UNI does not ring a venue for any reason, including menus.** This record was written about owner verification, and three seeding documents went on describing *"direct phone calls to confirm offering"* as a menu-enrichment source: `product/rules/Venue Rules.md` §4, `ADR-002 Venue Seeding` points 2 and 8, and `business/Growth Strategy.md`. Paweł, 21.09: *"If you meant calling the venue to check the menu — we do not do that."* All three now read "the venue's own online menu, its social media, or a visit". A rule with one standing exception is not a rule, and "we do not call venues" is easier to hold than "we do not call venues except about menus".

## What this prevents

A product promising a call its founder will not make, and an approval that looks verified when it is not. It also prevents a replacement chosen on instinct and then defended because it was built.

## Revisit when

The research comes back. The replacement gets its own record, this one's `**Executed:**` line closes, and the research may reopen the phone field.

---

*Amends: [[decisions/product/claim-requests-come-from-the-venue-page]] · [[decisions/product/admin-recorded-claims-v1]] · [[decisions/product/new-venue-requests-create-no-venue]] · [[decisions/product/email-verification-deferred-to-v2]]. See also: [[decisions/product/one-request-form-for-owners]]*
