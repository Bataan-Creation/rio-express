// RIOEXPRESS SERVICE WORKER - OFFLINE CACHING ENGINE
const CACHE_NAME = 'rioexpress-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/customer.html',
  '/rider.html',
  '/merchant.html',
  '/admin.html',
  '/assets/css/style.css',
  '/assets/js/config.js',
  '/assets/js/auth.js',
  '/assets/js/customer.js',
  '/assets/js/rider.js',
  '/assets/js/merchant.js',
  '/assets/js/admin.js',
  '/assets/js/guidelines.js',
  '/assets/js/i18n.js',
  '/assets/js/chatbot.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});