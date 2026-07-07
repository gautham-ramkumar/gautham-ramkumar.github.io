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
      val: '70ms',
      tags: ['Calibration', 'Multi-Sensor', 'C++', 'Oct 2025'],
      date: 'Oct 2025 – Dec 2025',
      situation: 'Camera-LiDAR sensor fusion requires sub-millisecond temporal synchronization; manual target-based calibration is tedious and cannot adapt to dynamic online sensor latency.',
      action: 'Estimated the real-world time offset between an unsynchronized stereo camera and LiDAR using cross-modal edge alignment. The pipeline projects LiDAR point clouds onto calibrated camera frames, computes Canny edges on both modalities, and scores alignment using distance transforms — then sweeps over candidate offsets to find the optimum.',
      result: 'Estimated 70ms offset, independently validated using Powell optimization and dense grid search cross-validation; integrated IMU preintegration to merge 3 consecutive scans to produce denser point clouds.',
      metrics: [
        { num: '70ms', label: 'time offset estimated' },
        { num: '3×', label: 'point cloud density via IMU' },
        { num: '2', label: 'validation methods' }
      ],
      stack: ['Python', 'C++', 'GTSAM', 'ROS2', 'Open3D', 'OpenCV'],
      github: 'https://github.com/gautham-ramkumar/Camera-LiDAR-Temporal-Calibration',
      images: ['images/Camera_LiDAR.png']
    }
  ],

  // Project 2: GPS–IMU Fusion via Extended Kalman Filter (Category: State Estimation)
  [
    {
      t: 'GPS–IMU Fusion via EKF',
      lbl: 'IMU Rate',
      val: '600 Hz',
      tags: ['State Estimation', 'EKF', 'Sep 2025'],
      date: 'Sep 2025 – Oct 2025',
      situation: 'Autonomous vehicles require continuous, high-rate state estimation; GNSS alone is low-rate (1-5 Hz) and prone to dropouts in urban canyons, while IMU dead reckoning drifts exponentially.',
      action: 'Developed a real-time 2D vehicle localization system that fuses a 600 Hz IMU with GNSS measurements using an Extended Kalman Filter. The prediction step propagates state using IMU kinematics; the update step incorporates GPS position measurements weighted by their uncertainty.',
      result: 'Maintains trajectory continuity via IMU-only dead reckoning with adaptive covariance inflation in GPS-denied zones (tunnels) until GPS signal is restored.',
      metrics: [
        { num: '600Hz', label: 'IMU prediction rate' },
        { num: 'EKF', label: 'prediction + update' },
        { num: 'GPS-denied', label: 'continuity via dead reckoning' }
      ],
      stack: ['Python', 'NumPy'],
      github: 'https://github.com/gautham-ramkumar/2D-EKF-using-GPS-and-IMU',
      images: ['images/EKF.png']
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
      lbl: 'BA Accuracy',
      val: '+26%',
      tags: ['GTSAM', 'OpenCV', 'Bundle Adj.', 'Python'],
      date: '2025',
      situation: 'Creating accurate 3D models from collections of unordered 2D images is computationally expensive and prone to scale and gauge ambiguity.',
      action: 'Built a full Structure from Motion pipeline from scratch — no high-level reconstruction utilities. Starting from 24 monocular images: SIFT features, RANSAC outlier rejection, essential matrix decomposition, triangulation, and non-linear bundle adjustment over 1,477 landmarks via GTSAM factor graphs.',
      result: 'Improves accuracy by 26% using bundle adjustment; enables camera localization in GPS-denied environments via PnP pose estimation.',
      metrics: [
        { num: '26%', label: 'accuracy improvement via bundle adjustment' },
        { num: '1,477', label: 'landmarks optimized via GTSAM' },
        { num: '24', label: 'monocular images as input' }
      ],
      stack: ['Python', 'OpenCV', 'GTSAM', 'Open3D', 'NumPy'],
      github: 'https://github.com/gautham-ramkumar/3D-Reconstruction-using-SfM',
      video: 'https://www.youtube.com/embed/WeK6MU-wFHA'
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
  { id: 'newgame', label: 'EXPERIENCE', subtitle: 'Profile & Timeline' },
  { id: 'resume', label: 'PROJECTS', subtitle: 'Interactive 3D Project Graph' },
  { id: 'options', label: 'TECHNICAL SKILLS', subtitle: 'Capabilities Map' },
  { id: 'exit', label: 'CONTACT', subtitle: 'Get in Touch' }
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
      'U-Net',
      '3D Convolutions',
      'ConvGRU',
      'Transfer Learning',
      'Fine-Tuning',
      'Edge Deployment',
      'Loss Function Design'
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
      'Control Systems Engineering'
    ]
  }
];
