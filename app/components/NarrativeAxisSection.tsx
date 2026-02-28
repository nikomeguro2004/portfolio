'use client';

import { useMemo, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface Step {
  title: string;
  content: string;
  highlight: string;
  metric: { value: string; label: string };
}

interface NarrativeAxisSectionProps {
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

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

export default function NarrativeAxisSection({ steps }: NarrativeAxisSectionProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stages = useMemo(() => (steps.length >= 4 ? steps.slice(0, 4) : FALLBACK_STAGES), [steps]);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  const beamFill = useTransform(scrollYProgress, [0, 1], [0.02, 1]);
  const bgShift = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const stageIntensities = stages.map((_, index) => {
    const mid = (index + 0.5) / 4;
    return useTransform(scrollYProgress, (value) => {
      const distance = Math.abs(value - mid);
      return clamp01(1 - distance / 0.26);
    });
  });

  const stageOpacities = stageIntensities.map((intensity, index) =>
    useTransform(intensity, (value) => {
      if (index === 0) return 0.25 + value * 0.75;
      if (index === stages.length - 1) return value * 0.9 + (value > 0.65 ? 0.1 : 0);
      return value;
    })
  );

  const stageScales = stageIntensities.map((intensity) => useTransform(intensity, [0, 1], [0.92, 1]));
  const stageY = stageIntensities.map((intensity) => useTransform(intensity, [0, 1], [30, 0]));

  return (
    <section className="relative w-full px-4 py-2 sm:py-3">
      <div ref={wrapperRef} className="relative h-[300vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{
              background: useTransform(bgShift, (value) => {
                const cyan = Math.round(22 + value * 18);
                const violet = Math.round(28 + value * 30);
                return `radial-gradient(circle at 30% 35%, rgba(103, 232, 249, ${0.09 + value * 0.08}), transparent 48%), radial-gradient(circle at 72% 64%, rgba(129, 140, 248, ${0.08 + value * 0.1}), transparent 52%), linear-gradient(160deg, rgb(2, 8, ${cyan}) 0%, rgb(4, 6, ${violet}) 100%)`;
              }),
            }}
          />

          {stageOpacities.map((opacity, index) => (
            <motion.div
              key={`glow-${stages[index].title}`}
              className="pointer-events-none absolute left-1/2 top-1/2 h-[48vh] w-[48vh] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
              style={{
                background: `radial-gradient(circle, ${STAGE_COLORS[index]}35, transparent 70%)`,
                opacity: useTransform(opacity, [0, 1], [0, 0.95]),
              }}
            />
          ))}

          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/10" />
          <motion.div
            className="absolute bottom-0 left-1/2 h-full w-px -translate-x-1/2"
            style={{
              scaleY: beamFill,
              transformOrigin: 'bottom',
              background: 'linear-gradient(180deg, rgba(103,232,249,0.1) 0%, rgba(103,232,249,0.9) 100%)',
            }}
          />

          <div className="relative z-10 flex h-full items-center justify-center px-6">
            <div className="w-full max-w-5xl text-center">
              <p className="mb-4 text-xs uppercase tracking-[0.24em] text-cyan-300/80">Delivery Framework</p>

              <div className="relative h-[28vh]">
                {stages.map((stage, index) => (
                  <motion.h2
                    key={stage.title}
                    className="absolute inset-0 flex items-center justify-center text-5xl font-black uppercase tracking-[0.18em] sm:text-7xl lg:text-8xl"
                    style={{
                      opacity: stageOpacities[index],
                      scale: stageScales[index],
                      y: stageY[index],
                      color: STAGE_COLORS[index],
                    }}
                  >
                    {stage.title}
                  </motion.h2>
                ))}
              </div>

              <div className="relative mx-auto mt-2 h-[22vh] max-w-3xl">
                {stages.map((stage, index) => (
                  <motion.p
                    key={`${stage.title}-desc`}
                    className="absolute inset-0 text-base leading-relaxed sm:text-xl"
                    style={{
                      opacity: stageOpacities[index],
                      y: useTransform(stageY[index], [30, 0], [18, 0]),
                      color: 'rgba(230, 237, 243, 0.9)',
                    }}
                  >
                    {stage.content}
                  </motion.p>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-center gap-4">
                {stages.map((stage, index) => (
                  <motion.div
                    key={`${stage.title}-dot`}
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      background: STAGE_COLORS[index],
                      opacity: useTransform(stageOpacities[index], [0, 1], [0.3, 1]),
                      scale: useTransform(stageScales[index], [0.92, 1], [0.9, 1.2]),
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
