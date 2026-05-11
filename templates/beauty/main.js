// ===== Image Slider =====
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prevSlide');
const nextBtn = document.getElementById('nextSlide');
let currentSlide = 0;
let slideInterval;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}

function startSlider() {
  slideInterval = setInterval(nextSlide, 5000);
}

function stopSlider() {
  clearInterval(slideInterval);
}

if (prevBtn && nextBtn) {
  prevBtn.addEventListener('click', () => { stopSlider(); prevSlide(); startSlider(); });
  nextBtn.addEventListener('click', () => { stopSlider(); nextSlide(); startSlider(); });
  startSlider();
}

// ===== Mobile Navigation =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
  });

  // Close menu on link click
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
    }
  });
}

// ===== Smooth Scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== Contact Form =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Simple validation
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();
    
    if (!name || !phone || !message) {
      alert('請填寫必填欄位');
      return;
    }
    
    // Show success message
    const formContainer = contactForm.parentElement;
    contactForm.style.display = 'none';
    
    let successDiv = formContainer.querySelector('.form-success');
    if (!successDiv) {
      successDiv = document.createElement('div');
      successDiv.className = 'form-success';
      successDiv.innerHTML = '<h3>✅ 訊息已送出！</h3><p>感謝您的來信，我們會盡快與您聯繫。</p>';
      formContainer.appendChild(successDiv);
    }
    successDiv.classList.add('show');
    
    // Reset after 3 seconds
    setTimeout(() => {
      contactForm.reset();
      contactForm.style.display = 'block';
      successDiv.classList.remove('show');
    }, 3000);
  });
}

// ===== Navbar scroll effect =====
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.12)';
  } else {
    navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
  }
  
  lastScroll = currentScroll;
});

// ===== Intersection Observer for animations =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe sections for fade-in animation
document.querySelectorAll('.section').forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(20px)';
  section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(section);
});

// Make hero visible immediately
document.querySelector('.hero').style.opacity = '1';
