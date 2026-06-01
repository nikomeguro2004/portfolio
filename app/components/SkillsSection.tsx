'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const SKILLS = [
  { cat: 'Frontend',       tags: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Anime.js', 'Matter.js', 'Canvas 2D', 'Astro', 'Nuxt.js'] },
  { cat: 'Backend & APIs', tags: ['Node.js', 'NestJS', 'FastAPI', 'Express', 'Python', 'REST APIs', 'Auth & RBAC', 'Webhooks'] },
  { cat: 'Data & Storage', tags: ['PostgreSQL', 'Prisma', 'Drizzle ORM', 'MongoDB', 'Supabase', 'Sanity CMS', 'Redis', 'DynamoDB'] },
  { cat: 'AI Engineering', tags: ['LLM Integrations', 'RAG Workflows', 'Prompt Engineering', 'Whisper', 'TTS Models', 'Hugging Face', 'Ollama', 'Pinecone'] },
  { cat: 'Cloud & DevOps', tags: ['AWS', 'Docker', 'Kubernetes Basics', 'CI/CD', 'Vercel', 'Lambda', 'Amplify', 'S3'] },
  { cat: 'Payments & CMS', tags: ['Razorpay', 'Stripe', 'Webhooks', 'Sanity', 'Subscriptions', 'Checkout Flows'] },
];

export default function SkillsSection() {
  const [activeRow, setActiveRow] = useState<number | null>(null);

  return (
    <section id="skills" className="py-20">
      <div className="container">
        <motion.p
          className="body-text mb-12 max-w-lg"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          30+ tools across the full stack — every one used in a shipped product.
          No padding tools, no checkbox skills.
        </motion.p>

        <div style={{ borderTop: '1px solid var(--rule)' }}>
          {SKILLS.map((row, i) => {
            const isActive = activeRow === i;
            return (
              <motion.div
                key={row.cat}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setActiveRow(i)}
                onMouseLeave={() => setActiveRow(null)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '160px 1fr auto',
                  gap: '1.5rem',
                  alignItems: 'center',
                  padding: '1.1rem 0.75rem',
                  borderBottom: '1px solid var(--rule)',
                  borderRadius: '4px',
                  margin: '0 -0.75rem',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'background 0.2s',
                  background: isActive ? 'rgba(255,79,26,0.03)' : 'transparent',
                }}
                className="sm:grid-cols-[200px_1fr_auto]"
              >
                {/* Hover accent left edge */}
                <motion.div
                  style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    width: '2px',
                    background: 'var(--accent)',
                    transformOrigin: 'top',
                  }}
                  animate={{ scaleY: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.25, ease: [0.16,1,0.3,1] }}
                />

                {/* Category label */}
                <span style={{
                  fontFamily: 'var(--font-geist-mono), monospace',
                  fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.22em',
                  color: isActive ? 'var(--text-2)' : 'var(--text-3)',
                  flexShrink: 0,
                  transition: 'color 0.2s',
                }}>
                  <span style={{
                    color: isActive ? 'rgba(255,79,26,0.7)' : 'rgba(255,79,26,0.35)',
                    marginRight: '0.5rem',
                    transition: 'color 0.2s',
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {row.cat}
                </span>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {row.tags.map((tag, j) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.88 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.28, delay: i * 0.04 + j * 0.025 }}
                      className="skill-tag"
                      style={isActive ? {
                        borderColor: 'rgba(255,79,26,0.2)',
                        color: 'var(--text)',
                        background: 'rgba(255,79,26,0.04)',
                      } : {}}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>

                {/* Count badge */}
                <motion.span
                  animate={{ opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    fontFamily: 'var(--font-geist-mono), monospace',
                    fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.18em',
                    color: 'rgba(255,79,26,0.5)',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {row.tags.length} tools
                </motion.span>
              </motion.div>
            );
          })}
        </div>

        {/* Total count */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{
            marginTop: '1.5rem',
            display: 'flex', alignItems: 'center', gap: '1rem',
          }}
        >
          <span style={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.24em',
            color: 'var(--text-3)',
          }}>
            Total
          </span>
          <span style={{ flex: 1, height: '1px', background: 'var(--rule)' }} />
          <span style={{
            fontFamily: 'var(--font-heading), "Syne", sans-serif',
            fontSize: '13px', fontWeight: 700,
            color: 'var(--accent)', letterSpacing: '-0.01em',
          }}>
            {SKILLS.reduce((acc, s) => acc + s.tags.length, 0)} skills across {SKILLS.length} categories
          </span>
        </motion.div>
      </div>
    </section>
  );
}
