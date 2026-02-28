'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, stagger } from 'animejs';
import { MagneticCard } from './MagneticEffects';

interface CertificationNebulaProps {
  priority: string[];
  additional: string[];
}

export default function CertificationNebula({ priority, additional }: CertificationNebulaProps) {
  const [showAll, setShowAll] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const extrasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const cards = rootRef.current.querySelectorAll('.cert-card');
    const lines = rootRef.current.querySelectorAll('.cert-line');

    animate(cards, {
      translateY: [22, 0],
      opacity: [0, 1],
      delay: stagger(65, { start: 100 }),
      duration: 560,
      ease: 'out(3)',
    });

    animate(lines, {
      scaleX: [0.2, 1],
      opacity: [0.3, 1],
      delay: stagger(70, { start: 150 }),
      duration: 470,
      ease: 'out(3)',
    });
  }, []);

  useEffect(() => {
    if (!extrasRef.current) return;

    if (showAll) {
      extrasRef.current.classList.remove('hidden');
      animate(extrasRef.current, {
        opacity: [0, 1],
        translateY: [12, 0],
        duration: 340,
        ease: 'out(3)',
      });
      return;
    }

    animate(extrasRef.current, {
      opacity: [1, 0],
      translateY: [0, -6],
      duration: 220,
      ease: 'in(3)',
      complete: () => {
        if (!showAll) extrasRef.current?.classList.add('hidden');
      },
    });
  }, [showAll]);

  return (
    <section id="certifications" className="py-16">
      <div className="container">
        <div className="mb-8 grid lg:grid-cols-[1fr_auto] gap-5 items-start">
          <div>
            <h2 className="text-3xl font-bold mb-3">Certifications</h2>
            <p className="text-sm max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
              Ongoing credential roadmap aligned to real product execution: frontend systems, backend delivery, cloud ops, and AI workflows.
            </p>
            <p className="text-sm mt-2 max-w-3xl" style={{ color: 'var(--text-tertiary)' }}>
              Priority badges represent high-impact certifications used directly in current project work.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-cyan-400/15 bg-cyan-500/5 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--text-tertiary)' }}>Priority</p>
              <p className="mt-1 text-2xl font-bold text-white">{priority.length}</p>
            </div>
            <div className="rounded-xl border border-indigo-400/15 bg-indigo-500/5 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--text-tertiary)' }}>Total</p>
              <p className="mt-1 text-2xl font-bold text-white">{priority.length + additional.length}</p>
            </div>
          </div>
        </div>

        <div ref={rootRef} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {priority.map((cert, index) => (
            <MagneticCard
              key={cert}
              className="cert-card rounded-xl px-4 py-4 text-sm transition-colors hover:bg-white/5 relative overflow-hidden opacity-0"
              rotationStrength={1.4}
              style={{
                background: 'rgba(56, 189, 248, 0.05)',
                border: '1px solid rgba(56, 189, 248, 0.13)',
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{cert}</p>
                <span className="shrink-0 rounded-full border border-cyan-300/20 bg-cyan-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-cyan-300/80">
                  P{index + 1}
                </span>
              </div>
              <div className="cert-line mt-3 h-1 origin-left rounded-full bg-cyan-300/65" style={{ width: `${70 + (index % 4) * 7}%` }} />
            </MagneticCard>
          ))}
        </div>

        <div ref={extrasRef} className="mt-4 hidden">
          <div className="rounded-2xl border border-indigo-400/15 bg-indigo-500/5 p-4">
            <p className="mb-3 text-xs uppercase tracking-[0.16em] text-indigo-300/75">Additional Learning Track</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {additional.map((cert) => (
              <div
                key={cert}
                className="rounded-lg px-4 py-3 text-sm transition-colors hover:bg-white/5"
                style={{
                  background: 'rgba(99, 102, 241, 0.08)',
                  border: '1px solid rgba(129, 140, 248, 0.2)',
                  color: 'var(--text-tertiary)',
                }}
              >
                {cert}
              </div>
            ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowAll((value) => !value)}
          className="mt-5 rounded-full border border-cyan-400/20 bg-cyan-500/5 px-4 py-2 text-sm font-medium transition-colors hover:text-cyan-400"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {showAll ? 'Show fewer certifications' : `Show ${additional.length} additional certifications`}
        </button>
      </div>
    </section>
  );
}
