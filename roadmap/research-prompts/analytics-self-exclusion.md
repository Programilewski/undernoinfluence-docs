---
topic: Excluding first-party and operator traffic from owner-facing analytics
raised: 2026-09-04
status: pinned — awaiting external research
context: decisions-waiting-on-you-v7.md §0
---

# Research prompt — who should be excluded from analytics a venue owner pays for

*Paste the block below into a research-specialised model. Everything it needs is inside it;
it does not have access to our repository.*

---

## Prompt

You are advising a solo founder building **Under No Influence (UNI)**, a Polish directory of
venues (bars, cafés, restaurants) rated on the quality of their **non-alcoholic drink offering**.
It is pre-launch, targeting Warsaw first.

### The business model that makes this question matter

Venues will eventually pay for an **owner report**: how many times their profile was viewed, where
those visitors came from, how they compare to nearby venues, which products are gaining traction
in their city. **These numbers are the product being sold.** If an owner ever finds a number that
cannot survive a direct question, the damage is to the credibility of the whole methodology, not
to that one figure.

### The privacy architecture, which constrains every answer

This is deliberate and is not up for revision:

- The analytics events table stores **no identifier of any kind** — no IP address, no cookie, no
  session id, no user agent, no device fingerprint, no hashed identifier.
- Consequently there is **no deduplication of visitors**. The product cannot say "unique visitors",
  only "views". This was a deliberate trade documented in a decision record.
- Automated traffic (crawlers, bots, monitoring tools, HTTP libraries) is **dropped at the moment
  of writing**, matched against a published list of user-agent substrings. It is never recorded
  and then filtered, because a filterable row would have to carry something about the request,
  which the no-identifier rule forbids.
- The published methodology answers the owner's real question — *"were these people at all?"* —
  with that bot list, not with any claim about identity.

### The problem now on the table

Nothing currently distinguishes **the site operator** browsing venue profiles from a real visitor.
The founder is about to manually enter ~30 real venues and check each one, into a database holding
roughly 700 analytics events in total. Without a change, the first owner report would be
substantially a record of the founder's own browsing.

The proposed fix: drop analytics writes for requests carrying an **authenticated session whose
role is in an excluded list**, at the same two write chokepoints the bot filter already uses. The
session is read and discarded; nothing about it is stored.

There are three roles: `admin` (the founder and future staff), `owner` (a venue operator who has
claimed their venue and can see its report), and `user` (an ordinary registered visitor —
currently unused, the product is browse-only in V1).

### The specific questions to research and answer

1. **Should venue owners be excluded from the analytics of their own venue?** The argument for:
   an owner repeatedly opening their own profile inflates the exact number they are being invoiced
   for, which is the worst possible place for self-inflation. The argument against: an owner is a
   real person on a real device, and their visit is arguably real demand — and excluding them
   makes the number they see smaller than the number a naive competitor product would show.
   **What do established analytics products actually do here, and what do the industry standards
   bodies say?**

2. **Is there a recognised standard for this?** Look specifically at what auditing and
   accreditation bodies require regarding the exclusion of internal, operator, publisher and
   first-party traffic from audience figures that are sold or used for advertising — for example
   the IAB/MRC "Client-Side Counting" and invalid-traffic guidance, JICWEBS/ABC audience auditing
   standards, and any European equivalents (including Polish market bodies such as PBI /
   Polskie Badania Internetu, and IAB Polska). Cite the actual documents where they exist.

3. **What is the standard terminology?** "Internal traffic", "first-party traffic", "publisher
   traffic", "General Invalid Traffic (GIVT)", "Sophisticated Invalid Traffic (SIVT)" — which of
   these is the correct frame for operator self-visits, and is operator traffic conventionally
   treated as *invalid traffic* or as a separate exclusion category?

4. **How do comparable products handle it?** Specifically directory and listing products where
   the listed business can see its own statistics: Google Business Profile, Yelp for Business,
   TripAdvisor, Booking.com, OpenTable, Untappd for business. **Do any of them publicly document
   whether the business owner's own views are counted?** If the documentation is silent, say so —
   silence is itself a finding.

5. **Does excluding owner traffic create any problem the founder has not anticipated?** For
   example: an owner who cannot see their own test visit reflected in their dashboard may conclude
   the tracking is broken. Is there an established pattern for handling that — a debug view, a
   separate "your own visits" counter, an explicit note in the dashboard?

6. **Is there any GDPR angle?** The exclusion reads an authenticated session and stores nothing.
   Does deciding *not* to record something based on the identity of the logged-in person raise any
   issue under GDPR, or is it straightforwardly outside the regulation because no personal data is
   processed or stored as a result?

### What a good answer looks like

- A clear recommendation on question 1 with reasoning, not a list of considerations.
- Citations to actual standards documents and vendor documentation, with links. Say explicitly
  where you could not find documentation rather than inferring what a product probably does.
- Any consideration the founder has not raised, flagged as such.
- Keep the privacy architecture fixed. Do not propose solutions that require storing an
  identifier, an IP address or a cookie — those are ruled out by a prior decision, not by
  oversight.
