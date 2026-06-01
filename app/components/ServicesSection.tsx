'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SERVICES = [
  {
    num: '01',
    title: 'Product Engineering',
    desc: 'From concept to deployment — balancing technical excellence with user experience and shipping velocity. I own the entire delivery cycle.',
    chips: ['Product Discovery', 'Execution Strategy', 'Delivery Ownership'],
    accent: 'var(--accent)',
  },
  {
    num: '02',
    title: 'Full-Stack Development',
    desc: 'End-to-end applications with React, Next.js, Node.js, and modern cloud infrastructure that scales from day one.',
    chips: ['Frontend Architecture', 'Backend Design', 'Platform Integration'],
    accent: 'var(--accent)',
  },
  {
    num: '03',
    title: 'AI & Machine Learning',
    desc: 'LLM integration, RAG systems, vector search, and ML inference pipelines — applied AI for real-world product features.',
    chips: ['Intelligent Workflows', 'Inference Pipelines', 'Applied AI'],
    accent: 'var(--accent)',
  },
  {
    num: '04',
    title: 'Cloud Architecture',
    desc: 'Scalable AWS solutions with Docker, CI/CD automation, and reliability engineering for production-grade systems.',
    chips: ['Scalable Infrastructure', 'Deployment Automation', 'Reliability'],
    accent: 'var(--accent)',
  },
  {
    num: '05',
    title: 'Security & DevOps',
    desc: 'Web security best practices, automated deployment pipelines, and quality gates that keep production stable.',
    chips: ['Security Hardening', 'Operational Quality', 'Release Discipline'],
    accent: 'var(--accent)',
  },
  {
    num: '06',
    title: 'Commerce & Content',
    desc: 'Subscription-ready product stacks with Stripe/Razorpay integrations, CMS operations, and secure checkout journeys.',
    chips: ['Checkout Experience', 'Subscription Flows', 'CMS Operations'],
    accent: 'var(--accent)',
  },
];

export default function ServicesSection() {
  const [open, setOpen] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="services" className="py-20">
      <div className="container">
        <motion.p
          className="body-text mb-12 max-w-lg"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Six capability areas — every one backed by shipped products.
          I own the full delivery, not just a layer.
        </motion.p>

        <div style={{ borderTop: '1px solid var(--rule)' }}>
          {SERVICES.map((svc, i) => {
            const isOpen = open === i;
            const isHov  = hovered === i;
            return (
              <motion.div
                key={svc.num}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: i * 0.055, ease: [0.16, 1, 0.3, 1] }}
                style={{ borderBottom: '1px solid var(--rule)', overflow: 'hidden', position: 'relative' }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Hover warm-wash */}
                <motion.div
                  style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(255,79,26,0.025)',
                    pointerEvents: 'none',
                  }}
                  animate={{ opacity: (isHov || isOpen) ? 1 : 0 }}
                  transition={{ duration: 0.22 }}
                />

                {/* Sliding bottom accent line */}
                <motion.div
                  style={{
                    position: 'absolute', bottom: 0, left: 0,
                    height: '1.5px',
                    background: 'linear-gradient(90deg, var(--accent) 0%, rgba(255,79,26,0.15) 70%, transparent 100%)',
                    transformOrigin: 'left',
                  }}
                  animate={{ scaleX: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: [0.16,1,0.3,1] }}
                />

                {/* Row trigger */}
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{
                    width: '100%', background: 'none', border: 'none', cursor: 'none',
                    display: 'flex', alignItems: 'center', gap: '1.5rem',
                    padding: '1.4rem 0', textAlign: 'left',
                    position: 'relative', zIndex: 1,
                  }}
                >
                  {/* Number — circle on open */}
                  <motion.span
                    animate={{
                      color: isOpen ? '#FF4F1A' : isHov ? 'var(--text-3)' : 'var(--text-3)',
                    }}
                    transition={{ duration: 0.2 }}
                    style={{
                      fontFamily: 'var(--font-geist-mono), monospace',
                      fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.2em',
                      flexShrink: 0, width: '28px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {isOpen ? (
                      <motion.span
                        layoutId={`svc-num-${i}`}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          width: '22px', height: '22px', borderRadius: '50%',
                          border: '1px solid rgba(255,79,26,0.4)',
                          background: 'rgba(255,79,26,0.06)',
                          fontSize: '8px', color: 'var(--accent)',
                        }}
                      >
                        {svc.num}
                      </motion.span>
                    ) : svc.num}
                  </motion.span>

                  {/* Accent bar */}
                  <motion.span
                    style={{
                      width: '3px', height: '24px', borderRadius: '2px',
                      background: 'var(--accent)', flexShrink: 0,
                    }}
                    animate={{ opacity: isOpen ? 1 : 0, scaleY: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                  />

                  {/* Title */}
                  <motion.span
                    animate={{
                      color: isOpen ? 'var(--text)' : isHov ? 'var(--text)' : 'var(--text-2)',
                      fontWeight: isOpen ? 700 : 600,
                    }}
                    transition={{ duration: 0.18 }}
                    style={{
                      fontFamily: 'var(--font-heading), "Syne", sans-serif',
                      fontSize: 'clamp(1.1rem, 2.2vw, 1.6rem)',
                      letterSpacing: '-0.025em',
                      flex: 1,
                    }}
                  >
                    {svc.title}
                  </motion.span>

                  {/* Arrow — rotates on open */}
                  <motion.span
                    animate={{
                      rotate: isOpen ? 45 : isHov ? 22 : 0,
                      color: isOpen ? 'var(--accent)' : isHov ? 'var(--text-2)' : 'var(--text-3)',
                    }}
                    transition={{ duration: 0.28, ease: [0.16,1,0.3,1] }}
                    style={{ fontFamily: 'var(--font-geist-mono)', fontSize: '14px', flexShrink: 0 }}
                  >
                    →
                  </motion.span>
                </button>

                {/* Expanded content */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: 'hidden', position: 'relative', zIndex: 1 }}
                    >
                      <div style={{
                        paddingLeft: 'calc(28px + 1.5rem + 3px + 1.5rem)',
                        paddingBottom: '1.75rem',
                        display: 'flex', flexWrap: 'wrap',
                        gap: '1.5rem', alignItems: 'flex-start',
                      }}>
                        <p style={{
                          fontSize: '15px', lineHeight: 1.75, color: 'var(--text-2)',
                          maxWidth: '520px', flex: '1 1 280px',
                        }}>
                          {svc.desc}
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                          {svc.chips.map((c, ci) => (
                            <motion.span
                              key={c}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: ci * 0.06, duration: 0.3 }}
                              style={{
                                fontFamily: 'var(--font-geist-mono), monospace',
                                fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.14em',
                                color: 'var(--accent)', border: '1px solid rgba(255,79,26,0.22)',
                                borderRadius: '2px', padding: '0.3rem 0.7rem',
                                background: 'rgba(255,79,26,0.05)',
                              }}
                            >
                              {c}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Quote */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--rule)',
            fontFamily: 'var(--font-heading), "Syne", sans-serif',
            fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', fontWeight: 500,
            letterSpacing: '-0.02em', color: 'var(--text-2)', fontStyle: 'italic',
          }}
        >
          &ldquo;Impress nobody, ship everything.&rdquo;
        </motion.p>
      </div>
    </section>
  );
}
