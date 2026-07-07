// ============================================================
// ui.js — all DOM logic: main menu, keyboard navigation,
// section panel transitions, 2D controller SVG hooks,
// dynamic project detail renderer, and AI dialogue reaction system.
// ============================================================
import { createScene } from './scene.js';
import { catData, sectionMsgs, experience, skillGroups, menuItems, controllerMap, featuredProjectIndices, categoryGroups } from './data.js';

export function initApp() {
  const canvas = document.getElementById('three-canvas');
  const scene = createScene(canvas);

  // ---------------- Boot Splash Sequence ----------------
  const bootEl = document.getElementById('boot');
  const bootFill = document.getElementById('boot-bar-fill');
  
  const bootLines = [
    { id: 'boot-line-1', text: '[gautham@perception_unit]:~$ initialize_perception_system' },
    { id: 'boot-line-2', text: '> Initializing temporal calibration loops... <span>OK</span>' },
    { id: 'boot-line-3', text: '> Establishing GTSAM factor graph optimizer... <span>OK</span>' },
    { id: 'boot-line-4', text: '> Loading 3D Gaussian Splatting scene data... <span>OK</span>' },
    { id: 'boot-line-5', text: '> System online. Loading telemetry dashboard...', class: 'success' }
  ];
  
  let lineIdx = 0;
  function printBootLine() {
    if (lineIdx < bootLines.length) {
      const data = bootLines[lineIdx];
      const el = document.getElementById(data.id);
      if (el) {
        el.innerHTML = data.text;
        el.classList.add('active');
        if (data.class) el.classList.add(data.class);
      }
      lineIdx++;
      setTimeout(printBootLine, 280);
    }
  }
  setTimeout(printBootLine, 100);

  let bootProgress = 0;
  const bootTimer = setInterval(() => {
    bootProgress += 5;
    bootFill.style.width = Math.min(bootProgress, 100) + '%';
    if (bootProgress >= 100) {
      clearInterval(bootTimer);
      setTimeout(() => {
        bootEl.classList.add('hide');
        setTimeout(() => say('MAIN MENU. Use ↑↓ + Enter, or click a slot.', 4200), 500);
      }, 500);
    }
  }, 85);

  // ---------------- AI Companion Dialogue / Status Console ----------------
  const speech = document.getElementById('speech');
  let speechTimer;
  function say(text, holdMs) {
    clearTimeout(speechTimer);
    speech.classList.remove('show');
    setTimeout(() => {
      speech.innerHTML = text + '<span class="cursor"></span>';
      speech.classList.add('show');
      if (holdMs) {
        speechTimer = setTimeout(() => speech.classList.remove('show'), holdMs);
      }
    }, 150);
  }

  const readout = document.getElementById('hud-readout');

  // ---------------- Build Main Menu List ----------------
  const menuListEl = document.getElementById('menu-list');
  menuItems.forEach((item, i) => {
    const btn = document.createElement('button');
    btn.className = 'menu-item';
    btn.innerHTML = `<span class="m-index">0${i + 1}</span><span class="m-text"><span class="m-label">${item.label}</span><span class="m-sub">${item.subtitle}</span></span>`;
    btn.addEventListener('click', () => enterMode(item.id));
    btn.addEventListener('mouseenter', () => focusIndex(i));
    menuListEl.appendChild(btn);
  });

  const menuButtons = Array.from(menuListEl.children);

  let focused = 0;
  let mode = 'menu';

  function focusIndex(i) {
    focused = i;
    menuButtons.forEach((el, idx) => el.classList.toggle('focused', idx === i));
    if (i === 0) scene.hoverMenuItem(0);       // EXPERIENCE
    else if (i === 1) scene.hoverMenuItem(1);  // PROJECTS
    else if (i === 2) scene.hoverMenuItem(2);  // TECHNICAL SKILLS
    else if (i === 3) scene.hoverMenuItem(3);  // CONTACT
  }
  focusIndex(0);

  // ---------------- Build Project Showcase Cards ----------------
  const showcaseCardsEl = document.getElementById('showcase-cards');

  featuredProjectIndices.forEach((i, displayIdx) => {
    const cat = catData[i];
    const proj = cat[0];
    // Extract YouTube video ID to build thumbnail URL
    const ytMatch = proj.video ? proj.video.match(/embed\/([A-Za-z0-9_-]+)/) : null;
    const ytId = ytMatch ? ytMatch[1] : null;
    const thumbUrl = ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : '';

    const card = document.createElement('div');
    card.className = 'showcase-card';
    card.dataset.index = i;

    card.innerHTML = `
      <div class="sc-thumb-wrap">
        ${ thumbUrl ? `<img class="sc-thumb" src="${thumbUrl}" alt="${proj.t}">` : '<div class="sc-thumb-placeholder"></div>' }
        <div class="sc-play-overlay">
          <span class="sc-play-icon">▶</span>
        </div>
        <div class="sc-thumb-gradient"></div>
      </div>
      <div class="sc-info">
        <div class="sc-num mono">PROJECT 0${displayIdx + 1}</div>
        <div class="sc-title">${proj.t}</div>
        <div class="sc-metric"><span class="sc-val">${proj.val}</span><span class="sc-lbl">${proj.lbl}</span></div>
        <div class="sc-tags">${proj.stack.slice(0, 4).map(t => `<span>${t}</span>`).join('')}</div>
      </div>
      <div class="sc-detail-overlay">
        <div class="sc-detail-inner">
          <div class="sc-sar">
            <div class="sc-sar-label mono">SITUATION</div>
            <p>${proj.situation}</p>
          </div>
          <div class="sc-sar">
            <div class="sc-sar-label mono">ACTION</div>
            <p>${proj.action.substring(0, 200)}${proj.action.length > 200 ? '…' : ''}</p>
          </div>
          <div class="sc-sar">
            <div class="sc-sar-label mono">RESULT</div>
            <p>${proj.result.substring(0, 160)}${proj.result.length > 160 ? '…' : ''}</p>
          </div>
          <div class="sc-metrics-row">
            ${proj.metrics.map(m => `<div class="sc-metric-box"><div class="sc-m-num">${m.num}</div><div class="sc-m-lbl">${m.label}</div></div>`).join('')}
          </div>
          <div class="sc-actions">
            <button class="sc-play-btn">▶ PLAY VIDEO</button>
            <a class="sc-gh-btn" href="${proj.github}" target="_blank">GitHub ↗</a>
          </div>
        </div>
      </div>
      <div class="sc-video-wrap" style="display:none;">
        <button class="sc-video-close mono">✕ CLOSE</button>
        <iframe src="" allow="autoplay; encrypted-media" allowfullscreen></iframe>
      </div>
    `;

    // Hover no longer triggers a preview pop-up — the card's compact
    // info stays visible at all times, and clicking plays the video.
    // Click play button or card — open inline video
    const playBtn = card.querySelector('.sc-play-btn');
    const playOverlay = card.querySelector('.sc-play-overlay');
    const videoWrap = card.querySelector('.sc-video-wrap');
    const iframe = card.querySelector('iframe');
    const closeBtn = card.querySelector('.sc-video-close');

    function openVideo() {
      iframe.src = proj.video + '?autoplay=1';
      videoWrap.style.display = 'flex';
      card.classList.add('playing');
      scene.setParticleOpacity(0.1);
    }
    function closeVideo() {
      iframe.src = '';
      videoWrap.style.display = 'none';
      card.classList.remove('playing');
      scene.setParticleOpacity(0.75);
      scene.deselectCategory();
    }

    playBtn.addEventListener('click', openVideo);
    playOverlay.addEventListener('click', openVideo);
    closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closeVideo(); });

    showcaseCardsEl.appendChild(card);
  });

  // ---------------- Panel Management ----------------
  const panels = {
    newgame: document.getElementById('panel-newgame'),
    resume: document.getElementById('panel-resume'),
    options: document.getElementById('panel-options'),
    exit: document.getElementById('panel-exit')
  };
  const nodeLabelsWrap = document.getElementById('node-labels');
  const backBtn = document.getElementById('back-btn');

  function enterMode(id) {
    if (id === 'exit') {
      mode = 'exit';
      document.body.classList.add('in-section');
      Object.keys(panels).forEach((k) => panels[k].classList.toggle('active', k === 'exit'));
      nodeLabelsWrap.style.display = 'none';
      backBtn.classList.add('show');
      readout.textContent = '[ CONTACT ME ]';
      scene.setMode('exit');
      scene.setParticleOpacity(0.15);
      say(sectionMsgs.exit, 3000);
      return;
    }
    mode = id;
    document.body.classList.add('in-section');
    Object.keys(panels).forEach((k) => panels[k].classList.toggle('active', k === id));
    nodeLabelsWrap.style.display = id === 'resume' ? 'block' : 'none';
    backBtn.classList.add('show');
    readout.textContent = id === 'newgame' ? '[ EXPERIENCE ]' : `[ ${id.toUpperCase()} ]`;
    scene.setMode(id);
    if (id === 'resume' || id === 'menu') {
      scene.setParticleOpacity(0.75);
    } else {
      scene.setParticleOpacity(0.15);
    }
    say(sectionMsgs[id], 3000);
  }

  function backToMenu() {
    activeCategory = null;
    mode = 'menu';
    document.body.classList.remove('in-section');
    Object.keys(panels).forEach((k) => panels[k].classList.remove('active'));
    nodeLabelsWrap.style.display = 'none';
    backBtn.classList.remove('show');
    closeDetail();
    scene.setMode('menu');
    scene.hoverMenuItem(focused);
    scene.setParticleOpacity(0.75);
    readout.textContent = '[ MAIN MENU ]';
    say(sectionMsgs.menu, 2600);
  }
  backBtn.addEventListener('click', backToMenu);

  window.addEventListener('keydown', (e) => {
    if (mode === 'menu') {
      if (e.key === 'ArrowDown') { focusIndex((focused + 1) % menuItems.length); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { focusIndex((focused - 1 + menuItems.length) % menuItems.length); e.preventDefault(); }
      else if (e.key === 'Enter') { enterMode(menuItems[focused].id); }
    } else if (e.key === 'Escape') {
      backToMenu();
    }
  });

  // ---------------- Dynamic Detail Panel Drawer ----------------
  // Flow: click a category node -> project list (title + tags + hook stat)
  //       -> click a project -> full SAR/metrics/video detail view
  const detailPanel = document.getElementById('detail-panel');
  let activeCategory = null;

  function closeDetail() {
    detailPanel.classList.remove('open');
    if (mode === 'resume' || mode === 'menu') {
      scene.setParticleOpacity(0.75);
    }
  }

  function closeAll() {
    activeCategory = null;
    closeDetail();
    scene.deselectCategory();
  }

  // Level 2: the project list for one category (compact cards — title,
  // keywords, and a catchy hook stat like "21 FPS / Real-time").
  function renderCategoryList(i) {
    const group = categoryGroups[i];
    detailPanel.innerHTML = `
      <button class="close-btn" id="detail-close">✕</button>
      <div class="detail-header-wrap">
        <div class="eyebrow">CATEGORY // ${group.title.toUpperCase()}</div>
        <h2 id="detail-title">${group.title}</h2>
        <div class="tag-row"><span>${group.indices.length} PROJECTS</span></div>
      </div>
      <div id="category-project-list" style="margin-top: 22px;"></div>
    `;

    const listEl = detailPanel.querySelector('#category-project-list');
    group.indices.forEach((idx) => {
      const proj = catData[idx][0];
      const card = document.createElement('div');
      card.className = 'proj-card';
      card.innerHTML = `
        <h4>${proj.t}</h4>
        <div class="result-lbl">${proj.lbl}</div>
        <div class="result">${proj.val}</div>
        <div class="proj-card-row">
          <span class="row-label mono">KEYWORDS</span>
          <div class="tags">${proj.tags.map((t) => `<span>${t}</span>`).join('')}</div>
        </div>
        <div class="proj-card-row">
          <span class="row-label mono">TOOLS</span>
          <div class="tags tools">${proj.stack.map((t) => `<span>${t}</span>`).join('')}</div>
        </div>
      `;
      card.addEventListener('click', () => renderProjectView(proj, idx, i));
      listEl.appendChild(card);
    });
    requestAnimationFrame(() => {
      listEl.querySelectorAll('.proj-card').forEach((c, idx2) => setTimeout(() => c.classList.add('show'), 100 + idx2 * 100));
    });

    document.getElementById('detail-close').addEventListener('click', () => {
      closeAll();
      say('CLUSTER FOCUS RELEASED.', 2000);
    });

    detailPanel.classList.add('open');
    scene.setParticleOpacity(0.2);
  }

  // Level 3: full detail view for a single project — same information
  // depth as the menu showcase cards (SAR write-up, metrics, video/images,
  // GitHub link) — plus a back link to return to the category's list.
  function renderProjectView(project, projIndex, groupIndex) {
    const group = groupIndex !== undefined ? categoryGroups[groupIndex] : null;
    detailPanel.innerHTML = `
      <button class="close-btn" id="detail-close">✕</button>
      <div class="detail-header-wrap">
        ${group ? `<button class="back-link mono" id="detail-back">← ${group.title}</button>` : ''}
        <div class="eyebrow">PROJECT FILE${group ? ' // ' + group.title.toUpperCase() : ''}</div>
        <h2 id="detail-title">${project.t}</h2>
        <div class="tag-row">${project.stack.map(tag => `<span>${tag}</span>`).join('')}</div>
      </div>
      
      <div class="detail-body-grid">
        <div class="detail-text-col">
          <div class="sar-section">
            <h4 class="mono">[ SITUATION ]</h4>
            <p>${project.situation}</p>
          </div>
          <div class="sar-section">
            <h4 class="mono">[ ACTION ]</h4>
            <p>${project.action}</p>
          </div>
          <div class="sar-section">
            <h4 class="mono">[ RESULT ]</h4>
            <p>${project.result}</p>
          </div>
        </div>
        
        <div class="detail-media-col">
          <div id="detail-media-container">
            ${project.video ? `
              <div class="video-wrapper">
                <iframe src="${project.video}" allowfullscreen></iframe>
              </div>
            ` : ''}
            ${project.images ? `
              <div class="detail-img-grid ${project.images.length > 1 ? 'two-cols' : ''}">
                ${project.images.map(img => `
                  <img src="${img}" alt="${project.t} diagram" class="zoomable-img"/>
                `).join('')}
              </div>
            ` : ''}
          </div>
          
          <div class="metrics-block">
            <h4 class="mono">[ KEY BENCHMARKS ]</h4>
            <div class="metrics-grid">
              ${project.metrics.map(m => `
                <div class="metric-box">
                  <div class="metric-num">${m.num}</div>
                  <div class="metric-label">${m.label}</div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="action-footer">
            <a class="btn primary" href="${project.github}" target="_blank">View on GitHub ↗</a>
          </div>
        </div>
      </div>
    `;

    document.getElementById('detail-close').addEventListener('click', () => {
      closeAll();
      say('PROJECT DETAIL SLATE DE-ACTIVATED.', 2000);
    });
    const backLink = document.getElementById('detail-back');
    if (backLink) {
      backLink.addEventListener('click', () => renderCategoryList(groupIndex));
    }

    // Attach Lightbox Zoom listeners to zoomable images
    const zoomableImages = detailPanel.querySelectorAll('.zoomable-img');
    zoomableImages.forEach((img) => {
      img.addEventListener('click', () => {
        const overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        overlay.innerHTML = `
          <button class="lightbox-close">✕</button>
          <img class="lightbox-img" src="${img.src}" alt="${img.alt}"/>
        `;
        document.body.appendChild(overlay);

        // Force reflow and transition in
        requestAnimationFrame(() => {
          overlay.classList.add('active');
        });

        const closeLightbox = (e) => {
          e.stopPropagation();
          overlay.classList.remove('active');
          setTimeout(() => overlay.remove(), 300);
        };

        overlay.addEventListener('click', closeLightbox);
        overlay.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
      });
    });

    detailPanel.classList.add('open');
    scene.setParticleOpacity(0.2); // Dim background particles when project text is visible
  }

  scene.onOrbHover((i) => {
    if (i !== null) {
      const group = categoryGroups[i];
      say(`TARGET: ${group.title.toUpperCase()} — ${group.indices.length} PROJECTS`, 1800);
    }
  });

  scene.onOrbClick((i) => {
    if (activeCategory === i) {
      closeAll();
      say('CLUSTER FOCUS RELEASED.', 2000);
      return;
    }
    activeCategory = i;
    scene.selectCategory(i);
    renderCategoryList(i);
    say(`LOCKING FOCUS: [${categoryGroups[i].title.toUpperCase()}]`, 3000);
  });

  // ---------------- 2D Gamepad Interactivity ----------------
  const optionsHint = document.getElementById('options-hint');

  // Populate all options skill cards dynamically
  controllerMap.forEach((map) => {
    const group = skillGroups[map.groupIndex];
    const card = document.querySelector(`.skill-card-group[data-group="${map.part}"]`);
    if (card) {
      const grid = card.querySelector('.skills-list-grid');
      if (grid) {
        grid.innerHTML = group.items.map(item => `<span class="skill-tag-item">${item}</span>`).join('');
      }
    }
  });

  const allCardGroups = document.querySelectorAll('.skill-card-group');
  const allConnLines = document.querySelectorAll('.conn-line');
  const allConnDots = document.querySelectorAll('.conn-dot');
  const allParts = document.querySelectorAll('.controller-part');

  function highlightPart(partName) {
    allCardGroups.forEach(el => el.classList.toggle('active', el.getAttribute('data-group') === partName));
    allConnLines.forEach(el => el.classList.toggle('active', el.getAttribute('data-part') === partName));
    allConnDots.forEach(el => el.classList.toggle('active', el.getAttribute('data-part') === partName));
    allParts.forEach(el => el.classList.toggle('active', el.getAttribute('data-part') === partName));
  }

  allCardGroups.forEach((card) => {
    const partName = card.getAttribute('data-group');
    card.addEventListener('mouseenter', () => {
      highlightPart(partName);
      const map = controllerMap.find(m => m.part === partName);
      if (map) {
        say(`INSPECTING VECTOR: [${map.label}] -> mapping nodes...`, 2000);
        optionsHint.textContent = `Active map: ${map.label}. Custom vectors initialized.`;
      }
    });
    card.addEventListener('mouseleave', () => {
      highlightPart('');
      optionsHint.textContent = `Hover over sections or buttons to highlight mapping...`;
    });
  });

  allParts.forEach((partEl) => {
    const partName = partEl.getAttribute('data-part');
    partEl.addEventListener('mouseenter', () => {
      highlightPart(partName);
      const map = controllerMap.find(m => m.part === partName);
      if (map) {
        say(`INSPECTING VECTOR: [${map.label}] -> mapping nodes...`, 2000);
        optionsHint.textContent = `Active map: ${map.label}. Custom vectors initialized.`;
      }
    });
    partEl.addEventListener('mouseleave', () => {
      highlightPart('');
      optionsHint.textContent = `Hover over sections or buttons to highlight mapping...`;
    });
  });

  // ---------------- 3D -> 2D Node Labels Tracker ----------------
  // Floating headers for the 3 category nodes (3D Perception, Deep
  // Learning, SLAM) — these ARE the graph nodes now, so this is the
  // only label layer needed (no more one-per-project labels).
  const groupLabelEls = categoryGroups.map((g) => {
    const el = document.createElement('div');
    el.className = 'group-label';
    el.style.setProperty('--group-color', g.color);
    el.innerHTML = `<span>${g.title}</span>`;
    nodeLabelsWrap.appendChild(el);
    return el;
  });

  (function trackLabels() {
    requestAnimationFrame(trackLabels);
    if (mode !== 'resume') return;
    scene.getCategoryScreenPositions().forEach((p, i) => {
      groupLabelEls[i].style.left = p.x + 'px';
      groupLabelEls[i].style.top = p.y + 'px';
      groupLabelEls[i].style.opacity = (p.x < -60 || p.x > window.innerWidth + 60) ? '0' : '1';
    });
  })();

  // ---------------- Populate Educational Timeline ----------------
  document.getElementById('timeline-list').innerHTML = experience.map((e) => `
    <div class="tl-item">
      <div class="period">${e.period}</div>
      <h4>${e.role}</h4>
      <div class="org">${e.org}</div>
      <p>${e.desc}</p>
    </div>`).join('');

  // ---------------- Wire up Contact Form ----------------
  const contactName = document.getElementById('contact-name');
  const contactEmail = document.getElementById('contact-email');
  const contactMsg = document.getElementById('contact-message');
  const contactSubmit = document.getElementById('contact-submit');

  if (contactSubmit) {
    contactSubmit.addEventListener('click', () => {
      const name = contactName.value.trim();
      const email = contactEmail.value.trim();
      const msg = contactMsg.value.trim();
      
      if (!name || !email || !msg) {
        say("TRANSMISSION ERROR: ALL ENVELOPE PARAMETERS MUST BE PRESENT.", 3000);
        return;
      }
      
      const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
      const body = encodeURIComponent(`From: ${name}\nEmail: ${email}\n\n${msg}`);
      window.open(`mailto:ramkumar.g@northeastern.edu?subject=${subject}&body=${body}`);
      
      say("TRANSMISSION INITIATED. EXTERNAL MAIL GATEWAY DEPLOYED.", 4000);
      contactName.value = '';
      contactEmail.value = '';
      contactMsg.value = '';
    });
    
    // Micro dialogue reactions for inputs
    [contactName, contactEmail, contactMsg].forEach(input => {
      input.addEventListener('focus', () => {
        const placeholder = input.getAttribute('placeholder') || 'input field';
        say(`TELEMETRY INPUT ACTIVE. BUFFERING DATA FOR [${placeholder.toUpperCase()}]...`);
      });
    });
  }

  // ---------------- Micro Dialogue Hover Reactions ----------------
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      say(`READY TO DEPLOY SIGNAL LINK ROUTE...`, 1500);
    });
  });

  // Exit confirmation modal removed. Direct contact routing active.

  // ---------------- Tab Unload Guard ----------------
  window.addEventListener('beforeunload', (e) => {
    e.preventDefault();
    e.returnValue = ''; // Triggers standard browser prompt
    return '';          // Legacy and Chrome/Firefox fallback
  });

  // ---------------- Initialize Scene Mode ----------------
  scene.setMode('menu');
  readout.textContent = '[ MAIN MENU ]';
}
