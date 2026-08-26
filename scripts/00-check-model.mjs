#!/usr/bin/env node
// Step 0 — Inspect configured model state and provider connectivity.
//
// Verification items:
//   Configured   Default model defined in settings.json
//   Last used    Model recorded in recent session log (verifies daemon reload delay)
//   Provider     Connectivity check if using a local proxy endpoint
//
// Usage: node 00-check-model.mjs [account]

import { defaultAccount, defaultModel, lastUsedModel, providerBaseUrl } from './lib.mjs';

const account = process.argv[2] || defaultAccount();
const set = defaultModel(account);
const used = lastUsedModel(account);

console.log(`Configured:   ${set.provider}/${set.modelId}`);
if (used) {
  const t = used.at.toTimeString().slice(0, 8);
  const same = used.provider === set.provider && used.modelId === set.modelId;
  console.log(`Last used:    ${used.provider}/${used.modelId}  (${t})${same ? '' : '  <- differs from configured'}`);
  if (!same) console.log('  If settings were modified on disk, the daemon may take a moment to reload.');
} else {
  console.log('Last used:    (no history recorded)');
}

const base = providerBaseUrl(account);
if (base) {
  try {
    const res = await fetch(`${base}/health`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      console.log(`\nProvider "${set.provider}" (${base}): connected successfully`);
    } else {
      console.log(`\nProvider "${set.provider}" (${base}) error: HTTP ${res.status}`);
    }
  } catch {
    console.log(`\nCannot connect to provider "${set.provider}" (${base}). Ensure local proxy is running.`);
  }
} else {
  console.log(`\nProvider "${set.provider}" — Aside built-in or cloud provider configuration`);
}
