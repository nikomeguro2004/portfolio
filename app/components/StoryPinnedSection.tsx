'use client';

import { useEffect, useRef, useState } from 'react';
import { animate } from 'animejs';

interface Step {
  title: string;
  content: string;
  highlight?: string;
  icon?: React.ReactNode;
  metric?: { value: string; label: string };
  weight?: number;
  animationType?: 'slide' | 'scale' | 'fade' | 'snap';
}

interface StoryPinnedSectionProps {
  children?: React.ReactNode;
  steps: Step[];
  className?: string;
  title?: string;
  subtitle?: string;
}

function animateStepContent(stepEl: HTMLElement, animationType: Step['animationType']) {
  const content = stepEl.querySelector('.step-content') as HTMLElement | null;
  const highlight = stepEl.querySelector('.step-highlight') as HTMLElement | null;
  const metric = stepEl.querySelector('.step-metric') as HTMLElement | null;

  if (!content) return;

  if (animationType === 'scale') {
    animate(content, { opacity: [0, 1], scale: [0.95, 1], duration: 420, ease: 'out(4)' });
  } else if (animationType === 'fade') {
    animate(content, { opacity: [0, 1], duration: 460, ease: 'out(3)' });
  } else if (animationType === 'snap') {
    animate(content, {
      opacity: [0, 1],
      translateX: [-20, 0],
      filter: ['blur(3px)', 'blur(0px)'],
      duration: 320,
      ease: 'out(4)',
    });
  } else {
    animate(content, { opacity: [0, 1], translateX: [-16, 0], duration: 380, ease: 'out(3)' });
  }

  if (highlight) {
    animate(highlight, { opacity: [0, 1], translateY: [8, 0], duration: 320, delay: 80, ease: 'out(3)' });
  }

  if (metric) {
    animate(metric, { opacity: [0, 1], scale: [0.92, 1], duration: 320, delay: 120, ease: 'out(3)' });
  }
}

export default function StoryPinnedSection({ children, steps, className = '', title, subtitle }: StoryPinnedSectionProps) {
  const progressRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (!visibleEntries.length) return;

        const index = Number((visibleEntries[0].target as HTMLElement).dataset.index || 0);
        setActiveStep(index);
      },
      {
        root: null,
        threshold: [0.3, 0.5, 0.7],
        rootMargin: '-10% 0px -20% 0px',
      }
    );

    stepRefs.current.forEach((stepEl) => {
      if (stepEl) observer.observe(stepEl);
    });

    return () => observer.disconnect();
  }, [steps]);

  useEffect(() => {
    stepRefs.current.forEach((stepEl, index) => {
      if (!stepEl) return;

      const isActive = index === activeStep;

      animate(stepEl, {
        opacity: isActive ? 1 : 0.42,
        translateX: isActive ? 6 : 0,
        scale: isActive ? 1 : 0.98,
        duration: 300,
        ease: 'out(3)',
      });

      if (isActive) {
        animateStepContent(stepEl, steps[index].animationType);
      }
    });

    if (progressRef.current) {
      const progress = steps.length > 1 ? activeStep / (steps.length - 1) : 1;
      animate(progressRef.current, {
        height: `${Math.max(8, progress * 100)}%`,
        duration: 280,
        ease: 'out(3)',
      });
    }
  }, [activeStep, steps]);

  return (
    <div className={`relative ${className}`}>
      <div className="container">
        {(title || subtitle) && (
          <div className="mb-12">
            {subtitle && (
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-12 bg-linear-to-r from-cyan-400 to-sky-500" />
                <span className="text-cyan-400 font-medium text-sm uppercase tracking-wider">{subtitle}</span>
              </div>
            )}
            {title && <h2 className="text-3xl md:text-4xl font-bold text-white">{title}</h2>}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10">
              <div ref={progressRef} className="w-full bg-linear-to-b from-cyan-400 to-sky-500" style={{ height: '8%' }} />
            </div>

            <div className="space-y-6 pl-12">
              {steps.map((step, index) => {
                const isActive = activeStep === index;

                return (
                  <div
                    key={step.title}
                    ref={(el) => {
                      stepRefs.current[index] = el;
                    }}
                    data-index={index}
                    className="pinned-step relative p-6 rounded-xl transition-all duration-300 narrative-step"
                    style={{
                      background: isActive ? 'rgba(56, 189, 248, 0.08)' : 'rgba(56, 189, 248, 0.02)',
                      border: `1px solid ${isActive ? 'rgba(56, 189, 248, 0.25)' : 'rgba(56, 189, 248, 0.08)'}`,
                    }}
                  >
                    <div
                      className="absolute -left-8 top-6 w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300"
                      style={{
                        background: activeStep >= index ? 'linear-gradient(135deg, var(--accent), var(--accent-secondary))' : 'var(--border)',
                        boxShadow: isActive ? '0 0 18px rgba(56, 189, 248, 0.65)' : 'none',
                      }}
                    >
                      {activeStep > index && (
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))', color: 'var(--background)' }}
                      >
                        {index + 1}
                      </span>
                      <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                    </div>

                    <p className="step-content" style={{ color: 'var(--text-secondary)' }}>
                      {step.content}
                    </p>

                    {step.highlight && (
                      <div className="step-highlight mt-3 px-3 py-2 rounded-lg text-sm font-medium inline-block" style={{ background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent)' }}>
                        {step.highlight}
                      </div>
                    )}

                    {step.metric && (
                      <div className="step-metric mt-4 flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-gradient">{step.metric.value}</span>
                        <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                          {step.metric.label}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:sticky lg:top-24 flex items-start justify-center min-h-110 relative narrative-visual-shell">{children}</div>
        </div>
      </div>
    </div>
  );
}
