'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, stagger } from 'animejs';
import { AnimatePresence, motion } from 'framer-motion';

const RUNTIME_LINES = [
  'Intake: founder goals translated into product scope',
  'Blueprint: architecture mapped to launch timeline',
  'Delivery: production rollout with QA gates',
  'Iteration: post-launch refinement from real usage',
];

const SIGNALS = [
  { label: 'Velocity', value: 'Weekly' },
  { label: 'Quality', value: 'Production' },
  { label: 'Reliability', value: 'Measured' },
];

export default function HeroNarrativeCluster() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeLine, setActiveLine] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveLine((prev) => (prev + 1) % RUNTIME_LINES.length);
    }, 2300);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!rootRef.current) return;

    const strips = rootRef.current.querySelectorAll('.hero-strip');
    const nodes = rootRef.current.querySelectorAll('.hero-node');

    animate(strips, {
      scaleX: [0.25, 1],
      opacity: [0.25, 1],
      delay: stagger(100, { start: 140 }),
      duration: 540,
      ease: 'out(3)',
    });

    animate(nodes, {
      scale: [0.8, 1.24],
      opacity: [0.35, 1],
      delay: stagger(90),
      duration: 1600,
      direction: 'alternate',
      loop: true,
      ease: 'inOut(3)',
    });
  }, []);

  return (
    <motion.div
      ref={rootRef}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="rounded-2xl border border-cyan-300/20 bg-slate-900/35 p-5 md:p-6"
    >
      <p className="text-xs uppercase tracking-[0.18em] text-cyan-300/80">Execution Runtime</p>

      <AnimatePresence mode="wait">
        <motion.p
          key={activeLine}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.24 }}
          className="mt-3 text-sm leading-relaxed min-h-12"
          style={{ color: 'var(--text-secondary)' }}
        >
          {RUNTIME_LINES[activeLine]}
        </motion.p>
      </AnimatePresence>

      <div className="mt-4 space-y-2">
        <div className="hero-strip h-1 rounded-full bg-cyan-300/65 origin-left" style={{ width: '95%' }} />
        <div className="hero-strip h-1 rounded-full bg-sky-300/60 origin-left" style={{ width: '82%' }} />
        <div className="hero-strip h-1 rounded-full bg-indigo-300/55 origin-left" style={{ width: '70%' }} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {SIGNALS.map((signal) => (
          <div key={signal.label} className="rounded-full border border-cyan-300/20 bg-black/20 px-3 py-1.5">
            <span className="text-[11px] uppercase tracking-[0.12em]" style={{ color: 'var(--text-tertiary)' }}>
              {signal.label}
            </span>
            <span className="ml-2 text-xs font-semibold text-cyan-300">{signal.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-8 gap-2">
        {Array.from({ length: 16 }).map((_, index) => (
          <span key={index} className="hero-node h-1.5 w-1.5 rounded-full bg-cyan-300" style={{ boxShadow: '0 0 9px rgba(94, 234, 212, 0.72)' }} />
        ))}
      </div>
    </motion.div>
  );
}
