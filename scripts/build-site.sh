#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$SCRIPT_DIR/.."

# 1. Build the site
echo "Building site..."
npx vite build --config "$ROOT/vite.config.site.js"

# 2. Copy CDN bundle and theme CSS
echo "Copying library assets..."
mkdir -p "$ROOT/dist-site/dist"
cp "$ROOT/dist/wox-gui.cdn.js" "$ROOT/dist-site/dist/"
cp "$ROOT/dist/wox-theme.css" "$ROOT/dist-site/dist/"

# 3. Copy demo pages
echo "Copying demo pages..."
mkdir -p "$ROOT/dist-site/demo"
cp "$ROOT/demo/"*.html "$ROOT/dist-site/demo/"

# 4. Patch demo imports
echo "Patching demo imports..."
for f in "$ROOT/dist-site/demo/"*.html; do
    sed -i 's|../src/register.js|../dist/wox-gui.cdn.js|g' "$f"
    sed -i 's|../src/index.js|../dist/wox-gui.cdn.js|g' "$f"
    sed -i 's|../css/wox-theme.css|../dist/wox-theme.css|g' "$f"
done

echo "Site built to dist-site/"
