/* ============================================================
   Personal Homepage — main.js
   宋卓伦 · Alan Song
   ============================================================ */

// ── 1. Theme Toggle ──────────────────────────────────────────
const html        = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  localStorage.setItem('theme', theme);
}

// Init from saved preference or system preference
const savedTheme = localStorage.getItem('theme')
  || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

// ── 2. Mobile Hamburger Menu ──────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
});

// Close menu on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

// ── 3. Navbar scroll effect ───────────────────────────────────
const navbar = document.getElementById('navbar');

function onScroll() {
  const y = window.scrollY;

  // Add shadow when scrolled
  navbar.classList.toggle('scrolled', y > 10);

  // Back-to-top visibility
  backToTop.classList.toggle('visible', y > 400);

  // Scroll progress bar
  const docH    = document.documentElement.scrollHeight - window.innerHeight;
  const pct     = docH > 0 ? (y / docH) * 100 : 0;
  scrollProgress.style.width = pct + '%';

  // Active nav link based on section in view
  updateActiveLink();
}

window.addEventListener('scroll', onScroll, { passive: true });

// ── 4. Active Navigation Link ─────────────────────────────────
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

function updateActiveLink() {
  let current = '';
  sections.forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= 80 && rect.bottom > 80) current = sec.id;
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

// ── 5. Scroll Progress ────────────────────────────────────────
const scrollProgress = document.getElementById('scrollProgress');

// ── 6. Scroll Animations (Intersection Observer) ──────────────
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach(el => revealObs.observe(el));

// ── 7. Back to Top ────────────────────────────────────────────
const backToTop = document.getElementById('backToTop');
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── 8. Smooth scroll for all in-page anchor links ────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 64; // navbar height
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── 9. Hero typing animation (subtitle tag-chips) ────────────
// No typing animation here — chips appear naturally on load.

// ── 10. Initial call ─────────────────────────────────────────
onScroll();
