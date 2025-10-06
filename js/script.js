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

// Search Functionality
const searchInput = document.querySelector("#search-box");
const searchButton = document.querySelector(".search-form label");
let currentSearchResults = [];
let currentResultIndex = -1;
let searchTimeout;

if (searchInput && searchButton) {
  // Create search results dropdown
  const searchDropdown = document.createElement("div");
  searchDropdown.className = "search-dropdown";
  searchDropdown.style.display = "none";

  // Insert dropdown after search form
  const searchForm = document.querySelector(".search-form");
  searchForm.appendChild(searchDropdown);

  // Search on input change (live search with debounce)
  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.trim();

    // Clear previous timeout
    clearTimeout(searchTimeout);

    if (searchTerm.length >= 2) {
      // Debounce search by 300ms
      searchTimeout = setTimeout(() => {
        performLiveSearch(searchTerm);
      }, 300);
    } else {
      hideSearchDropdown();
      clearHighlights();
    }
  });

  // Handle keyboard navigation
  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      navigateResults(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      navigateResults(-1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (currentResultIndex >= 0 && currentSearchResults[currentResultIndex]) {
        selectSearchResult(currentResultIndex);
      } else {
        performSearch();
      }
    } else if (e.key === "Escape") {
      hideSearchDropdown();
      clearHighlights();
    }
  });

  // Search on button click
  searchButton.addEventListener("click", function (e) {
    e.preventDefault();
    performSearch();
  });

  // Hide dropdown when clicking outside
  document.addEventListener("click", function (e) {
    if (!searchForm.contains(e.target)) {
      hideSearchDropdown();
    }
  });

  function performLiveSearch(searchTerm) {
    clearHighlights();
    const searchResults = searchInPage(searchTerm.toLowerCase());
    currentSearchResults = searchResults;
    currentResultIndex = -1;

    if (searchResults.length > 0) {
      showSearchDropdown(searchResults, searchTerm);
      highlightSearchResults(searchTerm);
    } else {
      hideSearchDropdown();
    }
  }

  function showSearchDropdown(results, searchTerm) {
    const dropdown = document.querySelector(".search-dropdown");
    dropdown.innerHTML = "";
    dropdown.style.display = "block";

    results.forEach((result, index) => {
      const resultItem = document.createElement("div");
      resultItem.className = "search-result-item";

      // Get section name
      const sectionName = getSectionName(result);
      const preview = getTextPreview(result, searchTerm);

      resultItem.innerHTML = `
        <div class="result-section">${sectionName}</div>
        <div class="result-preview">${preview}</div>
      `;

      resultItem.addEventListener("click", () => selectSearchResult(index));
      dropdown.appendChild(resultItem);
    });
  }

  function hideSearchDropdown() {
    const dropdown = document.querySelector(".search-dropdown");
    dropdown.style.display = "none";
    currentResultIndex = -1;
  }

  function navigateResults(direction) {
    if (currentSearchResults.length === 0) return;

    // Update index
    currentResultIndex += direction;

    if (currentResultIndex >= currentSearchResults.length) {
      currentResultIndex = 0;
    } else if (currentResultIndex < 0) {
      currentResultIndex = currentSearchResults.length - 1;
    }

    // Update visual selection
    updateResultSelection();
  }

  function updateResultSelection() {
    const resultItems = document.querySelectorAll(".search-result-item");
    resultItems.forEach((item, index) => {
      if (index === currentResultIndex) {
        item.classList.add("selected");
      } else {
        item.classList.remove("selected");
      }
    });
  }

  function selectSearchResult(index) {
    if (currentSearchResults[index]) {
      const result = currentSearchResults[index];

      // Scroll to result
      result.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      // Close dropdown
      hideSearchDropdown();

      // Show message
      const sectionName = getSectionName(result);
      showSearchMessage(
        `✅ Navigasi ke hasil di section: ${sectionName}`,
        "success"
      );
    }
  }

  function getSectionName(element) {
    if (element.closest(".hero")) return "Home";
    if (element.closest("#about")) return "Tentang";
    if (element.closest("#menu")) return "Menu";
    if (element.closest("#materi")) return "Materi";
    if (element.closest("#contact")) return "Kontak";
    return "Umum";
  }

  function getTextPreview(element, searchTerm) {
    const text = element.textContent;
    const searchIndex = text.toLowerCase().indexOf(searchTerm.toLowerCase());

    if (searchIndex === -1) return text.substring(0, 60) + "...";

    const start = Math.max(0, searchIndex - 20);
    const end = Math.min(text.length, searchIndex + searchTerm.length + 20);
    const preview = text.substring(start, end);

    return (
      (start > 0 ? "..." : "") + preview + (end < text.length ? "..." : "")
    );
  }

  function performSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (searchTerm === "") {
      showSearchMessage("⚠️ Masukkan kata kunci pencarian!", "warning");
      return;
    }

    // Show loading state
    searchInput.placeholder = "Mencari...";
    searchInput.disabled = true;

    // Clear previous highlights
    clearHighlights();

    // Search through page content
    const searchResults = searchInPage(searchTerm);

    // Reset input state
    searchInput.disabled = false;
    searchInput.placeholder = "Cari konten...";

    if (searchResults.length > 0) {
      // Highlight results
      highlightSearchResults(searchTerm);

      // Scroll to first result
      searchResults[0].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      // Close search form
      const searchForm = document.querySelector(".search-form");
      if (searchForm) {
        searchForm.classList.remove("active");
      }

      // Determine which sections have results
      const sectionsFound = new Set();
      searchResults.forEach((result) => {
        if (result.closest(".hero")) sectionsFound.add("Beranda");
        if (result.closest("#about")) sectionsFound.add("Tentang");
        if (result.closest("#menu")) sectionsFound.add("Menu");
        if (result.closest("#materi")) sectionsFound.add("Materi");
        if (result.closest("#contact")) sectionsFound.add("Kontak");
      });

      const sectionsList = Array.from(sectionsFound).join(", ");

      // Show success message
      showSearchMessage(
        `✅ Ditemukan ${searchResults.length} hasil untuk "${searchTerm}" di section: ${sectionsList}`,
        "success"
      );
    } else {
      showSearchMessage(
        `❌ Tidak ditemukan hasil untuk "${searchTerm}"`,
        "error"
      );
    }
  }

  function searchInPage(searchTerm) {
    const results = [];

    // Search in hero section
    const heroSection = document.querySelector(".hero");
    if (heroSection) {
      const heroElements = heroSection.querySelectorAll("h1, p, .description");
      heroElements.forEach((element) => {
        const text = element.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
          results.push(element);
        }
      });
    }

    // Search in other sections
    const sections = ["about", "menu", "materi", "contact"];
    sections.forEach((sectionId) => {
      const section = document.getElementById(sectionId);
      if (section) {
        const searchableElements = section.querySelectorAll(
          "h1, h2, h3, h4, h5, h6, p, .menu-card h3, .menu-card p, .materi-card h3, .materi-card p, .contact-item h4, .contact-item p, .team-member h4, .team-member p, .about-content *"
        );

        searchableElements.forEach((element) => {
          const text = element.textContent.toLowerCase();
          if (text.includes(searchTerm)) {
            results.push(element);
          }
        });
      }
    });

    return results;
  }

  function highlightSearchResults(searchTerm) {
    // Target specific content areas, avoid navbar and search form
    const contentSections = document.querySelectorAll(
      ".hero, #about, #menu, #materi, #contact"
    );

    contentSections.forEach((section) => {
      const searchableElements = section.querySelectorAll(
        "h1, h2, h3, h4, h5, h6, p, span:not(.navbar *):not(.search-form *), a:not(.navbar *), li:not(.navbar *)"
      );

      searchableElements.forEach((element) => {
        const text = element.innerHTML;
        const regex = new RegExp(`(${searchTerm})`, "gi");
        const highlightedText = text.replace(
          regex,
          '<mark class="search-highlight">$1</mark>'
        );

        if (text !== highlightedText) {
          element.innerHTML = highlightedText;
        }
      });
    });
  }

  function clearHighlights() {
    const highlights = document.querySelectorAll(".search-highlight");
    highlights.forEach((highlight) => {
      const parent = highlight.parentNode;
      parent.replaceChild(
        document.createTextNode(highlight.textContent),
        highlight
      );
      parent.normalize();
    });
  }

  function showSearchMessage(message, type = "info") {
    // Remove existing message
    const existingMessage = document.querySelector(".search-message");
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create message element
    const messageDiv = document.createElement("div");
    messageDiv.className = `search-message search-message--${type}`;
    messageDiv.textContent = message;

    // Insert after navbar
    const navbar = document.querySelector(".navbar");
    if (navbar) {
      navbar.insertAdjacentElement("afterend", messageDiv);
    } else {
      document.body.insertAdjacentElement("afterbegin", messageDiv);
    }

    // Auto remove after 4 seconds
    setTimeout(() => {
      if (messageDiv && messageDiv.parentNode) {
        messageDiv.remove();
      }
    }, 4000);
  }
}

// Form Validation for Contact Form
document.addEventListener("DOMContentLoaded", function () {
  const phoneInput = document.querySelector('input[type="tel"]');
  const emailInput = document.querySelector('input[type="email"]');

  if (phoneInput) {
    // Allow only numbers for phone input
    phoneInput.addEventListener("input", function (e) {
      // Remove any non-digit characters
      this.value = this.value.replace(/[^0-9]/g, "");

      // Limit to 13 characters
      if (this.value.length > 13) {
        this.value = this.value.slice(0, 13);
      }
    });

    // Prevent non-numeric input
    phoneInput.addEventListener("keypress", function (e) {
      const char = String.fromCharCode(e.which);
      if (!/[0-9]/.test(char)) {
        e.preventDefault();
      }
    });
  }

  if (emailInput) {
    // Email validation on blur
    emailInput.addEventListener("blur", function () {
      const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
      if (this.value && !emailPattern.test(this.value)) {
        this.setCustomValidity(
          "Format email tidak valid. Contoh: nama@domain.com"
        );
      } else {
        this.setCustomValidity("");
      }
    });

    // Clear validation message on input
    emailInput.addEventListener("input", function () {
      this.setCustomValidity("");
    });
  }

  // Form submission validation
  const contactForm = document.querySelector(".contact-form-section form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      const phone = phoneInput.value;
      const email = emailInput.value;

      // Validate phone number length
      if (phone && (phone.length < 10 || phone.length > 13)) {
        e.preventDefault();
        alert("Nomor HP harus terdiri dari 10-13 digit angka");
        phoneInput.focus();
        return false;
      }

      // Validate email format
      const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
      if (email && !emailPattern.test(email)) {
        e.preventDefault();
        alert("Format email tidak valid. Contoh: nama@domain.com");
        emailInput.focus();
        return false;
      }

      // If all validation passes
      alert("Form berhasil dikirim!");
    });
  }
});
