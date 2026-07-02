// Service Worker do A Bola Conecta
// Estrategia: network-first TOTAL, sin cache persistente.
// Solo sirve como registro de instalacion para re-validar caches anteriores.

const SW_VERSION = 'abolaconecta-v5';

// Network-first TOTAL com cache: 'no-store' pra ignorar cache HTTP do navegador.
// Versao 2026-07-02: adiciona cache:'no-store' no fetch e desregistra SW antigos.
self.addEventListener('install', (event) => {
  // Forzar activacion inmediata sin esperar a que cierren tabs
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Borrar TODOS los caches anteriores (v1, v2, v3, v4, etc)
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => Promise.all(
        cacheNames.map((name) => caches.delete(name))
      ))
      // Tambem desregistra qualquer Service Worker antigo que tenha sobrado
      .then(() => self.registration.unregister())
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Solo interceptar mismo origen
  if (url.origin !== self.location.origin) return;

  // Network first SEM cache HTTP: usa cache:'no-store' para o fetch ir sempre
  // direto na rede sem usar o cache do navegador. Se a rede cair, usa o SW cache
  // como fallback offline.
  event.respondWith(
    fetch(request, { cache: 'no-store' })
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