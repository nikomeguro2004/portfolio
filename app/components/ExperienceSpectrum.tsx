'use client';

import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';
import { MagneticCard } from './MagneticEffects';

interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location: string;
  highlights: string[];
}

interface ExperienceSpectrumProps {
  items: ExperienceItem[];
  spotlight: ExperienceItem;
}

export default function ExperienceSpectrum({ items, spotlight }: ExperienceSpectrumProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const cards = rootRef.current.querySelectorAll('.exp-card');
    const lines = rootRef.current.querySelectorAll('.exp-line');
    const chips = rootRef.current.querySelectorAll('.exp-chip');
    const pulses = rootRef.current.querySelectorAll('.exp-pulse');

    animate(cards, {
      translateY: [30, 0],
      opacity: [0, 1],
      delay: stagger(120, { start: 150 }),
      duration: 680,
      ease: 'out(3)',
    });

    animate(lines, {
      scaleY: [0.2, 1],
      opacity: [0.2, 1],
      delay: stagger(130, { start: 220 }),
      duration: 560,
      ease: 'out(3)',
    });

    animate(chips, {
      translateY: [10, 0],
      opacity: [0, 1],
      delay: stagger(18, { start: 300 }),
      duration: 420,
      ease: 'out(2)',
    });

    animate(pulses, {
      scale: [0.9, 1.18],
      opacity: [0.4, 1],
      delay: stagger(90),
      duration: 1250,
      loop: true,
      direction: 'alternate',
      ease: 'inOut(2)',
    });
  }, []);

  const timeline = [spotlight, ...items];
  const totalDeliverables = timeline.reduce((acc, item) => acc + item.highlights.length, 0);

  return (
    <section id="experience" className="py-16">
      <div className="container">
        <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h2 className="text-3xl font-bold mb-3">Experience</h2>
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-300/80">Career Signal Timeline</p>
            <p className="mt-3 text-sm leading-relaxed max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
              A creative timeline of roles, each with focused delivery signals and the core outcomes shipped in that window.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-cyan-400/15 bg-cyan-500/5 p-4">
              <p className="text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--text-tertiary)' }}>Active Roles</p>
              <p className="mt-2 text-2xl font-bold text-white">{timeline.length}</p>
            </div>
            <div className="rounded-xl border border-indigo-400/15 bg-indigo-500/5 p-4">
              <p className="text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--text-tertiary)' }}>Outcome Signals</p>
              <p className="mt-2 text-2xl font-bold text-white">{totalDeliverables}</p>
            </div>
          </div>
        </div>

        <div ref={rootRef} className="relative mx-auto max-w-6xl">
          <div
            className="pointer-events-none absolute left-4 top-0 bottom-0 hidden md:block"
            style={{
              width: '1px',
              background: 'linear-gradient(180deg, rgba(56, 189, 248, 0.15), rgba(129, 140, 248, 0.35), rgba(56, 189, 248, 0.15))',
            }}
          />

          <div className="space-y-6">
            {timeline.map((item, index) => (
              <div key={`${item.company}-${item.period}-${index}`} className="grid gap-4 md:grid-cols-[40px_1fr] md:items-start">
                <div className="relative hidden md:block">
                  <div className="exp-line origin-top absolute left-1/2 top-5 h-full w-0.5 -translate-x-1/2 rounded-full bg-cyan-300/35" />
                  <span className="exp-pulse absolute left-1/2 top-2 h-3 w-3 -translate-x-1/2 rounded-full bg-cyan-300" style={{ boxShadow: '0 0 16px rgba(94, 234, 212, 0.6)' }} />
                </div>

                <MagneticCard
                  className="exp-card card relative overflow-hidden opacity-0"
                  rotationStrength={2}
                  glowColor="rgba(94, 234, 212, 0.18)"
                  style={{ border: '1px solid rgba(56, 189, 248, 0.16)' }}
                >
                  <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 100% 0%, rgba(129, 140, 248, 0.16), transparent 42%)' }} />

                  <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.14em] text-cyan-300/80">{`Phase ${String(index + 1).padStart(2, '0')}`}</p>
                      <h3 className="text-2xl font-bold leading-tight">{item.role}</h3>
                      <p className="mt-1 text-lg font-semibold text-cyan-300">{item.company}</p>
                      <p className="mt-1 text-sm" style={{ color: 'var(--text-tertiary)' }}>{item.location}</p>
                    </div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{item.period}</p>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {item.highlights.slice(0, 3).map((point, i) => (
                      <span key={i} className="exp-chip rounded-full border border-cyan-300/20 bg-cyan-500/10 px-2.5 py-1 text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {point.split(' ').slice(0, 6).join(' ')}...
                      </span>
                    ))}
                  </div>

                  <ul className="space-y-2">
                    {item.highlights.map((point, i) => (
                      <li key={i} className="flex gap-3" style={{ color: 'var(--text-secondary)' }}>
                        <span className="mt-0.75 h-1.5 w-1.5 rounded-full bg-cyan-300" />
                        <span className="text-sm leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </MagneticCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
