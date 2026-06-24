# Surround Workbench — Standalone GNOME Linux App

## Original problem statement
> "can you convert this app to run on linux laptop using the Gnome desktop."
> Follow-up: "Migrate off base44 and convert to run as a stand alone app using
> local storage as runnable folder."

## Source
Provided artifact: `Surround-Sound-Equalizer-v1.zip` — a Retool/base44 export of
a 7.1 surround EQ planner that generates PulseAudio LADSPA configuration.

## Architecture (post-migration)
- **Type**: Single-page web app served locally; standalone runnable folder.
- **Frontend stack**: Vite 6 + React 18 + TypeScript + Tailwind CSS 3 + Radix UI
  primitives (shadcn-style local components). No backend.
- **Storage**: `window.localStorage` (key: `surround-workbench-state-v1`).
- **Distribution**: Folder `SurroundWorkbench/` containing scripts + `frontend/`
  source. Zipped as `SurroundWorkbench-standalone.zip` (65 KB).
- **Launchers**:
  - `launch-app.sh` — detects pnpm/npm/yarn, installs deps on first run,
    builds production bundle into `frontend/dist/`, serves it via
    `python3 -m http.server` on `127.0.0.1:5173`, auto-opens default browser.
  - `launch-dev.sh` — Vite dev server (hot reload).
  - `install-gnome-launcher.sh` — registers a `.desktop` entry under
    `~/.local/share/applications/`, copies a desktop shortcut, runs
    `gio set metadata::trusted true`, refreshes `update-desktop-database`.
  - `SurroundWorkbench.desktop` — editable template.

## Removed dependencies (vs. original)
- base44 SDK (`@base44/sdk`, `createClient`, `appParams`).
- Retool runtime: `lib/shadcn/*` aliases, `hooks/backend/system/useGetProjectStatus`.
- `backend/system/getProjectStatus.ts` (replaced with static data in
  `utils/surroundWorkbench.ts → projectStatus`).
- Retool/Vite native-preview TypeScript compiler, ~30 unused @radix-ui packages,
  recharts, embla, vaul, sonner, react-router (kept only what the page uses).

## Features (verified working)
- Channel calibration sliders for all 8 channels (FL/FR/FC/LFE/RL/RR/SL/SR)
  with live "net gain" output reflecting master gain offset.
- Speaker layout grid with reference 7.1 placement around listener.
- Master gain slider + subwoofer crossover slider (60–120 Hz).
- 15-band EQ with 4 library presets (Flat / Cinema / Night / Voice) + Custom.
- Editable LADSPA plugin name/label + generated sink name + hardware master sink.
- Live-generated PulseAudio config preview with deployment-note header.
- "Copy config" (Clipboard API with `document.execCommand` fallback) and new
  "Download .pa" file action.
- Publish-readiness checklist (3 checks, all turn green by default).
- Tabs: Routing / Equalizer / Commands / Notes.
- Dark theme with teal/emerald accent palette (departing from Retool's white/violet).

## Files
- `/app/SurroundWorkbench/` — full source.
- `/app/SurroundWorkbench-standalone.zip` — distributable zip (65 KB, 43 files).

## Verified
- `yarn install && yarn build` succeeds cleanly (cold install from zip).
- Vite preview served bundle screenshots cleanly; all tabs render; localStorage
  persistence confirmed via DevTools eval.
- ESLint: no issues across the codebase.

## Next / backlog (P2)
- True desktop binary via Tauri (Rust webview) — ~5 MB, no Node at runtime.
- AppImage / Flatpak packaging for one-file distribution.
- Optional in-app **runtime apply**: invoke `pactl load-module` from a tiny
  companion CLI helper (would require packaging the helper alongside the app).
- Import/export workbench state as JSON file (in addition to the .pa download).
- Multiple saved profiles (movie / music / chat) selectable from the header.

## How the user runs it
```bash
unzip SurroundWorkbench-standalone.zip
cd SurroundWorkbench
chmod +x launch-app.sh install-gnome-launcher.sh
./launch-app.sh                  # first run installs + builds + opens browser
./install-gnome-launcher.sh      # optional: adds to GNOME Activities
```

## Update — Custom 7.1-speaker app icon (this session)
- Added `icons/surround-workbench.svg` — distinctive teal-on-dark app tile showing
  7 speakers arrayed around a centre listener with an LFE cabinet between them
  and a small "7.1" wordmark. Renders cleanly at 48 / 96 / 256 px.
- `install-gnome-launcher.sh` now also copies the SVG into
  `~/.local/share/icons/hicolor/scalable/apps/surround-workbench.svg`, runs
  `gtk-update-icon-cache`, and registers `Icon=surround-workbench` (icon-theme
  lookup name) on the `.desktop` entry. The icon then survives moving / renaming
  the project folder.
- `frontend/index.html` now links the same SVG as the browser tab favicon
  (served from `frontend/public/surround-workbench.svg`).
- `SurroundWorkbench.desktop` template updated. README has a new
  "Custom app icon" section explaining how to replace the icon.
- Zip rebuilt: **`/app/SurroundWorkbench-standalone.zip` (70 KB, 45 files)** —
  cold-install verified (`unzip → yarn install → yarn build` succeeds).

## Update — Symbolic (monochrome) GNOME icon (this session)
- Added `icons/surround-workbench-symbolic.svg` — 16×16 single-colour mark
  (#2e3436) that the GTK symbolic-icon pipeline recolours per panel/theme.
  Geometry mirrors the full-colour mark (centre listener + 7 speakers + LFE).
- `install-gnome-launcher.sh` now also copies the symbolic SVG to
  `~/.local/share/icons/hicolor/symbolic/apps/surround-workbench-symbolic.svg`.
  GNOME auto-picks it wherever a symbolic icon is appropriate (top-panel
  notifications, tray indicators, dim/active states).
- README updated with a two-icon table and replacement instructions.
- Cold-install verification in a sandboxed `XDG_DATA_HOME`: both icons land
  in their hicolor locations, `gtk-update-icon-cache` builds, `.desktop`
  references `Icon=surround-workbench`. Bash syntax check passes.
- Zip rebuilt: **`/app/SurroundWorkbench-standalone.zip` (72 KB, 50 files)**.

## Update — Public download landing page (this session)
- Added a self-contained marketing/download site at **`landing/`**:
  Vite + React + TypeScript + Tailwind v3. Distinct typography (Bricolage
  Grotesque + JetBrains Mono), dark teal/emerald aesthetic with grain texture,
  aura gradients, reveal-in animation. 8 section components, all <100 lines.
  Sections: Nav, Hero (with framed product screenshot), TrustStrip,
  Features (4 cards), Install (4 numbered code-block steps with copy buttons),
  Gallery (4 product screenshots), ConfigPreview (live .pa example), Faq, Footer.
- Single source of truth: **`landing/src/config.ts`** holds `GITHUB_REPO`,
  `DOWNLOAD_URL`, `VERSION`, `AUTHOR`. User edits these once after creating
  their GitHub Release.
- Captured 5 production screenshots of the app into
  `landing/public/screenshots/` (hero, routing, equalizer, commands, notes).
- Added GitHub Actions workflow **`.github/workflows/deploy-landing.yml`**
  that auto-builds `landing/` and publishes to GitHub Pages on push to `main`.
- `landing/README.md` documents config edits, local dev, and three deployment
  paths (Actions, manual gh-pages, third-party static host).
- Main README updated with a pointer to `landing/`.
- Bundle size: landing builds to **~190 KB gzip** total (HTML+CSS+JS+icon),
  plus ~450 KB of screenshot JPEGs.
- Cold-install verification: both `frontend/` and `landing/` build cleanly
  from a fresh unzip; ESLint passes on both.
- Zip rebuilt: **`/app/SurroundWorkbench-standalone.zip` — 454 KB, 88 files**.
