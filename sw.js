/* 서비스 워커: 프로그램 파일(화면·아이콘)만 오프라인용으로 보관해요.
   data/ 폴더와 config.json은 절대 보관하지 않고 항상 새로 읽어요(개인정보가 남지 않도록). */
const VERSION = 'coach-shell-3.0.1';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  if (u.pathname.includes('/data/') || u.pathname.endsWith('/config.json')) return; // 데이터는 보관하지 않아요
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
