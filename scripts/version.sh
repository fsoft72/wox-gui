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

# --- Update version references in AGENT.md, tests/cdn.html, and llms.md ---

for f in AGENT.md tests/cdn.html llms.md; do
  if [ -f "$f" ]; then
    sed -i "s/@${CURRENT_VERSION}/@${NEW_VERSION}/g" "$f"
    echo "  Updated $f"
  fi
done

echo ""
echo "Bumped to v$NEW_VERSION"
echo "Files changed: package.json, AGENT.md, tests/cdn.html, llms.md"
