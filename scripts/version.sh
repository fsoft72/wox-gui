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

YELLOW="\033[1;33m"
RESET="\033[0m"

warn() { echo -e "  ${YELLOW}WARNING: $*${RESET}" >&2; }

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

# Warn if pattern not found in file, then substitute.
# Usage: sed_replace <file> <pattern> <replacement>
sed_replace() {
  local file="$1" pattern="$2" replacement="$3"
  if ! grep -qF "$pattern" "$file"; then
    warn "'$pattern' not found in $file - skipping"
    return
  fi
  sed -i "s/${pattern//\//\\/}/${replacement//\//\\/}/g" "$file"
  echo "  Updated $file"
}

# CDN URLs: @0.1.5 -> @0.1.6
for f in AGENT.md tests/cdn.html llms.md site/index.html; do
  if [ -f "$f" ]; then
    sed_replace "$f" "@${CURRENT_VERSION}" "@${NEW_VERSION}"
  else
    warn "file not found: $f"
  fi
done

# Footer version: v0.1.5 -> v0.1.6
if [ -f site/index.html ]; then
  sed_replace "site/index.html" "v${CURRENT_VERSION}" "v${NEW_VERSION}"
fi

# About modal version in demo/catalog.html
if [ -f demo/catalog.html ]; then
  sed_replace "demo/catalog.html" "v${CURRENT_VERSION}" "v${NEW_VERSION}"
else
  warn "file not found: demo/catalog.html"
fi

echo ""
echo "Bumped to v$NEW_VERSION"
echo "Files changed: package.json, AGENT.md, tests/cdn.html, llms.md, site/index.html, demo/catalog.html"
