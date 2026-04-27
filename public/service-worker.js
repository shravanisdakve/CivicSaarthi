const CACHE_NAME = 'civicsaarthi-v1';
const OFFLINE_URLS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/logo.svg',
  '/avatar.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_URLS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests and avoid API calls
  if (event.request.method !== 'GET' || event.request.url.includes('/api/')) {
    return;
  }

  // NetworkFirst strategy for navigation (index.html) to avoid MIME/Chunk errors
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response if found (good for static assets like logo, icons)
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
