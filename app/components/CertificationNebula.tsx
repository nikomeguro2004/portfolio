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
    const cards = rootRef.current.querySelectorAll('.cert-nebula-card');
    animate(cards, {
      translateY: [18, 0],
      opacity: [0, 1],
      delay: stagger(55, { start: 90 }),
      duration: 520,
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
        <div className="mb-7 grid lg:grid-cols-[1fr_auto] gap-5 items-start">
          <div>
            <h2 className="text-3xl font-bold mb-4">Certifications</h2>
            <p className="text-sm max-w-3xl" style={{ color: 'var(--text-tertiary)' }}>
              Continuous upskilling across frontend systems, cloud delivery, AI workflows, and quality engineering.
            </p>
            <p className="text-sm mt-2 max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
              Credential nebula grouped by practical usage across frontend, backend, cloud, and AI delivery.
            </p>
          </div>
          <div className="rounded-xl border border-cyan-400/15 bg-cyan-500/5 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--text-tertiary)' }}>Total</p>
            <p className="mt-2 text-2xl font-bold text-white">{priority.length + additional.length}</p>
          </div>
        </div>

        <div ref={rootRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-w-5xl">
          {priority.map((cert, index) => (
            <MagneticCard
              key={cert}
              className="cert-nebula-card px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-white/5 relative overflow-hidden opacity-0"
              rotationStrength={1.5}
              style={{
                background: 'rgba(56, 189, 248, 0.04)',
                border: '1px solid rgba(56, 189, 248, 0.1)',
                color: 'var(--text-secondary)',
              }}
            >
              <span className="absolute top-1.5 right-2 text-[10px] text-cyan-300/70">#{index + 1}</span>
              {cert}
            </MagneticCard>
          ))}
        </div>

        <div ref={extrasRef} className="mt-3 hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-5xl">
            {additional.map((cert) => (
              <div
                key={cert}
                className="px-4 py-3 rounded-lg text-sm transition-colors hover:bg-white/5"
                style={{
                  background: 'rgba(56, 189, 248, 0.02)',
                  border: '1px solid rgba(56, 189, 248, 0.05)',
                  color: 'var(--text-tertiary)',
                }}
              >
                {cert}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowAll((value) => !value)}
          className="mt-6 text-sm font-medium transition-colors hover:text-cyan-400"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {showAll ? '← Show fewer' : `+ ${additional.length} more certifications`}
        </button>
      </div>
    </section>
  );
}
