/**
 * =========================================================================
 * PT CANDRA ENTERTAINMENT — MAIN JAVASCRIPT
 * Fitur:
 * 1. Sticky Navbar (Efek Blur, Menciut/Merapat & Sudut Melengkung saat Scroll)
 * 2. Toggle Menu Navigasi Mobile / Tablet & Active Menu Highlight
 * 3. Animasi Halus Fade-In saat Scroll (IntersectionObserver)
 * 4. Slideshow Foto Audisi & Foto Konser Candra Pro Idol Bali
 * 5. Filter Kategori Galeri Karya
 * 6. Validasi & Pengiriman Formulir Kontak ke WhatsApp
 * =========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Konfigurasi Nomor WhatsApp Resmi (Format Internasional tanpa '+')
  // Nomor resmi PT Candra Entertainment: 081336756838
  const WHATSAPP_NUMBER = '6281336756838';

  /* =======================================================================
     1. STICKY NAVBAR (Menciut/Merapat, Blur, Sudut Melengkung saat Scroll)
     ======================================================================= */
  const header = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  const handleHeaderScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // Buka / tutup menu pada perangkat mobile & tablet
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Tutup menu mobile otomatis ketika salah satu tautan diklik
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* =======================================================================
     2. ACTIVE LINK HIGHLIGHT BERDASARKAN SECTION YANG SEDANG DILIHAT
     ======================================================================= */
  const sections = document.querySelectorAll('main section[id]');

  const updateActiveNavLink = () => {
    const scrollPosition = window.scrollY + 140;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  /* =======================================================================
     3. ANIMASI FADE-IN SAAT SCROLL (INTERSECTION OBSERVER)
     ======================================================================= */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el, index) => {
      el.style.transitionDelay = `${(index % 3) * 70}ms`;
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }

  /* =======================================================================
     4. SLIDESHOW FOTO AUDISI & FOTO KONSER CANDRA PRO IDOL BALI
     ======================================================================= */
  const idolSlideshow = document.getElementById('idolSlideshow');
  const idolSlides = document.querySelectorAll('.idol-slide');
  const idolDots = document.querySelectorAll('.slide-dot');
  const idolPrevBtn = document.getElementById('idolPrevBtn');
  const idolNextBtn = document.getElementById('idolNextBtn');

  if (idolSlideshow && idolSlides.length > 0) {
    let currentSlide = 0;
    let slideInterval = null;

    const showSlide = (index) => {
      currentSlide = (index + idolSlides.length) % idolSlides.length;

      idolSlides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentSlide);
      });

      idolDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    };

    const nextSlide = () => showSlide(currentSlide + 1);
    const prevSlide = () => showSlide(currentSlide - 1);

    const startAutoSlide = () => {
      stopAutoSlide();
      slideInterval = setInterval(nextSlide, 4500);
    };

    const stopAutoSlide = () => {
      if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
      }
    };

    if (idolNextBtn) {
      idolNextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoSlide();
      });
    }

    if (idolPrevBtn) {
      idolPrevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoSlide();
      });
    }

    idolDots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const targetIndex = Number(dot.getAttribute('data-slide') || 0);
        showSlide(targetIndex);
        startAutoSlide();
      });
    });

    // Jeda slideshow otomatis saat kursor berada di atas foto
    idolSlideshow.addEventListener('mouseenter', stopAutoSlide);
    idolSlideshow.addEventListener('mouseleave', startAutoSlide);

    startAutoSlide();
  }

  /* =======================================================================
     5. FILTER KATEGORI GALERI KARYA
     ======================================================================= */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const selectedFilter = btn.getAttribute('data-filter');

      galleryItems.forEach((item) => {
        const itemCategory = item.getAttribute('data-category');
        if (selectedFilter === 'all' || itemCategory === selectedFilter) {
          item.classList.remove('is-hidden');
        } else {
          item.classList.add('is-hidden');
        }
      });
    });
  });

  /* =======================================================================
     6. VALIDASI & PENANGANAN FORMULIR KONTAK
     ======================================================================= */
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  const showFeedback = (message, type = 'success') => {
    if (!formFeedback) return;
    formFeedback.textContent = message;
    formFeedback.className = `form-feedback show ${type}`;
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const namaInput = document.getElementById('nama');
      const emailInput = document.getElementById('email');
      const pesanInput = document.getElementById('pesan');

      const nama = namaInput ? namaInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const pesan = pesanInput ? pesanInput.value.trim() : '';

      if (!nama || !email || !pesan) {
        showFeedback('Mohon lengkapi Nama, Email, dan Pesan Anda terlebih dahulu.', 'error');
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showFeedback('Mohon masukkan alamat email yang valid (contoh: nama@email.com).', 'error');
        return;
      }

      const waText = encodeURIComponent(
        `Halo PT Candra Entertainment,\n\nNama: ${nama}\nEmail: ${email}\nPesan: ${pesan}`
      );
      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

      showFeedback(
        `Terima kasih, ${nama}! Pesan Anda telah tercatat. Mengarahkan ke WhatsApp resmi PT Candra Entertainment...`,
        'success'
      );

      contactForm.reset();

      setTimeout(() => {
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      }, 900);
    });
  }
});
