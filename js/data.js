// ============================================================
// data.js — all portfolio content lives here.
// Edit this file to add real projects/skills without touching
// scene.js or ui.js.
// ============================================================

export const catNames = [
  'Deep Learning',
  '3D Geometry',
  'State Estimation',
  'SLAM'
];

// World-space positions for the 4 category orbs in the 3D scene.
export const catPositions = [
  [-5.0, 2, -9],
  [-1.6, 2, -9],
  [1.6, 2, -9],
  [5.0, 2, -9]
];

export const catData = [
  // Project 0: DarkSight — Low-Light Perception (Category: Deep Learning)
  [
    {
      t: 'DarkSight — Low-Light Perception',
      lbl: 'Real-time',
      val: '17 FPS',
      tags: ['PyTorch', 'TensorRT', 'Zero-3DCE', 'YOLOv8'],
      date: 'Mar 2026 – May 2026',
      situation: 'Robotic perception pipelines fail in sub-1 lux environments; off-the-shelf enhancement tools optimise for human aesthetics and lack temporal coherence across video frames.',
      action: 'Trained a zero-reference enhancement model on 18,000 unpaired frames. Designed DS3DConv encoder-decoder with ConvGRU recurrent bottleneck for frame memory, RAFT optical-flow warping for temporal consistency, and a perception-aware loss tuned to YOLOv8 features; exported to TensorRT INT8/FP16 for edge deployment.',
      result: '17.25 dB PSNR, 0.99 ORB stability; Deployed real-time low-light enhancement on Intel RealSense D435 with adaptive frame skipping, achieving 57ms inference latency at 17 FPS (360p, PyTorch backend); TensorRT engine exported for production deployment.',
      metrics: [
        { num: '17 FPS', label: 'at 360p · PyTorch backend · TensorRT export' },
        { num: '17.25', label: 'dB PSNR · 0.99 ORB stability (v2.1 recurrent)' },
        { num: '57ms', label: 'inference latency on RealSense D435' }
      ],
      stack: ['PyTorch', 'TensorRT', 'Zero-3DCE', 'RAFT', 'YOLOv8', 'RealSense'],
      github: 'https://github.com/gautham-ramkumar/DarkSight',
      video: 'https://www.youtube.com/embed/1y91Fi5i9Fg'
    }
  ],

  // Project 1: Camera–LiDAR Temporal Calibration (Category: 3D Geometry)
  [
    {
      t: 'Camera–LiDAR Temporal Calibration',
      lbl: 'Time Offset',
      val: '-19.49ms',
      tags: ['Calibration', 'Multi-Sensor', 'C++', 'Oct 2025'],
      date: 'Oct 2025 – Dec 2025',
      situation: 'Final project for EECE7150 Autonomous Field Robotics (Northeastern). Camera-LiDAR sensor fusion requires sub-millisecond temporal synchronization; manual target-based calibration is tedious and cannot adapt to dynamic online sensor latency.',
      action: 'Implemented a stamp-primary temporal sync pipeline with a bounded residual path. The system anchors on stable hardware capture timestamps (tau_stamp) and then lets cross-modal edge alignment correct a small, plausible latency bias (tau_res), avoiding failure modes from scene-driven aliasing.',
      result: 'Converged the temporal correction to a stable -19.49 ms (≈ −19.5 ms) offset on the huntington dataset (1500 camera frames, 750 LiDAR scans), holding within a 1.5 ms band across 15 sliding windows. Diagnosed and rejected a spurious 150 ms alias that naive unconstrained edge-score searches latched onto, keeping a corrupted timing fix out of the pipeline.',
      metrics: [
        { num: '-19.49ms', label: 'time offset estimated' },
        { num: '±50ms', label: 'bounded residual clip' },
        { num: '1.5ms', label: 'stability band across 15 sliding windows' }
      ],
      stack: ['Python', 'C++', 'GTSAM', 'ROS2', 'Open3D', 'OpenCV'],
      github: 'https://github.com/gautham-ramkumar/Camera-LiDAR-Temporal-Calibration',
      images: ['images/Camera_LiDAR.png']
    }
  ],

  // Project 2: GPS–IMU Fusion via Extended Kalman Filter (Category: State Estimation)
  [
    {
      t: 'GPS–IMU–Wheel EKF Localization',
      lbl: 'Outage Drift',
      val: '20× lower',
      tags: ['C++17', 'Eigen', 'EKF', 'ROS2'],
      date: 'Sep 2025 – Oct 2025',
      situation: 'GNSS is low-rate and disappears entirely in tunnels and urban canyons. Deriving speed by integrating an accelerometer turns any small bias into position error that grows quadratically, so dead reckoning decays fast. A 51-minute drive log recorded on a Lincoln MKZ with a Dataspeed drive-by-wire kit contained a real 7.7-minute GPS outage to survive.',
      action: 'Built a 2D Extended Kalman Filter in C++17 with Eigen that fuses a 200 Hz IMU, 10 Hz GPS and 50 Hz wheel speed over a state of position, heading, speed and accelerometer bias. Used Joseph-form covariance updates to keep the covariance positive definite, chi-square innovation gating at 99% confidence to reject bad fixes, and a recovery path that inflates covariance after 10 consecutive rejections so the filter cannot reject GPS forever after a long outage. Ported from an earlier Python version, reproducing it to the reported precision before adding wheel speed.',
      result: 'Wheel-speed fusion cut median dead-reckoning drift after simulated 30-second outages from 68.83 m to 3.32 m, roughly 20x, and reduced error after the real 462-second outage from 2123.93 m to 516.00 m. Held-out 95th-percentile error is 0.27 m, and the full 51-minute run completes in about 0.5 s in Release.',
      metrics: [
        { num: '20×', label: 'less drift after a 30 s GPS outage' },
        { num: '0.27 m', label: 'held-out 95th-percentile error' },
        { num: '462 s', label: 'real GPS outage navigated' }
      ],
      stack: ['C++17', 'Eigen', 'ROS2', 'Python'],
      github: 'https://github.com/gautham-ramkumar/2D-EKF-using-GPS-and-IMU',
      images: ['images/EKF_trajectory.png', 'images/EKF.png']
    }
  ],

  // Project 3: Indoor 3D Mapping with RTAB-Map (Category: SLAM)
  [
    {
      t: 'Indoor 3D Mapping — RTAB-Map',
      lbl: 'GT alignment',
      val: '90%',
      tags: ['ROS2', 'ZED Mini', 'LiDAR', 'IMU'],
      date: 'Sep 2025 – Oct 2025',
      situation: 'Underground tunnels lack GPS and have repetitive visual structure, making drift-free 3D mapping extremely challenging for a mobile robot.',
      action: 'Deployed RTAB-Map on a ZED Mini stereo camera in ROS2; brought up a full multi-sensor suite (LiDAR, VectorNav IMU) with calibrated coordinate transforms; validated loop closure detection and pose graph consistency across long trajectories. Fixed noisy handheld visual odometry by mounting the ZED Mini on a rolling chair, which stabilized loop closure.',
      result: 'Mapped 250 m of GPS-denied underground tunnel under low-texture conditions, achieving 90% alignment to the ground truth tunnel layout in real time.',
      metrics: [
        { num: '90%', label: 'ground truth alignment' },
        { num: 'Real HW', label: 'ZED Mini · LiDAR · VectorNav IMU' },
        { num: 'Online', label: 'real-time loop closure + pose graph' }
      ],
      stack: ['ROS2', 'ZED Mini', 'Visual SLAM', 'LiDAR', 'VectorNav IMU'],
      github: 'https://github.com/gautham-ramkumar/3D-Mapping-RTAB',
      video: 'https://www.youtube.com/embed/Wk166Gxu5-o'
    }
  ],

  // Project 4: 3D Reconstruction via Structure from Motion (Category: 3D Geometry)
  [
    {
      t: '3D Reconstruction via SfM',
      lbl: 'Cost Reduction',
      val: '~70%',
      tags: ['GTSAM', 'OpenCV', 'Bundle Adj.', 'Python'],
      date: 'Oct 2025 – Nov 2025',
      situation: 'Creating accurate 3D models from collections of unordered 2D images is computationally expensive and prone to scale and gauge ambiguity.',
      action: 'Built a full incremental Structure from Motion pipeline from scratch — no high-level reconstruction utilities. Starting from 24 monocular images: SIFT features, RANSAC outlier rejection, essential matrix decomposition, triangulation, bidirectional PnP-RANSAC registration of new views, and non-linear bundle adjustment with GTSAM Huber factors and Levenberg–Marquardt optimization. Added an optional SuperPoint + LightGlue learned front end.',
      result: 'Reconstructed 5,500+ sparse 3D landmarks and cut bundle adjustment cost by ~60-70% with a final reprojection RMSE of ~3-4 pixels. Registered all 24 images to a global frame and exported COLMAP-compatible sparse models.',
      metrics: [
        { num: '~60-70%', label: 'BA cost reduction' },
        { num: '5,500+', label: 'sparse landmarks optimized' },
        { num: '~3-4 px', label: 'final reprojection RMSE' }
      ],
      stack: ['Python', 'OpenCV', 'GTSAM', 'Open3D', 'NumPy'],
      github: 'https://github.com/gautham-ramkumar/3D-Reconstruction-using-SfM',
      images: ['images/Ground_Truth.png', 'images/Pre_BA.png', 'images/Post_BA.png']
    }
  ],

  // Project 5: 3D Gaussian Splatting from Scratch (Category: 3D Geometry)
  [
    {
      t: '3D Gaussian Splatting from Scratch',
      lbl: 'PSNR @ 7.5k iters',
      val: '31.42dB',
      tags: ['Python', 'CUDA', 'COLMAP', 'Docker'],
      date: 'Jan 2026 – Mar 2026',
      situation: '3D Gaussian Splatting training recipes target large datasets; small-scale scenes overfit at standard iteration counts with no clear stopping criterion.',
      action: 'Implemented the full Gaussian optimization pipeline from scratch — densification, cloning, splitting, pruning, and adaptive parameter control — using the official EWA CUDA rasterizer for the rendering backend; monitored PSNR across checkpoints on a 24-image Buddha dataset; containerised with Docker and GitHub Actions CI/CD.',
      result: '31.42 dB PSNR and SSIM 0.9531 at 7,500 iterations. The default 30,000-iteration schedule collapses PSNR to 15.06 dB as Gaussians overfit into needle-like rendering artifacts, which informed an early-stop policy. COLMAP initialization beat custom SfM initialization by 2.49 dB PSNR at identical iteration counts.',
      metrics: [
        { num: '31.42', label: 'dB PSNR at 7,500 iterations' },
        { num: '0.9531', label: 'SSIM at 7,500 iterations' },
        { num: '+16dB', label: 'over 30k checkpoint on small dataset' }
      ],
      stack: ['Python', 'PyTorch', 'CUDA', 'COLMAP', 'Docker', 'GitHub Actions'],
      github: 'https://github.com/gautham-ramkumar/gaussian-splatting',
      video: 'https://www.youtube.com/embed/t120QEDT7Qk'
    }
  ],

  // Project 6: Semantic Color Constancy (Category: Deep Learning)
  [
    {
      t: 'Semantic Color Constancy',
      lbl: 'Color Accuracy',
      val: '+63%',
      tags: ['YOLOv8', 'PyTorch', 'COCO', 'Python'],
      date: 'Oct 2025 – Dec 2025',
      situation: 'Final project for CS7180 Advanced Perception (Northeastern). Global white balance algorithms fail under mixed or non-uniform light sources, introducing chromatic distortion.',
      action: 'Developed illumination correction conditioned on semantic object identity. Fine-tuned YOLOv8 on 5,600 COCO-derived images instead of training a detector from scratch; each detected object contributes an object-aware chromaticity prior across 80 semantic classes. Optimized the backbone for CPU inference.',
      result: 'Improved color constancy by 63% via object-aware chromaticity priors, validated across 4 lighting conditions spanning daylight to tungsten. 130 ms CPU inference per image enables GPU-free edge deployment.',
      metrics: [
        { num: '63%', label: 'color accuracy improvement' },
        { num: '130ms', label: 'CPU inference per image' },
        { num: '80', label: 'COCO categories supported' }
      ],
      stack: ['Python', 'PyTorch', 'YOLOv8', 'OpenCV', 'NumPy'],
      github: 'https://github.com/gautham-ramkumar/Semantic-Color-Constancy',
      images: ['images/Color_Constancy1.png', 'images/Color_Constancy2.png']
    }
  ],

  // Project 7: Low-Light Image Enhancement with U-Net (Category: Deep Learning)
  [
    {
      t: 'Low-Light Image Enhancement',
      lbl: 'PSNR LOLv1',
      val: '19.37 dB',
      tags: ['U-Net', 'PyTorch', 'LOLv1', 'Python'],
      date: '2025',
      situation: 'Extreme low-light conditions introduce heavy noise and poor contrast, rendering standard downstream vision detectors completely unusable.',
      action: 'Designed a U-Net pipeline for joint denoising and exposure correction on the LOLv1 benchmark. Skip connections preserve high-frequency structural detail. Loss combines L1 reconstruction with perceptual SSIM term.',
      result: 'Achieved 19.37 dB PSNR — 16.9% over the 16.57 dB baseline.',
      metrics: [
        { num: '19.37', label: 'dB PSNR on LOLv1 benchmark' },
        { num: '+16.9%', label: 'over baseline (16.57 dB)' },
        { num: 'Joint', label: 'denoising + exposure correction' }
      ],
      stack: ['Python', 'PyTorch', 'OpenCV', 'NumPy'],
      github: 'https://github.com/gautham-ramkumar/Image-Enhancement',
      images: ['images/Image_Enhancement.jpeg']
    }
  ],

  // Project 8: Real-Time Wall Surface Defect Detection (Category: Deep Learning)
  [
    {
      t: 'Wall Defect Detection',
      lbl: 'Precision',
      val: '91.9%',
      tags: ['YOLOv5', 'RealSense', 'Jetson Nano'],
      date: 'Jan 2024 – Apr 2024',
      situation: 'B.Tech capstone at VIT Chennai. Manual wall inspection is slow and inconsistent; distinguishing cosmetic surface flaws from structural defects requires depth information not available from RGB alone.',
      action: 'Annotated a custom 1,300-image dataset covering cracks, bubbles, dents, and scratches via LabelImg and Roboflow; fine-tuned YOLOv5 and deployed on NVIDIA Jetson Nano; integrated Intel RealSense D435 depth data for 3D localisation of each detected defect.',
      result: '91.9% precision and 0.97 recall at real-time speeds on the Jetson Nano, holding 0.986 AP on the primary defect class across two classes under variable-lighting field conditions. 3D defect localisation enables classification of surface vs. structural damage.',
      metrics: [
        { num: '91.9%', label: 'precision · 0.97 recall on Jetson Nano' },
        { num: '0.986', label: 'AP on the primary defect class' },
        { num: '1,300', label: 'custom annotated images' }
      ],
      stack: ['Python', 'YOLOv5', 'NVIDIA Jetson Nano', 'Intel RealSense', 'Roboflow'],
      github: 'https://github.com/gautham-ramkumar/Wall-Detection-using-YOLOv5',
      video: 'https://www.youtube.com/embed/y-EcAAwTE80'
    }
  ],

  // Project 9: HZD Bipedal Gait Control (Category: Control & Manipulation)
  [
    {
      t: 'HZD Bipedal Gait Control',
      lbl: 'Walking Speed',
      val: '1.73 m/s',
      tags: ['MATLAB', 'HZD', 'fmincon', '2026'],
      date: 'Jan 2026 – May 2026',
      situation: 'Course project for EECE7398 Legged Robotics (Northeastern), built in a team of 4. Classical ZMP-based biped controllers suppress the leg\'s natural pendulum dynamics to stay upright, producing slow, energetically expensive gaits. Designing a provably stable walking cycle for an underactuated 3-link planar biped remains a hard hybrid-control problem.',
      action: 'Derived full swing-phase Lagrangian dynamics and a heel-strike impact map symbolically; imposed 4th-order Bézier virtual constraints to reduce the system onto a 2-DOF Hybrid Zero Dynamics manifold; optimized the periodic orbit with fmincon for minimum control effort; synthesized an exact input-output feedback linearization controller and validated it with a 15-step full-order simulation and Poincaré return-map analysis.',
      result: 'Closed-loop walking at ≈1.73 m/s with Mechanical Cost of Transport 1.1584. Poincaré error decayed geometrically over 15 steps, confirming exponential orbital stability of the designed limit cycle. Written up as an IEEE-format conference-style report.',
      metrics: [
        { num: '1.73 m/s', label: 'closed-loop walking speed' },
        { num: '1.1584', label: 'Mechanical Cost of Transport' },
        { num: '15 steps', label: 'full-order sim, Poincaré-stable' }
      ],
      stack: ['MATLAB', 'HZD', 'Feedback Linearization', 'fmincon', 'ode45', 'Bézier Virtual Constraints'],
      github: 'https://github.com/gautham-ramkumar/hzd-biped-control',
      images: ['images/HZD_anim_snapshot.png', 'images/HZD_trajectories.png', 'images/HZD_phase.png']
    }
  ],

  // Project 10: YesChef — Voice-Controlled Robotic Sandwich Assembly (Category: Control & Manipulation)
  [
    {
      t: 'YesChef — Voice-Controlled Sandwich Assembly',
      lbl: 'Hackathon',
      val: '2nd Place',
      tags: ['Whisper', 'Qwen', 'VLM', 'Aug 2026'],
      date: 'Aug 2026',
      situation: 'A robot that assembles a sandwich from a spoken request has to understand the request, see the workspace, and act — without cloud APIs that add latency and privacy risk. Built and shipped in one weekend at the Revolute Hackathon.',
      action: 'Chained Whisper (speech-to-text), Qwen2.5-3B (instruction parsing and planning) and Qwen2.5-VL-3B (scene understanding) into trajectory execution on a 6-DoF arm, all on-device on an NVIDIA Jetson Orin Nano, using LeRobot and SocketCAN. Constrained the 3B-parameter VLM to require legible on-package text before authorizing any pick. Fixed a leader-arm unwrap fault by rescaling gripper directions from 6.0 to 3.0, spreading 270° of travel across 90°.',
      result: 'Won 2nd place at the Revolute Hackathon (Aug 1–2 2026) with a working voice-controlled sandwich-assembly demo running three local models in the loop.',
      metrics: [
        { num: '2nd', label: 'place at Revolute Hackathon' },
        { num: '3 models', label: 'Whisper → Qwen2.5-3B → Qwen2.5-VL-3B' },
        { num: 'On-device', label: 'Jetson Orin Nano, no cloud APIs' }
      ],
      stack: ['Python', 'Whisper', 'Qwen2.5-3B', 'Qwen2.5-VL-3B', 'LeRobot', 'SocketCAN', 'Jetson Orin Nano'],
      video: 'https://www.youtube.com/embed/7AaO0o-qSSI',
      demo: 'https://youtu.be/7AaO0o-qSSI'
    }
  ],

  // Project 11: Backstop — Runtime Failure Prediction for VLA Policies (Category: Robot Learning)
  [
    {
      t: 'Backstop — Runtime Failure Prediction for VLA Policies',
      lbl: 'Earlier Stop',
      val: '0.67 s',
      tags: ['VLA', 'SmolVLA', 'LIBERO', 'Aug 2026'],
      date: 'Aug 2026 – Present',
      situation: 'Vision-Language-Action policies map camera images and a language instruction straight to robot actions, and they fail silently: closing the gripper on air, then stalling until a timeout. A frozen policy offers no built-in signal for when its next actions should not be trusted.',
      action: 'Built Backstop, a supervisory layer that watches a frozen SmolVLA policy (HuggingFaceVLA/smolvla_libero) in LIBERO simulation and decides whether to trust its next actions, without modifying or retraining the policy. Recorded a LeRobot dataset keeping the full 50-step action chunk and K=4 sampled chunks per step across perturbation families (lighting, camera, object pose, distractors, action noise, absent or paraphrased language). The headline guard combines action-chunk disagreement with a stopwatch, with thresholds set from good runs only under a 5% false-stop budget; an OWLv2 missing-object gate checks the scene before the arm moves. Shipped the online guard in Python plus a header-only C++17 port.',
      result: 'Reproduced a 70.0% SmolVLA baseline on LIBERO-Spatial (100 episodes; all 30 failures are stalls at the 280-step cap). The guard ends failing runs 13.4 steps (0.67 s) sooner than a stopwatch on average at a 4.3% held-out false-stop rate (5% budget), catching every failure across 20 random splits. The OWLv2 gate stops 28 of 30 absent-object runs before the arm moves, and the C++17 port is bit-identical to Python over 500 episodes. A recovery behaviour (lift, back off, retry) did not help: it rescued 1 of 19 failures, as the policy returned to the same stall.',
      metrics: [
        { num: '0.67 s', label: 'earlier stop than a stopwatch (13.4 steps)' },
        { num: '4.3%', label: 'held-out false-stop under a 5% budget' },
        { num: '28/30', label: 'absent-object runs stopped before the arm moves' }
      ],
      stack: ['Python', 'LeRobot', 'MuJoCo', 'LIBERO', 'SmolVLA', 'C++17'],
      github: 'https://github.com/gautham-ramkumar/Backstop_VLA'
    }
  ],

  // Project 12: MirrorGuard — Physics-Based Mirror Detection (Category: Robot Learning)
  [
    {
      t: 'MirrorGuard — Physics-Based Mirror Detection',
      lbl: 'Mirror Verified',
      val: '7/7',
      tags: ['Unitree G1', 'Isaac Sim', 'Stereo', 'In progress'],
      date: '2026 – Present',
      situation: 'Stereo depth and LiDAR see a mirror as a doorway into a believable phantom room, so the planner drives straight into it; learned mirror detectors and VLMs get fooled too. In progress, in simulation.',
      action: 'Interrogate, don\'t classify: a Unitree G1 performs a random sequence of single-limb moves and checks the suspect region against its own proprioception for three reflection signatures (chirality, synchrony and trajectory match). A randomization test against 999 surrogate sequences gives an exact p-value (α = 0.01), with up to 3 rounds combined via Fisher\'s method. Verdicts are MIRROR, REAL_AGENT, LAGGED, NO_CORRESPONDENCE or INCONCLUSIVE, failing safe to "obstacle"; motion gating returns a retry when more than 60% of motion is not explained by the robot\'s own moves. For navigation, head stereo (OpenCV SGBM) feeds an occupancy grid; a "depth behind a known wall" trigger sends the robot to 1.5 m to verify, then the mirror is stored as solid and the path replanned with A*.',
      result: 'In NVIDIA Isaac Sim 6.2 house runs, the guarded robot verified the mirror in one round in 7 of 7 runs (p = 0.001, ~14 s from trigger to verdict) with no false triggers, while the unguarded robot crashed into the mirror in 3 of 5 runs. Simulation only so far; currently fixing head-camera shake, where a waving arm jolts the body enough to swamp the arm signal.',
      metrics: [
        { num: '7/7', label: 'guarded runs verified in one round (p = 0.001)' },
        { num: '~14 s', label: 'trigger to verdict, no false triggers' },
        { num: '3 of 5', label: 'unguarded runs crashed into the mirror' }
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
  ]
];

// Grouping indices in catData for category selection drawer
export const categoryGroups = [
  {
    title: 'Deep Learning',
    color: '#5eead4',
    indices: [0, 6, 7, 8]
  },
  {
    title: '3D Geometry',
    color: '#c9a227',
    indices: [1, 4, 5]
  },
  {
    title: 'State Estimation',
    color: '#9b8ce0',
    indices: [2]
  },
  {
    title: 'SLAM',
    color: '#e8846f',
    indices: [3]
  },
  {
    title: 'Control & Manipulation',
    color: '#6db3f2',
    indices: [9, 10]
  },
  {
    title: 'Robot Learning',
    color: '#8cc084',
    indices: [11, 12]
  }
];

// Featured project indices to show on the main menu's right side showcase panel (4 projects)
export const featuredProjectIndices = [5, 0, 3, 8]; // 3DGS, DarkSight, RTAB SLAM, Wall Defect

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
    desc: 'Grew automated test coverage from 44 to 145 tests across a two-job CI pipeline. Reproduced a 70% SmolVLA task-success baseline in MuJoCo on an 8 GB GPU with pinned dependencies. Built a dataset verifier that catches three silent defects (zeroed chunks, wrong state convention, missing unnormalization), and Backstop, a VLA failure monitor reaching 85.4% detection at 2.9% false-stop on held-out episodes.'
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
