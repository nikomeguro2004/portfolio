'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SERVICES = [
  {
    num: '01',
    title: 'Product Engineering',
    desc: 'Translate business requirements into scalable architectures. Delivering complete, production-ready systems from concept to deployment with absolute ownership.',
    chips: ['Scoping', 'Full Delivery', 'Launch'],
    metric: '12+ shipped',
  },
  {
    num: '02',
    title: 'Full-Stack Development',
    desc: 'Architecting high-performance web applications. Building resilient backend services and robust APIs that scale to meet enterprise demands.',
    chips: ['Frontend', 'Backend', 'Databases'],
    metric: '30+ tools',
  },
  {
    num: '03',
    title: 'AI Integration',
    desc: 'Integrating advanced machine learning and generative AI workflows into production systems. Turning complex models into tangible business value.',
    chips: ['LLM Wiring', 'RAG Pipelines', 'OpenAI / Ollama'],
    metric: 'LLMs + RAG',
  },
  {
    num: '04',
    title: 'Cloud & DevOps',
    desc: 'Designing secure, high-availability infrastructure. Automating deployments and establishing reliable CI/CD pipelines to guarantee zero-downtime scalability.',
    chips: ['AWS', 'Docker', 'CI/CD'],
    metric: 'AWS + Docker',
  },
  {
    num: '05',
    title: 'Security & Auth',
    desc: 'Implementing robust authentication and authorization frameworks from day one. Ensuring data integrity and compliance across all system boundaries.',
    chips: ['Auth & RBAC', 'Secure APIs', 'Supabase / NextAuth'],
    metric: 'Zero breaches',
  },
  {
    num: '06',
    title: 'Payments & CMS',
    desc: 'Integrating enterprise billing solutions and headless CMS platforms. Building resilient, event-driven architectures for seamless financial operations.',
    chips: ['Stripe / Razorpay', 'Subscriptions', 'Sanity CMS'],
    metric: 'Stripe + CMS',
  },
];

export default function ServicesSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="services" className="py-20 overflow-hidden">
      <div className="container">
        <motion.p
          className="body-text mb-10 max-w-lg"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Core competencies driving production value. Specialized expertise forged through 
          architecting and shipping complex systems.
        </motion.p>
      </div>

      {/* Full-width service rows (not constrained by container on right) */}
      <div style={{ borderTop: '1px solid var(--rule)' }}>
        {SERVICES.map((svc, i) => {
          const isHov = hovered === i;
          const isDim = hovered !== null && !isHov;

          return (
            <motion.div
              key={svc.num}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              animate={{ opacity: isDim ? 0.18 : 1 }}
              transition={{ duration: 0.22 }}
              style={{
                borderBottom: '1px solid var(--rule)',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'default',
              }}
            >
              {/* Giant ghost number — slides in from right on hover */}
              <motion.div
                animate={{
                  opacity: isHov ? 1 : 0,
                  x: isHov ? 0 : 80,
                }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                aria-hidden
                style={{
                  position: 'absolute',
                  right: '-0.08em',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontFamily: 'var(--font-heading), "Syne", sans-serif',
                  fontSize: 'clamp(6rem, 18vw, 16rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.06em',
                  lineHeight: 1,
                  color: 'var(--text)',
                  opacity: 0.038,
                  pointerEvents: 'none',
                  userSelect: 'none',
                  zIndex: 0,
                }}
              >
                {svc.num}
              </motion.div>

              {/* Accent left bar — draws down on hover */}
              <motion.div
                animate={{ scaleY: isHov ? 1 : 0 }}
                initial={{ scaleY: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'absolute',
                  left: 0, top: 0, bottom: 0,
                  width: '2px',
                  background: 'linear-gradient(180deg, var(--accent) 0%, rgba(255,79,26,0.12) 100%)',
                  transformOrigin: 'top',
                  zIndex: 2,
                }}
              />

              {/* Warm wash bg on hover */}
              <motion.div
                animate={{ opacity: isHov ? 1 : 0 }}
                transition={{ duration: 0.25 }}
                style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(255,79,26,0.022)',
                  pointerEvents: 'none',
                  zIndex: 0,
                }}
              />

              {/* Container-scoped content */}
              <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <motion.div
                  animate={{
                    paddingTop: isHov ? '2.25rem' : '1.5rem',
                    paddingBottom: isHov ? '2.25rem' : '1.5rem',
                  }}
                  transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                  }}
                >
                  {/* Number */}
                  <motion.span
                    animate={{ color: isHov ? 'var(--accent)' : 'var(--text-3)' }}
                    transition={{ duration: 0.2 }}
                    style={{
                      fontFamily: 'var(--font-geist-mono), monospace',
                      fontSize: '9px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.22em',
                      flexShrink: 0,
                      width: '2rem',
                    }}
                  >
                    {svc.num}
                  </motion.span>

                  {/* Accent bar — pulse on hover */}
                  <motion.span
                    animate={{ scaleY: isHov ? 1 : 0.3, opacity: isHov ? 1 : 0 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      width: '2px',
                      height: '32px',
                      background: 'var(--accent)',
                      flexShrink: 0,
                      borderRadius: '1px',
                    }}
                  />

                  {/* Title + description block */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <motion.span
                      animate={{
                        fontSize: isHov
                          ? 'clamp(1.75rem, 4.2vw, 3.5rem)'
                          : 'clamp(1.1rem, 2.2vw, 1.65rem)',
                        color: isHov ? 'var(--text)' : 'var(--text-2)',
                      }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        fontFamily: 'var(--font-heading), "Syne", sans-serif',
                        fontWeight: 700,
                        letterSpacing: '-0.03em',
                        lineHeight: 1.05,
                        display: 'block',
                      }}
                    >
                      {svc.title}
                    </motion.span>

                    {/* Expanded content */}
                    <AnimatePresence>
                      {isHov && (
                        <motion.div
                          initial={{ opacity: 0, y: 12, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: 'auto' }}
                          exit={{ opacity: 0, y: 6, height: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          style={{ overflow: 'hidden' }}
                        >
                          <p style={{
                            marginTop: '0.7rem',
                            fontSize: '14px',
                            lineHeight: 1.8,
                            color: 'var(--text-3)',
                            maxWidth: '500px',
                          }}>
                            {svc.desc}
                          </p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.9rem' }}>
                            {svc.chips.map((chip, ci) => (
                              <motion.span
                                key={chip}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: ci * 0.07, duration: 0.28 }}
                                className="skill-tag"
                              >
                                {chip}
                              </motion.span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Metric + arrow — hidden on mobile to prevent overflow */}
                  <div className="hidden sm:flex" style={{ flexShrink: 0, flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem' }}>
                    <motion.span
                      animate={{ opacity: isHov ? 1 : 0, y: isHov ? 0 : 4 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        fontFamily: 'var(--font-geist-mono), monospace',
                        fontSize: '9px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        color: 'var(--accent)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {svc.metric}
                    </motion.span>
                    <motion.span
                      animate={{
                        rotate: isHov ? 45 : 0,
                        color: isHov ? 'var(--accent)' : 'var(--text-3)',
                      }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      style={{ fontFamily: 'var(--font-geist-mono)', fontSize: '18px' }}
                    >
                      →
                    </motion.span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quote */}
      <div className="container">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            marginTop: '3rem',
            paddingTop: '2rem',
            borderTop: '1px solid var(--rule)',
            fontFamily: 'var(--font-heading), "Syne", sans-serif',
            fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
            fontWeight: 500,
            letterSpacing: '-0.02em',
            color: 'var(--text-2)',
            fontStyle: 'italic',
          }}
        >
          &ldquo;Architecture is about optimizing for change. Build systems that scale, and products that endure.&rdquo;
        </motion.p>
      </div>
    </section>
  );
}
