const CACHE_NAME = 'elevate_cache';
const FILES_TO_CACHE = [

  '/client/index.html',
  '/client/views/login.html',
  '/client/views/classement.html',
  '/client/views/saisieMalus.html',
  '/client/views/saisieResultats.html',


  '/client/sw.js',
  '/client/img/elevate_192x192.png',
  '/client/img/elevate_512x512.png',
  '/client/manifest.json',

  '/client/js/controller/indexCtrl.js',
  '/client/js/controller/loginCtrl.js',
  '/client/js/controller/classementCtrl.js',
  '/client/js/worker/httpService.js',
  '/client/js/worker/saisieMalusCtrl.js',
  '/client/js/worker/saisieResultatsCtrl.js'
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

const DB_NAME = 'offline-cache-db';
const STORE_NAME = 'responses';

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone et sauvegarde dans IndexedDB
        const responseClone = response.clone();
        responseClone.text().then(body => {
          saveToIndexedDB(event.request.url, body, responseClone.headers.get('Content-Type'));
        });
        return response;
      })
      .catch(() => {
        // Si fetch échoue => offline => tente la base de données
        return getFromIndexedDB(event.request.url).then(stored => {
          if (stored) {
            return new Response(stored.body, {
              headers: { 'Content-Type': stored.contentType }
            });
          } else {
            return new Response('<h1>Hors ligne</h1><p>Contenu indisponible.</p>', {
              headers: { 'Content-Type': 'text/html' }
            });
          }
        });
      })
  );
});

// IndexedDB — ouvrir et stocker
function saveToIndexedDB(url, body, contentType) {
  const open = indexedDB.open(DB_NAME, 1);
  open.onupgradeneeded = () => {
    open.result.createObjectStore(STORE_NAME, { keyPath: 'url' });
  };
  open.onsuccess = () => {
    const db = open.result;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ url, body, contentType });
    tx.oncomplete = () => db.close();
  };
}

// IndexedDB — lecture
function getFromIndexedDB(url) {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open(DB_NAME, 1);
    open.onsuccess = () => {
      const db = open.result;
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const get = store.get(url);
      get.onsuccess = () => resolve(get.result);
      get.onerror = () => reject();
    };
    open.onerror = () => reject();
  });
}

self.addEventListener('message', event => {
  if (event.data && event.data.action === 'sync-posts') {
    console.log('SW reçu : synchronisation des POST stockés');
    sendQueuedRequests();
  }
});






