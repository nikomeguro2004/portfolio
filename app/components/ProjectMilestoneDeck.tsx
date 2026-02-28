'use client';

import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

const MILESTONES = [
  { step: '01', title: 'Problem Framing', note: 'Find leverage, not noise' },
  { step: '02', title: 'Architecture Build', note: 'Design for future scale' },
  { step: '03', title: 'Production Launch', note: 'Ship fast, monitor deeply' },
  { step: '04', title: 'Performance Tuning', note: 'Iterate with evidence' },
];

export default function ProjectMilestoneDeck() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;

    const cards = rootRef.current.querySelectorAll('.milestone-card');
    const rails = rootRef.current.querySelectorAll('.milestone-rail');

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
  }, []);

  return (
    <div ref={rootRef} className="grid md:grid-cols-4 gap-3 mb-10">
      {MILESTONES.map((item) => (
        <div key={item.step} className="milestone-card rounded-xl border border-cyan-400/15 bg-slate-900/40 p-4 opacity-0">
          <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-tertiary)' }}>
            {item.step}
          </p>
          <h3 className="text-sm font-semibold text-cyan-300 mb-2">{item.title}</h3>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {item.note}
          </p>
          <div className="milestone-rail mt-3 h-0.5 origin-left rounded-full bg-linear-to-r from-cyan-300 to-sky-400" />
        </div>
      ))}
    </div>
  );
}
