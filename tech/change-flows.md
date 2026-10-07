---
version: 1.0
owner: Paweł Milewski
updated: 2026-10-06
status: living — reference
---

# What every change in the two panels sets off

Every create, edit, delete, attach and decision an admin or an owner can make, and everything that follows from it: what is written, what runs after, what is recorded, what a visitor sees change. Read out of the code on 06.10.2026, file by file; each row names where it happens so it can be checked rather than trusted.

**How to keep it true.** A commit that adds a panel action, changes what one writes, or changes a follow-up updates its row here in the same commit, the same rule `database/schema.md` carries for columns. This page covers behaviour; the schema map covers structure, including what a database delete takes with it.

**What it does not cover yet.** The public forms (the claim request on a venue page, the inaccuracy report, analytics events), the CSV importers in detail, and which test proves each row. Those are the next pass.

---

## The building blocks every flow below is made of

These are named once here and referred to by name in the tables.

### Menu follow-up

`VenueProductObserver::productAttached()` / `productDetached()` for catalogue products; `VenueDrinkObserver` does the same by itself for house drinks, because they are full records with events. The catalogue-links-change-through-one-path record requires every path that changes what a venue serves to run it.

| Step | What it does | Where |
|---|---|---|
| 1. Mark fresh | `offer_updated_at` = now; the freshness streak continues if the venue was fresh, restarts if not. Drives "Zaktualizowano X dni temu" | `Venue::markOfferFresh()` |
| 2. Offer log | One `venue_offer_logs` row: action, who (`user_id`), and the kind of knowledge (`discovery_type`): **owner_reported** if the person is an owner, else **observed_change** if the venue had log rows before today, else **initial_catalogue** | `DiscoveryType::infer()` |
| 3. Score | `breadth_score` = number of products + house drinks. Written quietly (no audit) | `VenueScoring::recalculate()` |
| 4. Gate | On an addition: `activateIfReady()`, which publishes the venue if it has coordinates, something to serve and no manual switch-off. On a removal: `deactivateIfEmpty()`, which takes it offline if nothing is left (canaries never) | `Venue` |

A house-drink **edit** runs only steps 1 and 2: the count does not change, so neither does the score or the gate.

### Venue audit

`VenueObserver` writes an `audit_logs` row on exactly four kinds of venue change, and nothing else about the venue record is recorded:

- **location**: street, number, postcode, coordinates, city, district (one row for all of them);
- **`is_verified`** switched;
- **`is_active`** switched (a null actor means the gate or the hourly check did it);
- **`plan`** changed.

### The hourly net

`uni:check-offer-freshness`: takes empty live venues offline, publishes ready offline ones, repairs `offer_updated_at` drift from the latest pivot/drink `updated_at`, clears missed streaks, recalculates scores. It exists for changes that reach the database without code, such as a deleted product. It never writes an offer log.

### Badges these flows move

The full tables (every menu operation by admin and owner, every badge, and the orderings they move) are in `badges-and-menu.md`.

- **"Zaktualizowano X dni temu"**: `offer_updated_at`. Moved by any menu change and by any "still on the menu" confirmation, by anyone.
- **"Sprawdzona karta"**: `is_verified` **and** `last_menu_check_at` within 180 days. Moved only by admin actions. It is about the whole venue, not about the rows on it.
- **"Zarządza właściciel"**: `is_claimed`.
- **"Potwierdzone X dni temu"** on drink pages: `venue_products.confirmed_at` for that one product at that venue.

---

## Admin panel

### Venues — the record (`Admin/Resources/Venues`)

| Action | What is written | What follows | Recorded |
|---|---|---|---|
| **Create** | The form's fields. Slug built from name + street if left empty. `is_active` defaults to **off** in the form | Nothing. The venue goes live only through the gate (or the hourly net) once it has a point and something on its menu | Nothing on create |
| **Edit**: name, slug, type, description, contact, admin notes, source | The field | Nothing. A changed slug breaks every old link; there is no redirect (the form warns) | **Not recorded** |
| **Edit**: address or coordinates | The fields | — | Venue audit: location |
| **Edit**: "Aktywny" toggle moved | `is_active`. Switching **off** stamps `switched_off_at`, which the gate and the hourly net then respect forever; switching **on** clears it. A toggle nobody touched is ignored, so the gate's own changes are not overwritten | Visitor sees the venue appear or disappear | Venue audit: visibility |
| **Edit**: "Znacznik weryfikacji" (`is_verified`) | The flag only. `verified_at` and `last_menu_check_at` are separate fields the admin must also set by hand | Badge appears only if `last_menu_check_at` is within 180 days | Venue audit: verification |
| **Edit**: "Ostatnie sprawdzenie karty" / "Data weryfikacji" | The dates | Renews or expires the badge | **Not recorded** |
| **Edit**: plan | `plan` | Which V2 reports the owner sees | Venue audit: plan |
| **"Oznacz jako sprawdzone"** (table row) | `last_menu_check_at` = now. One click, no confirmation, `is_verified` untouched | Renews the badge for 180 days if `is_verified` is already on; does nothing visible if it is off | **Not recorded** |
| **Geocode** (one or bulk, GUGiK / GUS / Nominatim) | Coordinates, district, `geocoded_by`, `geocoded_at` | Gate: may publish the venue | Venue audit: location |
| **Reverse geocode** | Street, number, postcode, district, city from the point | — | Venue audit: location |
| **"Usuń dane lokalu"** | Creates an already-verified erasure request, then runs the erasure (see Erasure requests) | Venue and everything under it deleted | Erasure request kept, anonymised |
| **Delete** | No delete button exists for venues; erasure is the only way out | — | — |

### Venues — products on the menu (`Venues/RelationManagers/ProductsRelationManager`)

| Action | What is written | What follows | Recorded |
|---|---|---|---|
| **"Dodaj produkt"** | Pivot row with `source_url` and `checked_at` (both required), then `confirmed_at` = now, `added_by` = **admin** | Menu follow-up (all four steps) | Offer log |
| **"Potwierdź"** (still on the menu) | `confirmed_at` = now, new `source_url` and `checked_at` | Mark fresh only | **No offer log** |
| **"Usuń"** / bulk "Usuń zaznaczone" | Pivot row deleted | Menu follow-up per product | Offer log |

### Venues — house drinks (`Venues/RelationManagers/DrinksRelationManager`)

| Action | What is written | What follows | Recorded |
|---|---|---|---|
| **Create** | Name, type, description, `source_url`, `checked_at` | Menu follow-up (by the drink's own observer) | Offer log |
| **Edit** | The fields | Steps 1–2 of the menu follow-up | Offer log `drink_updated` |
| **Delete** | Row deleted | Menu follow-up | Offer log |

### Venues — feature flags (`Venues/RelationManagers/FeatureFlagsRelationManager`)

| Action | What is written | What follows | Recorded |
|---|---|---|---|
| **"Dodaj nadpisanie"** | Feature, reason, enabled, until, notes, `enabled_by`, `enabled_at` | The owner gets or loses that V2 feature | `enabled_by` on the row only; **no audit row** |
| **Edit**, inline "enabled" toggle, **Delete** | The row | Same | **Not recorded**; the inline toggle does not update `enabled_by` |

### Catalogue: products, aliases, brands, producers, categories

| Action | What is written | What follows | Recorded |
|---|---|---|---|
| **Product create / import** | The product; `is_active` and `is_approved` default true | Has a public drink page once a live venue carries it | Not recorded |
| **Product edit**: name, brand, category, ABV fields, description | The fields | Shows on every venue carrying it at once. A category change moves the product between category listings | Not recorded |
| **Product edit**: `is_active` off | The flag | The drink page and brand page drop it (404). **The venue page still lists it, the score still counts it, and the gate still treats it as something to serve** | Not recorded |
| **Product delete** (one or bulk) | Product, its aliases and **every venue link** deleted by the database | **No menu follow-up.** The hourly net later fixes scores and takes emptied venues offline | **No offer log for any venue that carried it** |
| **Alias** create / delete | `product_aliases` row | Changes what the menu importer and resolver match | Not recorded |
| **Brand** create / edit / delete | The brand. Delete is **refused** by the database while any product uses it | Brand page | Not recorded |
| **Producer** create / edit / delete; associate / dissociate brands | The producer and the brand's `producer_id` | Internal only: producers are never public (producers-stay-internal) | Not recorded |
| **Category** create / edit / delete | The category. Delete **refused** while products or proposals use it. `is_active` / `is_visible` off hides its landing page and its filter | Category pages, discovery filters | Not recorded |

### Product proposals (`Admin/Resources/ProductProposals`)

| Action | What is written | What follows | Recorded |
|---|---|---|---|
| **"Zatwierdź"** | **A new product is always created**: no brand, ABV unknown, active and approved. It is attached to the venue with `added_by` = **proposal_approved**, `confirmed_at` = now and **no `source_url` or `checked_at`**. Proposal marked approved | Menu follow-up, recorded as **owner_reported** whoever clicks | Audit `product_proposal_approved` + offer log |
| **"Odrzuć"** | Status, reason | — | Audit `product_proposal_rejected` |
| Either | — | **The owner is not told**, by e-mail or in the panel | — |

### Venue claims (`Admin/Resources/VenueClaims`)

| Action | What is written | What follows | Recorded |
|---|---|---|---|
| **"Dodaj zgłoszenie"** (record a claim taken by phone or e-mail) | The claim | — | Audit `claim_submitted` |
| **"Potwierdź wiadomość z Instagrama"** | `channel_confirmed_via`, `channel_confirmed_at` | Approval no longer needs a written reason | Audit `claim_channel_confirmed` |
| **"Wyślij link potwierdzający"** | — | E-mail `ClaimReceived` to the contact address | Audit `claim_confirmation_link_sent` |
| **"Sprawdź NIP w rejestrach"** | `registry_lookup`, `registry_checked_at` | — | — |
| **"Zatwierdź"** | Finds or creates the user from the claim (never an admin's address); claim approved; venue `is_claimed`, `claimed_by`, `claimed_at`; user role → owner | "Zarządza właściciel" badge. E-mail `ClaimApproved`; a password link if the account is new and the panel switch is on | Audit `claim_approved` |
| **"Odrzuć"** | Status, notes | E-mail `ClaimRejected` | Audit `claim_rejected` |
| **Edit** | Any field including `venue_id` and `user_id`; status is locked | Editing an approved claim changes **nothing** on the venue | Not recorded |
| **Delete** (one or bulk) | The claim | — | Not recorded |
| Daily, 08:00 | — | Admins reminded once of claims waiting too long | Audit `claim_waiting_reminder_sent` |

### Inaccuracy reports (`Admin/Resources/VenueInaccuracyReports`)

| Action | What is written | What follows | Recorded |
|---|---|---|---|
| **"Sprawdzone"** / **"Rozwiąż"** / **"Odrzuć"** | Status, `reviewed_at`, `resolved_by`, admin notes | Nothing on the venue: a correction is made separately, by hand. The reporter is not told | `resolved_by` only; **no audit row** |
| **Edit / delete** | The report | — | Not recorded |

### Erasure requests (`Admin/Resources/VenueErasureRequests`)

| Action | What is written | What follows | Recorded |
|---|---|---|---|
| **Create / edit** | The request | — | — |
| **"Zrealizuj"** | Raw analytics events for the venue deleted, its audit rows redacted, **the venue deleted** (and with it its menu, drinks, claims, proposals, reports, stats, flags, offer logs), drink photos and proposal labels deleted from disk. If the owner asked, the account is deleted; otherwise an owner left with no venue is demoted to user. The request is kept with every personal field nulled | E-mail `VenueErasureCompleted` | The anonymised request |
| **"Odrzuć"** | Status, reason | E-mail `VenueErasureRejected` | The request |

### Users (`Admin/Resources/Users`)

| Action | What is written | What follows | Recorded |
|---|---|---|---|
| **Create** | Name, e-mail, role; a 40-character random password if left empty | — | Not recorded |
| **Edit**: role | `role` | Panel access follows the role. **A venue the user owned stays claimed by them** | **Not recorded** |
| **"Wyślij link do ustawienia hasła"** (panel switch on, owner only) | Reset token | E-mail with the owner-panel reset link | Audit `owner_password_link_sent` |
| **Delete** (one or bulk) | `UserObserver` first releases every venue they owned (`is_claimed` off), then the user goes, taking their claims, reports, imports and exports with them | "Zarządza właściciel" badge disappears | Pointers on audit, offer logs and decisions nulled |

---

## Owner panel

Reachable only when `UNI_OWNER_ACCESS` is on. An owner sees and edits only venues where `claimed_by` is them (`VenuePolicy`, and the resource's query).

### My venue — the record (`Owner/Resources/VenueResource`)

| Action | What is written | What follows | Recorded |
|---|---|---|---|
| **Edit**: description, phone, e-mail, website, Instagram | The fields | Public at once on the venue page | PostHog `venue_profile_updated`; **no audit row**: an owner can change the public phone or website with no record of the previous value |
| **"Usuń lokal i dane"** (type USUN) | A self-service erasure request, completed **immediately**, with no admin step (see Erasure requests). Optionally deletes the account and logs out | The venue disappears from UNI for good | PostHog `venue_erased_by_owner`; the anonymised request |
| Address, name, type, coordinates, flags | **Not editable** by an owner | — | — |

### My venue — products (`Owner/.../ProductsRelationManager`)

| Action | What is written | What follows | Recorded |
|---|---|---|---|
| **"Dodaj produkt"** (pick from the catalogue) | Pivot row; `confirmed_at` = now, `added_by` = **venue_owner**, **no `source_url` or `checked_at`** | Menu follow-up, as owner_reported | Offer log + PostHog `product_added_by_owner` |
| **"Usuń"** | Pivot row deleted | Menu follow-up | Offer log + PostHog `product_removed_by_owner` |
| **"Nie widzę mojego produktu"** | A pending proposal (duplicate name for the same venue refused) | Waits for an admin. Nobody is alerted | Audit `product_proposal_submitted` + PostHog `product_proposed` |

### My venue — "Świeżość oferty" (`FreshnessRelationManager`)

| Action | What is written | What follows | Recorded |
|---|---|---|---|
| **"Nadal w ofercie"** (once a day per product) | `confirmed_at` = now | Mark fresh: "Zaktualizowano dziś". The drink page says "Potwierdzone dziś" | PostHog `product_confirmed`; **no offer log** |

### My venue — house drinks (`Owner/.../DrinksRelationManager`)

| Action | What is written | What follows | Recorded |
|---|---|---|---|
| **Create** | Name, type, description. **No source, no date, and no column that says the owner added it** | Menu follow-up, as owner_reported | Offer log only |
| **Edit / delete** | The row | As for admin drinks | Offer log |

### Claim a venue (`Owner/Pages/ClaimVenue`)

Kept unreachable on purpose (admin-recorded-claims-v1): it creates a pending claim tied to the signed-in account, with no contact e-mail, no registry lookup and no channel link. Listed here so nobody mistakes it for the live path; the live path is the request form on a venue page.

---

## What looks faulty

Ranked by consequence. Each one is a description, not yet a decision. The mode of work is one problem at a time.

| # | Finding | Why it matters | Likely fix |
|---|---|---|---|
| **1** | **An owner's word looks the same as a UNI check.** Owner products and proposal products carry no source or date; owner house drinks cannot even be told apart from admin ones (`venue_drinks` has no `added_by`). "Sprawdzona karta" is decided per venue and covers every row, including those added after the check. Owner confirmations reset "Zaktualizowano" and print "Potwierdzone" on drink pages | The badge's one promise, "a person from UNI checked this card", becomes false the day an owner adds something. Backlog item 1; High before the switch is flipped | Provenance per row (add `added_by` to `venue_drinks`), "od lokalu" on owner rows, the badge dated to its check. Discussed as option B on 06.10 |
| **2** | **Demoting an owner in the user form leaves their venue claimed.** The role changes, the venue keeps `is_claimed` and `claimed_by`, the public badge stays, and nobody can log in to manage it | The exact orphan state `UserObserver` was written to prevent, through a door it does not watch. It is also the only way to take a venue from an owner short of deleting their account | A "Odbierz lokal" action on the venue (release, audited), and the role change refused or releasing too while venues are attached |
| **3** | **A retired product (`is_active` off) stays on venue pages.** The drink page 404s, but the venue page lists it, the score counts it and the gate keeps a venue live on it. Owners and admins can also still attach it | Two public pages disagree about the same drink; a venue can stay live on nothing real | Decide what "retired" means (probably: not shown, not counted, not attachable) and apply it in one scope |
| **4** | **Deleting a product writes no offer history** for the venues that carried it, and their scores stay wrong until the hourly run | The record says the offer history must have no holes, because disputes and trend reports read it | Before delete, run the menu follow-up for each venue carrying it, or refuse deletion while any venue does (retire instead) |
| **5** | **An owner's self-erasure is instant and total.** One typed word deletes the venue listing UNI built from public sources, with its menu history, and no admin sees it first | Erasing the owner's personal data and removing a public listing of a business are two different things; the first does not obviously require the second, and the second loses data UNI collected itself | Decide: should owner self-erasure release the venue (drop the owner, their data, the badge) rather than delete it? A product decision, not a code one |
| **6** | **Approving a proposal always creates a new product.** No search for an existing one, no way to link the proposal to it | Duplicates in the catalogue ("Heineken 0.0" twice), split drink pages, split counts | On approval, offer "link to an existing product" with the resolver's best matches |
| **7** | **The owner never learns what happened to a proposal.** No e-mail, and the panel does not list proposals | The owner's only way to add a missing drink is a black hole | A short list of their proposals with status in the panel; e-mail on decision |
| **8** | **"Oznacz jako sprawdzone" renews the badge in one unrecorded click**, with no confirmation and no per-product check, and does nothing at all when `is_verified` is off | The badge's renewal, the more frequent act, is the one with no trace; switching `is_verified` is audited | Make it one audited "Karta sprawdzona" action that sets `is_verified`, `verified_at` and `last_menu_check_at` together and asks for the source |
| **9** | **Admin attach marks the venue fresh "today" even when `checked_at` is in the past** | A product read from a four-month-old menu shows "Zaktualizowano dziś" | Pass `checked_at` to `markOfferFresh()` |
| **10** | **Small unrecorded changes**: owner contact edits, report status changes, feature-flag edits and the inline toggle, user role changes, slug edits, claim edits after approval | Each is the kind of question a dispute asks later ("who changed our phone number?") | Extend the venue audit with contact fields; audit the report and flag actions; lock claim fields once decided |

**Not faults, but worth knowing:** the admin "Potwierdź" and the owner "Nadal w ofercie" write no offer log (a confirmation changes nothing on the menu, so this is arguably right); `venue_products.is_available` exists and nothing reads or writes it; `venues.is_active` defaults to **true** in the database, so any future path that creates a venue outside the admin form and the importer publishes it unless it sets the flag itself.

## Open questions

| # | Question | Recommendation |
|---|---|---|
| Q1 | Should an owner's own erasure delete the venue, or release it? (finding 5) | Release by default, delete only on an admin's decision |
| Q2 | What does a retired product mean on a venue page? (finding 3) | Gone everywhere: not shown, not counted, not attachable |
| Q3 | May a product with venues on it be deleted at all? (finding 4) | No: retire it instead, and allow deletion only of unused products |
| Q4 | Does every badge renewal need a source URL, like every product does? (finding 8) | Yes, one URL for the card that was checked |

*See also: freshness-and-verification.md (the two signals in depth) · the catalogue-links-change-through-one-path, venue-activation-gate, what-the-badges-claim, actions-own-their-side-effects and admin-recorded-claims-v1 records · `database/schema.md` in the application, for what a database delete takes with it.*
