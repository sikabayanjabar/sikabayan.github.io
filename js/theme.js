// Universal Theme Manager for Sikabayan - Works with both button and checkbox toggles
console.log("🎨 Universal Theme.js loaded");

// Initialize theme immediately to prevent flash
const savedTheme = localStorage.getItem("theme") || "dark";
console.log("💾 Saved theme:", savedTheme);

// Apply theme function
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.body.setAttribute("data-theme", theme);
  console.log("✅ Applied theme:", theme);
}

// Apply saved theme immediately
applyTheme(savedTheme);

// Initialize when DOM is ready
function initializeTheme() {
  console.log("🔄 Initializing universal theme system...");

  const themeToggle = document.getElementById("themeToggle");

  if (!themeToggle) {
    console.error("❌ Theme toggle not found!");
    return;
  }

  console.log(
    "🎯 Theme toggle found:",
    themeToggle.tagName,
    themeToggle.type || "N/A"
  );

  // Determine if it's a checkbox or button
  const isCheckbox =
    themeToggle.tagName === "INPUT" && themeToggle.type === "checkbox";
  const isButton = themeToggle.tagName === "BUTTON";

  // Update toggle state
  function updateToggle(theme) {
    console.log("🔄 Updating toggle for theme:", theme);

    if (isCheckbox) {
      // For checkbox toggles (like index.html, dashboard.html)
      themeToggle.checked = theme === "light";
    } else if (isButton) {
      // For button toggles (simple emoji button)
      if (theme === "light") {
        themeToggle.textContent = "☀️";
      } else {
        themeToggle.textContent = "🌙";
      }
    }
  }

  // Initialize toggle state
  updateToggle(savedTheme);

  // Add event listener
  if (isCheckbox) {
    // For checkbox: listen to 'change' event
    themeToggle.addEventListener("change", function () {
      console.log("📱 Checkbox toggle changed");
      const newTheme = themeToggle.checked ? "light" : "dark";

      // Apply theme
      applyTheme(newTheme);

      // Save to localStorage
      localStorage.setItem("theme", newTheme);

      console.log("✨ Theme changed to:", newTheme);
    });
  } else if (isButton) {
    // For button: listen to 'click' event
    themeToggle.addEventListener("click", function () {
      console.log("🖱️ Button toggle clicked");
      const currentTheme =
        document.documentElement.getAttribute("data-theme") || "dark";
      const newTheme = currentTheme === "dark" ? "light" : "dark";

      // Apply theme
      applyTheme(newTheme);

      // Save to localStorage
      localStorage.setItem("theme", newTheme);

      // Update toggle
      updateToggle(newTheme);

      console.log("✨ Theme changed to:", newTheme);
    });
  }

  console.log("🎉 Universal theme system initialized successfully");
  console.log("🔧 Theme persistence: ON");
  console.log("🌍 Cross-page consistency: ENABLED");
}

// Global toggle function for onclick handlers
function toggleTheme() {
  console.log("🔄 Global toggleTheme() called");
  const currentTheme =
    document.documentElement.getAttribute("data-theme") || "dark";
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  // Apply theme
  applyTheme(newTheme);

  // Save to localStorage
  localStorage.setItem("theme", newTheme);

  // Update any toggle found
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    const isCheckbox =
      themeToggle.tagName === "INPUT" && themeToggle.type === "checkbox";
    const isButton = themeToggle.tagName === "BUTTON";

    if (isCheckbox) {
      themeToggle.checked = newTheme === "light";
    } else if (isButton) {
      themeToggle.textContent = newTheme === "light" ? "☀️" : "🌙";
    }
  }

  console.log("✨ Global theme changed to:", newTheme);
}

// Wait for DOM
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeTheme);
} else {
  initializeTheme();
}

// Make toggleTheme globally available
window.toggleTheme = toggleTheme;

console.log("🌐 Universal theme system ready!");
console.log("📋 Features:");
console.log("   ✅ Checkbox toggle support (index.html, dashboard.html)");
console.log("   ✅ Button toggle support (simple buttons)");
console.log("   ✅ Cross-page theme persistence");
console.log("   ✅ Instant theme application");
console.log("   ✅ Automatic toggle state sync");
