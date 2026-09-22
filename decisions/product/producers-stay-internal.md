# Producers stay internal

**Date:** 2026-09-04
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14 (`ProducerNamesStayInternalTest`)
**Area:** Data Model | Brand | Categories

---

## Problem

The catalogue models three levels — producer, brand, product — and brand pages were about to be built. The question was whether to expose the producer relationship publicly, since one company typically owns several brands positioned as if unrelated. Paweł's instinct: *"producenci trzymają osobne marki z jakiegoś powodu, boję się, że jak pokażemy relacje publicznie, będą mieli do nas o to pretensje."*

## Options considered

Public producer pages listing every brand a group owns. Producer shown as a field on brand and product pages. Producer stored but never rendered. Not modelling producers at all.

## Decision

**Producers are stored, used internally, and rendered on no public page.** The relationship is not secret — EU food law requires the producer's name and address on the label, and ownership is in KRS — so this is not about confidentiality. It is that **publishing it turns scattered public facts into a browsable portfolio map**, which is the one thing here that serves nobody who came to find a drink.

## Rules

No producer name appears on any public page, in any field, under any label. This includes producer names that have leaked into the brand field — showing *Campari Group* as a brand is showing a producer, and it is also simply wrong for the reader, who is looking for a drink called *Crodino* and gains nothing from the name of the company behind it. Producer data is used in the admin panel for grouping and B2B outreach. If producers are ever published, the link must first carry a `relationship_type` — owns, licenses, distributes, unknown — because a flat foreign key renders all four as the same claim, and being wrong about the nature of a relationship is what brands actually object to.

**Amended 2026-09-13 — a proposal's producer field no longer becomes a brand.** The owner panel's product proposal asks for the "Producent", and approving a proposal used to create a brand with that name — publishing a producer as a brand, the exact failure above, through a path nobody had looked at. Approval now creates the product with no brand; the proposal keeps what the owner wrote, and the approval notice asks the admin to assign the brand on the product.

## What this prevents

Three things, in order of weight. **A page type with no search demand** — nobody searches "Grupa Żywiec bezalkoholowe", they search "Żywiec 0,0" — added to a domain with no authority to spend on thin pages. **Giving away a B2B asset**: "which six brands do I reach with one e-mail" is worth more unpublished, at exactly the moment those companies are the prospect list. And **asserting relationships we would often get wrong**, since the Polish NA market is full of licensed and contract production that a single `producer_id` would render as ownership.

## Revisit when

Producers become the customer rather than the subject. At that point "we list your entire portfolio in one place" flips from exposure to a selling point — and the `relationship_type` field must exist before it does.

---

*See also: [[decisions/product/mission-is-the-healthy-choice]], [[decisions/product/brand-and-product-pages]]*
