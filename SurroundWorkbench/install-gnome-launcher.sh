#!/usr/bin/env bash
# Installs a GNOME application launcher for Surround Workbench.
# - Drops a .desktop entry into ~/.local/share/applications/
# - Copies a shortcut to the user's Desktop (when it exists)
# - Marks the desktop shortcut trusted via gio metadata (Nautilus)
#
# Re-run safely any time; it overwrites the existing entries.

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
XDG_DATA_HOME_DIR="${XDG_DATA_HOME:-$HOME/.local/share}"
APPLICATIONS_DIR="$XDG_DATA_HOME_DIR/applications"

if command -v xdg-user-dir >/dev/null 2>&1; then
  RESOLVED_DESKTOP_DIR="$(xdg-user-dir DESKTOP 2>/dev/null || true)"
else
  RESOLVED_DESKTOP_DIR=""
fi
DESKTOP_DIR="${XDG_DESKTOP_DIR:-${RESOLVED_DESKTOP_DIR:-$HOME/Desktop}}"
LAUNCHER_NAME="surround-workbench.desktop"
APP_LAUNCHER="$APPLICATIONS_DIR/$LAUNCHER_NAME"
DESKTOP_LAUNCHER="$DESKTOP_DIR/$LAUNCHER_NAME"

mkdir -p "$APPLICATIONS_DIR"
chmod +x "$SCRIPT_DIR/launch-app.sh"

cat > "$APP_LAUNCHER" <<EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=Surround Workbench
GenericName=7.1 Surround EQ Planner
Comment=Plan a 7.1 surround playback chain and generate PulseAudio LADSPA config
Exec=/bin/bash -lc "cd $(printf '%q' "$SCRIPT_DIR") && ./launch-app.sh"
Path=$SCRIPT_DIR
Icon=multimedia-volume-control
Terminal=true
Categories=AudioVideo;Audio;Mixer;Utility;
Keywords=audio;surround;pulseaudio;pipewire;equalizer;7.1;ladspa;
StartupNotify=true
EOF

chmod +x "$APP_LAUNCHER"

if [ -d "$DESKTOP_DIR" ]; then
  cp "$APP_LAUNCHER" "$DESKTOP_LAUNCHER"
  chmod +x "$DESKTOP_LAUNCHER"
  if command -v gio >/dev/null 2>&1; then
    gio set "$DESKTOP_LAUNCHER" "metadata::trusted" true 2>/dev/null || true
  fi
  echo "Desktop shortcut: $DESKTOP_LAUNCHER"
fi

# Refresh GNOME's icon/desktop cache if the helper is available.
if command -v update-desktop-database >/dev/null 2>&1; then
  update-desktop-database "$APPLICATIONS_DIR" >/dev/null 2>&1 || true
fi

echo "Installed GNOME launcher: $APP_LAUNCHER"
echo "Search for 'Surround Workbench' in the GNOME Activities overview."
