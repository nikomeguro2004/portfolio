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
    }, 4600);
    return () => window.clearInterval(timer);
  }, [steps.length]);

  useEffect(() => {
    if (!rootRef.current) return;
    const widgets = rootRef.current.querySelectorAll('.axis-widget');
    const nodes = rootRef.current.querySelectorAll('.axis-node');

    animate(widgets, {
      translateY: [12, 0],
      opacity: [0.2, 1],
      duration: 420,
      delay: (_, i) => i * 80,
      ease: 'out(3)',
    });

    animate(nodes, {
      scale: [0.96, 1.04],
      opacity: [0.7, 1],
      delay: stagger(90),
      duration: 560,
      ease: 'inOut(3)',
    });
  }, [active]);

  return (
    <section className="relative py-12">
      <div className="container">
        <div className="mb-6 rounded-2xl border border-cyan-400/15 bg-slate-900/25 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-300/80">Delivery Framework</p>
          <p className="mt-3 text-sm max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
            A structured workflow from planning to optimization, with clear checkpoints at each stage.
          </p>
        </div>

        <div ref={rootRef} className="rounded-2xl border border-cyan-300/20 bg-slate-950/60 p-6">
          <div className="grid lg:grid-cols-[1.05fr_1.2fr] gap-7 items-start">
            <div className="space-y-2.5 rounded-xl border border-white/10 bg-black/25 p-3">
              <p className="text-[11px] uppercase tracking-[0.14em] text-cyan-200/80">Editor Tabs</p>
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

            <div className="rounded-xl border border-indigo-300/20 bg-indigo-500/5 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-cyan-300/80">{steps[active].highlight}</p>
              <h3 className="mt-2 text-2xl font-bold text-white">{steps[active].title}</h3>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {steps[active].content}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {steps.map((step, index) => (
                  <div key={`${step.title}-widget`} className="axis-widget rounded-lg border border-cyan-300/15 bg-black/20 px-3 py-3 text-center opacity-70">
                    <p className="text-[10px] uppercase tracking-[0.12em]" style={{ color: 'var(--text-tertiary)' }}>pass</p>
                    <p className="mt-1 text-sm font-semibold" style={{ color: index === active ? 'rgb(103 232 249)' : 'var(--text-secondary)' }}>
                      {step.metric.value}
                    </p>
                  </div>
                ))}
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
