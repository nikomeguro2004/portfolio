'use client';

import { motion } from 'framer-motion';

const ROLES = [
  {
    company: 'Pepul',
    role: 'Full Stack Intern',
    period: 'Feb 2026 — Present',
    location: 'Startup Ecosystem',
    current: true,
    bullets: [
      'Built startup websites on high-velocity weekly cycles — landing pages to full product surfaces.',
      'Worked across Next.js, React, Nuxt.js, Astro, and NestJS matching each product architecture.',
      'Supabase backend workflows and Sanity CMS for flexible content operations.',
      'Integrated Razorpay and Stripe end-to-end — subscriptions, checkout, webhooks.',
    ],
    tags: ['Next.js', 'NestJS', 'Supabase', 'Sanity', 'Razorpay', 'Stripe'],
  },
  {
    company: 'Shivante',
    role: 'Full-Stack Lead Developer',
    period: 'Feb 2026 — Present',
    location: 'Remote',
    current: true,
    bullets: [
      'Led end-to-end development of an enterprise CA practice management SaaS as a 2-person team.',
      'Built AI-assisted workflows for ITR preparation, GST reconciliation, and compliance reporting.',
      'Architected a dual-ORM data layer (Prisma + Drizzle) across PostgreSQL and SQL Server for complex financial schemas.',
      'Delivered a fully offline-capable PWA and integrated IoT-adjacent automation pipelines.',
    ],
    tags: ['Next.js', 'Prisma', 'Drizzle', 'PostgreSQL', 'AI Integration', 'IoT', 'PWA', 'TypeScript'],
  },
  {
    company: 'Freelance',
    role: 'Full-Stack Engineer',
    period: 'Nov 2025 — Jan 2026',
    location: 'Remote',
    current: false,
    bullets: [
      'Built and launched sivacomics.com and essayraccoon.com in production.',
      'Next.js frontend, Supabase auth, Razorpay payments, AWS serverless backends.',
    ],
    tags: ['Next.js', 'AWS', 'Supabase', 'Razorpay', 'Serverless'],
  },
  {
    company: 'Ambalsoft',
    role: 'AIML Intern',
    period: 'Sep 2025 — Oct 2025',
    location: 'Chennai',
    current: false,
    bullets: [
      'Fine-tuned domain-specific LLMs using Hugging Face transformers.',
      'Local LLM inference with Ollama, containerised via Docker.',
      'Analytics platform with Streamlit and FastAPI dashboards.',
    ],
    tags: ['LLMs', 'Hugging Face', 'Ollama', 'Docker', 'FastAPI'],
  },
];

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-20">
      <div className="container">
        <motion.p
          className="body-text mb-16 max-w-lg"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Four companies in 18 months. Joined when things needed to ship,
          left having shipped them.
        </motion.p>

        <div>
          {ROLES.map((role, i) => (
            <motion.div
              key={role.company}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'relative',
                paddingLeft: '1.5rem',
                paddingTop: i === 0 ? '0' : '3.5rem',
                paddingBottom: '3.5rem',
                borderBottom: i < ROLES.length - 1 ? '1px solid var(--rule)' : 'none',
              }}
            >
              {/* Left accent bar for current role */}
              {role.current && (
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.16,1,0.3,1] }}
                  style={{
                    position: 'absolute', left: 0, top: 0,
                    width: '2px',
                    background: 'linear-gradient(180deg, var(--accent) 0%, rgba(255,79,26,0.1) 100%)',
                  }}
                />
              )}

              {/* Top row: company name + period */}
              <div style={{ marginBottom: '0.5rem' }}>
                {/* Company + role label — stack on mobile */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                  <h3 style={{
                    fontFamily: 'var(--font-heading), "Syne", sans-serif',
                    fontSize: 'clamp(1.75rem, 5vw, 3.5rem)',
                    fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1,
                    color: role.current ? 'var(--text)' : 'var(--text-2)',
                  }}>
                    {role.company}
                  </h3>
                  <span style={{
                    fontFamily: 'var(--font-geist-mono), monospace',
                    fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.22em',
                    color: role.current ? 'var(--accent)' : 'var(--text-3)',
                  }}>
                    {role.role}
                  </span>
                </div>
                {/* Period + location + current badge — always on its own row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  {role.current && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ width:'5px',height:'5px',borderRadius:'50%',background:'var(--accent)' }} className="animate-pulse" />
                      <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--accent)' }}>Current</span>
                    </div>
                  )}
                  <p className="label-mono">{role.period}</p>
                  <p className="label-mono">{role.location}</p>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', background: 'var(--rule)', margin: '1.25rem 0' }} />

              {/* Bullets + Tags in two columns */}
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px]" style={{ gap: '1.25rem', alignItems: 'start' }}>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {role.bullets.map(b => (
                    <li key={b} style={{ display: 'flex', gap: '0.75rem', fontSize: '15px', color: 'var(--text-2)', lineHeight: 1.7 }}>
                      <span style={{ color: 'var(--accent)', opacity: 0.45, flexShrink: 0, marginTop: '0.15em' }}>—</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'flex-end' }}>
                  {role.tags.map(tag => (
                    <span key={tag} className="skill-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
