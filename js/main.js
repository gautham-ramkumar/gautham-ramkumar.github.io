import { catData, skillGroups, experience, categoryGroups } from './data.js';

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

// Helper to determine category slugs
function getCategorySlug(index) {
  if ([0, 7, 8, 9].includes(index)) return 'dl';
  if ([1, 4, 5].includes(index)) return '3d';
  if ([2].includes(index)) return 'est';
  if ([3, 6].includes(index)) return 'slam';
  return 'all';
}

// Render Category Accordion Boxes & Projects Grid
function renderProjects() {
  const container = document.getElementById('projects-categories-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  categoryGroups.forEach((group, groupIdx) => {
    const box = document.createElement('div');
    box.className = 'project-category-box';
    // Expand the first category (Deep Learning) by default
    if (groupIdx === 0) box.classList.add('expanded');
    
    const count = group.indices.length;
    
    const header = document.createElement('button');
    header.className = 'category-header';
    header.setAttribute('aria-expanded', groupIdx === 0 ? 'true' : 'false');
    header.innerHTML = `
      <h3>
        <span>${group.title}</span>
        <span class="category-count">${count} Node${count > 1 ? 's' : ''}</span>
      </h3>
      <span class="category-chevron">▼</span>
    `;
    
    const content = document.createElement('div');
    content.className = 'category-content';
    
    const grid = document.createElement('div');
    grid.className = 'projects-bento-grid';
    
    group.indices.forEach((index) => {
      const projectArray = catData[index];
      const proj = projectArray[0];
      const catSlug = getCategorySlug(index);
      
      // Assign specific column spans to create an organic Bento grid layout
      let spanClass = 'span-4';
      if (index === 0 || index === 5) {
        spanClass = 'span-8'; // Feature DarkSight & 3DGS
      } else if (index === 2 || index === 3) {
        spanClass = 'span-6'; // Mid-sized layout spacing
      }
      
      const card = document.createElement('div');
      card.className = `bento-card ${spanClass} project-card`;
      card.dataset.category = catSlug;
      card.dataset.index = index;
      
      card.innerHTML = `
        <div class="bento-card-top">
          <div class="bento-card-meta">
            <span class="bento-card-date mono">${proj.date || ''}</span>
            <span class="bento-card-arrow">→</span>
          </div>
          <h3>${proj.t}</h3>
          <p class="bento-card-summary">${proj.situation}</p>
        </div>
        <div class="bento-card-bottom">
          <div class="bento-card-metric">
            <span class="bento-card-metric-val">${proj.val}</span>
            <span class="bento-card-metric-lbl">${proj.lbl}</span>
          </div>
          <div class="bento-card-tags">
            ${proj.stack.slice(0, 3).map(tag => `<span class="bento-card-tag">${tag}</span>`).join('')}
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
    
    content.appendChild(grid);
    box.appendChild(header);
    box.appendChild(content);
    container.appendChild(box);
    
    // Attach click handler to toggle accordion
    header.addEventListener('click', () => {
      const isExpanded = box.classList.toggle('expanded');
      header.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    });
  });
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
          
          <!-- Action Link -->
          <div style="margin-top: 10px;">
            <a href="${project.github}" class="btn btn-primary" style="width: 100%;" target="_blank">
              View on GitHub ↗
            </a>
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
  
  // Attach card click handlers on document event delegation
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.project-card');
    if (card) {
      const index = parseInt(card.dataset.index);
      openModal(index);
    }
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
