#!/usr/bin/env bash
# install.sh — Unified installer for jihan-workflow (Hooks, Rules, Skills)
#
# Usage:
#   ./install.sh [options] [target_path]
#
# Options:
#   --all       Install everything (Hooks, Rules, Skills) [Default]
#   --hooks     Install Git physical hooks only
#   --rules     Install AI rules (.agents/rules/ and AGENTS.md wiring)
#   --skills    Install Agent skills (.agents/skills/)
#   --link      Create symbolic links instead of copying files
#   --help, -h  Display this help message

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="."
USE_SYMLINK=false

INSTALL_HOOKS=false
INSTALL_RULES=false
INSTALL_SKILLS=false
EXPLICIT_SELECTION=false

# 1. Parse Arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --all)
      INSTALL_HOOKS=true
      INSTALL_RULES=true
      INSTALL_SKILLS=true
      EXPLICIT_SELECTION=true
      shift
      ;;
    --hooks)
      INSTALL_HOOKS=true
      EXPLICIT_SELECTION=true
      shift
      ;;
    --rules)
      INSTALL_RULES=true
      EXPLICIT_SELECTION=true
      shift
      ;;
    --skills)
      INSTALL_SKILLS=true
      EXPLICIT_SELECTION=true
      shift
      ;;
    --link)
      USE_SYMLINK=true
      shift
      ;;
    -h|--help)
      sed -n '2,13p' "$0" | sed 's/^# //' | sed 's/^#//'
      exit 0
      ;;
    *)
      if [[ "$1" != -* ]]; then
        TARGET_DIR="$1"
      else
        echo "❌ Unknown option: $1" >&2
        echo "Run './install.sh --help' for usage." >&2
        exit 1
      fi
      shift
      ;;
  esac
done

# Default to --all if no specific category is specified
if [ "$EXPLICIT_SELECTION" = false ]; then
  INSTALL_HOOKS=true
  INSTALL_RULES=true
  INSTALL_SKILLS=true
fi

# Resolve Target Directory
mkdir -p "$TARGET_DIR"
TARGET_DIR="$(cd "$TARGET_DIR" && pwd)"

echo "🚀 [jihan-workflow] Installing to: $TARGET_DIR"
echo "──────────────────────────────────────────────"

# 2. Install Hooks
if [ "$INSTALL_HOOKS" = true ]; then
  echo "🪝 Installing Git hooks..."
  GIT_DIR="$TARGET_DIR/.git"
  if [ ! -d "$GIT_DIR" ]; then
    echo "   ⚠️ Warning: $TARGET_DIR is not a git repository (.git not found)."
    echo "      Skipping Git hooks. Run 'git init' and rerun with --hooks to install."
  else
    if [ -f "$SCRIPT_DIR/hooks/install.sh" ]; then
      bash "$SCRIPT_DIR/hooks/install.sh" "$TARGET_DIR"
    fi
  fi
fi

# 3. Install Rules
if [ "$INSTALL_RULES" = true ]; then
  echo "📜 Installing AI rules..."
  RULES_TARGET="$TARGET_DIR/.agents/rules"
  mkdir -p "$RULES_TARGET"

  for rule_file in "$SCRIPT_DIR/rules/"*.md; do
    if [ -f "$rule_file" ]; then
      base_name="$(basename "$rule_file")"
      if [ "$USE_SYMLINK" = true ]; then
        ln -sf "$rule_file" "$RULES_TARGET/$base_name"
        echo "   🔗 Symlinked: .agents/rules/$base_name"
      else
        cp "$rule_file" "$RULES_TARGET/$base_name"
        echo "   📄 Copied: .agents/rules/$base_name"
      fi
    fi
  done

  # Dedicated hidden configuration folders (keeps project root clean)
  CLAUDE_DIR="$TARGET_DIR/.claude"
  GEMINI_DIR="$TARGET_DIR/.gemini"
  mkdir -p "$CLAUDE_DIR" "$GEMINI_DIR"

  CLAUDE_FILE="$CLAUDE_DIR/CLAUDE.md"
  GEMINI_FILE="$GEMINI_DIR/GEMINI.md"
  AGENTS_FILE="$TARGET_DIR/.agents/AGENTS.md"

  # Initialize guide files if not present
  for guide_file in "$CLAUDE_FILE" "$GEMINI_FILE" "$AGENTS_FILE"; do
    if [ ! -f "$guide_file" ]; then
      cat << 'EOF' > "$guide_file"
# Project Guidelines

This project adheres to the following workflow rules:
EOF
      echo "   📝 Created: $(echo "$guide_file" | sed "s|$TARGET_DIR/||")"
    fi
  done

  # Append @ references to all guide files
  for rule_file in "$SCRIPT_DIR/rules/"*.md; do
    if [ -f "$rule_file" ]; then
      base_name="$(basename "$rule_file")"
      ref_line="@.agents/rules/$base_name"
      for guide_file in "$CLAUDE_FILE" "$GEMINI_FILE" "$AGENTS_FILE"; do
        if ! grep -qF "$ref_line" "$guide_file"; then
          echo -e "\n$ref_line" >> "$guide_file"
        fi
      done
      echo "   🔌 Wired '$base_name' into .claude/CLAUDE.md, .gemini/GEMINI.md, and .agents/AGENTS.md"
    fi
  done
fi

# 4. Install Skills
if [ "$INSTALL_SKILLS" = true ]; then
  echo "🧰 Installing Agent skills..."
  SKILLS_TARGET="$TARGET_DIR/.agents/skills"
  mkdir -p "$SKILLS_TARGET"

  for skill_dir in "$SCRIPT_DIR/skills/"*; do
    if [ -d "$skill_dir" ]; then
      skill_name="$(basename "$skill_dir")"
      dest_dir="$SKILLS_TARGET/$skill_name"
      rm -rf "$dest_dir"
      if [ "$USE_SYMLINK" = true ]; then
        ln -sfn "$skill_dir" "$dest_dir"
        echo "   🔗 Symlinked skill: .agents/skills/$skill_name"
      else
        cp -R "$skill_dir" "$dest_dir"
        echo "   📁 Installed skill: .agents/skills/$skill_name"
      fi
    fi
  done

  # Wire Claude Code native skills discovery (.claude/skills)
  CLAUDE_DIR="$TARGET_DIR/.claude"
  mkdir -p "$CLAUDE_DIR"
  ln -sfn ../.agents/skills "$CLAUDE_DIR/skills"
  echo "   🔌 Wired: .claude/skills -> ../.agents/skills"
fi

echo "──────────────────────────────────────────────"
echo "✨ [jihan-workflow] Installation completed successfully!"
