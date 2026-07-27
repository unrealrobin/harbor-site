---
description: Write or review landing-page copy in Harbor's voice — 12-second rule, enemy-naming, declarative pairs, banned hype constructions. Cites the rule for every edit or finding.
---

# /land-copy

Writes new copy or reviews existing copy for the marketing site. Words are
design material here — this command enforces the same brand doc as the
visual commands.

## 0. Load the law

Read the brand doc:
`C:\Users\Robin Lifshitz\Documents\RLOV\Harbor\02 Technical\harborlauncher-site Design\Brand & Art Direction.md`
— positioning section, copy rules in Required/Banned patterns, and the
north-star note (the hero/footer headline bookends are ratified copy).
If missing, STOP.

## The voice, operationally

- **12-second rule (hard):** the hero states category + mechanic plainly.
  Cleverness never does the explaining. Current ratified structure: hero
  headline "Own the moment of Play." is evocative, so the subhead paragraph
  is load-bearing — it must always name what Harbor is (a lightweight,
  white-label launcher) and what it does. Any edit that makes the subhead
  vaguer is a FAIL.
- **Enemy-naming:** lead with what Harbor frees devs from (the storefront
  keeping the player relationship). "Stop renting" register. Concede the
  competitor's strengths honestly — it buys credibility (see the Why
  section's "Steam's tools are real" move).
- **Short declarative pairs** for statements: "Sell the game. Keep the
  player." Two short sentences beat one long one.
- **Specificity over abstraction:** name real things (Steam, emails, an
  export button, one skippable screen) — never "powerful tools" or
  "seamless experience".
- **Mechanic over adjective:** every claim answers "how?" in the same
  breath or the sentence gets cut.
- **Audience:** indie devs, 5–100 CCU, allergic to SaaS marketing. Write
  dev-to-dev, plain and a little dry. Personality shows up in precision and
  the occasional understatement, not enthusiasm.

## Banned (from the brand doc)

- Em dashes in user-visible copy. Rewrite with a period, colon, or comma.
  Sweep with a grep for the em dash character before finishing.
- Supercharge / unleash / seamless / effortless / blazing-fast, and any
  verb-your-noun hype construction.
- Exclamation points. Emoji in body copy.
- Feature adjectives without a mechanic ("powerful", "flexible", "robust").
- Headlines that are clever before they are clear.

## Modes

**Review mode** (default when pointed at existing copy): findings list —
FAIL / WARN / NOTE — each citing the rule, with a proposed rewrite for every
FAIL. Do not apply changes in review mode.

**Write mode** (when asked for new copy): produce 2–3 candidates per slot,
each obeying every rule above; annotate the trade-off between them in one
line each. Robin picks — never present a single take as final.

## Boundaries

- Claims about the product must be true of the product today (or clearly
  marked as roadmap). Check with Robin when unsure — never invent a
  capability to make a sentence land.
- The early-adopter offer wording is governed by its memory/Linear source
  (six months free, locked 2026-06-10) — don't restate terms from memory of
  old copy.
