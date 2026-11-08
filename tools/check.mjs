// 올리기 전 점검 + 보안 정책(CSP) 해시 갱신.  사용: node tools/check.mjs        (점검만)
//                                              node tools/check.mjs --fix  (index.html을 고친 뒤 해시 갱신)
import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto'; import url from 'node:url';
const root = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
let html = read('index.html'), bad = 0;
const fail = m => { console.log('문제: ' + m); bad++; }, ok = m => console.log('확인: ' + m);
const script = html.match(/<script>([\s\S]*)<\/script>/)[1];
const hash = 'sha256-' + crypto.createHash('sha256').update(script, 'utf8').digest('base64');
const m = html.match(/script-src '(sha256-[^']+)'/);
if (!m) fail("CSP에 script-src 해시가 없어요");
else if (m[1] !== hash) {
  if (process.argv.includes('--fix')) { html = html.replace(m[1], hash); fs.writeFileSync(path.join(root, 'index.html'), html); ok('CSP 해시를 갱신했어요'); }
  else fail('index.html의 스크립트가 바뀌어 CSP 해시와 달라요. --fix로 갱신하세요(안 하면 앱이 멈춰요)');
} else ok('CSP 해시가 스크립트와 일치해요');
// 데이터 폴더에는 빈 양식과 목록만
const allowed = new Set(['index.json', 'template-empty.json']);
for (const f of fs.readdirSync(path.join(root, 'data'))) if (!allowed.has(f)) fail('data/ 폴더에 허용되지 않은 파일: ' + f);
ok('data/ 폴더 점검 완료');
// 개인정보·로컬 경로 흔적 검색
const pats = [[/01[016-9][-\s]?\d{3,4}[-\s]?\d{4}/, '전화번호'], [/\d{6}[-\s]?[1-4]\d{6}/, '주민번호 모양'], [/[\w.+-]+@[\w-]+\.[a-z]{2,}/i, '이메일'], [/\/Users\/|\/home\/|C:\\Users/, '로컬 경로']];
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? (e.name === 'node_modules' || e.name === '.git' ? [] : walk(path.join(d, e.name))) : [path.join(d, e.name)]);
for (const f of walk(root)) {
  if (/\.(png|zip|skill)$/.test(f)) continue;
  const t = fs.readFileSync(f, 'utf8');
  for (const [re, l] of pats) if (re.test(t)) fail(`${path.relative(root, f)}에 ${l}처럼 보이는 내용`);
}
ok('개인정보·경로 흔적 검색 완료');
// 외부 주소·저장소 API
if (/<script[^>]+src=|<link[^>]+href="https?:/.test(html)) fail('외부 파일을 불러오는 태그가 있어요');
if (/localStorage|sessionStorage|indexedDB|document\.cookie/.test(script)) fail('브라우저 저장소를 쓰는 코드가 있어요');
ok('외부 불러오기·저장소 사용 없음');
// 버전 일치
const av = script.match(/APP_VERSION='([^']+)'/)[1];
if (!read('sw.js').includes('coach-shell-' + av)) fail('sw.js의 버전이 프로그램 버전(' + av + ')과 달라요');
if (!read('README.md').includes('v' + av)) fail('README의 버전이 프로그램 버전(' + av + ')과 달라요');
ok('프로그램 버전 ' + av + ' 일치 점검 완료');
console.log(bad ? `\n문제 ${bad}개를 고친 뒤 올려 주세요.` : '\n모두 통과했어요.');
process.exit(bad ? 1 : 0);
