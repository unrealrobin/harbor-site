---
title: Customization & Content
description: Every surface you can brand in the Harbor launcher, the asset specs, and the pre-submission checklist.
---

:::note[Who this is for]
Developers integrating Harbor into their Steam or Epic game. Everything below is what you can customize today (Harbor v0.2.6), how each setting renders, what format the asset needs, and the exact CLI step to set it.
:::

:::tip[Quick start]
Run `harbor` from the directory that holds your `harbor.config.json`. The menu surfaces only the actions that apply to your current state. Most customization lives behind **Configure → [Branding / Theme / Modules]**.
:::

## Deliverables

A checklist of everything you can set. The [pre-submission checklist](#pre-submission-checklist) at the bottom rolls it into a final ship-readiness pass.

**Branding (text)**
- Game name
- Tagline
- Play button text
- Launcher exe name

**Visuals (assets)**
- Background image — 1920×1080 (PNG / JPG / WebP), under 2 MB
- Logo — transparent PNG (or SVG), ~1000×750, under 500 KB
- Launcher icon — Windows `.ico` (16 / 32 / 48 / 256 sizes bundled)

**Theme colors (hex)**
- Background
- Primary
- Accent

**Modules (toggle each, then push content)**
- Patch Notes
- News
- Dev Comments

**Game integration**
- Game executable path — relative path to `.exe`

## Branding

### Game name

The title of your game. Drives the launcher window title bar and the home-page hero.

- **Where it appears:** the title bar (top-left, bold white on the dark plate) and the hero area on the home page (large display text under your logo).
- **Format:** plain text, any sensible single-line length. Title-cased ("Die Robot", not "die robot").
- **How to set it:** `harbor` → **Configure → Branding → Game Name**.

### Tagline

A one-line catchphrase under the game name on the home-page hero. Short, punchy.

- **Where it appears:** the hero area, directly under the game name (smaller white text at 70% opacity).
- **Format:** plain text, about 50 characters or fewer (longer wraps awkwardly). Optional; leave empty to hide.
- **How to set it:** `harbor` → **Configure → Branding → Tagline**.

### Play button text

The label on the primary action button that launches the game.

- **Where it appears:** the bottom of the hero area, a large pill-shaped button in your primary theme color.
- **Format:** plain text, 1–2 words. Common: "Play", "Launch", "Start", "Continue".
- **How to set it:** `harbor` → **Configure → Branding → Play Button Text**.

## Visuals

### Background image

A full-window backdrop behind everything in the launcher. The launcher applies a uniform dark scrim on top for legibility; your artwork still shows through, just slightly dimmed.

- **Where it appears:** behind every page, edge-to-edge in the 1280×720 launcher window.
- **Dimensions:** 1920×1080 minimum (provide higher resolution for retina clarity).
- **Aspect ratio:** 16:9 (the launcher is fixed at 1280×720).
- **File type:** PNG, JPG, or WebP. Animated WebP and GIFs play natively.
- **File size:** aim for under 2 MB. Larger files slow the first paint.
- **Color:** vibrant is fine; avoid pure-white backgrounds (contrast suffers under the scrim).
- **How to set it:** `harbor` → **Configure → Branding → Background Image**.

### Logo

Your game's logo or wordmark, displayed above the game name. Transparent PNG so it floats over the backdrop.

- **Where it appears:** the top of the hero area (left column), inside a 4:3 frame, max 260px tall, aspect preserved.
- **File type:** transparent PNG (SVG also works).
- **Dimensions:** source at 2× the rendered size (roughly 800×600 to 1040×780).
- **File size:** under 500 KB.
- **How to set it:** `harbor` → **Configure → Branding → Logo**.

## Theme colors

Three colors are configurable in v0.2.6, all hex strings (`#FF6B00`). The rest of the chrome is anchored to a neutral white-on-dark system, so these three are enough to brand the launcher. Run `harbor` → **Configure → Theme**; each prompt validates the hex format.

### Background

The base color of the launcher window when no background image is set, and the fallback for content-card thumbnails. Harbor's default is `#ffffff`; most launchers go darker.

### Primary

Your brand's primary color and the most visible one. Drives the **Play button** and focus rings. The launcher auto-computes a contrast color (white or black) for text on top, so any vivid color works.

### Accent

Used for markdown links inside content and minor highlights in long-form entries. Pick a bright color that stands out against white text on a dark plate.

## Modules

Each module is an independently togglable content channel inside the launcher.

| Module | What it is |
|---|---|
| **Patch Notes** | Long-form changelog entries: markdown body with optional header image. |
| **News** | Developer posts, announcements, season recaps. Same format as Patch Notes. |
| **Dev Comments** | Shorter commentary or behind-the-scenes notes. |

Each enabled module appears as a tab in the launcher title bar and as a section on the home feed (newest entries surface as cards on Home).

- **How to enable / disable:** `harbor` → **Configure → Modules**. Space toggles each, Enter confirms.
- **Pushing content:** `harbor` → **Push**. The CLI walks you through picking the module, writing the title, choosing the markdown file, and optionally attaching a header image.

### Per-entry image (optional)

A header image attached to a single entry.

- **Where it appears:** the home-feed card thumbnail (128×96, cropped to fit) and a full-width header at the top of the entry view.
- **Dimensions:** 1200×630 recommended (2:1 works as both a wide header and a thumbnail).
- **File type:** PNG, JPG, or WebP. **File size:** under 500 KB.

:::note[If you don't provide an entry image]
The home-feed card falls back to your launcher's background image as the thumbnail (so it still looks intentional), and the entry renders without a header image.
:::

## Game integration

### Game executable

The path to your actual game's `.exe`, relative to `harbor.config.json`. This is what Harbor launches on Play.

- **Format:** relative path. Examples: `DieRobot.exe` (same folder), `bin/MyGame.exe` (subfolder), `../Game/launcher.exe` (one folder up).
- **How to set it:** set during `harbor init`. To change: `harbor` → **Change Game Exe**.

### Launcher executable name

The filename of the Harbor launcher itself, after you download it. Defaults to a name derived from your game name; you can override it. Players see it as the file Steam / Epic launches on Play.

- **Format:** plain text, no extension (the CLI appends `.exe`). Avoid Windows-illegal characters (`< > : " / \ | ? *`).
- **How to set it:** `harbor` → **Configure → Branding → Exe Name**.

### Launcher icon

The Windows `.ico` applied to the launcher executable, replacing the default icon.

- **Where it appears:** Explorer thumbnail, taskbar icon, Alt-Tab preview.
- **File type:** Windows `.ico` only (no PNG-to-ICO conversion in the CLI today).
- **Sizes inside the `.ico`:** 16×16, 32×32, 48×48, 256×256 at minimum. Tools like icoconvert.com bundle PNGs into a multi-size `.ico`.
- **How to set it:** `harbor` → **Configure → Branding → Icon**. Applied on your next **Download**.

## Pre-submission checklist

Before you ship your launcher to players, confirm:

**Required**
- Game name is set and reads correctly in the title bar.
- Background image uploaded (1920×1080, under 2 MB).
- Logo uploaded (transparent PNG, under 500 KB).
- Launcher icon uploaded as a multi-size `.ico` (16 / 32 / 48 / 256).
- Game executable path points at the real game `.exe`, and Play launches it.
- Launcher exe name matches what you want players to see in Steam / Epic.

**Recommended**
- Tagline set (about 50 characters or fewer).
- Play button text customized if "Play" doesn't fit your tone.
- Primary theme color matches your brand.
- Background color set as a sensible fallback.
- Accent color chosen with markdown links in mind.
- At least one module enabled with at least one piece of content pushed.

**Visual QA**
- Run the launcher and walk every page (Home, News, Patch Notes, Dev Comments).
- All text reads cleanly against the background image.
- Play button hover and press states feel responsive.
- Module pages show the down-chevron indicator when there's more below.

## What's coming next

The customization surface is actively expanding. Deferred from v0.2.6: more asset types via the CDN, and a configurable home-feed layout (list vs. thumbnail-grid). This guide updates when those land.
