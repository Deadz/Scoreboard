const CACHE_NAME = 'scoreboard-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './web-app-manifest-192x192.png',
  './web-app-manifest-512x512.png',
  'https://www.w3schools.com/w3css/4/w3.css',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap'
];

// Installation — mise en cache
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activation — nettoyage anciens caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — cache first, network fallback
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request)
        .then(response => {
          // On met en cache les nouvelles ressources
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
          return response;
        })
        .catch(() => caches.match('/index.html')); // fallback offline
    })
  );
});
