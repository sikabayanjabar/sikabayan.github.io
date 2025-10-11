/**
 * Language Manager for Sikabayan Website
 * Manages Indonesian and Sundanese language switching
 */

class LanguageManager {
  constructor() {
    this.currentLanguage = this.getSavedLanguage() || "id";
    this.translations = this.getTranslations();
    this.init();
  }

  init() {
    console.log(
      "🌐 Language Manager initialized with language:",
      this.currentLanguage
    );
    this.updateToggleButton();
    this.applyLanguage(this.currentLanguage);
    this.bindLanguageToggle();
  }

  getSavedLanguage() {
    return localStorage.getItem("sikabayan_language");
  }

  saveLanguage(language) {
    localStorage.setItem("sikabayan_language", language);
    console.log("💾 Language saved:", language);
  }

  switchLanguage() {
    const newLanguage = this.currentLanguage === "id" ? "su" : "id";
    this.currentLanguage = newLanguage;
    this.saveLanguage(newLanguage);
    this.applyLanguage(newLanguage);
    this.updateToggleButton();

    console.log("🔄 Language switched to:", newLanguage);
  }

  applyLanguage(language) {
    // Apply translations to all elements with data-lang attribute
    const elementsToTranslate = document.querySelectorAll("[data-lang]");

    console.log(
      `🔄 Applying language: ${language}, found ${elementsToTranslate.length} elements to translate`
    );

    elementsToTranslate.forEach((element) => {
      const key = element.getAttribute("data-lang");
      if (this.translations[key] && this.translations[key][language]) {
        const oldText = element.textContent;
        const newText = this.translations[key][language];
        element.textContent = newText;
        console.log(`✅ Translated "${key}": "${oldText}" → "${newText}"`);
      } else {
        console.warn(
          `⚠️ Missing translation for key: "${key}" in language: "${language}"`
        );
      }
    });

    // Apply placeholder translations
    const elementsWithPlaceholders = document.querySelectorAll(
      "[data-lang-placeholder]"
    );
    elementsWithPlaceholders.forEach((element) => {
      const key = element.getAttribute("data-lang-placeholder");
      if (this.translations[key] && this.translations[key][language]) {
        element.placeholder = this.translations[key][language];
      }
    });

    // Apply title/alt translations
    const elementsWithTitle = document.querySelectorAll("[data-lang-title]");
    elementsWithTitle.forEach((element) => {
      const key = element.getAttribute("data-lang-title");
      if (this.translations[key] && this.translations[key][language]) {
        element.title = this.translations[key][language];
      }
    });

    // Update HTML lang attribute
    document.documentElement.lang = language;

    console.log("✅ Language applied:", language);
  }

  updateToggleButton() {
    const languageText = document.getElementById("languageToggleText");
    const languageButton = document.getElementById("languageToggle");

    if (languageText) {
      languageText.textContent = this.currentLanguage === "id" ? "ID" : "SU";
    }

    if (languageButton) {
      languageButton.setAttribute(
        "aria-label",
        this.currentLanguage === "id"
          ? "Switch to Sundanese"
          : "Switch to Indonesian"
      );
    }
  }

  bindLanguageToggle() {
    const languageToggle = document.getElementById("languageToggle");
    if (languageToggle) {
      languageToggle.addEventListener("click", () => {
        this.switchLanguage();
      });
    }
  }

  getTranslations() {
    return {
      // Navigation
      "nav.home": {
        id: "Beranda",
        su: "Beranda",
      },
      "nav.history": {
        id: "Sejarah",
        su: "Sajarah",
      },
      "nav.policy": {
        id: "Kebijakan",
        su: "Kawijakan",
      },
      "nav.materials": {
        id: "Materi",
        su: "Bahan Ajar",
      },
      "nav.exercises": {
        id: "Latihan",
        su: "Latihan",
      },
      "nav.library": {
        id: "Perpustakaan",
        su: "Perpustakaan",
      },
      "nav.contact": {
        id: "Kontak",
        su: "Kontak",
      },

      // Hero Section
      "hero.subtitle": {
        id: "Literasi Kebudayaan Aksara Sunda",
        su: "Literasi Budaya Aksara Sunda",
      },
      "hero.cta": {
        id: "Mulai Belajar",
        su: "Mimiti Diajar",
      },

      // About Section
      "about.title": {
        id: "Sejarah",
        su: "Sajarah",
      },
      "about.subtitle": {
        id: "Aksara Sunda",
        su: "Aksara Sunda",
      },
      "about.origin.title": {
        id: "Asal Usul Aksara Sunda",
        su: "Asal Muasal Aksara Sunda",
      },
      "about.origin.content": {
        id: "Sejarah Indonesia cukup panjang, begitu juga dengan akar budaya Sunda. Para peneliti sejarah mengatakan bahwa aksara Sunda awalnya berasal dari huruf Pallawa sebagai kreativitas dan kearifan lokal Sunda. Huruf Pallawa adalah jenis huruf tertua di Indonesia dan ditemukan di prasasti Kutai, Kalimantan.",
        su: "Sajarah Indonesia cukup panjang, kitu deui jeung akar budaya Sunda. Para panalungtik sajarah nyebutkeun yen aksara Sunda mimitina asalna tina hurup Pallawa salaku kreativitas jeung karifan lokal Sunda. Hurup Pallawa nyaeta jenis hurup pangkolotna di Indonesia sarta kapanggih dina prasasti Kutai, Kalimantan.",
      },
      "about.tarumanegara.title": {
        id: "Pengaruh Kerajaan Tarumanegara",
        su: "Pangaruh Karajaan Tarumanegara",
      },
      "about.tarumanegara.content": {
        id: "Adopsi huruf pun terus berkembang seiring dengan banyaknya kerajaan yang mampir ke nusantara. Dengan adanya kerajaan Tarumanegara yang menguasai Jawa bagian Barat, maka aksara yang menggambarkan bahasa Sunda pun ikut terpengaruh dengan adanya huruf sansekerta.",
        su: "Adopsi hurup terus mekar sairing jeung loba karajaan nu datang ka nusantara. Ku ayana karajaan Tarumanegara nu ngawasa Jawa bagian Kulon, mangka aksara nu ngagambarkeun basa Sunda ogé kapengaruh ku ayana hurup sanskerta.",
      },
      "about.voc.title": {
        id: "Era VOC (1705)",
        su: "Jaman VOC (1705)",
      },
      "about.voc.content": {
        id: "Saat itu, aksara ini juga sempat diatur penggunaannya oleh VOC. Tahun 1705, VOC sempat menduduki daerah Priangan. Sebagai pihak yang sempat memerintah, mereka mengeluarkan aturan bahwa aksara yang resmi salah satunya adalah Sunda, Pegon, Latin dan Arab.",
        su: "Waktu eta, aksara ieu ogé kungsi diatur pamakeanna ku VOC. Taun 1705, VOC kungsi nempatan wewengkon Priangan. Salaku pihak nu kungsi marintah, aranjeunna ngaluarkeun aturan yen aksara nu resmi salah sahijina nyaeta Sunda, Pegon, Latin jeung Arab.",
      },
      "about.colonial.title": {
        id: "Pengaruh Kolonial Eropa",
        su: "Pangaruh Kolonial Eropa",
      },
      "about.colonial.content": {
        id: "Kedudukan Eropa yang cukup lama di tanah Sunda membawa pengaruh yang sangat besar. Mereka jarang menggunakan aksara ini lagi dan lebih banyak menggunakan huruf latin. Orang Sunda pun menjadi jarang menggunakannya kembali kecuali menghadiri sekolah tertentu.",
        su: "Kaayaan Eropa nu cukup lila di tanah Sunda mawa pangaruh nu kacida gedena. Maranehna jarang make aksara ieu deui sarta leuwih loba make hurup latin. Jelema Sunda ogé jadi jarang make deui iwal mun ngahadiran sakola nu tangtu.",
      },
      "about.read.more": {
        id: "Baca Selengkapnya",
        su: "Baca Lengkepna",
      },

      // Menu Section
      "menu.title": {
        id: "Kebijakan",
        su: "Kawijakan",
      },
      "menu.subtitle": {
        id: "Aksara Sunda",
        su: "Aksara Sunda",
      },
      "menu.description": {
        id: "Peraturan Daerah Provinsi Jawa Barat Nomor 14 Tahun 2014 tentang penggunaan, pemeliharaan, dan pengembangan bahasa, sastra, dan aksara Sunda",
        su: "Peraturan Daerah Provinsi Jawa Barat Nomer 14 Taun 2014 ngeunaan pamakean, pameliharaan, jeung pamekaran basa, sastra, jeung aksara Sunda",
      },

      // Materials Section
      "materials.title": {
        id: "Materi",
        su: "Bahan Ajar",
      },
      "materials.subtitle": {
        id: "Pembelajaran",
        su: "Pangajaran",
      },
      "materials.description": {
        id: "Koleksi materi pembelajaran Aksara Sunda untuk membantu Anda memahami dan menguasai aksara tradisional Sunda",
        su: "Kumpulan bahan ajar Aksara Sunda pikeun mantuan anjeun ngarti jeung ngawasa aksara tradisional Sunda",
      },
      "materials.basic.title": {
        id: "Materi Dasar Aksara Sunda",
        su: "Bahan Ajar Dasar Aksara Sunda",
      },
      "materials.basic.description": {
        id: "Pelajari dasar-dasar penulisan dan membaca aksara Sunda untuk pemula",
        su: "Diajar dasar-dasar nulis jeung maca aksara Sunda pikeun nu mimiti",
      },
      "materials.history.title": {
        id: "Sejarah Aksara Sunda",
        su: "Sajarah Aksara Sunda",
      },
      "materials.history.description": {
        id: "Mengenal sejarah dan perkembangan aksara Sunda dari masa ke masa",
        su: "Mikanyaho sajarah jeung kamekaran aksara Sunda ti jaman ka jaman",
      },
      "materials.writing.title": {
        id: "Latihan Menulis",
        su: "Latihan Nulis",
      },
      "materials.writing.description": {
        id: "Praktik menulis aksara Sunda dengan berbagai tingkat kesulitan",
        su: "Praktek nulis aksara Sunda kalawan rupa-rupa tingkat kasusah",
      },
      "materials.complete.title": {
        id: "Materi Lengkap",
        su: "Bahan Ajar Lengkep",
      },
      "materials.complete.description": {
        id: "Berupa materi lengkap yang menggabungkan semua topik pembelajaran aksara Sunda, dari pengenalan hingga latihan menulis.",
        su: "Wujudna bahan ajar lengkep nu ngagabungkeun sakabeh topik pangajaran aksara Sunda, ti perkenalan nepi ka latihan nulis.",
      },
      "materials.read.button": {
        id: "Baca Materi",
        su: "Baca Bahan Ajar",
      },
      "materials.view.all": {
        id: "Lihat Semua Materi",
        su: "Tempo Sadaya Bahan Ajar",
      },

      // Library Section
      "library.title": {
        id: "Perpustakaan",
        su: "Perpustakaan",
      },
      "library.subtitle": {
        id: "Digital",
        su: "Digital",
      },
      "library.description": {
        id: "Koleksi cerita dan dongeng dalam aksara Sunda untuk memperkaya literasi budaya",
        su: "Kumpulan carita jeung dongeng dina aksara Sunda pikeun ngabeungharan literasi budaya",
      },
      "library.explore": {
        id: "Jelajahi Perpustakaan",
        su: "Jelajahi Perpustakaan",
      },

      // Contact Section
      "contact.title": {
        id: "Kontak",
        su: "Kontak",
      },
      "contact.subtitle": {
        id: "Kami",
        su: "Urang",
      },
      "contact.description": {
        id: "Temui tim pengembang Sikabayan yang berdedikasi untuk melestarikan aksara Sunda",
        su: "Tepang jeung tim pamekaran Sikabayan nu berdedikasi pikeun ngalestarikan aksara Sunda",
      },
      "contact.team.title": {
        id: "Tim Pengembang",
        su: "Tim Pamekaran",
      },
      "contact.info.title": {
        id: "Informasi Kontak",
        su: "Inpormasi Kontak",
      },
      "contact.follow": {
        id: "Ikuti Kami",
        su: "Nuturkeun Kami",
      },
      "contact.form.title": {
        id: "Hubungi Kami",
        su: "Hubungi Kami",
      },
      "contact.form.description": {
        id: "Ada pertanyaan atau saran? Jangan ragu untuk menghubungi kami!",
        su: "Aya patarosan atawa saran? Ulah ragu pikeun ngahubungi kami!",
      },
      "contact.form.send": {
        id: "Kirim Pesan",
        su: "Kirim Pesen",
      },

      // Form placeholders
      "form.name": {
        id: "Nama Lengkap",
        su: "Nami Lengkep",
      },
      "form.email": {
        id: "Email",
        su: "Email",
      },
      "form.phone": {
        id: "No HP",
        su: "No HP",
      },
      "form.message": {
        id: "Pesan Anda",
        su: "Pesen Anjeun",
      },
      "form.search": {
        id: "Search here...",
        su: "Teang di dieu...",
      },

      // User menu
      "user.profile": {
        id: "Profil Saya",
        su: "Propil Abdi",
      },
      "user.settings": {
        id: "Pengaturan",
        su: "Setélan",
      },
      "user.logout": {
        id: "Keluar",
        su: "Kaluar",
      },
      "user.login": {
        id: "Login",
        su: "Login",
      },

      // Footer
      "footer.created": {
        id: "Created by",
        su: "Dijieun ku",
      },

      // Latihan/Exercise Page
      "exercise.title": {
        id: "Latihan Aksara Sunda",
        su: "Latihan Aksara Sunda",
      },
      "exercise.subtitle": {
        id: "Pelajari dan Praktikkan",
        su: "Diajar jeung Praktekeun",
      },
      "exercise.description": {
        id: "Sistem pembelajaran bertingkat untuk menguasai aksara Sunda",
        su: "Sistem pangajaran bertingkat pikeun ngawasa aksara Sunda",
      },
      "exercise.level": {
        id: "Level",
        su: "Tingkat",
      },
      "exercise.start": {
        id: "Mulai Latihan",
        su: "Mimiti Latihan",
      },
      "exercise.completed": {
        id: "Selesai",
        su: "Réngsé",
      },
      "exercise.locked": {
        id: "Terkunci",
        su: "Dikonci",
      },
      "exercise.progress": {
        id: "Progress Belajar",
        su: "Kamajuan Diajar",
      },
      "exercise.total.levels": {
        id: "Total Level",
        su: "Jumlah Tingkat",
      },
      "exercise.completed.levels": {
        id: "Level Selesai",
        su: "Tingkat Réngsé",
      },
      "exercise.back.dashboard": {
        id: "Kembali ke Dashboard",
        su: "Balik ka Dashboard",
      },

      // Exercise Level Names
      "level.1.name": {
        id: "Pengenalan",
        su: "Perkenalan",
      },
      "level.2.name": {
        id: "Menulis",
        su: "Nulis",
      },
      "level.3.name": {
        id: "Vokal",
        su: "Vokal",
      },
      "level.4.name": {
        id: "Konsonan",
        su: "Konsonan",
      },
      "level.5.name": {
        id: "Sandangan",
        su: "Sandangan",
      },
      "level.6.name": {
        id: "Angka",
        su: "Angka",
      },
      "level.7.name": {
        id: "Kata Sederhana",
        su: "Kecap Basajan",
      },
      "level.8.name": {
        id: "Kalimat Pendek",
        su: "Kalimah Pondok",
      },
      "level.9.name": {
        id: "Teks Sederhana",
        su: "Téks Basajan",
      },
      "level.10.name": {
        id: "Percakapan",
        su: "Paguneman",
      },

      // General Terms
      "general.complete": {
        id: "Selesai",
        su: "Réngsé",
      },
      "general.next": {
        id: "Lanjut",
        su: "Teraskeun",
      },
      "general.previous": {
        id: "Sebelumnya",
        su: "Sateuacanna",
      },
      "general.back": {
        id: "Kembali",
        su: "Balik",
      },
      "general.continue": {
        id: "Lanjutkan",
        su: "Teraskeun",
      },
      "general.restart": {
        id: "Mulai Ulang",
        su: "Mimiti Deui",
      },
      "general.submit": {
        id: "Kirim",
        su: "Kirim",
      },
      "general.correct": {
        id: "Benar",
        su: "Leres",
      },
      "general.incorrect": {
        id: "Salah",
        su: "Lepat",
      },
      "general.score": {
        id: "Skor",
        su: "Skor",
      },

      // Book/Story titles (keeping original names)
      "book.payung.ineu": {
        id: "Payung Ineu",
        su: "Payung Ineu",
      },
      "book.galunggung": {
        id: "Galunggung",
        su: "Galunggung",
      },
      "book.kampung.naga": {
        id: "Kampung Naga",
        su: "Kampung Naga",
      },
      "book.kupu.bordir": {
        id: "Kupu-kupu Bordir",
        su: "Kupu-kupu Bordir",
      },

      // Book descriptions
      "book.traditional.story": {
        id: "Cerita tradisional dalam aksara Sunda",
        su: "Carita tradisional dina aksara Sunda",
      },
      "book.galunggung.legend": {
        id: "Legenda Gunung Galunggung",
        su: "Legenda Gunung Galunggung",
      },
      "book.kampung.naga.life": {
        id: "Kehidupan dan tradisi Kampung Naga",
        su: "Kahirupan jeung tradisi Kampung Naga",
      },
      "book.butterfly.story": {
        id: "Dongeng kupu-kupu yang pandai membordir",
        su: "Dongeng kupu-kupu nu pandai membordir",
      },

      // Additional UI elements
      "ui.loading": {
        id: "Memuat...",
        su: "Nuju dimuat...",
      },
      "ui.error": {
        id: "Terjadi kesalahan",
        su: "Aya kasalahan",
      },
      "ui.try.again": {
        id: "Coba lagi",
        su: "Coba deui",
      },
      "ui.close": {
        id: "Tutup",
        su: "Tutup",
      },
      "ui.open": {
        id: "Buka",
        su: "Buka",
      },
      "ui.read": {
        id: "Baca",
        su: "Baca",
      },
      "ui.download": {
        id: "Unduh",
        su: "Unduh",
      },

      // Reset functionality
      "reset.button": {
        id: "Reset",
        su: "Reset",
      },
    };
  }
}

// Initialize language manager when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  window.languageManager = new LanguageManager();
  console.log(
    "🌍 Language Manager ready! Supported languages: Indonesian (ID) & Sundanese (SU)"
  );
});

// Export for other scripts if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = LanguageManager;
}
