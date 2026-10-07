---
description: "What briefings are, how they are named, and the renaming table for the commute documents."
owner: Paweł Milewski
updated: 2026-10-07
status: living — reference
---

# Briefings

**A briefing is a dated document written for you to read and answer, usually on the commute.** Each one is a snapshot: it is answered, then superseded by the next, and kept for the answers written into it. None of them is a source of truth on its own; what they settle moves into decision records, the backlog (`roadmap/undone-inventory.md`) or the journals.

Four series live here:

| Series | What it is | Newest |
|---|---|---|
| `commute-*` | The commute documents, v1.0 to v13.0, 09.09 to 30.09 | `commute-2026-09-30.md` |
| `decisions-waiting-on-you*` | Question documents answered inline, v3 to v9 (v4 is the file without a number); the rule for writing the next one is in `CLAUDE.md` | `decisions-waiting-on-you-v9.md` |
| `audit-2026-08-*` | Notes and answers checked against running code, August | `audit-2026-08-27.md` |
| `next-session-*`, `new-notes.md` | One-off session briefs and reading guides | — |

**Three documents used to be in the commute sequence and are not briefings:** the standing description of what UNI is (now `product/what-uni-is.md`) and the Ansible and Deployer explainers (now `learning/ansible-explained.md` and `learning/deployer-explained.md`). They were moved on 07.10.2026; the table below still lists them under their old names so an old reference can be traced.

## The commute documents, and how they are named

**Every commute file is named for the day it was written, not the day it was meant to be read.** Several documents a day are `_2`, `_3` and so on, in the order they were written. Settled on 21.09.2026 (D13) and applied to the whole folder on 22.09.2026 — before that, a document was named for the morning it would be read on, which works until the calendar catches up and two documents want the same filename.

Each renamed file carries a `renamed:` line in its frontmatter saying what it used to be called, so an old link or an old journal sentence can still be traced.

| File | Version | Written | Was called | For the commute of |
|---|---|---|---|---|
| `commute-2026-09-09.md` | v1.0 | 09.09 | `commute-2026-09-10.md` | 10.09 |
| `commute-2026-09-10.md` | v1.1 | 10.09 | `commute-2026-09-11.md` | 11.09 |
| `commute-2026-09-12.md` | v1.8 | 12.09, revised 13.09 | `commute-2026-09-14.md` | 14.09 |
| `commute-2026-09-14.md` | v2.0 | 14.09, evening | `commute-2026-09-15.md` | 15.09 |
| `commute-2026-09-16.md` | v3.0 | 16.09 | — | 16.09 |
| `commute-2026-09-16_2.md` | v4.0 | 16.09 | `commute-2026-09-17.md` | 17.09 |
| `commute-2026-09-16_3.md` | v5.0 | 16.09 | `commute-2026-09-18.md` | 18.09 |
| `commute-2026-09-16_4.md` | v6.0 | 16.09, 17:12 | `commute-2026-09-19.md` | 19.09 |
| `commute-2026-09-16_5.md` | v7.0 | 16.09, 19:36 | `commute-2026-09-20.md` | 20.09 |
| `commute-2026-09-16_6.md` | v8.0 | 16.09, 21:16 | `commute-2026-09-21.md`, then `_2` | 21.09 |
| `commute-2026-09-16_7.md` | v9.0 | 16.09, 21:36 | `commute-2026-09-22.md`, then `_3` | 22.09 |
| `commute-2026-09-20.md` | v10.0 | 20.09 | `commute-2026-09-20_2.md` | 21.09 |
| `commute-2026-09-21.md` | v11.0 | 21.09 | — | 22.09 |
| `commute-2026-09-25.md` | v12.0 | 25.09 | — | 26.09 |
| `commute-2026-09-25_2.md` | v1.0 (own track) | 25.09 | — | any — a standing description of what UNI is, not part of the commute sequence |
| `commute-2026-09-30.md` | v13.0 | 30.09 | — | 30.09 |
| `commute-2026-09-30_2.md` | v1.0 (own track) | 30.09 | — | any — Ansible explained, every file in `ansible/` line by line |
| `commute-2026-09-30_3.md` | v1.0 (own track) | 30.09 | — | any — Deployer and CI explained, `deploy.php` line by line |

**Seven of the thirteen were written on 16.09** — one per session of that day, each answering the one before it. That is why the `_2` … `_7` run exists and why the old names spread across six different days in the filename.

**The version number, the write date and the filename now all sort the same way.** The last file in the folder is the newest thinking, which is the only property this convention has to have.
