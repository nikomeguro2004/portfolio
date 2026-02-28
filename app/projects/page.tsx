'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { animate, stagger } from 'animejs';
import { AnimatePresence, motion } from 'framer-motion';
import { MagneticButton, MagneticCard } from '../components/MagneticEffects';
import ProjectMilestoneDeck from '../components/ProjectMilestoneDeck';

type Project = {
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

const projects = [
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

export default function ProjectsPage() {
  const sortedProjects = useMemo(() => [...projects].sort((a, b) => b.orderKey - a.orderKey), []);
  const headerRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const ambientGlowRef = useRef<HTMLDivElement>(null);
  const timelineProgressRef = useRef<HTMLDivElement>(null);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);

  useEffect(() => {
    if (headerRef.current) {
      animate(headerRef.current.querySelectorAll('.atlas-intro'), {
        translateY: [40, 0],
        opacity: [0, 1],
        delay: stagger(80, { start: 120 }),
        duration: 680,
        ease: 'out(3)',
      });
    }

    if (projectsRef.current?.children.length) {
      animate(projectsRef.current.children, {
        translateY: [24, 0],
        opacity: [0, 1],
        scale: [0.97, 1],
        delay: stagger(90, { start: 260 }),
        duration: 580,
        ease: 'out(3)',
      });
    }
  }, []);

  useEffect(() => {
    const updateTimelineProgress = () => {
      if (!projectsRef.current) return;
      const cards = Array.from(projectsRef.current.children) as HTMLElement[];
      if (!cards.length) return;

      const viewportCenter = window.innerHeight * 0.42;
      let closestIndex = 0;
      let minDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const distance = Math.abs(cardCenter - viewportCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      setActiveProjectIndex(closestIndex);

      if (timelineProgressRef.current) {
        const progress = cards.length > 1 ? closestIndex / (cards.length - 1) : 1;
        animate(timelineProgressRef.current, {
          height: `${Math.max(8, progress * 100)}%`,
          duration: 260,
          ease: 'out(3)',
        });
      }
    };

    updateTimelineProgress();
    window.addEventListener('scroll', updateTimelineProgress, { passive: true });
    window.addEventListener('resize', updateTimelineProgress);

    return () => {
      window.removeEventListener('scroll', updateTimelineProgress);
      window.removeEventListener('resize', updateTimelineProgress);
    };
  }, [sortedProjects.length]);

  useEffect(() => {
    if (!ambientGlowRef.current) return;

    animate(ambientGlowRef.current, {
      translateX: [-24, 32],
      translateY: [24, -12],
      duration: 11000,
      direction: 'alternate',
      loop: true,
      ease: 'inOutSine',
    });

    const updateIntensity = () => {
      if (!ambientGlowRef.current || !projectsRef.current) return;
      const rect = projectsRef.current.getBoundingClientRect();
      const viewport = window.innerHeight;
      const visibleStart = Math.max(0, viewport - rect.top);
      const visibleProgress = Math.min(Math.max(visibleStart / (viewport + rect.height), 0), 1);
      const intensity = 0.08 + visibleProgress * 0.12;
      ambientGlowRef.current.style.background = `radial-gradient(circle, rgba(56, 189, 248, ${intensity}) 0%, transparent 70%)`;
    };

    updateIntensity();
    window.addEventListener('scroll', updateIntensity, { passive: true });
    window.addEventListener('resize', updateIntensity);

    return () => {
      window.removeEventListener('scroll', updateIntensity);
      window.removeEventListener('resize', updateIntensity);
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        ref={ambientGlowRef}
        className="fixed pointer-events-none transition-all duration-500"
        style={{
          width: '540px',
          height: '540px',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)',
          top: '120px',
          left: '-140px',
          filter: 'blur(62px)',
        }}
      />
      <div className="fixed inset-0 pointer-events-none opacity-20" style={{
        backgroundImage:
          'linear-gradient(to right, rgba(94, 234, 212, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(129, 140, 248, 0.06) 1px, transparent 1px)',
        backgroundSize: '52px 52px',
        maskImage: 'radial-gradient(circle at 50% 40%, black 10%, transparent 78%)',
      }} />

      <div className="pt-16 pb-24">
        <div className="container">
          <div ref={headerRef} className="mb-14">
            <Link
              href="/"
              className="atlas-intro inline-flex items-center gap-2 text-sm mb-8 transition-colors hover:text-cyan-400 group opacity-0"
              style={{ color: 'var(--text-tertiary)' }}
            >
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>

            <p className="atlas-intro text-xs uppercase tracking-[0.2em] mb-3 opacity-0" style={{ color: 'var(--text-tertiary)' }}>
              Project Atlas · Latest to Oldest
            </p>

            <h1 className="atlas-intro text-4xl md:text-6xl font-bold mb-4 tracking-tight opacity-0">
              <span className="text-gradient">Projects</span>
            </h1>

            <p className="atlas-intro text-lg max-w-3xl opacity-0" style={{ color: 'var(--text-secondary)' }}>
              A timeline of production systems, ranked by recency. Each chapter captures what was built, why it mattered, and how it scales.
            </p>

            <div className="atlas-intro mt-8 grid gap-3 sm:grid-cols-3 opacity-0">
              <div className="rounded-xl border border-cyan-400/20 bg-cyan-500/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em]" style={{ color: 'var(--text-tertiary)' }}>Total Projects</p>
                <p className="mt-2 text-2xl font-bold text-white">{sortedProjects.length}</p>
              </div>
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em]" style={{ color: 'var(--text-tertiary)' }}>Live / Active</p>
                <p className="mt-2 text-2xl font-bold text-white">{sortedProjects.filter((project) => project.status !== 'Completed').length}</p>
              </div>
              <div className="rounded-xl border border-indigo-400/20 bg-indigo-500/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em]" style={{ color: 'var(--text-tertiary)' }}>Flagship Builds</p>
                <p className="mt-2 text-2xl font-bold text-white">{sortedProjects.filter((project) => project.priority === 'flagship').length}</p>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <ProjectMilestoneDeck />
          </div>

          <div className="grid lg:grid-cols-[220px_1fr] gap-7 items-start">
            <aside className="hidden lg:block sticky top-28">
              <div className="rounded-xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.16em] mb-4" style={{ color: 'var(--text-tertiary)' }}>Timeline</p>
                <div className="relative pl-4">
                  <div className="absolute left-0 top-0 h-full w-[2px] rounded-full bg-white/10 overflow-hidden">
                    <div
                      ref={timelineProgressRef}
                      className="w-full rounded-full bg-linear-to-b from-cyan-300 via-sky-400 to-indigo-400"
                      style={{ height: '8%' }}
                    />
                  </div>
                  <div className="space-y-3">
                    {sortedProjects.map((project, index) => (
                      <button
                        key={project.title}
                        className="block text-left transition-colors"
                        style={{
                          color: index <= activeProjectIndex ? 'var(--text-primary)' : 'var(--text-tertiary)',
                          pointerEvents: 'none',
                        }}
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.12em]">{project.period.split('–')[0].trim()}</p>
                        <p className="text-sm">{project.title}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            <div ref={projectsRef} className="space-y-7">
              {sortedProjects.map((project, index) => {
              const isHovered = hoveredProject === project.title;
              const isLive = project.status === 'Live' || project.status === 'In Progress';
              const isFlagship = project.priority === 'flagship';
              const cardActive = index === activeProjectIndex;

              return (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.04 }}
                >
                  <MagneticCard
                    className={`project-card relative overflow-hidden transition-all duration-300 ${isFlagship ? 'border-cyan-500/20' : ''}`}
                    rotationStrength={isFlagship ? 3.2 : 1.8}
                    onMouseEnter={() => setHoveredProject(project.title)}
                    onMouseLeave={() => setHoveredProject(null)}
                    style={{
                      boxShadow: isLive ? `0 0 ${isHovered ? 48 : 24}px rgba(56, 189, 248, ${isFlagship ? 0.16 : 0.08})` : 'none',
                      borderColor: cardActive ? 'rgba(94, 234, 212, 0.36)' : undefined,
                    }}
                  >
                    <div className="absolute inset-0 pointer-events-none" style={{
                      background: cardActive
                        ? 'radial-gradient(circle at 88% 16%, rgba(56, 189, 248, 0.16), transparent 44%)'
                        : 'radial-gradient(circle at 88% 16%, rgba(56, 189, 248, 0.08), transparent 40%)',
                    }} />

                    <div className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-[0.14em] px-2 py-1 rounded bg-black/30 border border-white/10 text-cyan-300">
                      Chapter {String(index + 1).padStart(2, '0')}
                    </div>

                    <div className="relative flex flex-col lg:flex-row lg:gap-8">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-3">
                              <h2 className="text-xl font-bold text-white">{project.title}</h2>
                              {project.link && (
                                <a
                                  href={project.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-400 hover:bg-cyan-500/25 transition-all hover:scale-105 group"
                                  style={{ pointerEvents: 'auto' }}
                                >
                                  Live
                                  <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </a>
                              )}
                            </div>
                            <p className="text-cyan-400 text-sm font-medium mt-1">{project.subtitle}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-2.5 py-1 rounded text-xs font-medium ${
                                project.status === 'In Progress'
                                  ? 'bg-amber-500/15 text-amber-400'
                                  : project.status === 'Live'
                                    ? 'bg-emerald-500/15 text-emerald-400'
                                    : 'bg-white/5 text-white/50'
                              }`}
                            >
                              {project.status}
                            </span>
                            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                              {project.period}
                            </span>
                          </div>
                        </div>

                        <AnimatePresence mode="wait">
                          <motion.p
                            key={`${project.title}-${cardActive ? 'active' : 'idle'}`}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.22 }}
                            className="mb-4 text-sm leading-relaxed"
                            style={{ color: cardActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                          >
                            {project.description}
                          </motion.p>
                        </AnimatePresence>

                        <ul className="space-y-2 mb-5">
                          {project.highlights.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex gap-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                              <span className="text-cyan-400 font-bold">→</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="flex flex-wrap items-center gap-2">
                          {project.techStack.map((tech) => (
                            <span key={tech} className="skill-badge text-xs opacity-70 hover:opacity-100 transition-opacity">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </MagneticCard>
                </motion.div>
              );
            })}
            </div>
          </div>

          <div className="mt-20 text-center">
            <p className="text-xl font-semibold mb-3 text-white">Need systems that scale?</p>
            <p className="text-sm mb-6" style={{ color: 'var(--text-tertiary)' }}>
              From architecture to deployment, I build for production.
            </p>
            <MagneticButton href="mailto:adihere2000@gmail.com" className="btn-primary" strength={0.2}>
              Start a Conversation
            </MagneticButton>
          </div>
        </div>
      </div>

      <footer className="py-8 border-t group" style={{ borderColor: 'var(--border)' }}>
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              © {new Date().getFullYear()} S Adityan
            </p>
            <Link href="/" className="text-sm transition-all hover:text-cyan-400 group/link flex items-center gap-2" style={{ color: 'var(--text-tertiary)' }}>
              <svg className="w-4 h-4 transition-transform group-hover/link:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
