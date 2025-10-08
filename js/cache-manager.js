// Cache Manager for Sikabayan
class SikabayanCacheManager {
  constructor() {
    this.version = "1.2.0";
    this.serviceWorkerPath = "/sw.js";
    this.debug = true;

    this.init();
  }

  async init() {
    // Register service worker
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register(
          this.serviceWorkerPath
        );
        this.log("Service Worker registered successfully");

        // Handle updates
        registration.addEventListener("updatefound", () => {
          this.log("Service Worker update found");
          this.handleServiceWorkerUpdate(registration);
        });

        // Check for updates every 30 minutes
        setInterval(() => {
          registration.update();
        }, 30 * 60 * 1000);
      } catch (error) {
        this.log("Service Worker registration failed:", error);
      }
    }

    // Initialize image lazy loading with caching
    this.initImageLazyLoading();

    // Initialize version checking
    this.initVersionChecking();

    // Initialize cache warming
    this.warmupCache();
  }

  // Handle service worker updates
  handleServiceWorkerUpdate(registration) {
    const newWorker = registration.installing;

    newWorker.addEventListener("statechange", () => {
      if (
        newWorker.state === "installed" &&
        navigator.serviceWorker.controller
      ) {
        // New service worker available
        this.showUpdateNotification();
      }
    });
  }

  // Show update notification to user
  showUpdateNotification() {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Sikabayan Update Available", {
        body: "Klik untuk memperbarui ke versi terbaru",
        icon: "/img/logo-sikabayan.png",
        tag: "sikabayan-update",
      });
    } else {
      // Fallback to custom notification
      this.showCustomUpdateNotification();
    }
  }

  showCustomUpdateNotification() {
    const notification = document.createElement("div");
    notification.className = "update-notification";
    notification.innerHTML = `
            <div class="update-content">
                <i data-feather="download"></i>
                <span>Update tersedia untuk Sikabayan</span>
                <button onclick="window.cacheManager.applyUpdate()" class="btn-update">Update</button>
                <button onclick="this.parentElement.parentElement.remove()" class="btn-close">&times;</button>
            </div>
        `;

    // Add styles
    const style = document.createElement("style");
    style.textContent = `
            .update-notification {
                position: fixed;
                top: 80px;
                right: 20px;
                background: linear-gradient(135deg, var(--primary), var(--secondary));
                color: white;
                padding: 1rem;
                border-radius: 0.5rem;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                z-index: 10000;
                animation: slideInRight 0.3s ease;
            }
            
            .update-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .btn-update, .btn-close {
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                padding: 0.3rem 0.8rem;
                border-radius: 0.3rem;
                cursor: pointer;
                font-size: 0.9rem;
            }
            
            .btn-update:hover, .btn-close:hover {
                background: rgba(255,255,255,0.3);
            }
            
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;

    document.head.appendChild(style);
    document.body.appendChild(notification);

    // Auto remove after 10 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 10000);
  }

  // Apply update
  async applyUpdate() {
    try {
      // Clear all caches
      await this.clearAllCaches();

      // Reload page
      window.location.reload(true);
    } catch (error) {
      this.log("Error applying update:", error);
    }
  }

  // Initialize image lazy loading with caching optimization
  initImageLazyLoading() {
    // Add version parameter to images for cache busting when needed
    const images = document.querySelectorAll("img[src]");

    images.forEach((img) => {
      // Add loading optimization
      img.loading = "lazy";

      // Add error handling with fallback
      img.onerror = () => {
        this.handleImageError(img);
      };

      // Add cache optimization
      this.optimizeImageCaching(img);
    });

    // Observer for dynamically added images
    const imageObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            // Element node
            const images =
              node.tagName === "IMG" ? [node] : node.querySelectorAll("img");
            images.forEach((img) => {
              img.loading = "lazy";
              img.onerror = () => this.handleImageError(img);
              this.optimizeImageCaching(img);
            });
          }
        });
      });
    });

    imageObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // Optimize image caching
  optimizeImageCaching(img) {
    const originalSrc = img.src;

    // Add cache busting parameter only if image failed to load
    img.addEventListener(
      "error",
      () => {
        const url = new URL(originalSrc);
        url.searchParams.set("v", this.version);
        url.searchParams.set("t", Date.now());
        img.src = url.toString();
      },
      { once: true }
    );
  }

  // Handle image loading errors
  handleImageError(img) {
    // Try alternative paths
    const src = img.src;

    if (src.includes("./img/")) {
      img.src = src.replace("./img/", "img/");
    } else if (src.includes("img/")) {
      img.src = src.replace("img/", "./img/");
    } else {
      // Hide broken image
      img.style.display = "none";
      this.log("Image failed to load:", src);
    }
  }

  // Initialize version checking
  initVersionChecking() {
    // Store current version
    localStorage.setItem("sikabayan-version", this.version);

    // Check for version updates every hour
    setInterval(() => {
      this.checkForUpdates();
    }, 60 * 60 * 1000);
  }

  // Check for updates
  async checkForUpdates() {
    try {
      // This could fetch from a version endpoint
      const response = await fetch("/version.json?" + Date.now());
      if (response.ok) {
        const versionData = await response.json();
        const storedVersion = localStorage.getItem("sikabayan-version");

        if (versionData.version !== storedVersion) {
          this.log("New version available:", versionData.version);
          this.showUpdateNotification();
        }
      }
    } catch (error) {
      this.log("Version check failed:", error);
    }
  }

  // Warm up cache with critical resources
  async warmupCache() {
    const criticalResources = [
      "/css/style.css",
      "/js/script.js",
      "/js/theme.js",
      "/img/logo-sikabayan.png",
    ];

    // Preload critical resources
    criticalResources.forEach((resource) => {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = resource + "?v=" + this.version;
      document.head.appendChild(link);
    });
  }

  // Clear all caches
  async clearAllCaches() {
    try {
      // Clear service worker caches
      if ("serviceWorker" in navigator && "caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      }

      // Clear browser cache
      if ("storage" in navigator && "estimate" in navigator.storage) {
        await navigator.storage.estimate();
      }

      this.log("All caches cleared");
      return true;
    } catch (error) {
      this.log("Error clearing caches:", error);
      return false;
    }
  }

  // Manual cache refresh for specific resources
  async refreshResource(url) {
    try {
      // Add cache busting parameter
      const refreshUrl =
        url + (url.includes("?") ? "&" : "?") + "refresh=" + Date.now();

      // Fetch with no-cache
      const response = await fetch(refreshUrl, {
        cache: "no-cache",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      if (response.ok) {
        // Update service worker cache
        if ("serviceWorker" in navigator) {
          const registration = await navigator.serviceWorker.ready;
          if (registration.active) {
            registration.active.postMessage({
              type: "UPDATE_CACHE",
              url: url,
            });
          }
        }
      }

      return response;
    } catch (error) {
      this.log("Error refreshing resource:", error);
      throw error;
    }
  }

  // Get cache status
  async getCacheStatus() {
    if (!("caches" in window)) return null;

    try {
      const cacheNames = await caches.keys();
      const status = {};

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        status[cacheName] = keys.length;
      }

      return status;
    } catch (error) {
      this.log("Error getting cache status:", error);
      return null;
    }
  }

  // Debug logging
  log(message, ...args) {
    if (this.debug) {
      console.log(`[SikabayanCache] ${message}`, ...args);
    }
  }
}

// Initialize cache manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.cacheManager = new SikabayanCacheManager();
});

// Export for module use
if (typeof module !== "undefined" && module.exports) {
  module.exports = SikabayanCacheManager;
}
