#!/usr/bin/env bash
# hooks/pre-commit/install.sh — Installs pre-commit hook into target git repo
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="${1:-.}"
GIT_DIR="$TARGET_DIR/.git"

if [ ! -d "$GIT_DIR" ]; then
  echo "❌ Error: $TARGET_DIR is not a git repository (.git not found)"
  exit 1
fi

HOOKS_DIR="$GIT_DIR/hooks"
mkdir -p "$HOOKS_DIR"

cp "$SCRIPT_DIR/pre-commit" "$HOOKS_DIR/pre-commit"
chmod +x "$HOOKS_DIR/pre-commit"

# Ensure core.hooksPath prioritizes local .git/hooks
git -C "$TARGET_DIR" config core.hooksPath .git/hooks

echo "✅ Installed pre-commit hook to $HOOKS_DIR/pre-commit"
