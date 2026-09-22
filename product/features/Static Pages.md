# Static Pages

**Status:** **Built, except `/dla-lokali`, which was deliberately deleted.** **Verified against code 2026-08-18.** Live: `/` (homepage), `/o-nas`, `/jak-to-dziala`, `/regulamin`, `/polityka-prywatnosci`. `/dla-lokali` has returned 404 since 18.06 and **must not be restored** — it promised an owner panel and analytics that V1 does not expose ([[decisions/product/hide-for-venues-v1]]). Every owner-facing link now points at the contact email. **To fix before launch:** `/jak-to-dziala` promises a "Zgłoś nieaktualne dane" button that does not exist — see point 5 in [[roadmap/pre-launch-checklist]].

## Required Pages for V1

### /o-nas
Short about page. What UNI is, why it exists, who builds it. Builds trust. Constrained width (`max-w-4xl`).

### /kontakt
Simple contact form or email address. Required for business credibility, especially for venue owners evaluating whether to list.

### /regulamin
Terms of service. Legally required. Cover: user conduct, venue listing terms, data usage, liability limitations.

### /polityka-prywatnosci
Privacy policy. Legally required, especially with analytics. Must disclose:
- What data is collected (events, flags, session data)
- Why (product improvement, B2B analytics)
- Retention period
- That flagging behavior is tied to sessions/accounts
- No third-party tracking, no cookies for analytics
- GDPR rights (access, deletion, portability)

See [[tech/analytics#GDPR Approach|GDPR approach]] for technical details.

### /dla-lokali
**The most important static page after the discovery page.** This is how venue owners find out about UNI and decide to list.

Content:
- What UNI is (one paragraph)
- What listing gives them (visibility, free dashboard analytics)
- Preview of what the owner dashboard looks like (screenshot or mockup)
- What premium analytics offer (teaser for future B2B subscription)
- CTA: "Zgłoś swój lokal" → `/zglos-lokal` (take over a listed venue, or add one; behind `UNI_OWNER_ACCESS`)
- FAQ for owners: "Is it free?" (yes, basic listing is free), "How do I manage my menu?" (owner dashboard), "Who sees my data?" (anonymized, aggregated)

This page should feel professional and trustworthy. It's selling B2B — owners need to believe UNI is real and worth their time.

## Layout Context
All static pages use constrained width (`max-w-4xl` or `max-w-5xl`), centered. See [[tech/stack#Layout Contexts|Layout Contexts]].

## SEO Landing Pages
Auto-generated from venue database. Not static — they update as venue data changes. See [[business/Growth Strategy#SEO]].

URL pattern: `/warszawa/piwo-bezalkoholowe`, `/warszawa/mocktaile`, etc.

Each page lists venues matching city + category, with full breadth bars and checkmarks. These are indexable and target search queries like "najlepsze bezalkoholowe piwo w Warszawie."
