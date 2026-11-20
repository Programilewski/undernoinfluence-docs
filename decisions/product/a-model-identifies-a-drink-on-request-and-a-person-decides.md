# A model identifies a menu's drink on request, and a person decides

**Date:** 2026-11-20
**Status:** Decided by Paweł, 20.11: "zbuduj to, wersja na żądanie"
**Executed:** 2026-11-20, `v0.1.19`. "Zapytaj AI" (key I) and "Kopiuj nazwę" in Przegląd pozycji; `menu_lines.ai_lookup` and `ai_looked_up_at`
**Area:** Sourcing | Catalogue

---

## Problem

The first timed round in Przegląd pozycji (20.11) showed where the time goes. A line whose brand or product the catalogue lacks is looked up in Google, and Google mostly brings shops that sell the drink and say little about who makes it or how strong it is. Paweł then asks ChatGPT or Claude in another window and types the answer into *Utwórz produkt*. That is three tools and retyping for one line.

## Options considered

1. Keep Google, add a button that copies the name.
2. Ask a model with web search for every waiting line in advance.
3. Ask a model with web search for one line, when the person reviewing asks.

## Decision

**Option 3, plus the copy button from option 1.** "Zapytaj AI" sends the drink as the menu prints it (name, printed strength, section, the reader's brand and category guesses) to Haiku 5.5 with web search. The model answers with the brand, producer, product name, the strength a source states, whether it is alcohol-free, category, style, a short note in Polish and up to three source URLs. The answer shows under "Według AI" with its sources and fills *Utwórz produkt*. Nothing reaches the catalogue until the person submits the form.

On demand rather than in advance because a person recognises most drinks without help, and advance lookups would be paid for lines that never needed one.

## Rules

- **What goes out:** only the drink. Never the venue's name or address, never anything about a person.
- **The answer is a suggestion.** It is kept on the line so the person can see what they acted on; the catalogue changes only through the form. A product created this way still starts with its strength unknown: a strength found on the web is shown, not written (the ABV trust model is unchanged).
- **Sources are shown, not trusted.** Only `http(s)` URLs the model returned are kept, at most three.
- **One answer per printed name.** A line whose printed name was asked about before gets that answer without a new request.
- **Cost:** measured on two drinks, 7–13 s and one search each, about 0.012 USD a line. The configured ceiling is three searches, about 0.035 USD.
- **Not ADR-012's Brave rule.** Brave's results are still never stored. What is kept here is the model's own answer about a product, for the catalogue, not a search engine's results and not a venue's offer.

## What this prevents

- **Retyping between three tools** for a line the catalogue lacks.
- **An unseen guess in the catalogue:** the answer fills a form a person submits, with the sources beside it.

## Revisit when

- **The next timed round** shows how many lines needed the button and how much time it saved per line. If most lines need it, asking in advance (option 2) becomes worth its cost.
- **The model's answers are often corrected:** try Sonnet 5.5 for the lookup and compare.

*See also: [[decisions/adr/ADR-012-automated-venue-sourcing]] · [[decisions/product/a-venue-type-is-suggested-and-a-person-confirms-it]] · [[decisions/product/what-belongs-in-the-catalogue]]*
