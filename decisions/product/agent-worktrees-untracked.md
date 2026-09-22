# Agent worktrees are untracked; the assistant's configuration stays tracked

**Date:** 2026-08-24
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14 (`.gitignore`)
**Area:** Infrastructure / Documentation

---

## Problem

An agent worktree directory was committed as a gitlink, so git treated it as a submodule that no clone can fetch. The reason it had not simply been removed was a real concern: if work needs to continue from another machine or another operating system, something has to travel with it.

## Options considered

Leave it tracked and accept broken clones. Untrack the worktrees directory and ignore it. Untrack everything the assistant writes, which would also throw away the configuration and skills that genuinely need to move between machines.

## Decision

The worktrees directory is untracked and ignored. The assistant's configuration and skills stay tracked, because those are the part that actually needs to travel. Nothing is lost in the move: a worktree is another checkout of the same repository, and any work inside one belongs on a branch, which is what makes it portable in the first place.

## Rules

Ephemeral working directories created by tooling are ignored rather than committed, and a directory is never committed as a gitlink unless it is a deliberate submodule. Configuration and skills that define how the project is worked on remain in version control, since that is how a second machine reproduces the setup. Work in progress inside a worktree is moved to a branch before the machine changes; the directory itself is never the transport.

## What this prevents

Prevents clones that cannot be completed because git is looking for a submodule that does not exist anywhere, and prevents the more expensive version of the same worry, where uncommitted work sits in an untracked directory and is lost when the machine changes.

## Revisit when

The tooling changes where it writes working directories, or a second person joins and the configuration needs splitting into shared and personal parts.

See also: [[decisions/product/no-component-package-inside-the-app]]
