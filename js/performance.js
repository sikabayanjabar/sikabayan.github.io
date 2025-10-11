// Performance Optimization Utilities
class PerformanceManager {
  static init() {
    this.optimizeImages();
    this.lazyLoadResources();
    this.preloadCriticalAssets();
    this.setupServiceWorker();
  }

  // Image optimization
  static optimizeImages() {
    const images = document.querySelectorAll("img");

    images.forEach((img) => {
      // Add loading="lazy" for non-critical images
      if (!img.hasAttribute("loading")) {
        const isAboveFold =
          img.getBoundingClientRect().top < window.innerHeight;
        img.loading = isAboveFold ? "eager" : "lazy";
      }

      // Add error handling
      img.onerror = function () {
        console.warn("Failed to load image:", this.src);
        this.style.display = "none";
      };
    });
  }

  // Lazy load non-critical resources
  static lazyLoadResources() {
    // Lazy load videos
    const videos = document.querySelectorAll("video[data-src]");
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const video = entry.target;
          video.src = video.dataset.src;
          video.load();
          videoObserver.unobserve(video);
        }
      });
    });

    videos.forEach((video) => videoObserver.observe(video));
  }

  // Preload critical assets
  static preloadCriticalAssets() {
    const criticalAssets = [
      "/css/style.css",
      "/js/auth.js",
      "/js/theme.js",
      "/img/Logo-sikabayan.png",
    ];

    criticalAssets.forEach((asset) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = asset;

      if (asset.endsWith(".css")) {
        link.as = "style";
      } else if (asset.endsWith(".js")) {
        link.as = "script";
      } else if (asset.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        link.as = "image";
      }

      document.head.appendChild(link);
    });
  }

  // Setup service worker for caching
  static setupServiceWorker() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("✅ Service Worker registered successfully");
        })
        .catch((error) => {
          console.log("❌ Service Worker registration failed:", error);
        });
    }
  }

  // Debounce utility for search and scroll events
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Throttle utility for scroll events
  static throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // Memory cleanup
  static cleanup() {
    // Remove event listeners for performance
    const elementsWithListeners = document.querySelectorAll("[data-cleanup]");
    elementsWithListeners.forEach((element) => {
      element.removeEventListener("click", element.clickHandler);
      element.removeEventListener("scroll", element.scrollHandler);
    });
  }

  // Performance monitoring
  static monitor() {
    // Log performance metrics
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      const domReadyTime =
        timing.domContentLoadedEventEnd - timing.navigationStart;

      console.log(`⚡ Page Load Time: ${loadTime}ms`);
      console.log(`⚡ DOM Ready Time: ${domReadyTime}ms`);

      // Log to analytics if available
      if (window.gtag) {
        gtag("event", "timing_complete", {
          name: "load",
          value: Math.round(loadTime),
        });
      }
    }

    // Monitor memory usage
    if (window.performance && window.performance.memory) {
      const memory = window.performance.memory;
      console.log(
        `🧠 Memory Used: ${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`
      );
      console.log(
        `🧠 Memory Limit: ${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`
      );
    }
  }
}

// Critical performance optimizations for immediate execution
(function () {
  // DNS prefetch for external resources
  const dnsPreconnects = [
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com",
    "https://unpkg.com",
  ];

  dnsPreconnects.forEach((domain) => {
    const link = document.createElement("link");
    link.rel = "dns-prefetch";
    link.href = domain;
    document.head.appendChild(link);
  });

  // Critical CSS loading optimization
  const criticalCSSLoaded = localStorage.getItem("criticalCSSLoaded");
  if (!criticalCSSLoaded) {
    // Mark critical CSS as loaded
    localStorage.setItem("criticalCSSLoaded", "true");
  }
})();

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  PerformanceManager.init();

  // Monitor performance after load
  window.addEventListener("load", () => {
    setTimeout(() => {
      PerformanceManager.monitor();
    }, 1000);
  });
});

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
  PerformanceManager.cleanup();
});

// Export for global use
window.PerformanceManager = PerformanceManager;
