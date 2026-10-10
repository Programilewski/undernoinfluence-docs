---
description: "Crash course: Ansible as a way of thinking — desired state, idempotence, what the playbook owns on UNI's servers, and how to reason when a run fails."
version: 1.0
owner: Paweł Milewski
updated: 2026-10-10
status: teaching document — holiday series, course 7. The line-by-line companion is ansible-explained.md
---

# Course 7 — Ansible

`ansible-explained.md` (30.09) walks every file in `ansible/` line by line. It's the reference, and this course doesn't repeat it. This one is the **mental model**: the handful of ideas that let you predict what a playbook run will do, decide when to run it, and stay calm when it goes red. Read this first, then the reference if you want the details.

## 1. The one idea: you describe the end state, not the steps

A shell script says *do this, then this*. An Ansible task says **this should be true**:

```yaml
- name: Nginx is running and starts at boot
  ansible.builtin.service:
    name: nginx
    state: started
    enabled: true
```

Ansible connects to the box, **looks** at whether nginx is running and enabled, and acts only if it isn't. That's why UNI's task names are written as statements ("Listens on loopback only", "Deploy may reload PHP-FPM and nothing else"). Each is a claim about the finished server, and the run either confirms it or makes it true.

Everything else follows from that idea:

- **Idempotence.** Running the playbook twice changes nothing the second time. The runbook's test for "Phase 2 done" is literally that: **a second run ends with `changed=0`**. If a second run still reports changes, some task isn't describing a state, it's performing an action, and that's a bug in the playbook.
- **Re-running is the normal way to fix drift.** If someone (you, in a hurry) changes a config file by hand on the server, the next run puts it back. The playbook is the truth, and the server is a copy of it.
- **A run tells you what it changed.** `ok` means it was already true, `changed` means Ansible made it true, `failed` means it couldn't. Reading a run mostly comes down to asking: did anything change that I didn't expect?

## 2. The vocabulary, in one table

| Word | What it is in UNI |
|---|---|
| **Control node** | Your PC. Ansible runs *here*, not on the servers. Nothing is installed on a server for Ansible except Python |
| **Inventory** | Which machines to touch. `inventories/home` (the `uni-home` alias) and `inventories/production` (`uni-prod`). **The `-i` flag picks the server, so never omit it** |
| **Playbook** | The list of what to apply. `provision.yml` (both servers, every time) and `bootstrap.yml` (once per VPS, as OVH's first user) |
| **Role** | A folder of tasks about one thing: `base`, `tailscale`, `php`, `postgres`, `nginx`, `app`, `worker`, `tls`, `verify` |
| **Task** | One desired state, using one **module** (`apt`, `service`, `template`, `user`, …) |
| **Variables** | `group_vars/all.yml` holds what's true everywhere (PHP 8.5, paths, user names). `inventories/*/group_vars/all.yml` holds what differs (database name, TLS mode, firewall ranges, who may reach `/admin`) |
| **Template** | A config file with variables in it (`.j2`), like the nginx site and the supervisor worker. Ansible renders it per server |
| **Handler** | A task that runs only if something notified it. "Reload nginx" runs only when the nginx config actually changed |
| **Become** | Running a task with sudo. Ansible connects as `admin` and becomes root. `-K` asks you for admin's sudo password once per run |

## 3. One playbook, two servers: where the difference lives

The core design choice: **the home server and production are built by the same playbook.** Everything that differs is a variable in the inventory, never an `if production` buried in a task. Reading the two inventory files side by side shows every difference between the servers:

| | Home server | Production |
|---|---|---|
| `env_name` | `preprod` | `production` |
| Database | `preprod_uni` | `prod_uni` |
| TLS | none (Tailscale serve on the host fronts it) | certbot, for `undernoinfluence.pl` and `www.` |
| Firewall | SSH and HTTP from the Incus bridge only, no HTTPS | SSH, HTTP, HTTPS from anywhere |
| `/admin` | open (the box is only reachable over the tailnet) | only from Tailscale's address ranges, enforced by nginx |
| Tailscale on the box | no (the host has it) | yes |

That's why the home server is a meaningful rehearsal: whatever the playbook does to production, it has already done to a box built the same way. The differences are few, named and visible. **Keep it that way.** When a new difference seems necessary, add it as an inventory variable, not a special case inside a role.

## 4. What Ansible owns, and what it deliberately doesn't

The cleanest way to understand the split between the tools is to ask *who wrote this file on the server?*

**Ansible owns the house:** users and SSH rules, the firewall, packages (PHP, Postgres, nginx, supervisor, 7zip, nano), the database and its role, the nginx site, the supervisor worker, the cron line, certificates, the empty directory tree under `/var/www/undernoinfluence` with its permissions.

**Deployer owns what moves in:** the code in `releases/N`, the `current` symlink, `vendor/`, the built assets.

**Nobody's tool owns `shared/.env`.** You write it by hand on the box (runbook 3.6 / 7.5), and neither tool generates or copies it. That's deliberate: secrets never pass through the repository or the PC. The one secret Ansible creates, the database password, is **generated on the box** and kept in `/etc/uni`, readable only by root.

`ansible-explained.md` §4 has the full contract table between the two tools. The short version: they never call each other. They agree on names and paths (`deploy` user, `/var/www/undernoinfluence`, `php8.5-fpm`), and a test (`DeployRecipeKeepsTheRulesTest`) fails if the PHP version in the playbook and in `deploy.php` ever disagree.

## 5. When to run the playbook

| Situation | Run it? |
|---|---|
| A new box (the home container rebuilt, production on day one) | Yes: bootstrap (production only), then provision **twice**. The second run must be `changed=0` |
| You changed anything in `ansible/` (a package, an nginx rule, a firewall range) | Yes. On the **home server first**, then production |
| Monthly, as a drift check | Optional: run with `--check --diff` and expect nothing. Anything reported means someone changed the box by hand |
| You deployed new application code | **No.** Code is Deployer's job. The playbook knows nothing about releases |
| You changed `shared/.env` | **No.** Neither tool touches it (course 9 has what to do instead) |
| Security updates | **No.** Unattended-upgrades does that by itself (`base`, 2.6) |

The habit that matters: **never fix the server by hand when the fix belongs in the playbook.** A hand fix works until the next rebuild, then silently disappears. That's exactly the kind of surprise the 5.2 "rebuild from nothing" test exists to catch.

## 6. Commands, the few you'll actually type

```bash
cd ~/…/undernoinfluence/ansible

ansible -i inventories/home all -m ping                      # can Ansible reach the box at all?
ansible-playbook -i inventories/home provision.yml -K        # build / update the home server
ansible-playbook -i inventories/home provision.yml -K --check --diff   # say what WOULD change, change nothing
ansible-playbook -i inventories/production provision.yml -K  # the same for production, after home is green
ansible-playbook … -v / -vv / -vvv                           # more detail when something fails
ansible-playbook … --start-at-task "Nginx is running and starts at boot"   # resume from a task
```

`--check` is a dry run, and it's honest about plain states, but **tasks that depend on an earlier task's real result** (the generated database password, a certificate that doesn't exist yet) can report oddly in check mode. Read it as a hint, not proof.

## 7. Reading a failed run

A red run isn't a broken server. Ansible stops at the **first** failing task, and everything before it has already been applied correctly. The server is half-updated, but every completed task left it in a *consistent* state. Re-running after the fix carries on safely, which is idempotence paying off.

How to read one:

1. **Find the task name of the first `fatal:`.** Because UNI's task names are statements, the failure reads as a claim that couldn't be made true: "PostgreSQL is 18" failed means the box doesn't have PG 18.
2. **Read the `msg:`.** It's usually the underlying tool's own error (`apt`, `systemctl`, `nginx -t`).
3. **Ask which of the four usual causes it is:**
   - **Connection or sudo**: unreachable host, wrong key, sudo prompt timing out. The 09.10 sudo-rs timeout was this kind, solved by `ansible_become_exe: sudo.ws` in `group_vars/all.yml`. **This change is newer than `ansible-explained.md`**, which doesn't mention it yet.
   - **Package**: the repository is unreachable (the IPv6 trap the `apt_force_ipv4` variable exists for), or a version isn't available.
   - **Config validation**: nginx refusing a rendered template. The run fails *before* a broken config is applied, which is the point.
   - **A `verify` role assertion**: the box doesn't match what the app needs (PHP version, a missing extension, Postgres version, the PHP-FPM umask). These are checks written to fail loudly instead of warning. A `verify` failure means "the box is wrong in a way the app would have hit later", and that's a good failure to have.
4. **Fix in the repository, re-run.** Not on the box.

## 8. Why Ansible, and not a panel

The record (servers-are-built-and-deployed-from-the-pc-without-a-panel, 28.09) chose this over Ploi. In one sentence, the reason worth remembering: **the whole server is a text file you can read, diff, review and rebuild from.** If the VPS vanished tomorrow, the playbook plus `shared/.env` plus a backup is a new production in about an hour. A panel would have done the same building, but the knowledge of *what was built* would live in someone else's database.

The cost is that you're the operator: nobody else patches the playbook when Ubuntu changes something. Ubuntu 26.04's switch to sudo-rs (09.10) was the first time that bill arrived. Expect a few more, mostly around LTS upgrades.

## Questions to bring back

1. **Update `ansible-explained.md` for 09.10.** It predates `sudo.ws` and the `nano` package. Its own status line says it gets rewritten where it drifts. A small session after the trip?
2. **A monthly `--check --diff` against production** as a drift check: add it to the weekly/monthly routine from course 2?
3. **A rule:** "any change made on a server by hand is copied into the playbook the same day, or reverted." Worth recording, since a hand fix that later vanishes is the classic way playbook-built servers surprise their owners.
