#!/usr/bin/env bash
#
# Publish wox-gui to npm.
# Usage: ./scripts/publish.sh [--force] [patch|minor|major|<version>]
#
# Steps:
#   1. Ensure working tree is clean
#   2. Run the build
#   3. Bump the version (default: patch)
#   4. Publish to npm
#   5. Create a git tag and commit the version bump
#
set -euo pipefail

FORCE=false
if [ "${1:-}" = "--force" ]; then
  FORCE=true
  shift
fi

BUMP="${1:-patch}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

cd "$ROOT"

# --- Pre-flight checks ---

if ! command -v pnpm &>/dev/null; then
  echo "Error: pnpm is not installed." >&2
  exit 1
fi

if ! command -v npm &>/dev/null; then
  echo "Error: npm is not installed." >&2
  exit 1
fi

if [ "$FORCE" = false ] && [ -n "$(git status --porcelain)" ]; then
  echo "Error: working tree is not clean. Commit or stash your changes first." >&2
  exit 1
fi

# --- Verify npm auth ---

if ! npm whoami &>/dev/null; then
  echo "Error: not logged in to npm. Run 'npm login' first." >&2
  exit 1
fi

# --- Build ---

echo "Building..."
pnpm run build

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
  fi
done

# --- Publish ---

echo "Publishing wox-gui@$NEW_VERSION to npm..."
npm publish --access public

# --- Git tag & commit ---

git add package.json AGENT.md tests/cdn.html llms.md
git commit -m "chore: release v$NEW_VERSION"
git tag -a "v$NEW_VERSION" -m "v$NEW_VERSION"

echo ""
echo "Published wox-gui@$NEW_VERSION"
echo "Run 'git push && git push --tags' to push the release."
