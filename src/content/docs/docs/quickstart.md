---
title: Quickstart
description: From "nothing installed" to "Harbor is shipping with my game on Steam" in about an hour.
---

The path from "nothing installed" to "Harbor is shipping with my game on Steam." A technical developer can finish this in about an hour. Most of that is choosing colors and writing your first patch note.

:::note[What you need]
- A Windows machine (Harbor's CLI ships for Windows today).
- A Steam game with an installed local build, or any directory containing a `game.exe` you want to launch.
- About an hour.
:::

## Step 1 — Install the Harbor CLI

Open PowerShell and run:

```powershell
iwr -useb https://raw.githubusercontent.com/unrealrobin/Harbor/main/install.ps1 | iex
```

The script downloads the latest Harbor CLI release, places `harbor.exe` in `%LOCALAPPDATA%\Programs\Harbor\`, and adds that folder to your user PATH.

:::caution[Open a new terminal]
Close the PowerShell window the installer ran in and open a fresh one. PATH changes only apply to terminals started after the install.
:::

Verify it worked:

```powershell
harbor
```

You should see the Harbor REPL banner and a menu. If you see "command not found," your PATH didn't update. Close all terminals and try again.

## Step 2 — Log in (or create your account)

In the `harbor` menu, choose **Login**.

- First time? The CLI walks you through signup: email, password, and the **studio slug** that identifies you in Harbor URLs (e.g. `unrealrobin` for `unrealrobin/die-robot`). Pick something stable. Your slug becomes part of every URL your players hit.
- Already have an account? Just log in.

Credentials are stored at `~/.harbor/credentials.json`. The token lasts 72 hours; re-login from the menu when it expires.

## Step 3 — Move into your game's directory

Close `harbor` (pick **Exit**), then `cd` into the directory that contains the game executable you want to launch:

```powershell
cd C:\Games\DieRobot
```

Your final directory should look like this when you're done:

```
DieRobot\
  DieRobot.exe          ← Your game
  [game assets]
  harbor.config.json    ← Generated next step
  harbor.exe            ← Downloaded next step
```

Now run `harbor` again. Because you're in a directory without a `harbor.config.json` yet, the menu surfaces **Init** as your next step.

## Step 4 — Run `init`

Choose **Init** from the menu. The CLI walks you through:

1. **Confirm the target directory** — Yes / pick a different folder / cancel.
2. **Game name** — e.g. "Die Robot".
3. **Game slug** — auto-derived from the name; you can override. This becomes the second half of your `app_id` (e.g. `unrealrobin/die-robot`).
4. **Pick the game executable** — the CLI scans the directory for `.exe` files and offers a pick, or you can browse for one.
5. **Select modules** — Patch Notes, News, Dev Comments. All three are enabled by default; toggle any off with Space.
6. **Customize theme colors** — optional. Skip and customize later through **Configure → Theme**.

At the end of `init`, Harbor registers your game with the API, writes `harbor.config.json` to the current directory, and offers to download `harbor.exe` right away. Say yes to the download.

:::tip[If init fails partway]
If the API registration step errors out, **no config file is written**. This is intentional, so you never end up half-initialized. Just run `init` again.
:::

## Step 5 — Push your first piece of content

You can't ship a launcher with nothing to say. Push at least one Patch Note or News entry before going live.

Stay in your game's directory and run `harbor`. Pick **Push**. The CLI asks:

1. **What kind?** — Patch Notes / News / Dev Comments / Harbor Config.
2. **Title** — short, informative.
3. **Markdown file** — point to a `.md` file you've written.
4. **Optional image** — a header image for the entry. 1200×630 is the sweet spot. Skip if you don't have one yet.

The CLI uploads to the CDN and updates your server-side index. Your players will see this entry the next time they launch the game.

Push at least one entry to each module you enabled. If you enabled News and Dev Comments but only push Patch Notes, those tabs will render empty.

## Step 6 — Test it locally

Run `harbor` from your game directory. Now that you have both a `harbor.config.json` **and** a `harbor.exe`, the menu shows **LaunchHarbor**.

Pick it. Harbor opens, reads your local config, fetches the content you pushed from the CDN, and renders the launcher. Click around (Home, your enabled module tabs, the Play button). When you click Play, your game launches and Harbor minimizes. This is exactly what your players will experience.

If something looks off (wrong colors, wrong title, missing modules), close Harbor, run `harbor` → **Configure** to adjust, and `LaunchHarbor` again.

## Step 7 — Ship `harbor.exe` with your game

This is the only Steam-side step.

1. Make sure `harbor.exe` and `harbor.config.json` are both in the same directory as your game executable, and that they're included in the build you upload to Steam.
2. In Steamworks, edit your game's launch options and **change the launch target from `YourGame.exe` to `harbor.exe`**.
3. Upload a new build (or update the launch config) and push to a beta branch first if you have one.

Now when a player clicks Play in Steam, Harbor opens first, shows your content, and launches your game when they click Play in the launcher.

:::caution[Before you ship]
Walk through the [Pre-submission checklist](/docs/customization#pre-submission-checklist) in the customization guide. Confirm your assets are sized correctly, your modules have content, and the Play button actually launches your game from a clean install.
:::

## Common menu items you'll use later

The `harbor` REPL menu adapts based on your state. Useful items:

- **Push** — upload new patch notes, news, dev comments, or an updated `harbor.config.json`.
- **Configure** — edit branding, theme colors, and modules without re-running `init`.
- **Change Game Exe** — repoint Harbor at a different game executable.
- **Download** — refresh `harbor.exe` to the latest release. Check periodically; new launcher releases ship regularly.
- **Import Remote Config** — pull your live `harbor.config.json` onto a new machine or for a teammate.
- **LaunchHarbor** — local smoke test, as in step 6.

## When things go wrong

Harbor degrades gracefully by design. If the CDN is unreachable when a player launches, the affected module silently hides and the **Play button still works**. Harbor cannot brick a player's launch.

Common gotchas:

- **`harbor` not found after install** — open a new terminal. PATH only updates for terminals started after install.
- **`init` errors at the API step** — usually a stale token. Pick **Logout**, then **Login** again.
- **Launcher boots but shows empty tabs** — you enabled a module but haven't pushed content to it. Run **Push**.
- **Wrong game launches on Play** — run **Change Game Exe** and pick the right `.exe`.
- **Hash mismatch on Download** — the CLI refuses a `harbor.exe` whose Blake3 doesn't match the server's record. Try **Download** again; if it persists, email me.

For anything not on this list: **robin@paracosm.gg**. If it's blocking you, put `blocker` in the subject.
