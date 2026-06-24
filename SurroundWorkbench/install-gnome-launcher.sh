#!/usr/bin/env bash
# Installs a GNOME application launcher for Surround Workbench.
# - Drops a .desktop entry into ~/.local/share/applications/
# - Copies a shortcut to the user's Desktop (when it exists)
# - Marks the desktop shortcut trusted via gio metadata (Nautilus)
# - Also installs the bundled SVG icon into hicolor (so it survives a folder move)
#
# Re-run safely any time; it overwrites the existing entries.

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
XDG_DATA_HOME_DIR="${XDG_DATA_HOME:-$HOME/.local/share}"
APPLICATIONS_DIR="$XDG_DATA_HOME_DIR/applications"
ICON_THEME_DIR="$XDG_DATA_HOME_DIR/icons/hicolor/scalable/apps"
SYMBOLIC_THEME_DIR="$XDG_DATA_HOME_DIR/icons/hicolor/symbolic/apps"

if command -v xdg-user-dir >/dev/null 2>&1; then
  RESOLVED_DESKTOP_DIR="$(xdg-user-dir DESKTOP 2>/dev/null || true)"
else
  RESOLVED_DESKTOP_DIR=""
fi
DESKTOP_DIR="${XDG_DESKTOP_DIR:-${RESOLVED_DESKTOP_DIR:-$HOME/Desktop}}"
LAUNCHER_NAME="surround-workbench.desktop"
APP_LAUNCHER="$APPLICATIONS_DIR/$LAUNCHER_NAME"
DESKTOP_LAUNCHER="$DESKTOP_DIR/$LAUNCHER_NAME"

# Source icon shipped with the project
SOURCE_ICON="$SCRIPT_DIR/icons/surround-workbench.svg"
SOURCE_SYMBOLIC="$SCRIPT_DIR/icons/surround-workbench-symbolic.svg"
# Targets inside the user's icon theme (so they survive folder moves —
# GNOME will look them up by name).
THEME_ICON_TARGET="$ICON_THEME_DIR/surround-workbench.svg"
SYMBOLIC_TARGET="$SYMBOLIC_THEME_DIR/surround-workbench-symbolic.svg"

mkdir -p "$APPLICATIONS_DIR" "$ICON_THEME_DIR" "$SYMBOLIC_THEME_DIR"
chmod +x "$SCRIPT_DIR/launch-app.sh"

# Copy the full-colour icon into the user icon theme.
if [ -f "$SOURCE_ICON" ]; then
  cp -f "$SOURCE_ICON" "$THEME_ICON_TARGET"
  ICON_FIELD="surround-workbench"        # icon-theme lookup name
  echo "Installed app icon: $THEME_ICON_TARGET"
else
  echo "WARNING: bundled icon not found at $SOURCE_ICON — falling back to system icon"
  ICON_FIELD="multimedia-volume-control"
fi

# Copy the symbolic (panel / tray) icon too.
if [ -f "$SOURCE_SYMBOLIC" ]; then
  cp -f "$SOURCE_SYMBOLIC" "$SYMBOLIC_TARGET"
  echo "Installed symbolic icon: $SYMBOLIC_TARGET"
fi

cat > "$APP_LAUNCHER" <<EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=Surround Workbench
GenericName=7.1 Surround EQ Planner
Comment=Plan a 7.1 surround playback chain and generate PulseAudio LADSPA config
Exec=/bin/bash -lc "cd $(printf '%q' "$SCRIPT_DIR") && ./launch-app.sh"
Path=$SCRIPT_DIR
Icon=$ICON_FIELD
Terminal=true
Categories=AudioVideo;Audio;Mixer;Utility;
Keywords=audio;surround;pulseaudio;ladspa;equalizer;7.1;
StartupNotify=true
StartupWMClass=surround-workbench
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

# Refresh GNOME's caches if the helpers are available.
if command -v update-desktop-database >/dev/null 2>&1; then
  update-desktop-database "$APPLICATIONS_DIR" >/dev/null 2>&1 || true
fi
if command -v gtk-update-icon-cache >/dev/null 2>&1; then
  gtk-update-icon-cache -f -t "$XDG_DATA_HOME_DIR/icons/hicolor" >/dev/null 2>&1 || true
fi

echo "Installed GNOME launcher: $APP_LAUNCHER"
echo "Icon name registered:    $ICON_FIELD (+ ${ICON_FIELD}-symbolic for panel/tray)"
echo "Search for 'Surround Workbench' in the GNOME Activities overview."
