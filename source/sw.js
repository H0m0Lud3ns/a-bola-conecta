// Service Worker do A Bola Conecta
// Estrategia: network-first TOTAL, sin cache persistente.
// Solo sirve como registro de instalacion para re-validar caches anteriores.

const SW_VERSION = 'abolaconecta-v4';

self.addEventListener('install', (event) => {
  // Forzar activacion inmediata sin esperar a que cierren tabs
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Borrar TODOS los caches anteriores (v1, v2, v3, etc)
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => Promise.all(
        cacheNames.map((name) => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Solo interceptar mismo origen
  if (url.origin !== self.location.origin) return;

  // Network first: siempre ir a la red primero, cache como fallback solo offline
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Solo cachear respuestas exitosas para fallback offline
        if (response.ok) {
          const clone = response.clone();
          caches.open(SW_VERSION).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => {
        // Solo si la red falla (offline), usar cache
        return caches.match(request).then((cached) => cached || Response.error());
      })
  );
});