const CACHE_NAME = 'elevate_cache';
const FILES_TO_CACHE = [

  '/index.html',
  '/sw.js',
  '/img/elevate_192x192.png',
  '/img/elevate_512x512.png',
  '/manifest.json',

  '/js/controller/indexCtrl.js',
  '/js/controller/loginCtrl.js',
  '/js/controller/classementCtrl.js',
  '/js/worker/httpService.js',
  '/js/worker/saisieMalusCtrl.js',
  '/js/worker/saisieResultatsCtrl.js'
];
//  Installation : cache des fichiers statiques
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Mise en cache des fichiers statiques');
        return cache.addAll(FILES_TO_CACHE);
      })
  );
  self.skipWaiting();
});

//  Activation : nettoyage des anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Interception des requêtes GET uniquement
self.addEventListener('fetch', event => {
  const { request } = event;

  // Ne traiter que les requêtes GET
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;

      return fetch(request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(() => {
        // Optionnel : retourner une page de secours en cas d'échec
        return new Response("Contenu non disponible hors ligne.", {
          status: 503,
          statusText: "Offline"
        });
      });
    })
  );
});
