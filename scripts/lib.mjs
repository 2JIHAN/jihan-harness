// 공통 도구 — Aside CLI 호출, 프로필 브리지 확인, 세션 보관.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, basename } from 'node:path';

// 하드코딩하지 않습니다. 앱 경로, 프록시 주소, 모델은 모두 설정과 실행 중인 상태에서 읽습니다.

const home = homedir();
export const userDir = (account) => join(home, '.aside', 'u', account.replace(/^u/, ''));
export const sessionsDir = (account) => join(userDir(account), 'sessions');
const storeFile = (account) => join(userDir(account), '.named-sessions.json');

// 앱 실행 여부 확인
export function isAppRunning() {
  try {
    execFileSync('pgrep', ['-f', 'Aside.app/Contents/MacOS/Aside'], { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

// 앱 번들 경로 (.app)
export function appBundlePath() {
  if (existsSync('/Applications/Aside.app')) return '/Applications/Aside.app';
  try {
    const found = execFileSync('bash', ['-c', "mdfind 'kMDItemFSName == \"Aside.app\"' | head -1"], { encoding: 'utf8' }).trim();
    if (found) return found;
  } catch {}
  return '/Applications/Aside.app';
}

// Aside 앱이 꺼져 있으면 포커스를 뺏지 않고 백그라운드로 실행합니다.
export function ensureAppRunning({ waitSec = 15, background = true } = {}) {
  if (isAppRunning()) return true;
  console.error('Aside 앱이 실행되어 있지 않아 백그라운드로 켭니다.');
  const appPath = appBundlePath();
  if (background) {
    execFileSync('open', ['-g', '-a', appPath]);
  } else {
    execFileSync('open', ['-a', appPath]);
  }
  for (let waited = 0; waited < waitSec; waited += 1) {
    execFileSync('sleep', ['1']);
    if (isAppRunning()) return true;
  }
  return isAppRunning();
}

// ── 프로필 동적 조회 ──────────────────────────────────────────
export function getProfiles() {
  ensureAppRunning({ background: true });
  const appRunning = isAppRunning();
  const accountsPath = join(home, '.aside', 'accounts.json');
  const binds = existsSync(accountsPath)
    ? JSON.parse(readFileSync(accountsPath, 'utf8')).profileAccountBindings || {}
    : {};
  const localStatePath = join(home, 'Library/Application Support/Aside/Local State');
  const localState = existsSync(localStatePath)
    ? JSON.parse(readFileSync(localStatePath, 'utf8')).profile || {}
    : {};
  const restoreList = new Set(localState.last_active_profiles || []);
  const openProfiles = appRunning ? restoreList : new Set();
  const cache = localState.info_cache || {};

  const rows = [];
  for (const e of Object.values(binds)) {
    const folder = basename(e.profilePath || '');
    const info = cache[folder] || {};
    const accKey = `u${e.accountId}`;
    rows.push({
      account: accKey,
      accountId: e.accountId,
      folder,
      label: info.gaia_name || info.name || '-',
      email: info.user_name || '-',
      open: openProfiles.has(folder),
      restore: restoreList.has(folder),
      lastActive: info.active_time ? new Date(info.active_time * 1000).toISOString().slice(11, 16) : '-',
    });
  }
  rows.sort((a, b) => a.account.localeCompare(b.account));
  return rows;
}

// 계정 번호와 프로필 폴더 매핑
export function profileFor(account) {
  const binds =
    JSON.parse(readFileSync(join(home, '.aside', 'accounts.json'), 'utf8')).profileAccountBindings || {};
  const want = Number(account.replace(/^u/, ''));
  for (const e of Object.values(binds)) {
    if (e.accountId === want && e.profilePath) return basename(e.profilePath);
  }
  throw new Error(`${account} 에 연결된 프로필을 찾지 못했습니다.`);
}

// 브라우저에 닿는지 봅니다.
export function browserReachable(account, session) {
  try {
    const out = ask(account, '지금 보고 있는 탭의 주소를 그대로 한 줄로 알려 주십시오. 아무것도 클릭하지 마십시오.', session);
    return /https?:\/\/|chrome:\/\/|chrome-extension:\/\//.test(out);
  } catch {
    return false;
  }
}

export const bridgeOk = browserReachable;

// 닿지 않으면 그 계정의 프로필로 창을 백그라운드(포커스 비탈취)로 띄우고 기다립니다.
export function ensureBridge(account, waitSec = 45) {
  ensureAppRunning({ background: true });
  if (bridgeOk(account)) return true;

  const profile = profileFor(account);
  console.error(`브라우저에 닿지 않아 백그라운드에서 프로필 "${profile}" 창을 띄웁니다.`);
  const appPath = appBundlePath();
  // open -g 는 사용자의 현재 활성 창 포커스를 뺏지 않고 백그라운드에서 창을 실행합니다.
  execFileSync('open', ['-g', '-a', appPath, '--args', `--profile-directory=${profile}`]);

  for (let waited = 0; waited < waitSec; waited += 3) {
    execFileSync('sleep', ['3']);
    if (bridgeOk(account)) {
      console.error(`  ${waited + 3}초에 브리지 연결되었습니다.`);
      return true;
    }
  }
  console.error(`실패: ${profile} 창이 ${waitSec}초 안에 준비되지 않았습니다.`);
  return false;
}

// ── 모델 ──────────────────────────────────────────────────
export function defaultModel(account) {
  const m = JSON.parse(readFileSync(join(userDir(account), 'settings.json'), 'utf8')).defaultModel || {};
  return { provider: m.provider, modelId: m.modelId };
}

// 그 계정에 등록된 프로바이더 설정을 읽습니다. (~/.aside/u/<n>/models.json)
export function providersOf(account) {
  const f = join(userDir(account), 'models.json');
  if (!existsSync(f)) return {};
  return JSON.parse(readFileSync(f, 'utf8')).providers || {};
}

// 기본 모델이 쓰는 프로바이더의 baseUrl 을 설정에서 그대로 가져옵니다.
export function providerBaseUrl(account, key) {
  const p = providersOf(account)[key || defaultModel(account).provider];
  return p?.baseUrl || null;
}

// 프로바이더가 지금 실제로 서빙 중인 모델 목록입니다. 주소도 설정에서 읽습니다.
export async function liveModels(account, key) {
  const base = providerBaseUrl(account, key);
  if (!base) return [];
  try {
    const res = await fetch(`${base}/v1/models`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return [];
    return ((await res.json()).data || []).map((m) => m.id);
  } catch {
    return [];
  }
}

// 모델 이름을 계열과 버전으로 나눕니다.
//   gemini-3.7-flash-high   → { family: 'gemini', version: 3.7 }
//   claude-opus-4-6-thinking → { family: 'claude', version: 4.6 }
//   gpt-oss-120b-medium      → { family: 'gpt',   version: NaN }
export function parseModelId(id) {
  const parts = id.split('-');
  const nums = parts.filter((t) => /^\d+(\.\d+)?$/.test(t));
  const version = nums.length ? Number(nums.join('.').split('.').slice(0, 2).join('.')) : NaN;
  return { family: parts[0], version };
}

// 쓸 만한 모델을 고릅니다. 이름을 고정하지 않습니다.
//
// 버전 비교는 반드시 같은 계열 안에서만 합니다. claude 4.6 과 gemini 3.7 은
// 비교 대상이 아니므로, 계열을 섞어 정렬하면 엉뚱한 모델이 뽑힙니다.
// 기준 계열은 그 계정의 현재 기본 모델에서 가져옵니다.
export async function pickModel(account, key, exclude = []) {
  const ids = (await liveModels(account, key)).filter((id) => !exclude.includes(id));
  if (ids.length === 0) return null;

  const best = (list) => {
    const v = list.map((id) => ({ id, ...parseModelId(id) })).filter((x) => !Number.isNaN(x.version));
    v.sort((a, b) => b.version - a.version);
    return v.length ? v[0].id : list[0];
  };

  const wanted = parseModelId(defaultModel(account).modelId || '').family;
  const same = ids.filter((id) => parseModelId(id).family === wanted && !id.includes('-image'));
  if (same.length) return best(same);

  // 같은 계열이 없으면 다른 계열로 넘어갑니다. 계열 이름순으로 정해 결과가 흔들리지 않게 합니다.
  const others = [...new Set(ids.map((id) => parseModelId(id).family))].sort();
  for (const f of others) {
    const list = ids.filter((id) => parseModelId(id).family === f && !id.includes('-image'));
    if (list.length) return best(list);
  }
  return ids[0];
}

// ── 이름 붙인 세션 ─────────────────────────────────────────
export function loadSessions(account) {
  const f = storeFile(account);
  return existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : {};
}

export function saveSession(account, name, id) {
  const all = loadSessions(account);
  all[name] = { id, updatedAt: new Date().toISOString() };
  writeFileSync(storeFile(account), JSON.stringify(all, null, 2));
  writeFileSync(join(userDir(account), '.last-session'), id); // 이름을 안 줄 때를 위해 남깁니다.
}

export function resolveSession(account, name) {
  if (name) {
    const hit = loadSessions(account)[name];
    if (!hit) throw new Error(`"${name}" 이름의 세션이 없습니다. sessions.mjs 로 목록을 보십시오.`);
    return hit.id;
  }
  const f = join(userDir(account), '.last-session');
  if (!existsSync(f)) throw new Error('세션이 없습니다. 먼저 02-open-session.mjs 를 실행하십시오.');
  return readFileSync(f, 'utf8').trim();
}

// ── 지시 보내기 ────────────────────────────────────────────
// 한 턴에 허용할 시간. 웜 2~6초, 콜드 11초 정도이므로 이보다 오래 걸리면 매달린 것입니다.
export const TURN_TIMEOUT_MS = Number(process.env.ASIDE_TURN_TIMEOUT_MS || 120_000);

export function ask(account, prompt, session, { timeout = TURN_TIMEOUT_MS } = {}) {
  const base = ['exec', '--account', account];
  if (session) base.push('--session', session);
  const run = (extra) => execFileSync('aside', [...base, ...extra, prompt], { encoding: 'utf8', timeout });

  const isTimeout = (e) => e.code === 'ETIMEDOUT' || e.signal === 'SIGTERM';

  try {
    return run([]);
  } catch (e) {
    // 데몬과 확장 사이 연결이 간헐적으로 끊기면 오류가 아니라 무한 대기로 나타납니다.
    // 저절로 풀리는 성질이라 한 번만 다시 시도하고, 그래도 안 되면 사람이 알아볼 수 있게 알립니다.
    if (isTimeout(e)) {
      console.error(`${Math.round(timeout / 1000)}초 안에 응답이 없어 한 번 더 시도합니다. (연결이 일시적으로 끊긴 상태입니다)`);
      try {
        return run([]);
      } catch (e2) {
        if (isTimeout(e2)) {
          throw new Error(
            '두 번 모두 응답이 없습니다. 데몬과 브라우저 확장의 연결이 끊긴 상태로 보입니다.\n' +
              '  잠시 뒤 다시 시도하십시오. 반복되면 Aside 앱을 다시 띄우십시오.'
          );
        }
        throw e2;
      }
    }

    const msg = `${e.stdout || ''}${e.stderr || ''}${e.message || ''}`;
    if (!/rate limit/i.test(msg)) throw e;

    // 폴백 모델을 이름으로 고정하지 않습니다. 지금 살아 있는 목록에서 방금 실패한 것을 빼고 고릅니다.
    const { provider, modelId } = defaultModel(account);
    const alt = execFileSync(process.execPath, ['-e', `
      import('${join(import.meta.dirname, 'lib.mjs')}').then(async (m) => {
        process.stdout.write((await m.pickModel('${account}', '${provider}', ['${modelId}'])) || '');
      });
    `], { encoding: 'utf8' }).trim();

    if (!alt) throw e;
    console.error(`사용량 제한에 걸려 ${provider}/${alt} 로 다시 시도합니다.`);
    return run(['-p', provider, '-m', alt]);
  }
}

// 가장 최근 세션이 실제로 쓴 모델입니다.
//
// settings.json 을 파일로 직접 고치면 데몬이 바로 읽지 않습니다(수십 초에서 수 분 지연).
// 그래서 "설정값"과 "실제로 쓰인 값"이 다를 수 있어, 둘을 따로 확인해야 합니다.
export function lastUsedModel(account) {
  const dir = sessionsDir(account);
  const recent = readdirSync(dir)
    .map((d) => ({ d, t: statSync(join(dir, d)).mtimeMs }))
    .sort((a, b) => b.t - a.t);

  for (const { d } of recent.slice(0, 5)) {
    const f = join(dir, d, 'messages.jsonl');
    if (!existsSync(f)) continue;
    for (const line of readFileSync(f, 'utf8').split('\n')) {
      if (!line.trim()) continue;
      const o = JSON.parse(line);
      if (o.role === 'assistant' && o.provider) {
        return { provider: o.provider, modelId: o.model, at: new Date(o.timestamp) };
      }
    }
  }
  return null;
}

export const tailOf = (text, n = 8) => text.trim().split('\n').slice(-n).join('\n');

export function artifactsDir() {
  const d = join(process.cwd(), 'artifacts');
  mkdirSync(d, { recursive: true });
  return d;
}

// ── 시각 기반 인터랙션 (Vision-First UI Simulation) ───────────
// 원칙: ~/.aside/u/<account>/AGENTS.md 및 MEMORY.md 에 시각 우선 원칙이 영구 각인되어 있으므로
// 매 턴 긴 접두사를 붙이지 않고 자연스럽고 가벼운 프롬프트로 소통하여 토큰을 절감합니다.

export function visualNavigate(account, url, session) {
  return ask(account, `주소 "${url}"(으)로 이동하고 페이지 제목과 주요 내용을 한 줄로 요약해 주십시오.`, session);
}

export function visualClick(account, target, session) {
  return ask(account, `화면에서 "${target}"(을)를 찾아 마우스로 클릭해 주십시오.`, session);
}

export function visualType(account, target, text, session) {
  return ask(account, `화면에서 "${target}"(을)를 찾아 "${text}"(을)를 입력해 주십시오.`, session);
}

export function visualInspect(account, question, session) {
  return ask(account, `화면을 확인하고 다음 질문에 답해 주십시오: ${question}`, session);
}

export function visualScroll(account, direction = 'down', session) {
  return ask(account, `화면을 ${direction === 'down' ? '아래로' : '위로'} 스크롤해 주십시오.`, session);
}
