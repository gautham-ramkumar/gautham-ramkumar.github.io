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
      val: '21 FPS',
      tags: ['PyTorch', 'TensorRT', 'Zero-3DCE', 'YOLOv8'],
      date: '2025 – Present',
      situation: 'Robotic perception pipelines fail in sub-1 lux environments; off-the-shelf enhancement tools optimise for human aesthetics and lack temporal coherence across video frames.',
      action: 'Designed DS3DConv encoder-decoder with ConvGRU recurrent bottleneck for frame memory, RAFT optical-flow warping for temporal consistency, and a perception-aware loss tuned to YOLOv8 features; exported to TensorRT INT8/FP16 for edge deployment.',
      result: '17.25 dB PSNR, 0.99 ORB stability; Deployed real-time low-light enhancement on Intel RealSense D435 with adaptive frame skipping, achieving 57ms inference latency at 21 FPS (360p, PyTorch backend); TensorRT engine exported for production deployment.',
      metrics: [
        { num: '21 FPS', label: 'at 360p · PyTorch backend · TensorRT export' },
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
      situation: 'Camera-LiDAR sensor fusion requires sub-millisecond temporal synchronization; manual target-based calibration is tedious and cannot adapt to dynamic online sensor latency.',
      action: 'Implemented a stamp-primary temporal sync pipeline with a bounded residual path. The system anchors on stable hardware capture timestamps (tau_stamp) and then lets cross-modal edge alignment correct a small, plausible latency bias (tau_res), avoiding failure modes from scene-driven aliasing.',
      result: 'Estimated a stable -19.49 ms offset on the huntington dataset (1500 camera frames, 750 LiDAR scans). The bounded residual approach prevented large >150 ms swings seen in naive unconstrained edge-score searches.',
      metrics: [
        { num: '-19.49ms', label: 'time offset estimated' },
        { num: '±50ms', label: 'bounded residual clip' },
        { num: '1.5ms', label: 'stability across windows' }
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
      action: 'Deployed RTAB-Map on a ZED Mini stereo camera in ROS2; brought up a full multi-sensor suite (LiDAR, VectorNav IMU) with calibrated coordinate transforms; validated loop closure detection and pose graph consistency across long trajectories.',
      result: 'Achieved 90% alignment to ground truth tunnel layout in real-time, fully GPS-denied conditions.',
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
      date: '2025',
      situation: 'Creating accurate 3D models from collections of unordered 2D images is computationally expensive and prone to scale and gauge ambiguity.',
      action: 'Built a full Structure from Motion pipeline from scratch — no high-level reconstruction utilities. Starting from 24 monocular images: SIFT features, RANSAC outlier rejection, essential matrix decomposition, triangulation, and non-linear bundle adjustment over ~5.5k landmarks via GTSAM factor graphs.',
      result: 'Achieved a ~60-70% reduction in bundle adjustment cost with a final reprojection RMSE of ~3-4 pixels. Successfully registered all 24 views and generated sparse models compatible with COLMAP GUI.',
      metrics: [
        { num: '~60-70%', label: 'BA cost reduction' },
        { num: '~5.5k', label: 'sparse landmarks optimized' },
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
      result: '31.42 dB PSNR and SSIM 0.9531 at 7,500 iterations — over 16 dB better than the 30k checkpoint where Gaussians overfit into needle-like rendering artifacts.',
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

  // Project 6: Underwater Image Mosaicing with Factor Graphs (Category: SLAM)
  [
    {
      t: 'Underwater Mosaicing',
      lbl: 'Images',
      val: '28 Frames',
      tags: ['GTSAM', 'SIFT', 'Homography', 'Python'],
      date: '2025',
      situation: 'Acoustic and optical mapping of the seabed requires stitching multiple overlapping frames; standard stitching fails in low-visibility, light-attenuated underwater conditions.',
      action: 'Developed a 2D image mosaicing pipeline for 28 underwater images using GTSAM factor graph optimization. Pairwise homographies estimated from SIFT matches; loop closure constraints on overlapping pairs eliminate accumulated drift.',
      result: 'Robust homography estimation handles low-light, feature-sparse underwater conditions, resulting in a drift-free global mosaic map.',
      metrics: [
        { num: '28', label: 'underwater images mosaiced' },
        { num: 'Zero', label: 'map drift via loop closure' },
        { num: 'GTSAM', label: 'global factor graph optimization' }
      ],
      stack: ['Python', 'GTSAM', 'OpenCV', 'NumPy'],
      github: 'https://github.com/gautham-ramkumar',
      images: ['images/Image_Stitching1.png', 'images/Image_Stitching2.png']
    }
  ],

  // Project 7: Semantic Color Constancy (Category: Deep Learning)
  [
    {
      t: 'Semantic Color Constancy',
      lbl: 'Color Accuracy',
      val: '+63%',
      tags: ['YOLOv8', 'PyTorch', 'COCO', 'Python'],
      date: '2025',
      situation: 'Global white balance algorithms fail under mixed or non-uniform light sources, introducing chromatic distortion.',
      action: 'Developed illumination correction conditioned on semantic object identity. YOLOv8 identifies each object and applies per-category chromaticity priors learned from 5,600 COCO-derived images.',
      result: 'Produces significantly more accurate correction under challenging or mixed lighting, achieving 63% color accuracy improvement.',
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

  // Project 8: Low-Light Image Enhancement with U-Net (Category: Deep Learning)
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

  // Project 9: Real-Time Wall Surface Defect Detection (Category: Deep Learning)
  [
    {
      t: 'Wall Defect Detection',
      lbl: 'Precision',
      val: '91.9%',
      tags: ['YOLOv5', 'RealSense', 'Jetson Nano'],
      date: 'Jan 2024 – Apr 2024',
      situation: 'Manual wall inspection is slow and inconsistent; distinguishing cosmetic surface flaws from structural defects requires depth information not available from RGB alone.',
      action: 'Annotated a custom 1,300-image dataset covering cracks, bubbles, dents, and scratches via LabelImg and Roboflow; fine-tuned YOLOv5 and deployed on NVIDIA Jetson Nano; integrated Intel RealSense D435 depth data for 3D localisation of each detected defect.',
      result: '91.9% precision at real-time speeds on the Jetson Nano, with 3D defect localisation enabling classification of surface vs. structural damage.',
      metrics: [
        { num: '91.9%', label: 'precision on Jetson Nano' },
        { num: '1,300', label: 'custom annotated images' },
        { num: '3D', label: 'defect localization via RealSense' }
      ],
      stack: ['Python', 'YOLOv5', 'NVIDIA Jetson Nano', 'Intel RealSense', 'Roboflow'],
      github: 'https://github.com/gautham-ramkumar',
      video: 'https://www.youtube.com/embed/y-EcAAwTE80'
    }
  ],

  // Project 10: HZD Bipedal Gait Control (Category: Control & Manipulation)
  [
    {
      t: 'HZD Bipedal Gait Control',
      lbl: 'Walking Speed',
      val: '1.73 m/s',
      tags: ['MATLAB', 'HZD', 'fmincon', '2026'],
      date: '2026',
      situation: 'Classical ZMP-based biped controllers suppress the leg\'s natural pendulum dynamics to stay upright, producing slow, energetically expensive gaits. Designing a provably stable walking cycle for an underactuated 3-link planar biped remains a hard hybrid-control problem.',
      action: 'Derived full swing-phase Lagrangian dynamics and a heel-strike impact map symbolically; imposed 4th-order Bézier virtual constraints to reduce the system onto a 2-DOF Hybrid Zero Dynamics manifold; optimized the periodic orbit with fmincon for minimum control effort; synthesized an exact input-output feedback linearization controller and validated it with a 15-step full-order simulation and Poincaré return-map analysis.',
      result: 'Closed-loop walking at ≈1.73 m/s with Mechanical Cost of Transport 1.1584. Poincaré error decayed geometrically over 15 steps, confirming exponential orbital stability of the designed limit cycle.',
      metrics: [
        { num: '1.73 m/s', label: 'closed-loop walking speed' },
        { num: '1.1584', label: 'Mechanical Cost of Transport' },
        { num: '15 steps', label: 'full-order sim, Poincaré-stable' }
      ],
      stack: ['MATLAB', 'HZD', 'Feedback Linearization', 'fmincon', 'Bézier Virtual Constraints'],
      github: 'https://github.com/gautham-ramkumar/hzd-biped-control',
      images: ['images/HZD_anim_snapshot.png', 'images/HZD_trajectories.png', 'images/HZD_phase.png']
    }
  ],

  // Project 11: YesChef — Voice-Controlled Cooking Robot (Category: Control & Manipulation)
  [
    {
      t: 'YesChef — Voice-Controlled Cooking',
      lbl: 'Hackathon',
      val: '2nd Place',
      tags: ['Whisper', 'Qwen', 'VLM', 'Aug 2026'],
      date: 'Aug 2026',
      situation: 'Cooking robots need to interpret spoken recipes, see the workspace, and act — without cloud APIs that add latency and privacy risk. The Revolute Hackathon tasked teams with making a robot cook, end to end, in a weekend.',
      action: 'Built a fully local voice-to-action pipeline: Whisper for speech-to-text, Qwen 2.5 3B as a vision-language model for scene understanding, and Qwen 2.5 3B as a language model for instruction parsing and action planning. All three models ran on-device to drive robotic manipulation for cooking tasks.',
      result: 'Won 2nd place at the Revolute Hackathon (Aug 1–2 2026) with a working voice-controlled cooking demo running three local models in the loop.',
      metrics: [
        { num: '2nd', label: 'place at Revolute Hackathon' },
        { num: '3 models', label: 'Whisper + Qwen 2.5 VLM + Qwen 2.5 LM' },
        { num: 'On-device', label: 'fully local inference, no cloud APIs' }
      ],
      stack: ['Whisper', 'Qwen 2.5 VLM', 'Qwen 2.5 LM', 'Robotic Manipulation'],
      video: 'https://www.youtube.com/embed/7AaO0o-qSSI',
      demo: 'https://youtu.be/7AaO0o-qSSI'
    }
  ]
];

// Grouping indices in catData for category selection drawer
export const categoryGroups = [
  {
    title: 'Deep Learning',
    color: '#5eead4',
    indices: [0, 7, 8, 9]
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
    indices: [3, 6]
  },
  {
    title: 'Control & Manipulation',
    color: '#6db3f2',
    indices: [10, 11]
  }
];

// Featured project indices to show on the main menu's right side showcase panel (4 projects)
export const featuredProjectIndices = [5, 0, 3, 9]; // 3DGS, DarkSight, RTAB SLAM, Wall Defect

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
    period: '2024 – 2026',
    role: 'Master of Science — Robotics',
    org: 'Northeastern University · Boston, MA',
    desc: 'Concentration in ECE. Deep focus on sensor fusion, SLAM, state estimation, and deep learning perception for autonomous systems. Coursework: Advanced Perception, Robot Sensing & Navigation, Autonomous Field Robotics, Mobile Robotics, Robot Mechanics & Controls.'
  },
  {
    period: '2023',
    role: 'IoT Engineering Intern',
    org: 'SmartInternz',
    desc: 'Built real-time sensing pipelines and cloud logging systems using IoT hardware. Hands-on work with embedded systems, sensor data acquisition, and cloud infrastructure integration.'
  },
  {
    period: '2020 – 2024',
    role: 'B.Tech — Electronics & Communications Engineering',
    org: 'Vellore Institute of Technology (VIT) · Chennai, India',
    desc: 'Foundational coursework in signal processing, embedded systems, digital communications, and electronics engineering. Final-year project in real-time defect detection using computer vision on edge hardware.'
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
      'Pose Estimation'
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
      'Loop Closure Detection'
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
      'Git'
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
      'Whisper (Speech-to-Text)'
    ]
  },
  {
    title: 'Hardware & Sensors',
    items: [
      'ZED Mini Stereo Camera',
      'LiDAR',
      'VectorNav IMU',
      'NVIDIA Jetson Nano',
      'Intel RealSense D435'
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
      'Legged Robotics (HZD)'
    ]
  }
];
