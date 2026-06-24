#!/usr/bin/env bash
# Surround Workbench — local launcher
# - Installs JS dependencies on first run.
# - Builds the production bundle if missing.
# - Starts a tiny local static server and opens the default browser.
#
# Requirements: Node.js 20+ and either pnpm, npm, or yarn.

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$SCRIPT_DIR/frontend"
DIST_DIR="$FRONTEND_DIR/dist"

# Pick a package manager that exists on the user's machine.
pick_pm() {
  if command -v pnpm >/dev/null 2>&1; then
    echo "pnpm"
  elif command -v npm >/dev/null 2>&1; then
    echo "npm"
  elif command -v yarn >/dev/null 2>&1; then
    echo "yarn"
  else
    echo ""
  fi
}

PM="$(pick_pm)"

if [ -z "$PM" ]; then
  echo "Error: Node.js with one of pnpm/npm/yarn is required." >&2
  echo "  Fedora/openSUSE: sudo {dnf|zypper} install nodejs npm" >&2
  echo "  Ubuntu/Debian:  sudo apt install nodejs npm" >&2
  echo "  Arch:           sudo pacman -S nodejs npm" >&2
  exit 1
fi

cd "$FRONTEND_DIR"

# Install dependencies once.
if [ ! -d "node_modules" ]; then
  echo "[Surround Workbench] First run — installing dependencies with $PM…"
  case "$PM" in
    pnpm) pnpm install ;;
    npm)  npm install ;;
    yarn) yarn install ;;
  esac
fi

# Build the static bundle if missing or stale.
NEED_BUILD=0
if [ ! -d "$DIST_DIR" ] || [ ! -f "$DIST_DIR/index.html" ]; then
  NEED_BUILD=1
fi

if [ "$NEED_BUILD" -eq 1 ]; then
  echo "[Surround Workbench] Building production bundle…"
  case "$PM" in
    pnpm) pnpm build ;;
    npm)  npm run build ;;
    yarn) yarn build ;;
  esac
fi

PORT="${SURROUND_WB_PORT:-5173}"
URL="http://127.0.0.1:${PORT}/"

# Try to find a static HTTP server: prefer Python (always available on GNOME Linux).
serve_static() {
  if command -v python3 >/dev/null 2>&1; then
    echo "[Surround Workbench] Serving $DIST_DIR on $URL (python3 -m http.server)"
    cd "$DIST_DIR"
    exec python3 -m http.server --bind 127.0.0.1 "$PORT"
  elif command -v python >/dev/null 2>&1; then
    echo "[Surround Workbench] Serving $DIST_DIR on $URL (python -m http.server)"
    cd "$DIST_DIR"
    exec python -m http.server --bind 127.0.0.1 "$PORT"
  else
    # Fallback to vite preview which always works (node-based).
    echo "[Surround Workbench] Serving via vite preview on $URL"
    cd "$FRONTEND_DIR"
    case "$PM" in
      pnpm) exec pnpm preview --host 127.0.0.1 --port "$PORT" ;;
      npm)  exec npm run preview -- --host 127.0.0.1 --port "$PORT" ;;
      yarn) exec yarn preview --host 127.0.0.1 --port "$PORT" ;;
    esac
  fi
}

# Open the default browser after a short delay (non-blocking).
(
  sleep 1
  if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$URL" >/dev/null 2>&1 || true
  elif command -v gio >/dev/null 2>&1; then
    gio open "$URL" >/dev/null 2>&1 || true
  fi
) &

serve_static
