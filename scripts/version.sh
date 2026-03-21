#!/usr/bin/env bash
#
# Bump the wox-gui version and update all version references.
# Usage: ./scripts/version.sh [patch|minor|major|<version>]
#
# Updates:
#   - package.json
#   - AGENT.md
#   - tests/cdn.html
#   - llms.md
#   - site/index.html
#
set -euo pipefail

BUMP="${1:-patch}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

cd "$ROOT"

# --- Pre-flight checks ---

if ! command -v npm &>/dev/null; then
  echo "Error: npm is not installed." >&2
  exit 1
fi

# --- Version bump ---

CURRENT_VERSION="$(node -p "require('./package.json').version")"

if [[ "$BUMP" =~ ^[0-9]+\.[0-9]+\.[0-9]+ ]]; then
  NEW_VERSION="$BUMP"
else
  NEW_VERSION="$(npm version "$BUMP" --no-git-tag-version)"
  NEW_VERSION="${NEW_VERSION#v}"
fi

if [ "$BUMP" != "$NEW_VERSION" ] && [[ "$BUMP" =~ ^[0-9]+\.[0-9]+\.[0-9]+ ]]; then
  npm version "$NEW_VERSION" --no-git-tag-version >/dev/null
fi

echo "Version: $CURRENT_VERSION -> $NEW_VERSION"

# --- Update version references ---

# CDN URLs: @0.1.5 -> @0.1.6
for f in AGENT.md tests/cdn.html llms.md site/index.html; do
  if [ -f "$f" ]; then
    sed -i "s/@${CURRENT_VERSION}/@${NEW_VERSION}/g" "$f"
    echo "  Updated $f"
  fi
done

# Footer version: v0.1.5 -> v0.1.6
if [ -f site/index.html ]; then
  sed -i "s/v${CURRENT_VERSION}/v${NEW_VERSION}/g" site/index.html
fi

# About modal version in demo/catalog.html
if [ -f demo/catalog.html ]; then
  sed -i "s/v${CURRENT_VERSION}/v${NEW_VERSION}/g" demo/catalog.html
  echo "  Updated demo/catalog.html"
fi

echo ""
echo "Bumped to v$NEW_VERSION"
echo "Files changed: package.json, AGENT.md, tests/cdn.html, llms.md, site/index.html, demo/catalog.html"
