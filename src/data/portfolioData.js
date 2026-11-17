const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";
const SI = "https://cdn.simpleicons.org";
const icon = (name, variant = "original") =>
  `${DEVICON}/${name}/${name}-${variant}.svg`;

/* --- Professional Icon Mapping — Local Verified Assets --- */
const TECH_ICONS = {
  // Languages & Core
  "Python": "/symbols/python.png",
  "C": "/symbols/c.svg",
  "C++": "/symbols/cplusplus.svg",
  "C/C++": "/symbols/cplusplus.svg",
  "Java": "/symbols/java.png",
  "JavaScript": "/symbols/javascript.png",
  "Bash": "/symbols/bash.svg",

  // Web & UI
  "HTML": icon("html5"),
  "HTML5": icon("html5"),
  "CSS": icon("css3"),
  "CSS3": icon("css3"),
  "React": icon("react"),
  "Tailwind CSS": icon("tailwindcss"),

  // Databases & Infrastructure
  "PostgreSQL": icon("postgresql"),
  "MongoDB": icon("mongodb"),
  "Git": icon("git"),
  "GitHub": icon("github"),
  "Linux": "/symbols/ubuntu.svg",
  "Ubuntu": "/symbols/ubuntu.svg",

  // IoT & Embedded
  "Arduino": icon("arduino"),
  "IoT Sensors": SI + "/sensirion/D4D4D4",
  "Embedded C": "/symbols/c.svg",
};

export const getIconByTech = (tech) => TECH_ICONS[tech] || null;

export const personalInfo = {
  name: "Paari Mannan M",
  firstName: "Paari",
  lastName: "Mannan M",
  eyebrow: "Meet the engineer",
  title: "Systems & IoT Engineer · Backend Developer",
  email: "paarimannanm@gmail.com",
  phone: "+91 9626324287",
  location: "Punjab, India",
  linkedin: "https://www.linkedin.com/in/paari-mannan",
  github: "https://github.com/Paari-Mannan-M",
  resumeUrl: "/Paari-Resume.pdf",
  bio: "Computer Science engineering undergraduate at Lovely Professional University. Strengthening core systems programming through hands-on C++ and DSA implementations, while engineering connected IoT telemetry and data-driven software solutions.",
  hook: "He builds resilient software architectures and connected IoT intelligence — turning sensor data and core algorithms into dependable systems.",
  roles: [
    "Systems Programmer",
    "IoT Developer",
    "Backend Engineer",
    "Problem Solver",
  ],
};

export const marqueeWords = [
  "C++ Systems",
  "Data Structures & Algorithms",
  "IoT Telemetry",
  "Embedded Architecture",
  "PostgreSQL & MongoDB",
  "Python Automation",
  "Arduino Prototyping",
  "Real-Time Monitoring",
  "Backend Engineering",
  "Algorithmic Problem Solving"
];

export const about = {
  summary:
    "B.Tech Computer Science student at Lovely Professional University with a sharp focus on foundational engineering. I combine deep algorithmic understanding in C++ and Python with hands-on IoT hardware-software integration to build real-world monitoring solutions.",
  highlights: [
    { label: "B.Tech CGPA", value: "7.27", suffix: "", description: "Lovely Professional University" },
    { label: "Secondary / High", value: "78.08", suffix: "%", description: "Velammal Bodhi Campus" },
    { label: "Core Arsenal", value: "8", suffix: "+", description: "Languages, IoT & Databases" },
    { label: "Industry Credentials", value: "2", suffix: "", description: "Simplilearn & Coursera" },
  ],
  education: [
    {
      degree: "B.Tech — Computer Science & Engineering",
      institution: "Lovely Professional University",
      location: "Phagwara, Punjab",
      period: "Aug 2025 — Present",
      score: "CGPA: 7.27",
    },
    {
      degree: "Higher Secondary Education (XII)",
      institution: "Velammal Bodhi Campus",
      location: "Theni, Tamil Nadu",
      period: "June 2024 — Mar 2025",
      score: "Percentage: 78.08%",
    },
    {
      degree: "Secondary Education (X)",
      institution: "Velammal Bodhi Campus",
      location: "Theni, Tamil Nadu",
      period: "Jun 2022 — Mar 2023",
      score: "Percentage: 78.08%",
    },
  ],
};

export const services = [
  {
    title: "IoT & Embedded Telemetry",
    description:
      "Integrating hardware sensors with Arduino and microcontrollers to capture real-time physical telemetry, execute firmware logic in C, and dispatch health anomalies.",
    icon: "📡",
    tools: ["Arduino", "IoT Sensors", "C"],
  },
  {
    title: "Algorithms & Systems",
    description:
      "Implementing high-performance algorithms, graph traversals, and dynamic data structures in C++ to achieve predictable memory efficiency and computational speed.",
    icon: "⚡",
    tools: ["C++", "C", "DSA"],
  },
  {
    title: "Backend & Data Pipelines",
    description:
      "Architecting clean relational schemas in PostgreSQL and dynamic document models in MongoDB, paired with Python backend services for reliable data persistence.",
    icon: "🗄️",
    tools: ["PostgreSQL", "MongoDB", "Python"],
  },
  {
    title: "Interactive Web Interfaces",
    description:
      "Creating modern, accessible web dashboards with clean HTML5, CSS3, and JavaScript to visualize complex telemetry data and system metrics in real time.",
    icon: "🌐",
    tools: ["HTML5", "CSS3", "JavaScript"],
  },
];

export const skills = [
  {
    category: "Languages",
    items: [
      { name: "Python", icon: TECH_ICONS["Python"], level: 85 },
      { name: "C", icon: TECH_ICONS["C"], level: 82 },
      { name: "C++", icon: TECH_ICONS["C++"], level: 80 },
      { name: "Java", icon: TECH_ICONS["Java"], level: 72 },
      { name: "JavaScript", icon: TECH_ICONS["JavaScript"], level: 70 },
      { name: "Bash", icon: TECH_ICONS["Bash"], level: 65 },
    ],
  },
  {
    category: "IoT & Hardware",
    items: [
      { name: "Arduino", icon: TECH_ICONS["Arduino"], level: 85 },
      { name: "IoT Sensors", icon: TECH_ICONS["IoT Sensors"], level: 80 },
      { name: "Embedded C", icon: TECH_ICONS["Embedded C"], level: 82 },
    ],
  },
  {
    category: "Databases & Storage",
    items: [
      { name: "PostgreSQL", icon: TECH_ICONS["PostgreSQL"], level: 75 },
      { name: "MongoDB", icon: TECH_ICONS["MongoDB"], level: 70 },
    ],
  },
  {
    category: "Tools & Workflow",
    items: [
      { name: "Git", icon: TECH_ICONS["Git"], level: 85 },
      { name: "GitHub", icon: TECH_ICONS["GitHub"], level: 88 },
      { name: "Linux", icon: TECH_ICONS["Linux"], level: 75 },
    ],
  },
  {
    category: "Web & Frontend",
    items: [
      { name: "HTML5", icon: TECH_ICONS["HTML5"], level: 88 },
      { name: "CSS3", icon: TECH_ICONS["CSS3"], level: 84 },
      { name: "JavaScript", icon: TECH_ICONS["JavaScript"], level: 72 },
    ],
  },
];

export const experience = [
  {
    title: "Technical Learning & Development",
    org: "Lovely Professional University",
    period: "Aug 2026 — Dec 2026",
    type: "Academic Track",
    points: [
      "Strengthening core programming fundamentals through hands-on C++ and Data Structures & Algorithms implementations.",
      "Building and maintaining active software repositories on GitHub to establish disciplined Git version-control workflows.",
      "Developing analytical problem-solving skills through algorithmic design patterns, time-space complexity optimization, and memory profiling.",
    ],
    tech: ["C++", "C", "DSA", "GitHub", "Problem Solving"],
  },
];

export const projects = [
  {
    title: "Animal Health Monitoring System",
    subtitle: "Real-Time IoT Health Telemetry",
    description:
      "End-to-end IoT animal health monitoring system engineered with Arduino microcontrollers, hardware sensors, and an embedded C telemetry pipeline. Continuously samples vital physiological markers, establishes dynamic baseline norms, and triggers real-time visual alerts on a web dashboard whenever metrics exceed clinical thresholds.",
    tech: ["C", "IoT Sensors", "Arduino", "HTML", "CSS", "JavaScript", "Database"],
    github: "https://github.com/Paari-Mannan-M",
    date: "Feb 2026 — Apr 2026",
    featured: true,
  },
  {
    title: "DSA & Algorithmic Toolchain",
    subtitle: "High-Performance Data Structures in C++",
    description:
      "A rigorous collection of classical and modern computer science algorithms developed in C++ and C. Implements trees, heaps, graph traversals, and dynamic programming patterns with focus on minimal memory overhead and optimal computational complexity.",
    tech: ["C++", "C", "Algorithms", "Git"],
    github: "https://github.com/Paari-Mannan-M",
    date: "2025 — Present",
    featured: true,
  },
];

export const certifications = [
  {
    name: "Generative AI for Beginners",
    org: "Simplilearn",
    description:
      "Fundamental certification covering foundational Large Language Models (LLMs), prompt engineering paradigms, generative transformer architectures, and practical ethical considerations in deploying AI solutions.",
    year: "Mar 2026",
    featured: true,
    tier: "elite",
    topics: [
      "Generative AI Architectures",
      "Large Language Models (LLMs)",
      "Prompt Engineering",
      "Model Inference & Tuning",
      "AI Ethics & Governance",
    ],
  },
  {
    name: "Java App Development: Fundamentals, OOP & File I/O",
    org: "Coursera",
    description:
      "In-depth object-oriented software engineering course validating competencies in core Java, polymorphism, encapsulation, robust exception handling, and enterprise file input/output stream management.",
    year: "Dec 2025",
    featured: true,
    tier: "professional",
    topics: [
      "Object-Oriented Programming (OOP)",
      "Java Class Hierarchy & Interfaces",
      "File I/O & Stream Handling",
      "Exception Handling Architectures",
      "Memory Allocation & Garbage Collection",
    ],
  },
];

export const achievements = [
  {
    title: "IoT Health Telemetry Pipeline",
    stat: "Verified",
    description: "Designed and deployed real-time animal physiological monitoring with alert triggers",
    date: "Apr 2026",
  },
  {
    title: "Algorithmic Foundations",
    stat: "LPU Track",
    description: "Consistent practical C++ implementations of fundamental data structures on GitHub",
    date: "Dec 2026",
  },
];

/**
 * segmentNarrations — third-person narration beats overlaid on each scroll-video
 * segment. Each beat has a `range` expressed as [start, end] in 0..1 of the
 * *local* progress within its segment (NOT the global scroll). Beats fade in
 * at `range[0]`, hold, and fade out approaching `range[1]`.
 */
export const segmentNarrations = [
  {
    segment: 0,
    beats: [
      {
        id: "sa1-training",
        eyebrow: "01 · Core Focus",
        title: "Systems & DSA · LPU",
        body:
          "He is strengthening foundational software engineering through disciplined hands-on C++ and Data Structures & Algorithms implementations — architecting clean, algorithmic solutions under rigorous version control on GitHub.",
        range: [0.04, 0.34],
      },
      {
        id: "sa1-iot",
        eyebrow: "02 · Engineering",
        title: "Animal Health Telemetry",
        body:
          "He engineered an end-to-end IoT monitoring pipeline with Arduino and multi-sensor telemetry — tracking animal physiological markers in real time and firing proactive alert dispatches the moment parameters drift beyond safe thresholds.",
        range: [0.36, 0.66],
      },
      {
        id: "sa1-academia",
        eyebrow: "03 · Academia",
        title: "Lovely Professional University",
        body:
          "He is pursuing his Bachelor of Technology in Computer Science & Engineering at LPU, Punjab — holding a CGPA of 7.27 alongside foundational engineering credentials from Velammal Bodhi Campus (78.08%).",
        range: [0.68, 1.0],
      },
    ],
  },
  {
    segment: 1,
    beats: [
      {
        id: "sa2-projects-1",
        range: [0.04, 0.46],
        panels: {
          left: {
            eyebrow: "01 · Featured Project",
            title: "Animal Health Monitoring",
            titleHref: "https://github.com/Paari-Mannan-M",
            body:
              "Real-time IoT animal vitals tracking system in C and Arduino with alert thresholds, multi-sensor calibration, and live web telemetry.",
          },
          right: {
            eyebrow: "02 · Featured Project",
            title: "DSA & Algorithmic Toolchain",
            titleHref: "https://github.com/Paari-Mannan-M",
            body:
              "High-performance implementations of graph traversals, dynamic programming, and balanced tree structures written in modern C++ and C.",
          },
        },
      },
      {
        id: "sa2-projects-2",
        range: [0.54, 0.86],
        shiftY: -110,
        panels: {
          left: {
            eyebrow: "03 · Technical Credential",
            title: "Java OOP & Stream Engine",
            titleHref: "https://github.com/Paari-Mannan-M",
            body:
              "Structured object-oriented architectures certified by Coursera — utilizing strict encapsulation, robust exception handling, and persistent file I/O pipelines.",
          },
          right: {
            eyebrow: "04 · AI Foundation",
            title: "Generative AI Systems",
            titleHref: "https://github.com/Paari-Mannan-M",
            body:
              "Simplilearn certified grounding in Large Language Model (LLM) architectures, prompt engineering pipelines, and foundational machine intelligence.",
          },
        },
      },
    ],
  },
];

/**
 * skillsReveal — "inside the brain" reveal that plays during SA3's pre-hold.
 */
export const skillsReveal = {
  segmentIndex: 2,
  groups: [
    {
      id: "languages",
      title: "Programming Languages",
      range: [0.04, 0.11],
      items: [
        { name: "Python", icon: "/symbols/python.png" },
        { name: "C", icon: "/symbols/c.svg" },
        { name: "C++", icon: "/symbols/cplusplus.svg" },
        { name: "Java", icon: "/symbols/java.png" },
        { name: "JavaScript", icon: "/symbols/javascript.png" },
        { name: "Bash", icon: "/symbols/bash.svg" },
      ],
    },
    {
      id: "iot-embedded",
      title: "IoT & Hardware Telemetry",
      range: [0.12, 0.18],
      items: [
        { name: "Arduino" },
        { name: "Embedded C", icon: "/symbols/c.svg" },
        { name: "Analog & Digital Sensors" },
        { name: "Microcontroller Firmware" },
        { name: "Real-Time Telemetry" },
        { name: "Serial Protocols" },
      ],
    },
    {
      id: "web-ui",
      title: "Web Technologies & Interfaces",
      range: [0.19, 0.26],
      items: [
        { name: "HTML5" },
        { name: "CSS3" },
        { name: "JavaScript", icon: "/symbols/javascript.png" },
        { name: "Responsive UI" },
        { name: "Telemetry Dashboards" },
        { name: "DOM Manipulation" },
      ],
    },
    {
      id: "databases",
      title: "Databases & Storage",
      range: [0.27, 0.33],
      items: [
        { name: "PostgreSQL" },
        { name: "MongoDB" },
        { name: "Relational Schema Design" },
        { name: "Document Stores" },
        { name: "CRUD Operations" },
        { name: "Data Persistence" },
      ],
    },
    {
      id: "dev-tools",
      title: "Developer Tools & Version Control",
      range: [0.34, 0.40],
      items: [
        { name: "Git" },
        { name: "GitHub" },
        { name: "Linux / Ubuntu", icon: "/symbols/ubuntu.svg" },
        { name: "VS Code" },
        { name: "Command Line / Bash", icon: "/symbols/bash.svg" },
      ],
    },
    {
      id: "foundations",
      title: "Core Foundations & Strengths",
      range: [0.41, 0.50],
      items: [
        { name: "Data Structures" },
        { name: "Algorithm Analysis" },
        { name: "Object-Oriented Programming" },
        { name: "Problem Solving" },
        { name: "Adaptability" },
        { name: "Team Collaboration" },
      ],
    },
  ],
};

/**
 * heroFooter — end-of-page content that fades in during SA3's tail.
 */
export const heroFooter = {
  segmentIndex: 2,
  revealAt: 0.82,
  fadeIn: 0.025,
  nextMove: {
    eyebrow: "Next Move",
    title: "Systems & Engineering Roadmap",
    path: [
      { code: "C++", tier: "foundation" },
      { code: "DSA", tier: "target" },
      { code: "IoT", tier: "web" },
      { code: "Backend", tier: "exploit" },
      { code: "Distributed", tier: "advanced" },
      { code: "SWE", tier: "apex" },
    ],
    description:
      "Progressing from fundamental C++ systems and hardware IoT telemetry into high-throughput distributed backends and enterprise software engineering.",
  },
  contacts: {
    left: [
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/paari-mannan",
        display: "linkedin.com/in/paari-mannan",
        external: true,
      },
      {
        label: "GitHub",
        href: "https://github.com/Paari-Mannan-M",
        display: "github.com/Paari-Mannan-M",
        external: true,
      },
    ],
    right: [
      {
        label: "Email",
        href: "mailto:paarimannanm@gmail.com",
        display: "paarimannanm@gmail.com",
        external: false,
      },
      {
        label: "Phone",
        href: "tel:+919626324287",
        display: "+91 9626324287",
        external: false,
      },
    ],
  },
};

export const heroChapters = [
  {
    id: "01",
    label: "Identity",
    title: "Paari Mannan M",
    subtitle: "Systems & IoT Engineer · Backend Developer",
    description:
      "Computer Science undergraduate at LPU specializing in C++, algorithmic problem solving, and IoT embedded telemetry.",
    range: [0.0, 0.22],
  },
  {
    id: "02",
    label: "Core Training",
    title: "Technical Learning & DSA",
    subtitle: "Lovely Professional University",
    description:
      "Strengthening fundamental programming with hands-on C++ implementations and active GitHub software repositories.",
    range: [0.22, 0.44],
  },
  {
    id: "03",
    label: "Flagship Engineering",
    title: "Animal Health Monitoring",
    subtitle: "IoT Sensors · Arduino · Embedded C · Telemetry",
    description:
      "Real-time vital tracking with automated threshold detection, anomaly alerts, and clean web telemetry dashboards.",
    range: [0.44, 0.64],
  },
  {
    id: "04",
    label: "Core Arsenal",
    title: "Languages & Databases",
    subtitle: "Python · C · C++ · Java · PostgreSQL · MongoDB",
    description:
      "Versatile software engineering toolchain spanning embedded hardware, relational databases, and modern web interfaces.",
    range: [0.64, 0.84],
  },
  {
    id: "05",
    label: "Open For Roles",
    title: "Engage The Brief",
    subtitle: "Software Engineering Intern · Systems Developer",
    description:
      "Available for software engineering internships, backend development roles, and collaborative systems research.",
    range: [0.84, 1.0],
  },
];

export const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Focus", href: "#services" },
  { label: "Credentials", href: "#certifications" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];
