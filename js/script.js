//Toggle class active untuk humberger menu
const navbarNav = document.querySelector(".navbar-nav");

//Ketika Hamburger menu di klik
document.querySelector("#hamburger-menu").onclick = () => {
  navbarNav.classList.toggle("active");
};

//Toggle class active untuk search form
const searchForm = document.querySelector(".search-form");
const searchBox = document.querySelector("#search-box");

document.querySelector("#search-button").onclick = (e) => {
  searchForm.classList.toggle("active");
  searchBox.focus();
  e.preventDefault();
};

//Toggle class active untuk shopping cart
const shoppingCart = document.querySelector(".shopping-cart");
const shoppingCartButton = document.querySelector("#shopping-cart-button");

if (shoppingCartButton) {
  shoppingCartButton.onclick = (e) => {
    shoppingCart.classList.toggle("active");
    e.preventDefault();
  };
}

//Klik diluar element untuk menghilangkan nav
const hm = document.querySelector("#hamburger-menu");
const sb = document.querySelector("#search-button");
const sc = document.querySelector("#shopping-cart-button");

document.addEventListener("click", function (e) {
  if (!hm.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }
  if (!sb.contains(e.target) && !searchForm.contains(e.target)) {
    searchForm.classList.remove("active");
  }
  if (sc && !sc.contains(e.target) && !shoppingCart.contains(e.target)) {
    shoppingCart.classList.remove("active");
  }
});

//Modal Box
const itemDetailModal = document.querySelector("#item-detail-modal");
const itemDetailButtons = document.querySelectorAll(".item-detail-button");

itemDetailButtons.forEach((btn) => {
  btn.onclick = (e) => {
    itemDetailModal.style.display = "flex";
    e.preventDefault();
  };
});

//klik tombol close modal
const closeModal = document.querySelector(".modal .close-icon");
if (closeModal) {
  closeModal.onclick = (e) => {
    itemDetailModal.style.display = "none";
    e.preventDefault();
  };
}

//klik di luar modal
window.onclick = (e) => {
  if (e.target === itemDetailModal) {
    itemDetailModal.style.display = "none";
  }
};

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Update navbar for login status
  updateNavbarForLoginStatus();

  // Initialize back to top button
  initializeBackToTop();
});

function updateNavbarForLoginStatus() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const navbarExtra = document.querySelector(".navbar-extra");

  if (isLoggedIn) {
    // User is logged in, show user menu
    const userEmail = localStorage.getItem("userEmail");
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const currentUser = users.find((user) => user.email === userEmail) || {
      firstName: "User",
      email: userEmail,
    };

    // Replace login link with user menu
    const loginLink = navbarExtra.querySelector('a[href="login.html"]');
    if (loginLink) {
      loginLink.outerHTML = `
        <div class="user-menu-simple">
          <a href="dashboard.html" style="display: flex; align-items: center; gap: 0.5rem; color: #fff; text-decoration: none;">
            <div style="width: 25px; height: 25px; border-radius: 50%; background: linear-gradient(135deg, #2093a4, #1a7a85); display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: bold;">
              ${currentUser.firstName.charAt(0).toUpperCase()}
            </div>
            ${currentUser.firstName}
          </a>
          <a href="#" onclick="logout()" style="color: #fff; text-decoration: none; margin-left: 1rem; font-size: 0.9rem;">Keluar</a>
        </div>
      `;
    }
  }
}

function logout() {
  if (confirm("Apakah Anda yakin ingin keluar?")) {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    location.reload(); // Reload page to update navbar
  }
}

// Back to Top Button Functionality
function initializeBackToTop() {
  // Get the button
  const backToTopButton = document.getElementById("back-to-top");

  if (!backToTopButton) {
    console.log("Back to top button not found");
    return;
  }

  console.log("Back to top button found and initialized");

  // Make sure button is visible for testing
  backToTopButton.style.display = "flex";
  backToTopButton.style.opacity = "1";
  backToTopButton.style.visibility = "visible";

  // Show/hide button based on scroll position
  window.addEventListener("scroll", function () {
    const scrolled = window.pageYOffset || document.documentElement.scrollTop;

    if (scrolled > 100) {
      backToTopButton.classList.add("show");
      backToTopButton.style.opacity = "1";
      backToTopButton.style.visibility = "visible";
    } else {
      backToTopButton.classList.remove("show");
    }
  });

  // Handle click event
  backToTopButton.onclick = function (e) {
    e.preventDefault();
    console.log("Back to top button clicked - scrolling to top");

    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // Fallback for older browsers
    if (window.scrollY !== 0) {
      setTimeout(function () {
        window.scrollTo(0, 0);
      }, 100);
    }
  };
}
