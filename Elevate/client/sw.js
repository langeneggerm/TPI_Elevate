const CACHE_NAME = 'elevate_cache';
const FILES_TO_CACHE = [

  '/client/index.html',
  '/client/views/login.html',
  '/client/views/classement.html',
  '/client/sw.js',
  '/client/img/elevate_192x192.png',
  '/client/img/elevate_512x512.png',
  '/client/manifest.json',

  '/client/js/controller/indexCtrl.js',
  '/client/js/controller/loginCtrl.js',
  '/client/js/controller/classementCtrl.js',
  '/client/js/worker/httpService.js'
];

// 🧱 Installation : cache des fichiers statiques
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Mise en cache des fichiers statiques');
        return cache.addAll(FILES_TO_CACHE);
      })
  );
});

// 🔄 Activation : nettoyage des anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si le fichier est dans le cache, on le retourne
        if (response) return response;

        // Sinon on essaie de le récupérer du réseau
        return fetch(event.request)
          .then(networkResponse => {
            return caches.open(CACHE_NAME).then(cache => {
              // On peut mettre en cache les fichiers statiques à la volée
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          });
      })
      .catch(() => {
        // Si on est hors-ligne et qu'on a rien : afficher une page HTML simple
        return new Response('<h1>Hors ligne</h1><p>Contenu indisponible.</p>', {
          headers: { 'Content-Type': 'text/html' }
        });
      })
  );
});


