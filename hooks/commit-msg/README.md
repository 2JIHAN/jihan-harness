# commit-msg Hook

A deterministic Git hook that enforces Conventional Commits, restricts the summary line to 72 characters, and completely blocks AI signatures and generated trailers.

## Features

1. **AI Signature Blocking**: Immediately rejects commits containing AI signatures (`🤖`, `Co-authored-by: Claude`, `Generated with`, etc.).
2. **Conventional Commits**: Enforces `<type>(<scope>): <summary>` format (supports `feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `chore`, `build`, `ci`, `style`, `revert`).
3. **Length & Punctuation Guard**: Rejects first lines longer than 72 characters or ending with a period (`.`).
4. **Merge & Revert Bypass**: Automatically allows merge commits, reverts, and squash/fixup commits.

## Installation

### In Current Repository
```bash
bash hooks/commit-msg/install.sh
```

### In Another Project
```bash
bash hooks/commit-msg/install.sh /path/to/project
```

### Global Git Configuration (Optional)
To use this hook across all repositories on your machine:
```bash
mkdir -p ~/.git-hooks
cp hooks/commit-msg/commit-msg ~/.git-hooks/
chmod +x ~/.git-hooks/commit-msg
git config --global core.hooksPath ~/.git-hooks
```

## Emergency Bypass

If you ever need to bypass this check for an urgent emergency commit:
```bash
git commit --no-verify -m "emergency fix"
```
