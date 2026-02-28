'use client';

import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';

interface Step {
  title: string;
  content: string;
  highlight: string;
  metric: { value: string; label: string };
}

interface PinnedEvolutionSectionProps {
  steps: Step[];
}

const FALLBACK_STAGES: Step[] = [
  {
    title: 'Discover',
    content: 'Define goals, scope, user journeys, and delivery constraints before implementation.',
    highlight: 'Requirements and planning',
    metric: { value: '01', label: 'Discovery' },
  },
  {
    title: 'Design',
    content: 'Select stack and architecture patterns for scalability and maintainability.',
    highlight: 'Architecture and stack selection',
    metric: { value: '02', label: 'Design' },
  },
  {
    title: 'Ship',
    content: 'Build and release production features with integration and quality controls.',
    highlight: 'Implementation and release',
    metric: { value: '03', label: 'Delivery' },
  },
  {
    title: 'Evolve',
    content: 'Iterate through telemetry, optimization, and reliability improvements.',
    highlight: 'Optimization and scale',
    metric: { value: '04', label: 'Optimization' },
  },
];

const STAGE_COLORS = ['#67E8F9', '#A78BFA', '#2DD4BF', '#818CF8'] as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function PinnedEvolutionSection({ steps }: PinnedEvolutionSectionProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stages = useMemo(() => (steps.length >= 4 ? steps.slice(0, 4) : FALLBACK_STAGES), [steps]);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 26,
    mass: 0.7,
  });

  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(smoothProgress, 'change', (value) => {
    const next = clamp(Math.floor(value * stages.length), 0, stages.length - 1);
    setActiveIndex((prev) => (prev === next ? prev : next));
  });

  const activeStage = stages[activeIndex] ?? stages[0];
  const activeColor = STAGE_COLORS[activeIndex] ?? STAGE_COLORS[0];

  return (
    <section className="relative w-full px-4 py-2 sm:py-3">
      <div ref={wrapperRef} className="relative h-[340vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="relative z-10 flex h-full items-center justify-center px-6">
            <div className="w-full max-w-5xl text-center">
              <p className="mb-4 text-xs uppercase tracking-[0.24em] text-cyan-300/75">Delivery Framework</p>

              <AnimatePresence mode="wait">
                <motion.h2
                  key={`title-${activeStage.title}`}
                  initial={{ opacity: 0, y: 30, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.98 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="text-5xl font-black uppercase tracking-[0.18em] sm:text-7xl lg:text-8xl"
                  style={{ color: activeColor }}
                >
                  {activeStage.title}
                </motion.h2>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.p
                  key={`content-${activeStage.title}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="mx-auto mt-6 max-w-3xl text-base leading-relaxed sm:text-xl"
                  style={{ color: 'rgba(230, 237, 243, 0.9)' }}
                >
                  {activeStage.content}
                </motion.p>
              </AnimatePresence>

              <div className="mt-8 flex items-center justify-center gap-4">
                {stages.map((stage, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <motion.div
                      key={`${stage.title}-dot`}
                      className="h-2.5 w-2.5 rounded-full"
                      animate={{
                        opacity: isActive ? 1 : 0.35,
                        scale: isActive ? 1.2 : 0.9,
                        backgroundColor: isActive ? STAGE_COLORS[index] : 'rgba(148, 163, 184, 0.6)',
                      }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    />
                  );
                })}
              </div>

              <p className="mt-5 text-[11px] uppercase tracking-[0.16em]" style={{ color: activeColor }}>
                Stage {activeStage.metric.value} · {activeStage.metric.label}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
