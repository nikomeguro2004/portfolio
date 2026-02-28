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
    const cards = rootRef.current.querySelectorAll('.exp-spectrum-card');
    const bars = rootRef.current.querySelectorAll('.exp-spectrum-bar');

    animate(cards, {
      translateY: [26, 0],
      opacity: [0, 1],
      delay: stagger(90, { start: 130 }),
      duration: 620,
      ease: 'out(3)',
    });

    animate(bars, {
      scaleX: [0.2, 1],
      opacity: [0.25, 1],
      delay: stagger(110),
      duration: 520,
      ease: 'out(3)',
    });
  }, []);

  const totalDeliverables = items.reduce((acc, item) => acc + item.highlights.length, 0) + spotlight.highlights.length;

  return (
    <section id="experience" className="py-16">
      <div className="container">
        <div className="mb-10 grid lg:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-3">Experience</h2>
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-300/80">Experience Spectrum</p>
            <p className="mt-3 text-sm leading-relaxed max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
              Delivery narrative visualized as a spectrum of execution contexts: foundational projects, current velocity, and production outcomes.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-cyan-400/15 bg-cyan-500/5 p-4">
              <p className="text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--text-tertiary)' }}>Roles</p>
              <p className="mt-2 text-2xl font-bold text-white">{items.length + 1}</p>
            </div>
            <div className="rounded-xl border border-indigo-400/15 bg-indigo-500/5 p-4">
              <p className="text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--text-tertiary)' }}>Deliverables</p>
              <p className="mt-2 text-2xl font-bold text-white">{totalDeliverables}</p>
            </div>
          </div>
        </div>

        <div ref={rootRef} className="space-y-6 max-w-6xl">
          {[spotlight, ...items].map((item, index) => (
            <MagneticCard
              key={`${item.company}-${item.period}-${index}`}
              className="exp-spectrum-card card relative overflow-hidden opacity-0"
              rotationStrength={2.2}
              glowColor="rgba(94, 234, 212, 0.2)"
              style={{ border: '1px solid rgba(56, 189, 248, 0.15)' }}
            >
              <div className="absolute top-0 left-0 h-full w-1 rounded-l-xl" style={{ background: 'linear-gradient(180deg, rgba(94, 234, 212, 0.9), rgba(129, 140, 248, 0.6))' }} />
              <div className="pl-3">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-5">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.14em] text-cyan-300/70">{index === 0 ? 'Ambalsoft Snapshot' : `Role ${String(index).padStart(2, '0')}`}</span>
                    <h3 className="text-2xl font-bold">{item.role}</h3>
                    <p className="text-cyan-400 font-semibold text-lg">{item.company}</p>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>{item.location}</p>
                  </div>
                  <span className="text-sm font-semibold md:text-right" style={{ color: 'var(--text-secondary)' }}>{item.period}</span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="exp-spectrum-bar h-1 rounded-full bg-cyan-300/70 origin-left" style={{ width: '92%' }} />
                  <div className="exp-spectrum-bar h-1 rounded-full bg-indigo-300/60 origin-left" style={{ width: '74%' }} />
                </div>

                <ul className="space-y-3">
                  {item.highlights.map((point, i) => (
                    <li key={i} className="flex gap-3" style={{ color: 'var(--text-secondary)' }}>
                      <span className="text-cyan-400 mt-0.5 font-bold">→</span>
                      <span className="text-base leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </MagneticCard>
          ))}
        </div>
      </div>
    </section>
  );
}
