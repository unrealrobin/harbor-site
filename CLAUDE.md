# harborlauncher-site — Claude Instructions

`harborlauncher.com` — the public marketing + docs surface for Harbor. Astro static-first, deployed to Netlify, Resend Audiences for email capture, PostHog free tier for analytics. Repo is intentionally separate from the Harbor monorepo (ADR-010). Architecture lives in the vault at `RLOV/Harbor/02 Technical/harborlauncher-site Architecture.md`. Work is tracked in the Linear project `Harbor landing page deployed to harborlauncher.com`.

The site **gates outreach** — every cold email links here. A broken build is a launch blocker.

---

## Git workflow

- `main` is always deployable. Netlify auto-deploys `main` to production.
- **Every task gets its own branch**, branched from `main`. Branch name = `gitBranchName` from the Linear issue (e.g. `har-135`, `har-138`).
- Commits are scoped and frequent — small atomic commits within a branch. Conventional message style: `har-135: <imperative summary>`.
- **Never open a PR without explicit confirmation.** After `/finish-task` completes its checks, ask the user before running `gh pr create`.
- The user merges PRs manually in GitHub. Do not merge from CLI.
- After merge, the user can run `/close-task` (or the assistant updates Linear on next interaction) to flip the issue to Done.
- Never `git push --force` to `main`. `--force-with-lease` to feature branches requires confirmation.

## Package discipline (hard rule)

**Before adding or upgrading any npm package, confirm its latest stable version.** Use `/check-pkg <name>` (which runs `npm view <name> version` and `npm view <name> dist-tags`). Never install based on memory of "the latest version" — registry is authoritative.

- Always pin to the latest stable (`dist-tags.latest`). Avoid `^` ranges that could pull in unreviewed minor versions on `npm install`.
- Mention the version in the commit message: `har-136: add resend@4.0.0 for audiences API`.
- If a package's latest stable is < 6 months old, pause and surface it — early adoption is fine, but flag the risk.
- Prefer zero dependencies when the standard library or Astro built-ins suffice. Every added dep is an attack surface and a maintenance cost.

## Testing

**Test runner: Vitest. Not Jest.** Jest is not used anywhere in this project. The `@testing-library/jest-dom` package in the table below is a misnamed matchers library — it ships DOM matchers (`toBeInTheDocument`, etc.) that work with both Jest and Vitest. We use it with Vitest.

**Stack** — same one used here and in the future configurator (`Harbor/apps/web/`) so there's no context-switch when that project starts.

| Package | Pinned version | Role |
|---|---|---|
| `vitest` | `4.1.7` | Test runner + assertions |
| `@vitest/coverage-v8` | `4.1.7` | V8 branch coverage |
| `@testing-library/react` | `16.3.2` | Component tests (React islands now, configurator later) |
| `@testing-library/jest-dom` | `6.9.1` | DOM matchers |
| `@testing-library/user-event` | `14.6.1` | Realistic user interactions |
| `happy-dom` | `20.9.0` | Test environment (faster than jsdom) |
| `msw` | `2.14.6` | Mock HTTP at the network boundary |
| `@playwright/test` | `1.60.0` | E2E flows |

Confirm latest stable with `/check-pkg <name>` before installing — pinned versions above were correct on 2026-05-28.

**Layout**

```
tests/
├── setup.ts              # jest-dom matchers, MSW server start
├── fixtures/             # reusable test data (resend responses, payloads)
├── mocks/                # MSW handlers
├── <feature>.test.ts     # unit + integration, grouped by feature
└── e2e/<flow>.spec.ts    # Playwright flows
```

Config: `vitest.config.ts` at repo root, `environment: 'happy-dom'`, `setupFiles: ['./tests/setup.ts']`, coverage thresholds wired in.

**Policy**

- Required tests for:
  - Any utility function with branching logic
  - Any data transformation (form validation, payload shaping, response parsing)
  - Any Netlify Function — happy path + every error branch + every input variation (target ≥ 90% branch coverage)
  - Any React component with logic (target ≥ 80% behavior-level coverage)
- Not unit-tested (covered by E2E if at all):
  - Static Astro page markup
  - Pure presentational components
  - CSS
- All tests must pass before PR. `npm test` runs Vitest; `npx playwright test` runs E2E.
- **For writing tests, invoke the `test-writer` agent** — it enforces the rules above and refuses to write filler.

## Security

- **Secrets never go client-side.** API keys (`RESEND_API_KEY`, etc.) live only in Netlify env vars, read inside Netlify Functions. Never in `import.meta.env.PUBLIC_*`.
- Netlify Function inputs are validated at the boundary — never trust the client. Reject obviously malformed payloads with 400.
- Honeypot field on every form; rate-limit at the function level if abuse appears.
- Third-party scripts (PostHog, fonts) load with `defer`. Inline scripts only when justified.
- PostHog gated by `import.meta.env.PROD` — never loads on branch deploys.
- `npm audit` runs as part of `/finish-task`. Critical/high findings block PR.
- Run the `security-reviewer` agent whenever you touch `netlify/functions/**`, `package.json`, `astro.config.mjs`, or anything reading env vars.

## Idioms per language / framework

### Astro (`.astro` files)

- Static-first. Components ship zero JS unless they declare a client directive.
- Use `client:load` only when the component must be interactive on first paint. Prefer `client:visible` or `client:idle`.
- Page logic in the frontmatter (`---` fence) runs at build time. No `fetch()` to runtime APIs from there unless it's intentional SSR.
- Shared UI lives in `src/components/`. Page-specific markup stays in `src/pages/*.astro`.
- Layouts in `src/layouts/`. Every page extends a layout — never repeat `<head>` markup.
- Open Graph meta is mandatory on every public page. Use the layout slot, don't reinvent per page.

### HTML / CSS

- Semantic HTML. `<button>` for actions, `<a>` for navigation, headings in order, `alt` on every image.
- Design tokens live in `src/styles/tokens.css` — colors, fonts, spacing. **Never hardcode a color in a component.**
- Mobile-first. Test at 375px, 768px, 1280px before merge.
- Accessibility baseline: WCAG AA contrast, focus rings visible, keyboard-navigable, no positive `tabindex`, form labels associated with inputs.

### TypeScript / JavaScript

- `strict: true` in `tsconfig.json`. No `any`. If you need `unknown`, narrow before use.
- Exhaustive `switch` over discriminated unions; rely on `never` for the default.
- Pure functions where possible. Side effects at the edges (handlers, function entry points).
- No `console.log` in shipped code — use a `debug` flag or remove before commit. `/finish-task` checks for stray logs.
- Tests for non-trivial functions. See [Testing](#testing).

### Markdown (Starlight `/docs`)

- Frontmatter is mandatory: `title`, `description`, `sidebar.order` (when manual sort needed).
- Headings start at `##` — Starlight renders the `title` as `<h1>`.
- Link to other docs with relative paths (`./quickstart`), not absolute URLs.
- Code blocks specify a language for syntax highlighting.

### Netlify Functions (`netlify/functions/**`)

- TypeScript, one file per function, named after the route.
- Default export is the handler. Use `@netlify/functions` types.
- Validate input first, then act. Errors return JSON: `{ ok: false, error: "..." }` with appropriate status.
- Never log the request body if it might contain PII (emails are PII).
- Reuse the API key from `process.env.*`. Never hardcode.

---

## Agents

Run via the Agent tool with the named subagent. All live in `.claude/agents/`.

- **`code-reviewer`** — Reviews diff for idioms, clean-code, accessibility, and test presence. Invoke before opening a PR (`/finish-task` does this automatically).
- **`security-reviewer`** — Reviews secrets, env hygiene, function input validation, dependency safety, third-party script integrity. Invoke automatically when `netlify/functions/**`, `package.json`, or env-reading code is touched.
- **`test-writer`** — Writes meaningful tests covering happy path, branches, boundaries, and negative space. Refuses to write trivial filler. Reports branch coverage + explicit gaps. Invoke when adding new logic or backfilling coverage; never used by `/finish-task` automatically — you decide when tests are needed.

## Slash commands

Defined in `.claude/commands/`. Invoke as `/start-task`, `/finish-task`, `/check-pkg`.

- **`/start-task HAR-XXX`** — Branch from `main`, set Linear status to In Progress, fetch issue context.
- **`/finish-task`** — Run tests + build + reviewers, push branch, ask user to confirm PR, open PR + set Linear to In Review on yes.
- **`/check-pkg <name>`** — Look up the latest stable version on the npm registry. Always run before `npm install <name>`.

## Heads-up — wrong directory

The current Claude session was started in `Desktop/harbor site/` (the React+Babel-standalone prototype, not the deployed site). The deployed site lives at `Desktop/harbor-site/` where these instructions are saved. **Next session, launch Claude from `Desktop/harbor-site/` so this `CLAUDE.md` and the `.claude/` config activate.**
