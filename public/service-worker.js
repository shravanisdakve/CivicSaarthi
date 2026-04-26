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

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response if found
      if (response) {
        return response;
      }

      // Otherwise fetch from network
      return fetch(event.request).catch(() => {
        // If network fails and it's a navigation request, return index.html for SPA routing
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
      });
    })
  );
});
