'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagneticButton, MagneticCard } from '../components/MagneticEffects';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: 'CuiSync',
    subtitle: 'Restaurant Management Platform',
    period: 'Nov 2025 – Present',
    status: 'In Progress',
    priority: 'flagship', // Visual hierarchy
    description: 'Real-time restaurant operations platform with role-based access, offline-tolerant workflows, and cross-device synchronization.',
    highlights: [
      'Multi-role access control with auditable operations',
      'Real-time sync with local persistence fallback',
      'Cross-platform Flutter & Next.js interfaces',
    ],
    techStack: ['Flutter', 'Next.js', 'SQLite', 'Supabase', 'TypeScript'],
  },
  {
    title: 'SivaComics',
    subtitle: 'Comic Publishing Platform',
    period: 'Oct 2025 – Jan 2026',
    status: 'Live',
    priority: 'flagship',
    description: 'Web-based comic publishing platform optimized for performance, SEO, and scalable content delivery.',
    highlights: [
      'SSR with OpenGraph and JSON-LD metadata',
      'AWS S3 + CloudFront asset delivery',
      'Optimized rendering for media-heavy content',
    ],
    techStack: ['Next.js', 'React', 'Tailwind CSS', 'AWS S3', 'CloudFront'],
    link: 'https://sivacomics.com',
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
  },
  {
    title: 'WaterPlant Management',
    subtitle: 'Monitoring & Analytics System',
    period: 'Jun – Aug 2025',
    status: 'Completed',
    priority: 'standard',
    description: 'Desktop application for operational monitoring, real-time dashboards, and automated report generation.',
    highlights: [
      'Event-driven PyQt5 desktop interface',
      'Sub-second refresh real-time dashboards',
      'Automated PDF reports with Pandas ETL',
    ],
    techStack: ['Python', 'PyQt5', 'SQLite', 'Pandas', 'ReportLab'],
  },
  {
    title: 'Site Risk Analyzer',
    subtitle: 'Browser Security Extension',
    period: 'Mar – Apr 2025',
    status: 'Completed',
    priority: 'standard',
    description: 'Chrome extension for website security analysis using heuristic and ML-assisted classification.',
    highlights: [
      'Real-time DOM and JavaScript analysis',
      'Phishing detection with URL reputation checks',
      'Explainable rule-backed risk scoring',
    ],
    techStack: ['JavaScript', 'Python', 'Chrome APIs', 'ML Classification'],
  },
  {
    title: 'Support Chatbot',
    subtitle: 'RAG-Powered Assistant',
    period: 'Sep – Oct 2025',
    status: 'Completed',
    priority: 'standard',
    description: 'Retrieval-augmented conversational AI for domain-specific queries from structured knowledge sources.',
    highlights: [
      'Vector embeddings for semantic retrieval',
      'Query expansion and context management',
      'Optimized latency for interactive usage',
    ],
    techStack: ['Node.js', 'Express', 'Faiss', 'RAG', 'LLM APIs'],
  },
];

export default function ProjectsPage() {
  const headerRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  useEffect(() => {
    // 4. ORB AS SECTION STATE: Intensity changes based on scroll position
    if (orbRef.current) {
      gsap.to(orbRef.current, {
        x: -30,
        y: 20,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      
      // Orb intensity changes on scroll
      ScrollTrigger.create({
        trigger: projectsRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          if (orbRef.current) {
            const intensity = 0.08 + self.progress * 0.12;
            orbRef.current.style.background = `radial-gradient(circle, rgba(56, 189, 248, ${intensity}) 0%, transparent 70%)`;
          }
        },
      });
    }

    // Header animation
    gsap.fromTo(headerRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 }
    );

    // 1. DIRECTIONAL NARRATIVE: Projects enter from depth with scale
    gsap.fromTo('.project-card',
      { y: 30, opacity: 0, scale: 0.96 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        stagger: 0.12,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: projectsRef.current,
          start: 'top 85%',
        },
      }
    );

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  // 2 & 3. Get card properties based on priority
  const getCardProps = (project: typeof projects[0]) => {
    const isLive = project.status === 'Live' || project.status === 'In Progress';
    const isFlagship = project.priority === 'flagship';
    
    return {
      // 2. VISUAL HIERARCHY: Flagship projects get stronger treatment
      rotationStrength: isFlagship ? 3 : 1.5,
      glowIntensity: isLive ? 0.15 : 0.05,
      scale: isFlagship ? 1 : 0.98,
    };
  };

  return (
    <div className="min-h-screen relative">
      {/* 4. Ambient Orb - reacts to scroll */}
      <div
        ref={orbRef}
        className="fixed pointer-events-none transition-all duration-500"
        style={{
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)',
          top: '100px',
          left: '-100px',
          filter: 'blur(50px)',
        }}
      />

      <div className="pt-16 pb-24">
        <div className="container">
          {/* Header */}
          <div ref={headerRef} className="mb-16">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm mb-8 transition-colors hover:text-cyan-400 group"
              style={{ color: 'var(--text-tertiary)' }}
            >
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              <span className="text-gradient">Projects</span>
            </h1>

            <p className="text-lg max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
              Systems built for scale, performance, and real-world impact.
            </p>
          </div>

          {/* Projects with visual hierarchy */}
          <div ref={projectsRef} className="space-y-6">
            {projects.map((project) => {
              const cardProps = getCardProps(project);
              const isHovered = hoveredProject === project.title;
              const isLive = project.status === 'Live' || project.status === 'In Progress';
              const isFlagship = project.priority === 'flagship';
              
              return (
                <MagneticCard 
                  key={project.title} 
                  className={`project-card relative overflow-hidden transition-all duration-300 ${
                    isFlagship ? 'border-cyan-500/20' : ''
                  }`}
                  rotationStrength={cardProps.rotationStrength}
                  onMouseEnter={() => setHoveredProject(project.title)}
                  onMouseLeave={() => setHoveredProject(null)}
                  style={{
                    // 2. Flagship projects: stronger glow
                    boxShadow: isLive 
                      ? `0 0 ${isHovered ? 40 : 20}px rgba(56, 189, 248, ${cardProps.glowIntensity})`
                      : 'none',
                  }}
                >
                  {/* 5. SIGNATURE INTERACTION: Hover reveals system role */}
                  {isHovered && isFlagship && (
                    <div 
                      className="absolute top-3 right-3 px-2 py-1 rounded text-xs font-medium bg-cyan-500/10 text-cyan-400 animate-pulse"
                    >
                      Flagship Project
                    </div>
                  )}
                  
                  <div className="flex flex-col lg:flex-row lg:gap-8">
                    {/* Main Content */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                          {/* 8. "VISIT" LINK prominent for live products */}
                          <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-white">{project.title}</h2>
                            {project.link && (
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-400 hover:bg-cyan-500/25 transition-all hover:scale-105 group"
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

                      <p className="mb-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {project.description}
                      </p>

                      {/* 6. HIGHLIGHTS: Bolder, fewer, as claims */}
                      <ul className="space-y-2 mb-5">
                        {project.highlights.map((item, i) => (
                          <li key={i} className="flex gap-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                            <span className="text-cyan-400 font-bold">→</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      {/* 7. TECH STACK: Reduced opacity, let description talk */}
                      <div className="flex flex-wrap items-center gap-2">
                        {project.techStack.map((tech) => (
                          <span 
                            key={tech} 
                            className="skill-badge text-xs opacity-60 hover:opacity-100 transition-opacity"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </MagneticCard>
              );
            })}
          </div>

          {/* 9. CTA: Decisive, confident tone */}
          <div className="mt-20 text-center">
            <p className="text-xl font-semibold mb-3 text-white">
              Need systems that scale?
            </p>
            <p className="text-sm mb-6" style={{ color: 'var(--text-tertiary)' }}>
              From architecture to deployment, I build for production.
            </p>
            <MagneticButton href="mailto:adihere2000@gmail.com" className="btn-primary" strength={0.2}>
              Start a Conversation
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* 10. Footer with subtle motion cue */}
      <footer className="py-8 border-t group" style={{ borderColor: 'var(--border)' }}>
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              © {new Date().getFullYear()} S Adityan
            </p>
            <Link 
              href="/"
              className="text-sm transition-all hover:text-cyan-400 group/link flex items-center gap-2"
              style={{ color: 'var(--text-tertiary)' }}
            >
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
