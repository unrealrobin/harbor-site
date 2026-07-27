---
description: Apply one opinionated design change to a section, tokens-first, per the Harbor brand doc and north-star mock. Verifies at 375/768/1280 before reporting done.
---

# /restyle <section>

Applies **one opinionated design change per invocation** toward the
north-star composition. Small, verifiable, reversible steps — never a
whole-page rewrite in one call.

## 0. Load the law

Same three reads as `/design-review` step 0 (brand doc, north-star mock,
design-refs INDEX — all in
`C:\Users\Robin Lifshitz\Documents\RLOV\Harbor\02 Technical\harborlauncher-site Design\`).
If the brand doc is missing, STOP. Also read the target component/page files
and `src/styles/tokens.css` before deciding the change.

## 1. Pick the ONE change

- If the invocation names a section (`/restyle hero`), work there. If a
  `/design-review` findings list exists in the conversation, take the
  highest-severity finding for that section.
- State the single change and which brand-doc rule or north-star element it
  serves BEFORE editing.
- If the right change requires a rule the brand doc doesn't cover, ask Robin
  rather than inventing taste.

## 2. Execute, tokens-first

- Colors, fonts, radii, spacing ramps change in `src/styles/tokens.css`
  first; components consume tokens. Never hardcode a color in a component
  (CLAUDE.md hard rule).
- Deletions the brand doc mandates (e.g. `--blue`, `--r-pill`,
  `--harbor-halo`) remove the token AND all usages — leaving a dead token
  "for later" is a WARN in review.
- Respect repo idioms: semantic HTML, zero-JS-by-default Astro, client
  directives only when justified, motion gated behind
  `prefers-reduced-motion`.
- Stay on the task's feature branch (git workflow in CLAUDE.md). Never
  commit without Robin's go-ahead.

## 3. Verify before reporting

- Preview via Browser pane, check 375 / 768 / 1280.
- Confirm the change didn't introduce a banned pattern (quick sweep of the
  banned list against the touched area).
- Horizontal overflow check after any bleed/asymmetry work: the page body
  must never scroll sideways.
- Screenshot the result and share it in the report.

## 4. Report and stop

State: the one change made, files touched, rule/north-star element served,
verification evidence. Then STOP — the next change is a new invocation.
Robin redirects between steps; do not chain restyles.
