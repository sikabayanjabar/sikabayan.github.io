// Fungsi untuk menangani loading PDF
document.addEventListener("DOMContentLoaded", function () {
  const pdfViewers = document.querySelectorAll(".pdf-viewer");

  pdfViewers.forEach((viewer) => {
    viewer.addEventListener("load", function () {
      console.log("PDF loaded successfully");
    });

    viewer.addEventListener("error", function () {
      console.error("Error loading PDF");
      // Fallback jika PDF tidak bisa dimuat
      const container = viewer.parentElement;
      const fallbackDiv = document.createElement("div");
      fallbackDiv.innerHTML = `
                <div style="padding: 2rem; text-align: center; background-color: #444; border-radius: 0.5rem;">
                    <i data-feather="file-text" style="font-size: 3rem; color: var(--primary); margin-bottom: 1rem;"></i>
                    <p style="color: #fff; margin-bottom: 1rem;">PDF tidak dapat dimuat di browser ini</p>
                    <a href="${viewer.src}" target="_blank" style="color: var(--primary); text-decoration: underline;">Klik di sini untuk membuka PDF</a>
                </div>
            `;
      container.replaceChild(fallbackDiv, viewer);
      feather.replace();
    });
  });

  // Smooth scroll untuk link internal
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });

  // Animate cards on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  const materiItems = document.querySelectorAll(".materi-item");
  materiItems.forEach((item, index) => {
    item.style.opacity = "0";
    item.style.transform = "translateY(20px)";
    item.style.transition = `all 0.6s ease ${index * 0.2}s`;
    observer.observe(item);
  });
});

// Fungsi untuk download PDF
function downloadPDF(filename, title) {
  // Track download (bisa digunakan untuk analytics)
  console.log(`Downloading: ${title}`);

  // Optional: Tambahkan notifikasi download
  const notification = document.createElement("div");
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--primary);
        color: white;
        padding: 1rem;
        border-radius: 0.5rem;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
  notification.innerHTML = `
        <i data-feather="download"></i>
        Mengunduh ${title}...
    `;

  document.body.appendChild(notification);
  feather.replace();

  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}
