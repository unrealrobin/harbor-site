# Task Workflow

One lifecycle covers every task on the site. No per-task-type ceremony.

```
/start-task HAR-XXX
        ↓
  implement, commit, repeat
        ↓
   /finish-task
        ↓
  user confirms PR
        ↓
   gh pr create  →  user merges in GitHub  →  /close-task
```

---

## 1. `/start-task HAR-XXX`

1. Confirm working tree is clean (`git status`). If not, stop and surface it.
2. Fetch the Linear issue via MCP — show the user the title, scope, and acceptance criteria.
3. `git checkout main && git pull`
4. `git checkout -b <gitBranchName>` (use the exact `gitBranchName` field from the issue, e.g. `har-135`).
5. Update Linear: status → **In Progress**, assignee → current user.
6. Report ready. Wait for the user's first direction on implementation.

## 2. Implement

- Small, atomic commits. Each commit message prefixed with the issue: `har-135: <imperative summary>`.
- Whenever a new npm package is needed, run `/check-pkg <name>` first.
- Whenever a Netlify Function or env-reading code is added/modified, plan to run `security-reviewer` in the finish step.
- Write tests alongside the logic, in `tests/`. See [CLAUDE.md → Testing](../CLAUDE.md#testing).

## 3. `/finish-task`

Runs in order. Any failure stops the flow.

1. `npm test` — all tests pass.
2. `npm run build` — clean build, no warnings escalated.
3. **`code-reviewer` agent** — passes the current diff. Address blocking findings.
4. **`security-reviewer` agent** — only if `netlify/functions/**`, `package.json`, `astro.config.mjs`, or env-reading code was touched. PASS or WARN-acknowledged required.
5. `npm audit` — no critical/high findings. If any, fix or document why deferred.
6. Grep diff for stray `console.log`, `TODO`, `FIXME`, hardcoded secrets — surface if found.
7. `git push -u origin <branch>`.
8. **Stop. Ask user to confirm PR creation.** Do not run `gh pr create` without explicit yes.

## 4. PR creation (on user confirmation)

1. `gh pr create` — title `HAR-XXX: <issue title>`, body summarizes scope + test plan + link to Linear issue.
2. Update Linear: status → **In Review**, add PR URL as attachment.
3. Report the PR URL. Stop.

## 5. User merges in GitHub

Manual. The assistant does not merge.

## 6. `/close-task` (or on next session start)

1. Confirm the PR is merged via `gh pr view`.
2. Update Linear: status → **Done**.
3. `git checkout main && git pull && git branch -d <branch>`.

---

## When things go sideways

- **Tests fail mid-flow** → fix and commit, re-run `/finish-task`. Don't push broken tests.
- **Security reviewer returns BLOCK** → fix, re-run reviewer. Don't push.
- **Build fails on Netlify after merge** → roll back via revert PR, not force-push.
- **Linear MCP unavailable** → do the work, leave a note for the user to update Linear manually.
