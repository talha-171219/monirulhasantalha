const CACHE_VERSION = "v3";
const CORE_CACHE = `talha-portfolio-core-${CACHE_VERSION}`;
const RUNTIME_CACHE = `talha-portfolio-runtime-${CACHE_VERSION}`;
const OFFLINE_URL = "/offline.html";

const CORE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  OFFLINE_URL,
  "/favicon.jpg",
  "/app-icon.jpg",
  "/splash-screen.jpg",
];

async function cacheFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response && response.ok) {
    cache.put(request, response.clone());
  }
  return response;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response && response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);

  return cached || (await fetchPromise);
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CORE_CACHE)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          const isOurs = key.startsWith("talha-portfolio-");
          const isCurrent = key === CORE_CACHE || key === RUNTIME_CACHE;
          if (isOurs && !isCurrent) return caches.delete(key);
          return undefined;
        })
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // SPA navigations: network-first, fallback to cached shell/offline
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(event.request);
          if (response && response.ok) {
            const cache = await caches.open(CORE_CACHE);
            cache.put("/index.html", response.clone());
          }
          return response;
        } catch {
          return (
            (await caches.match(event.request)) ||
            (await caches.match("/index.html")) ||
            (await caches.match(OFFLINE_URL))
          );
        }
      })()
    );
    return;
  }

  // Same-origin images: cache-first
  if (url.origin === self.location.origin && event.request.destination === "image") {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  // Same-origin other assets: SWR
  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(event.request));
    return;
  }

  // Cross-origin: passthrough (browser cache handles it)
});
