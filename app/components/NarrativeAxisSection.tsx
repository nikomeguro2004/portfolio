'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, stagger } from 'animejs';
import { AnimatePresence, motion } from 'framer-motion';

interface Step {
  title: string;
  content: string;
  highlight: string;
  metric: { value: string; label: string };
}

interface NarrativeAxisSectionProps {
  steps: Step[];
}

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const STAGE_THEME = [
  {
    leftBg: 'linear-gradient(160deg, rgba(3, 18, 28, 0.9) 0%, rgba(3, 10, 20, 0.75) 100%)',
    rightBg: 'linear-gradient(160deg, rgba(8, 22, 36, 0.78) 0%, rgba(5, 10, 26, 0.72) 100%)',
    accent: 'rgb(103 232 249)',
    glow: 'rgba(0, 229, 255, 0.28)',
  },
  {
    leftBg: 'linear-gradient(160deg, rgba(12, 14, 36, 0.88) 0%, rgba(8, 10, 24, 0.76) 100%)',
    rightBg: 'linear-gradient(160deg, rgba(20, 14, 44, 0.76) 0%, rgba(8, 10, 26, 0.72) 100%)',
    accent: 'rgb(167 139 250)',
    glow: 'rgba(123, 97, 255, 0.3)',
  },
  {
    leftBg: 'linear-gradient(160deg, rgba(6, 24, 34, 0.9) 0%, rgba(5, 12, 26, 0.76) 100%)',
    rightBg: 'linear-gradient(160deg, rgba(8, 30, 42, 0.76) 0%, rgba(5, 12, 26, 0.72) 100%)',
    accent: 'rgb(45 212 191)',
    glow: 'rgba(45, 212, 191, 0.3)',
  },
  {
    leftBg: 'linear-gradient(160deg, rgba(20, 14, 42, 0.88) 0%, rgba(8, 10, 30, 0.76) 100%)',
    rightBg: 'linear-gradient(160deg, rgba(24, 14, 50, 0.76) 0%, rgba(8, 10, 28, 0.72) 100%)',
    accent: 'rgb(129 140 248)',
    glow: 'rgba(129, 140, 248, 0.3)',
  },
] as const;

const PROCESS_EXPLAINER: Record<string, { what: string; output: string; checkpoint: string }> = {
  discover: {
    what: 'Understand goals, scope, users, timeline, and technical constraints before writing code.',
    output: 'A clear execution brief with priorities and architecture direction.',
    checkpoint: 'Requirements approved with delivery scope locked.',
  },
  design: {
    what: 'Shape system architecture, choose the stack, and define interfaces for maintainable growth.',
    output: 'A technical blueprint and implementation sequence.',
    checkpoint: 'Architecture validated against scale and complexity.',
  },
  ship: {
    what: 'Build features in focused iterations, integrate systems, and validate quality before release.',
    output: 'Production-ready features and stable deployments.',
    checkpoint: 'Release quality gates pass in real environments.',
  },
  evolve: {
    what: 'Use analytics and reliability signals to improve performance and system behavior over time.',
    output: 'Incremental product and infrastructure improvements.',
    checkpoint: 'Measured gains in speed, reliability, and user outcomes.',
  },
};

export default function NarrativeAxisSection({ steps }: NarrativeAxisSectionProps) {
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Array<HTMLDivElement | null>>([]);

  const stageTheme = STAGE_THEME[active] ?? STAGE_THEME[0];
  const activeStep = steps[active] ?? steps[0];
  const explainer = PROCESS_EXPLAINER[activeStep.title.toLowerCase()] ?? PROCESS_EXPLAINER.discover;

  useEffect(() => {
    if (!rootRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = Number((entry.target as HTMLElement).dataset.index ?? 0);
          setActive(index);
        });
      },
      {
        threshold: 0.7,
        rootMargin: '-20% 0px -20% 0px',
      }
    );

    markersRef.current.forEach((marker) => {
      if (marker) observer.observe(marker);
    });

    return () => observer.disconnect();
  }, [steps.length]);

  useEffect(() => {
    if (!rootRef.current) return;

    const chips = rootRef.current.querySelectorAll('.process-chip');
    const points = rootRef.current.querySelectorAll('.process-point');

    animate(chips, {
      translateY: [10, 0],
      opacity: [0.4, 1],
      delay: stagger(50),
      duration: 320,
      ease: 'out(3)',
    });

    animate(points, {
      scale: [0.92, 1.06],
      opacity: [0.7, 1],
      delay: stagger(55),
      duration: 360,
      ease: 'inOut(3)',
    });
  }, [active]);

  return (
    <section className="relative min-h-[255vh] w-full px-4 py-8 sm:py-12">
      <motion.div
        className="pointer-events-none absolute left-[8%] top-[15%] h-80 w-80 rounded-full blur-3xl"
        animate={{
          background: `radial-gradient(circle, ${stageTheme.glow}, transparent 72%)`,
          scale: [1, 1.06, 1],
        }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />

      <div ref={rootRef} className="container relative">
        <div className="mb-8 rounded-3xl bg-slate-950/30 p-8 sm:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/85">Delivery Framework</p>
          <p className="mt-4 max-w-4xl text-base sm:text-2xl" style={{ color: 'var(--text-secondary)' }}>
            A simple scroll narrative of how I deliver products: discover, design, ship, and evolve.
          </p>
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0">
          {steps.map((step, index) => (
            <div
              key={`marker-${step.title}`}
              ref={(element) => {
                markersRef.current[index] = element;
              }}
              data-index={index}
              className="h-[62vh]"
              aria-hidden="true"
            />
          ))}
        </div>

        <div className="sticky top-[8vh] z-10">
          <div className="grid min-h-[82vh] gap-6 rounded-[28px] bg-black/20 p-4 backdrop-blur-sm sm:p-6 lg:grid-cols-[0.9fr_1.1fr]">
            <motion.div
              className="rounded-3xl p-7 sm:p-10"
              animate={{ background: stageTheme.leftBg }}
              transition={{ duration: 0.35, ease: smoothEase }}
              style={{ boxShadow: `inset 0 0 0 1px ${stageTheme.glow}` }}
            >
              <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-200/80">Framework Axis</p>
              <AnimatePresence mode="wait">
                <motion.h3
                  key={`axis-${activeStep.title}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: smoothEase }}
                  className="mt-4 text-4xl font-bold text-white sm:text-5xl"
                >
                  You can {activeStep.title.toLowerCase()}.
                </motion.h3>
              </AnimatePresence>

              <div className="mt-7 space-y-2">
                {steps.map((step, index) => (
                  <motion.p
                    key={step.title}
                    className="text-2xl font-semibold lowercase sm:text-3xl"
                    animate={{
                      opacity: index === active ? 1 : 0.4,
                      x: index === active ? 0 : -7,
                    }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    style={{ color: index === active ? stageTheme.accent : 'rgba(148,163,184,0.68)' }}
                  >
                    {step.title.toLowerCase()}.
                  </motion.p>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-2.5">
                {steps.map((step, index) => (
                  <button
                    key={`chip-${step.title}`}
                    type="button"
                    onClick={() => markersRef.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                    className="process-chip rounded-md bg-slate-950/55 px-3 py-1.5 text-xs uppercase tracking-[0.12em]"
                    style={{
                      color: index === active ? stageTheme.accent : 'rgba(230, 237, 243, 0.72)',
                      boxShadow: index === active ? `0 0 0 1px ${stageTheme.glow}` : 'inset 0 0 0 1px rgba(255,255,255,0.08)',
                    }}
                  >
                    {String(index + 1).padStart(2, '0')} {step.title}
                  </button>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-2.5">
                {steps.map((step, index) => (
                  <motion.span
                    key={`dot-${step.title}`}
                    className="process-point h-3 w-3 rounded-full"
                    animate={{
                      scale: index === active ? 1.2 : 1,
                      opacity: index === active ? 1 : 0.55,
                    }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    style={{
                      background: index === active ? stageTheme.accent : 'rgba(56,189,248,0.55)',
                      boxShadow: index === active ? `0 0 14px ${stageTheme.glow}` : 'none',
                    }}
                  />
                ))}
              </div>
            </motion.div>

            <motion.div
              className="rounded-3xl p-7 sm:p-10"
              animate={{ background: stageTheme.rightBg }}
              transition={{ duration: 0.35, ease: smoothEase }}
              style={{ boxShadow: `inset 0 0 0 1px ${stageTheme.glow}` }}
            >
              <p className="text-sm uppercase tracking-[0.18em]" style={{ color: stageTheme.accent }}>
                {activeStep.highlight}
              </p>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`step-content-${activeStep.title}`}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.24, ease: smoothEase }}
                >
                  <h3 className="mt-3 text-4xl font-bold text-white sm:text-5xl">{activeStep.title}</h3>
                  <p className="mt-4 text-base leading-relaxed sm:text-xl" style={{ color: 'var(--text-secondary)' }}>
                    {activeStep.content}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-black/24 p-4">
                  <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--text-tertiary)' }}>What happens</p>
                  <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>{explainer.what}</p>
                </div>
                <div className="rounded-2xl bg-black/24 p-4">
                  <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--text-tertiary)' }}>Output</p>
                  <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>{explainer.output}</p>
                </div>
                <div className="rounded-2xl bg-black/24 p-4">
                  <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--text-tertiary)' }}>Checkpoint</p>
                  <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>{explainer.checkpoint}</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {steps.map((step, index) => (
                  <motion.div
                    key={`${step.title}-metric`}
                    className="rounded-xl bg-slate-950/55 px-4 py-4 text-center"
                    animate={{
                      y: index === active ? -3 : 0,
                      opacity: index === active ? 1 : 0.72,
                    }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    style={{ boxShadow: index === active ? `0 0 0 1px ${stageTheme.glow}` : 'inset 0 0 0 1px rgba(255,255,255,0.08)' }}
                  >
                    <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--text-tertiary)' }}>Stage</p>
                    <p className="mt-1 text-2xl font-semibold" style={{ color: index === active ? stageTheme.accent : 'var(--text-secondary)' }}>
                      {step.metric.value}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--text-tertiary)' }}>
                      {step.metric.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
