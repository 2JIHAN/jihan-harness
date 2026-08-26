#!/usr/bin/env node
// Step 4 — Vision-First browser interaction CLI module.
//
// Principles:
// 1. Avoid large HTML dumps or DOM traversal; simulate mouse and keyboard actions from visual inspection.
// 2. Fall back to DOM/direct fetch only under unavoidable circumstances (CAPTCHA, invisible data).
//
// Usage:
//   node 04-interact.mjs goto <URL> [account] [session]
//   node 04-interact.mjs click <targetDescription> [account] [session]
//   node 04-interact.mjs type <fieldDescription> <value> [account] [session]
//   node 04-interact.mjs inspect <question> [account] [session]
//   node 04-interact.mjs scroll [down|up] [account] [session]
//   node 04-interact.mjs fallback <instruction> [account] [session]

import {
  ask,
  defaultAccount,
  resolveSession,
  tailOf,
  visualClick,
  visualInspect,
  visualNavigate,
  visualScroll,
  visualType,
} from './lib.mjs';
import { withTokenTracking } from './token-monitor.mjs';

const [action, ...rest] = process.argv.slice(2);

if (!action) {
  console.log(`Usage:
  node 04-interact.mjs goto <URL> [account] [session]
  node 04-interact.mjs click <targetDescription> [account] [session]
  node 04-interact.mjs type <fieldDescription> <value> [account] [session]
  node 04-interact.mjs inspect <question> [account] [session]
  node 04-interact.mjs scroll [down|up] [account] [session]
  node 04-interact.mjs fallback <instruction> [account] [session]`);
  process.exit(0);
}

async function run() {
  const act = action.toLowerCase();

  switch (act) {
    case 'goto':
    case 'navigate': {
      const url = rest[0];
      const account = rest[1] && /^u\d+$/i.test(rest[1]) ? rest[1] : defaultAccount();
      const sessionName = rest[2] || (rest[1] && !/^u\d+$/i.test(rest[1]) ? rest[1] : undefined);
      const session = resolveSession(account, sessionName);
      if (!url) {
        console.error('Please specify a URL. Example: node 04-interact.mjs goto https://example.com');
        process.exit(1);
      }
      const out = withTokenTracking(account, session, () => visualNavigate(account, url, session));
      console.log(tailOf(out, 10));
      break;
    }

    case 'click': {
      const target = rest[0];
      const account = rest[1] && /^u\d+$/i.test(rest[1]) ? rest[1] : defaultAccount();
      const sessionName = rest[2] || (rest[1] && !/^u\d+$/i.test(rest[1]) ? rest[1] : undefined);
      const session = resolveSession(account, sessionName);
      if (!target) {
        console.error('Please specify a target to click. Example: node 04-interact.mjs click "Login button"');
        process.exit(1);
      }
      const out = withTokenTracking(account, session, () => visualClick(account, target, session));
      console.log(tailOf(out, 10));
      break;
    }

    case 'type':
    case 'input': {
      const target = rest[0];
      const text = rest[1];
      const account = rest[2] && /^u\d+$/i.test(rest[2]) ? rest[2] : defaultAccount();
      const sessionName = rest[3] || (rest[2] && !/^u\d+$/i.test(rest[2]) ? rest[2] : undefined);
      const session = resolveSession(account, sessionName);
      if (!target || text === undefined) {
        console.error('Please specify an input field and value. Example: node 04-interact.mjs type "Search input" "keyword"');
        process.exit(1);
      }
      const out = withTokenTracking(account, session, () => visualType(account, target, text, session));
      console.log(tailOf(out, 10));
      break;
    }

    case 'inspect':
    case 'check': {
      const question = rest[0];
      const account = rest[1] && /^u\d+$/i.test(rest[1]) ? rest[1] : defaultAccount();
      const sessionName = rest[2] || (rest[1] && !/^u\d+$/i.test(rest[1]) ? rest[1] : undefined);
      const session = resolveSession(account, sessionName);
      if (!question) {
        console.error('Please specify an inspection question. Example: node 04-interact.mjs inspect "What is the visible title?"');
        process.exit(1);
      }
      const out = withTokenTracking(account, session, () => visualInspect(account, question, session));
      console.log(tailOf(out, 10));
      break;
    }

    case 'scroll': {
      const dir = rest[0] === 'up' ? 'up' : 'down';
      const account = rest[1] && /^u\d+$/i.test(rest[1]) ? rest[1] : defaultAccount();
      const sessionName = rest[2] || (rest[1] && !/^u\d+$/i.test(rest[1]) ? rest[1] : undefined);
      const session = resolveSession(account, sessionName);
      const out = withTokenTracking(account, session, () => visualScroll(account, dir, session));
      console.log(tailOf(out, 10));
      break;
    }

    case 'fallback': {
      const instruction = rest[0];
      const account = rest[1] && /^u\d+$/i.test(rest[1]) ? rest[1] : defaultAccount();
      const sessionName = rest[2] || (rest[1] && !/^u\d+$/i.test(rest[1]) ? rest[1] : undefined);
      const session = resolveSession(account, sessionName);
      if (!instruction) {
        console.error('Please specify a fallback instruction.');
        process.exit(1);
      }
      const prompt = `[FALLBACK MODE]: ${instruction}`;
      const out = withTokenTracking(account, session, () => ask(account, prompt, session));
      console.log(tailOf(out, 10));
      break;
    }

    default:
      console.error(`Unknown action: ${action}`);
      process.exit(1);
  }
}

run().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
