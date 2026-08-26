#!/usr/bin/env node
// Inspect Aside profile configuration. Run this first before initiating workflows.
//
// Account IDs do not strictly match profile folder names (e.g. u1 is not "Profile 1").
// Use values discovered here rather than assuming mappings.
//
// Usage: node profiles.mjs [account]     Passing account verifies bridge connectivity as well.

import { browserReachable, getProfiles, isAppRunning, profileFor } from './lib.mjs';

const appRunning = isAppRunning();
const rows = getProfiles();

console.log(appRunning ? 'Aside is running' : 'Aside is closed (open column shows profiles restored on next launch)');
console.log('Account  Profile Dir   Display Name   Email                           Window  Last Active');
console.log('-------  ------------  -------------  ------------------------------  ------  -----------');
for (const r of rows) {
  console.log(
    `${r.account.padEnd(9)}${r.folder.padEnd(14)}${r.label.padEnd(15)}${r.email.padEnd(32)}${(r.open ? 'Open' : r.restore ? 'Restore' : '-').padEnd(8)}${r.lastActive}`
  );
}

const account = process.argv[2];
if (account) {
  const folder = profileFor(account);
  console.log(`\n${account} -> Profile "${folder}"`);
  console.log(`Browser bridge: ${browserReachable(account) ? 'OK' : 'Unreachable (run 01-ensure-window.mjs to launch)'}`);
}
