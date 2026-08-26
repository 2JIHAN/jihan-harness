#!/usr/bin/env node
// Step 3 — Send a single turn of instruction to an open session.
// Reusing sessions preserves context and runs 5x faster (Cold: 11s -> Warm: 2s).
// Usage: node 03-say.mjs "Instruction" [account] [sessionName]

import { ask, resolveSession, tailOf } from './lib.mjs';

const message = process.argv[2];
const account = process.argv[3] || 'u1';
const name = process.argv[4];

if (!message) {
  console.error('Usage: node 03-say.mjs "Instruction" [account] [sessionName]');
  process.exit(1);
}

console.log(tailOf(ask(account, message, resolveSession(account, name)), 12));
