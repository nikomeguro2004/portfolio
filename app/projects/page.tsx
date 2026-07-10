'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { animate, stagger } from 'animejs';
import { AnimatePresence, motion } from 'framer-motion';
import { MagneticButton, MagneticCard } from '../components/MagneticInteractions';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import { projects, type Project } from './projectData';

function ProjectsHeader({
  headerRef,
  totalProjects,
  activeProjects,
}: {
  headerRef: React.RefObject<HTMLDivElement | null>;
  totalProjects: number;
  activeProjects: number;
}) {
  return (
    <div ref={headerRef} className="mb-14">
      <Link
        href="/"
        className="projects-intro group mb-8 inline-flex items-center gap-2 text-sm opacity-0 transition-colors hover:text-cyan-400"
        style={{ color: 'var(--text-tertiary)' }}
      >
        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </Link>

      <p className="projects-intro mb-3 text-xs uppercase tracking-[0.2em] opacity-0" style={{ color: 'var(--text-tertiary)' }}>
        Project Portfolio · Latest to Oldest
      </p>

      <h1 className="projects-intro mb-4 text-4xl font-bold tracking-tight opacity-0 md:text-6xl">
        <span className="text-gradient">Projects</span>
      </h1>

      <p className="projects-intro max-w-3xl text-lg opacity-0" style={{ color: 'var(--text-secondary)' }}>
        A selection of production projects with scope, implementation details, and delivery outcomes.
      </p>

      <div className="projects-intro mt-5 rounded-xl border border-cyan-300/20 bg-slate-950/60 p-3 opacity-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-400" />
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-[11px] uppercase tracking-[0.14em] text-cyan-200/85">Projects Overview</span>
          </div>
          <span className="text-[10px] uppercase tracking-[0.12em] text-indigo-200/80">Portfolio</span>
        </div>
      </div>

      <div className="projects-intro mt-8 grid gap-3 opacity-0 sm:grid-cols-2">
        <div className="rounded-xl border border-cyan-400/20 bg-cyan-500/5 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.16em]" style={{ color: 'var(--text-tertiary)' }}>Total Projects</p>
          <p className="mt-2 text-2xl font-bold text-white">{totalProjects}</p>
        </div>
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/5 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.16em]" style={{ color: 'var(--text-tertiary)' }}>Live / Active</p>
          <p className="mt-2 text-2xl font-bold text-white">{activeProjects}</p>
        </div>
      </div>
    </div>
  );
}

function ProjectNavigator({
  visibleProjects,
  activeProjectIndex,
  progressRatio,
  onSelectProject,
}: {
  visibleProjects: Project[];
  activeProjectIndex: number;
  progressRatio: number;
  onSelectProject: (index: number) => void;
}) {
  return (
    <aside className="hidden self-start md:sticky md:top-28 md:block md:h-fit">
      <div className="rounded-xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm md:max-h-[calc(100dvh-8rem)] md:overflow-y-auto">
        <p className="mb-2 text-xs uppercase tracking-[0.16em]" style={{ color: 'var(--text-tertiary)' }}>Project Navigator</p>
        <div className="mb-4">
          <div className="mb-2 h-1.5 rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-linear-to-r from-cyan-300 to-indigo-300 transition-all duration-300"
              style={{ width: `${Math.max(progressRatio * 100, 5)}%` }}
            />
          </div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-cyan-200/80">
            {Math.min(activeProjectIndex + 1, visibleProjects.length)} / {visibleProjects.length}
          </p>
        </div>
        <div className="space-y-3">
          {visibleProjects.map((project, index) => (
            <button
              key={project.title}
              className="block text-left transition-colors"
              onClick={() => onSelectProject(index)}
              style={{
                color: index <= activeProjectIndex ? 'var(--text-primary)' : 'var(--text-tertiary)',
              }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em]">{project.period.split('–')[0].trim()}</p>
              <p className="text-sm">{project.title}</p>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

function ProjectStatusPill({ status }: { status: Project['status'] }) {
  const statusClass =
    status === 'In Progress'
      ? 'bg-amber-500/15 text-amber-400'
      : status === 'Live'
        ? 'bg-emerald-500/15 text-emerald-400'
        : 'bg-white/5 text-white/50';

  return <span className={`px-2.5 py-1 rounded text-xs font-medium ${statusClass}`}>{status}</span>;
}

function ProjectTimelineCard({
  project,
  index,
  isHovered,
  cardActive,
  onHover,
  onLeave,
}: {
  project: Project;
  index: number;
  isHovered: boolean;
  cardActive: boolean;
  onHover: (projectTitle: string) => void;
  onLeave: () => void;
}) {
  const isLive = project.status === 'Live' || project.status === 'In Progress';

  return (
    <motion.div
      key={project.title}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
    >
      <MagneticCard
        className="project-card relative overflow-hidden transition-all duration-300"
        rotationStrength={1.8}
        onMouseEnter={() => onHover(project.title)}
        onMouseLeave={onLeave}
        style={{
          boxShadow: isLive ? `0 0 ${isHovered ? 48 : 24}px rgba(56, 189, 248, 0.1)` : 'none',
          borderColor: cardActive ? 'rgba(94, 234, 212, 0.36)' : undefined,
        }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{
          background: cardActive
            ? 'radial-gradient(circle at 88% 16%, rgba(56, 189, 248, 0.16), transparent 44%)'
            : 'radial-gradient(circle at 88% 16%, rgba(56, 189, 248, 0.08), transparent 40%)',
        }} />

        <div className="absolute right-3 top-3 rounded border border-white/10 bg-black/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-300">
          Project {String(index + 1).padStart(2, '0')}
        </div>

        <div className="absolute right-3 top-11">
          <ProjectStatusPill status={project.status} />
        </div>

        <div className="relative">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-4 pr-24">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-white">{project.title}</h2>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full bg-cyan-500/15 px-2.5 py-1 text-xs font-semibold text-cyan-400 transition-all hover:scale-105 hover:bg-cyan-500/25 group"
                        style={{ pointerEvents: 'auto' }}
                      >
                        Open
                        <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-medium text-cyan-400">{project.subtitle}</p>
                  <p className="mt-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>{project.period}</p>
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

            <ul className="mb-5 space-y-2">
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
            {project.image && (
              <div className="md:w-5/12 shrink-0 mt-4 md:mt-0 relative group rounded-xl overflow-hidden border border-white/10 aspect-video md:aspect-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              </div>
            )}
          </div>
        </div>
      </MagneticCard>
    </motion.div>
  );
}

function ProjectsCta() {
  return (
    <div className="mt-20 text-center">
      <p className="text-xl font-semibold mb-3 text-white">Need systems that scale?</p>
      <p className="text-sm mb-6" style={{ color: 'var(--text-tertiary)' }}>
        From architecture to deployment, I build for production.
      </p>
      <MagneticButton href="mailto:adihere2000@gmail.com" className="btn-primary" strength={0.2}>
        Start a Conversation
      </MagneticButton>
    </div>
  );
}

export default function ProjectsPage() {
  const sortedProjects = useMemo(() => [...projects].sort((a, b) => b.orderKey - a.orderKey), []);
  const headerRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const backdropRefSecondary = useRef<HTMLDivElement>(null);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const visibleProjects = sortedProjects;
  const resolvedActiveProjectIndex = Math.min(activeProjectIndex, Math.max(visibleProjects.length - 1, 0));

  const handleNavigatorSelect = (index: number) => {
    if (!projectsRef.current) return;
    const cards = Array.from(projectsRef.current.children) as HTMLElement[];
    const card = cards[index];
    if (!card) return;
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  useEffect(() => {
    if (headerRef.current) {
      animate(headerRef.current.querySelectorAll('.projects-intro'), {
        translateY: [30, 0],
        opacity: [0, 1],
        delay: stagger(80, { start: 120 }),
        duration: 620,
        ease: 'out(3)',
      });
    }

    if (projectsRef.current?.children.length) {
      animate(projectsRef.current.children, {
        translateY: [24, 0],
        opacity: [0, 1],
        scale: [0.985, 1],
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
    };

    updateTimelineProgress();
    window.addEventListener('scroll', updateTimelineProgress, { passive: true });
    window.addEventListener('resize', updateTimelineProgress);

    return () => {
      window.removeEventListener('scroll', updateTimelineProgress);
      window.removeEventListener('resize', updateTimelineProgress);
    };
  }, [visibleProjects.length]);

  useEffect(() => {
    if (!backdropRef.current) return;
    animate(backdropRef.current, {
      translateX: [-40, 50],
      translateY: [20, -18],
      duration: 10000,
      direction: 'alternate',
      loop: true,
      ease: 'inOutSine',
    });
  }, []);

  useEffect(() => {
    if (!backdropRefSecondary.current) return;
    animate(backdropRefSecondary.current, {
      translateX: [30, -42],
      translateY: [-24, 32],
      duration: 12000,
      direction: 'alternate',
      loop: true,
      ease: 'inOutSine',
    });
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <SiteNav />

      <div className="pointer-events-none fixed inset-0 opacity-35" style={{
        backgroundImage:
          'linear-gradient(to right, rgba(56, 189, 248, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(129, 140, 248, 0.05) 1px, transparent 1px)',
        backgroundSize: '72px 72px',
        maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 85%)',
      }} />

      <div
        ref={backdropRef}
        className="fixed pointer-events-none transition-all duration-500"
        style={{
          width: '620px',
          height: '620px',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.14) 0%, transparent 70%)',
          top: '60px',
          left: '-180px',
          filter: 'blur(72px)',
        }}
      />

      <div
        ref={backdropRefSecondary}
        className="fixed pointer-events-none transition-all duration-500"
        style={{
          width: '540px',
          height: '540px',
          background: 'radial-gradient(circle, rgba(129, 140, 248, 0.16) 0%, transparent 70%)',
          top: '34%',
          right: '-190px',
          filter: 'blur(78px)',
        }}
      />

      <div className="pt-16 pb-24">
        <div className="container">
          <ProjectsHeader
            headerRef={headerRef}
            totalProjects={sortedProjects.length}
            activeProjects={sortedProjects.filter((project) => project.status !== 'Completed').length}
          />

          <div className="grid items-start gap-7 md:grid-cols-[230px_minmax(0,1fr)]">
            <ProjectNavigator
              visibleProjects={visibleProjects}
              activeProjectIndex={resolvedActiveProjectIndex}
              progressRatio={visibleProjects.length ? (resolvedActiveProjectIndex + 1) / visibleProjects.length : 0}
              onSelectProject={handleNavigatorSelect}
            />

            <div ref={projectsRef} className="space-y-7">
              {!visibleProjects.length && (
                <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-8 text-center">
                  <p className="text-lg font-semibold text-white">No projects available</p>
                  <p className="mt-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    Add project data to begin rendering the timeline.
                  </p>
                </div>
              )}

              {visibleProjects.map((project, index) => {
                return (
                  <ProjectTimelineCard
                    key={project.title}
                    project={project}
                    index={index}
                    isHovered={hoveredProject === project.title}
                    cardActive={index === resolvedActiveProjectIndex}
                    onHover={setHoveredProject}
                    onLeave={() => setHoveredProject(null)}
                  />
                );
              })}
            </div>
          </div>

          <ProjectsCta />
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
