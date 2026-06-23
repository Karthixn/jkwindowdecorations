/* ============================================================
   CMS Content Loader
   Fetches JSON data files edited by Decap CMS and renders
   page content dynamically. Falls back to static HTML if
   fetch fails.
============================================================ */

(function () {
  'use strict';

  const BASE = '';

  function esc(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  async function load(path) {
    try {
      const r = await fetch(`${BASE}/data/${path}?t=${Date.now()}`);
      if (!r.ok) return null;
      return r.json();
    } catch { return null; }
  }

  // ── Contact info (footer + floating buttons on every page) ──
  async function loadContact() {
    const c = await load('contact.json');
    if (!c) return;

    document.querySelectorAll('[data-cms="phone"]').forEach(el => el.textContent = c.phone);
    document.querySelectorAll('[data-cms="whatsapp"]').forEach(el => el.textContent = c.whatsapp + ' (WhatsApp)');
    document.querySelectorAll('[data-cms="email"]').forEach(el => el.textContent = c.email);
    document.querySelectorAll('[data-cms="location"]').forEach(el => el.textContent = c.location);

    document.querySelectorAll('[data-cms-href="whatsapp"]').forEach(el => {
      el.href = `https://wa.me/${c.whatsapp_raw}`;
    });
    document.querySelectorAll('[data-cms-href="call"]').forEach(el => {
      el.href = `tel:+${c.whatsapp_raw}`;
    });

    window.__cmsContact = c;
  }

  // ── Home page ───────────────────────────────────────────────
  async function loadHome() {
    const d = await load('home.json');
    if (!d) return;

    const $ = id => document.getElementById(id);

    if (d.hero) {
      const e = $('hero-eyebrow'); if (e) e.textContent = d.hero.eyebrow;
      const t = $('hero-title');   if (t) t.innerHTML = `${esc(d.hero.title_line1)}<br><em>${esc(d.hero.title_line2)}</em>`;
      const s = $('hero-sub');     if (s) s.textContent = d.hero.subtitle;
    }

    if (d.showcase && d.showcase.length) {
      const g = $('showcase-grid');
      if (g) g.innerHTML = d.showcase.map(i => `
        <div class="showcase-item">
          <img src="${esc(i.image)}" alt="${esc(i.alt)}" loading="lazy">
          <div class="showcase-caption">${esc(i.caption)}</div>
        </div>
      `).join('');
    }

    const wt = $('why-title'); if (wt) wt.textContent = d.why_title;
    const wd = $('why-desc');  if (wd) wd.textContent = d.why_description;

    if (d.stats && d.stats.length) {
      const sg = $('stats-grid');
      if (sg) sg.innerHTML = d.stats.map(s => `
        <div class="stat-box">
          <div class="num">${esc(s.number)}</div>
          <div class="lbl">${esc(s.label)}</div>
        </div>
      `).join('');
    }

    if (d.features && d.features.length) {
      const fg = $('features-grid');
      if (fg) fg.innerHTML = d.features.map(f => `
        <div class="feature-row">
          <div class="feature-icon" aria-hidden="true">${f.icon}</div>
          <div class="feature-text">
            <h4>${esc(f.title)}</h4>
            <p>${esc(f.description)}</p>
          </div>
        </div>
      `).join('');
    }

    if (d.cta) {
      const ct = $('cta-title'); if (ct) ct.textContent = d.cta.title;
      const cd = $('cta-desc');  if (cd) cd.textContent = d.cta.description;
    }
  }

  // ── Services page ──────────────────────────────────────────
  async function loadServices() {
    const d = await load('services.json');
    if (!d || !d.items) return;

    const g = document.getElementById('services-grid');
    if (!g) return;

    g.innerHTML = d.items.map(s => `
      <div class="service-card">
        <div class="service-img">
          <img src="${esc(s.image)}" alt="${esc(s.alt)}" loading="lazy">
        </div>
        <div class="service-body">
          <span class="service-tag">${esc(s.tag)}</span>
          <h3>${esc(s.name)}</h3>
          <p>${esc(s.description)}</p>
        </div>
      </div>
    `).join('');
  }

  // ── Gallery page ───────────────────────────────────────────
  async function loadGallery() {
    const d = await load('gallery.json');
    if (!d || !d.items) return;

    const g = document.getElementById('gallery-grid');
    if (!g) return;

    g.innerHTML = d.items.map(i => `
      <div class="gallery-item">
        <img src="${esc(i.image)}" alt="${esc(i.alt)}" loading="lazy">
        <div class="gallery-overlay"><span>🔍</span></div>
      </div>
    `).join('');

    // Re-bind lightbox clicks for new images
    const lightbox = document.getElementById('lightbox');
    const lbImg    = document.getElementById('lb-img');
    if (lightbox && lbImg) {
      g.querySelectorAll('.gallery-item img').forEach(img => {
        img.addEventListener('click', () => {
          lbImg.src = img.src;
          lbImg.alt = img.alt;
          lightbox.classList.add('open');
          document.body.style.overflow = 'hidden';
        });
      });
    }
  }

  // ── Contact page ───────────────────────────────────────────
  async function loadContactPage() {
    const c = await load('contact.json');
    if (!c) return;

    const cards = document.getElementById('contact-cards');
    if (!cards) return;

    cards.innerHTML = `
      <div class="contact-card">
        <div class="cc-icon" aria-hidden="true">📞</div>
        <div class="cc-text">
          <strong>Phone</strong>
          <span>${esc(c.phone)}</span>
        </div>
      </div>
      <div class="contact-card">
        <div class="cc-icon" aria-hidden="true">💬</div>
        <div class="cc-text">
          <strong>WhatsApp</strong>
          <span>${esc(c.whatsapp)}</span>
        </div>
      </div>
      <div class="contact-card">
        <div class="cc-icon" aria-hidden="true">📧</div>
        <div class="cc-text">
          <strong>Email</strong>
          <span>${esc(c.email)}</span>
        </div>
      </div>
      <div class="contact-card">
        <div class="cc-icon" aria-hidden="true">📍</div>
        <div class="cc-text">
          <strong>Location</strong>
          <span>${esc(c.location)}</span>
        </div>
      </div>
    `;

    window.__cmsContact = c;
  }

  // ── Init ───────────────────────────────────────────────────
  const page = document.body.dataset.page;

  loadContact();

  if (page === 'home')     loadHome();
  if (page === 'services') loadServices();
  if (page === 'gallery')  loadGallery();
  if (page === 'contact')  loadContactPage();

})();
