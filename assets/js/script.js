/* JK Window Decorations — Main Script */

(function () {
  'use strict';

  // ── Header scroll effect ─────────────────────────────────────
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 56);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Nav toggle ───────────────────────────────────────────────
  const toggle = document.querySelector('.nav-toggle');
  const nav    = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('click', e => {
      if (header && !header.contains(e.target)) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ── Scroll animations ────────────────────────────────────────
  const animObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        animObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up, .stagger').forEach(el => animObs.observe(el));

  // ── Lightbox ─────────────────────────────────────────────────
  const lightbox    = document.getElementById('lightbox');
  const lbImg       = document.getElementById('lb-img');
  const lbClose     = document.getElementById('lb-close');

  if (lightbox && lbImg) {
    document.querySelectorAll('.gallery-item img').forEach(img => {
      img.addEventListener('click', () => {
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    const close = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    };
    if (lbClose) lbClose.addEventListener('click', close);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  // ── Copyright year ───────────────────────────────────────────
  document.querySelectorAll('.js-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

})();

// ── WhatsApp contact form (global) ────────────────────────────
function sendWhatsApp() {
  const get = id => (document.getElementById(id) || {}).value?.trim() ?? '';
  const name    = get('name');
  const email   = get('email');
  const phone   = get('phone');
  const message = get('message');

  if (!name || !email || !phone || !message) {
    alert('Please fill in all fields before sending.');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }
  if (!/^[\d\s\+\-\(\)]{7,15}$/.test(phone)) {
    alert('Please enter a valid phone number.');
    return;
  }

  const text =
`Hello JK Window Decorations 👋

I'm reaching out through your website.

👤 Name: ${name}
📧 Email: ${email}
📞 Phone: ${phone}

📝 Message:
${message}`;

  const waNum = (window.__cmsContact && window.__cmsContact.whatsapp_raw) || '917907844890';
  window.open(
    `https://wa.me/${waNum}?text=${encodeURIComponent(text)}`,
    '_blank', 'noopener,noreferrer'
  );
}
