'use client';

import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

const MILESTONES = [
  { step: '01', title: 'Problem Mapping', note: 'Find the constraint that matters', command: 'scan --constraints --product-stage' },
  { step: '02', title: 'System Drafting', note: 'Design for speed and durability', command: 'compose --stack-fit --delivery-path' },
  { step: '03', title: 'Launch Execution', note: 'Ship with stable operations', command: 'deploy --qa-gates --observability' },
  { step: '04', title: 'Growth Tuning', note: 'Improve via real telemetry', command: 'iterate --signals --impact' },
];

export default function ProjectsMilestoneDeck() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;

    const cards = rootRef.current.querySelectorAll('.milestone-lane-card');

    animate(cards, {
      translateY: [22, 0],
      opacity: [0, 1],
      delay: stagger(120, { start: 180 }),
      duration: 620,
      ease: 'out(3)',
    });

  }, []);

  return (
    <div ref={rootRef} className="grid md:grid-cols-4 gap-3 mb-10">
      {MILESTONES.map((item) => (
        <div key={item.step} className="milestone-lane-card group rounded-xl border border-cyan-400/15 bg-[linear-gradient(160deg,rgba(15,23,42,0.7),rgba(2,6,23,0.7))] p-4 opacity-0 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/35">
          <div className="mb-3 flex items-center justify-between rounded-lg border border-white/10 bg-black/25 px-3 py-2">
            <p className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
              step {item.step}
            </p>
            <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-emerald-300">ready</span>
          </div>

          <h3 className="text-sm font-semibold text-cyan-300 mb-2 group-hover:text-cyan-200 transition-colors">{item.title}</h3>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {item.note}
          </p>

          <div className="mt-3 rounded-md border border-indigo-300/20 bg-indigo-500/8 px-3 py-2 font-mono text-[11px] text-indigo-200/90 group-hover:border-indigo-300/35 group-hover:bg-indigo-500/14 transition-colors">
            $ {item.command}
          </div>
        </div>
      ))}
    </div>
  );
}
