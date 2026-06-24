# Surround Workbench

A **local-first, standalone** GNOME Linux desktop app for planning a 7.1 surround
playback setup and generating a ready-to-paste PulseAudio LADSPA equalizer config.

This is a fully migrated rebuild of the original base44 / Retool web app:

- **No backend, no cloud account, no telemetry.** Everything you adjust is saved
  to your browser's `localStorage` and stays on your machine.
- **Vite + React + TypeScript + Tailwind + shadcn-style UI.**
- Ships with **GNOME launcher integration** (Activities search, app grid, optional
  desktop shortcut).

---

## Quick start (GNOME / Linux)

```bash
# 1. Unzip somewhere stable
unzip SurroundWorkbench-standalone.zip -d ~/
cd ~/SurroundWorkbench

# 2. Make the scripts executable
chmod +x launch-app.sh install-gnome-launcher.sh launch-dev.sh

# 3. Run it (will install deps and build on first run)
./launch-app.sh
```

The script:

1. Picks `pnpm` / `npm` / `yarn` (whichever is on your machine).
2. Installs frontend dependencies on first run.
3. Builds the static bundle into `frontend/dist/`.
4. Serves it on `http://127.0.0.1:5173/` via `python3 -m http.server`
   (or `vite preview` as fallback) and opens your default browser.

Press `Ctrl+C` in the terminal to stop the server.

## Install as a GNOME application

```bash
./install-gnome-launcher.sh
```

This creates `~/.local/share/applications/surround-workbench.desktop`, refreshes
the desktop database, and (when a Desktop folder exists) copies a shortcut to
the desktop and marks it trusted via `gio`.

After that, "Surround Workbench" shows up in:

- GNOME **Activities** search
- The **app grid**
- Your **Desktop** (if GNOME desktop icons are enabled)

## Requirements

- **Node.js 20+** with one of `pnpm`, `npm`, or `yarn`.
- A modern browser (any of Firefox / GNOME Web / Chromium will do).
- `python3` (already on every GNOME system) — used as the static file server.

### Install Node.js on common distros

```bash
# Fedora / RHEL
sudo dnf install nodejs npm

# openSUSE Tumbleweed
sudo zypper install nodejs npm

# Ubuntu / Debian
sudo apt install nodejs npm

# Arch / Manjaro
sudo pacman -S nodejs npm
```

## Project layout

```
SurroundWorkbench/
├── launch-app.sh                 # one-click runner (build + serve + open browser)
├── launch-dev.sh                 # dev server (hot reload)
├── install-gnome-launcher.sh     # GNOME .desktop registration
├── SurroundWorkbench.desktop     # editable launcher template
├── README.md
└── frontend/                     # Vite + React + TS app
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── orgTheme.css          # dark theme tokens
        ├── components/
        │   ├── ProjectSupportPanel.tsx
        │   └── ui/               # local shadcn components (button, card, …)
        ├── hooks/
        │   └── useLocalStorageState.ts
        ├── pages/
        │   └── SurroundWorkbench.tsx
        ├── lib/
        │   └── utils.ts          # cn() helper
        └── utils/
            └── surroundWorkbench.ts  # presets, channel data, static project status
```

## Where is my data stored?

In `localStorage` under the key `surround-workbench-state-v1` in whichever
browser you opened it with. Clearing site data wipes it.

To back up your tuning manually:

1. Open the app, open browser DevTools → **Application → Local Storage**.
2. Copy the value of `surround-workbench-state-v1`.
3. Save it to a file somewhere safe.

## Generated PulseAudio config

The **Commands** tab shows the file the app generates for you. Copy it (or use
the **Download .pa** button) into a user-level PulseAudio include, e.g.:

```bash
mkdir -p ~/.config/pulse/default.pa.d
mv ~/Downloads/surround71.pa ~/.config/pulse/default.pa.d/
pulseaudio -k && pulseaudio --start
```

The **Commands** tab also lists package install steps and validation commands
(speaker-test, pactl).

## Tweaking the theme / branding

- Colors and shadows: `frontend/src/orgTheme.css`
- Fonts: `--font-sans`, `--font-mono` in the same file
- Default state (presets, sink name, etc.): `frontend/src/utils/surroundWorkbench.ts`

## License

Personal-use port. The original surround/PulseAudio config templates are based
on community LADSPA mbeq examples.
