---
description: "Deployer from the beginning, and deploy.php line by line."
version: 1.0 (own track — a teaching document, not part of the commute sequence)
owner: Paweł Milewski
updated: 2026-09-30
status: standing explanation — what Deployer is, how a release reaches a server, and `deploy.php` walked through line by line, including the built-in steps it borrows from Deployer's own Laravel recipe (read in Deployer 8.0.5's source, not from its documentation). Read from the application repository's `main` on 30.09.2026. Its companion is [`commute-2026-09-30_2.md`](ansible-explained.md), on Ansible, and §4 there is the contract between the two. When `deploy.php` changes, this document is rewritten where it drifted rather than appended to.
---

# Deployer, from the beginning — and what it does in UNI

**One sentence:** Deployer is a PHP program on your PC that logs into a server over SSH and puts a specific version of your application into a **new folder** next to the old ones, prepares it completely, and only then switches a single link, `current`, to point at it.

**Its job in UNI:** getting a **tag** (`v0.1.5`, `v0.1.6`, …) onto a server that Ansible has already built, safely enough that a failure at any step leaves the site running the previous version. **Not** installing PHP or nginx, which is Ansible's job ([`_2`](ansible-explained.md)).

| § | What is in it |
|---|---|
| [[#1. The ideas you need\|§1]] | Releases, `current`, shared, atomic switch, recipe, task, host |
| [[#2. What a server looks like after three deploys\|§2]] | The folder tree, explained |
| [[#3. One deploy, step by step\|§3]] | All 17 steps of `dep deploy`, in order, with what each one does and why |
| [[#4. `deploy.php`, line by line\|§4]] | The long one |
| [[#5. Rollback\|§5]] | What it does, what it deliberately doesn't |
| [[#6. CI — the gate in front of Deployer\|§6]] | The workflow file, line by line |
| [[#7. Commands you will actually type\|§7]] | With what each option does |
| [[#8. What is done in UNI, and what is not\|§8]] | Status as of 30.09 |
| [[#9. When a deploy fails\|§9]] | What state it leaves, and what to do |

---

## 1. The ideas you need

**The old way, and what's wrong with it.** Until now the home server was updated with `git pull` inside the live folder. For the seconds between the pull and `composer install` finishing, the site runs new code against old packages. If `composer install` fails halfway, it stays broken. There's no "previous version" to go back to except by pulling again.

**Releases.** Deployer never changes the folder the site is running from. Each deploy creates `releases/1`, `releases/2`, `releases/3`… (just numbers, counted up from `.dep/latest_release`). The new release gets the code, the packages, the assets and the cached config, **while the old one keeps serving visitors**.

**`current` — the atomic switch.** `current` is a symbolic link, a signpost that says "the site is over there". nginx serves `current/public`, supervisor runs `current/artisan queue:work`, cron runs `cd current && php artisan schedule:run`. Deploying means **re-pointing that one signpost**. Changing where a link points is a single operation in Linux (`ln -nfs`), so a visitor gets either the old release or the new one, never half of each. That's what "atomic" and "zero-downtime" mean here.

**Shared.** Some things have to survive from release to release: `.env` (the secrets) and `storage/` (logs, sessions, uploaded files, the backup folder). They live once in `shared/`, and each release gets **links** pointing there. So `releases/3/.env` is really `shared/.env`.

**Recipe.** A PHP file of ready-made tasks. `require 'recipe/laravel.php'` brings in Deployer's Laravel recipe: tasks like `deploy:prepare`, `artisan:migrate` and `deploy:symlink`. **`deploy.php` is UNI's recipe.** It keeps some of those tasks, replaces one, and adds eight of its own.

**Task.** A named step, a PHP function. Inside it, `run('…')` executes a command **on the server** and `runLocally('…')` executes one **on your PC**. Keeping those two apart is most of what reading `deploy.php` means.

**Host.** A server Deployer knows about. UNI has two: `homeserver` and `production`. Unlike Ansible, both are in the same file, so **the host name on the command line is what picks the server**: `dep deploy production`.

**`{{placeholders}}`.** Inside strings, `{{deploy_path}}`, `{{release_path}}` and so on are replaced with configuration values when the command runs. `{{release_path}}` is the new release being built. `{{current_path}}` is the live one.

---

## 2. What a server looks like after three deploys

```
/var/www/undernoinfluence/              ← deploy_path; Ansible created it (deploy:www-data, setgid)
├── .dep/                               ← Deployer's own bookkeeping
│   ├── latest_release                  "3" — the next release will be 4
│   ├── releases_log                    one JSON line per deploy: when, who, which release
│   └── deploy.lock                     exists only DURING a deploy; stops two running at once
├── current -> releases/3               ← THE switch. nginx, supervisor and cron all go through it
├── releases/
│   ├── 1/                              ← older release, kept so rollback has somewhere to go
│   ├── 2/
│   └── 3/                              ← live
│       ├── REVISION                    the commit hash this release was built from
│       ├── .env -> ../../shared/.env
│       ├── storage -> ../../shared/storage
│       ├── vendor/                     composer install --no-dev, on the server, per release
│       ├── public/build/               Vite output — built on your PC, uploaded
│       ├── public/vendor/maplibre-gl/  the map library — built on your PC, uploaded
│       └── bootstrap/cache/            config/route/view caches for THIS release only
└── shared/
    ├── .env                            written by hand, once; never by Ansible or Deployer
    └── storage/                        logs, sessions, cache files, uploads, backups
```

`keep_releases` is 5, so the sixth deploy deletes the oldest. A release is roughly the size of `vendor/` plus the code, so five is a few hundred MB.

---

## 3. One deploy, step by step

`dep deploy homeserver --tag=v0.1.5` runs this list, top to bottom. **If any step fails, everything after it is skipped**, `deploy:unlock` runs (the `after('deploy:failed', …)` line), and `current` still points at the old release. The site never notices.

| # | Task | Where it runs | What it does | Why UNI needs it |
|---|---|---|---|---|
| 1 | `uni:guard:tag` | PC (+ home server, for production) | refuses unless the tag is pushed, unmoved, CI-green; on production, also the tag the home server runs | a release is a tag that passed the tests and was rehearsed |
| 2 | `uni:assets:build` | PC | clean checkout of the tag → `composer install` → `npm ci && npm run build` → one tarball | assets built once, identically, never on the server |
| 3 | `deploy:info` | — | prints what's being deployed where | — |
| 4 | `deploy:setup` | server | makes sure `.dep/`, `releases/`, `shared/` exist; refuses if `current` is a real folder | first-deploy safety |
| 5 | `deploy:lock` | server | writes `.dep/deploy.lock`, or stops if it already exists | two deploys at once would collide |
| 6 | `deploy:release` | server | creates `releases/N`, temporarily linked as `release` | the new folder |
| 7 | `deploy:update_code` | PC → server | `git archive` of the tag **on the PC**, uploads it, unpacks it, writes `REVISION` | no server holds a GitHub key |
| 8 | `deploy:env` | server | **UNI's version**: stops if `shared/.env` is missing, or its key is empty | Deployer's own version would copy `.env.example` into place |
| 9 | `deploy:shared` | server | links `.env` and `storage/` from `shared/` into the release | secrets and data survive releases |
| 10 | `deploy:writable` | server | lets `www-data` write `bootstrap/cache` | Laravel writes its caches there |
| 11 | `deploy:vendors` | server | `composer install --no-dev --optimize-autoloader` in the release | packages for exactly this lock file |
| 12 | `uni:assets:upload` | PC → server | uploads the tarball from step 2 and unpacks it into `public/` | — |
| 13 | `uni:guard:assets` | server | refuses unless the Vite manifest, the MapLibre module and Filament's assets exist, and `public/hot` doesn't | a missing asset is a blank page that still answers 200 |
| 14 | `uni:key` | server | only with `--first-deploy` and an empty key: `artisan key:generate` | the key is born on the box |
| 15 | `artisan:storage:link` | server | `public/storage` → `storage/app/public` | uploaded images |
| 16 | `uni:backup:before-migrate` | server | production only: if migrations are pending, `backup:run --only-db` first | the backup is the real undo of a migration |
| 17 | `artisan:migrate` | server | `migrate --force` | **runs while the old release is still live** (see below) |
| 18 | `artisan:optimize` | server | `config:cache`, `route:cache`, `view:cache`, `event:cache` for the new release | never `optimize:clear` |
| 19 | `deploy:symlink` | server | **the switch**: `current` → `releases/N` | the moment visitors see the new version |
| 20 | `uni:reload` | server | reload PHP-FPM, then `artisan reload` (workers and scheduler) | the running processes still hold the old code |
| 21 | `uni:smoke` | server | `curl /up` must be 200, the map module must be `text/javascript` | proves the site answers, from the site |
| 22 | `deploy:unlock` | server | removes the lock | — |
| 23 | `deploy:cleanup` | server | deletes releases beyond the newest 5 | disk |
| 24 | `deploy:success` | — | prints "Successfully deployed!" | — |

(Steps 3–10 are what `deploy:prepare` expands to in Deployer's recipe, which is why `deploy.php` lists 17 names and this table has 24 rows.)

**The one step that isn't reversible is 17.** Migrations run against the shared database while the *old* code is still live, and a rollback doesn't undo them. That's why migrations only go forward (28.09, decision 5), why a risky schema change is split across two releases (add the new shape, move to it, remove the old one later), and why production backs up first.

**The one step that doesn't protect you is 21.** By then the switch has happened, so a failed smoke test doesn't undo anything. It **tells you**, and prints the rollback command. It exists because the two failures it checks for (the site doesn't boot, the map module comes back with the wrong type) both return a page that looks fine to every earlier check.

---

## 4. `deploy.php`, line by line

### 4.1 The header and the settings

```php
namespace Deployer;                  // every Deployer function (set, task, run…) lives here

use Symfony\Component\Console\Input\InputOption;

require 'recipe/laravel.php';        // Deployer's Laravel recipe: shared .env + storage, artisan:* tasks.
                                     // Its own `deploy` task is replaced at the bottom of this file.

option('first-deploy', null, InputOption::VALUE_NONE, 'Generate APP_KEY in shared/.env, once, on a new box');
//      a new command-line flag, `--first-deploy`, with no value — present or absent
```

```php
set('application', 'undernoinfluence');         // a label in Deployer's output
set('deploy_path', '/var/www/undernoinfluence'); // must match Ansible's app_root
set('keep_releases', 5);

set('update_code_strategy', 'local_archive');
//   'archive' (the default) = the SERVER runs git and fetches from GitHub → needs a GitHub key there.
//   'local_archive' = the PC runs `git archive <tag> -o archive.tar`, uploads it, the server unpacks.
//   → No server can read the repository. That's the no-server-holds-a-github-credential record.
//   (archive.tar sits in the project root for a few seconds, which is why .gitignore lists it.)

set('bin/php', 'php8.5');            // which PHP binary every artisan call uses — see _2 §4 on this seam
set('composer_options', '--prefer-dist --no-progress --no-interaction --no-dev --optimize-autoloader');
//   --no-dev              no test tooling, no debugbar on a server
//   --optimize-autoloader a class map instead of searching folders on every request

set('writable_mode', 'chgrp');       // make things writable by changing their GROUP to www-data…
set('http_group', 'www-data');
set('writable_dirs', ['bootstrap/cache']);   // …but only this folder, not storage/
set('writable_recursive', true);
```

**Why only `bootstrap/cache`.** The Laravel recipe's default list includes all of `storage/`. That's shared, and it contains files `www-data` created, such as session files and logs. Only a file's owner may change its group, so `chgrp -R` over them fails with "Operation not permitted". **The second deploy onto any real server would have failed** (29.09 finding 2). Ansible already made `shared/storage` right (setgid + umask), so Deployer is told to leave it alone.

```php
set('assets_tarball', fn (): string => sys_get_temp_dir().'/uni-assets-'.get('target').'.tgz');
//   /tmp/uni-assets-v0.1.5.tgz on the PC. A function, so it's computed per deploy.
//   {{target}} is the tag from --tag.
```

### 4.2 The hosts

```php
host('homeserver')                   // the name you type: dep deploy homeserver
    ->setHostname('uni-home')        // what SSH connects to — the alias in ~/.ssh/config (User deploy)
    ->set('labels', ['env' => 'home'])
    ->set('smoke_url', 'http://127.0.0.1');        // curl from the box itself: nginx on port 80

host('production')
    ->setHostname('uni-prod')
    ->set('labels', ['env' => 'prod'])
    ->set('smoke_url', 'https://undernoinfluence.pl');   // the real address, real certificate

function isProduction(): bool
{
    return currentHost()->get('labels')['env'] === 'prod';   // the host this task is running for
}
```

The user isn't set here. It comes from `~/.ssh/config`, where `uni-home` and `uni-prod` say `User deploy`. Ansible overrides the same alias to `admin`. **One alias, two users, two tools.**

### 4.3 `uni:guard:tag` — what may be deployed at all

```php
task('uni:guard:tag', function (): void {
    $tag = input()->getOption('tag');                 // --tag=v0.1.5

    if (empty($tag)) {
        throw error('Deploy a tag: dep deploy <host> --tag=v0.1.N');   // no --tag → no deploy. Never a branch.
    }

    $local = runLocally('git rev-list -n1 '.escapeshellarg($tag), cwd: __DIR__);
    //        the commit the tag points to ON THE PC
    $remoteLine = runLocally('git ls-remote origin '.escapeshellarg("refs/tags/{$tag}^{}"), cwd: __DIR__);
    //        the commit the tag points to ON GITHUB. `^{}` "peels" an annotated tag to its commit.
    $remote = trim(explode("\t", $remoteLine)[0]);

    if ($remote !== $local) {
        throw error("Tag {$tag} is {$local} here and '{$remote}' on origin: moved, or never pushed.");
    }
    //   Catches: a tag you forgot to push (CI never saw it), or a tag re-created locally
    //   on a different commit (CI tested something else).

    $greenRuns = (int) runLocally("gh run list --commit {$local} --workflow tests.yml --status success --json databaseId --jq length", cwd: __DIR__);
    //   Asks GitHub: how many SUCCESSFUL runs of tests.yml exist for exactly this commit?
    //   This is why `gh auth login` gates everything.

    if ($greenRuns === 0) {
        throw error("No green CI run for {$tag} ({$local}). Push, wait for the tests workflow, then deploy.");
    }

    if (isProduction()) {
        $homeRevision = '';
        on(host('homeserver'), function () use (&$homeRevision): void {   // hop to the OTHER server…
            $homeRevision = trim(run('cat {{deploy_path}}/current/REVISION'));   // …and read what it runs
        });
        if ($homeRevision !== $local) {
            throw error("The home server runs {$homeRevision}, not {$tag}. Every tag reaches the home server first.");
        }
    }
})->once();      // run once per deploy, not once per host
```

**Three rules, as code:** only tags, only green ones, and production only after the home server. There is deliberately no flag to skip any of them (29.09, decision 8). A switch that turns off the most important check is the one that stays on.

### 4.4 `uni:assets:build` — on the PC, from a clean copy

```php
task('uni:assets:build', function (): void {
    if (testLocally('[ -s {{assets_tarball}} ]')) {      // already built for this tag (e.g. home, then production)?
        writeln('Reusing {{assets_tarball}}, built from this tag earlier.');
        return;                                           // → production gets the SAME bytes the home server got
    }

    $worktree = runLocally('mktemp -d');                  // an empty temporary folder
    runLocally("git worktree add --detach {$worktree} {{target}}", cwd: __DIR__);
    //   a second checkout of the repository, at the tag, in that folder. Your working copy,
    //   your uncommitted files and your running `npm run dev` are untouched and can't leak in.

    try {
        runLocally('composer install --no-dev --no-scripts --no-interaction --prefer-dist --quiet', cwd: $worktree, timeout: 900);
        //   needed ONLY because Filament's admin theme imports CSS from vendor/filament (29.09 finding 7).
        //   --no-scripts: Laravel's post-install scripts want a .env, and there isn't one here.
        runLocally('npm ci && npm run build', cwd: $worktree, timeout: 900);
        //   npm ci = exactly package-lock.json, from nothing. Then Vite.
        runLocally("tar -czf {{assets_tarball}} -C {$worktree}/public build vendor/maplibre-gl");
        //   pack only what the servers need: public/build and public/vendor/maplibre-gl
    } finally {
        runLocally("git worktree remove --force {$worktree}", cwd: __DIR__);   // always clean up, even on failure
    }
})->once();
```

**Why not build on the server?** Not memory. 28.09 measured it at about 370 MB, which is fine. The reasons that remain: every server gets the **identical** build, and production needs no Node.js to keep patched.

**One thing to know:** the tarball in `/tmp` is reused by tag name. If you ever delete and re-create a tag on a different commit, `uni:guard:tag` catches the mismatch with GitHub. Still, the safe habit is never to reuse a tag name, which is standard practice anyway.

### 4.5 `deploy:env` — the override that keeps the password off an error page

```php
task('deploy:env', function (): void {
    if (! test('[ -s {{deploy_path}}/shared/.env ]')) {        // -s = exists AND is not empty
        throw error('shared/.env is missing. Write it on the box first (deployment runbook 3.6 / 7.5).');
    }

    if (! input()->getOption('first-deploy') && test('grep -qE "^APP_KEY=\s*$" {{deploy_path}}/shared/.env')) {
        throw error('APP_KEY is empty in shared/.env. On a new box, deploy once with --first-deploy.');
    }
});
```

**Defining a task with the same name as a recipe task replaces it.** Deployer's own `deploy:env` copies `.env.example` to `.env` when none exists, and `deploy:shared` would then move that copy into `shared/` for good. `.env.example` has `APP_DEBUG=true` and no key, so the first error page would print the environment, database password included (29.09 finding 1). UNI's version stops instead. Proved on the stand-in server. `DeployRecipeKeepsTheRulesTest` makes sure nobody quietly deletes the override.

`test()` runs a command on the server and returns true/false from its exit code, where `run()` would throw on failure.

### 4.6 Assets in, and checked

```php
task('uni:assets:upload', function (): void {
    upload('{{assets_tarball}}', '{{release_path}}/assets.tgz');        // rsync over SSH, PC → server
    run('tar -xzf {{release_path}}/assets.tgz -C {{release_path}}/public && rm {{release_path}}/assets.tgz');
});

task('uni:guard:assets', function (): void {
    $checks = [
        'the Vite manifest'   => '[ -f public/build/manifest.json ]',         // without it: every page 500s
        'the MapLibre module' => 'ls public/vendor/maplibre-gl/*/maplibre-gl.mjs >/dev/null 2>&1',   // blank maps
        "Filament's assets"   => '[ -d public/js/filament ] && [ -d public/css/filament ]',   // unstyled /admin
        'no public/hot'       => '[ ! -e public/hot ]',                        // Vite dev-server marker: points the
    ];                                                                         // site at localhost:5173 — for visitors
    foreach ($checks as $what => $command) {
        if (! test("cd {{release_path}} && {$command}")) {
            throw error("Asset check failed: {$what}.");
        }
    }
});
```

Filament's `public/js/filament` and `public/css/filament` aren't uploaded. They're regenerated by `composer install` in step 11 (Filament's `filament:upgrade` post-install script), which is why this check comes after `deploy:vendors`.

### 4.7 Key, backup, reload, smoke

```php
task('uni:key', function (): void {
    if (input()->getOption('first-deploy') && test('grep -qE "^APP_KEY=\s*$" {{deploy_path}}/shared/.env')) {
        run('{{bin/php}} {{release_path}}/artisan key:generate --force');
        //   writes into release/.env — which IS shared/.env via the link. Generated on the box;
        //   the key never exists on your PC. Both conditions: --first-deploy alone never overwrites a key.
    }
});

task('uni:backup:before-migrate', function (): void {
    if (! isProduction()) {
        return;                                            // the home server holds nothing worth backing up
    }
    $status = run('{{bin/php}} {{release_path}}/artisan migrate:status --pending --no-ansi');
    if (str_contains($status, 'No pending migrations')) {
        return;                                            // most deploys: nothing to migrate, no backup
    }
    writeln('Pending migrations: backing up the database first.');
    run('{{bin/php}} {{release_path}}/artisan backup:run --only-db --no-interaction', timeout: 900);
    //   spatie/laravel-backup, database only, to the same offsite `backups` disk (Scaleway) as the nightly one.
    //   If the backup fails, run() throws → the deploy stops BEFORE migrate.
});

task('uni:reload', function (): void {
    run('sudo /usr/bin/systemctl reload php8.5-fpm');      // deploy's ONE sudo right (Ansible's sudoers line)
    run('{{bin/php}} {{current_path}}/artisan reload');
});
```

**Why reload at all, if `current` already moved?** Three things keep running old code:

| What | Why it's still on the old release | What fixes it |
|---|---|---|
| PHP-FPM | PHP caches "where does `current/…` really point" for 120 s, and OPcache keeps compiled files | `systemctl reload php8.5-fpm`: graceful, finishes in-flight requests |
| Queue workers | a running PHP process loaded the old code at start, and `--max-time` would only replace it within the hour | `artisan reload` → `queue:restart`: sets a timestamp in the **cache**; each worker sees it after its current job and exits; supervisor starts it again from the new `current` |
| A running scheduled command | same | `artisan reload` → `schedule:interrupt` |

`queue:restart` writes its signal **into the cache, and UNI's cache is a database table.** That's the concrete reason for the comment block above the `deploy` task: `optimize:clear` or `cache:clear` in a deploy would wipe the restart signal, the scheduler heartbeat the admin dashboard reads, and the login rate-limit counters (28.09, decision 6).

```php
task('uni:smoke', function (): void {
    $url = get('smoke_url');
    $mapLibreVersion = trim(run('ls {{current_path}}/public/vendor/maplibre-gl | head -1'));
    $up = run("curl -s -o /dev/null -w '%{http_code}' {$url}/up", nothrow: true);
    //   Laravel's built-in health route. -w prints only the status code. nothrow: a failed curl
    //   shouldn't crash the task — we want the nice message below instead.
    $moduleType = run("curl -s -o /dev/null -w '%{content_type}' {$url}/vendor/maplibre-gl/{$mapLibreVersion}/maplibre-gl.mjs", nothrow: true);

    if ($up !== '200' || ! str_starts_with($moduleType, 'text/javascript')) {
        throw error("Smoke test failed: /up answered {$up}, the map module came as '{$moduleType}'. Roll back: dep rollback ".currentHost()->getAlias());
    }
});
```

The curl runs **on the server**, against itself. On production that goes out to the public address and back in, so it also proves DNS, the certificate and nginx.

### 4.8 The task list, and the two hooks

```php
/*
 * Never in any task: optimize:clear or cache:clear (…), migrate:rollback (migrations only
 * go forward), db:seed.
 */
task('deploy', [ 'uni:guard:tag', 'uni:assets:build', 'deploy:prepare', 'deploy:vendors',
    'uni:assets:upload', 'uni:guard:assets', 'uni:key', 'artisan:storage:link',
    'uni:backup:before-migrate', 'artisan:migrate', 'artisan:optimize', 'deploy:symlink',
    'uni:reload', 'uni:smoke', 'deploy:unlock', 'deploy:cleanup', 'deploy:success' ]);
//   A task made of other tasks. Redefining `deploy` replaces the recipe's own list entirely.

after('deploy:failed', 'deploy:unlock');   // a failed deploy must not leave the lock behind
after('rollback', 'uni:reload');           // see §5
```

**The order encodes the decisions:** guards first and cheapest, the heavy work while the old release still serves, migrate **before** optimize (the cached config belongs to the schema it runs against), symlink as late as possible, reload immediately after it.

---

## 5. Rollback

`dep rollback production` does, in Deployer's source:

1. finds the release before the current one, **skipping any marked `BAD_RELEASE`**;
2. switches `current` to it (`ln -nfs`), which is the same atomic switch;
3. writes a `BAD_RELEASE` file into the release you rolled away from, so the next rollback never goes back to it;
4. **and nothing else.** Then UNI's `after('rollback', 'uni:reload')` reloads PHP-FPM and the workers. Without that hook, the old code stays on screen for up to 2 minutes and in the workers for up to an hour (29.09 finding 5, proved: the workers came back with new process ids).

**What rollback does NOT do: undo migrations.** The database stays as the newer release left it. That's safe *because* of the rule that every release must work against both the schema before it and the schema after it (expand, then contract). A rollback can't fix a destroyed column. The pre-migration backup can.

`dep rollback production -o rollback_candidate=3` picks a specific release.

---

## 6. CI — the gate in front of Deployer

`.github/workflows/tests.yml`. GitHub runs this on its own machines. **It never deploys and holds no secrets.** Its only output is a green or red mark on a commit, which `uni:guard:tag` reads.

```yaml
name: tests                       # the name `--workflow tests.yml` refers to by file

on:
  push:
    branches: [main]              # every push to main…
    tags: ['v*']                  # …and every pushed version tag
  pull_request:                   # and PRs, if you ever use them

permissions:
  contents: read                  # the run may read the code and nothing else — can't push, can't release

jobs:
  tests:
    runs-on: ubuntu-24.04         # GitHub's machine. PHP and Postgres come from the steps below, not the OS
    timeout-minutes: 20

    services:
      postgres:                   # a real PostgreSQL 18 beside the job — the tests run on Postgres, like prod
        image: postgres:18
        env:
          POSTGRES_USER: undernoinfluence_user   # the names .env.example / phpunit.xml expect
          POSTGRES_PASSWORD: ci
          POSTGRES_DB: undernoinfluence_test
        ports: ['5432:5432']
        options: >-               # don't start the steps until Postgres answers
          --health-cmd "pg_isready -U undernoinfluence_user"
          --health-interval 5s --health-timeout 5s --health-retries 10

    env:
      DB_PASSWORD: ci

    steps:
      - uses: actions/checkout@3d3c42e5…      # v7.0.1 — the code, at the pushed commit
      - uses: shivammathur/setup-php@f3e473d1…  # 2.37.2 — PHP 8.5 with the same 8 extensions Ansible checks
        with:
          php-version: '8.5'
          extensions: mbstring, xml, curl, zip, bcmath, intl, pdo_pgsql, gd
          coverage: none
      - uses: actions/setup-node@82076278…    # v7.0.0 — Node 24, npm cache
        with: { node-version: '24', cache: npm }

      - run: composer install --no-interaction --prefer-dist --no-progress   # WITH dev: it needs PHPUnit
      - run: cp .env.example .env && php artisan key:generate
      - run: npm ci && npm run build          # a real build — no public/hot can exist here

      - name: The assets a deploy needs exist, and public/hot does not
        run: |                                # the same four checks as uni:guard:assets
          test -f public/build/manifest.json
          ls public/vendor/maplibre-gl/*/maplibre-gl.mjs
          test -d public/js/filament
          test ! -e public/hot

      - run: php artisan test --compact       # the whole suite
```

**Why the long hexadecimal strings after `@`.** `actions/checkout@v7` is a label its owner can move to different code at any time, including a compromised owner. A full commit hash can't be moved. The comment keeps the human-readable version beside it.

**Why CI matters more than it looks.** On 28.09, with `npm run dev` running, `HomePageTest` passed 18 of 18 **with no build at all**, because `public/hot` makes Laravel skip the manifest. CI starts from nothing every time, so that can't happen there. `composer run test` now refuses to run locally while `public/hot` exists, too.

---

## 7. Commands you will actually type

All from the application root on the PC. `dep` is `~/.local/bin/dep`, Deployer 8.0.5.

```bash
# Is the tag allowed? (needs `gh auth login` once)
gh run list --workflow tests.yml --limit 3

# A release
git tag -a v0.1.5 -m "v0.1.5 — what it is"      # -a: an annotated tag, with a message and a date
git push origin v0.1.5                          # CI runs on the tag push too
dep deploy homeserver --tag=v0.1.5 --first-deploy   # ONLY the very first deploy to a new box
dep deploy homeserver --tag=v0.1.6                  # every one after
dep deploy production --tag=v0.1.6                  # refuses unless the home server runs v0.1.6

# Going back
dep rollback homeserver
dep rollback production

# Looking around
dep releases homeserver               # the release list: number, date, who, commit
dep ssh homeserver                    # a shell on the box as deploy, in the current release
dep run 'php artisan about' homeserver   # one command, run inside the live release
dep tree deploy                       # the full expanded task list — §3's table, from the tool itself
dep config homeserver                 # every resolved setting for that host

# More detail when something fails
dep deploy homeserver --tag=v0.1.6 -vvv

# A deploy that died and left the lock (only after checking no other deploy is running)
dep deploy:unlock homeserver
```

---

## 8. What is done in UNI, and what is not

| | State on 30.09 |
|---|---|
| Deployer 8.0.5 on the PC, `~/.local/bin/dep` | **Done 29.09**, as the standalone phar. Moving it into `composer.json` is open question 2, not needed |
| `deploy.php` | **Written, committed, pushed 29.09** |
| `DeployRecipeKeepsTheRulesTest` | **Eight rules pinned** (the PHP-version match added 30.09): no cache clearing, tags uploaded from the PC, the `deploy:env` override, assets checked before going live, reload after switch and rollback, migrate before optimize with the production backup first, no `chgrp` on shared storage |
| Proved on the stand-in container | **Yes.** Refused with an empty key → first deploy → workers and cron checked → second deploy over `www-data`'s files → rollback → all green |
| Not proved anywhere | **`uni:guard:tag`'s GitHub checks** (no CI run existed during the test), `uni:backup:before-migrate` (production only), the smoke test over real HTTPS |
| `.github/workflows/tests.yml` | **Pushed 29.09. First run unread.** Needs `gh auth login` |
| First release through Deployer | **`v0.1.5`**, once CI is green. Nothing earlier can pass `uni:guard:tag` |
| `shared/.env` on any real server | **Not yet.** Written by hand at runbook 3.6 (home) and 7.5 (production) |
| The old home-server container | Still on `v0.1.2`, updated the old way. It's replaced by `uni-next`, not converted |

---

## 9. When a deploy fails

| It stopped at… | State of the site | What to do |
|---|---|---|
| `uni:guard:tag`, `uni:assets:build` | untouched; nothing reached the server | read the message: push the tag, wait for CI, fix the build |
| `deploy:lock` "Deploy locked" | untouched | someone (you, in another terminal) is deploying. If not, `dep deploy:unlock <host>` |
| anything from `deploy:release` to `artisan:optimize` | **untouched, still the old release.** A half-built `releases/N` is left and cleaned up by a later deploy | fix the cause, deploy again |
| `artisan:migrate` part-way | old code live against a **partly migrated** database | the one bad case. Look at `migrate:status`; on production the backup from step 16 exists. Don't roll back migrations by hand in a panic — read first |
| `uni:reload` | new release live, some processes on old code | run `dep rollback <host>` or fix and re-run `uni:reload` |
| `uni:smoke` | **new release live and not answering properly** | `dep rollback <host>`, exactly as the message says. Then investigate on the home server |

**The general rule:** everything before `deploy:symlink` fails safe. After it, the fix is `dep rollback`, which takes seconds.

---

## Learning path

- **Deployer's own recipe files** are short and are the true manual. The phar can be unpacked, and `recipe/common.php`, `recipe/laravel.php` and `recipe/deploy/*.php` are 20–100 lines each. Three of 29.09's findings came from reading them. Search: "deployer recipe laravel.php github".
- **Atomic deploys and the symlink**: why `ln -nfs` is one operation, and why PHP still needs a reload afterwards. Search: "nginx realpath_root opcache symlink deploy".
- **Expand and contract migrations**: the discipline that makes a rollback without down-migrations safe. Search: "expand and contract database migrations".
- **GitHub Actions**: services, SHA pinning, and `permissions`. Search: "GitHub Actions security hardening pin actions to a full length commit SHA".

*See also: [[learning/ansible-explained]] · [[ops/deployment-runbook]] · [[decisions/product/servers-are-built-and-deployed-from-the-pc-without-a-panel]] · [[decisions/product/a-deploy-without-its-settings-stops]] · [[decisions/product/no-server-holds-a-github-credential]] · [[decisions/product/a-release-is-a-tag-deployed-from-git]]*
