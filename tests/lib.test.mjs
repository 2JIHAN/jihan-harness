import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  tailOf,
  userDir,
  sessionsDir,
  resolveSession,
} from '../scripts/lib.mjs';

test('tailOf returns last n lines', () => {
  const text = 'line1\nline2\nline3\nline4\nline5';
  assert.equal(tailOf(text, 2), 'line4\nline5');
  assert.equal(tailOf(text, 10), 'line1\nline2\nline3\nline4\nline5');
});

test('userDir and sessionsDir generate consistent paths', () => {
  const u1 = userDir('u1');
  assert.match(u1, /\.aside\/u\/1$/);

  const s1 = sessionsDir('u1');
  assert.equal(s1, join(u1, 'sessions'));
});

test('resolveSession throws descriptive error when session name does not exist', () => {
  assert.throws(
    () => resolveSession('u1', 'non_existent_session_xyz_12345'),
    /이름의 세션이 없습니다/
  );
});
