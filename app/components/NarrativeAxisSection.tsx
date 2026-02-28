'use client';

import { useEffect, useRef, useState } from 'react';
import { animate } from 'animejs';

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
    animate(strips, {
      scaleX: [0.25, 1],
      opacity: [0.2, 1],
      duration: 520,
      delay: (_, i) => i * 90,
      ease: 'out(3)',
    });
  }, [active]);

  return (
    <section className="relative py-12">
      <div className="container">
        <div className="mb-6 rounded-2xl border border-cyan-400/15 bg-slate-900/25 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-300/80">Engineering Narrative</p>
          <p className="mt-3 text-sm max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
            A rotating execution axis showing how strategy becomes shipping code across discovery, architecture, delivery, and optimization.
          </p>
        </div>

        <div ref={rootRef} className="rounded-2xl border border-cyan-300/20 bg-slate-900/35 p-6">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6 items-start">
            <div className="space-y-2">
              {steps.map((step, index) => (
                <button
                  key={step.title}
                  onClick={() => setActive(index)}
                  className="w-full text-left rounded-lg border px-3 py-2 transition-colors"
                  style={{
                    borderColor: index === active ? 'rgba(94, 234, 212, 0.45)' : 'rgba(148, 163, 184, 0.2)',
                    background: index === active ? 'rgba(56, 189, 248, 0.08)' : 'rgba(2, 6, 23, 0.2)',
                    color: index === active ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{step.title}</span>
                    <span className="text-xs text-cyan-300/80">{step.metric.value}</span>
                  </div>
                  <p className="text-xs mt-1">{step.metric.label}</p>
                </button>
              ))}
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-cyan-300/80">{steps[active].highlight}</p>
              <h3 className="mt-2 text-2xl font-bold text-white">{steps[active].title}</h3>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {steps[active].content}
              </p>

              <div className="mt-5 space-y-2">
                <div className="axis-strip h-1 rounded-full bg-cyan-300/70 origin-left" style={{ width: '94%' }} />
                <div className="axis-strip h-1 rounded-full bg-sky-300/65 origin-left" style={{ width: '76%' }} />
                <div className="axis-strip h-1 rounded-full bg-indigo-300/55 origin-left" style={{ width: '62%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
