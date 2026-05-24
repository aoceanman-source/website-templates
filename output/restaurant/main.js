// Nav scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile nav
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('navMobile');
hamburger.addEventListener('click', () => navMobile.classList.toggle('open'));
function closeMobile() { navMobile.classList.remove('open'); }

// Hero slideshow
const slides = document.querySelectorAll('.hero-slide');
let cur = 0;
setInterval(() => {
  slides[cur].classList.remove('active');
  cur = (cur + 1) % slides.length;
  slides[cur].classList.add('active');
}, 4000);

// Menu toggle
document.querySelectorAll('.menu-item').forEach(item => {
  item.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.menu-item').forEach(i => {
      i.classList.remove('open');
      const t = i.querySelector('.menu-toggle');
      if(t) t.textContent = '查看詳情 ↓';
    });
    if (!isOpen) {
      item.classList.add('open');
      const t = item.querySelector('.menu-toggle');
      if(t) t.textContent = '收合 ↑';
    }
  });
});

// Menu filter
document.querySelectorAll('.menu-filter button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.menu-filter button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    document.querySelectorAll('.menu-item').forEach(item => {
      item.style.display = (cat === 'all' || item.dataset.cat === cat) ? '' : 'none';
    });
  });
});

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), 100);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(r => observer.observe(r));
