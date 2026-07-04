// ============================================================
// scene.js — owns everything Three.js. High-fidelity WebGL
// rendering featuring:
//   - A morphing particle core (5,000+ points)
//   - A 3D SLAM Factor Graph network with coordinate frame axes
//   - Raycasting with hover scale + emissive highlights
//   - Cinematic camera stations with lerp dampening
// ============================================================
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';
import { catPositions } from './data.js';

export function createScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x060a12);
  scene.fog = new THREE.FogExp2(0x060a12, 0.035);

  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 4, 18);
  scene.add(camera);

  // ---------------- Lighting ----------------
  scene.add(new THREE.AmbientLight(0x1a2b4c, 0.8));
  
  const keyLight = new THREE.DirectionalLight(0x5eead4, 1.5);
  keyLight.position.set(5, 12, 8);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xc9a227, 0.8);
  rimLight.position.set(-6, 3, -6);
  scene.add(rimLight);

  const camLight = new THREE.PointLight(0xffffff, 0.6, 30);
  camera.add(camLight);

  // ---------------- Grid ----------------
  const grid = new THREE.GridHelper(50, 50, 0x1f2e4d, 0x111b2b);
  grid.position.y = -2;
  scene.add(grid);

  // ---------------- programmatic point texture ----------------
  function createPointTexture() {
    const c = document.createElement('canvas');
    c.width = 16; c.height = 16;
    const ctx = c.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);
    return new THREE.CanvasTexture(c);
  }
  const pointTex = createPointTexture();

  // ---------------- Morphing Particle System ----------------
  const PARTICLE_COUNT = 5000;
  const pGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);

  // Initialize targets
  const targets = {
    menu: new Float32Array(PARTICLE_COUNT * 3),      // Shape 0: Torus Wave
    newgame: new Float32Array(PARTICLE_COUNT * 3),   // Shape 1: Double Helix
    resume: new Float32Array(PARTICLE_COUNT * 3),    // Shape 2: Distributed Spheres (around categories)
    options: new Float32Array(PARTICLE_COUNT * 3),   // Shape 3: Torus Knot
    exit: new Float32Array(PARTICLE_COUNT * 3)       // Shape 4: Concentric Rings
  };

  const tealC = new THREE.Color(0x5eead4);
  const goldC = new THREE.Color(0xc9a227);
  const purpleC = new THREE.Color(0x9b8ce0);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const u = i / PARTICLE_COUNT;
    const theta = u * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    // Color mixing
    let c = tealC;
    if (i % 3 === 0) c = goldC;
    else if (i % 3 === 1) c = purpleC;
    colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;

    // 0. Menu Torus Wave
    const r0 = 4.5 + Math.sin(theta * 6) * 0.6;
    targets.menu[i * 3] = r0 * Math.cos(theta);
    targets.menu[i * 3 + 1] = r0 * Math.sin(theta) * 0.8 + 1.0;
    targets.menu[i * 3 + 2] = Math.sin(r0 * 2) * 1.2;

    // 1. New Game Double Helix
    const tHelix = u * Math.PI * 12;
    const helixOffset = (i % 2 === 0 ? 0 : Math.PI);
    targets.newgame[i * 3] = Math.cos(tHelix + helixOffset) * 2.2;
    targets.newgame[i * 3 + 1] = (u - 0.5) * 8 + 1.5;
    targets.newgame[i * 3 + 2] = Math.sin(tHelix + helixOffset) * 2.2;

    // 2. Resume Category Clusters (4 distributed spheres matching catPositions)
    const clusterIdx = i % 4;
    const cPos = catPositions[clusterIdx];
    const cu = Math.random() * Math.PI * 2;
    const cv = Math.acos(Math.random() * 2 - 1);
    const cr = 0.15 + Math.random() * 0.6;
    targets.resume[i * 3] = cPos[0] + cr * Math.sin(cv) * Math.cos(cu);
    targets.resume[i * 3 + 1] = cPos[1] + cr * Math.sin(cv) * Math.sin(cu);
    targets.resume[i * 3 + 2] = cPos[2] + cr * Math.cos(cv);

    // 3. Options Torus Knot
    const R_torus = 4.0;
    const r_torus = 1.3;
    const t_t = u * Math.PI * 2;
    const p_t = (i % 60) / 60 * Math.PI * 2;
    targets.options[i * 3] = (R_torus + r_torus * Math.cos(p_t)) * Math.cos(t_t);
    targets.options[i * 3 + 1] = (R_torus + r_torus * Math.cos(p_t)) * Math.sin(t_t) * 0.8 + 1.2;
    targets.options[i * 3 + 2] = r_torus * Math.sin(p_t);

    // 4. Exit Concentric Rings
    const ringIdx = i % 4;
    const ringRadius = (ringIdx + 1) * 1.5;
    const rTheta = Math.random() * Math.PI * 2;
    targets.exit[i * 3] = ringRadius * Math.cos(rTheta);
    targets.exit[i * 3 + 1] = ringRadius * Math.sin(rTheta) * 0.7 + 1.5;
    targets.exit[i * 3 + 2] = Math.sin(ringRadius * 2.5 + rTheta) * 0.6;
  }

  // Populate initial position array with menu shape
  for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
    positions[i] = targets.menu[i];
  }

  pGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const pMaterial = new THREE.PointsMaterial({
    size: 0.16,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    map: pointTex,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const morphParticles = new THREE.Points(pGeometry, pMaterial);
  scene.add(morphParticles);

  let targetParticleOpacity = 0.75;
  let currentTargetArray = targets.menu;

  // ---------------- 3D SLAM Factor Graph ----------------
  const orbs = [];
  const orbLines = [];
  const orbColors = [0x5eead4, 0xc9a227, 0x9b8ce0, 0xe8846f];
  const catNamesList = ['3D Geometry', 'Deep Learning', 'SLAM', 'State Estimation'];

  // Central hub (anchor) representing the map origin
  const resumeRoot = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.7, 1),
    new THREE.MeshStandardMaterial({
      color: 0xc9a227,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0xc9a227,
      emissiveIntensity: 0.3,
      wireframe: true
    })
  );
  resumeRoot.position.set(0, 1.2, -7);
  scene.add(resumeRoot);
  resumeRoot.visible = false;

  // Local Coordinate axes helper at the root
  const rootAxes = new THREE.AxesHelper(1.2);
  resumeRoot.add(rootAxes);

  catPositions.forEach((pos, i) => {
    // Holographic Sphere
    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(0.7, 16, 16),
      new THREE.MeshStandardMaterial({
        color: orbColors[i],
        transparent: true,
        opacity: 0.25,
        wireframe: true,
        emissive: orbColors[i],
        emissiveIntensity: 0.2
      })
    );
    orb.position.set(pos[0], pos[1], pos[2]);
    orb.userData = { type: 'orb', index: i, scaleTarget: 1.0, baseOpacity: 0.25 };
    scene.add(orb);
    orbs.push(orb);
    orb.visible = false;

    // Local coordinate axes representing camera poses
    const axes = new THREE.AxesHelper(0.7);
    orb.add(axes);

    // Inter-node connection factors (glowing lines)
    const curve = new THREE.QuadraticBezierCurve3(
      resumeRoot.position,
      new THREE.Vector3(pos[0] * 0.5, 3.0, pos[2] * 0.8),
      orb.position
    );
    const lineGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(30));
    const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({
      color: orbColors[i],
      transparent: true,
      opacity: 0.2
    }));
    line.userData = { targetOpacity: 0.2 };
    scene.add(line);
    orbLines.push(line);
    line.visible = false;
  });

  // ---------------- Camera Stations ----------------
  const STAGE = new THREE.Vector3(0, 1.4, 0);

  const stations = {
    menu:    { pos: [0, 3.2, 6.0],   look: [0, 1.6, -9] },
    newgame: { pos: [0, 2.0, 7.5],  look: [0, 1.5, 0] },
    resume:  { pos: [0, 3.2, 2.5],  look: [0, 1.6, -9] }, // swoop in over the graph
    options: { pos: [0, 2.8, 11],   look: [0, 1.5, 0] },
    exit:    { pos: [0, 1.8, 7.0],  look: [0, 1.5, 0] }
  };

  const camTargetPos = new THREE.Vector3(...stations.menu.pos);
  const camTargetLook = new THREE.Vector3(...stations.menu.look);
  const currentLook = new THREE.Vector3(...stations.menu.look);

  function damp(current, target, lambda, dt) {
    current.lerp(target, 1 - Math.exp(-lambda * dt));
  }

  // ---------------- Interaction / Raycasting ----------------
  let interactive = false;
  let clickTargets = [];
  let selectedCat = null;
  let orbClickCb = null;
  let orbHoverCb = null;
  let hoveredOrb = null;

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  canvas.addEventListener('click', (e) => {
    if (!interactive) return;
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(clickTargets);
    if (!hits.length) return;
    const ud = hits[0].object.userData;
    if (ud.type === 'orb' && orbClickCb) {
      orbClickCb(ud.index);
    }
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!interactive) { canvas.style.cursor = 'default'; return; }
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(clickTargets);

    if (hits.length) {
      canvas.style.cursor = 'pointer';
      const hitOrb = hits[0].object;
      if (hoveredOrb !== hitOrb) {
        if (hoveredOrb) {
          hoveredOrb.userData.scaleTarget = 1.0;
          hoveredOrb.material.emissiveIntensity = 0.2;
          hoveredOrb.material.opacity = hoveredOrb.userData.baseOpacity;
        }
        hoveredOrb = hitOrb;
        hoveredOrb.userData.scaleTarget = 1.35;
        hoveredOrb.material.emissiveIntensity = 0.95;
        hoveredOrb.material.opacity = 0.75;
        if (orbHoverCb) orbHoverCb(hoveredOrb.userData.index);
      }
    } else {
      canvas.style.cursor = 'default';
      if (hoveredOrb) {
        // Reset scale target if it's not the selected one
        const idx = hoveredOrb.userData.index;
        if (selectedCat !== idx) {
          hoveredOrb.userData.scaleTarget = 1.0;
          hoveredOrb.material.emissiveIntensity = 0.2;
          hoveredOrb.material.opacity = hoveredOrb.userData.baseOpacity;
        } else {
          hoveredOrb.userData.scaleTarget = 1.45;
          hoveredOrb.material.emissiveIntensity = 1.2;
          hoveredOrb.material.opacity = 0.9;
        }
        hoveredOrb = null;
        if (orbHoverCb) orbHoverCb(null);
      }
    }
  });

  // ---------------- Window Resize ----------------
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    adjustForViewport();
  });

  function adjustForViewport() {
    const aspect = window.innerWidth / window.innerHeight;
    if (aspect < 1) {
      // Mobile / Portrait zoom
      stations.menu.pos = [0, 4.5, 9.0];
      stations.newgame.pos = [0, 3.0, 11];
      stations.resume.pos = [0, 4.5, 5.0];
      stations.options.pos = [0, 3.8, 14];
      stations.exit.pos = [0, 2.8, 10];
    } else {
      // Desktop
      stations.menu.pos = [0, 3.2, 6.0];
      stations.newgame.pos = [0, 2.0, 7.5];
      stations.resume.pos = [0, 3.2, 2.5];
      stations.options.pos = [0, 2.8, 11];
      stations.exit.pos = [0, 1.8, 7.0];
    }
  }
  adjustForViewport();

  // ---------------- Animate Loop ----------------
  const clock = new THREE.Clock();
  
  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.getElapsedTime();

    // Damping camera
    damp(camera.position, camTargetPos, 2.2, dt);
    damp(currentLook, camTargetLook, 2.2, dt);
    camera.lookAt(currentLook);

    // Core point rotation
    morphParticles.rotation.y += dt * 0.06;
    morphParticles.rotation.x = Math.sin(t * 0.15) * 0.15;

    // Rotate SLAM node root
    if (resumeRoot.visible) {
      resumeRoot.rotation.y += dt * 0.2;
      resumeRoot.rotation.z = Math.sin(t * 0.25) * 0.1;
    }

    // Orb rotation and scaling
    orbs.forEach((o, idx) => {
      if (o.visible) {
        o.rotation.y += dt * 0.3;
        o.rotation.z += dt * 0.1;
        const s = o.scale.x + (o.userData.scaleTarget - o.scale.x) * Math.min(dt * 7, 1);
        o.scale.set(s, s, s);
      }
    });

    orbLines.forEach((l) => {
      if (l.visible) {
        l.material.opacity += (l.userData.targetOpacity - l.material.opacity) * Math.min(dt * 7, 1);
      }
    });

    // Animate point positions towards current target shape array
    const posAttr = morphParticles.geometry.attributes.position;
    const curArr = posAttr.array;
    for (let i = 0; i < curArr.length; i++) {
      curArr[i] += (currentTargetArray[i] - curArr[i]) * 0.075;
    }
    posAttr.needsUpdate = true;

    pMaterial.opacity += (targetParticleOpacity - pMaterial.opacity) * Math.min(dt * 5, 1);

    renderer.render(scene, camera);
  }
  animate();

  // ---------------- helper to convert 3D coordinates to 2D screen positions ----------------
  function toScreen(vec3) {
    const v = vec3.clone().project(camera);
    return {
      x: (v.x * 0.5 + 0.5) * window.innerWidth,
      y: (-v.y * 0.5 + 0.5) * window.innerHeight
    };
  }

  // ---------------- Public API ----------------
  return {
    setMode(mode) {
      adjustForViewport();
      const s = stations[mode];
      camTargetPos.set(...s.pos);
      camTargetLook.set(...s.look);

      // Morph particle targets
      if (mode === 'menu') currentTargetArray = targets.resume;
      else if (mode === 'newgame') currentTargetArray = targets.newgame;
      else if (mode === 'resume') currentTargetArray = targets.resume;
      else if (mode === 'options') currentTargetArray = targets.options;
      else if (mode === 'exit') currentTargetArray = targets.exit;

      // Toggle SLAM Graph mesh visibility
      const showGraph = (mode === 'resume' || mode === 'menu');
      resumeRoot.visible = showGraph;
      orbs.forEach((o) => o.visible = showGraph);
      orbLines.forEach((l) => l.visible = showGraph);

      if (showGraph) {
        interactive = true;
        clickTargets = orbs;
        this.deselectCategory(true);
      } else {
        interactive = false;
        clickTargets = [];
        this.deselectCategory(true);
      }
      canvas.classList.toggle('pickable', interactive);
    },

    hoverMenuItem(index) {
      // Morph core targets based on hovered menu item
      if (index === 0) currentTargetArray = targets.newgame;
      else if (index === 1) currentTargetArray = targets.resume;
      else if (index === 2) currentTargetArray = targets.options;
      else if (index === 3) currentTargetArray = targets.exit;
    },

    selectCategory(i) {
      selectedCat = i;
      orbLines.forEach((l, idx) => {
        l.userData.targetOpacity = (idx === i ? 0.95 : 0.05);
      });
      orbs.forEach((o, idx) => {
        if (idx === i) {
          o.userData.scaleTarget = 1.45;
          o.material.opacity = 0.9;
          o.material.emissiveIntensity = 1.2;
        } else {
          o.userData.scaleTarget = 0.75;
          o.material.opacity = 0.08;
          o.material.emissiveIntensity = 0.05;
        }
      });
      const pos = catPositions[i];
      camTargetPos.set(pos[0] * 0.6, pos[1] + 0.4, pos[2] + 3.0);
      camTargetLook.set(pos[0], pos[1], pos[2]);
    },

    deselectCategory(skipCameraReset) {
      selectedCat = null;
      orbLines.forEach((l) => {
        l.userData.targetOpacity = 0.2;
      });
      orbs.forEach((o) => {
        o.userData.scaleTarget = 1.0;
        o.material.opacity = o.userData.baseOpacity;
        o.material.emissiveIntensity = 0.2;
      });
      if (!skipCameraReset) {
        const s = stations.resume;
        camTargetPos.set(...s.pos);
        camTargetLook.set(...s.look);
      }
    },

    getSelectedCategory() {
      return selectedCat;
    },

    setParticleOpacity(opacity) {
      targetParticleOpacity = opacity;
    },

    onOrbClick(cb) {
      orbClickCb = cb;
    },

    onOrbHover(cb) {
      orbHoverCb = cb;
    },

    getCategoryScreenPositions() {
      return catPositions.map((pos) => {
        return toScreen(new THREE.Vector3(pos[0], pos[1] + 0.9, pos[2]));
      });
    }
  };
}
