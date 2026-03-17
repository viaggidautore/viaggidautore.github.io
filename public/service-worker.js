const CACHE_NAME = 'viaggi-autore-v1';

const urlsToCache = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Installazione: mette in cache le risorse principali
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Attivazione: rimuove cache vecchie
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch: network first, poi cache come fallback
// Le chiamate API (webhook n8n) vanno sempre in rete
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Le chiamate al webhook n8n vanno SEMPRE in rete — mai dalla cache
  if (event.request.method === 'POST' || url.pathname.includes('workers.dev')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Aggiorna la cache con la risposta fresca
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Rete non disponibile: usa la cache
        return caches.match(event.request);
      })
  );
});
