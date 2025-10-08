// Universal Theme Manager for Sikabayan
console.log("Theme.js loaded");

// Initialize theme immediately to prevent flash
const savedTheme = localStorage.getItem("theme") || "dark";
console.log("Saved theme:", savedTheme);

// Apply theme function
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.body.setAttribute("data-theme", theme);
  console.log("Applied theme:", theme);
}

// Apply saved theme immediately
applyTheme(savedTheme);

// Initialize when DOM is ready
function initializeTheme() {
  console.log("Initializing theme system...");

  const themeToggle = document.getElementById("theme-toggle");
  const themeLabel = document.querySelector(".theme-toggle-label");

  if (!themeToggle) {
    console.error("Theme toggle not found!");
    return;
  }

  console.log("Theme toggle found:", themeToggle);

  // Update toggle state and label
  function updateToggle(theme) {
    console.log("Updating toggle for theme:", theme);
    if (theme === "light") {
      themeToggle.checked = true;
      if (themeLabel) themeLabel.textContent = "Light";
    } else {
      themeToggle.checked = false;
      if (themeLabel) themeLabel.textContent = "Dark";
    }
  }

  // Initialize toggle state
  updateToggle(savedTheme);

  // Add click event listener
  themeToggle.addEventListener("change", function () {
    console.log("Toggle clicked, checked:", this.checked);
    const newTheme = this.checked ? "light" : "dark";

    // Apply theme
    applyTheme(newTheme);

    // Save to localStorage
    localStorage.setItem("theme", newTheme);

    // Update toggle
    updateToggle(newTheme);

    console.log("Theme changed to:", newTheme);
  });

  console.log("Theme system initialized successfully");
}

// Wait for DOM
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeTheme);
} else {
  initializeTheme();
}
