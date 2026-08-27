# pre-commit Hook

A deterministic Git hook that blocks linter/formatter config weakening and prevents accidental commits of secrets and credentials.

## Features

1. **Config Protection**: Blocks AI agents from weakening linter, formatter, and compiler configurations (e.g. `eslint.config.js`, `.prettierrc`, `biome.json`, `ruff.toml`) to make checks pass. First-time file creation is allowed; modifications to existing configs are blocked.
2. **Secret Guard**: Immediately rejects staged commits containing `.env` files, private keys (`*.pem`, `*.key`), and SSH credentials (`id_rsa`, `id_ed25519`).

## Installation

### In Current Repository
```bash
bash hooks/pre-commit/install.sh
```

### In Another Project
```bash
bash hooks/pre-commit/install.sh /path/to/project
```
