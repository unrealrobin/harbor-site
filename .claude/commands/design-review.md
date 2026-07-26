---
description: Audit a page against the Harbor brand doc — banned patterns, required patterns, felt-difference test, accessibility. Read-only; outputs prioritized findings citing specific rules.
---

# /design-review

Audits the site (or a named page/section) against the brand system. This
command **never edits code** — it produces findings for a `/restyle` or a
redesign task to fix.

## 0. Load the law (always, before looking at anything)

Read, in order:

1. `C:\Users\Robin Lifshitz\Documents\RLOV\Harbor\02 Technical\harborlauncher-site Design\Brand & Art Direction.md`
   — the authority. Required patterns, banned patterns, the felt-difference
   mandate, motion rules, copy rules.
2. `C:\Users\Robin Lifshitz\Documents\RLOV\Harbor\02 Technical\harborlauncher-site Design\north-star-mock.html`
   — the approved composition target (also live at the artifact URL in the
   brand doc). Judge structure against THIS, not against the pre-redesign site.
3. `design-refs/INDEX.md` in the same vault folder — cross-cutting patterns,
   for context on *why* the rules exist.

If the brand doc is missing or unreadable, STOP and tell Robin — do not
review from memory.

## 1. Capture the evidence

- Start the dev server via the Browser pane (`preview_start` with the
  launch.json config; never Bash).
- Screenshot at 375px, 768px, 1280px (`resize_window` + screenshot).
- `read_page` for structure; `javascript_tool` for computed styles when a
  finding needs exact values (colors, font sizes, radii).

## 2. Audit passes

Run each pass; every finding must cite the specific brand-doc rule it
violates (quote the rule line).

1. **Banned-pattern sweep** — check every banned item: second accent, halo
   gradients, glassmorphism, icon grids, generic icon sets, centered-hero
   symmetry, pill-shaped UI, radius soup, uniform fade-ups, stock 3D,
   banned copy constructions.
2. **Required-pattern check** — one accent within ~7% budget, teal-tinted
   neutrals (no flat gray), opacity-ladder hierarchy, mono texture on
   numbers/labels, real product imagery only, motion rules (directional,
   staggered, once, reduced-motion gated), section-ground rhythm, max one
   polarity flip.
3. **Felt-difference test** — compare composition to the north-star mock:
   viewport-scale hero type, asymmetric layout, off-frame product bleed,
   polarity flip present. A page that keeps the old composition with new
   tokens FAILS regardless of token compliance.
4. **Accessibility baseline** (from CLAUDE.md): WCAG AA contrast (check the
   tinted ramp values actually pass), visible focus rings, keyboard
   navigation, labels associated, headings in order, alt text. The light
   flip section gets its own contrast check.
5. **12-second test** — hero must convey category + mechanic plainly.
   Cleverness never does the explaining; if the headline is evocative, the
   subhead must carry the plain explanation.

## 3. Report

Output a prioritized findings list:

- **FAIL** — banned pattern present, felt-difference test failed, or AA
  contrast broken. Blocks the PR.
- **WARN** — required pattern weakly applied, accent budget exceeded, rule
  tension worth a decision.
- **NOTE** — polish opportunities.

Each finding: location (`file:line` when identifiable), the rule violated
(quoted), what was observed, suggested fix direction. No fixes applied.

If a finding reveals the *rule* is wrong rather than the page, say so
explicitly — rule changes go through Robin editing the brand doc, never
through silently ignoring it.
