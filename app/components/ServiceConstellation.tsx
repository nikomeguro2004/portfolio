'use client';

import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';
import { MagneticCard } from './MagneticEffects';

interface ServiceItem {
  title: string;
  desc: string;
  chips: string[];
}

interface ServiceConstellationProps {
  items: ServiceItem[];
  quote: string;
}

export default function ServiceConstellation({ items, quote }: ServiceConstellationProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const cards = rootRef.current.querySelectorAll('.svc-matrix-card');
    const rails = rootRef.current.querySelectorAll('.svc-matrix-rail');

    animate(cards, {
      translateY: [28, 0],
      opacity: [0, 1],
      delay: stagger(80, { start: 120 }),
      duration: 620,
      ease: 'out(3)',
    });

    animate(rails, {
      scaleX: [0.3, 1],
      opacity: [0.25, 1],
      delay: stagger(90, { start: 220 }),
      duration: 580,
      ease: 'out(3)',
    });

    animate(cards, {
      boxShadow: [
        '0 0 0 rgba(56, 189, 248, 0)',
        '0 0 22px rgba(56, 189, 248, 0.12)',
      ],
      delay: stagger(80, { start: 320 }),
      duration: 1300,
      direction: 'alternate',
      loop: true,
      ease: 'inOut(3)',
    });
  }, []);

  return (
    <section id="about" className="py-16">
      <div className="container">
        <div className="mb-8 grid lg:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-3">What I Do</h2>
            <p className="text-sm max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
              Capability domains mapped as an impact matrix, showing where each function contributes to real production delivery.
            </p>
          </div>
          <div className="relative rounded-full border border-cyan-400/20 bg-cyan-500/5 px-4 py-2 text-xs uppercase tracking-[0.16em] text-cyan-300">
            Impact Matrix
          </div>
        </div>

        <div ref={rootRef} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 max-w-6xl">
          {items.map((item, index) => (
            <MagneticCard
              key={item.title}
              className="svc-matrix-card card h-full relative overflow-hidden opacity-0"
              rotationStrength={3.3}
              glowColor="rgba(56, 189, 248, 0.3)"
            >
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 88% 12%, rgba(56, 189, 248, 0.15), transparent 40%)' }} />
              <span className="absolute top-3 right-3 text-[10px] uppercase tracking-[0.12em] text-cyan-300/70">Node {String(index + 1).padStart(2, '0')}</span>
              <h3 className="font-semibold mb-2 text-lg text-cyan-400">{item.title}</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>

              <div className="flex flex-wrap gap-2 mb-3">
                {item.chips.map((chip) => (
                  <span key={chip} className="skill-badge text-xs">{chip}</span>
                ))}
              </div>

              <div className="space-y-2">
                <div className="svc-matrix-rail h-1 rounded-full bg-cyan-300/65 origin-left" style={{ width: `${72 + index * 4}%` }} />
                <div className="svc-matrix-rail h-1 rounded-full bg-indigo-300/55 origin-left" style={{ width: `${58 + index * 6}%` }} />
              </div>
            </MagneticCard>
          ))}
        </div>

        <div className="mt-8 max-w-3xl rounded-2xl border border-indigo-400/15 bg-indigo-500/5 px-5 py-4">
          <p className="text-sm italic" style={{ color: 'var(--text-secondary)' }}>{quote}</p>
        </div>
      </div>
    </section>
  );
}
