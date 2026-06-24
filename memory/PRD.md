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
