#!/usr/bin/env bash
# Development launcher for Surround Workbench — runs the Vite dev server
# (hot reload). Use launch-app.sh for the production build.

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

pick_pm() {
  if command -v pnpm >/dev/null 2>&1; then echo "pnpm";
  elif command -v npm >/dev/null 2>&1; then echo "npm";
  elif command -v yarn >/dev/null 2>&1; then echo "yarn";
  else echo ""; fi
}
PM="$(pick_pm)"
[ -z "$PM" ] && { echo "Need Node.js with pnpm/npm/yarn"; exit 1; }

cd "$FRONTEND_DIR"
[ -d node_modules ] || { echo "Installing deps with $PM…"; $PM install; }

case "$PM" in
  pnpm) exec pnpm dev --host 127.0.0.1 --port 5173 ;;
  npm)  exec npm run dev -- --host 127.0.0.1 --port 5173 ;;
  yarn) exec yarn dev --host 127.0.0.1 --port 5173 ;;
esac
