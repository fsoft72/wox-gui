#!/usr/bin/env bash
#
# Publish wox-gui to npm.
# Usage: ./scripts/publish.sh [--force] [patch|minor|major|<version>]
#
# Steps:
#   1. Ensure working tree is clean
#   2. Run the build
#   3. Bump the version (via scripts/version.sh)
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

"$ROOT/scripts/version.sh" "$BUMP"
NEW_VERSION="$(node -p "require('./package.json').version")"

# --- Publish ---

echo "Publishing wox-gui@$NEW_VERSION to npm..."
npm publish --access public

# --- Git tag & commit ---

git add package.json AGENT.md tests/cdn.html llms.md site/index.html
git commit -m "chore: release v$NEW_VERSION"
git tag -a "v$NEW_VERSION" -m "v$NEW_VERSION"

echo ""
echo "Published wox-gui@$NEW_VERSION"
echo "Run 'git push && git push --tags' to push the release."
