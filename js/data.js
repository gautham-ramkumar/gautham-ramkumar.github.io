// ============================================================
// data.js — all portfolio content lives here.
// Edit this file to add or change projects, skills and experience
// without touching the rendering code in main.js.
// ============================================================

// Legacy exports kept for the archived 3D menu prototype (ui.js / scene.js).
export const catNames = [
  'Deep Learning',
  '3D Geometry',
  'State Estimation',
  'SLAM'
];

export const catPositions = [
  [-5.0, 2, -9],
  [-1.6, 2, -9],
  [1.6, 2, -9],
  [5.0, 2, -9]
];

// ------------------------------------------------------------
// PROJECT DOMAINS (used for the filter chips)
// A project can belong to more than one domain; the first one
// listed in a project's `domains` is shown as its card label.
// ------------------------------------------------------------
export const projectDomains = [
  { slug: 'robot-learning', title: 'Robot Learning' },
  { slug: 'perception', title: 'Perception' },
  { slug: '3d-slam', title: '3D Vision & SLAM' },
  { slug: 'estimation', title: 'Estimation & Calibration' },
  { slug: 'humanoids-control', title: 'Humanoids & Control' },
  { slug: 'edge', title: 'Edge AI' }
];

// ------------------------------------------------------------
// PROJECTS
// Fields:
//   slug      URL id, used for #projects/<slug> deep links
//   t         title
//   hook      one-line summary shown on the card and under the title
//   context   where the work came from (course, team, hackathon…)
//   status    optional badge, e.g. 'In progress'
//   problem   one short paragraph
//   approach  bullet list
//   results   bullet list (real numbers only)
//   metrics   up to three headline numbers
//   stack     technologies
//   github    public repo link (omit for private repos)
//   private   true when the repo is private; media is shown instead
//   media     local mp4 clips {src, poster, caption, fit, aspect}
//   video     YouTube embed URL
//   images    still images for the detail view
// ------------------------------------------------------------
export const projects = [
  // 0
  {
    slug: 'darksight',
    t: 'DarkSight — Low-Light Perception',
    hook: 'Real-time low-light video enhancement tuned for what robots need to see, not what looks nice to people.',
    domains: ['perception', 'edge'],
    date: 'Mar 2026 – May 2026',
    problem: 'Robot perception falls apart in near-darkness (below 1 lux). Off-the-shelf enhancers are tuned for how an image looks to a person and flicker from frame to frame, which throws off the detectors and feature trackers that run downstream.',
    approach: [
      'Trained a zero-reference enhancement model on 18,000 unpaired frames, so no matched bright/dark ground truth was needed.',
      'Designed a DS3DConv encoder-decoder with a ConvGRU recurrent bottleneck for frame memory, plus RAFT optical-flow warping to keep consecutive frames consistent.',
      'Used a perception-aware loss tuned to YOLOv8 features, so the output helps detection rather than just looking brighter.',
      'Ran it live on an Intel RealSense D435 with adaptive frame skipping, and exported a TensorRT engine for deployment.'
    ],
    results: [
      '17 FPS at 360p with 57 ms inference latency on the RealSense D435 (PyTorch backend).',
      '17.25 dB PSNR with 0.99 ORB feature stability (v2.1 recurrent model).'
    ],
    metrics: [
      { num: '17 FPS', label: 'real time at 360p' },
      { num: '57 ms', label: 'inference latency on RealSense D435' },
      { num: '0.99', label: 'ORB feature stability · 17.25 dB PSNR' }
    ],
    stack: ['PyTorch', 'TensorRT', 'RAFT', 'YOLOv8', 'OpenCV', 'RealSense'],
    github: 'https://github.com/gautham-ramkumar/DarkSight',
    video: 'https://www.youtube.com/embed/1y91Fi5i9Fg'
  },

  // 1
  {
    slug: 'camera-lidar-calibration',
    t: 'Camera–LiDAR Temporal Calibration',
    hook: 'Measures and corrects the time lag between a camera and a LiDAR, without a calibration target.',
    domains: ['estimation', '3d-slam'],
    date: 'Oct 2025 – Dec 2025',
    context: 'Final project · EECE7150 Autonomous Field Robotics, Northeastern',
    problem: 'Fusing camera and LiDAR data only works if the two sensors agree on time. Target-based calibration is tedious and cannot follow latency that shifts while the robot runs, and a naive edge-alignment search can lock onto the wrong answer.',
    approach: [
      'Built a stamp-first sync pipeline: anchor on the hardware capture timestamps, then let cross-modal edge alignment correct only a small leftover latency.',
      'Bounded that correction (±50 ms clip) so repetitive scene structure cannot drag the estimate off.',
      'Checked stability across 15 sliding windows on the huntington dataset (1,500 camera frames, 750 LiDAR scans).'
    ],
    results: [
      'Converged to a −19.49 ms offset that stayed within a 1.5 ms band across all 15 windows.',
      'Caught and rejected a spurious 150 ms alias that an unconstrained search latched onto, keeping a bad timing fix out of the pipeline.'
    ],
    metrics: [
      { num: '−19.49 ms', label: 'camera–LiDAR offset recovered' },
      { num: '1.5 ms', label: 'stability band over 15 windows' },
      { num: '150 ms', label: 'false alias detected and rejected' }
    ],
    stack: ['C++', 'Python', 'ROS 2', 'GTSAM', 'Open3D', 'OpenCV'],
    github: 'https://github.com/gautham-ramkumar/Camera-LiDAR-Temporal-Calibration',
    images: ['images/Camera_LiDAR.png']
  },

  // 2
  {
    slug: 'ekf-localization',
    t: 'GPS–IMU–Wheel EKF Localization',
    hook: 'A C++ Extended Kalman Filter that keeps a car localized through a 7.7-minute GPS outage.',
    domains: ['estimation'],
    date: 'Sep 2025 – Oct 2025',
    context: 'Solo · C++ port of an EECE7150 course project, Northeastern',
    problem: 'GPS is slow and drops out in tunnels and urban canyons. Getting speed by integrating an accelerometer turns any small bias into position error that grows quadratically, so dead reckoning decays fast. The test data: a 51-minute drive on a Lincoln MKZ (Dataspeed drive-by-wire) with a real 7.7-minute GPS outage.',
    approach: [
      'Wrote a 2D EKF in C++17 with Eigen that fuses a 200 Hz IMU, 10 Hz GPS and 50 Hz wheel speed over position, heading, speed and accelerometer bias.',
      'Joseph-form covariance updates keep the filter numerically stable; chi-square gating at 99% confidence rejects bad GPS fixes.',
      'Added a recovery path that inflates the covariance after 10 rejections in a row, so the filter cannot refuse GPS forever after a long outage.',
      'Matched the original Python version\'s results before adding wheel-speed fusion.'
    ],
    results: [
      'Wheel-speed fusion cut median drift after simulated 30 s outages from 68.83 m to 3.32 m, about 20× less.',
      'Error after the real 462 s outage fell from 2,123.93 m to 516.00 m.',
      '0.27 m held-out 95th-percentile error; the full 51-minute log processes in about 0.5 s (Release build).'
    ],
    metrics: [
      { num: '20×', label: 'less drift after a 30 s GPS outage' },
      { num: '0.27 m', label: 'held-out 95th-percentile error' },
      { num: '462 s', label: 'real GPS outage navigated' }
    ],
    stack: ['C++17', 'Eigen', 'CMake', 'ROS 2', 'Python'],
    github: 'https://github.com/gautham-ramkumar/2D-EKF-using-GPS-and-IMU',
    images: ['images/EKF_trajectory.png', 'images/EKF.png']
  },

  // 3
  {
    slug: 'rtab-map-tunnels',
    t: 'Indoor 3D Mapping — RTAB-Map',
    hook: 'A real-time visual SLAM map of 250 m of GPS-denied underground tunnel.',
    domains: ['3d-slam'],
    date: 'Sep 2025 – Oct 2025',
    context: 'Northeastern University tunnels',
    problem: 'Underground tunnels have no GPS and long stretches of repetitive, low-texture walls, which is exactly where visual SLAM drifts and loop closure fails.',
    approach: [
      'Ran RTAB-Map on a ZED Mini stereo camera in ROS 2, alongside LiDAR and a VectorNav IMU with calibrated coordinate transforms.',
      'Validated loop-closure detection and pose-graph consistency over long trajectories.',
      'Fixed noisy handheld visual odometry by mounting the ZED Mini on a rolling chair, which stabilized loop closure.'
    ],
    results: [
      'Mapped 250 m of underground tunnel in real time under low-texture conditions.',
      '90% alignment with the ground-truth tunnel layout.'
    ],
    metrics: [
      { num: '250 m', label: 'GPS-denied tunnel mapped' },
      { num: '90%', label: 'alignment with ground-truth layout' },
      { num: 'Real time', label: 'online loop closure + pose graph' }
    ],
    stack: ['ROS 2', 'RTAB-Map', 'ZED Mini', 'LiDAR', 'VectorNav IMU'],
    github: 'https://github.com/gautham-ramkumar/3D-Mapping-RTAB',
    video: 'https://www.youtube.com/embed/Wk166Gxu5-o'
  },

  // 4
  {
    slug: 'structure-from-motion',
    t: '3D Reconstruction via SfM',
    hook: 'Incremental Structure-from-Motion built from scratch: 24 photos in, 5,500+ 3D points out.',
    domains: ['3d-slam'],
    date: 'Oct 2025 – Nov 2025',
    problem: 'Turning a set of 2D photos into a 3D model is computationally expensive and suffers from scale and gauge ambiguity. This project builds the whole pipeline by hand instead of calling a reconstruction library.',
    approach: [
      'SIFT features, RANSAC outlier rejection, essential-matrix decomposition and triangulation, with no high-level reconstruction utilities.',
      'Registered each new view with bidirectional PnP-RANSAC.',
      'Bundle adjustment in GTSAM with Huber factors and Levenberg–Marquardt optimization.',
      'Optional SuperPoint + LightGlue learned front end; exports COLMAP-compatible sparse models.'
    ],
    results: [
      'Registered all 24 images to one global frame and reconstructed 5,500+ sparse landmarks.',
      'Bundle adjustment cut the cost by about 60–70%, ending at roughly 3–4 px reprojection RMSE.'
    ],
    metrics: [
      { num: '5,500+', label: 'sparse 3D landmarks' },
      { num: '60–70%', label: 'bundle-adjustment cost reduction' },
      { num: '3–4 px', label: 'final reprojection RMSE' }
    ],
    stack: ['Python', 'OpenCV', 'GTSAM', 'Open3D', 'NumPy'],
    github: 'https://github.com/gautham-ramkumar/3D-Reconstruction-using-SfM',
    images: ['images/Ground_Truth.png', 'images/Pre_BA.png', 'images/Post_BA.png']
  },

  // 5
  {
    slug: 'gaussian-splatting',
    t: '3D Gaussian Splatting from Scratch',
    hook: 'A Gaussian Splatting optimizer written from scratch, and proof that the default training schedule ruins small scenes.',
    domains: ['3d-slam'],
    date: 'Jan 2026 – Mar 2026',
    problem: 'Standard 3D Gaussian Splatting recipes are tuned for large datasets. On a small 24-image scene they overfit at the default iteration count, and there is no clear signal for when to stop.',
    approach: [
      'Implemented the optimization loop from scratch (densification, cloning, splitting, pruning and adaptive parameter control) on top of the official EWA CUDA rasterizer.',
      'Tracked PSNR across checkpoints on a 24-image Buddha dataset, and compared COLMAP against custom SfM initialization.',
      'Containerized the pipeline in Docker with GitHub Actions CI/CD benchmarks for reproducibility.'
    ],
    results: [
      '31.42 dB PSNR and 0.9531 SSIM at 7,500 iterations.',
      'The default 30,000-iteration schedule collapsed PSNR to 15.06 dB as Gaussians stretched into needle-like artifacts, which led to an early-stop policy.',
      'COLMAP initialization beat custom SfM initialization by 2.49 dB PSNR at the same iteration count.'
    ],
    metrics: [
      { num: '31.42 dB', label: 'PSNR at 7,500 iterations' },
      { num: '0.9531', label: 'SSIM at 7,500 iterations' },
      { num: '+2.49 dB', label: 'COLMAP vs custom SfM init' }
    ],
    stack: ['Python', 'PyTorch', 'CUDA', 'COLMAP', 'Docker', 'GitHub Actions'],
    github: 'https://github.com/gautham-ramkumar/gaussian-splatting',
    video: 'https://www.youtube.com/embed/t120QEDT7Qk'
  },

  // 6
  {
    slug: 'semantic-color-constancy',
    t: 'Semantic Color Constancy',
    hook: 'White balance that uses the objects it recognizes to correct mixed lighting.',
    domains: ['perception', 'edge'],
    date: 'Oct 2025 – Dec 2025',
    context: 'Final project · CS7180 Advanced Perception, Northeastern',
    problem: 'Global white balance assumes a single light source, so scenes under mixed or uneven lighting end up with color casts.',
    approach: [
      'Fine-tuned YOLOv8 on 5,600 COCO-derived images instead of training a detector from scratch.',
      'Each detected object contributes an object-aware chromaticity prior, across 80 semantic classes.',
      'Optimized the backbone for CPU inference.'
    ],
    results: [
      '63% better color constancy, validated across 4 lighting conditions from daylight to tungsten.',
      '130 ms per image on a CPU, so it runs without a GPU.'
    ],
    metrics: [
      { num: '63%', label: 'color constancy improvement' },
      { num: '130 ms', label: 'per image on CPU' },
      { num: '80', label: 'object classes used as priors' }
    ],
    stack: ['Python', 'PyTorch', 'YOLOv8', 'OpenCV', 'NumPy'],
    github: 'https://github.com/gautham-ramkumar/Semantic-Color-Constancy',
    images: ['images/Color_Constancy1.png', 'images/Color_Constancy2.png']
  },

  // 7
  {
    slug: 'low-light-unet',
    t: 'Low-Light Image Enhancement',
    hook: 'A U-Net that denoises and brightens dark images in one pass.',
    domains: ['perception'],
    date: '2025',
    problem: 'Very dark images carry heavy noise and poor contrast, which makes standard vision detectors unusable.',
    approach: [
      'Designed a U-Net for joint denoising and exposure correction, inspired by Zero-DCE and LIVENet.',
      'Skip connections preserve fine structural detail.',
      'Loss combines L1 reconstruction with a perceptual SSIM term; trained and evaluated on the LOLv1 benchmark.'
    ],
    results: [
      '19.37 dB PSNR on LOLv1, 16.9% above the 16.57 dB baseline.'
    ],
    metrics: [
      { num: '19.37 dB', label: 'PSNR on LOLv1' },
      { num: '+16.9%', label: 'over the 16.57 dB baseline' },
      { num: '1 pass', label: 'joint denoising + exposure correction' }
    ],
    stack: ['Python', 'PyTorch', 'OpenCV', 'NumPy'],
    github: 'https://github.com/gautham-ramkumar/Image-Enhancement',
    images: ['images/Image_Enhancement.jpeg']
  },

  // 8
  {
    slug: 'wall-defect-detection',
    t: 'Wall Defect Detection',
    hook: 'A real-time wall-defect detector on a Jetson Nano that uses depth to locate each defect in 3D.',
    domains: ['perception', 'edge'],
    date: 'Jan 2024 – Apr 2024',
    context: 'B.Tech capstone · VIT Chennai',
    problem: 'Manual wall inspection is slow and inconsistent, and telling cosmetic flaws from structural damage needs depth that a plain RGB camera does not give you.',
    approach: [
      'Built and annotated a 1,300-image dataset of cracks, bubbles, dents and scratches with LabelImg and Roboflow.',
      'Fine-tuned YOLOv5 and deployed it on an NVIDIA Jetson Nano.',
      'Added Intel RealSense D435 depth to place each detected defect in 3D.'
    ],
    results: [
      '91.9% precision and 0.97 recall at real-time speed on the Jetson Nano.',
      '0.986 AP on the primary defect class under variable field lighting.'
    ],
    metrics: [
      { num: '91.9%', label: 'precision · 0.97 recall' },
      { num: '0.986', label: 'AP on the primary defect class' },
      { num: '1,300', label: 'images annotated by hand' }
    ],
    stack: ['Python', 'YOLOv5', 'Jetson Nano', 'RealSense', 'Roboflow'],
    github: 'https://github.com/gautham-ramkumar/Wall-Detection-using-YOLOv5',
    video: 'https://www.youtube.com/embed/y-EcAAwTE80'
  },

  // 9
  {
    slug: 'hzd-biped',
    t: 'HZD Bipedal Gait Control',
    hook: 'A provably stable walking gait for a 3-link biped, from the equations of motion to a closed-loop simulation.',
    domains: ['humanoids-control'],
    date: 'Jan 2026 – May 2026',
    context: 'Course project · EECE7398 Legged Robotics, Northeastern · team of 4',
    problem: 'Classic ZMP-style biped controllers fight the leg\'s natural pendulum motion to stay upright, which makes gaits slow and energy-hungry. Designing a provably stable walking cycle for an underactuated biped is a hard hybrid-control problem.',
    approach: [
      'Derived the swing-phase Lagrangian dynamics and the heel-strike impact map symbolically.',
      'Imposed 4th-order Bézier virtual constraints to reduce the robot to a 2-DOF Hybrid Zero Dynamics manifold.',
      'Optimized the periodic gait with fmincon for minimum control effort.',
      'Closed the loop with exact input-output feedback linearization, checked by a 15-step full-order simulation and a Poincaré return map.'
    ],
    results: [
      'Closed-loop walking at about 1.73 m/s with a Mechanical Cost of Transport of 1.1584.',
      'Poincaré error decayed geometrically over 15 steps, confirming exponential orbital stability.',
      'Written up as an IEEE-format conference-style report.'
    ],
    metrics: [
      { num: '1.73 m/s', label: 'closed-loop walking speed' },
      { num: '1.1584', label: 'Mechanical Cost of Transport' },
      { num: '15 steps', label: 'full-order sim, Poincaré-stable' }
    ],
    stack: ['MATLAB', 'fmincon', 'ode45', 'Feedback Linearization', 'Bézier Virtual Constraints'],
    github: 'https://github.com/gautham-ramkumar/hzd-biped-control',
    images: ['images/HZD_anim_snapshot.png', 'images/HZD_trajectories.png', 'images/HZD_phase.png']
  },

  // 10
  {
    slug: 'yeschef',
    t: 'YesChef — Voice-Controlled Sandwich Assembly',
    hook: 'Ask for a sandwich out loud and a robot arm builds it, with three AI models running on the robot.',
    domains: ['robot-learning', 'edge'],
    date: 'Aug 2026',
    context: 'Revolute Hackathon · 2nd place · built in one weekend',
    problem: 'A robot that builds a sandwich from a spoken request has to understand the request, see the workspace and act, ideally without cloud APIs that add latency and privacy risk.',
    approach: [
      'Chained Whisper (speech-to-text), Qwen2.5-3B (instruction parsing and planning) and Qwen2.5-VL-3B (scene understanding) into trajectory execution on a 6-DoF arm.',
      'Ran everything on-device on an NVIDIA Jetson Orin Nano, using LeRobot and SocketCAN.',
      'Required the 3B-parameter VLM to read legible on-package text before it could authorize any pick.',
      'Fixed a leader-arm unwrap fault by rescaling gripper directions from 6.0 to 3.0, spreading 270° of travel across 90°.'
    ],
    results: [
      'Won 2nd place at the Revolute Hackathon with a working end-to-end demo.',
      'Three local models in the loop, with no cloud APIs.'
    ],
    metrics: [
      { num: '2nd', label: 'place at Revolute Hackathon' },
      { num: '3 models', label: 'Whisper → Qwen2.5-3B → Qwen2.5-VL-3B' },
      { num: 'On-device', label: 'Jetson Orin Nano, no cloud' }
    ],
    stack: ['Python', 'Whisper', 'Qwen2.5-VL', 'LeRobot', 'SocketCAN', 'Jetson Orin Nano'],
    video: 'https://www.youtube.com/embed/7AaO0o-qSSI',
    demo: 'https://youtu.be/7AaO0o-qSSI'
  },

  // 11
  {
    slug: 'backstop',
    t: 'Backstop — Runtime Failure Prediction for VLA Policies',
    hook: 'A safety layer that spots when a frozen robot policy is failing and stops it early.',
    domains: ['robot-learning'],
    date: 'Aug 2026 – Present',
    context: 'Solo · Robotics AI Engineer, Chicago Education Advocacy Corporation',
    status: 'Active',
    problem: 'Vision-Language-Action (VLA) policies turn camera images and an instruction straight into robot actions, and they fail silently: closing the gripper on air, then stalling until a timeout. A frozen policy gives no signal for when its next actions should not be trusted.',
    approach: [
      'Watches a frozen SmolVLA policy in LIBERO simulation and decides whether to trust its next actions, without modifying or retraining it.',
      'Recorded a LeRobot dataset that keeps the full 50-step action chunk and 4 sampled chunks per step, across perturbations (lighting, camera, object pose, distractors, action noise, missing or paraphrased instructions).',
      'Headline guard: action-chunk disagreement combined with a stopwatch, with thresholds set from good runs only under a 5% false-stop budget.',
      'An OWLv2 missing-object gate checks the scene before the arm moves. Shipped the online guard in Python plus a header-only C++17 port.'
    ],
    results: [
      'Reproduced a 70.0% SmolVLA baseline on LIBERO-Spatial (100 episodes; all 30 failures are stalls at the 280-step cap).',
      'Ends failing runs 13.4 steps (0.67 s) sooner than a stopwatch on average, at a 4.3% held-out false-stop rate, catching every failure across 20 random splits.',
      'The OWLv2 gate stops 28 of 30 absent-object runs before the arm moves; the C++17 port matches Python bit for bit over 500 episodes.',
      'Reported a negative result too: a lift-back-off-retry recovery rescued only 1 of 19 failures, because the policy returned to the same stall.'
    ],
    metrics: [
      { num: '0.67 s', label: 'earlier stop than a stopwatch' },
      { num: '4.3%', label: 'held-out false-stop (5% budget)' },
      { num: '28/30', label: 'absent-object runs stopped before moving' }
    ],
    stack: ['Python', 'LeRobot', 'SmolVLA', 'LIBERO', 'MuJoCo', 'OWLv2', 'C++17'],
    github: 'https://github.com/gautham-ramkumar/Backstop_VLA',
    media: [
      {
        src: 'media/backstop_failure.mp4',
        poster: 'media/backstop_failure.jpg',
        fit: 'contain',
        aspect: '1 / 1',
        caption: 'Failure (frozen SmolVLA, LIBERO-Spatial task 0, seed 1): approaches, never secures the bowl and runs out the 280-step clock. Shown at 2× speed.'
      },
      {
        src: 'media/backstop_success.mp4',
        poster: 'media/backstop_success.jpg',
        fit: 'contain',
        aspect: '1 / 1',
        caption: 'Success (same task, seed 0): grasps the bowl and places it on the plate in 100 steps.'
      }
    ]
  },

  // 12
  {
    slug: 'mirrorguard',
    t: 'MirrorGuard — Physics-Based Mirror Detection',
    hook: 'A humanoid tells a mirror from a doorway by moving its arms and checking whether the "other robot" copies it.',
    domains: ['perception', 'humanoids-control'],
    date: '2026 – Present',
    context: 'Solo · simulation (NVIDIA Isaac Sim)',
    status: 'In progress',
    private: true,
    problem: 'Stereo depth and LiDAR see a mirror as a doorway into a believable phantom room, so the planner drives straight into it. Learned mirror detectors and vision-language models get fooled too.',
    approach: [
      'Interrogate, don\'t classify: a Unitree G1 makes a random sequence of single-limb moves and compares the suspect region with its own joint readings for three reflection signatures (chirality, synchrony, trajectory match).',
      'A randomization test against 999 surrogate sequences gives an exact p-value (α = 0.01), with up to 3 rounds combined by Fisher\'s method. Unclear cases fail safe to "obstacle", and motion the robot did not cause triggers a retry.',
      'Navigation: head stereo (OpenCV SGBM) feeds an occupancy grid; "depth behind a known wall" sends the robot to 1.5 m to verify, then the mirror is stored as solid and the path is replanned with A*.'
    ],
    results: [
      'In Isaac Sim house runs, the guarded robot verified the mirror in one round in 7 of 7 runs (p = 0.001, about 14 s from trigger to verdict) with no false triggers.',
      'Without the check, the robot crashed into the mirror in 3 of 5 runs.',
      'Simulation only so far; currently fixing head-camera shake, where a waving arm jolts the body enough to swamp the arm signal.'
    ],
    metrics: [
      { num: '7/7', label: 'guarded runs verified in one round' },
      { num: '~14 s', label: 'trigger to verdict, no false triggers' },
      { num: '3 of 5', label: 'unguarded runs hit the mirror' }
    ],
    stack: ['Python', 'NumPy', 'SciPy', 'OpenCV', 'Isaac Sim', 'Unitree G1'],
    media: [
      {
        src: 'media/mirrorguard_guarded.mp4',
        poster: 'media/mirrorguard_guarded.jpg',
        caption: 'With the mirror check: the guarded G1 stops, verifies the mirror with a random arm challenge and goes through the door.'
      },
      {
        src: 'media/mirrorguard_unguarded.mp4',
        poster: 'media/mirrorguard_unguarded.jpg',
        caption: 'Without the mirror check: the unguarded G1 walks into the mirror.'
      }
    ]
  }
];

// Featured projects (shown first, as large cards), by slug.
// Every project with a video (local clip or YouTube demo) is featured.
export const featuredProjectSlugs = [
  'backstop',
  'mirrorguard',
  'yeschef',
  'darksight',
  'gaussian-splatting',
  'rtab-map-tunnels',
  'wall-defect-detection'
];

// Display order for everything else (anything not listed is appended).
export const projectOrder = [
  'ekf-localization',
  'camera-lidar-calibration',
  'hzd-biped',
  'structure-from-motion',
  'semantic-color-constancy',
  'low-light-unet'
];

// Back-compat shapes for the archived 3D prototype.
export const catData = projects.map(p => [p]);
export const featuredProjectIndices = featuredProjectSlugs.map(s => projects.findIndex(p => p.slug === s));
export const categoryGroups = projectDomains.map(d => ({
  title: d.title,
  indices: projects.map((p, i) => (p.domains.includes(d.slug) ? i : -1)).filter(i => i >= 0)
}));

export const sectionMsgs = {
  menu: 'CORE DIRECTORY ACTIVE. Select a section to review credentials.',
  newgame: 'EXPERIENCE MODULE ACTIVE. Reviewing professional timeline and capabilities.',
  resume: '3D SLAM FACTOR GRAPH MAP ACTIVE. Hover or click nodes to inspect category clusters.',
  options: 'TECHNICAL CAPABILITY CHART ACTIVE. Hover over nodes or controller sections to inspect competencies.',
  exit: 'COMMUNICATION GATEWAY ESTABLISHED. Ready for guest package transmission.'
};

export const menuItems = [
  { id: 'newgame', label: 'EXPERIENCE', subtitle: 'Timeline & Education' },
  { id: 'resume', label: 'PROJECTS', subtitle: 'Interactive 3D Project Graph' },
  { id: 'options', label: 'TECHNICAL SKILLS', subtitle: 'Capabilities Map' },
  { id: 'exit', label: 'CONTACT ME', subtitle: 'Get in Touch' }
];

// Xbox Controller 2D mapping labels to skillGroups indices
export const controllerMap = [
  { part: 'ls', groupIndex: 0, label: 'STATE ESTIMATION & CALIBRATION' },
  { part: 'dpad', groupIndex: 1, label: 'PERCEPTION & SLAM' },
  { part: 'rs', groupIndex: 2, label: 'PROGRAMMING & UTILITIES' },
  { part: 'triggers', groupIndex: 3, label: 'DEEP LEARNING MODELING' },
  { part: 'face', groupIndex: 4, label: 'HARDWARE & SENSORS' },
  { part: 'menu', groupIndex: 5, label: 'ROBOTICS COURSEWORK' }
];

export const experience = [
  {
    period: 'Aug 2026 – Present',
    role: 'Robotics AI Engineer',
    org: 'Chicago Education Advocacy Corporation · Chicago, IL (Remote)',
    desc: 'Grew automated test coverage from 44 to 145 tests across a two-job CI pipeline. Reproduced a 70% SmolVLA task-success baseline in MuJoCo on an 8 GB GPU with pinned dependencies. Built a dataset verifier that catches three silent defects (zeroed chunks, wrong state convention, missing unnormalization), and Backstop, a VLA failure monitor that ends failing runs 0.67 s sooner than a stopwatch at a 4.3% held-out false-stop rate.'
  },
  {
    period: 'Fall 2024 – May 2026',
    role: 'Master of Science — Robotics (Concentration: ECE)',
    org: 'Northeastern University · Boston, MA',
    desc: 'GPA 3.636/4.0. Deep focus on sensor fusion, SLAM, state estimation, and deep learning perception for autonomous systems. Coursework: Advanced Perception, Robot Sensing & Navigation, Autonomous Field Robotics, Mobile Robotics, Robot Mechanics & Controls, Control Systems Engineering, Legged Robotics.'
  },
  {
    period: 'May 2023 – Jul 2023',
    role: 'Internet of Things Intern',
    org: 'SmartInternz · Chennai, India',
    desc: 'Held 1 cm distance accuracy in a real-time ultrasonic sensing pipeline for automated access control. Streamed Firebase telemetry at 1 Hz with automated alerts across 10 concurrent authenticated users. Delivered a full embedded-to-mobile system end to end within a 3-month internship.'
  },
  {
    period: '2020 – May 2024',
    role: 'B.Tech — Electronics & Communications Engineering',
    org: 'Vellore Institute of Technology (VIT) · Chennai, India',
    desc: 'GPA 3.48/4.0. Foundational coursework in signal processing, embedded systems, digital communications, and electronics engineering. Capstone (Jan–Apr 2024): real-time surface defect detection with YOLOv5 on an NVIDIA Jetson Nano with Intel RealSense depth.'
  }
];

export const skillGroups = [
  {
    title: 'State Estimation & Calibration',
    items: [
      'Multi-Sensor Calibration',
      'Camera-LiDAR Calibration',
      'Temporal Synchronization',
      'Sensor Fusion',
      'Factor Graph Optimization',
      'Bundle Adjustment',
      'Pose Estimation',
      'EKF',
      'Visual-Inertial Odometry',
      'GTSAM/iSAM2',
      'IMU Preintegration',
      'Dead Reckoning'
    ]
  },
  {
    title: 'Perception & SLAM',
    items: [
      'Visual SLAM (RTAB-Map)',
      'Stereo Vision',
      'Depth Estimation',
      'Object Detection (YOLO)',
      '3D Reconstruction (SfM)',
      'Feature Matching (SIFT/ORB)',
      'Point Cloud Processing',
      'Loop Closure Detection',
      '3D Gaussian Splatting',
      'Structure from Motion',
      'COLMAP',
      'Occupancy Mapping'
    ]
  },
  {
    title: 'Programming & Utilities',
    items: [
      'Python',
      'C++',
      'MATLAB',
      'ROS2',
      'OpenCV',
      'GTSAM',
      'Open3D',
      'PyTorch',
      'TensorRT',
      'Docker',
      'Git',
      'CUDA',
      'Eigen'
    ]
  },
  {
    title: 'Deep Learning Modeling',
    items: [
      'CNNs',
      'RNNs',
      'U-Net',
      '3D Convolutions',
      'ConvGRU',
      'Transfer Learning',
      'Fine-Tuning',
      'Edge Deployment',
      'Loss Function Design',
      'Vision-Language Models',
      'Whisper (Speech-to-Text)',
      'Vision-Language-Action Models',
      'Qwen2.5-VL'
    ]
  },
  {
    title: 'Hardware & Sensors',
    items: [
      'ZED Mini Stereo Camera',
      'LiDAR',
      'VectorNav IMU',
      'NVIDIA Jetson Nano',
      'Intel RealSense D435',
      'NVIDIA Jetson Orin Nano'
    ]
  },
  {
    title: 'Robotics Coursework',
    items: [
      'Advanced Perception',
      'Robot Sensing & Navigation',
      'Autonomous Field Robotics',
      'Mobile Robotics',
      'Robot Mechanics & Controls',
      'Control Systems Engineering',
      'Legged Robotics (HZD)',
      'Control: PID, LQR, MPC, SMC'
    ]
  },
  {
    title: 'Robot Learning',
    items: [
      'MuJoCo',
      'LeRobot',
      'Isaac Sim',
      'Imitation-Learned Policy Evaluation',
      'Perturbation-Based Testing'
    ]
  }
];
