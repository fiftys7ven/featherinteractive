// Define the cache name and the files to cache
const CACHE_NAME = 'my-pwa-cache-v1';
const STATIC_CACHE_FILES = [
  '/',
  '/index.html',
  '/main.css',
  '/manifest.json',
  // Add more static files to cache
];

// Install event: Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_CACHE_FILES))
  );
});

// Activate event: Remove old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
});

// Fetch event: Serve from cache, falling back to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response; // Serve from cache
        }
        // Not found in cache, fetch from network
        return fetch(event.request)
          .then((response) => {
            // Clone the response to cache and serve
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return response;
          })
          .catch(() => {
            // Handle network request failures
            // You can return a custom offline page here
          });
      })
    );
});

// Add any additional event listeners or custom caching strategies as needed
