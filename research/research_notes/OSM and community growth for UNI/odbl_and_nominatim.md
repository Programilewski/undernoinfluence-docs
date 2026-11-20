---
description: Clause-cited research notes on what ODbL 1.0, the OSMF guidelines and the Nominatim policy permit for UNI, the non-ODbL alternatives, and which venue columns could be OSM-derived (30.10.2026).
---

# ODbL, OSMF guidelines and geocoding: what UNI may do with OSM data

Researched 30.10.2026. This is not legal advice. The ODbL is the binding text. The OSMF Community Guidelines are the licensor's non-binding interpretation: the OSMF itself says what a licensor says "carries weight" but "A court would make a final decision on the issue" ([OSMF Community Guidelines](https://osmfoundation.org/wiki/Licence/Community_Guidelines)). Scenario verdicts are my reading unless they are quoted.

## 1. What does the ODbL text actually trigger, and is the `osm-dropped` reading right?

### Takeaway
The `osm-dropped` sentence is wrong on its central claim: a Produced Work is expressly not share-alike (s.4.5b). Its practical worry is partly right, though. Merging OSM and own rows of the same data type does expose the own rows, and a public website does not escape this, because a publicly used Produced Work from a Derivative Database makes that database publicly used (s.4.4c) and triggers the offer in s.4.6.

### Cited Findings
All quotes in this list are from the [ODbL 1.0 text](https://opendatacommons.org/licenses/odbl/1-0/), downloaded 30.10.2026.

- Commercial use is granted: "These rights explicitly include commercial use, and do not exclude any field of endeavour" (s.3.1).
- Derivative Database: "a database based upon the Database, and includes any translation, adaptation, arrangement, modification, or any other alteration of the Database or of a Substantial part of the Contents. This includes, but is not limited to, Extracting or Re-utilising the whole or a Substantial part of the Contents in a new Database" (s.1).
- Collective Database: "this Database in unmodified form as part of a collection of independent databases in themselves that together are assembled into a collective whole. A work that constitutes a Collective Database will not be considered a Derivative Database" (s.1).
- Produced Work: "a work (such as an image, audiovisual material, text, or sounds) resulting from using the whole or a Substantial part of the Contents (via a search or other query) from this Database, a Derivative Database, or this Database as part of a Collective Database" (s.1).
- Publicly: "to Persons other than You or under Your control" by more than 50% ownership or power to direct activities (s.1).
- Substantial: "substantial in terms of quantity or quality or a combination of both. The repeated and systematic Extraction or Re-utilisation of insubstantial parts of the Contents may amount to the Extraction or Re-utilisation of a Substantial part" (s.1).
- Convey excludes network interaction: "Conveying does not include interaction with a user through a computer network, or creating and Using a Produced Work, where no transfer of a copy of the Database or a Derivative Database occurs" (s.1). This narrows s.4.2 only. It does not narrow "Publicly Use" in s.4.4 or s.4.6.
- s.4.3: "if you Publicly Use a Produced Work, You must include a notice associated with the Produced Work reasonably calculated to make any Person that uses, views, accesses, interacts with, or is otherwise exposed to the Produced Work aware that Content was obtained from the Database".
- s.4.4a: "Any Derivative Database that You Publicly Use must be only under the terms of: i. This License; ii. A later version of this License similar in spirit to this License; or iii. A compatible license."
- s.4.4b: "Extraction or Re-utilisation of the whole or a Substantial part of the Contents into a new database is a Derivative Database and must comply with Section 4.4."
- s.4.4c: "A Derivative Database is Publicly Used and so must comply with Section 4.4. if a Produced Work created from the Derivative Database is Publicly Used."
- s.4.4d: "You must not add Contents to Derivative Databases under Section 4.4 a that are incompatible with the rights granted under this License."
- s.4.5: "a. ... You are not required to license Collective Databases under this License if You incorporate this Database or a Derivative Database in the collection, but this License still applies to this Database or a Derivative Database as a part of the Collective Database; b. Using this Database, a Derivative Database, or this Database as part of a Collective Database to create a Produced Work does not create a Derivative Database for purposes of Section 4.4; and c. Use of a Derivative Database internally within an organisation is not to the public".
- s.4.6, what must be offered: "If You Publicly Use a Derivative Database or a Produced Work from a Derivative Database, You must also offer to recipients of the Derivative Database or Produced Work a copy in a machine readable form of: a. The entire Derivative Database; or b. A file containing all of the alterations made to the Database or the method of making the alterations to the Database (such as an algorithm), including any additional Contents, that make up all the differences between the Database and the Derivative Database." Cost: "no more than a reasonable production cost for physical distributions and free of charge if distributed over the internet."
- s.4.7a bars terms or technical measures that restrict licence rights. s.4.7c allows a password or similar access control only if it does not restrict those rights. s.4.8: the licensor offers each recipient a licence directly on the same terms, and "You may not sublicense".
- Breach: s.9.1 "automatically terminates this License with immediate effect and without notice". s.9.4 reinstates rights after the breach ceases (provisionally until day 60, permanently after that, unless otherwise reasonably notified). s.10.4: governed by the law of the jurisdiction where enforcement is sought. "License" is defined as both a licence of rights and "an agreement in contract" (s.1).
- OSMF's own summary: for a Produced Work, "you must upon request offer recipients either a copy of your data and any Derivative Databases under the terms of the ODbL or the means of creating the Derivative Databases". If OSM data is unchanged, "you can simply refer users back to openstreetmap.org", and Collective Database share-alike "will not apply to any other data" ([OSMF Licence FAQ, s.1.7](https://osmfoundation.org/wiki/Licence/Licence_and_Legal_FAQ)).
- OSMF says contributing back is not compulsory: "you do not have to, as long as you comply with the above" ([OSMF Licence FAQ, s.1.7.1](https://osmfoundation.org/wiki/Licence/Licence_and_Legal_FAQ)).
- UNI's claim under test, verbatim: ODbL "requires that any 'produced work' derived from the database remain openly licensed, and the share-alike clause would taint venue records that mixed OSM fields with proprietary enrichment data" (local record, osm-dropped, 01.06.2026).

### Inferences
- Claim 1 of the record ("produced work... remain openly licensed") contradicts s.4.5b. The page can stay closed and proprietary. Closed source code is never in question, because the licence covers the database and not software.
- Claim 2 ("taint mixed records") is true only for a Derivative Database. It is false for a Collective Database under s.4.5a. Which of the two applies is a design choice, as the scenario table in section 3 shows.
- Option 2 of the record treats the collective route as an "exemption" argument. It is a defined term in the licence with a board-endorsed guideline behind it. The record's "untested in Polish courts" is fair: I found no Polish case.
- The record's reason for permitting Nominatim (service calls "are not 'produced works'") reaches a defensible result on the wrong ground. The OSMF considered and rejected the Produced Work reading for geocoding. Results are permitted as insubstantial extracts (section 5).
- s.4.5c (internal use) protects a private worklist, but not a public venue page generated from a Derivative Database (s.4.4c).
- The obligation is an offer to recipients. In practice that means a free download link usable by any visitor, under ODbL, carrying the licence notice. Nobody has to request it first for the offer to be standing. The FAQ's "upon request" and the text's "offer" do not differ in substance, but a standing link is the safe form.

### Gaps
- I found no court decision interpreting Derivative versus Collective Database for POI data, in Poland or elsewhere.

## 2. What are the OSMF guidelines and what is their status?

### Takeaway
All are board-endorsed except for a labelling inconsistency on Trivial Transformations. All are non-binding interpretation, apply to OSM data only, and speak for the OSMF rather than for individual contributors.

### Cited Findings
| Guideline | Status and date | The point that matters for UNI |
|---|---|---|
| [Collective Database](https://osmfoundation.org/wiki/Licence/Community_Guidelines/Collective_Database_Guideline_Guideline) | Endorsed 2016-06-17 | Independent if "the data used for a particular data type is either all OSM or all non-OSM within the same regional cut" |
| [Horizontal Map Layers](https://osmfoundation.org/wiki/Licence/Community_Guidelines/Horizontal_Map_Layers_-_Guideline) | Endorsed 2014-06-06 | Feature Type rule, with restaurants as its worked example |
| [Regional Cuts](https://osmfoundation.org/wiki/Licence/Community_Guidelines/Regional_Cuts_-_Guideline) | Endorsed 2014-06-06 | "The Regional Cut is at least a country", no holes, smaller areas "an ongoing matter of discussion" |
| [Substantial](https://osmfoundation.org/wiki/Licence/Community_Guidelines/Substantial_-_Guideline) | Endorsed 2014-06-06 | "village map OK, town map not OK" |
| [Produced Work](https://osmfoundation.org/wiki/Licence/Community_Guidelines/Produced_Work_-_Guideline) | Endorsed 2014-06-06 | "If the published result of your project is intended for the extraction of the original data, then it is a database and not a Produced Work" |
| [Geocoding](https://osmfoundation.org/wiki/Licence/Community_Guidelines/Geocoding_-_Guideline) | Endorsed 2017-08-24 | "Individual Geocoding Results are insubstantial database extracts" |
| [Attribution](https://osmfoundation.org/wiki/Licence/Attribution_Guidelines) | Adopted 2021-06-25 | "Attribution must be to 'OpenStreetMap'"; "If the two texts disagree, the legal text takes precedence" |
| [Trivial Transformations](https://osmfoundation.org/wiki/Licence/Community_Guidelines/Trivial_Transformations_-_Guideline) | **Conflict** | See below |

- Trivial Transformations conflict: the guideline page has no status line and still says "This is at the proposal stage in our process - it may change after discussion" ([page](https://osmfoundation.org/wiki/Licence/Community_Guidelines/Trivial_Transformations_-_Guideline), last edited 31 July 2016). The [OSMF index](https://osmfoundation.org/wiki/Licence/Community_Guidelines) lists it among guidelines "endorsed by the OSMF board", and the [OSM wiki list](https://wiki.openstreetmap.org/wiki/Open_Data_License/Community_Guidelines) dates that endorsement to 2014-06-06.
- Its content: format changes, loading into a database and filtered extracts add nothing to share "provided that no other source of data is involved". Also, "adding or correcting data would not ever be considered 'trivial'" ([Trivial Transformations](https://osmfoundation.org/wiki/Licence/Community_Guidelines/Trivial_Transformations_-_Guideline)).
- Substantial thresholds, valid only "provided that the extraction is one-off and not repeated over time for the same or a similar project": "Less than 100 Features"; more than 100 "only if the extraction is non-systematic and clearly based on your own qualitative criteria"; features for an area of up to 1,000 inhabitants. "The systematic extraction of all eating places within an area... would be considered to be systematic." "we regard repeated small extractions as one big extraction!" A restaurant with its attributes is "just one Feature" ([Substantial](https://osmfoundation.org/wiki/Licence/Community_Guidelines/Substantial_-_Guideline)).
- Later guidance loosely calls the 100 features a "safe harbor" under which extraction is "always permissible" ([Geocoding FAQ](https://osmfoundation.org/wiki/Licence/Community_Guidelines/Geocoding_-_Guideline)). The Substantial guideline's own wording keeps the one-off condition, so the stricter wording is the safe reading.
- The guidelines "apply only to OpenStreetMap data", the licensor is the OSMF "and not individual contributors", and "no contributor is obliged to agree" ([OSM wiki, Community Guidelines](https://wiki.openstreetmap.org/wiki/Open_Data_License/Community_Guidelines)).
- The Collective guideline adds: "This does not imply... that the situations described are the only ways in which data can be combined without invoking share-alike" ([Collective Database](https://osmfoundation.org/wiki/Licence/Community_Guidelines/Collective_Database_Guideline_Guideline)).
- Attribution form: "© OpenStreetMap contributors" or "© OpenStreetMap" are acceptable; on interactive maps the credit "should typically appear in a corner of the map"; "Geocoders that use OpenStreetMap data must credit OpenStreetMap" ([Attribution Guidelines](https://osmfoundation.org/wiki/Licence/Attribution_Guidelines)).

### Inferences
- The 100-feature rule cannot carry a venue product. A launch city is a "town map", and adding 90 more venues next quarter counts together with the first 90. A hand-picked set with stated qualitative criteria is the only route past 100, and "mapping bars in a city" reads as systematic.
- The country minimum means UNI cannot use OSM venues for Łódź and its own for Warsaw and claim a regional cut. Within Poland it is one choice per data type.

### Gaps
- The formal status of Trivial Transformations can only be settled by asking legal-questions@osmfoundation.org, the address the [FAQ](https://osmfoundation.org/wiki/Licence/Licence_and_Legal_FAQ) gives. Note its warning that volunteers "may not be able to respond to you quickly".

## 3. How do the guidelines treat each UNI scenario?

### Takeaway
The dividing line is per data type, nationwide, all or nothing. Reference by `osm_id` is explicitly acceptable, and gap-filling is the trap: any "OSM plus the venues OSM lacks" design makes the own venue rows share-alike. Proprietary menu data stays separable in every scenario as long as no menu value comes from OSM.

### Cited Findings
Governing rules:
- A collective outcome holds when "the non-OSM and OSM datasets do not reference each other"; or non-OSM data "completely replaces a particular type of geometry or data for a primary feature within a regional cut"; or it "adds a particular type of geometry or data for a primary feature that was not already present within a regional cut, and the added feature data includes no OSM data"; or "a non-OSM database replaces or adds a property of a primary feature, and uses either all OSM data or no OSM data for that property of that primary feature within the same regional cut (e.g., the URL property of the amenity=cafe primary feature...)"; or a combination ([Collective Database](https://osmfoundation.org/wiki/Licence/Community_Guidelines/Collective_Database_Guideline_Guideline)).
- Reference: "by a database key or any other method of identifying a specific OSM or non-OSM element that may be used with a database join"; joining for a production database is "equivalent to a reference"; data sets "need not be physically separated"; "Primary feature" excludes properties "(e.g. colour, brand, operator, or width)" ([same](https://osmfoundation.org/wiki/Licence/Community_Guidelines/Collective_Database_Guideline_Guideline)).
- Positive example, almost UNI's own shape: "This data is linked to OSM data by references... All the restaurant phone numbers for the regional cut are provided by you... Your phone numbers are not subject to share-alike" ([same](https://osmfoundation.org/wiki/Licence/Community_Guidelines/Collective_Database_Guideline_Guideline)).
- Negative example: "You have a proprietary list of restaurants for a country. You would like to complement your list with the corresponding data from OpenStreetMap removing any duplicate objects in the process. The resulting, combined database would not be covered by this guideline and you would, if the dataset is publicly used, have to consider that your proprietary data may be subject to the ODbL share-alike terms" ([same](https://osmfoundation.org/wiki/Licence/Community_Guidelines/Collective_Database_Guideline_Guideline)).
- Feature Type rule: "if all data for that Feature Type is from non-OpenStreetMap sources, then the ODbl share-alike conditions do not apply to that Feature Type". And: "if there are restaurants in the OpenStreetMap layer and you add additional restaurants in another layer, but you include only those restaurants not present in the OpenStreetMap layer... the restaurants added in your non-OpenStreetMap layer must be shared" ([Horizontal Layers](https://osmfoundation.org/wiki/Licence/Community_Guidelines/Horizontal_Map_Layers_-_Guideline)).
- Must-share examples: "If you improve data used in the OpenStreetMap layer, such as additions or factual corrections, then you need to share those improvements"; "You add restaurants in one area from non-OpenStreetMap data based on comparison with OpenStreetMap data in other layers" ([same](https://osmfoundation.org/wiki/Licence/Community_Guidelines/Horizontal_Map_Layers_-_Guideline)).
- Safe example: "You use OpenStreetMap as a base topographical map and make your best reasonable efforts to exclude ALL restaurants. You then add a layer of your own restaurant data" ([same](https://osmfoundation.org/wiki/Licence/Community_Guidelines/Horizontal_Map_Layers_-_Guideline)).
- Verification, the OSMF's clearest statement: "Yes, provided that you are only comparing and do not copy any OpenStreetMap data. If you make any changes to your data after making the comparison, you should be able to reasonably demonstrate that any such change was made either from your own physical observation or comes from a non-OpenStreetMap source accessed directly by you. I.e you can compare but not take!" ([OSMF Licence FAQ, s.4](https://osmfoundation.org/wiki/Licence/Licence_and_Legal_FAQ)).
- Community views on matching lists are split and non-authoritative. One participant argued a secondary list without OSM data is not a Derivative Database ([legal-talk, Dec 2019](https://lists.openstreetmap.org/pipermail/legal-talk/2019-December/008811.html)); others argued such a list contains transformed OSM data or turned the question on substantiality ([thread](https://lists.openstreetmap.org/pipermail/legal-talk/2019-December/008815.html), [thread](https://lists.openstreetmap.org/pipermail/legal-talk/2019-December/008817.html)). A 2016 start-up question about saving OSM POI IDs is a question and not a ruling ([legal-talk, June 2016](https://lists.openstreetmap.org/pipermail/legal-talk/2016-June/008444.html)).
- Local fact: UNI's own launch list has this history. `uni_filtered_venues.csv` (2378 rows per an internal journal) is OSM-derived, carrying address, phone, amenity type and `osm_id`, and the 60-70 launch venues were drawn from it (local records: geocoding-comes-from-the-state-register; journals of 27.08 and 16-21.09.2026). `venues` already has `address_source_url`, and `venue_products` and `venue_drinks` have `source_url` and `checked_at` (`database/schema.md`).

### Inferences
Verdicts are my reading. "Safe" means covered by guideline text, not guaranteed by a court.

| Scenario | Verdict | Why, and what would be released |
|---|---|---|
| Venue row seeded from an OSM node, separate proprietary menu table keyed by `osm_id` | **Menu: safe. Venue table: ODbL.** | The menu is the guideline's phone-number example: a property added by reference with no OSM values. A city-wide seed is a systematic extract, so the venue table is share-alike once public (s.4.4b, s.4.4c). Unaltered, it needs only attribution and a pointer to OSM (Trivial Transformations). Altered, the alterations go out too. |
| Row with name and address from OSM, coordinates from OSM | **ODbL for the row** | A plain extract. The relaxed "names, addresses, lat/long" collection rule applies only to Geocoding Results (section 5), not to a downloaded extract. |
| Name and address from OSM, coordinates all from GUGiK | **Coordinates arguably safe, row still ODbL** | Bullet 2 or 4 covers the coordinates only if every venue's coordinate comes from non-OSM. One OSM point in Poland ends the all-or-none. Name and address are still extracted. |
| User and owner corrections on top of OSM values | **Must be released** | Horizontal Layers names "factual corrections", and Trivial Transformations says correcting is never trivial. s.4.6b includes "additional Contents". s.4.4d also means the terms for submissions must grant rights compatible with ODbL. |
| Own venues added to OSM venues, only those OSM lacks | **Own venues also ODbL** | The guideline's negative example and the Horizontal restaurant example. This is the real trap: UNI would want exactly this, because OSM coverage is incomplete. |
| Dedup or matching only, nothing from OSM kept | **Safe** | FAQ s.4, "compare but not take". |
| Dedup with `osm_id` stored on own rows | **Probably safe, not settled** | The Collective guideline accepts keys as references. The Geocoding guideline treats identifiers as "names". No text addresses this case directly and a thread left it open. Keep it off public output, and do not use the join to pull OSM fields. |
| OSM candidates, each re-verified from the venue's own site, nothing copied | **Grey, defensible, not covered** | Output rows contain no OSM content, and FAQ s.4 supports source-backed values. However, FAQ s.4 addresses verifying "my own data", not discovery. Horizontal says adding restaurants "based on comparison with" OSM must be shared. A cautious reader could treat a whole-area candidate list as Extraction shaping the selection. Risk falls if: `osm_id` is not stored; every field has a logged non-OSM URL; the candidate pool also draws on non-OSM sources; selection follows UNI's qualitative test (does this venue serve a real non-alcoholic option), not "every bar in OSM". |
| Geocoding own addresses, storing coordinates | **Safe** | The guideline's "Geocoding store locations" example (section 5). |

- Is the menu table separable? Yes, on every row above, if it holds only UNI-sourced values. The guideline's "data type" is per primary feature and per property, so "the drinks served" is its own property. It must be all non-OSM across Poland, and this is the one condition to protect. OSM's own tags on a venue, of whatever key, must never fill a UNI menu field.
- POIs get no special rule. They are primary features like any other, and restaurants are the worked example in two guidelines, which makes this one of the clearest applications of them. A `pub`/`restaurant` split might in theory make separate data types, since the guideline works per primary feature, but UNI's `venue_type` is its own classification, and I would not build on that.
- The negative example says proprietary data "may be subject" to share-alike. That is softer than "is", but no safer in planning terms.
- Live exposure to check: launch venues selected from an OSM export fit the grey row. They do not fit a clean-room row. Coordinates were kept out by the 12.09 decision, and the record says name and address were researched, but whether each launch row's name, address and phone can be demonstrated as non-OSM is a data question for the founder. The source URL columns are the evidence the FAQ asks for, and any null `address_source_url` on an imported row is the place to look.

### Gaps
- No OSMF text addresses "OSM as a discovery list, then independent verification". An email to legal-questions@osmfoundation.org could get a volunteer opinion; the FAQ warns it is not legal advice.
- I did not verify whether OSM's current tagging holds drink-specific keys that could overlap UNI's menu properties.

## 4. Can a mixed database be monetised, and what does publishing just the OSM layer cost?

### Takeaway
Yes. Share-alike reaches the Derivative Database and not a collective neighbour, commercial use is explicit, and nothing stops UNI selling placement, or the proprietary layer. Publishing a venue identity layer would give a competitor names, addresses and coordinates, largely commodity data already in OSM. It would not give the catalogue of what each venue pours.

### Cited Findings
- s.3.1 explicit commercial use; s.4.5a Collective Databases need not be licensed under ODbL but the licence "still applies... as a part of the Collective Database" ([ODbL](https://opendatacommons.org/licenses/odbl/1-0/)).
- "This data you can license under any terms you like" for other data in a Collective Database ([OSMF Licence FAQ, s.1.7.1](https://osmfoundation.org/wiki/Licence/Licence_and_Legal_FAQ)).
- The released part cannot be fenced: s.4.7a bars restrictive terms or technical measures; s.4.8 gives recipients a direct licence ([ODbL](https://opendatacommons.org/licenses/odbl/1-0/)).
- Structural precedent: Overture publishes Base, Buildings, Divisions and Transportation under ODbL and Places under per-provider permissive licences ([Overture attribution](https://docs.overturemaps.org/attribution/)).
- Local fact: `venues.is_canary` marks two decoys used to detect copying; `plan` (`free`, `basic`, `pro`, `premium`) and `breadth_score` sit on the same table (`database/schema.md`).

### Inferences
**Which UNI columns could be OSM-derived, and what would then be released.** This assumes the worst realistic design: OSM seeds the venue identity in Poland.

| Group | Columns | If OSM-seeded |
|---|---|---|
| Direct OSM attributes | `venues.name`, `street_name`, `street_number`, `postal_code`, `latitude`, `longitude`, `phone`, `email`, `website_url`, `venue_type`, `city_id` and `district_id` (as resolved values) | **Release under ODbL, including every later correction.** Instagram is also a possible OSM tag: treat `instagram_handle` the same way if filled from OSM. |
| Values derived purely from those | `slug` | Algorithmic, so likely trivial, but it identifies the row, so include it |
| UNI-sourced properties, all non-OSM across Poland | `venue_products.*`, `venue_drinks.*`, `products.*`, `categories.*`, `venues.breadth_score`, `description` (if written by UNI), `is_verified`, `verified_at`, `last_menu_check_at`, `offer_updated_at`, `source_url`, `checked_at` | **Stay closed**, reference by key. Reference is explicitly allowed. |
| Operational or private | `claimed_by`, `claimed_at`, `is_claimed`, `plan`, `admin_notes`, `is_active`, `switched_off_at`, `is_canary`, `source`, `geocoded_by`, `geocoded_at`, user tables, events, stats | **Stay closed.** Not altered OSM data. |
| Must not be contaminated | `venue_products`, `venue_drinks`, and any column filled partly from OSM | A single partial fill breaks that column's all-or-none and pulls it into the release set |

- Offer form: a machine-readable file, free over the internet, of either the whole derivative layer or a diff, carrying the ODbL notice, plus a visible credit near the map or data.
- If the design stays as it is today, with all fields from non-OSM sources, the answer is **nothing to release**, and the OSM tile credit on the map is the only duty.
- Competitive cost: a released layer lets anyone reuse UNI's verified addresses and corrections, legally and without credit to UNI beyond ODbL's notices. It does not reveal which venue serves what. The core asset as `osm-dropped` describes it, "the enriched data", is mostly in the closed tables, so calling the whole database exposed overstates the risk. The real loss is narrower: UNI loses exclusivity on its list of which venues are worth listing, if the released layer contains only UNI's selected venues. That list is itself a signal about who serves non-alcoholic options, so a released layer should be judged on that, not on the addresses alone.
- Canaries lose their purpose in any released layer. Rights in that layer would belong to every recipient, so decoys would prove nothing there.

### Gaps
- Whether released-layer selection really reveals commercially useful information depends on how a competitor would use it. No evidence either way.

## 5. What do the Geocoding guideline and the Nominatim public policy permit?

### Takeaway
Licence and service policy are separate questions. Under the licence, geocoding UNI's own addresses and storing the points is explicitly safe. The public Nominatim server allows small admin-triggered and one-off use, and bans systematic work, and a recurring pipeline should run elsewhere.

### Cited Findings
- Conditions: if "no modifications (or only trivial transformations) have been made to the OSM database used by a Geocoder" and "the Geocoding Results are not used to create a new database that contains the whole or a substantial part of the original OSM database", share-alike is not triggered ([Geocoding guideline](https://osmfoundation.org/wiki/Licence/Community_Guidelines/Geocoding_-_Guideline), endorsed 2017-08-24).
- Storage: results "may be stored and used together with other proprietary or third party data without having a share-alike impact on such other data, provided the Geocoding Results have not been aggregated to create a new database that contains the whole or a substantial part of the OSM database" ([same](https://osmfoundation.org/wiki/Licence/Community_Guidelines/Geocoding_-_Guideline)).
- Collections: "not a substantial extract" provided "1. only names, addresses, and/or latitude/longitude information are included... and 2. the collection is not a systematic attempt to aggregate all or substantially all Primary Features of a given type... within a geographic area city-sized or larger". A collection "used as a general purpose geodatabase" counts as systematic ([same](https://osmfoundation.org/wiki/Licence/Community_Guidelines/Geocoding_-_Guideline)).
- Store example: the vendor credits OSM; "The Geocoded Results added to the store location database are not subject to the share-alike requirements, and the store location database records themselves need not include attribution to OpenStreetMap" ([same](https://osmfoundation.org/wiki/Licence/Community_Guidelines/Geocoding_-_Guideline)).
- Mixed-fallback example: OSM results "can be stored together with the non-OSM-based Geocoding Results with no impact on the non-OSM-based Geocoding results", so long as the aggregate does not hold a substantial part of OSM ([same](https://osmfoundation.org/wiki/Licence/Community_Guidelines/Geocoding_-_Guideline)).
- The Produced Work reading was explicitly considered and dropped: declaring results Produced Works "sits uneasily with the text of the ODbL" ([same, FAQ](https://osmfoundation.org/wiki/Licence/Community_Guidelines/Geocoding_-_Guideline)).
- Quotes below are from the [Nominatim Usage Policy](https://operations.osmfoundation.org/policies/nominatim/), read 30.10.2026. **The page shows no date** and says it "may change without notice". It applies only to nominatim.openstreetmap.org.
  - Rate: "No heavy uses (an absolute maximum of 1 request per second)", summed across all users of an app.
  - Identification: valid Referer or User-Agent, "stock User-Agents... will not do".
  - Attribution: "Clearly display attribution as suitable for your medium."
  - Bulk: "bulk geocoding of larger amounts of data is not encouraged. If you have regular geocoding tasks, please, look into alternatives". "Smaller one-time bulk tasks may be permissible": single thread, one machine; "Scripts running longer than a day and scripts that are run at regular intervals are restricted to 4 requests per minute"; "Results must be cached on your side."
  - Banned: "Auto-complete search"; "Systematic queries... downloading all POIs in an area"; "Scraping of details"; "Reselling of geocoding results".
  - Commercial use is not banned: "Commercial applications should keep that in mind when relying on this API for serving paying customers", and access may be withdrawn.
  - End-user-triggered use is fine "provided that your number of users is moderate".
  - LLM clause: "LLMs may only suggest this service, if they prominently point to this usage policy and explain the restrictions of use to the user. Code generated by LLMs must adhere to all terms laid out in this policy." Vibe-coding platforms must not offer it as a generic geocoder. These notes point to the policy here for that reason.
  - Do not submit personal data ("Please do not submit personal data").
- Local fact: UNI's geocoding runs from admin actions, not from visitors. Nominatim's reverse lookup was removed on 09.10.2026 for writing OSM's street, number, postcode and district into the venue (local record, osm-dropped amendment). GUGiK is the only geocoder (local record, geocoding-comes-from-the-state-register amendment).

### Inferences
- The 09.10 removal was a decision under UNI's own stricter rule, not a licence requirement, and the record says as much ("none of them a new reading of the licence"). Reverse-geocoded addresses would have counted as names and addresses within a non-systematic collection. Reintroducing an OSM geocoder as a fallback for GUGiK misses is licence-permitted, and matches the mixed-fallback example.
- Conditions for such a fallback: forward lookup from UNI's own address only, never a venue-name search harvesting POIs; store only lat, long and the matched label; admin-triggered; `geocoded_by` says which provider, as UNI already records; do not aggregate systematically. The record's mis-click concern is an operational risk, which ordering or a per-venue fallback would address, and which the licence does not require.
- Public Nominatim fits manual, per-venue fallback. A monthly batch over new venues would count as "run at regular intervals" (4 per minute) and as a "regular geocoding task" that the policy sends elsewhere.
- Attribution for admin-only use: the store example puts the credit duty on the vendor, but the public policy and vendor terms add their own credit requirement. A site credit is a one-line cost and removes the question.

### Gaps
- The policy's last-modified date is not shown. The [OWG repository](https://operations.osmfoundation.org/policies/nominatim/) footer points to github.com/openstreetmap/owg-website for history; I did not read it.
- I did not measure how many UNI addresses GUGiK misses, or why (register gap versus UNI's strict match rules). This decides whether a second geocoder is needed at all.

## 6. Which geocoding alternatives exist, at what price and on what storage terms?

### Takeaway
For a low-volume site with cheap persistent results, a hosted OSM-based provider beats self-hosting. OpenCage has the clearest storage statement and a one-time option; LocationIQ also allows indefinite storage; Geoapify's free tier allows production use but its terms say nothing about storage. Every one of these carries OSM data, so Geocoding guideline limits still apply.

### Cited Findings
Prices read 30.10.2026 and may change.

| Option | Price | Commercial on free tier | Storing results | Attribution |
|---|---|---|---|---|
| [OpenCage](https://opencagedata.com/pricing) | Trial 2,500/day (testing only). X-Small zł205/mo, 10,000/day. One-time plans exist (prices not listed; usable up to a year) | No, testing only | Results may be stored permanently, even after leaving (paraphrase by the fetch tool, not an exact quote; confirm before relying) | [Credits page](https://opencagedata.com/credits) cites the OSMF view "that geocoding does not trigger the share-alike obligations of the ODbL" |
| [LocationIQ](https://locationiq.com/pricing) | Free 5,000/day at 2/s. Developer $100/mo, 25,000/day | Yes, with a "Search by LocationIQ.com" link | Response data indefinitely; request-response pairs 48 hours on free, while active on paid. The page draws this distinction, so read the terms | Link on free plan |
| [Geoapify](https://www.geoapify.com/pricing/) | Free 3,000 credits/day; API 10 $59/mo. Simple geocode generally 1 credit; batch up to 50% less | Yes, per pricing page | [Terms v5, 2 Feb 2024](https://www.geoapify.com/terms-and-conditions/) silent | OSM always; Geoapify on free |
| [MapTiler](https://www.maptiler.com/cloud/pricing/) | Free, or Flex $30/mo with 3k search sessions, overage $2.50 per 1k | No ("personal, or non-commercial") | Page silent | Not checked |
| [Stadia Maps](https://stadiamaps.com/pricing/) | Free 200k credits; Starter $20; Standard $80. Geocode 20 credits | No | [Stadia's own page](https://stadiamaps.com/learn/best-geocoding-api/): temporary on all plans, permanent needs Standard or above, citing ToS s.8. I did not read the ToS. | Not checked |
| [Self-hosted Nominatim](https://nominatim.org/release-docs/latest/admin/Installation/) | Server cost only | n/a | Own instance, so no service-policy limits; ODbL guideline still applies | Credit OSM |
| [Photon](https://github.com/komoot/photon) | Server cost only. Apache 2.0 code, OSM data via Nominatim. Weekly country dumps by GraphHopper; has search-as-you-type | n/a | Same as above | Credit OSM |

- Nominatim hardware: "A minimum of 2GB of RAM is required"; planet: 1TB storage and 128GB RAM strongly recommended; no extract figures given ([Nominatim docs](https://nominatim.org/release-docs/latest/admin/Installation/)). The Poland extract is 2.0 GB, data to 2026-10-28 ([Geofabrik](https://download.geofabrik.de/europe/poland.html)). Docs warn some extracts are not cut exactly at borders and so may miss admin areas ([Nominatim import docs](https://git.openstreetmap.org/nominatim.git/blob/57ca1e0cf6133506920fadc0eb5a0ee3d1ed5b91:/docs/admin/Import-and-Update.md)).
- Photon: planet about 95 GB, 64 GB RAM recommended, less works with a heap setting such as `-Xmx8G`; Java 21+ ([Photon README](https://github.com/komoot/photon)).
- Pelias: the [requirements page](https://github.com/pelias/documentation/blob/master/requirements.md) mentions only Libpostal's roughly 4 GB of data. I did not get region-size or source-licence figures.

### Inferences
- A self-hosted Poland instance is feasible on a modest box, but no published figure confirms this, so run a test import before committing. Running one purely as a fallback contradicts the record's no-recurring-spend position for V1.
- If the fallback is only for occasional misses, a free or one-time hosted option, or per-venue public Nominatim within its policy, covers it. Volumes this low never reach paid-tier need.
- Vendors enhancing OSM carry their own Derivative Database duty; per the guideline "share-alike obligations would not apply to the individual Geocoding Results themselves" ([Geocoding guideline](https://osmfoundation.org/wiki/Licence/Community_Guidelines/Geocoding_-_Guideline)).

### Gaps
- OpenCage, LocationIQ and Stadia storage statements come from pricing or marketing pages, partly through a summarising tool. Their contract terms should be read before signing.
- Pelias hardware for a Poland extract and a current licence summary were not found.

## 7. Which non-ODbL data sources exist, with what catches, and what are the GUGiK terms?

### Takeaway
Overture Places and Foursquare OS Places are licence-clean alternatives to OSM POIs, usable as candidate pools, with weak quality signals and no Poland measurements. This makes the record's "revisit if a non-ODbL source with Polish coverage emerges" trigger arguably already met, pending a coverage test. Overture's non-Places themes are ODbL, and its Polish addresses come from the same register as GUGiK, so they will not fix misses.

### Cited Findings
- Places licensing is per provider: Meta, Microsoft, PinMeTo, Krick, RenderSEO, DAC, BrightQuery, Birdeye, Uberall, OpenTravel under CDLA Permissive 2.0; Foursquare under Apache 2.0 with NOTICE; AllThePlaces under CC0 ([Overture attribution](https://docs.overturemaps.org/attribution/); page shows "last updated" May 2026 alongside October 2026 access dates).
- Base, Buildings, Divisions and Transportation are ODbL ([same](https://docs.overturemaps.org/attribution/)).
- The Places theme "contains no OpenStreetMap data" per a summary of Overture's guide. October 2026 counts: Meta 60,299,571; BrightQuery 15,771,907; Microsoft 5,883,421; Foursquare 3,757,439 ([Overture Places guide](https://docs.overturemaps.org/guides/places/)).
- Overture warns: "Joining data with a CDLA Permissive 2.0 license to OSM is permitted but the resulting data may need to carry the Open Database License (ODbL) if it is a derivative database" ([same](https://docs.overturemaps.org/guides/places/)).
- Quality per Overture's own guide, as summarised: global coverage claimed, country-level measurements not yet published, duplicates, a high junk rate and low property completeness. Confidence measures existence only and is not calibrated across providers. The `categories` property was removed in the September 2026 release in favour of `taxonomy` and `basic_category`. Monthly release ([same](https://docs.overturemaps.org/guides/places/)).
- CDLA Permissive 2.0: may "use, modify, and share the Data" if you make "available the text of this agreement with the shared Data" (s.2.1); "does not impose any restriction or obligations with respect to the use, modification, or sharing of Results" (s.3.1); provided "AS IS", no warranty including "TITLE, NON-INFRINGEMENT" (s.4.1) ([CDLA text, SPDX copy](https://raw.githubusercontent.com/spdx/license-list-data/main/text/CDLA-Permissive-2.0.txt)).
- Polish addresses in Overture: "Poland data from Polish Law on Geodesy and Cartography... No conditions to access and use. Distributed by OpenAddresses. Accessed: 2026-10-15" ([Overture attribution](https://docs.overturemaps.org/attribution/)).
- Foursquare OS Places: Apache 2.0; "Copyright 2024 Foursquare Labs"; delivered via the Places Portal with an access token and Iceberg, also Hugging Face and Snowflake; docs last updated 2026-03-31 ([Foursquare docs](https://docs.foursquare.com/data-products/docs/access-fsq-os-places)). Gated on Hugging Face with contact details ([Hugging Face](https://huggingface.co/datasets/foursquare/fsq-os-places)); Foursquare asks for a NOTICE file when distributing ([Foursquare docs](https://docs.foursquare.com/data-products/docs/fsq-places-open-source)).
- A hobbyist sample of 100 global restaurants found 72 of the OSM ones and 60 of the Overture ones in Google Maps ([OSM forum](https://community.openstreetmap.org/t/a-global-comparison-of-restaurants-in-openstreetmap-and-overture-places/120475/2)). Small sample, not Poland, and dated.
- GUGiK PRG: "Dane PRG są dostępne bezpłatnie i do dowolnego wykorzystania" ([Geoportal PRG page](https://www.geoportal.gov.pl/en/dane/panstwowy-rejestr-granic)). Address-data delays from municipal uploads were reported in a [2017 paper](https://yadda.icm.edu.pl/baztech/element/bwmeta1.element.baztech-045369cd-e512-415b-8ba4-2810c4761263/c/izdebski_kursa_wykorzystanie_165_2017.pdf).
- A POI vendor's data can itself carry OSM: Geolytica's data was found to contain OSM tags and values ([LWG minutes 2023-10-16](https://osmfoundation.org/wiki/Licensing_Working_Group/Minutes/2023-10-16)).

### Inferences
- Overture Places or Foursquare could serve as the candidate pool, which removes the OSM discovery question in section 3 entirely. UNI's per-venue verification rule still stands, and it fits sources with these error rates.
- Catches: take only the Places theme, never Divisions for district data; do not join to OSM; publish the licence text and NOTICE only if UNI shares rows of that data (s.2.1). A venue page built after independent verification holds UNI's own findings, not that data. Provider data is "AS IS", so a licence does not guarantee a clean origin, and Geolytica shows why that matters.
- Overture's Polish addresses are PRG redistributed, so they are the wrong tool for GUGiK misses. Overture Places records do carry their own addresses, whose quality is unknown.
- The PRG sentence is a website statement and not a licence document. It is short and clear, but it is the only explicit grant I found.

### Gaps
- **No Poland-specific coverage or accuracy figure exists** for Overture or Foursquare in anything I found. A simple test would settle it: count Warsaw records against UNI's known venues.
- The legal text behind the PRG statement was not located; art. 40a Prawo geodezyjne, as found, states a general fee rule with listed exemptions, and I could not confirm the provision that frees address points ([Standardy Prawa](https://standardyprawa.pl/akt/93/art/15856)). I found no separate terms for the UUG service itself. The ULDK cadastre service's terms were not checked.
- Foursquare country coverage is not stated in its docs.

## 8. Does EU and Polish database law matter here?

### Takeaway
Yes, in both directions, but modestly. UNI's own curated database likely qualifies for protection if the investment is substantial; a released ODbL layer gives up that protection in practice. Scraping one venue's own menu is low-risk under database law, while systematically pulling from a delivery platform or aggregator is where this right and contracts bite.

### Cited Findings
- Definition: a collection "wymagający istotnego, co do jakości lub ilości, nakładu inwestycyjnego w celu sporządzenia, weryfikacji lub prezentacji jego zawartości" (art. 2 ust. 1 pkt 1, [ustawa o ochronie baz danych, t.j. Dz.U. 2021 poz. 386](https://eli.gov.pl/eli/DU/2021/386/ogl/pol/pdf)).
- Right: "wyłączne i zbywalne prawo pobierania danych i wtórnego ich wykorzystania w całości lub w istotnej części, co do jakości lub ilości" (art. 6 ust. 1, [same](https://eli.gov.pl/eli/DU/2021/386/ogl/pol/pdf)).
- Insubstantial parts of a public database may be taken for any purpose, and contrary contract terms are void (art. 7 ust. 1 and 4). "Nie jest dozwolone powtarzające się i systematyczne pobieranie lub wtórne wykorzystanie sprzeczne z normalnym korzystaniem" (art. 8 ust. 2, [same](https://eli.gov.pl/eli/DU/2021/386/ogl/pol/pdf)).
- Term: 15 years, and a substantial new investment restarts it (art. 10). Remedies include twice, or if culpable three times, the appropriate fee (art. 11 ust. 1 pkt 3 lit. b, [same](https://eli.gov.pl/eli/DU/2021/386/ogl/pol/pdf)).
- A 2024 amendment added text and data mining provisions (art. 8a), allowing reproduction for mining unless reserved by the right-holder ([Standardy Prawa, art. 8a](https://standardyprawa.pl/akt/143/art/59596); [Dz.U. 2024 poz. 1769](https://eli.gov.pl/eli/DU/2024/1769/ogl/pol/pdf)). I read this through a search summary only.
- CJEU C-762/19 CV-Online Latvia (3 June 2021): a search engine copying and indexing a freely accessible database can extract and re-utilise, and the maker may prohibit this where it adversely affects the investment, tested by risk to recovery of that investment through normal operation. Read via [commentary in IIC](https://link.springer.com/article/10.1007/s40319-021-01099-x), not the judgment.
- CJEU C-30/14 Ryanair v PR Aviation: where a database has neither copyright nor sui generis protection, its owner may restrict use by contract ([IPKat](https://ipkitten.blogspot.com/2015/01/breaking-cjeu-says-that-owner-of-online.html); [Kluwer Copyright Blog](https://legalblogs.wolterskluwer.com/copyright-blog/ryanair-ltd-v-pr-aviation-bv-contracts-rights-and-users-in-a-low-cost-database-law/)).
- The ODbL itself builds on the Database Directive's terms: Extraction, Re-utilisation and Substantial (s.1, [ODbL](https://opendatacommons.org/licenses/odbl/1-0/)).

### Inferences
- UNI's closed layer: verification effort is an investment in "weryfikacja", which helps on qualification, and art. 8 ust. 2 reaches systematic scrapers of UNI. Canaries serve as evidence here. Enforcement against a released ODbL layer is effectively unavailable (s.4.7, s.4.8).
- A venue's own menu page: a single small venue's list is unlikely to be a protected database, and one venue's data is at most a small part. The copyright position in a menu's wording and photos is a separate issue, and I did not research it.
- Aggregators and delivery platforms: UNI's record lists delivery platforms among research sources. Systematic extraction there is the higher-risk case on both counts: the right itself where the platform has invested, and contract terms under Ryanair if it has not. Manual, per-venue fact-checking is at the lowest end, an automated crawler at the highest.
- Breach of ODbL: s.9.1 ends the licence, so continued use could be infringement as well as breach of contract, and art. 11's multiplied fee could then be argued in Poland. Whether the OSMF would qualify as producer is uncertain; I did not research this, and the OSMF's recent "move to the EU" discussion was redacted from its minutes ([LWG 2025-07-14](https://osmfoundation.org/wiki/Licensing_Working_Group/Minutes/2025-07-14)).

### Gaps
- CV-Online, Ryanair and art. 8a were read through secondary sources; the official CJEU pages did not load through my tools. Paragraph-level citation still needs the primary text.
- Polish court decisions applying art. 8 ust. 2 to scraping were not researched.

## 9. Which commercial precedents and enforcement actions exist?

### Takeaway
Enforcement is real but light: volunteers, letters, escalation to platforms. Most cases concern attribution. I found no court judgment on POI share-alike, and no well-documented closed venue product relying on the Collective guideline for OSM POIs. Light enforcement should not be read as permission: any contributor can complain, a business customer can notice, and it is the contamination cases that cost a company its clients.

### Cited Findings
- **Geolytica (2023):** a customer found a POI product "full of OSM data". TomTom identified it from OSM tags. "They've taken OSM data from the scraped data offered to Tom Tom. The removal was quick." "Not clear if OSM data has been removed from data offered to other Geolytica customers" ([LWG 2023-10-16](https://osmfoundation.org/wiki/Licensing_Working_Group/Minutes/2023-10-16); [LWG 2023-11-13](https://osmfoundation.org/wiki/Licensing_Working_Group/Minutes/2023-11-13)).
- **Dopper (2025):** a water-bottle brand allegedly imported 130,000+ water tap POIs into Google Maps, detected by identical coordinates ("even when the water tap doesn't exist anymore"). The LWG sent a letter citing attribution and share-alike, got no substantive reply, and planned to contact Google Maps' counsel ([LWG 2025-07-14](https://osmfoundation.org/wiki/Licensing_Working_Group/Minutes/2025-07-14); [LWG 2025-09-08](https://osmfoundation.org/wiki/Licensing_Working_Group/Minutes/2025-09-08)). I found no reported outcome.
- **Organic Maps / Maps.me (2025):** a complaint about blending OSM with non-OSM POIs. LWG members noted "The underlying database used to make the wmw files is a collective database", and that "They cannot slap another licence on top of ODbL and not disclose the original OSM data". The suggested step was to ask for ODbL disclosure ([LWG 2025-09-08](https://osmfoundation.org/wiki/Licensing_Working_Group/Minutes/2025-09-08)). Minutes of discussion, not a ruling.
- **EVRI (2026):** missing attribution on a parcel-shop map. The next step, if unresolved, was "formal process to request app store removal" ([LWG 2026-02-09](https://osmfoundation.org/wiki/Licensing_Working_Group/Minutes/2026-02-09); [LWG search summary](https://osmfoundation.org/wiki/Licensing_Working_Group/Minutes/2026-01-12)).
- A case "in Germany where they settled in court" is mentioned in passing, without detail ([LWG 2023-10-16 action items](https://osmfoundation.org/wiki/Licensing_Working_Group/Minutes/2023-10-16)).
- The LWG describes limited capacity: "we lack the capacity to deal with all cases" (2023, via [search summary of minutes](https://osmfoundation.org/wiki/Licensing_Working_Group/Minutes/2023-04-03); wording not confirmed against the page). A mapper's diary criticises the OSMF's reliance on a template "love letter", and a commenter there disputes its legal claims ([OSM diary, 2024](https://api.openstreetmap.org/user/laznik/diary/404381)).
- Commercial use at scale without opening the proprietary layer, at the level of published structure: Overture's split ([Overture attribution](https://docs.overturemaps.org/attribution/)).
- A vendor blog on closed SaaS and ODbL exists, but it cites no sources and its publisher sells related products ([Makuhari Development](https://the-homepage.pages.dev/posts/2026-01-17-osm-odbl-compliance-analysis-saas)). I do not rely on it.

### Inferences
- **Detection is mechanical.** Geolytica was caught by tags and Dopper by identical coordinates. Any UNI point copied from OSM could be spotted the same way, which supports the record's concern about OSM coordinates and also shows why `geocoded_by` provenance is useful in a dispute.
- Realistic UNI exposure from a small breach: a letter, followed by removal or publication, with s.9.4's cure path available. The record's word "existential" overstates this, and a planned ODbL layer carries no such exposure at all. The commercial risk is losing a B2B counterparty's trust, as in Geolytica's case with TomTom, and that matters only if UNI sells data, which is not its model.
- Precedents for the design UNI might want, a closed product keyed to OSM with a private attribute layer, match the guideline's text but are not documented as named company examples that I could verify.

### Gaps
- No named closed venue product publicly documenting its reliance on the Collective guideline was found. Claims about Foursquare and Mapbox using OSM concerned base maps or were old and unverified, so I left them out.
- Outcomes of Dopper and the German settlement are not available in what I read.
