---
owner: Paweł Milewski
updated: 2026-09-22
status: record — the material left the vault on 22.09.2026, step A3 of the repository migration
---

# Where the reference material went

**Third-party material is no longer in the vault, in git, or in Syncthing.** It sits at `~/uni-reference/` on the laptop and nowhere else. Paweł, 21.09: *"I dont need these anymore in repo nor syncthing. I can keep it here locally on my pc and that is sufficient."*

This page exists so that a document citing `docs/reference/…` still resolves to an answer. The path is dead; the file is not.

| Was | Now | Size | What it is |
|---|---|---|---|
| `docs/reference/research/` | `~/uni-reference/research/` | 51 MB | NIQ and IWSR market reports, saved web pages and PDFs on no- and low-alcohol consumption. Never UNI's own evidence — see the note below |
| `docs/reference/legal/` | `~/uni-reference/legal/` | 1.1 MB | Source texts of the GDPR and the ePrivacy Directive |
| `docs/reference/gus-api/` | `~/uni-reference/gus-api/` | 484 KB | Vendored GUS API documentation, cited by [[decisions/product/geocoding-comes-from-the-state-register]] |
| `docs/reference/nominatim/` | `~/uni-reference/nominatim/` | 84 KB | Nominatim usage policy and notes |
| `uni_filtered_venues.csv` / `.xlsx` | `~/uni-reference/` | 564 KB | The 2378-row OSM-derived export from the abandoned seeding approach. Kept for reference only: it is ODbL-licensed, it carries a `phone` column, and neither belongs in this project any more |

**Ten Syncthing conflict copies were deleted rather than moved** — 40.1 MB, five research files each saved twice on 25.08. Every one had its original beside it, verified byte-for-byte before deletion.

**What this means in practice.** The laptop has the material; the homeserver and the phone no longer do, and neither does any clone of either repository. Nothing in the application or in the catalogue reads any of it — it is background reading and source texts, not data.

**One standing caution, unchanged:** the market research under `research/` is venue-operator and category evidence. It does not establish anything about what UNI's visitors want, and no product decision is grounded on it — settled on 10.09.2026 and recorded in that day's journal.

*See also: [[decisions/product/research-files-out-of-the-repo]] · [[tech/repository-migration]] · [[tech/obsidian-sync]]*
