'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, stagger } from 'animejs';

interface Step {
  title: string;
  content: string;
  highlight: string;
  metric: { value: string; label: string };
}

interface NarrativeAxisSectionProps {
  steps: Step[];
}

export default function NarrativeAxisSection({ steps }: NarrativeAxisSectionProps) {
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((prev) => (prev + 1) % steps.length);
    }, 2200);
    return () => window.clearInterval(timer);
  }, [steps.length]);

  useEffect(() => {
    if (!rootRef.current) return;
    const strips = rootRef.current.querySelectorAll('.axis-strip');
    const nodes = rootRef.current.querySelectorAll('.axis-node');

    animate(strips, {
      scaleX: [0.25, 1],
      opacity: [0.2, 1],
      duration: 420,
      delay: (_, i) => i * 80,
      ease: 'out(3)',
    });

    animate(nodes, {
      scale: [0.8, 1.2],
      opacity: [0.3, 1],
      delay: stagger(90),
      duration: 1300,
      direction: 'alternate',
      loop: true,
      ease: 'inOut(3)',
    });
  }, [active]);

  return (
    <section className="relative py-12">
      <div className="container">
        <div className="mb-6 rounded-2xl border border-cyan-400/15 bg-slate-900/25 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-300/80">Operation Lanes</p>
          <p className="mt-3 text-sm max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
            Strategy-to-shipping flow rendered as a control lane where each phase has measurable handoff and engineering intent.
          </p>
        </div>

        <div ref={rootRef} className="rounded-2xl border border-cyan-300/20 bg-slate-900/35 p-6">
          <div className="grid lg:grid-cols-[1.05fr_1.2fr] gap-7 items-start">
            <div className="space-y-2.5">
              {steps.map((step, index) => (
                <button
                  key={step.title}
                  onClick={() => setActive(index)}
                  className="w-full text-left rounded-xl border px-3 py-3 transition-colors"
                  style={{
                    borderColor: index === active ? 'rgba(94, 234, 212, 0.45)' : 'rgba(148, 163, 184, 0.2)',
                    background: index === active ? 'rgba(56, 189, 248, 0.08)' : 'rgba(2, 6, 23, 0.2)',
                    color: index === active ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold">{step.title}</span>
                    <span className="rounded-md border border-cyan-300/25 bg-cyan-400/10 px-2 py-0.5 text-xs text-cyan-200">{step.metric.value}</span>
                  </div>
                  <p className="mt-1 text-xs">{step.metric.label}</p>
                </button>
              ))}
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-cyan-300/80">{steps[active].highlight}</p>
              <h3 className="mt-2 text-2xl font-bold text-white">{steps[active].title}</h3>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {steps[active].content}
              </p>

              <div className="mt-5 space-y-2.5">
                <div className="axis-strip h-1 rounded-full bg-cyan-300/70 origin-left" style={{ width: `${88 + active * 2}%` }} />
                <div className="axis-strip h-1 rounded-full bg-sky-300/65 origin-left" style={{ width: `${68 + active * 6}%` }} />
                <div className="axis-strip h-1 rounded-full bg-indigo-300/55 origin-left" style={{ width: `${56 + active * 7}%` }} />
              </div>

              <div className="mt-5 flex items-center gap-2.5">
                {steps.map((step, index) => (
                  <button
                    key={step.title + 'dot'}
                    onClick={() => setActive(index)}
                    className="axis-node h-2.5 w-2.5 rounded-full transition-all"
                    style={{
                      background: index === active ? 'rgba(103, 232, 249, 1)' : 'rgba(56, 189, 248, 0.5)',
                      boxShadow: index === active ? '0 0 10px rgba(56, 189, 248, 0.8)' : 'none',
                    }}
                    aria-label={`Go to ${step.title}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
