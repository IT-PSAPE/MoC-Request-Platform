const CACHE_NAME = 'moc-request-platform-v2';
const urlsToCache = [
  '/',
  '/admin',
  '/board',
  '/form',
  '/login',
  '/offline',
  '/manifest.json',
  '/icons/icon-32x32.png',
  '/icons/icon-192x192.png',
  '/icons/icon-256x256.png',
  '/icons/icon-512x512.png',
  '/images/product-screenshots-1280x800.png',
];

// Install service worker
self.addEventListener('install', (event) => {
  console.log('[SW] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Precaching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[SW] Skip waiting on install');
        return self.skipWaiting();
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip caching for API requests, Supabase calls, and chrome-extension requests
  if (url.pathname.includes('/rest/v1/') || 
      url.pathname.startsWith('/api/') ||
      url.hostname.includes('supabase') ||
      url.protocol === 'chrome-extension:') {
    event.respondWith(fetch(request));
    return;
  }
  
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            const url = new URL(request.url);
            if (request.method === 'GET' && response && response.ok && url.protocol !== 'chrome-extension:') {
              cache.put(request, response.clone());
            }
            return response;
          });
        })
        .catch(() => {
          return caches.match(request).then((response) => {
            return response || caches.match('/offline');
          });
        })
    );
  } else {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(request).then((response) => {
            return caches.open(CACHE_NAME).then((cache) => {
              const url = new URL(request.url);
              if (request.method === 'GET' && response && response.ok && url.protocol !== 'chrome-extension:') {
                cache.put(request, response.clone());
              }
              return response;
            });
          });
        })
    );
  }
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate');
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Claiming clients');
        return self.clients.claim();
      })
  );
});

// Skip waiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
