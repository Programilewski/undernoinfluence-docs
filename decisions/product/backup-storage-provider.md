# Backup Storage: Scaleway Object Storage in Paris, Locked Against the Server That Writes It

**Date:** 2026-09-17
**Status:** Decided — **supersedes Backblaze B2**, and **overrides the `pl-waw` region agreed 14.09 and 16.09**
**Executed:** partly — bucket, Project, IAM application, policy and key exist (17.09); the job, encryption, rotation, schedule and monitor are built and a restore was rehearsed on the laptop (18.09). Left: object lock with its default retention and the lifecycle rules on the bucket, the first upload from the server, and a restore from a real production archive — deploy checklist A6
**Area:** Infrastructure / Compliance

---

## Problem

Deploy-checklist A6 requires a `pg_dump` copied off the box with a rehearsed restore, and it has been carried as debt since August because everything touching real data waits on it. The destination was never neutral: a backup holds every claimant's name, email, phone and NIP, so whoever stores it becomes a processor to disclose, and whoever can delete it decides whether the backup survives the incident it exists for. Two earlier answers were on record and neither was executable — `spec.html` and `dependencies.md` said Backblaze B2, the 27.08 notes said a home server over Tailscale.

## Options considered

Backblaze B2 (US-headquartered, so a transfer question and a new processor). Hetzner Storage Box (cheaper per GB, a new DPA — paperwork to save cents). OVH object storage (same vendor as the host: one account compromise takes both). Ploi's own backups (a Pro feature, and held by the party that holds root). A home server over Tailscale into the existing restic rotation. Scaleway Object Storage in `pl-waw`, and in `fr-par`.

## Decision

Backups go to **Scaleway Object Storage, bucket `uni-backups-prod`, region `fr-par` (Paris)**, Multi-AZ, encrypted client-side before upload, with **object lock and versioning on**, on a 7-daily-plus-4-weekly rotation. Scaleway is already an Article 28 processor for this project through TEM, so this adds no new recipient, no new DPA and no new vendor-register entry — which was worth more than any price difference at a cost of cents per month. The bucket lives in a **dedicated Scaleway Project, `uni-backups`**, separate from the Project holding the mail domain and everything the running application will touch.

**On the region, which overrides the record.** `pl-waw` was agreed on 14.09 and confirmed on 16.09, for a good reason — keeping the data in the country it is about. Paris was chosen instead on a consideration the earlier record never weighed: the OVH host is in a Warsaw datacentre, so a Warsaw bucket puts the only offsite copy in the same city, grid and jurisdiction as the thing it protects, and Paris runs at 60.72 gCO2e/kwh against Warsaw's 869.2. Both regions are EU, so there is no legal difference and the "no transfer question" property is satisfied either way.

## Rules

The bucket is private, in `fr-par`, in the `uni-backups` Project, and nothing else goes in that Project. Access is through the IAM application `uni-backup-writer` holding the single permission set `ObjectStorageFullAccess` scoped to that Project alone — never Organization scope, and never "all current and future Projects", which would silently re-include the venue-photo bucket the day it is created. Venue photos, when they exist, get their own bucket in the `Undernoinfluence` Project, so that the application's S3 credentials sitting in `.env` on a public-facing web server cannot reach the backups. Archives are encrypted before upload so the provider holds ciphertext — AES-256 inside the archive since 18.09, where this first said `gpg --symmetric` (see the amendment) — and the passphrase is kept somewhere it would survive the server being gone. Object lock is on, so a compromised box cannot delete what it wrote; retention is 7 daily plus 4 weekly, and a lifecycle rule sits **above** the longest retention as a backstop, never matching the shortest. The privacy policy and vendor register name Scaleway SAS for **mail and storage**, not mail alone. And A6 is not closed by a running job — it is closed by one documented restore into an empty scratch database, never into staging, repeated quarterly.

**Amended 2026-09-18 — built, and three details settled while building.**

*Encryption is AES-256 inside the archive, not `gpg --symmetric`.* The property this record asks for — the provider holds ciphertext, the password never reaches Scaleway — is met by `spatie/laravel-backup`'s own archive encryption with no second tool in the pipeline. What makes it safe to rely on is `App\Support\BackupEncryptionGuard`: the package writes a readable archive without a word when the password is missing, so the guard opens every archive before it is copied anywhere and fails the run unless every file in it is AES-256. Two costs, stated: a restore needs `7z`, because the standard `unzip` cannot open AES archives; and ZIP's key derivation is weaker than gpg's, which matters only against a guessable password — so the password is 32 or more random characters. Chosen by Claude while building and flagged to Paweł the same day; reverting to gpg is a listener, not a redesign.

*The backup disk has its own `BACKUP_S3_*` variables.* The `AWS_*` variables `.env.example` pointed at the bucket on 17.09 are the conventional home of the application's own storage key — the one this record's Project split exists to keep away from the backups. Backups now read only `BACKUP_S3_*`, and a test asserts the backup disk never falls back to the `AWS_*` key. Production writes offsite by default, so forgetting a variable fails the run loudly rather than leaving the only copy on the server.

*The passphrase lives in two places:* Ploi's environment for the production site, so the job can encrypt, and a password manager, so a restore survives the server. The open question from 17.09 was where it lives *apart from* the server, and that is the answer; a copy on the server is not a weakness here, because anyone holding the server already holds the live database.

*Object lock needs a default retention, and the console cannot set it.* Enabling object lock does nothing on its own — objects written without a retention can still be removed for good. The default retention is one S3 API call (`PutObjectLockConfiguration`), made from the server once its environment is set. **Compliance mode, 35 days:** governance mode can be bypassed by a key with enough permissions, and the server's key has `ObjectStorageFullAccess`, so only compliance mode keeps a compromised server from destroying what it wrote. Thirty-five days covers each archive's whole life in the 7 + 4 rotation, so nothing is held longer than the rotation already intended. The rotation's own deletes still work — on a versioned bucket they add a delete marker — and a lifecycle rule removes the hidden versions once their lock lapses.

*Lifecycle rules:* expire non-current versions after 1 day (they go as soon as their lock allows), expire current versions after 45 days as the backstop above the longest retention, and abort incomplete multipart uploads after 1 day. Whether Scaleway re-evaluates a version that was still locked when it first became eligible is not stated in its documentation, so the version list is checked once, about six weeks after the first upload.

## What this prevents

It keeps the backup outside the blast radius of the thing it protects: different provider from the host, different city, different Project from the application's own credentials, and — once object lock is on — beyond the reach of the key that writes it. Backblaze would have leaned on the same EU–US transfer machinery the TEM decision was taken to avoid, and Ploi's own backups fail the only scenario that matters, because they are held by the party holding root. Encrypting before upload means a provider breach yields ciphertext rather than every claimant's contact details.

## Revisit when

Venue photos arrive and need their own bucket and their own key — the Project split is already drawn for it. Or when the VPS has a fixed IP and failure monitoring exists, at which point the API key should be pinned to that IP. Or if Scaleway changes Object Storage pricing or its EU-residency guarantee, which would reopen this the same way it would reopen the TEM choice.

See also: [[decisions/product/transactional-email-provider]] — the same provider, the same reasoning about recipients and transfers.
