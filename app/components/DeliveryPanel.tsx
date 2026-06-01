'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const PHASES = [
  {
    index: '01',
    phase: 'Scope Intake',
    signal: 'Mapping',
    line: 'Founder goals translated into delivery constraints, timeline windows, and measurable targets.',
    tags: ['Discovery Maps', 'Risk Framing', 'Timeline'],
  },
  {
    index: '02',
    phase: 'System Draft',
    signal: 'Architecting',
    line: 'Architecture selected by product velocity, technical depth, and launch budget.',
    tags: ['Stack Fit', 'Execution Plan', 'Design'],
  },
  {
    index: '03',
    phase: 'Production Run',
    signal: 'Deploying',
    line: 'Features shipped in short loops with QA gates and measurable operational outcomes.',
    tags: ['Weekly Push', 'Quality Gates', 'Shipping'],
  },
  {
    index: '04',
    phase: 'Scale Loop',
    signal: 'Iterating',
    line: 'Post-launch telemetry drives iteration, growth tuning, and reliability upgrades.',
    tags: ['Live Signals', 'Optimization', 'Scaling'],
  },
];

const CYCLE_MS = 4000;
const TICK_MS = 80;

export default function DeliveryPanel() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef(0);

  const clearTimers = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (tickRef.current) clearInterval(tickRef.current);
  };

  const startCycle = useCallback(() => {
    clearTimers();
    startRef.current = Date.now();
    setProgress(0);

    tickRef.current = setInterval(() => {
      setProgress(Math.min(((Date.now() - startRef.current) / CYCLE_MS) * 100, 100));
    }, TICK_MS);

    intervalRef.current = setInterval(() => {
      startRef.current = Date.now();
      setProgress(0);
      setActive((p) => (p + 1) % PHASES.length);
    }, CYCLE_MS);
  }, []);

  useEffect(() => {
    startCycle();
    return clearTimers;
  }, [startCycle]);

  // Spotlight mouse tracking
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, []);

  const phase = PHASES[active];

  return (
    <div
      ref={panelRef}
      className="delivery-panel relative overflow-hidden border"
      style={{
        borderColor: 'var(--rule)',
        borderRadius: 'var(--r-md)',
        background: 'var(--surface)',
      }}
    >
      {/* Spotlight layer */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgba(255,79,26,0.06), transparent 65%)',
          borderRadius: 'inherit',
        }}
      />

      <div className="relative z-10 p-5 md:p-6">
        {/* Header bar */}
        <div
          className="mb-5 flex items-center justify-between border-b pb-3"
          style={{ borderColor: 'var(--rule)' }}
        >
          <div className="flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#ef4444' }} />
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#eab308' }} />
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#22c55e' }} />
            <span className="label-mono ml-1">Delivery Feed</span>
          </div>
          <div className="flex items-center gap-2">
            <AnimatePresence mode="wait">
              <motion.span
                key={phase.signal}
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5 }}
                transition={{ duration: 0.15 }}
                className="label-mono"
                style={{ color: 'rgba(74,222,128,0.7)' }}
              >
                {phase.signal}
              </motion.span>
            </AnimatePresence>
            <span
              className="h-1.5 w-1.5 animate-pulse rounded-full"
              style={{ background: '#4ade80' }}
            />
          </div>
        </div>

        {/* Phase tabs */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {PHASES.map((p, i) => (
            <button
              key={p.phase}
              onClick={() => { setActive(i); startCycle(); }}
              className="flex items-center gap-1.5 rounded-sm px-2.5 py-1 transition-all duration-200"
              style={{
                border: `1px solid ${i === active ? 'rgba(255,79,26,0.4)' : 'var(--rule)'}`,
                background: i === active ? 'rgba(255,79,26,0.08)' : 'transparent',
                color: i === active ? 'var(--accent)' : 'var(--text-3)',
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '9px',
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: i === active ? 'var(--accent)' : 'var(--text-3)' }}
              />
              {p.phase}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid gap-3 lg:grid-cols-[1.3fr_0.7fr]">
          <AnimatePresence mode="wait">
            <motion.div
              key={`line-${active}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="rounded-sm border p-4"
              style={{ borderColor: 'var(--rule)', background: 'var(--surface-2)' }}
            >
              <div className="mb-2 flex items-baseline gap-2">
                <span className="label-mono" style={{ color: 'rgba(255,79,26,0.35)' }}>
                  {phase.index}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-geist-mono), monospace',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                    color: 'rgba(255,79,26,0.7)',
                    fontWeight: 600,
                  }}
                >
                  {phase.phase}
                </span>
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--text-2)', minHeight: '3rem' }}
              >
                {phase.line}
              </p>
            </motion.div>
          </AnimatePresence>

          <div
            className="rounded-sm border p-4"
            style={{ borderColor: 'var(--rule)', background: 'rgba(255,79,26,0.04)' }}
          >
            <p className="label-mono mb-2.5">Focus Tags</p>
            <AnimatePresence mode="wait">
              <motion.div
                key={`tags-${active}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex flex-wrap gap-1.5"
              >
                {phase.tags.map((tag, i) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.06, duration: 0.18 }}
                    className="rounded-sm border px-2 py-1"
                    style={{
                      borderColor: 'rgba(255,79,26,0.2)',
                      background: 'var(--surface-2)',
                      fontFamily: 'var(--font-geist-mono), monospace',
                      fontSize: '9px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: 'var(--text-2)',
                    }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Progress bar */}
        <div
          className="mt-4 h-[1px] w-full overflow-hidden"
          style={{ background: 'var(--rule)' }}
        >
          <div
            className="h-full transition-none"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, rgba(255,79,26,0.5) 0%, var(--accent) 100%)',
            }}
          />
        </div>

        {/* Signal chips */}
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { label: 'Cadence', value: 'Weekly' },
            { label: 'Mode', value: 'Ship-First' },
            { label: 'Scope', value: 'Startup Web' },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-1.5 rounded-sm border px-3 py-1.5"
              style={{ borderColor: 'var(--rule)', background: 'transparent' }}
            >
              <span className="label-mono">{s.label}</span>
              <span
                style={{
                  fontFamily: 'var(--font-geist-mono), monospace',
                  fontSize: '10px',
                  fontWeight: 600,
                  color: 'var(--text)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
