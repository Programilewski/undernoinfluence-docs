# A server fact is declared once, and every other copy is checked against it

**Date:** 2026-09-30
**Status:** Decided
**Area:** Infrastructure

---

## Problem

The PHP version was written in four places: the playbook's variables (which also write the deploy user's one sudo right), two lines of the deploy recipe, and the CI workflow. Each copy has a reason to exist, because each tool reads its own file. Nothing tied them together. Changing only the playbook would have rebuilt the servers correctly and then failed every deploy at the reload step, which runs after the site has already switched to the new release, so the failure would land at the most fragile moment of a deploy. It was found while writing the Ansible guide, not by any check.

## Options considered

Leave it, since Ubuntu 26.04 ships PHP 8.5 for its whole life. Make the deploy recipe read the playbook's file when it runs. Keep the copies and have a test compare them with one of them, named as the source.

## Decision

The playbook's variables are the source of truth for facts about the server, and every other copy is checked against them by a test that runs in CI. The copies stay, because each tool should be readable on its own, but none of them can drift without the suite going red. Proved on 30.09: setting the playbook to 8.6 turned the test red.

## Rules

When a fact about the server (a version, a user, a path) has to appear in more than one tool's file, it's declared in the playbook's variables and the other files are tested against it. That happens in the same change that introduces the second copy, not later. The test names the consequence of drift in its failure message, not just the mismatch. A copy nobody needs is removed rather than tested.

## What this prevents

A change that looks complete in the file you edited and breaks in a file you didn't open, discovered mid-deploy on production. It's the same "works because nobody changed it" failure this project keeps paying for: the missing cron line, the web server's missing file type, the empty environment value.

## Revisit when

A value becomes templated into every file from one place, for example if the deploy recipe gains a supported way to read the inventory. Then the copies disappear and the test with them.

---

*See also: [[decisions/product/servers-are-built-and-deployed-from-the-pc-without-a-panel]] · [[decisions/product/building-a-server-and-deploying-to-it-are-two-users]] · [[decisions/product/a-deploy-without-its-settings-stops]]*
