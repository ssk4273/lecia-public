const CACHE = 'lexia-v43-partial-2';
// Cache the shell first. Editorial JSON packs are cached as they are requested;
// one optional pack returning 404 must not block a Service Worker update.
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const shell = ['./', './index.html', './js/source-gloss-loader.js',
      './js/precision-draft-loader.js'];
    const results = await Promise.allSettled(shell.map(async path => {
      const response = await fetch(path, {cache:'reload'});
      if (!response.ok) throw new Error('Shell HTTP ' + response.status);
      await cache.put(path, response);
    }));
    if (results.some(result => result.status === 'rejected'))
      console.warn('Lexia service worker: some shell assets not precached');
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('lexia-') && key !== CACHE).map(key => caches.delete(key))
  )));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const response = await fetch(event.request);
      if (response.ok) await cache.put(event.request, response.clone());
      return response;
    } catch (error) {
      const cached = await cache.match(event.request);
      if (cached) return cached;
      throw error;
    }
  })());
});
