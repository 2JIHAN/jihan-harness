#!/usr/bin/env bash
# install.sh — Install commit-msg hook to a git repository
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HOOK_SRC="$SCRIPT_DIR/commit-msg"

TARGET_DIR="${1:-.}"
GIT_DIR="$TARGET_DIR/.git"

if [ ! -d "$GIT_DIR" ]; then
  echo "❌ Error: Not a git repository: $TARGET_DIR" >&2
  echo "Usage: bash install.sh [path-to-git-repo]" >&2
  exit 1
fi

HOOKS_DIR="$GIT_DIR/hooks"
mkdir -p "$HOOKS_DIR"
cp "$HOOK_SRC" "$HOOKS_DIR/commit-msg"
chmod +x "$HOOKS_DIR/commit-msg"

echo "✅ Installed commit-msg hook to $HOOKS_DIR/commit-msg"
