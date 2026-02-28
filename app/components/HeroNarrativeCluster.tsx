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
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!rootRef.current) return;

    const chips = rootRef.current.querySelectorAll('.hero-signal-chip');

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
      className="rounded-2xl border border-cyan-300/20 bg-slate-950/70 p-5 md:p-6"
    >
      <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-cyan-300/15 bg-black/35 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-rose-400" />
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-300/80">Delivery Summary</p>
        </div>
        <p className="text-[10px] uppercase tracking-[0.14em] text-cyan-200/80">phase {String(activeCard + 1).padStart(2, '0')}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-xl border border-cyan-300/15 bg-black/30 p-4">
          <p className="mb-2 text-[11px] uppercase tracking-[0.14em] text-cyan-200/80">Current Focus</p>
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
        </div>

        <div className="rounded-xl border border-indigo-300/15 bg-indigo-500/5 p-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-indigo-200/80">Process Stages</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {COMMAND_CARDS.map((item, index) => (
              <button
                key={item.phase}
                onClick={() => setActiveCard(index)}
                className="rounded-md border px-2.5 py-1 text-[11px] transition-colors"
                style={{
                  borderColor: index === activeCard ? 'rgba(94, 234, 212, 0.55)' : 'rgba(129, 140, 248, 0.3)',
                  background: index === activeCard ? 'rgba(56, 189, 248, 0.12)' : 'rgba(15, 23, 42, 0.35)',
                  color: index === activeCard ? 'rgb(165 243 252)' : 'rgb(199 210 254)',
                }}
              >
                {item.phase}
              </button>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {COMMAND_CARDS[activeCard].stats.map((tag) => (
              <span key={tag} className="rounded-md border border-cyan-300/20 bg-cyan-400/5 px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-cyan-200/90">
                {tag}
              </span>
            ))}
          </div>
        </div>
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
    </motion.div>
  );
}
