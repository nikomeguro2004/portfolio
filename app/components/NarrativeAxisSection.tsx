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

type ProcessDetail = {
  focus: string;
  output: string;
  signal: string;
};

const PROCESS_DETAILS: Record<string, ProcessDetail> = {
  discover: {
    focus: 'Clarify product intent, user needs, constraints, and delivery scope.',
    output: 'Execution brief with decisions, priorities, and milestones.',
    signal: 'Everyone aligns on what gets built and why.',
  },
  design: {
    focus: 'Shape architecture, interfaces, and implementation sequence for maintainability.',
    output: 'Technical blueprint with stack choices and contracts.',
    signal: 'System design supports scale without unnecessary complexity.',
  },
  ship: {
    focus: 'Implement features in tight loops with integration and reliability checks.',
    output: 'Production-ready releases with measurable quality.',
    signal: 'Features launch stably with low-friction handoff to users.',
  },
  evolve: {
    focus: 'Use telemetry and feedback to improve performance and product outcomes.',
    output: 'Continuous refinements across UX, code, and infrastructure.',
    signal: 'User value and system reliability improve release over release.',
  },
};

const STAGE_ACCENTS = ['#67E8F9', '#A78BFA', '#2DD4BF', '#818CF8'] as const;

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function NarrativeAxisSection({ steps }: NarrativeAxisSectionProps) {
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Array<HTMLDivElement | null>>([]);

  const activeStep = steps[active] ?? steps[0];
  const detail = PROCESS_DETAILS[activeStep.title.toLowerCase()] ?? PROCESS_DETAILS.discover;
  const activeAccent = STAGE_ACCENTS[active] ?? STAGE_ACCENTS[0];

  useEffect(() => {
    if (!scrollRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = Number((entry.target as HTMLElement).dataset.index ?? 0);
          setActive(index);
        });
      },
      {
        root: scrollRef.current,
        threshold: 0.7,
        rootMargin: '-18% 0px -18% 0px',
      }
    );

    markersRef.current.forEach((marker) => {
      if (marker) observer.observe(marker);
    });

    return () => observer.disconnect();
  }, [steps.length]);

  useEffect(() => {
    if (!rootRef.current) return;

    const verbs = rootRef.current.querySelectorAll('.axis-verb');
    const dots = rootRef.current.querySelectorAll('.axis-dot');

    animate(verbs, {
      translateY: [10, 0],
      opacity: [0.5, 1],
      delay: stagger(40),
      duration: 380,
      ease: 'out(4)',
    });

    animate(dots, {
      scale: [0.9, 1.08],
      opacity: [0.7, 1],
      delay: stagger(40),
      duration: 360,
      ease: 'inOut(4)',
    });
  }, [active]);

  return (
    <section className="relative w-full px-4 py-3 sm:py-4">
      <motion.div
        className="pointer-events-none absolute left-[10%] top-[14%] h-72 w-72 rounded-full blur-3xl"
        animate={{
          background: `radial-gradient(circle, ${activeAccent}35, transparent 70%)`,
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 1.1, ease: smoothEase }}
      />

      <div
        ref={scrollRef}
        className="relative h-[86vh] overflow-y-auto rounded-[24px] [&::-webkit-scrollbar]:hidden"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div ref={rootRef} className="container relative min-h-[180vh] pt-2">
          <div className="mb-5 max-w-4xl">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/80">Delivery Framework</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-5xl" style={{ color: '#E6EDF3' }}>
              Simple Process. Clear Delivery.
            </h2>
            <p className="mt-4 text-sm sm:text-lg" style={{ color: 'var(--text-secondary)' }}>
              Scroll this section through discover, design, ship, and evolve. After the section ends, normal page scrolling continues.
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
                className="h-[40vh]"
                aria-hidden="true"
              />
            ))}
          </div>

          <div className="sticky top-[3vh] z-10">
            <div className="grid gap-8 bg-black/15 p-4 backdrop-blur-sm sm:p-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em]" style={{ color: activeAccent }}>
                Framework Axis
              </p>

              <AnimatePresence mode="wait">
                <motion.h3
                  key={`headline-${activeStep.title}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: smoothEase }}
                  className="mt-3 text-4xl font-bold text-white sm:text-5xl"
                >
                  You can {activeStep.title.toLowerCase()}.
                </motion.h3>
              </AnimatePresence>

              <div className="mt-7 space-y-2">
                {steps.map((step, index) => (
                  <motion.p
                    key={step.title}
                    className="axis-verb text-2xl font-semibold lowercase sm:text-3xl"
                    animate={{
                      opacity: index === active ? 1 : 0.42,
                      x: index === active ? 0 : -5,
                    }}
                    transition={{ duration: 0.25, ease: smoothEase }}
                    style={{ color: index === active ? activeAccent : 'rgba(148,163,184,0.7)' }}
                  >
                    {step.title.toLowerCase()}.
                  </motion.p>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-2.5">
                {steps.map((step, index) => (
                  <motion.span
                    key={`dot-${step.title}`}
                    className="axis-dot h-2.5 w-2.5 rounded-full"
                    animate={{
                      scale: index === active ? 1.2 : 1,
                      opacity: index === active ? 1 : 0.45,
                    }}
                    transition={{ duration: 0.25, ease: smoothEase }}
                    style={{ background: index === active ? activeAccent : 'rgba(148,163,184,0.6)' }}
                  />
                ))}
              </div>
            </div>

            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`panel-${activeStep.title}`}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.32, ease: smoothEase }}
                >
                  <p className="text-xs uppercase tracking-[0.16em]" style={{ color: activeAccent }}>
                    {activeStep.highlight}
                  </p>
                  <h3 className="mt-3 text-4xl font-bold text-white sm:text-5xl">{activeStep.title}</h3>
                  <p className="mt-4 text-base sm:text-lg" style={{ color: 'var(--text-secondary)' }}>
                    {activeStep.content}
                  </p>

                  <div className="mt-7 grid gap-4 sm:grid-cols-3">
                    <div className="bg-black/25 p-4">
                      <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--text-tertiary)' }}>Focus</p>
                      <p className="mt-2 text-sm" style={{ color: '#C9D3DE' }}>{detail.focus}</p>
                    </div>
                    <div className="bg-black/25 p-4">
                      <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--text-tertiary)' }}>Output</p>
                      <p className="mt-2 text-sm" style={{ color: '#C9D3DE' }}>{detail.output}</p>
                    </div>
                    <div className="bg-black/25 p-4">
                      <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--text-tertiary)' }}>Success Signal</p>
                      <p className="mt-2 text-sm" style={{ color: '#C9D3DE' }}>{detail.signal}</p>
                    </div>
                  </div>

                  <p className="mt-5 text-[11px] uppercase tracking-[0.16em]" style={{ color: activeAccent }}>
                    Stage {activeStep.metric.value} · {activeStep.metric.label}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
