const CACHE_NAME = "zqf-test-v8";  // <-- हर update पर सिर्फ यही बदलना

const urlsToCache = [
  "/zero-quantum-frequency/",
  "/zero-quantum-frequency/index.html",
  "/zero-quantum-frequency/manifest.json",
  "/zero-quantum-frequency/icon-192.png",
  "/zero-quantum-frequency/icon-512.png",
  "/zero-quantum-frequency/mindos.html",
  "/zero-quantum-frequency/prashn.html",
  "/zero-quantum-frequency/uttar.html",
];


// INSTALL
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // नया SW तुरंत तैयार
});


// ACTIVATE (पुराने cache delete + control ले)
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});


// FETCH (offline + auto update cache)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {

      // cache मिला → वही दिखाओ
      if (response) return response;

      // नहीं मिला → net से लो और cache में save भी करो
      return fetch(event.request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });

    })
  );
});
