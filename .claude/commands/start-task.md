---
description: Start work on a Linear issue. Confirms clean tree, fetches issue context, branches from main, sets Linear to In Progress.
argument-hint: HAR-XXX
---

# /start-task

Begin work on Linear issue `$1`.

## Steps

1. Run `git status`. If the working tree is not clean, **stop** and report what's uncommitted. Do not proceed.
2. Fetch the issue via the Linear MCP (`mcp__*__get_issue` with id `$1`). Show the user:
   - Title
   - Scope summary (first paragraph of the description)
   - Acceptance criteria
   - The exact `gitBranchName` field
3. Run:
   - `git checkout main`
   - `git pull --ff-only`
   - `git checkout -b <gitBranchName>`
4. Update Linear via `mcp__*__save_issue`:
   - status → "In Progress"
   - assignee → current user (skip if already assigned)
5. Report:
   - Branch created
   - Linear status updated
   - One-sentence summary of what the issue asks for
6. **Stop.** Wait for the user's direction on how to start. Do not begin implementation autonomously.
