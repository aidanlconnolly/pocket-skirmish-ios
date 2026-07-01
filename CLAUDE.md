# CLAUDE.md

Guidance for Claude Code when working in this repo.

## What this is

`pocket-skirmish-ios` is a thin **Expo 51 / React Native** shell that ships the web game
**Pocket Skirmish** to the iOS App Store inside a full-screen `WebView`. The game itself is a
single self-contained HTML/Canvas file with **no network calls**, so it runs entirely offline
once bundled.

- [`App.js`](App.js) — the entire app (~54 lines): on launch it reads `assets/game.html` as an
  Expo asset (`expo-asset` + `expo-file-system`), then hands the raw HTML string to a
  `react-native-webview` `<WebView source={{ html }}>`. Scroll/bounce/zoom disabled so the game
  owns the whole screen (the game's own pan/zoom camera handles navigation).
- [`app.json`](app.json) — Expo config: **landscape**, dark UI, `requireFullScreen`, status bar
  hidden, bundle id **`com.aidanlconnolly.pocketskirmish`** (permanent once registered — change
  before the first EAS build if ever needed).
- [`metro.config.js`](metro.config.js) — the only non-default bit: pushes `html` onto
  `resolver.assetExts` so Metro will bundle `game.html` as an asset.
- [`eas.json`](eas.json) — EAS build/submit profiles (`development` / `preview` sim / `production`).

## ⚠️ The game is a COPY — edit the source, not the bundle

`assets/game.html` is a **generated copy** of the real source, which lives in a **separate
project**: `../Pocket Skirmish/index.html` (its own git repo, auto-deploys to Vercel).

**Never hand-edit `assets/game.html`.** To change the game:

1. Edit `../Pocket Skirmish/index.html` (the source of truth).
2. Re-sync the bundle:
   ```bash
   npm run sync-game     # cp '../Pocket Skirmish/index.html' assets/game.html
   ```
3. Commit `assets/game.html` here (and the source in its own repo).

There is also a scratch preview copy at `/tmp/pocket-skirmish/index.html` used by the Claude Code
preview server (port 5220) — same "copy from source" pattern.

## Running locally

`node` is at `/opt/homebrew/bin` and is **not on PATH** by default — prefix commands:

```bash
PATH=/opt/homebrew/bin:$PATH npm install
PATH=/opt/homebrew/bin:$PATH npx expo start --ios   # iOS simulator
```

To preview just the game in a browser (faster iteration), open the source
`../Pocket Skirmish/index.html` directly, or use the preview server on port 5220.

## Shipping to the App Store

Full runbook is in [`README.md`](README.md) and the workspace's `../IOS_DEPLOY_PLAYBOOK.md`
(the `/deploy-to-ios` skill). Steps that need the owner's accounts (can't be automated here):

1. **Apple Developer Program** membership on `aidanlconnolly@gmail.com`.
2. Add **`assets/icon.png` (1024×1024)** + splash and wire them in `app.json` — the store rejects
   builds with no icon.
3. `npx eas login` → `npx eas build:configure` → `npx eas build --platform ios --profile production`.
4. Create the app in App Store Connect → `npx eas submit --platform ios --latest`.

Outstanding before submit: deps not installed, no icon/splash yet, not yet verified in the sim.

## Repos

- **This repo (native shell):** `github.com/aidanlconnolly/pocket-skirmish-ios`
- **The web game (source of truth):** `github.com/aidanlconnolly/pocket-skirmish` — pushing to its
  `main` auto-deploys the browser version to Vercel.
