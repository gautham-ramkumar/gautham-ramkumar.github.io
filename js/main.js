import { catData, skillGroups, experience, categoryGroups, featuredProjectIndices } from './data.js';
import { resumes } from './resumes.js';

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
    localStorage.setItem('portfolio-theme', newTheme);
  });
}

// ============================================================
// 3. SPA HASH-ROUTING SYSTEM
// ============================================================

function initHashRouting() {
  const sections = document.querySelectorAll('.page-section');
  const navLinks = document.querySelectorAll('#header-nav .nav-link');
  
  function handleRoute() {
    const rawHash = window.location.hash;
    const hash = rawHash && ['#about', '#projects', '#skills', '#experience', '#contact'].includes(rawHash) 
      ? rawHash 
      : '#about';
    
    // 1. Swap active section
    sections.forEach(section => {
      section.classList.toggle('active', `#${section.getAttribute('id')}` === hash);
    });
    
    // 2. Swap active navbar links
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === hash);
    });
    
    // 3. Scroll to top instantly
    window.scrollTo(0, 0);
    
    // 4. Update window hash if empty/fallback triggered
    if (window.location.hash !== hash) {
      history.replaceState(null, null, hash);
    }
  }
  
  window.addEventListener('hashchange', handleRoute);
  handleRoute(); // Run on initial load
}

// ============================================================
// 4. DATA-DRIVEN DOM GENERATION
// ============================================================

const categorySlugs = {
  'Deep Learning': 'dl',
  '3D Geometry': '3d',
  'State Estimation': 'est',
  'SLAM': 'slam',
  'Control & Manipulation': 'ctrl'
};

function getCategoryGroup(index) {
  return categoryGroups.find(g => g.indices.includes(index));
}

function getCategorySlug(index) {
  const group = getCategoryGroup(index);
  return group ? (categorySlugs[group.title] || 'all') : 'all';
}

function getProjectThumb(proj) {
  if (proj.video) {
    const match = proj.video.match(/embed\/([A-Za-z0-9_-]+)/);
    if (match) {
      return {
        kind: 'video',
        src: `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
      };
    }
  }
  if (proj.images && proj.images.length > 0) {
    return { kind: 'image', src: proj.images[0] };
  }
  return { kind: 'none', src: '' };
}

function renderProjects() {
  const filterBar = document.getElementById('projects-filter-bar');
  const gallery = document.getElementById('projects-categories-container');
  if (!gallery) return;

  const featuredSet = new Set(featuredProjectIndices);
  const ordered = [
    ...featuredProjectIndices.filter(i => catData[i]),
    ...catData.map((_, i) => i).filter(i => !featuredSet.has(i))
  ];

  const filters = [
    { title: 'All', slug: 'all', count: catData.length },
    ...categoryGroups.map(group => ({
      title: group.title,
      slug: categorySlugs[group.title],
      count: group.indices.length
    }))
  ];

  let activeFilter = 'all';

  if (filterBar) {
    filterBar.setAttribute('role', 'tablist');
    filterBar.setAttribute('aria-label', 'Filter projects by domain');
    filterBar.innerHTML = filters.map((filter, i) => `
      <button
        type="button"
        class="proj-filter${filter.slug === activeFilter ? ' active' : ''}"
        data-filter="${filter.slug}"
        role="tab"
        aria-selected="${filter.slug === activeFilter}"
        id="proj-filter-${filter.slug}"
      >
        ${filter.title}
        <span class="proj-filter-count">${filter.count}</span>
      </button>
    `).join('');
  }

  gallery.className = 'projects-gallery';
  gallery.innerHTML = ordered.map((index, displayIdx) => {
    const proj = catData[index][0];
    const group = getCategoryGroup(index);
    const thumb = getProjectThumb(proj);
    const featured = featuredSet.has(index);

    return `
      <article
        class="project-card proj-card${featured ? ' is-featured' : ''}"
        data-category="${getCategorySlug(index)}"
        data-index="${index}"
        tabindex="0"
        role="button"
        aria-label="${proj.t}"
      >
        <div class="proj-card-media${thumb.kind === 'none' ? ' is-fallback' : ''}">
          ${thumb.src
            ? `<img src="${thumb.src}" alt="${proj.t}" loading="lazy">`
            : `<div class="proj-card-fallback"><span>${proj.val}</span></div>`}
          ${thumb.kind === 'video' ? '<span class="proj-card-play" aria-hidden="true">▶</span>' : ''}
          <span class="proj-card-cat">${group ? group.title : ''}</span>
        </div>
        <div class="proj-card-body">
          <div class="proj-card-meta">
            <span class="proj-card-index mono">${String(displayIdx + 1).padStart(2, '0')}</span>
            <span class="proj-card-date">${proj.date || ''}</span>
          </div>
          <h3>${proj.t}</h3>
          <p class="proj-card-summary">${proj.situation}</p>
          <div class="proj-card-footer">
            <div class="proj-card-metric">
              <span class="proj-card-metric-val">${proj.val}</span>
              <span class="proj-card-metric-lbl">${proj.lbl}</span>
            </div>
            <div class="bento-card-tags">
              ${proj.stack.slice(0, 3).map(tag => `<span class="bento-card-tag">${tag}</span>`).join('')}
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');

  function applyFilter() {
    const cards = gallery.querySelectorAll('.project-card');
    let visible = 0;
    cards.forEach(card => {
      const show = activeFilter === 'all' || card.dataset.category === activeFilter;
      card.classList.toggle('is-hidden', !show);
      if (show) visible += 1;
    });
    if (filterBar) {
      filterBar.querySelectorAll('.proj-filter').forEach(btn => {
        const on = btn.dataset.filter === activeFilter;
        btn.classList.toggle('active', on);
        btn.setAttribute('aria-selected', on ? 'true' : 'false');
      });
    }
    const countEl = document.getElementById('projects-visible-count');
    if (countEl) {
      countEl.textContent = activeFilter === 'all'
        ? `${visible} selected projects`
        : `${visible} in ${filters.find(f => f.slug === activeFilter)?.title || ''}`;
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
// 5. FILTERING LOGIC
// ============================================================

// Obsolete tag-filter logic removed. Projects are now grouped inside Category Accordions.

// ============================================================
// 6. DETAILED DRAWER MODAL & LIGHTBOX VIEWER
// ============================================================

function initProjectModal() {
  const modal = document.getElementById('detail-modal');
  const modalClose = document.getElementById('modal-close-btn');
  const modalBody = document.getElementById('modal-body-content');
  
  if (!modal || !modalClose || !modalBody) return;
  
  function openModal(index) {
    const project = catData[index][0];
    
    modalBody.innerHTML = `
      <div class="modal-header-section">
        <span class="mono">// DETAILED_TELEMETRY_ARCHIVE_${index}</span>
        <h2 class="modal-header-title">${project.t}</h2>
        <div class="modal-header-tags">
          ${project.stack.map(tag => `<span class="modal-header-tag">${tag}</span>`).join('')}
        </div>
      </div>
      
      <div class="modal-detail-grid">
        <!-- SAR description panel -->
        <div class="modal-text-col">
          <div class="sar-container">
            <h4>[ SITUATION ]</h4>
            <p>${project.situation}</p>
          </div>
          <div class="sar-container">
            <h4>[ ACTION ]</h4>
            <p>${project.action}</p>
          </div>
          <div class="sar-container">
            <h4>[ RESULT ]</h4>
            <p>${project.result}</p>
          </div>
        </div>
        
        <!-- Media, metrics, links column -->
        <div class="modal-media-col">
          <!-- Video Frame embed -->
          ${project.video ? `
            <div class="video-wrapper">
              <iframe src="${project.video}" allow="autoplay; encrypted-media" allowfullscreen></iframe>
            </div>
          ` : ''}
          
          <!-- Image grid -->
          ${project.images && project.images.length > 0 ? `
            <div class="detail-img-grid ${project.images.length > 1 ? 'two-cols' : ''}">
              ${project.images.map(img => `<img src="${img}" alt="Project details diagram" class="zoom-img"/>`).join('')}
            </div>
          ` : ''}
          
          <!-- Benchmarks Box -->
          <div class="modal-benchmarks-box">
            <h4 class="mono">[ BENCHMARK_METRICS ]</h4>
            <div class="modal-benchmarks-list">
              ${project.metrics ? project.metrics.map(m => `
                <div class="modal-benchmark-item">
                  <span class="modal-benchmark-val">${m.num}</span>
                  <span class="modal-benchmark-lbl">${m.label}</span>
                </div>
              `).join('') : `
                <div class="modal-benchmark-item">
                  <span class="modal-benchmark-val">${project.val}</span>
                  <span class="modal-benchmark-lbl">${project.lbl}</span>
                </div>
              `}
            </div>
          </div>
          
          <!-- Action Links -->
          <div style="margin-top: 10px; display: flex; flex-direction: column; gap: 8px;">
            ${project.github ? `
              <a href="${project.github}" class="btn btn-primary" style="width: 100%;" target="_blank" rel="noopener noreferrer">
                View on GitHub ↗
              </a>
            ` : ''}
            ${project.demo ? `
              <a href="${project.demo}" class="btn btn-secondary" style="width: 100%;" target="_blank" rel="noopener noreferrer">
                Watch Demo ↗
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    `;
    
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    // Lightbox image viewer configuration
    const images = modalBody.querySelectorAll('.zoom-img');
    images.forEach(img => {
      img.addEventListener('click', () => {
        const overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        overlay.innerHTML = `
          <button class="lightbox-close">&times;</button>
          <img class="lightbox-img" src="${img.src}" alt="${img.alt}"/>
        `;
        document.body.appendChild(overlay);
        
        requestAnimationFrame(() => overlay.classList.add('active'));
        
        const closeLightbox = () => {
          overlay.classList.remove('active');
          setTimeout(() => overlay.remove(), 250);
        };
        
        overlay.addEventListener('click', closeLightbox);
        overlay.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
      });
    });
  }
  
  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    
    // Stop playing video on close
    const iframe = modalBody.querySelector('iframe');
    if (iframe) iframe.src = '';
  }
  
  function tryOpenCard(target) {
    const card = target.closest('.project-card');
    if (!card || card.classList.contains('is-hidden')) return;
    const index = parseInt(card.dataset.index, 10);
    if (!Number.isNaN(index)) openModal(index);
  }

  document.addEventListener('click', (e) => tryOpenCard(e.target));
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    if (!e.target.classList.contains('project-card')) return;
    e.preventDefault();
    tryOpenCard(e.target);
  });
  
  modalClose.addEventListener('click', closeModal);
  modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
  
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
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

function initResumeMenu() {
  const wrap = document.getElementById('resume-menu');
  const trigger = document.getElementById('resume-menu-btn');
  if (!wrap || !trigger || !Array.isArray(resumes) || resumes.length === 0) return;

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
