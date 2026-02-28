'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { animate, stagger } from 'animejs';
import { AnimatePresence, motion } from 'framer-motion';

type ExperienceChannel = {
  id: '01' | '02' | '03';
  company: string;
  role: string;
  location: string;
  periodLabel: string;
  category?: string;
  bullets: string[];
  signalStrength: number;
  metrics: string[];
  ticker: string;
  onAir?: boolean;
  activeRole?: boolean;
};

const CHANNELS: ExperienceChannel[] = [
  {
    id: '01',
    company: 'Ambalsoft',
    role: 'AIML Intern',
    location: 'Chennai',
    periodLabel: 'Sep 2025 – Oct 2025',
    bullets: [
      'Built Node.js conversational systems with RESTful microservices and MongoDB.',
      'Fine-tuned domain-specific LLMs using Hugging Face transformers.',
      'Architected local LLM inference with Ollama, containerized via Docker.',
      'Developed analytics platform with Streamlit and FastAPI dashboards.',
      'Implemented analytics data pipelines and backend endpoints in rapid delivery cycles to improve production reliability.',
      'Built evaluation workflows to compare model outputs and improve response quality across domain-specific tasks.',
      'Collaborated on iterative AIML feature rollouts with testing checkpoints for production stability.',
    ],
    signalStrength: 7,
    metrics: [
      'AI MODULES ACTIVE',
      'THREAT DETECTION ENABLED',
      'MODEL VALIDATION COMPLETE',
      'SECURITY ANALYSIS DEPLOYED',
    ],
    ticker: 'AI modules active • Threat detection enabled • Model validation complete • Security analysis deployed •',
  },
  {
    id: '02',
    company: 'Freelance Systems',
    role: 'Freelance Full-Stack Engineer',
    location: 'Remote',
    periodLabel: 'November 2025 – January 2026',
    bullets: [
      'Built and launched production platforms including sivacomics.com and essayraccoon.com.',
      'Developed frontend applications with Next.js and React for performance-focused user flows.',
      'Integrated Supabase authentication and data workflows for secure product operations.',
      'Implemented Razorpay payment APIs for checkout and transaction reliability.',
      'Architected AWS serverless backends with DynamoDB, Amplify, S3, and Lambda for scalable deployment.',
      'Designed reusable UI and API integration patterns to speed up feature delivery across multiple products.',
      'Handled deployment hardening and post-launch fixes to maintain uptime and improve production reliability.',
    ],
    signalStrength: 8,
    metrics: [
      'ARCHITECTURE COMPLEXITY HIGH',
      'CLOUD DEPLOYMENT ACTIVE',
      'PAYMENT INTEGRATION STABLE',
      'SERVERLESS BACKEND ENABLED',
    ],
    ticker: 'Architecture complexity high • Cloud deployment active • Payment integration stable • Serverless backend enabled •',
  },
  {
    id: '03',
    company: 'Pepul',
    role: 'Full Stack Intern',
    location: 'Startup Product Ecosystem',
    periodLabel: 'Feb 2026 – Present',
    category: 'Startup Product Ecosystem',
    bullets: [
      'Built startup-specific websites on high-velocity weekly cycles, from landing pages to full product surfaces.',
      'Worked across Next.js, React, Nuxt.js, Astro, and NestJS to match each product architecture and launch timeline.',
      'Used Supabase for backend workflows and Sanity CMS for flexible non-technical content operations.',
      'Integrated end-to-end payment experiences with Razorpay and Stripe, including subscriptions and checkout flows.',
      'Delivered rapid product iterations aligned with evolving startup requirements and release velocity.',
      'Coordinated quick QA-feedback-release loops with product stakeholders to ship stable updates under tight timelines.',
    ],
    signalStrength: 9,
    metrics: [
      'MULTI-STACK DEPLOYMENT ACTIVE',
      'STARTUP VELOCITY HIGH',
      'CMS WORKFLOWS OPTIMIZED',
      'LIVE PRODUCTION ENVIRONMENT',
    ],
    ticker: 'Multi-stack deployment active • Startup velocity high • CMS workflows optimized • Live production environment •',
    onAir: true,
    activeRole: true,
  },
];

export default function ExperienceBroadcastSection() {
  const rootRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const [activeChannel, setActiveChannel] = useState(2);
  const [pendingChannel, setPendingChannel] = useState<number | null>(null);
  const [isTuning, setIsTuning] = useState(false);

  const current = CHANNELS[activeChannel];

  useEffect(() => {
    if (!rootRef.current) return;

    const bars = rootRef.current.querySelectorAll('.signal-bar-active');
    const animation = animate(bars, {
      opacity: [0.55, 1],
      scaleY: [0.9, 1.05],
      duration: 900,
      loop: true,
      direction: 'alternate',
      delay: stagger(40),
      ease: 'inOutSine',
    });

    return () => {
      animation.pause();
    };
  }, [activeChannel]);

  useEffect(() => {
    if (!rootRef.current) return;

    const bullets = rootRef.current.querySelectorAll('.experience-tv-bullet');
    animate(bullets, {
      opacity: [0, 1],
      translateY: [10, 0],
      delay: stagger(55),
      duration: 330,
      ease: 'out(3)',
    });
  }, [activeChannel]);

  const switchChannel = useCallback((index: number) => {
    if (index === activeChannel || isTuning) return;

    setPendingChannel(index);
    setIsTuning(true);

    if (screenRef.current) {
      animate(screenRef.current, {
        opacity: [1, 0.82, 1, 0.9, 1],
        skewX: [0, 0.5, -0.45, 0],
        duration: 280,
        ease: 'inOutSine',
      });
    }

    window.setTimeout(() => {
      setActiveChannel(index);
    }, 280);

    window.setTimeout(() => {
      setPendingChannel(null);
      setIsTuning(false);
    }, 560);
  }, [activeChannel, isTuning]);

  useEffect(() => {
    if (isTuning) return;

    const timer = window.setTimeout(() => {
      switchChannel((activeChannel + 1) % CHANNELS.length);
    }, 10000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [activeChannel, isTuning, switchChannel]);

  return (
    <section id="experience" className="py-16">
      <div ref={rootRef} className="container">
        <div className="mb-6">
          <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Experience</h2>
          <p className="mt-2 text-sm" style={{ color: 'rgba(229, 231, 235, 0.72)' }}>
            Professional roles presented as broadcast channels.
          </p>
        </div>

        <div
          className="relative overflow-hidden rounded-xl border p-3 md:p-4"
          style={{
            borderColor: 'rgba(157, 78, 221, 0.4)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05), inset 0 -8px 18px rgba(0,0,0,0.45), 0 22px 48px rgba(0,0,0,0.5)',
          }}
        >
          <div className="pointer-events-none absolute -top-9 left-1/2 hidden -translate-x-1/2 md:block">
            <div className="relative h-10 w-24">
              <span
                className="absolute left-1/2 top-0 h-9 w-0.5 -translate-x-1/2"
                style={{ background: 'linear-gradient(180deg, rgba(229,231,235,0.75), rgba(157,78,221,0.55))', transform: 'rotate(-28deg)', transformOrigin: 'bottom center' }}
              />
              <span
                className="absolute left-1/2 top-0 h-9 w-0.5 -translate-x-1/2"
                style={{ background: 'linear-gradient(180deg, rgba(229,231,235,0.75), rgba(0,240,255,0.55))', transform: 'rotate(28deg)', transformOrigin: 'bottom center' }}
              />
              <span className="absolute left-1/2 bottom-0 h-2 w-16 -translate-x-1/2 rounded-full border" style={{ borderColor: 'rgba(157, 78, 221, 0.4)', background: 'rgba(10, 10, 15, 0.85)' }} />
            </div>
          </div>

          <div className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.14em]" style={{ borderColor: 'rgba(0, 240, 255, 0.35)', color: 'var(--accent)', background: 'rgba(10, 10, 15, 0.75)' }}>
            CRT BROADCAST UNIT
          </div>
          <span className="pointer-events-none absolute left-3 top-3 h-2 w-2 rounded-full" style={{ background: 'rgba(229, 231, 235, 0.3)' }} />
          <span className="pointer-events-none absolute right-3 top-3 h-2 w-2 rounded-full" style={{ background: 'rgba(229, 231, 235, 0.3)' }} />
          <span className="pointer-events-none absolute bottom-3 left-3 h-2 w-2 rounded-full" style={{ background: 'rgba(229, 231, 235, 0.24)' }} />
          <span className="pointer-events-none absolute bottom-3 right-3 h-2 w-2 rounded-full" style={{ background: 'rgba(229, 231, 235, 0.24)' }} />

          <div
            ref={screenRef}
            className="relative mt-6 min-h-140 overflow-hidden border p-4 pb-14 md:p-6 md:pb-16"
            style={{
              borderColor: 'rgba(157, 78, 221, 0.28)',
              background: 'radial-gradient(120% 140% at 50% 15%, rgba(18, 40, 58, 0.58), #0F1722 56%)',
              boxShadow: 'inset 0 0 42px rgba(0,0,0,0.52), inset 0 -10px 30px rgba(0,0,0,0.32)',
              transform: 'perspective(1200px) rotateX(1.2deg) scale(0.995)',
              transformOrigin: 'center center',
              borderRadius: '28px / 18px',
            }}
          >
            <div className="pointer-events-none absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.12), transparent 38%)' }} />
            <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(180deg, rgba(229,231,235,0.92) 0, rgba(229,231,235,0.92) 1px, transparent 1px, transparent 4px)' }} />
            <div className="pointer-events-none absolute inset-0" style={{ boxShadow: 'inset 0 0 70px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.04)', borderRadius: '22px' }} />
            <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(120% 88% at 50% 50%, transparent 55%, rgba(0,0,0,0.34) 100%)' }} />
            <div className="pointer-events-none absolute inset-x-[8%] top-0 h-8 rounded-b-[50%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.1), transparent)' }} />

            <AnimatePresence>
              {isTuning && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-40 flex flex-col items-center justify-center"
                  style={{ background: 'rgba(8, 10, 15, 0.86)', backdropFilter: 'blur(1px)' }}
                >
                  <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--accent)' }}>TUNING...</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.14em]" style={{ color: 'var(--text-primary)' }}>
                    LOADING CHANNEL {CHANNELS[pendingChannel ?? activeChannel].id}...
                  </p>
                  <div className="mt-4 h-1.5 w-44 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ x: '-100%' }}
                      animate={{ x: '120%' }}
                      transition={{ duration: 0.55, ease: 'linear', repeat: Infinity }}
                      className="h-full w-24"
                      style={{ background: 'linear-gradient(90deg, transparent, #00F0FF, transparent)' }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em]" style={{ color: 'var(--accent)', textShadow: '0.4px 0 rgba(0,240,255,0.45), -0.4px 0 rgba(157,78,221,0.35)' }}>
                    CHANNEL {current.id}
                  </p>
                  <p className="mt-1 text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>{current.company}</p>
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {current.onAir ? <span className="h-2 w-2 rounded-full bg-red-500" /> : null}
                    <span className="text-xs uppercase tracking-[0.12em]" style={{ color: 'var(--accent)' }}>{current.onAir ? 'LIVE' : 'BROADCAST'}</span>
                  </div>
                  <p className="mt-1 text-xs uppercase tracking-[0.12em]" style={{ color: 'rgba(229, 231, 235, 0.72)' }}>{current.periodLabel}</p>
                  <div className="mt-2 flex justify-end gap-1">
                    {Array.from({ length: 10 }).map((_, index) => {
                      const active = index < current.signalStrength;
                      return (
                        <span
                          key={index}
                          className={active ? 'signal-bar-active' : undefined}
                          style={{
                            width: '8px',
                            height: '10px',
                            borderRadius: '2px',
                            background: active ? '#00F0FF' : 'rgba(229, 231, 235, 0.18)',
                            boxShadow: active ? '0 0 8px rgba(0,240,255,0.45)' : 'none',
                            display: 'inline-block',
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  layout
                >
                  <h3 className="text-3xl font-bold leading-tight" style={{ color: 'var(--text-primary)', textShadow: '0.35px 0 rgba(0,240,255,0.28), -0.35px 0 rgba(157,78,221,0.22)' }}>
                    {current.role}
                  </h3>

                  {current.activeRole ? (
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs uppercase tracking-[0.12em]" style={{ borderColor: 'rgba(0, 240, 255, 0.45)', color: 'var(--accent)', background: 'rgba(0, 240, 255, 0.08)' }}>
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      ON AIR · ACTIVE ROLE
                    </div>
                  ) : null}

                  <ul className="mt-4 space-y-2">
                    {current.bullets.map((bullet) => (
                      <li key={bullet} className="experience-tv-bullet flex gap-2 text-sm" style={{ color: 'rgba(229, 231, 235, 0.84)' }}>
                        <span style={{ color: 'var(--accent)' }}>•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    {current.metrics.map((metric) => (
                      <div key={metric} className="rounded-md border px-3 py-2 text-xs uppercase tracking-[0.12em]" style={{ borderColor: 'rgba(157, 78, 221, 0.35)', color: 'var(--text-primary)', background: 'rgba(157, 78, 221, 0.08)' }}>
                        {metric}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="absolute inset-x-0 bottom-0 z-20 border-t py-2" style={{ borderColor: 'rgba(0, 240, 255, 0.25)', background: 'rgba(8, 10, 15, 0.68)' }}>
              <div className="tv-ticker-track whitespace-nowrap text-[11px] uppercase tracking-widest" style={{ color: 'rgba(229, 231, 235, 0.75)' }}>
                <span className="mx-4">{current.ticker}</span>
                <span className="mx-4">{current.ticker}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-md border px-3 py-2" style={{ borderColor: 'rgba(157, 78, 221, 0.34)', background: 'rgba(8, 10, 15, 0.72)' }}>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.12em]" style={{ color: 'rgba(229, 231, 235, 0.62)' }}>Volume</span>
              <div className="h-1.5 w-20 rounded-full" style={{ background: 'rgba(229, 231, 235, 0.15)' }}>
                <div className="h-full w-3/5 rounded-full" style={{ background: 'linear-gradient(90deg, rgba(157,78,221,0.65), rgba(0,240,255,0.8))' }} />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {CHANNELS.map((channel, index) => {
                const isActive = index === activeChannel;
                return (
                  <motion.button
                    key={`bar-${channel.id}`}
                    whileTap={{ scale: 0.98 }}
                    animate={{ scale: isActive ? 1.02 : 1 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => switchChannel(index)}
                    className="inline-flex h-7 items-center justify-center gap-1 rounded border px-2 text-[10px] font-semibold uppercase tracking-[0.08em]"
                    style={{
                      borderColor: isActive ? 'rgba(0, 240, 255, 0.55)' : 'rgba(157, 78, 221, 0.35)',
                      color: 'var(--text-primary)',
                      background: isActive ? 'rgba(0, 240, 255, 0.14)' : 'rgba(157, 78, 221, 0.08)',
                      boxShadow: isActive ? '0 0 10px rgba(0,240,255,0.2)' : 'none',
                    }}
                  >
                    <span className="font-mono">{channel.id}</span>
                    <span>{channel.company}</span>
                  </motion.button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              {['CH-', 'MENU', 'CH+'].map((label) => (
                <button key={label} type="button" className="inline-flex h-7 min-w-9 items-center justify-center rounded border px-2 text-[10px] font-semibold" style={{ borderColor: 'rgba(0, 240, 255, 0.32)', color: 'var(--text-primary)', background: 'rgba(0, 240, 255, 0.08)' }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .tv-ticker-track {
          display: inline-block;
          min-width: 200%;
          animation: tvTicker 17s linear infinite;
        }

        @keyframes tvTicker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
