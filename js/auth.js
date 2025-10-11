// Auth utility functions
class AuthManager {
  static isLoggedIn() {
    // Check both authentication methods for compatibility
    return (
      localStorage.getItem("isLoggedIn") === "true" ||
      localStorage.getItem("user_logged_in") === "true"
    );
  }

  static getCurrentUser() {
    if (!this.isLoggedIn()) return null;

    const userEmail = localStorage.getItem("userEmail");
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // Find user by email
    let user = users.find((user) => user.email === userEmail);

    // If not found by userEmail, try to get from user_name
    if (!user && localStorage.getItem("user_name")) {
      user = {
        firstName: localStorage.getItem("user_name"),
        email: userEmail || "user@example.com",
      };
    }

    return (
      user || {
        firstName: "User",
        email: userEmail || "user@example.com",
      }
    );
  }

  static login(email, password) {
    // Initialize default users if not exists
    let users = JSON.parse(localStorage.getItem("users") || "[]");

    if (users.length === 0) {
      const defaultUsers = [
        {
          email: "admin@sikabayan.com",
          password: "admin123",
          firstName: "Admin",
          lastName: "Sikabayan",
          role: "admin",
        },
        {
          email: "user@sikabayan.com",
          password: "user123",
          firstName: "User",
          lastName: "Demo",
          role: "user",
        },
        {
          email: "test@sikabayan.com",
          password: "test123",
          firstName: "Test",
          lastName: "User",
          role: "user",
        },
      ];
      localStorage.setItem("users", JSON.stringify(defaultUsers));
      users = defaultUsers;
    }

    // Validate credentials
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user || (email === "admin@sikabayan.com" && password === "admin123")) {
      // Set both authentication methods for compatibility
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user_logged_in", "true");
      localStorage.setItem("userEmail", email);

      // Set user name for compatibility
      const userName = user ? user.firstName : "Admin";
      localStorage.setItem("user_name", userName);

      // Redirect based on user role
      setTimeout(() => {
        if (
          email === "admin@sikabayan.com" ||
          (user && user.role === "admin")
        ) {
          window.location.href = "dashboard.html";
        } else {
          window.location.href = "dashboard.html"; // All authenticated users go to dashboard
        }
      }, 1000);

      return true;
    }
    return false;
  }

  static logout() {
    // Clear all authentication data
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user_logged_in");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("user_name");

    // Always redirect to index.html after logout
    window.location.href = "index.html";
  }

  static requireAuth() {
    if (!this.isLoggedIn()) {
      // Show user-friendly message and redirect
      alert("Anda harus login terlebih dahulu untuk mengakses halaman ini.");
      window.location.href = "login.html";
      return false;
    }
    return true;
  }

  static redirectIfLoggedIn() {
    if (this.isLoggedIn()) {
      window.location.href = "dashboard.html";
      return true;
    }
    return false;
  }

  static updateNavbar() {
    const isLoggedIn = this.isLoggedIn();
    const navbarExtra = document.querySelector(".navbar-extra");
    const userMenu = document.querySelector(".user-menu");
    const loginButton = document.querySelector('a[href="login.html"]');

    if (!navbarExtra) return;

    if (isLoggedIn) {
      // User is logged in - show user menu, hide login button
      if (userMenu) {
        userMenu.style.display = "block";

        // Update user info
        const currentUser = this.getCurrentUser();
        const userAvatar = userMenu.querySelector(".user-avatar");
        const userName = userMenu.querySelector("#userName, #navUserName");

        if (currentUser && userAvatar && userName) {
          userAvatar.textContent = currentUser.firstName
            .charAt(0)
            .toUpperCase();
          userName.textContent = currentUser.firstName;
        }
      }

      if (loginButton) {
        loginButton.style.display = "none";
      }
    } else {
      // User is not logged in - hide user menu, show login button
      if (userMenu) {
        userMenu.style.display = "none";
      }

      if (loginButton) {
        loginButton.style.display = "flex";
      } else {
        // Create login button if it doesn't exist
        const loginBtn = document.createElement("a");
        loginBtn.href = "login.html";
        loginBtn.className = "login-btn";
        loginBtn.innerHTML =
          '<i data-feather="log-in"></i> <span data-lang="nav.login">Login</span>';
        navbarExtra.appendChild(loginBtn);

        // Initialize feather icons if available
        if (typeof feather !== "undefined") {
          feather.replace();
        }
      }
    }
  }

  static logoutWithConfirm() {
    if (confirm("Apakah Anda yakin ingin keluar?")) {
      this.logout();
    }
  }

  static updateUser(userData) {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = users.findIndex((user) => user.email === userData.email);

    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...userData };
      localStorage.setItem("users", JSON.stringify(users));
      return true;
    }
    return false;
  }

  static getSettings() {
    return JSON.parse(localStorage.getItem("userSettings") || "{}");
  }

  static updateSettings(settings) {
    const currentSettings = this.getSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    localStorage.setItem("userSettings", JSON.stringify(updatedSettings));
    return updatedSettings;
  }

  static resetUserData() {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      localStorage.removeItem("userProgress");
      localStorage.removeItem("userSettings");
      return true;
    }
    return false;
  }
}

// Global logout function for backward compatibility
window.logout = function () {
  AuthManager.logoutWithConfirm();
};

// Auto-update navbar on page load
document.addEventListener("DOMContentLoaded", function () {
  AuthManager.updateNavbar();
});

// Export for global use
window.AuthManager = AuthManager;
