'use strict';

// Cache Name
const CACHE_NAME = 'static-cache-v0.1';
// Cache Files
const FILES_TO_CACHE = ['index.html', '', '/'];
const SEARCH_PARAM_TO_IGNORE = 'playlist-id';
// install
self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Install');
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline page');
      cache.add('/');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});
// Active PWA Cache and clear out anything older
self.addEventListener('activate', (evt) => {
  console.log('[ServiceWorker] Activate');
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});
// listen for fetch events in page navigation and return anything that has been cached
self.addEventListener('fetch', (evt) => {
  console.log('[ServiceWorker] Fetch', evt.request.url);
  evt.respondWith(
    (async () => {
      const ignoreSearch = new URL(evt.request.url).searchParams.has(
        SEARCH_PARAM_TO_IGNORE
      );
      const cachedResponse = await caches.match(evt.request, { ignoreSearch });
      if (cachedResponse) {
        return cachedResponse;
      }

      caches.open(CACHE_NAME).then((cache) => {
        console.log('[ServiceWorker] Caching');
        cache.add(evt.request.url);
      });
      return cachedResponse || fetch(evt.request);
    })()
  );
});
