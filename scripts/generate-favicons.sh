#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

SOURCE="static/logo-square.png"

if ! command -v sips >/dev/null 2>&1; then
  echo "Error: 'sips' not found. This script is intended for macOS." >&2
  exit 1
fi

if [[ ! -f "$SOURCE" ]]; then
  echo "Error: missing $SOURCE (expected a square logo for favicons)" >&2
  exit 1
fi

echo "Generating favicon assets from $SOURCE ..."

# PNG favicons
sips -Z 16 "$SOURCE" -s format png -o static/favicon-16x16.png >/dev/null
sips -Z 32 "$SOURCE" -s format png -o static/favicon-32x32.png >/dev/null
sips -Z 180 "$SOURCE" -s format png -o static/apple-touch-icon.png >/dev/null
sips -Z 192 "$SOURCE" -s format png -o static/android-chrome-192x192.png >/dev/null
sips -Z 512 "$SOURCE" -s format png -o static/android-chrome-512x512.png >/dev/null

# favicon.ico (single 32x32 entry; good enough for most browsers)
sips -Z 32 "$SOURCE" -s format ico -o static/favicon.ico >/dev/null

echo "Done. Verify sizes:"
for f in \
  static/favicon-16x16.png \
  static/favicon-32x32.png \
  static/apple-touch-icon.png \
  static/android-chrome-192x192.png \
  static/android-chrome-512x512.png; do
  echo "  $f"
  sips -g pixelWidth -g pixelHeight "$f" | sed 's/^/    /'
done

echo "  static/favicon.ico"
file static/favicon.ico | sed 's/^/    /'


