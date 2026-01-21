
// A simple service worker to enable PWA features
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // Let the browser handle fetching normally
  event.respondWith(fetch(event.request));
});
