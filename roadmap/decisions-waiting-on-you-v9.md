---
version: 9.0
owner: Paweł Milewski
updated: 2026-09-04
status: living — supersedes v8, whose open questions are carried forward in §9
---

# Decisions waiting on you — v9, the substitution research came back

**Your thesis is half right, and the half that is wrong matters more strategically than the half that is right.** §3.

**Everything below is verified against running code on 04.09 or sourced in §10.** 557 tests green — no code written.

---

## 3. The substitution research — your thesis is half right, and the wrong half matters strategically

**Verdict from the research, quoted rather than paraphrased:** *"partially supported but overstated."*

### 3.1 What is supported, and it is the part you most cared about

- **A Japanese RCT** in heavy non-dependent drinkers: free non-alcoholic drinks for 12 weeks produced **−320,8 g of alcohol versus −76,9 g in control**, and the effect **persisted eight weeks after the intervention stopped.**
- **A workplace RCT** (278 employees drinking excessively): reduced total consumption, mainly via fewer drinking days, with improved fatigue and mental health and **no increase in volume on the days they did drink.**
- **Spanish household data**, 1,29 million purchases: households newly buying same-brand zero-alcohol beer cut total alcohol grams by **5,5%**, substituting roughly 0,75 l of zero-alcohol for every 1 l of full-strength.

**And your success metric holds.** Partial substitution is recognised harm reduction across the field — the alcohol RCTs treat it that way, Dry January studies treat non-abstaining reductions as meaningful, and it matches tobacco harm reduction (dual users substituting half their cigarettes still show 7–38% biomarker reductions) and opioid substitution. **"Two non-alcoholic alongside two alcoholic instead of four" is a real result, not a consolation prize.** That part of your thinking is evidence-backed and you should keep saying it.

### 3.2 What is overstated

- **Population level is uncertain, not positive.** WHO's 2023 brief says the net effect of NoLo on ethanol consumption and public health *remains in question* — new drinking occasions, misleading minors and abstainers, display alongside alcoholic brands.
- **Price parity destroys the effect.** NA beer acts as a genuine economic substitute only when **substantially cheaper** ($2,50 vs $5,00). At parity it is no better than soda or juice. **Availability alone does not do the work.**
- **Substitution and addition both happen** and the balance is unknown.

### 3.3 The correction that changes how we should talk — and this is the most valuable thing in the whole research pass

Your framing was: *"forcing people to stop drinking has failed a lot of times."*

**The research says that conflates Prohibition with modern regulation, and that modern restriction works very well:**

- WHO's three "best buys" are **excise taxes, advertising bans, and availability restrictions.**
- **Scotland's minimum unit pricing** cut alcohol-attributable deaths by **13,4%**, hospitalisations by ~4,1%, population consumption ~3%, saving roughly 156 lives a year — with the largest benefits in the most deprived groups.
- Even Prohibition **did** reduce per-capita consumption; its failures were collateral, not a failure to reduce drinking.
- **WHO's SAFER package presents restriction and support as complements, not alternatives.**

**Here is why this is strategic and not academic.** *"Restriction doesn't work, education and choice do"* **is the alcohol industry's standard line.** If UNI says it, UNI sounds like an industry front — which is the worst available position for a harm-reduction product to hold.

**The truer sentence is also the stronger one:** *restriction works, we complement it.* Structural levers handle affordability and promotion; we help the individual standing at a bar tonight. That positions UNI **with** public health rather than against it, and it costs nothing to say — because it is what the evidence actually shows.

**I recommend changing the mission's wording on this point.** §6.

### 3.4 The gateway evidence is real, and it is specifically about brand-sharing

This matters because it is the legislators' rationale, and because **it is not hand-waving:**

- Reaction-time experiments with 15–17-year-olds: images of **zero-alcohol brand extensions made 90,7% of them think of alcohol**, against ~5% for soft drinks. Alcoholic drinks scored 94,4%. **Brand extensions are cognitively almost indistinguishable from alcohol.**
- A survey of 382 adolescents: exposure to and liking of zero-alcohol ads from parent alcohol brands predicted **more favourable attitudes to the parent brand and stronger intentions to drink that brand's full-strength alcohol**, after adjusting for prior use.

**And the honest complication for the "standalone brands are clean" story:** "new-to-world" zero-alcohol drinks — standalone NA brands — still scored **85,6%**. So standalone brands are clean on the *surrogate-marketing* axis and only partly clean on the *normalisation* axis. **Cutting brand extensions removes the strongest harm; it does not make us blameless.**

**But the research is equally clear that none of this covers us:** every gateway study is about products, packaging and producer advertising. *"I found no studies that directly examine a third-party venue directory or discovery layer."* Applying gateway logic to UNI is *"a precautionary inference, not evidence."*

### 3.5 The finding that should worry you most

**Awareness may not be the binding constraint, and UNI only addresses awareness.**

A COM-B survey of high-risk drinkers found the main barriers to choosing NoLo are **cost, social expectations, and reduced enjoyment.** Focus groups report NoLo seen as too expensive and variable in taste, with people often preferring "one less glass of regular wine" to a low-strength alternative.

**If people already know the options exist and do not choose them for reasons of price, taste and social pressure, a discovery layer does not move the outcome.** And the research found **no study testing whether a venue-discovery tool changes what anyone orders.** That is the single largest untested assumption in the product, and it is ours alone — no one has done the work for us.

**This is not a reason to stop. It is a reason to change what we measure.** §5.3.

---

## 5. Three product ideas that fall straight out of the evidence

None of these were in v8. All are directly evidence-backed.

### 5.1 Price — proposed, then rejected, and the rejection is right

**I proposed recording prices. Paweł rejected it on 04.09.2026 and I am not going to argue the general case, because the objection is correct.**

> *"Cena jest ciężka w systemie do utrzymania, jeszcze żeby była aktualna, to jest duży koszt czasu, pieniędzy, wysiłku. Ciężko jest mieć aktualne menu, ceny aktualnie, praktycznie niemożliwe."*

**Full per-product, per-venue price tracking is not viable and I should have seen that before proposing it.** Menus change, promotions run, happy hours exist, and a price recorded once is wrong within weeks. We already struggle to keep *which drinks exist* current — `offer_updated_at` and the whole freshness apparatus exist precisely because that is hard. Prices change faster than menus. **A stale price is worse than no price: it is a specific, checkable claim that is wrong**, and the freshness badge is the one thing this product sells.

**One narrower version exists, and I am recording it once rather than pressing it.** The research finding was never about absolute prices — it was about the **relationship** between them. NA beer substitutes for alcoholic beer only when it is *meaningfully cheaper*; at parity it performs no better than juice. That is a **relative** fact, and relative pricing is a venue's standing policy rather than a number:

- **One field per venue**, three values: NA options cost *less than* / *about the same as* / *more than* the comparable alcoholic ones.
- Set once when cataloguing, from the same visit that records the drinks. **No extra trip, no extra research.**
- It decays slowly, because a bar that has decided its 0,0 costs the same as its lager does not revisit that monthly the way it revisits a price list.
- **Never displayed as a number**, so there is nothing to be precisely wrong about.

**Cost: one enum column, one question on the quick-add form.** That is the whole thing.

**But if the answer is still no, price is out entirely** — no field, no proxy, no revisiting. Half-maintained data is the failure mode this project has spent two sessions designing against, and a field nobody updates is worse than an absent one.

**Answer: "the one-field parity flag", or "price is out entirely".**

Answer:

**And one consequence to state plainly either way.** Price was the only lever in the evidence that we could have touched. **With it gone, our entire mechanism is awareness — which §3.5 says may not be the binding constraint.** That does not make the product wrong, but it means §5.2 stops being a nice extra and becomes the main way UNI could actually change what somebody drinks.

### 5.2 Menu position — now the main mechanism, not a bonus

- **A randomised crossover trial in 14 English pubs** replaced one draught alcoholic beer with a draught alcohol-free beer: draught alcoholic sales fell **4–5%** — **with no reduction in total revenue.**
- A Behavioural Insights Team menu experiment across the UK, Germany and Mexico: placing NoLo options **at the top of the alcoholic section** cut alcohol ordered by ~**15%** and raised NoLo ordering ~30%. **Merely adding NoLo options without moving them did nothing reliable.**

**That is a sales conversation with a venue that does not depend on our own analytics at all:** *"Put your alcohol-free options at the top of the beer section and pour one on draught. The trials show 15% less alcohol ordered and no revenue loss."* It is useful to them, aligned with the mission, and it makes UNI an advisor rather than a listing.

**And it changes what a venue's UNI score should reward** — not just *how many* NA options, but whether they are **on draught** and **positioned**. That is a scoring-model question, and it is a better one than the current pure breadth count.

### 5.3 What we should measure, given §3.5

If awareness may not be the binding constraint, **the honest metric is not traffic.** The research sketches a proper cluster-randomised trial across Warsaw venues; that is beyond V1. But two things are within reach:

- **Ask venues what changed.** A venue reporting "we sell more NA since being listed" is weak evidence, but it is evidence, and it is collectible from the owner panel.
- **Do not claim what we cannot show.** No population-level claims. **"We help individuals substitute, which is real harm reduction"** is supported. **"We reduce alcohol consumption in Poland"** is not, and saying it would be both false and — per §3.3 — strategically damaging.

---

## 5a. Decided in conversation since v9 was written

Recorded here so the document does not drift from what was actually settled.

| Decision | Where it landed |
|---|---|
| **UNI takes no public position on alcohol policy** — not that restriction works, not that it has failed | `mission-is-the-healthy-choice.md`, rewritten. §6 below is superseded by this |
| **Full price tracking is rejected** | §5.1 above. One narrower option remains open |

**On the first: both of my drafts were the same mistake in opposite directions.** *"Restriction has failed"* is factually wrong and is the alcohol industry's own sentence, so it makes a harm-reduction product sound like a lobby. *"Restriction works and we complement it"* is true, and Paweł rejected it correctly — **people do not want to be told their freedom should be limited, and a product whose method is being useful rather than preachy cannot open by endorsing constraints on its own users.** That framing loses the person who was going to have four beers, who is the only person UNI exists for.

**Both answer a question that is not ours.** Whether taxation and availability limits work is a matter for public health policy. UNI's subject is what a person can order tonight. The rule: **speak about our own domain, never about alcohol policy in general.**

---

## 6. What changed in the mission record — settled, superseded by §5a

**This section is kept for the record; item 1 was answered and answered differently from what I proposed.** See §5a.

1. **Drop "forcing people to stop drinking has failed."** Replace with: restriction works and is well evidenced; **we complement it** by helping the person standing at a bar tonight. §3.3.
2. **State the population-level limit.** We claim individual harm reduction, which is evidenced. We do not claim aggregate impact, which is uncertain. **A mission that overclaims is a mission that can be discredited.**
**Both are now done.** Item 1 landed as *no public position at all* rather than *we complement restriction*. Item 2 — claiming individual harm reduction but never population-level impact — is in the record as written.

---

## 8. Revised session plan

Changes from v8 §17 are marked.

**Session 1 — guards, then the import.** Unchanged except one addition.
1. Internal-traffic exclusion; `discovery_type` on `venue_offer_logs`; delete the dead partial; the three event renames; fix the ghost and missing metric in `clickDetailReport`
3. `pg_dump`, wipe, import the 30 venues

**Session 2 — catalogue.**
1. **Fix the producer leak** — `Campari Group` and `Carlsberg` are producers sitting in the brand field, and [[decisions/product/producers-stay-internal]] says no producer name is ever rendered
2. `catalogue_status` design, then build; quick-add page; permit register into candidates
3. **Standalone NA brands first** — nobody knows which bar pours Lyre's, which is where a directory adds most value

**Session 3 — SEO surface.** Unchanged, plus category-first navigation folded into the brand and product page work — people search "piwo bezalkoholowe", not "Lech Free".

**NEW, and it belongs here rather than later:** the scoring change from §5.2. Today `breadth_score` counts how many non-alcoholic positions a venue has. The evidence says that number is not what changes orders — **draught availability and position on the menu are.** Since price is out (§5.1), this is the only mechanism left that the evidence supports, so the scoring model should stop rewarding the thing that does not work.

**Session 4 — infrastructure and deploy.** Unchanged.

---

## 9. Open questions

**Carried forward from v8 and still unanswered** — none of these were superseded:

| § (v8) | Question | Recommendation |
|---|---|---|
| 15 | What is launch? | The four-item checklist, dated after the catalogue session |
| 1.6 | Three event renames and the naming rule | Yes |
| 2.4 | UTM: strip params + campaign end dates + time-series reporting | All three |
| 4.4 | Brand page model, gated on ≥1 product | Yes |
| 6 | og:image: you make the PNG | You make it |
| 8.6 | Freshness hourly + the five TO-BE items | Yes |
| 10 | Deploy checklist as specified | Yes |
| 11.3 | Ploi Basic $10 | Basic |
| 12.3 | "Katalogowanie", status model next session | Yes |
| 13.2 | `discovery_type` on `venue_offer_logs` | Yes |
| 13.3 | Windows: 30d / 90d / 12m | Yes |
| 14.3 | Turn "1–3% deferred" into a stated refusal | Yes |
| 14.4 | Record the report dispute gap | Yes |
| 8.6 (v8) | Surface or delete `freshness_streak_months` | Surface it |

**New in v9:**

| § | Question | Recommendation |
|---|---|---|
| **5.1** | **One-field price-parity flag, or price out entirely?** | **The flag — but it is a genuine call and "out entirely" is defensible** |
| 5.2 | Build the menu-position advice into the venue pitch and the scoring model | **Yes — now the main mechanism, not a bonus** |
| — | Producer-in-brand-field (`Campari Group`, `Carlsberg`): fix as a data bug now | Yes |

**Settled since v9 was drafted** (§5a): the mission takes no public position on alcohol policy; full price tracking is rejected.

---

## 10. Sources

Research document: [`research-results/does-substitution-reduce-consumption.md`](research-results/does-substitution-reduce-consumption.md). It contains full citations; the load-bearing ones are:

**Substitution** — Japanese RCT on non-alcoholic beverage provision; workplace RCT (n=278); Spanish household ARIMA (1,29 m purchases); behavioural-economic price-substitutability study; WHO 2023 NoLo brief and SAFER package; Public Health Scotland MUP evaluation; Behavioural Insights Team menu-position experiment; 14-pub draught alcohol-free crossover trial; adolescent reaction-time and cross-sectional zero-alcohol advertising studies; COM-B barriers survey.

**Standing note:** §3's evidence is the part worth re-verifying before it is relied on in a venue pitch.
