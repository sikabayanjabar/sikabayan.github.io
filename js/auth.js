// Auth utility functions
class AuthManager {
  static isLoggedIn() {
    return localStorage.getItem("isLoggedIn") === "true";
  }

  static getCurrentUser() {
    if (!this.isLoggedIn()) return null;

    const userEmail = localStorage.getItem("userEmail");
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    return (
      users.find((user) => user.email === userEmail) || {
        firstName: "User",
        email: userEmail,
      }
    );
  }

  static login(email, password) {
    // In a real app, this would validate against a server
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user || (email === "admin@sikabayan.com" && password === "admin123")) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", email);
      return true;
    }
    return false;
  }

  static logout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
  }

  static requireAuth() {
    if (!this.isLoggedIn()) {
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

    if (isLoggedIn && navbarExtra) {
      const currentUser = this.getCurrentUser();
      const loginLink = navbarExtra.querySelector('a[href="login.html"]');

      if (loginLink && currentUser) {
        loginLink.outerHTML = `
                    <div class="user-menu-simple">
                        <a href="dashboard.html" style="display: flex; align-items: center; gap: 0.5rem; color: #fff; text-decoration: none; transition: color 0.3s ease;">
                            <div style="width: 25px; height: 25px; border-radius: 50%; background: linear-gradient(135deg, #2093a4, #1a7a85); display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: bold;">
                                ${currentUser.firstName.charAt(0).toUpperCase()}
                            </div>
                            ${currentUser.firstName}
                        </a>
                        <a href="#" onclick="AuthManager.logoutWithConfirm()" style="color: #fff; text-decoration: none; margin-left: 1rem; font-size: 0.9rem; transition: color 0.3s ease;">Keluar</a>
                    </div>
                `;
      }
    }
  }

  static logoutWithConfirm() {
    if (confirm("Apakah Anda yakin ingin keluar?")) {
      this.logout();
      window.location.href = "index.html";
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

// Auto-update navbar on page load
document.addEventListener("DOMContentLoaded", function () {
  AuthManager.updateNavbar();
});

// Export for global use
window.AuthManager = AuthManager;
