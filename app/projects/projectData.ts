export type Project = {
  title: string;
  subtitle: string;
  period: string;
  status: 'In Progress' | 'Live' | 'Completed';
  priority: 'flagship' | 'standard';
  description: string;
  highlights: string[];
  techStack: string[];
  link?: string;
  orderKey: number;
};

export const projects = [
  {
    title: 'Cursor Interaction Surface',
    subtitle: 'Shader-Driven Interaction Instrument',
    period: 'Mar 2026',
    status: 'Live',
    priority: 'flagship',
    description:
      'Fullscreen cursor-reactive visual surface powered by GPU simulation, where motion injects force and pigment into a living fluid-like field.',
    highlights: [
      'Ping-pong render target simulation with persistent temporal memory across frames',
      'Cursor velocity and activity drive force, energy, and pigment deposition in real time',
      'Three-pass pipeline for field simulation, color advection/diffusion, and final lit displacement rendering',
    ],
    techStack: ['Next.js 16', 'React 19', 'Three.js', 'GLSL', 'TypeScript'],
    link: 'https://liquid-ui-kappa.vercel.app/',
    orderKey: 202604,
  },
  {
    title: 'Triangle Field Sandbox',
    subtitle: 'Matter.js Physics Laboratory',
    period: 'Mar 2026',
    status: 'Live',
    priority: 'flagship',
    description:
      'Interaction-first physics sandbox focused on collision quality, controlled triangle fragmentation, and stable high-load performance.',
    highlights: [
      'Adaptive physics/render budgeting to keep frame pacing stable under heavy collision load',
      'Energy-based collision response with glow/particle feedback and rate-limited triangle fracturing',
      'Mobile-aware optimization with coarse-pointer DPR caps, visibility pause/resume, and deterministic debris cleanup',
    ],
    techStack: ['Next.js', 'TypeScript', 'Matter.js', 'HTML5 Canvas 2D', 'Physics Simulation'],
    link: 'https://matter-lab.vercel.app/',
    orderKey: 202603,
  },
  {
    title: 'CuiSync',
    subtitle: 'Restaurant Management Platform',
    period: 'Nov 2025 – Present',
    status: 'In Progress',
    priority: 'flagship',
    description:
      'Real-time restaurant operations platform with role-based access, offline-tolerant workflows, and cross-device synchronization.',
    highlights: [
      'Multi-role access control with auditable operations',
      'Real-time sync with local persistence fallback',
      'Cross-platform Flutter & Next.js interfaces',
    ],
    techStack: ['Flutter', 'Next.js', 'SQLite', 'Supabase', 'TypeScript'],
    orderKey: 202611,
  },
  {
    title: 'SivaComics',
    subtitle: 'Comic Publishing Platform',
    period: 'Oct 2025 – Jan 2026',
    status: 'Live',
    priority: 'flagship',
    description: 'Web-based comic publishing platform optimized for performance, SEO, and scalable content delivery.',
    highlights: ['SSR with OpenGraph and JSON-LD metadata', 'AWS S3 + CloudFront asset delivery', 'Optimized rendering for media-heavy content'],
    techStack: ['Next.js', 'React', 'Tailwind CSS', 'AWS S3', 'CloudFront'],
    link: 'https://sivacomics.com',
    orderKey: 202601,
  },
  {
    title: 'EssayRaccoon',
    subtitle: 'UPSC Essay Preparation',
    period: 'Jan 2026 – Feb 2026',
    status: 'Live',
    priority: 'flagship',
    description: 'Educational platform for UPSC aspirants with curated resources, video content, and subscription access.',
    highlights: [
      'Supabase-backed CMS with daily publishing',
      'Razorpay subscription integration',
      'Subdomain architecture for multi-tenant content',
    ],
    techStack: ['Next.js', 'Supabase', 'Vercel', 'Razorpay'],
    link: 'https://essayraccoon.com',
    orderKey: 202602,
  },
  {
    title: 'WaterPlant Management',
    subtitle: 'Monitoring & Analytics System',
    period: 'Jun – Aug 2025',
    status: 'Completed',
    priority: 'standard',
    description: 'Desktop application for operational monitoring, real-time dashboards, and automated report generation.',
    highlights: ['Event-driven PyQt5 desktop interface', 'Sub-second refresh real-time dashboards', 'Automated PDF reports with Pandas ETL'],
    techStack: ['Python', 'PyQt5', 'SQLite', 'Pandas', 'ReportLab'],
    orderKey: 202508,
  },
  {
    title: 'Site Risk Analyzer',
    subtitle: 'Browser Security Extension',
    period: 'Mar – Apr 2025',
    status: 'Completed',
    priority: 'standard',
    description: 'Chrome extension for website security analysis using heuristic and ML-assisted classification.',
    highlights: ['Real-time DOM and JavaScript analysis', 'Phishing detection with URL reputation checks', 'Explainable rule-backed risk scoring'],
    techStack: ['JavaScript', 'Python', 'Chrome APIs', 'ML Classification'],
    orderKey: 202504,
  },
  {
    title: 'Support Chatbot',
    subtitle: 'RAG-Powered Assistant',
    period: 'Sep – Oct 2025',
    status: 'Completed',
    priority: 'standard',
    description: 'Retrieval-augmented conversational AI for domain-specific queries from structured knowledge sources.',
    highlights: ['Vector embeddings for semantic retrieval', 'Query expansion and context management', 'Optimized latency for interactive usage'],
    techStack: ['Node.js', 'Express', 'Faiss', 'RAG', 'LLM APIs'],
    orderKey: 202510,
  },
] satisfies Project[];
