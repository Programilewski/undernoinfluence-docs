---
topic: How to verify that the person claiming a venue's profile actually runs it — without phone calls, at ten or more requests a day
raised: 2026-09-19
status: pinned — awaiting external research
context: journals/2026-09-19.md — the phone call that verified every claim was dropped; the claim form stays behind UNI_OWNER_ACCESS until this is answered
---

# Research prompt — verifying venue owners without a phone call

*Paste the block below into a research-specialised model. Everything it needs is inside it; it does not have access to our repository.*

---

## Prompt

You are advising a solo founder on **how to verify business ownership** for **Under No Influence (UNI)**, a Polish-language directory of venues — bars, cafés, restaurants, pubs, hotels — catalogued by the quality of their **non-alcoholic drink offering**. It is pre-launch. Warsaw first, then other Polish cities. The interface and the audience are Polish.

The product exists to help somebody find a healthier option they would otherwise have missed. Venues, brands and drinks are instruments of that, not customers to be pleased. There is no paid placement.

### How the catalogue grows

About **60–70 venues** are entered by hand before launch. After that, growth comes from **organic search and Instagram**, not from sales calls: the founder will not phone venues, either to recruit them or to verify them. Owners are expected to find UNI through search, see their venue (or its absence) and ask to manage it. **The design target is ten or more owner requests a day** handled by one person, with room to grow past that.

### What an owner request is, and what approval grants

An owner fills in one form. It has two tabs: **take over a venue UNI already lists**, or **add a venue UNI does not list yet**. Either way the form asks for the person's name, role (owner, manager, employee, or representative such as an agency), e-mail, an optional phone number, and the **NIP** (Polish tax identification number) of the business that runs the venue, validated by checksum. A new-venue request also asks for the venue's name, city, street address, its website or social profile, what it serves without alcohol, and optionally a link to its menu.

A request grants nothing. An administrator reviews it and approves or rejects it. **Approval** does the following:

- A "Zarządza właściciel" ("managed by the owner") badge appears on the venue's public page, and on the map's filter for owner-managed venues.
- **Today (before the owner panel opens):** the owner is told to e-mail menu changes, which the founder applies by hand.
- **Once the owner panel opens (weeks to months away):** an account is created from the request's e-mail. It can **add and remove drinks on the venue's public page** — the thing visitors decide on — and see the venue's **visitor reports** (profile views, referral sources, comparisons with nearby venues). Those reports will later be a paid product. One login can hold several venues, for chains.

The venue record already holds some public contact details, when known: **phone, e-mail, website and Instagram handle** — taken from the venue's own public presence, not from the claimant.

### Why the current method is being replaced

Until today the plan was: the administrator **phones the claimant** on the number they gave and checks the NIP. That fails on two counts:

1. **It does not scale.** At ten requests a day, phoning each claimant is most of a working day for a solo founder whose time should go to the catalogue and to search.
2. **It proves very little.** The claimant supplies the phone number, so the call only proves they answer their own phone. A NIP is public — anyone can look one up in CEIDG, KRS or the VAT white list (Biała lista podatników VAT) — so knowing it proves nothing either. A person can impersonate an owner, invent a company, or give a real company's NIP that has nothing to do with them.

### The situations verification must handle

These are the cases the founder expects. Add any the literature shows he has missed.

- **A competitor or a grudge** claims a venue to remove its drinks, making it look worse — or harmless-looking, to add drinks it does not serve and send people to a disappointing evening.
- **Someone wants the reports**, not the listing: a competitor or an agency after another venue's visitor numbers.
- **The business name is not the venue name.** Very common in Poland: "Kowalski Gastro sp. z o.o." runs "Bar Pod Kogutem". The NIP identifies the company, not the venue, and one company may run several venues.
- **A sole trader** (jednoosobowa działalność gospodarcza), where the NIP, the business and the person are effectively one — and where the registered address is often the owner's home, not the venue.
- **A real employee or manager with no authority** to act for the business.
- **An agency** that manages several venues' social media and claims all of them.
- **A brand-new venue**, not yet on Google Maps and with a thin online presence.
- **A venue that changed hands**: the previous owner's approved account must stop working, and the new owner must be able to claim without the old one's cooperation.
- **A dispute**: a second person claims a venue that is already owned.
- **Small venues whose only web presence is Instagram or Facebook**, with a Gmail address and no website of their own.

### The questions

1. **How do comparable platforms verify business ownership, and how well does it work?** Document the actual methods — not marketing summaries — for Google Business Profile (postcard, phone or SMS, e-mail, video verification, instant verification through Search Console), Apple Business Connect, Bing Places, Yelp for Business, Tripadvisor, Facebook and Instagram business pages, Foursquare, TheFork, OpenTable, Untappd for Business, and Polish or Central European platforms where you can find documentation — for example ZnanyLekarz (which verifies doctors against a public professional register), Booksy, Pyszne.pl, Wolt and Glovo partner onboarding. For each: what is checked, what it costs the business, how long it takes, and what the platform itself admits about fraud. **Where the documentation is silent, say so rather than inferring.**

2. **Which Polish public registries can do real work here, and what can each actually prove?** Specifically KRS (board members and commercial proxies — prokurenci — are listed by name, so a claimant's name could be matched against the people authorised to act for the company), CEIDG (the sole trader's name), the VAT white list (the company's registered bank accounts), and GUS REGON through the BIR API (including registered **local units** — jednostki lokalne — with their own addresses, which might link a company to the venue's premises). For each: free or paid, API or manual, how current, what it links (person to company, company to address), and its known gaps for small hospitality businesses.

3. **Which verification methods fit this product, and what does each prove?** Evaluate at least these, and add better ones if they exist:
   - an e-mail sent to the address **the venue publishes** (on its website, Google profile or social bio), not to the address the claimant typed;
   - the claimant's e-mail being on **the venue's own website domain**;
   - a code sent as a **direct message from the venue's own Instagram or Facebook account** to UNI's account, or a code placed temporarily in the venue's **social bio or website**;
   - a **file or meta tag on the venue's website**, in the way search consoles verify a domain;
   - an automated call or SMS with a code to **the venue's public phone number** (not the claimant's), including what that costs per call and how it behaves on a landline;
   - a **postcard or letter with a code** sent to the venue's street address — cost and delivery time through Poczta Polska or an EU alternative;
   - a **small bank transfer** from the business account listed on the VAT white list, carrying a code in its title — what it would take on UNI's side to receive and match it (manually, or through a PSD2 account-information service), and whether any Polish platform does this;
   - Polish digital identity — **mObywatel, Profil Zaufany, bank-based identity (for example KIR's mojeID), a qualified electronic signature** — and whether any of these is available to a small service like this at a price it can bear, and whether proving *who the person is* helps when the question is *whether they act for the venue*;
   - **video verification** of the premises, as Google now uses.

   For each: what it proves — the **person's identity**, their **authority to act for the business**, **control of the venue's public channels**, or **presence at the premises** — how it is defeated, the owner's effort, UNI's effort per request, the cost, the time to complete, and the personal data it requires.

4. **What tiered design would you recommend?** The working hypothesis is a **risk-based ladder**: a strong signal (for example an e-mail on the venue's own domain whose owner is a KRS board member) is approved after a quick look, a weaker one needs a second signal, and a conflict goes to manual review. Is that the established pattern? Which signals should count as strong, which as supporting only, and which as worthless on their own? **Design for ten requests a day at under two minutes of human time each**, and say what changes at fifty a day.

5. **Should approval differ by what is being granted?** Displaying a badge and passing menu changes by e-mail is low-stakes. Editing what the public sees, and reading visitor reports that will later be sold, is not. Should the owner panel require a stronger check than the badge — and should an **employee or agency** get a narrower role than an owner, approved by the owner rather than by UNI, as Google Business Profile's owner and manager roles work?

6. **What should happen after approval?** How do established platforms handle re-verification, a venue changing hands, an ownership dispute (Google, for example, gives the current owner a window to respond to an ownership request), and revocation? What is the minimum a small platform needs on day one, and what can wait?

7. **What are the GDPR consequences of each method?** Data minimisation (Art. 5(1)(c)), the lawful basis, and what each method forces UNI to collect and store — for example the contents of a direct message, a bank statement line, an identity assertion. UNI keeps claim rows but empties their contact columns twelve months after a decision. **One specific question:** is collecting an optional claimant phone number justified if no verification step uses it, when its only stated purpose is contact about the request? The founder would rather keep the field than remove it and rebuild it later; say whether that position holds.

8. **How common is ownership fraud on listing platforms, and what does it look like?** Evidence on hijacked or fraudulent business listings (Google Business Profile hijacking is well documented), the tactics used, and which verification steps actually stopped them. The founder needs to size the risk, not assume the worst.

### Constraints

- **A solo founder** runs this. No support team, no call centre, and no time for calls.
- **No long contracts or fixed monthly fees** while the product is being validated. Pay-as-you-go is acceptable. **EU-resident services** are strongly preferred.
- **Privacy is a design constraint, not a checkbox.** Collecting identity documents, selfies or biometrics would need a very strong case; say so if you think one exists, and say what it would cost in obligations.
- **No automated decision should approve a claim on a single weak signal.** A wrongly approved owner changes what the public sees.
- Assume the claimant speaks Polish and the whole flow is in Polish.

### What a good answer looks like

- **A table with one row per method**: what it proves, how it is defeated, owner effort, UNI effort per request, cost, time, personal data required, and which platforms use it — with links.
- **A recommended ladder**, concretely: which signal combinations approve, which ask for more, which reject — for the badge today and for the owner panel later.
- **What to build first**, for a launch with 60–70 venues and a handful of requests a week, and **what to add at ten a day**.
- **Label every claim** as documented (with a link), observed practice, or your own reasoning. Say explicitly where you could not find documentation; silence is a finding.
- Anything the founder has not asked about but should have, flagged as such.
