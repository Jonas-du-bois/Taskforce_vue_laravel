// Service Worker pour Taskforce PWA
// Personnalisé pour gérer les requêtes authentifiées

self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installation');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activation');
  event.waitUntil(clients.claim());
});

// Intercepter les requêtes fetch
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isApiRequest = url.pathname.startsWith('/api/');
  
  // Pour les requêtes API, on laisse passer directement sans mise en cache
  if (isApiRequest) {
    console.log('[ServiceWorker] Requête API détectée:', url.pathname);
    // Ne pas interferer avec les requêtes API
    return;
  }
  
  // Pour les autres ressources, on utilise une stratégie de cache "network first"
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cloner la réponse et la mettre en cache si c'est une ressource statique
        if (response.status === 200 && !url.pathname.includes('/api/')) {
          const responseClone = response.clone();
          caches.open('taskforce-static-v1').then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // En cas d'échec, essayer de récupérer depuis le cache
        return caches.match(event.request);
      })
  );
}); 