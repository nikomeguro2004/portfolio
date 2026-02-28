'use client';

import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

const MILESTONES = [
  { step: '01', title: 'Problem Mapping', note: 'Find the constraint that matters' },
  { step: '02', title: 'System Drafting', note: 'Design for speed and durability' },
  { step: '03', title: 'Launch Execution', note: 'Ship with stable operations' },
  { step: '04', title: 'Growth Tuning', note: 'Improve via real telemetry' },
];

export default function ProjectMilestoneDeck() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;

    const cards = rootRef.current.querySelectorAll('.milestone-lane-card');
    const rails = rootRef.current.querySelectorAll('.milestone-lane-rail');
    const dots = rootRef.current.querySelectorAll('.milestone-lane-dot');

    animate(cards, {
      translateY: [22, 0],
      opacity: [0, 1],
      delay: stagger(120, { start: 180 }),
      duration: 620,
      ease: 'out(3)',
    });

    animate(rails, {
      scaleX: [0.25, 1],
      opacity: [0.3, 1],
      delay: stagger(130, { start: 320 }),
      duration: 680,
      ease: 'out(4)',
    });

    animate(dots, {
      scale: [0.7, 1.18],
      opacity: [0.35, 1],
      delay: stagger(100, { start: 400 }),
      duration: 1400,
      direction: 'alternate',
      loop: true,
      ease: 'inOut(3)',
    });
  }, []);

  return (
    <div ref={rootRef} className="grid md:grid-cols-4 gap-3 mb-10">
      {MILESTONES.map((item) => (
        <div key={item.step} className="milestone-lane-card rounded-xl border border-cyan-400/15 bg-slate-900/40 p-4 opacity-0">
          <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-tertiary)' }}>
            {item.step}
          </p>
          <h3 className="text-sm font-semibold text-cyan-300 mb-2">{item.title}</h3>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {item.note}
          </p>
          <div className="milestone-lane-rail mt-3 h-0.5 origin-left rounded-full bg-linear-to-r from-cyan-300 to-sky-400" />
          <div className="mt-3 flex gap-1.5">
            {Array.from({ length: 4 }).map((_, index) => (
              <span key={index} className="milestone-lane-dot h-1.5 w-1.5 rounded-full bg-cyan-300/85" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
