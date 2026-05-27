/**
 * 璞白牙醫美學診所 — Main JavaScript
 * Features:
 *  - Sticky Navbar with scroll detection
 *  - Mobile hamburger menu
 *  - Scroll Reveal animations
 *  - Before/After slider
 *  - Appointment form with validation
 *  - Back to top button
 *  - Smooth scroll active link highlight
 */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────
     DOM References (all declared first)
  ────────────────────────────────────────────── */
  var navbar       = document.getElementById('navbar');
  var hamburger    = document.getElementById('hamburger');
  var navLinks     = document.getElementById('navLinks');
  var backToTopBtn = document.getElementById('backToTop');
  var sections     = document.querySelectorAll('section[id], footer[id]');
  var navAnchors   = navLinks ? navLinks.querySelectorAll('a[href^="#"]:not(.nav-cta)') : [];

  /* ──────────────────────────────────────────────
     2. ACTIVE NAV LINK highlight on scroll
  ────────────────────────────────────────────── */
  function highlightActiveSection () {
    var current = '';
    sections.forEach(function (sec) {
      var top = sec.offsetTop - 100;
      if (window.scrollY >= top) {
        current = sec.getAttribute('id');
      }
    });
    navAnchors.forEach(function (a) {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) {
        a.classList.add('active');
      }
    });
  }

  /* ──────────────────────────────────────────────
     6. BACK TO TOP
  ────────────────────────────────────────────── */
  function updateBackToTop () {
    if (!backToTopBtn) return;
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  /* ──────────────────────────────────────────────
     1. NAVBAR – scroll detection & mobile toggle
  ────────────────────────────────────────────── */
  function onScroll () {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateBackToTop();
    highlightActiveSection();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // Hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open').toString());
    });

    // Close menu when a nav link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Close menu on outside click
  document.addEventListener('click', function (e) {
    if (navbar && !navbar.contains(e.target)) {
      if (hamburger) hamburger.classList.remove('open');
      if (navLinks)  navLinks.classList.remove('open');
      if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  // Back to top click
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ──────────────────────────────────────────────
     3. SCROLL REVEAL – Intersection Observer
  ────────────────────────────────────────────── */
  function initReveal () {
    var targets = [
      '.service-card',
      '.feature-item',
      '.doctor-card',
      '.review-card',
      '.ba-slider-container',
      '.whyus-img-frame',
      '.section-header',
      '.footer-grid > *',
    ];
    targets.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el, i) {
        if (!el.classList.contains('reveal')) {
          el.classList.add('reveal');
          el.style.transitionDelay = (i * 0.08) + 's';
        }
      });
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px',
    });

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReveal);
  } else {
    initReveal();
  }

  /* ──────────────────────────────────────────────
     4. BEFORE/AFTER SLIDER
  ────────────────────────────────────────────── */
  (function initBASlider () {
    var slides   = document.querySelectorAll('.ba-slide');
    var dots     = document.querySelectorAll('.ba-dot');
    var prevBtn  = document.getElementById('baPrev');
    var nextBtn  = document.getElementById('baNext');
    var current  = 0;
    var autoTimer = null;

    function goTo (index) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }

    function startAuto () {
      stopAuto();
      autoTimer = setInterval(function () { goTo(current + 1); }, 5000);
    }
    function stopAuto () {
      clearInterval(autoTimer);
    }

    if (prevBtn && nextBtn && slides.length > 0) {
      prevBtn.addEventListener('click', function () { goTo(current - 1); startAuto(); });
      nextBtn.addEventListener('click', function () { goTo(current + 1); startAuto(); });

      dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
          goTo(parseInt(this.dataset.index, 10));
          startAuto();
        });
      });

      startAuto();

      var container = document.querySelector('.ba-slider-container');
      if (container) {
        container.addEventListener('mouseenter', stopAuto);
        container.addEventListener('mouseleave', startAuto);
      }
    }
  })();

  /* ──────────────────────────────────────────────
     5. APPOINTMENT FORM
  ────────────────────────────────────────────── */
  (function initForm () {
    var form    = document.getElementById('appointmentForm');
    var success = document.getElementById('formSuccess');

    if (!form) return;

    // Set min date to today
    var dateInput = document.getElementById('date');
    if (dateInput) {
      var today = new Date();
      var yyyy  = today.getFullYear();
      var mm    = String(today.getMonth() + 1).padStart(2, '0');
      var dd    = String(today.getDate()).padStart(2, '0');
      dateInput.min = yyyy + '-' + mm + '-' + dd;
    }

    function showError (input, msg) {
      input.style.borderColor = '#F07878';
      var err = document.createElement('span');
      err.className = 'field-error';
      err.textContent = msg;
      err.style.cssText = 'display:block;font-size:.75rem;color:#F07878;margin-top:.25rem;';
      input.parentNode.appendChild(err);
    }

    function clearErrors () {
      document.querySelectorAll('.field-error').forEach(function (el) { el.remove(); });
      document.querySelectorAll('.form-group input, .form-group select, .form-group textarea')
        .forEach(function (el) { el.style.borderColor = ''; });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameEl  = document.getElementById('name');
      var phoneEl = document.getElementById('phone');

      clearErrors();

      var valid = true;

      if (!nameEl.value.trim()) {
        showError(nameEl, '請輸入您的姓名');
        valid = false;
      }
      if (!phoneEl.value.trim()) {
        showError(phoneEl, '請輸入聯絡電話');
        valid = false;
      } else if (!/^[\d\s\-\+]{8,}$/.test(phoneEl.value.trim())) {
        showError(phoneEl, '請輸入有效的電話號碼');
        valid = false;
      }

      if (!valid) return;

      var submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 送出中…';

      setTimeout(function () {
        form.classList.add('hidden');
        if (success) success.classList.remove('hidden');
        setTimeout(function () {
          form.reset();
          form.classList.remove('hidden');
          if (success) success.classList.add('hidden');
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> 送出預約申請';
        }, 6000);
      }, 1200);
    });
  })();

  /* ──────────────────────────────────────────────
     7. SMOOTH SCROLL for anchor links
  ────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href   = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var navHeight = navbar ? navbar.offsetHeight : 0;
        var top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ──────────────────────────────────────────────
     8. SERVICE CARD – stagger entrance animation
  ────────────────────────────────────────────── */
  (function staggerCards () {
    var cards = document.querySelectorAll('.service-card[data-delay]');
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var delay = parseInt(entry.target.dataset.delay || 0, 10);
          (function (el) {
            setTimeout(function () {
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
            }, delay);
          })(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    cards.forEach(function (card) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(40px)';
      card.style.transition = 'opacity .7s ease, transform .7s ease';
      obs.observe(card);
    });
  })();

  /* ──────────────────────────────────────────────
     9. COUNTER ANIMATION (Hero Stats)
  ────────────────────────────────────────────── */
  (function initCounters () {
    var counters = [
      { selector: '.hero-stats .stat:nth-child(1) strong', end: 3000, suffix: '+', duration: 2000 },
      { selector: '.hero-stats .stat:nth-child(3) strong', end: 15,   suffix: '年', duration: 1500 },
      { selector: '.hero-stats .stat:nth-child(5) strong', end: 98,   suffix: '%', duration: 1800 },
    ];

    var heroSection = document.getElementById('hero');
    var animated    = false;

    var obs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !animated) {
        animated = true;
        counters.forEach(function (c) {
          var el = document.querySelector(c.selector);
          if (!el) return;
          var start = 0;
          var step  = Math.ceil(c.end / (c.duration / 16));
          var timer = setInterval(function () {
            start = Math.min(start + step, c.end);
            el.innerHTML = start.toLocaleString() + '<span>' + c.suffix + '</span>';
            if (start >= c.end) clearInterval(timer);
          }, 16);
        });
      }
    }, { threshold: 0.5 });

    if (heroSection) obs.observe(heroSection);
  })();

})();
