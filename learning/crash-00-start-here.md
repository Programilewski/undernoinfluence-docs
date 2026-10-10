---
description: "Holiday reading, 10–16.10.2026: six crash courses on what launch needs next. Start here."
version: 1.0
owner: Paweł Milewski
updated: 2026-10-10
status: teaching documents — written for the 10–16.10 trip, from the code and records as they stood on 10.10
---

# Crash courses for the trip — start here

These documents cover what you are about to need, and none of the existing learning docs already teaches it. The app itself is covered (00–07, Ansible and Deployer explained). What is missing is everything that starts **the day the site is public**: how Google treats a brand-new domain, what to do when the live server misbehaves, how Postgres behaves under real data, what the privacy policy must contain, how to read numbers that are still tiny, and which accounts could end UNI if someone else took them over. Courses 7–9 come back to Ansible and Deployer from a different angle: the line-by-line docs explain every file, and these explain the model behind them and the cycle they form together.

I picked these by looking at the Launch bucket in `roadmap/undone-inventory.md` and asking where you will have to make decisions alone, quickly, with no time to research. Every course is tied to UNI's real code and records, so the examples are your pages, your tables and your commands, not generic ones.

None of these needs a laptop. Nothing in them asks you to run anything while you are away.

## Reading order

| # | Course | Why now | Reading time |
|---|---|---|---|
| 1 | [SEO for a brand-new site](crash-01-seo-for-a-new-site.md) | The reason V1 launches early is the SEO clock. Search Console is a Launch row | ~45 min |
| 2 | [Running the live server](crash-02-running-the-live-server.md) | The runbook builds the box; nothing yet says what to do on day 40 when it breaks | ~50 min |
| 3 | [PostgreSQL survival](crash-03-postgresql-survival.md) | The first migration against real venues, the first restore, a table that grows forever | ~40 min |
| 4 | [GDPR for writing the privacy policy](crash-04-gdpr-for-the-privacy-policy.md) | The privacy policy and DPAs are a Launch row, written from the app | ~45 min |
| 5 | [Measuring with small numbers](crash-05-measuring-with-small-numbers.md) | The first 12 weeks will produce numbers too small to trust naively | ~30 min |
| 6 | [The keys to UNI](crash-06-the-keys-to-uni.md) | You are travelling with devices that can reach production | ~25 min |
| 7 | [Ansible](crash-07-ansible.md) | The mental model behind the playbook: desired state, what it owns, when to run it, reading a red run | ~30 min |
| 8 | [Deployer](crash-08-deployer.md) | Why a deploy is shaped as it is, what each guard prevents, failures by where they stop, rollback's limits | ~30 min |
| 9 | [The deployment cycle](crash-09-the-deployment-cycle.md) | The whole loop from PC to production, and its variants: hotfix, migration, `.env`, server, dependencies, new box | ~35 min |

Read 6 first if you have a spare ten minutes before boarding. It is the one with something to check while you are away.

Total is about five and a half hours. 7–9 were added the same day; read them in order, and read 7 and 8 before 9. Each course ends with **"Questions to bring back"**: things I could not decide for you, written so they can go straight into the next session. Mark them up in Obsidian as you read; when you are back, the first session can start from your annotations instead of from a fresh briefing.

## How these are written

- **A course teaches, it does not decide.** Where a course touches a decided record, it says so and does not reopen it. Where it found something worth reconsidering, it puts it in the questions at the end, and does not argue for it in the middle of the explanation.
- **Facts about the code are as of 10.10** (`main` at "A server's one db:seed writes reference data, and nothing invented on production"). If the code moves, the course drifts. They are teaching docs, not specs.
- **Facts about the outside world are as I knew them in mid-2026.** Google's behaviour, Polish law and vendor terms change. Where something is worth checking against the source before you act on it, the course says so.
- **This is not legal advice**, course 4 especially. It is enough to write a competent first draft and to know which questions to ask.
