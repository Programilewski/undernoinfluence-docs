When it comes to features in backend, see what is not exposed publicly but is supposed to. 

We remove the white mode. So the black mode stays, there is not toggle for
Reasoning: it introduces technical debt, each new component needs more maintenance. Second issue is it blurs the brand identity.


Analytics event naming convention 
For example `venue_instagram_clicked`
Instead of that maybe something like venue_socials_clicked - w parametrach dać np type:Instagram, that gives us flexibility and reduces the quantity of the events. 

In table venue_stats there is:
instagram_clicks column 
Seems hard coded, what if it changes, is removed or other socials are added. 

We got city landing pages 
/{citySlug} with district listing and venue counts
Check if the cities with no venues return the correct SEO-optimized status code and page 

Same with district pages and others SEO routes 


## We also got verified badge (binary)
**Two separate signals since 15.08.** "Sprawdzona karta" = `is_verified` set manually by an admin, and it expires with `last_menu_check_at` after `uni.verification_valid_days` (180). "Zarządza właściciel" = `is_claimed`, set by `ApproveVenueClaimAction`. Neither depends on the other, and neither depends on freshness.

Admin toggle works as intended since the admin will make sure it's correct and the admin has the right intentions, problem is with the status toggled by owner actions. Currently I think there is no such mechanism. In the future it's supposed to be automatic. Like if the admin updated the offer within a month, the is_verified toggles automatically, but not just when the owner claims the venue. 

We might have to write down entire flow of is_verified, how it's set, what it does and why. 


## owner account creation 
Admin-created only. No public registration and no public claim form exist. An admin verifies the owner out of band (NIP, role, phone), records the claim, then approves it as a separate audited step. See ../decisions/product/admin-recorded-claims-v1.md.

Note: maybe introduce a form for owners to send the data in structured form like name, NIP, confirmation? Or is that a compliance/legal issue?
On the other hand of we encourage sending request via email, we process such data anyway.

## events for b2b

We currently gather them but have not considered whether these are fit for the actual reports for the owners. Maybe introduce a set of reports needed in the future and see if we got enough events for it all.


If we got plans for b2b, we will need the history since it's a paid service so that we actually can see it if there are problems, someone request the history etc.