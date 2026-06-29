# Pocket Skirmish — iOS shell

A thin **Expo / React Native** wrapper that ships the web game ([`../Pocket Skirmish/index.html`](../Pocket%20Skirmish/index.html)) to the App Store inside a full-screen `WebView`. The game is pure HTML/Canvas with **no network calls**, so it runs entirely offline once bundled.

## Why a WebView wrapper?
The game is a single self-contained canvas app. Rebuilding it natively in React Native would be a large rewrite; wrapping the proven web build is the fastest, lowest-risk path to a shippable iOS binary. The whole game (`assets/game.html`) is read at launch and handed to the WebView as inline HTML.

## Keeping the game in sync
`assets/game.html` is a **copy** of the source `../Pocket Skirmish/index.html` (same pattern as the `/tmp` preview copy). After editing the game, re-copy it:

```bash
npm run sync-game        # cp '../Pocket Skirmish/index.html' assets/game.html
```

## Run locally
```bash
PATH=/opt/homebrew/bin:$PATH npm install
PATH=/opt/homebrew/bin:$PATH npx expo start --ios   # opens the iOS simulator
```

## Ship to the App Store
This follows the workspace's [`IOS_DEPLOY_PLAYBOOK.md`](../IOS_DEPLOY_PLAYBOOK.md) (a.k.a. the `/deploy-to-ios` skill). The steps that **need your accounts** (so they can't be fully automated here):

1. **Apple Developer Program** membership ($99/yr) on `aidanlconnolly@gmail.com`.
2. **App icon + splash** — add `assets/icon.png` (1024×1024) and a splash, then reference them in `app.json` (`expo.ios.icon`, `expo.splash`). The store rejects builds without an icon.
3. **EAS login & build:**
   ```bash
   npx eas login
   npx eas build:configure
   npx eas build --platform ios --profile production
   ```
4. **Create the app in App Store Connect** (name "Pocket Skirmish", bundle id `com.aidanlconnolly.pocketskirmish`), then:
   ```bash
   npx eas submit --platform ios --latest
   ```
5. Fill in store metadata (screenshots, description, age rating, privacy — "no data collected") and submit for review.

> Bundle id is preset to `com.aidanlconnolly.pocketskirmish` in `app.json` — change it if you prefer a different identifier **before** the first build (it's permanent once registered).

## What's still TODO before submitting
- [ ] `npm install` (deps not installed yet)
- [ ] Add `assets/icon.png` (1024×1024) + splash and wire them in `app.json`
- [ ] Verify in the iOS simulator (`npx expo start --ios`)
- [ ] EAS build + submit per the playbook
