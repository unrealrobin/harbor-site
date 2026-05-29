---
description: Pre-PR check. Runs tests, build, code-reviewer, security-reviewer (when relevant), npm audit, scans for stray logs/secrets, pushes the branch, then asks for confirmation before opening the PR.
---

# /finish-task

Pre-PR pipeline for the current branch. Any failure halts the flow — fix and re-run.

## Steps

### 1. Sanity
- Run `git status`. Confirm we're on a feature branch (not `main`) and there are no unstaged changes you need to deal with first.
- Run `git log main..HEAD --oneline` to confirm there are commits to PR.

### 2. Tests
- Run `npm test`. **Must pass.** If any fail, stop and report.

### 3. Build
- Run `npm run build`. **Must succeed with no warnings escalated.** If it fails, stop and report.

### 4. Code review
- Invoke the `code-reviewer` agent. Pass it the diff context (`git diff main...HEAD`).
- Address every **Blocking** finding before continuing. Warnings can be acknowledged with reasoning.

### 5. Security review (conditional)
- If the diff touches any of:
  - `netlify/functions/**`
  - `package.json` / `package-lock.json`
  - `astro.config.mjs`
  - Any file reading `import.meta.env.*` or `process.env.*`
- ...then invoke the `security-reviewer` agent.
- Verdict must be **PASS** or **WARN** with all caveats acknowledged. **BLOCK** halts the flow.

### 6. Dependency audit
- Run `npm audit`. Report any critical/high findings. Fix or document why deferred.

### 7. Hygiene scan
- Grep the diff for: `console.log`, `console.error` (in production code, not tests), `TODO`, `FIXME`, `XXX`, obvious secrets (`re_`, `phc_`, `sk_`, `api_key`, `password`).
- Surface anything found. The user decides whether to ship as-is.

### 8. Push
- `git push -u origin <current branch>`.

### 9. STOP — ask for PR confirmation
- Summarize what's in the branch (1–2 sentences) and the reviewer verdicts.
- **Ask the user: "Open the PR now?"**
- Do not run `gh pr create` without an explicit yes.

### 10. On user confirmation: open the PR
- `gh pr create --title "HAR-XXX: <issue title>" --body "<scope + test plan + link to Linear issue>"`
- Update Linear via `mcp__*__save_issue`: status → "In Review", attach the PR URL.
- Report the PR URL and stop. The user merges manually in GitHub.
