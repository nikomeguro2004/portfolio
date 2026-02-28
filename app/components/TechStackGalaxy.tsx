'use client';

import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';
import { MagneticCard } from './MagneticEffects';

interface TechStackGalaxyProps {
  skills: Record<string, string[]>;
}

export default function TechStackGalaxy({ skills }: TechStackGalaxyProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;

    const cards = rootRef.current.querySelectorAll('.systems-orbit-card');
    const tags = rootRef.current.querySelectorAll('.systems-orbit-tag');
    const beams = rootRef.current.querySelectorAll('.systems-orbit-beam');
    const nodes = rootRef.current.querySelectorAll('.systems-orbit-node');
    const panel = rootRef.current.querySelector('.systems-command-panel');

    if (panel) {
      animate(panel, {
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 620,
        ease: 'out(3)',
      });
    }

    animate(cards, {
      translateY: [34, 0],
      scale: [0.96, 1],
      opacity: [0, 1],
      delay: stagger(95, { start: 180, grid: [3, 2], axis: 'x' }),
      duration: 680,
      ease: 'out(3)',
    });

    animate(tags, {
      translateY: [8, 0],
      opacity: [0, 1],
      delay: stagger(12, { start: 320 }),
      duration: 420,
      ease: 'out(2)',
    });

    animate(beams, {
      scaleX: [0.3, 1],
      opacity: [0.2, 1],
      delay: stagger(90, { start: 260 }),
      duration: 560,
      ease: 'out(2)',
    });

    animate(nodes, {
      scale: [0.9, 1.16],
      opacity: [0.45, 1],
      delay: stagger(70),
      duration: 1450,
      direction: 'alternate',
      loop: true,
      ease: 'inOut(2)',
    });
  }, []);

  const lanes = Object.entries(skills).slice(0, 6);
  const skillCount = lanes.reduce((acc, [, values]) => acc + values.slice(0, 6).length, 0);

  return (
    <section id="skills" className="py-16">
      <div ref={rootRef} className="container">
        <div className="systems-command-panel mb-7 rounded-2xl border border-cyan-400/15 bg-slate-900/35 p-5 opacity-0 md:p-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-300/75">Execution Stack</p>
              <h2 className="mt-2 text-3xl font-bold">Systems I Work With</h2>
              <p className="mt-3 max-w-3xl text-sm" style={{ color: 'var(--text-secondary)' }}>
                A creative systems map of the six capability lanes I use to ship startup products from idea to production.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-cyan-400/15 bg-cyan-500/5 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--text-tertiary)' }}>Lanes</p>
                <p className="mt-1 text-2xl font-bold text-white">{lanes.length}</p>
              </div>
              <div className="rounded-xl border border-indigo-400/15 bg-indigo-500/5 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--text-tertiary)' }}>Core Skills</p>
                <p className="mt-1 text-2xl font-bold text-white">{skillCount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {lanes.map(([category, items], categoryIndex) => (
            <MagneticCard
              key={category}
              className="systems-orbit-card card h-full relative overflow-hidden opacity-0"
              rotationStrength={2.1}
              glowColor="rgba(56, 189, 248, 0.2)"
              style={{
                border: '1px solid rgba(56, 189, 248, 0.16)',
                transform: `translateY(${categoryIndex % 2 === 0 ? 0 : 8}px)`,
              }}
            >
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 95% 0%, rgba(129, 140, 248, 0.17), transparent 45%)' }} />

              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="systems-orbit-node h-2 w-2 rounded-full bg-cyan-300" style={{ boxShadow: '0 0 14px rgba(94, 234, 212, 0.65)' }} />
                <span className="text-[10px] uppercase tracking-[0.16em] text-indigo-300/80">{`Lane ${String(categoryIndex + 1).padStart(2, '0')}`}</span>
              </div>

              <h3 className="text-lg font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>{category}</h3>

              <div className="mb-4 mt-3 space-y-1.5">
                <div className="systems-orbit-beam h-1 rounded-full bg-cyan-300/70 origin-left" style={{ width: '86%' }} />
                <div className="systems-orbit-beam h-1 rounded-full bg-indigo-300/60 origin-left" style={{ width: '58%' }} />
              </div>

              <div className="flex flex-wrap gap-2">
                {items.slice(0, 6).map((skill) => (
                  <span key={skill} className="systems-orbit-tag skill-badge" style={{ opacity: 0.9 }}>
                    {skill}
                  </span>
                ))}
              </div>
            </MagneticCard>
          ))}
        </div>
      </div>
    </section>
  );
}
