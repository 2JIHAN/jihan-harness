#!/usr/bin/env bash
# hooks/install.sh — Master installer for all hooks in jihan-harnesslake
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="${1:-.}"

echo "📦 Installing hooks to $TARGET_DIR..."

if [ -f "$SCRIPT_DIR/commit-msg/install.sh" ]; then
  bash "$SCRIPT_DIR/commit-msg/install.sh" "$TARGET_DIR"
fi

if [ -f "$SCRIPT_DIR/pre-commit/install.sh" ]; then
  bash "$SCRIPT_DIR/pre-commit/install.sh" "$TARGET_DIR"
fi

echo "✨ All hooks installed successfully."
