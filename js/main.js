import { projects, projectDomains, featuredProjectSlugs, projectOrder, skillGroups, experience } from './data.js';

// ============================================================
// 1. APPLICATION INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initHashRouting();
  renderProjects();
  renderSkills();
  renderExperience();
  initProjectModal();
  initMobileMenu();
  initContactForm();
  initResumeMenu();
});

// ============================================================
// 2. LIGHT / DARK THEME TOGGLE
// ============================================================

function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;
  
  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    try {
      localStorage.setItem('portfolio-theme', newTheme);
    } catch (e) {
      // Privacy mode: the theme still applies, it just will not persist.
    }
  });
}

// ============================================================
// 3. SPA HASH-ROUTING SYSTEM
// ============================================================

function initHashRouting() {
  const sections = document.querySelectorAll('.page-section');
  const navLinks = document.querySelectorAll('#header-nav .nav-link');
  
  let currentSection = null;
  function handleRoute() {
    const rawHash = window.location.hash;
    const baseHash = rawHash.split('/')[0];
    const hash = ['#about', '#projects', '#skills', '#experience', '#contact'].includes(baseHash)
      ? baseHash
      : '#about';
    
    // 1. Swap active section
    sections.forEach(section => {
      section.classList.toggle('active', `#${section.getAttribute('id')}` === hash);
    });
    
    // 2. Swap active navbar links
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === hash);
    });
    
    // 3. Scroll to top when the section changes (not when a project
    //    detail view opens or closes inside #projects)
    if (hash !== currentSection) window.scrollTo(0, 0);
    currentSection = hash;
    
    // 4. Update window hash if empty/fallback triggered
    if (baseHash !== hash) {
      history.replaceState(null, null, hash);
    }
  }
  
  window.addEventListener('hashchange', handleRoute);
  handleRoute(); // Run on initial load
}

// ============================================================
// 4. PROJECTS: FILTERS, FEATURED CARDS AND GRID
// ============================================================

const domainBySlug = Object.fromEntries(projectDomains.map(d => [d.slug, d]));
const projectBySlug = Object.fromEntries(projects.map(p => [p.slug, p]));

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function escapeAttr(str) {
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function youtubeId(url) {
  const match = url && url.match(/embed\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : null;
}

// Ordered list: featured first, then projectOrder, then anything left over.
function orderedProjects() {
  const seen = new Set();
  const out = [];
  [...featuredProjectSlugs, ...projectOrder, ...projects.map(p => p.slug)].forEach(slug => {
    if (!seen.has(slug) && projectBySlug[slug]) {
      seen.add(slug);
      out.push(projectBySlug[slug]);
    }
  });
  return out;
}

function primaryDomain(proj) {
  return domainBySlug[proj.domains[0]] || { title: '' };
}

// Card thumbnail: local muted loop > YouTube still > first image.
function renderThumb(proj, { autoplay = true } = {}) {
  const reduceMotion = prefersReducedMotion();
  const alt = escapeAttr(`${proj.t}: preview`);
  if (proj.media && proj.media.length && proj.media[0].src) {
    const m = proj.media[0];
    const fit = m.fit === 'contain' ? ' is-contain' : '';
    if (reduceMotion && m.poster) {
      return { cls: fit, html: `<img src="${m.poster}" alt="${alt}" loading="lazy">` };
    }
    return {
      cls: fit,
      html: `<video src="${m.src}"${m.poster ? ` poster="${m.poster}"` : ''}${autoplay && !reduceMotion ? ' autoplay' : ''} muted loop playsinline preload="metadata" aria-hidden="true" tabindex="-1"></video>`
    };
  }
  const yt = youtubeId(proj.video);
  if (yt) {
    return {
      cls: '',
      html: `<img src="https://img.youtube.com/vi/${yt}/hqdefault.jpg" alt="${alt}" loading="lazy"><span class="proj-card-play" aria-hidden="true">▶</span>`
    };
  }
  if (proj.images && proj.images.length) {
    return { cls: '', html: `<img src="${proj.images[0]}" alt="${alt}" loading="lazy">` };
  }
  return { cls: ' is-fallback', html: `<div class="proj-card-fallback"><span>${proj.metrics[0].num}</span></div>` };
}

function renderBadges(proj) {
  const badges = [];
  if (proj.status) badges.push(`<span class="proj-badge is-status">${proj.status}</span>`);
  if (proj.private) badges.push('<span class="proj-badge">Private repo</span>');
  return badges.join('');
}

function renderProjectLinks(project, { compact = false } = {}) {
  const links = [];
  const compactCls = 'proj-ext-link';
  const hasLead = Boolean(project.liveDemo);
  if (project.liveDemo) {
    links.push(`<a href="${project.liveDemo}" class="${compact ? compactCls : 'btn btn-primary'}" target="_blank" rel="noopener noreferrer">Live demo ↗</a>`);
  }
  if (project.report) {
    links.push(`<a href="${project.report}" class="${compact ? compactCls : 'btn btn-secondary'}">Report</a>`);
  }
  if (project.github) {
    const ghClass = compact ? compactCls : (hasLead ? 'btn btn-secondary' : 'btn btn-primary');
    links.push(`<a href="${project.github}" class="${ghClass}" target="_blank" rel="noopener noreferrer">${compact ? 'Code ↗' : 'View code on GitHub ↗'}</a>`);
  }
  if (project.demo) {
    links.push(`<a href="${project.demo}" class="${compact ? compactCls : 'btn btn-secondary'}" target="_blank" rel="noopener noreferrer">Watch the demo ↗</a>`);
  }
  return links.join('');
}

function renderFeaturedCard(proj) {
  const thumb = renderThumb(proj);
  const titleId = `proj-title-${proj.slug}`;
  return `
    <article class="proj-feature" data-slug="${proj.slug}" data-domains="${proj.domains.join(' ')}" aria-labelledby="${titleId}">
      <div class="proj-feature-media${thumb.cls}">
        ${thumb.html}
        <span class="proj-card-cat">${primaryDomain(proj).title}</span>
      </div>
      <div class="proj-feature-body">
        <div class="proj-card-meta">
          <span class="proj-card-date">${proj.date}</span>
          <span class="proj-badges">${renderBadges(proj)}</span>
        </div>
        <h3 id="${titleId}" class="proj-feature-title">
          <button type="button" class="proj-open" data-slug="${proj.slug}">${proj.t}</button>
        </h3>
        <p class="proj-hook">${proj.hook}</p>
        ${proj.context ? `<p class="proj-context">${proj.context}</p>` : ''}
        <dl class="proj-metric-row">
          ${proj.metrics.slice(0, 3).map(m => `
            <div class="proj-metric">
              <dt class="proj-metric-val">${m.num}</dt>
              <dd class="proj-metric-lbl">${m.label}</dd>
            </div>`).join('')}
        </dl>
        <div class="proj-feature-footer">
          <ul class="proj-stack" aria-label="Tech stack">
            ${proj.stack.slice(0, 5).map(s => `<li>${s}</li>`).join('')}
          </ul>
          <div class="proj-feature-actions">
            ${renderProjectLinks(proj, { compact: true }) || '<span class="proj-cta" aria-hidden="true">Read case study →</span>'}
          </div>
        </div>
      </div>
    </article>
  `;
}

function renderCompactCard(proj) {
  const thumb = renderThumb(proj);
  const titleId = `proj-title-${proj.slug}`;
  const m = proj.metrics[0];
  return `
    <article class="proj-card" data-slug="${proj.slug}" data-domains="${proj.domains.join(' ')}" aria-labelledby="${titleId}">
      <div class="proj-card-media${thumb.cls}">
        ${thumb.html}
        <span class="proj-card-cat">${primaryDomain(proj).title}</span>
      </div>
      <div class="proj-card-body">
        <div class="proj-card-meta">
          <span class="proj-card-date">${proj.date}</span>
          <span class="proj-badges">${renderBadges(proj)}</span>
        </div>
        <h3 id="${titleId}">
          <button type="button" class="proj-open" data-slug="${proj.slug}">${proj.t}</button>
        </h3>
        <p class="proj-hook">${proj.hook}</p>
        <div class="proj-card-footer">
          <div class="proj-card-metric">
            <span class="proj-card-metric-val">${m.num}</span>
            <span class="proj-card-metric-lbl">${m.label}</span>
          </div>
          <ul class="proj-stack is-compact" aria-label="Tech stack">
            ${proj.stack.slice(0, 3).map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>
      </div>
    </article>
  `;
}

function renderProjects() {
  const filterBar = document.getElementById('projects-filter-bar');
  const gallery = document.getElementById('projects-categories-container');
  if (!gallery) return;

  const ordered = orderedProjects();
  const featuredSet = new Set(featuredProjectSlugs);
  const featured = ordered.filter(p => featuredSet.has(p.slug));
  const rest = ordered.filter(p => !featuredSet.has(p.slug));

  const filters = [
    { slug: 'all', title: 'All', count: projects.length },
    ...projectDomains.map(d => ({ ...d, count: projects.filter(p => p.domains.includes(d.slug)).length }))
  ].filter(f => f.count > 0);

  let activeFilter = 'all';

  if (filterBar) {
    filterBar.setAttribute('role', 'group');
    filterBar.setAttribute('aria-label', 'Filter projects by domain');
    filterBar.innerHTML = filters.map(f => `
      <button type="button" class="proj-filter${f.slug === activeFilter ? ' active' : ''}" data-filter="${f.slug}" aria-pressed="${f.slug === activeFilter}">
        ${f.title}<span class="proj-filter-count" aria-hidden="true">${f.count}</span>
      </button>
    `).join('');
  }

  gallery.className = 'projects-gallery';
  gallery.innerHTML = `
    <div class="proj-group" data-group="featured">
      <h3 class="proj-group-title mono">Featured</h3>
      <div class="proj-feature-list">${featured.map(renderFeaturedCard).join('')}</div>
    </div>
    <div class="proj-group" data-group="more">
      <h3 class="proj-group-title mono">More projects</h3>
      <div class="proj-grid">${rest.map(renderCompactCard).join('')}</div>
    </div>
  `;

  // Whole card is clickable; the title button is the accessible control.
  gallery.addEventListener('click', (e) => {
    if (e.target.closest('a')) return;
    const card = e.target.closest('[data-slug]');
    if (!card || !gallery.contains(card)) return;
    openProject(card.dataset.slug, card.querySelector('.proj-open'));
  });

  function applyFilter() {
    let visible = 0;
    gallery.querySelectorAll('.proj-group').forEach(group => {
      let groupVisible = 0;
      group.querySelectorAll('[data-domains]').forEach(card => {
        const show = activeFilter === 'all' || card.dataset.domains.split(' ').includes(activeFilter);
        card.hidden = !show;
        if (show) groupVisible += 1;
      });
      group.hidden = groupVisible === 0;
      visible += groupVisible;
    });
    if (filterBar) {
      filterBar.querySelectorAll('.proj-filter').forEach(btn => {
        const on = btn.dataset.filter === activeFilter;
        btn.classList.toggle('active', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }
    const countEl = document.getElementById('projects-visible-count');
    if (countEl) {
      const f = filters.find(x => x.slug === activeFilter);
      countEl.textContent = activeFilter === 'all'
        ? `${visible} projects · ${featured.length} featured`
        : `${visible} in ${f ? f.title : ''}`;
    }
  }

  if (filterBar) {
    filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.proj-filter');
      if (!btn) return;
      activeFilter = btn.dataset.filter;
      applyFilter();
    });
  }

  applyFilter();
  initCardVideoPausing(gallery);
}

// Pause card loops that are off screen (saves battery and CPU).
function initCardVideoPausing(root) {
  if (!('IntersectionObserver' in window) || prefersReducedMotion()) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const v = entry.target;
      if (entry.isIntersecting) {
        const p = v.play();
        if (p && p.catch) p.catch(() => {});
      } else {
        v.pause();
      }
    });
  }, { threshold: 0.15 });
  root.querySelectorAll('video').forEach(v => io.observe(v));
}

// Render Skills Group list
function renderSkills() {
  const container = document.getElementById('skills-grid-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  skillGroups.forEach(group => {
    const card = document.createElement('div');
    card.className = 'skills-group-card';
    
    card.innerHTML = `
      <h3>${group.title}</h3>
      <div class="skills-badge-list">
        ${group.items.map(item => `<span class="skill-badge">${item}</span>`).join('')}
      </div>
    `;
    
    container.appendChild(card);
  });
}

// Render Experience Timeline
function renderExperience() {
  const container = document.getElementById('experience-timeline-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  experience.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.className = 'timeline-item';
    
    itemEl.innerHTML = `
      <div class="timeline-left">
        <span class="timeline-date">${item.period}</span>
      </div>
      <div class="timeline-center">
        <span class="timeline-dot"></span>
      </div>
      <div class="timeline-right">
        <div class="timeline-card" data-date="${item.period}">
          <h3>${item.role}</h3>
          <div class="timeline-org">${item.org}</div>
          <p>${item.desc}</p>
        </div>
      </div>
    `;
    
    container.appendChild(itemEl);
  });
}

// ============================================================
// 6. PROJECT DETAIL VIEW (DIALOG) & LIGHTBOX
// ============================================================

let openProject = () => {};
let modalOpenSlug = null;

function renderDetailMedia(project) {
  const reduceMotion = prefersReducedMotion();
  let html = '';
  if (project.media && project.media.length) {
    const grid = project.media.length > 1;
    html += `
      <div class="detail-media-list${grid ? ' is-grid' : ''}${grid && project.media.every(m => m.aspect) ? ' is-compact' : ''}">
        ${project.media.map(m => `
          <figure class="detail-media-item${m.aspect ? ' has-aspect' : ''}"${m.aspect ? ` style="--media-aspect: ${m.aspect}"` : ''}>
            <video src="${m.src}"${m.poster ? ` poster="${m.poster}"` : ''} controls muted loop playsinline${reduceMotion ? '' : ' autoplay'} preload="metadata"${m.caption ? ` aria-label="${escapeAttr(m.caption)}"` : ''}></video>
            ${m.caption ? `<figcaption>${m.caption}</figcaption>` : ''}
          </figure>
        `).join('')}
      </div>`;
  }
  if (project.video) {
    html += `
      <div class="video-wrapper">
        <iframe src="${project.video}" title="${escapeAttr(project.t)} demo video" loading="lazy" allow="encrypted-media; picture-in-picture" allowfullscreen></iframe>
      </div>`;
  }
  if (project.images && project.images.length) {
    html += `
      <div class="detail-img-grid${project.images.length > 1 ? ' two-cols' : ''}">
        ${project.images.map((img, i) => `
          <button type="button" class="zoom-btn" aria-label="Enlarge figure ${i + 1} of ${project.images.length}">
            <img src="${img}" alt="${escapeAttr(project.t)}: figure ${i + 1}" class="zoom-img" loading="lazy"/>
          </button>`).join('')}
      </div>`;
  }
  return html;
}

function renderDetail(project, prev, next) {
  const domains = project.domains.map(d => domainBySlug[d]).filter(Boolean);
  return `
    <header class="detail-header">
      <p class="detail-kicker mono">
        <span>${domains.map(d => d.title).join(' · ')}</span>
        <span aria-hidden="true">/</span>
        <span>${project.date}</span>
      </p>
      <h2 class="detail-title" id="detail-title">${project.t}</h2>
      <p class="detail-hook">${project.hook}</p>
      <div class="detail-meta">
        ${project.context ? `<span class="detail-context">${project.context}</span>` : ''}
        ${renderBadges(project)}
      </div>
    </header>

    <dl class="detail-metrics">
      ${project.metrics.map(m => `
        <div class="detail-metric">
          <dt class="detail-metric-val">${m.num}</dt>
          <dd class="detail-metric-lbl">${m.label}</dd>
        </div>`).join('')}
    </dl>

    <div class="detail-media">${renderDetailMedia(project)}</div>

    <div class="detail-grid">
      <div class="detail-main">
        <section class="detail-section">
          <h3 class="detail-section-title mono">The problem</h3>
          <p>${project.problem}</p>
        </section>
        <section class="detail-section">
          <h3 class="detail-section-title mono">What I built</h3>
          <ul>${project.approach.map(a => `<li>${a}</li>`).join('')}</ul>
        </section>
        <section class="detail-section">
          <h3 class="detail-section-title mono">Results</h3>
          <ul class="is-results">${project.results.map(r => `<li>${r}</li>`).join('')}</ul>
        </section>
      </div>
      <aside class="detail-side">
        <div class="detail-side-block">
          <h3 class="detail-section-title mono">Tech stack</h3>
          <ul class="proj-stack">${project.stack.map(s => `<li>${s}</li>`).join('')}</ul>
        </div>
        <div class="detail-side-block detail-links">
          ${renderProjectLinks(project)}
          ${project.private ? '<p class="detail-private-note">The code is in a private repository, so the clips above show it running instead.</p>' : ''}
        </div>
      </aside>
    </div>

    <nav class="detail-pager" aria-label="More projects">
      <button type="button" class="detail-pager-btn" data-goto="${prev.slug}">
        <span class="mono">← Previous</span><span class="detail-pager-name">${prev.t}</span>
      </button>
      <button type="button" class="detail-pager-btn is-next" data-goto="${next.slug}">
        <span class="mono">Next →</span><span class="detail-pager-name">${next.t}</span>
      </button>
    </nav>
  `;
}

function initProjectModal() {
  const modal = document.getElementById('detail-modal');
  const modalClose = document.getElementById('modal-close-btn');
  const modalBody = document.getElementById('modal-body-content');
  const dialog = modal && modal.querySelector('.modal-content-wrapper');
  if (!modal || !modalClose || !modalBody || !dialog) return;

  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'detail-title');
  modal.setAttribute('aria-hidden', 'true');

  let returnFocusEl = null;
  const order = orderedProjects();

  function stopMedia() {
    const iframe = modalBody.querySelector('iframe');
    if (iframe) iframe.src = 'about:blank';
    modalBody.querySelectorAll('video').forEach(v => {
      v.pause();
      v.removeAttribute('src');
      v.load();
    });
  }

  function show(slug) {
    const idx = order.findIndex(p => p.slug === slug);
    if (idx < 0) return false;
    const project = order[idx];
    const prev = order[(idx - 1 + order.length) % order.length];
    const next = order[(idx + 1) % order.length];

    stopMedia();
    modalBody.innerHTML = renderDetail(project, prev, next);
    dialog.scrollTop = 0;
    modalOpenSlug = slug;

    if (!modal.classList.contains('open')) {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    history.replaceState(null, '', `#projects/${slug}`);
    document.title = `${project.t} · Gautham Ramkumar`;
    return true;
  }

  openProject = (slug, trigger) => {
    returnFocusEl = trigger || document.activeElement;
    if (show(slug)) modalClose.focus();
  };

  function closeModal() {
    if (!modal.classList.contains('open')) return;
    stopMedia();
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    modalOpenSlug = null;
    document.title = defaultTitle;
    history.replaceState(null, '', '#projects');
    if (returnFocusEl && document.contains(returnFocusEl)) returnFocusEl.focus();
  }

  modalBody.addEventListener('click', (e) => {
    const pager = e.target.closest('.detail-pager-btn');
    if (pager) {
      show(pager.dataset.goto);
      modalClose.focus();
      return;
    }
    const zoom = e.target.closest('.zoom-btn');
    if (zoom) openLightbox(zoom.querySelector('img'), zoom);
  });

  modalClose.addEventListener('click', closeModal);
  modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open') || document.querySelector('.lightbox-overlay')) return;
    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === 'Tab') {
      // Keep keyboard focus inside the dialog.
      const focusables = [...dialog.querySelectorAll('button, a[href], video[controls], iframe, [tabindex]:not([tabindex="-1"])')]
        .filter(el => !el.disabled && el.offsetParent !== null);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Deep links: #projects/<slug>
  function syncFromHash() {
    const m = window.location.hash.match(/^#projects\/([\w-]+)$/);
    if (m && projectBySlug[m[1]]) {
      if (modalOpenSlug !== m[1]) openProject(m[1], null);
    } else if (modal.classList.contains('open')) {
      closeModal();
    }
  }
  window.addEventListener('hashchange', syncFromHash);
  syncFromHash();
}

const defaultTitle = typeof document !== 'undefined' ? document.title : '';

function openLightbox(img, trigger) {
  if (!img) return;
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', img.alt);
  overlay.innerHTML = `
    <button type="button" class="lightbox-close" aria-label="Close enlarged image">&times;</button>
    <img class="lightbox-img" src="${img.src}" alt="${escapeAttr(img.alt)}"/>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('active'));
  const closeBtn = overlay.querySelector('.lightbox-close');
  closeBtn.focus();

  const close = () => {
    overlay.classList.remove('active');
    document.removeEventListener('keydown', onKey, true);
    setTimeout(() => overlay.remove(), 250);
    if (trigger) trigger.focus();
  };
  const onKey = (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      close();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      closeBtn.focus();
    }
  };
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', onKey, true);
}

// ============================================================
// 7. MOBILE HAMBURGER MENU CONTROLS
// ============================================================

function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const nav = document.getElementById('header-nav');
  
  if (!menuBtn || !nav) return;
  
  menuBtn.addEventListener('click', () => {
    const isOpen = menuBtn.classList.toggle('active');
    nav.classList.toggle('active', isOpen);
  });
  
  // Close menu on clicking nav link
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      nav.classList.remove('active');
    });
  });
  
  // Close menu on resize to desktop viewports
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      menuBtn.classList.remove('active');
      nav.classList.remove('active');
    }
  });
}

// ============================================================
// 8. CONTACT FORM MAILTO TRANSMISSION
// ============================================================

function initContactForm() {
  const submitBtn = document.getElementById('contact-submit');
  const statusEl = document.getElementById('contact-status');
  
  if (!submitBtn || !statusEl) return;
  
  submitBtn.addEventListener('click', () => {
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();
    
    if (!name || !email || !message) {
      statusEl.textContent = 'TRANSMISSION ERROR: FIELD MISSING.';
      statusEl.className = 'error';
      return;
    }
    
    statusEl.textContent = 'ROUTING DATA TO MAIL CLIENT...';
    statusEl.className = 'success';
    
    const subject = encodeURIComponent(`Contact from portfolio: ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    
    setTimeout(() => {
      window.open(`mailto:ramkumar.g@northeastern.edu?subject=${subject}&body=${body}`);
      statusEl.textContent = 'CLIENT TRIGGERED. TRANSACTION RESOLVED.';
      
      document.getElementById('contact-name').value = '';
      document.getElementById('contact-email').value = '';
      document.getElementById('contact-message').value = '';
    }, 800);
  });
}


// ============================================================
// RESUME PICKER
// resumes.js is generated by resume/build.py from profiles.yaml,
// so this menu always matches the PDFs that actually exist.
// ============================================================

async function initResumeMenu() {
  const wrap = document.getElementById('resume-menu');
  const trigger = document.getElementById('resume-menu-btn');
  if (!wrap || !trigger) return;

  // Imported dynamically on purpose. As a static import, a missing or
  // not-yet-propagated resumes.js aborted the whole main.js module, so the
  // page rendered with no projects, skills, or navigation at all.
  let resumes;
  try {
    ({ resumes } = await import('./resumes.js'));
  } catch (err) {
    return; // header keeps its plain link to the default resume
  }
  if (!Array.isArray(resumes) || resumes.length === 0) return;

  const panel = document.createElement('div');
  panel.className = 'resume-panel';
  panel.id = 'resume-panel';
  panel.setAttribute('role', 'menu');
  panel.hidden = true;
  panel.innerHTML = `
    <p class="resume-panel-label mono">Tailored by focus area</p>
    ${resumes.map(r => `
      <a class="resume-option" role="menuitem" href="${r.file}" target="_blank" rel="noopener noreferrer">
        <span class="resume-option-label">${r.label}</span>
        <span class="resume-option-blurb">${r.blurb}</span>
      </a>
    `).join('')}
  `;
  wrap.appendChild(panel);

  trigger.setAttribute('aria-haspopup', 'true');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', 'resume-panel');

  function setOpen(open) {
    panel.hidden = !open;
    trigger.setAttribute('aria-expanded', String(open));
  }

  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    setOpen(panel.hidden);
  });

  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target)) setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) {
      setOpen(false);
      trigger.focus();
    }
  });
}
