'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const SKILLS = [
  { cat: 'Frontend',       tags: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Anime.js', 'Matter.js', 'Canvas 2D', 'Astro', 'Nuxt.js'] },
  { cat: 'Backend & APIs', tags: ['Node.js', 'NestJS', 'FastAPI', 'Express', 'Python', 'REST APIs', 'Auth & RBAC', 'Webhooks'] },
  { cat: 'Data & Storage', tags: ['PostgreSQL', 'Prisma', 'Drizzle ORM', 'MongoDB', 'Supabase', 'Sanity CMS', 'Redis', 'DynamoDB'] },
  { cat: 'AI Engineering', tags: ['LLM Integrations', 'RAG Workflows', 'Prompt Engineering', 'Whisper', 'TTS Models', 'Hugging Face', 'Ollama', 'Pinecone'] },
  { cat: 'Cloud & DevOps', tags: ['AWS', 'Docker', 'Kubernetes Basics', 'CI/CD', 'Vercel', 'Lambda', 'Amplify', 'S3'] },
  { cat: 'Payments & CMS', tags: ['Razorpay', 'Stripe', 'Webhooks', 'Sanity', 'Subscriptions', 'Checkout Flows'] },
];

const SPEEDS = [52, 44, 58, 48, 54, 46]; // seconds per loop

export default function SkillsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const total = SKILLS.reduce((acc, s) => acc + s.tags.length, 0);

  return (
    <section id="skills" className="py-20 overflow-hidden" ref={ref}>
      {/* Header — constrained */}
      <div className="container mb-12">
        <motion.p
          className="body-text max-w-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          30+ tools across the full stack — every one used in a shipped product.
          No padding tools, no checkbox skills.
        </motion.p>
      </div>

      {/* Tape rows — full viewport width */}
      <div>
        {SKILLS.map((row, i) => {
          const isRTL = i % 2 === 1;
          // Triple for seamless looping at any viewport width
          const tripled = [...row.tags, ...row.tags, ...row.tags];
          const speed = SPEEDS[i];

          return (
            <motion.div
              key={row.cat}
              initial={{ opacity: 0, x: isRTL ? 40 : -40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.65, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
              className="skill-tape-row"
              style={{
                borderTop: '1px solid var(--rule)',
                display: 'flex',
                alignItems: 'center',
                padding: '0.6rem 0',
                position: 'relative',
              }}
            >
              {/* Category label — fixed left, overlaid */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 'clamp(110px, 14vw, 160px)',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 'clamp(1.5rem, 5vw, 5.5rem)',
                  zIndex: 2,
                  background: `linear-gradient(to right, var(--bg) 0%, var(--bg) 70%, transparent 100%)`,
                  pointerEvents: 'none',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-geist-mono), monospace',
                  fontSize: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.24em',
                  color: 'rgba(255,79,26,0.45)',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                }}>
                  <span style={{ color: 'rgba(255,79,26,0.25)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {row.cat}
                </span>
              </div>

              {/* Fade-out right edge */}
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: '80px',
                  background: `linear-gradient(to left, var(--bg) 0%, transparent 100%)`,
                  zIndex: 2,
                  pointerEvents: 'none',
                }}
              />

              {/* Scrolling tape */}
              <div style={{ overflow: 'hidden', width: '100%' }}>
                <div
                  className="skill-tape"
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    width: 'max-content',
                    paddingLeft: 'clamp(110px, 14vw, 160px)',
                    animationName: isRTL ? 'tapeRTL' : 'tapeLTR',
                    animationDuration: `${speed}s`,
                    animationTimingFunction: 'linear',
                    animationIterationCount: 'infinite',
                  }}
                >
                  {tripled.map((tag, j) => (
                    <span
                      key={`${tag}-${j}`}
                      className="skill-tag"
                      style={{ flexShrink: 0 }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
        <div style={{ borderTop: '1px solid var(--rule)' }} />
      </div>

      {/* Footer count */}
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{
            marginTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <span style={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: '9px',
            textTransform: 'uppercase',
            letterSpacing: '0.24em',
            color: 'var(--text-3)',
          }}>
            Total
          </span>
          <span style={{ flex: 1, height: '1px', background: 'var(--rule)' }} />
          <span style={{
            fontFamily: 'var(--font-heading), "Syne", sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            color: 'var(--accent)',
            letterSpacing: '-0.01em',
          }}>
            {total} skills · {SKILLS.length} categories
          </span>
        </motion.div>
      </div>
    </section>
  );
}
