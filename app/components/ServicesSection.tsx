'use client';

import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';
import { MagneticCard } from './MagneticInteractions';

interface ServiceItem {
  title: string;
  desc: string;
  chips: string[];
}

interface ServicesSectionProps {
  items: ServiceItem[];
  quote: string;
}

export default function ServicesSection({ items, quote }: ServicesSectionProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const cards = rootRef.current.querySelectorAll('.svc-matrix-card');

    animate(cards, {
      translateY: [28, 0],
      opacity: [0, 1],
      delay: stagger(80, { start: 120 }),
      duration: 620,
      ease: 'out(3)',
    });

    animate(cards, {
      boxShadow: [
        '0 0 0 rgba(56, 189, 248, 0)',
        '0 0 14px rgba(56, 189, 248, 0.1)',
      ],
      delay: stagger(80, { start: 320 }),
      duration: 500,
      ease: 'out(3)',
    });
  }, []);

  return (
    <section id="about" className="py-16">
      <div className="container">
        <div className="mb-8 grid lg:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-3">What I Do</h2>
            <p className="text-sm max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
              Core service areas focused on product delivery, platform reliability, and business impact.
            </p>
          </div>
          <div className="relative rounded-full border border-cyan-400/20 bg-cyan-500/5 px-4 py-2 text-xs uppercase tracking-[0.16em] text-cyan-300">
            Service Areas
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
              <div className="mb-3 flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/25 px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-400" />
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.12em] text-cyan-300/70">area {String(index + 1).padStart(2, '0')}</span>
              </div>

              <h3 className="font-semibold mb-2 text-lg text-cyan-400">{item.title}</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>

              <div className="flex flex-wrap gap-2 mb-3">
                {item.chips.map((chip) => (
                  <span key={chip} className="skill-badge text-xs">{chip}</span>
                ))}
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
