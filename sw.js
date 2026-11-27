/* Service Worker: офлайн-доступ и кэширование */
var CACHE = 'pgtu-schedule-mono-v6';

var ASSETS = [
  './',
  './index.html',
  './privacy.html',
  './css/styles.css',
  './js/app.js',
  './js/ads.js',
  './js/data.js',
  './manifest.json',
  './icons/favicon.svg',
  './icons/favicon-32.png',
  './icons/apple-touch-icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(ASSETS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (key) {
        return key !== CACHE;
      }).map(function (key) {
        return caches.delete(key);
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

var ORIGIN = self.location.origin;

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;

  var url;
  try {
    url = new URL(event.request.url);
  } catch (err) {
    return;
  }

  // Сторонние запросы не кэшируем
  if (url.origin !== ORIGIN) return;

  // Сеть сначала, при сбое — кэш
  event.respondWith(
    fetch(event.request).then(function (response) {
      if (response && response.status === 200 && response.type === 'basic') {
        var copy = response.clone();
        caches.open(CACHE).then(function (cache) {
          cache.put(event.request, copy);
        });
      }
      return response;
    }).catch(function () {
      return caches.match(event.request).then(function (cached) {
        if (cached) return cached;
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        return Promise.reject(new Error('Offline and not in cache'));
      });
    })
  );
});

// Клик по нативному уведомлению — открывает приложение
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  var targetUrl = (event.notification.data && event.notification.data.url) || './';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if ('focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
