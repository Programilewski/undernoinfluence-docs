# The FAQ moves to /faq, and the page it came from links rather than repeats

**Date:** 2026-09-17
**Status:** Decided
**Executed:** 2026-09-17 — `/faq` live with fourteen questions, `resources/views/faq.blade.php`
**Area:** SEO | Content | Public site

---

## Problem

On 19.06.2026 the FAQ was deliberately put *inside* `/jak-to-dziala` rather than at its own address, and the reasoning was sound at the time: the nav already carried three links, there were two questions, and both were direct follow-ups to what that page already explained. The same record named the condition for revisiting it — **eight questions**.

Two things happened since. The question count stayed at three while the product grew a freshness window, a verification badge, a strict-zero filter, a no-prices decision and a no-opening-hours decision — every one of which produces a question a first-time visitor actually asks. And `decisions-waiting-on-you` §G answered "yes" to `/faq` on 30.08 without anyone noticing that a June record said the opposite, which is the same three-positions-in-the-repository failure the `Superseded:` rule was adopted to stop.

## Options considered

**Keep the block inside `/jak-to-dziala` and grow it there.** Cheapest, and it makes the page that explains the product compete with itself: fourteen accordions below four explanatory sections is a page with two jobs and no focus.

**Build `/faq` and leave the block where it is.** The worst of the three. Two pages answering the same questions in the same words is the thin-content pattern that the district-page threshold and the filter-`noindex` rule already exist to prevent, and search engines would pick the winner for us.

**Build `/faq`, move the answers, leave a link.** Chosen.

## Decision

The FAQ lives at **`/faq`**, in Polish copy at a Latin-letter address, and carries at least eight questions. `/jak-to-dziala` keeps a short section that names what the FAQ covers and links to it — the answers themselves exist in exactly one place.

The slug is `/faq` and not `/czeste-pytania`, against the site's otherwise Polish paths: "FAQ" is read as Polish in practice, it is shorter to type and to say aloud, and the address is not what earns the query — the questions are.

## Rules

**A question is answered in one place.** When an answer belongs on both `/faq` and a product page, the product page gets the short form and the FAQ gets the full one, never the same paragraph twice.

**Below eight questions this page should not exist.** `StaticPagesTest` asserts the count, so the June condition is enforced rather than remembered. If questions are ever removed rather than added, the block goes back inside `/jak-to-dziala`.

**Every answer obeys `v1-copy-truth`.** An answer describing something a visitor cannot do today is a defect, not a roadmap note — the FAQ is where that rule was broken once already, by a report button that did not exist.

**Badge explanations live with the FAQ.** "Zarządza właściciel" is explained there only while a venue can actually carry it, through `Venue::anyOwnerManaged()`, as it was on `/jak-to-dziala` before the move.

## What this prevents

Two pages ranking against each other for the same words, which costs both. A growing accordion pile at the bottom of the page that explains the product. And the specific June-to-August drift where a record, a roadmap answer and the code each held a different position on whether this page exists.

**Supersedes:** the 19.06.2026 decision recorded in [`../../journals/2026-06-19.md`](../../journals/2026-06-19.md) — *"FAQ on separate `/czeste-pytania` page vs. extending `/jak-to-dziala`"*, which chose extension and set the eight-question trigger this record acts on.
