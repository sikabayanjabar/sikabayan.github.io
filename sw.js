// Service Worker for Sikabayan - Advanced Caching Strategy
const CACHE_NAME = "sikabayan-v1.2.0";
const STATIC_CACHE = "sikabayan-static-v1.2.0";
const DYNAMIC_CACHE = "sikabayan-dynamic-v1.2.0";
const IMAGE_CACHE = "sikabayan-images-v1.2.0";

// Files to cache immediately
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/script.js",
  "/js/theme.js",
  "/js/auth.js",
  "/src/app.js",
  "/latihan.html",
  "/buku-digital.html",
  // Add other critical files
];

// Image extensions to cache
const IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".svg",
  ".ico",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("Service Worker: Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log("Service Worker: Static assets cached");
        return self.skipWaiting();
      })
      .catch((err) => {
        console.error("Service Worker: Error caching static assets", err);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old caches
            if (
              cacheName !== STATIC_CACHE &&
              cacheName !== DYNAMIC_CACHE &&
              cacheName !== IMAGE_CACHE
            ) {
              console.log("Service Worker: Deleting old cache", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("Service Worker: Activated");
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Skip external requests
  if (requestUrl.origin !== location.origin) {
    return;
  }

  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  try {
    // Strategy 1: Cache First for Images (with versioning)
    if (isImageRequest(pathname)) {
      return await cacheFirstStrategy(request, IMAGE_CACHE);
    }

    // Strategy 2: Stale While Revalidate for CSS/JS
    if (isCSSOrJSRequest(pathname)) {
      return await staleWhileRevalidateStrategy(request, STATIC_CACHE);
    }

    // Strategy 3: Network First for HTML pages
    if (isHTMLRequest(pathname)) {
      return await networkFirstStrategy(request, DYNAMIC_CACHE);
    }

    // Strategy 4: Cache First for other static assets
    return await cacheFirstStrategy(request, STATIC_CACHE);
  } catch (error) {
    console.error("Service Worker: Fetch error", error);

    // Fallback to cache for any error
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page or error response
    return new Response("Offline - Content not available", {
      status: 503,
      statusText: "Service Unavailable",
    });
  }
}

// Cache First Strategy - Good for images and static assets
async function cacheFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    // Check if cached version is recent (for images with versioning)
    const dateHeader = cachedResponse.headers.get("date");
    if (dateHeader) {
      const cacheDate = new Date(dateHeader);
      const now = new Date();
      const daysDiff = (now - cacheDate) / (1000 * 60 * 60 * 24);

      // If cached for more than 7 days, try to update in background
      if (daysDiff > 7) {
        fetch(request)
          .then((response) => {
            if (response.ok) {
              cache.put(request, response.clone());
            }
          })
          .catch(() => {
            // Ignore network errors for background updates
          });
      }
    }

    return cachedResponse;
  }

  // Not in cache, fetch from network and cache
  const networkResponse = await fetch(request);
  if (networkResponse.ok) {
    cache.put(request, networkResponse.clone());
  }
  return networkResponse;
}

// Stale While Revalidate Strategy - Good for CSS/JS that can be updated
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  // Always try to fetch updated version in background
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => {
      // Ignore network errors
    });

  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }

  // Wait for network if no cached version
  return await fetchPromise;
}

// Network First Strategy - Good for HTML pages
async function networkFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Helper functions
function isImageRequest(pathname) {
  return IMAGE_EXTENSIONS.some((ext) => pathname.toLowerCase().endsWith(ext));
}

function isCSSOrJSRequest(pathname) {
  return pathname.endsWith(".css") || pathname.endsWith(".js");
}

function isHTMLRequest(pathname) {
  return (
    pathname.endsWith(".html") || pathname === "/" || !pathname.includes(".")
  );
}

// Cache cleanup function
async function cleanupCaches() {
  const cacheNames = await caches.keys();
  const cacheCleanupPromises = cacheNames.map(async (cacheName) => {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();

    // Remove entries older than 30 days
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    const cleanupPromises = requests.map(async (request) => {
      const response = await cache.match(request);
      const dateHeader = response.headers.get("date");

      if (dateHeader) {
        const responseDate = new Date(dateHeader).getTime();
        if (responseDate < thirtyDaysAgo) {
          await cache.delete(request);
          console.log(
            "Service Worker: Cleaned up old cache entry",
            request.url
          );
        }
      }
    });

    return Promise.all(cleanupPromises);
  });

  return Promise.all(cacheCleanupPromises);
}

// Run cleanup periodically
setInterval(cleanupCaches, 24 * 60 * 60 * 1000); // Once per day

// Message handling for manual cache updates
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "CLEAR_CACHE") {
    event.waitUntil(
      caches
        .keys()
        .then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => caches.delete(cacheName))
          );
        })
        .then(() => {
          event.ports[0].postMessage({ success: true });
        })
    );
  }

  if (event.data && event.data.type === "UPDATE_CACHE") {
    event.waitUntil(
      fetch(event.data.url)
        .then((response) => {
          return caches.open(DYNAMIC_CACHE).then((cache) => {
            return cache.put(event.data.url, response);
          });
        })
        .then(() => {
          event.ports[0].postMessage({ success: true });
        })
    );
  }
});
