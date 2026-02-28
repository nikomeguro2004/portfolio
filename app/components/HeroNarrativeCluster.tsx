'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, stagger } from 'animejs';
import { AnimatePresence, motion } from 'framer-motion';

const COMMAND_CARDS = [
  {
    phase: 'Scope Intake',
    line: 'Founder goals translated into delivery constraints and timeline windows.',
    stats: ['Discovery Maps', 'Risk Framing'],
  },
  {
    phase: 'System Draft',
    line: 'Architecture selected by product velocity, technical depth, and launch budget.',
    stats: ['Stack Fit', 'Execution Plan'],
  },
  {
    phase: 'Production Run',
    line: 'Features shipped in short loops with QA gates and measurable operational outcomes.',
    stats: ['Weekly Push', 'Quality Gates'],
  },
  {
    phase: 'Scale Loop',
    line: 'Post-launch telemetry drives iteration, growth tuning, and reliability upgrades.',
    stats: ['Live Signals', 'Optimization'],
  },
];

const SIGNALS = [
  { label: 'Cadence', value: 'Weekly' },
  { label: 'Mode', value: 'Ship-First' },
  { label: 'Health', value: 'Measured' },
];

export default function HeroNarrativeCluster() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveCard((prev) => (prev + 1) % COMMAND_CARDS.length);
    }, 2300);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!rootRef.current) return;

    const strips = rootRef.current.querySelectorAll('.hero-telemetry-strip');
    const nodes = rootRef.current.querySelectorAll('.hero-grid-node');
    const chips = rootRef.current.querySelectorAll('.hero-signal-chip');

    animate(strips, {
      scaleX: [0.25, 1],
      opacity: [0.25, 1],
      delay: stagger(90, { start: 120 }),
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

    animate(chips, {
      translateY: [8, 0],
      opacity: [0, 1],
      delay: stagger(70, { start: 240 }),
      duration: 360,
      ease: 'out(3)',
    });
  }, []);

  return (
    <motion.div
      ref={rootRef}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="rounded-2xl border border-cyan-300/20 bg-slate-900/40 p-5 md:p-6"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.18em] text-cyan-300/80">Command Overview</p>
        <p className="text-[10px] uppercase tracking-[0.14em] text-cyan-200/80">Phase {String(activeCard + 1).padStart(2, '0')}</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={activeCard}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.24 }}
          className="text-sm leading-relaxed min-h-12"
          style={{ color: 'var(--text-secondary)' }}
        >
          {COMMAND_CARDS[activeCard].line}
        </motion.p>
      </AnimatePresence>

      <div className="mt-3 flex flex-wrap gap-2">
        {COMMAND_CARDS[activeCard].stats.map((tag) => (
          <span key={tag} className="rounded-md border border-cyan-300/20 bg-cyan-400/5 px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-cyan-200/90">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 space-y-2.5">
        <div className="hero-telemetry-strip h-1 rounded-full bg-cyan-300/65 origin-left" style={{ width: '95%' }} />
        <div className="hero-telemetry-strip h-1 rounded-full bg-sky-300/60 origin-left" style={{ width: `${78 + activeCard * 4}%` }} />
        <div className="hero-telemetry-strip h-1 rounded-full bg-indigo-300/55 origin-left" style={{ width: `${62 + activeCard * 5}%` }} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2.5">
        {SIGNALS.map((signal) => (
          <div key={signal.label} className="hero-signal-chip rounded-full border border-cyan-300/20 bg-black/20 px-3 py-1.5 opacity-0">
            <span className="text-[11px] uppercase tracking-[0.12em]" style={{ color: 'var(--text-tertiary)' }}>
              {signal.label}
            </span>
            <span className="ml-2 text-xs font-semibold text-cyan-300">{signal.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-12 gap-1.5">
        {Array.from({ length: 24 }).map((_, index) => (
          <span key={index} className="hero-grid-node h-1.5 w-1.5 rounded-full bg-cyan-300" style={{ boxShadow: '0 0 9px rgba(94, 234, 212, 0.72)' }} />
        ))}
      </div>
    </motion.div>
  );
}
