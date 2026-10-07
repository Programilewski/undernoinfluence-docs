---
description: "Prompt: where a classic drink ends and a venue's own creation begins, and how to list both without inviting gaming."
topic: Classic non-alcoholic drinks as shared catalogue entries versus venue-specific house drinks — the threshold between them, the data model, and the incentives it creates for venue owners
raised: 2026-10-07
status: ready to send — awaiting external research
context: product/rules/Classics and House Drinks.md; the backlog's Launch row on classic drinks (roadmap/undone-inventory.md)
---

# Research prompt — classic drinks versus a venue's own creations

*Paste the block below into a research-specialised model, in its deep-research mode. Everything it needs is inside it; it does not have access to our repository.*

---

## Prompt

You are advising a solo founder on **how a directory of venues should record mixed non-alcoholic drinks**: when a drink is a shared, well-known *classic* (a virgin mojito, a Shirley Temple) that should be findable across every venue serving it, and when it is a *venue's own creation* that belongs to that venue alone. The founder needs a rule for the threshold between the two, a data model that holds both, and an understanding of how venue owners will behave once the rule exists.

### What the product is

**Under No Influence (UNI)** is a Polish-language directory of venues (bars, cafés, restaurants, pubs, hotels) catalogued by the non-alcoholic drinks they serve. It answers one question: *where can I order a good non-alcoholic drink tonight?* It exists to help somebody find a healthier option they would otherwise have missed; harm reduction, not abstinence. Venues, brands and drinks are instruments of that, never customers to be pleased. **There is no paid placement, no pay-to-rank, and nothing anyone pays changes what the public sees.** The interface and the audience are Polish; Warsaw first, other Polish cities later. About 30 venues at launch, entered by the founder from the venues' own published menus; hundreds to thousands later.

### How drinks are recorded today

There are two kinds of record:

1. **Catalogue products.** A shared entry, for example "Heineken 0.0": a name, a brand, a category (beer, wine, mixed drinks, spirits, cider, sparkling), and an alcohol-content status. **Each product has its own public page** listing every venue that serves it, which is where a person searching for that drink lands. When a menu is entered, each line as the menu writes it ("Heineken 0,0 but. 0,33") is matched to a product through known spellings; a line that matches nothing is not recorded until a product or a spelling is added.
2. **House drinks.** A record that belongs to one venue: a free-text name, a short description, and one of four types: *mocktail*, *non-alcoholic cocktail*, *drink made with a 0% spirit*, and *virgin classic*. **A house drink appears only on its venue's page.** It has no page of its own and cannot be found across venues.

Both kinds count equally towards how much choice a venue offers, which affects how venues are ordered in listings. Products can technically exist without a brand, so a classic could be a brandless shared product.

**The problem:** a virgin mojito served at forty venues is today forty unrelated free-text rows. A person who wants a virgin mojito tonight cannot find the venues that make one, which is exactly the question UNI exists to answer.

### Who will add drinks, and what they gain

At launch only the founder adds drinks. Later, **venue owners will add and edit their own menus** in a self-service panel; there is no review step in front of each edit, and owners are not asked to justify or source what they add (that friction makes them leave). The incentives the founder already sees:

- **Recorded as a house drink**, a drink shows on the venue's own page, under the venue's own name, which presents it as the venue's creation.
- **Recorded as a classic**, it also appears on the classic's shared page, in the list of venues serving it. That is visibility in front of people searching for that drink.

The founder expects some owners to record a plain mojito as a "signature" house drink because it looks better on their menu, and others to do the opposite to get listed. **How the choice is explained to owners may matter as much as the rule itself.**

### The questions

1. **Precedents.** How do comparable platforms separate a canonical, shared item from a venue's own version of it? Look at least at: Untappd (beers versus venue menus), Vivino, Google Maps (menus and "popular dishes"), Yelp, TripAdvisor, TheFork, Wolt / Glovo / Uber Eats menus, Open Food Facts, cocktail references such as the IBA official cocktail list and Difford's Guide, and any directory of non-alcoholic drinks you can find. For each: what the canonical entity is, who may create one, how venue items are linked to it, and what went wrong.
2. **The threshold.** What makes a drink a classic: its name, its recipe, how many venues serve it, a recognised external list, or something else? Where do variants go: "virgin mojito with rhubarb", "Nojito", "mojito 0%", a venue's "Garden Mojito"? Propose a rule a person can apply in seconds while reading a menu, and test it against at least twenty real-world examples, including hard cases.
3. **Both at once.** Is a parent–child model better than either/or: a house drink that keeps the venue's own name and description **and** declares itself "based on" a classic, so it shows on the venue's page as the venue's creation *and* on the classic's page as a variant? What does that cost in data, in moderation and in clarity for the person searching?
4. **The list of classics.** Should it be a fixed curated list, a list that grows when a drink reaches some number of venues, or an external standard? Who adds to it, and how do new trends ("espresso martini 0%") enter it? Give a concrete starting list for a Polish non-alcoholic context, with the reasoning for each entry.
5. **Polish naming.** How Polish menus actually name these drinks ("bezalkoholowe mojito", "virgin mojito", "mojito 0%", "nojito", "mocktail", "koktajl bezalkoholowy", English names on Polish menus), and what Polish people type into a search engine when looking for one. Is there search demand for classic non-alcoholic drink names by city? Cite data where it exists.
6. **Owner behaviour and the message.** With self-service owners and no review step, how will owners misuse each option, and which rules, defaults or interface wording reduce that without adding friction? What should the panel say to an owner choosing between "classic" and "own creation", so that an honest owner chooses correctly by default? Include examples of interface wording from platforms that handled this well.
7. **What it costs to change later.** If drinks are recorded one way at launch and the model changes after a few hundred venues, what does the migration involve? Is there a shape that is safe to start with even before the full rule is settled?

### Constraints

- **A solo founder.** No moderation team. Founder review of community contributions exists, but owner edits are not reviewed one by one.
- **No pay-to-rank, ever.** No mechanism may let money, or effort that only an owner can spend, buy a better position on a shared page.
- **Owners must not be asked for more than they are today** (a drink's name, type and description). Anything that adds questions to the owner's form needs a strong case.
- **Drinks with actual alcohol are never catalogued.** Only non-alcoholic drinks and drinks made with 0% spirits.
- The whole interface is in Polish.

### What a good answer looks like

- **A recommended model**, stated in a paragraph, with the rejected alternatives and why.
- **The threshold rule**, in one or two sentences, followed by **a table of at least twenty example drinks**: menu wording, verdict (classic, variant of a classic, own creation), and why.
- **A starting list of classics** for Poland, with Polish and English names and the spellings to match.
- **A table of owner gaming patterns**: what an owner does, what they gain, how likely it is, and the cheapest countermeasure.
- **Suggested owner-facing wording** (in Polish if you can) for the choice between a classic and an own creation.
- **What to measure after launch** to know whether the rule works.
- **Label every claim** as documented (with a link), observed practice, or your own reasoning. Say explicitly where you could not find evidence; silence is a finding.
- Anything the founder has not asked about but should have, flagged as such.
