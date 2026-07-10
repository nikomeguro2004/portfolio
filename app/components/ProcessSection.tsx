'use client';

import { motion } from 'framer-motion';
import CardSwap, { Card } from './CardSwap';

const STEPS = [
  {
    num: '01',
    title: 'Scope',
    verb: 'Mapping Goals',
    desc: 'Defining technical requirements, system constraints, and success metrics. Eliminating ambiguity before a single line of code is written.',
    tags: ['Requirements', 'Risk Framing', 'Timeline'],
  },
  {
    num: '02',
    title: 'Architect',
    verb: 'Designing',
    desc: 'Selecting optimal tech stacks based on scale and velocity. Architecting robust data models, API contracts, and infrastructure topologies.',
    tags: ['Stack Selection', 'Data Modelling', 'API Design'],
  },
  {
    num: '03',
    title: 'Ship',
    verb: 'Deploying',
    desc: 'Executing high-velocity sprints to deliver production-ready software. Implementing strict CI/CD pipelines, automated testing, and zero-downtime deployments.',
    tags: ['Weekly Deploy', 'QA Gates', 'CI/CD'],
  },
  {
    num: '04',
    title: 'Improve',
    verb: 'Iterating',
    desc: 'Leveraging telemetry and analytics to drive continuous optimization. Resolving bottlenecks and scaling systems to meet growing user demands.',
    tags: ['Analytics', 'Performance', 'Iteration'],
  },
];

export default function ProcessSection() {
  return (
    <section id="process" className="py-20 overflow-hidden">
      <div className="container">
        {/* ── 2-col layout: left narrative + right CardSwap ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{
          gap: 'clamp(3rem, 6vw, 7rem)',
          alignItems: 'center',
        }}>
          {/* Left — narrative + step index */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="body-text mb-10 max-w-md">
              Structured for scale. My engineering workflow prioritizes bulletproof architecture, 
              rapid iteration, and measurable business impact on every deployment.
            </p>

            {/* Numbered step index */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2.2rem 1fr auto',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.9rem 0',
                    borderBottom: '1px solid var(--rule)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-geist-mono), monospace',
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.22em',
                      color: 'var(--accent)',
                      opacity: 0.6,
                    }}
                  >
                    {step.num}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-heading), "Syne", sans-serif',
                      fontSize: '1rem',
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                      color: 'var(--text)',
                    }}
                  >
                    {step.title}
                  </span>
                  <span className="label-mono" style={{ color: 'var(--text-3)' }}>
                    {step.verb}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Subtle callout */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{
                marginTop: '1.5rem',
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                color: 'var(--text-3)',
              }}
            >
              Steps 3 and 4 repeat until the job is done.
            </motion.p>
          </motion.div>

          {/* Right — CardSwap with process step cards — hidden on mobile */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'relative', height: '500px' }}
          >
            <CardSwap
              width={360}
              height={400}
              cardDistance={52}
              verticalDistance={60}
              delay={3500}
              pauseOnHover
              easing="elastic"
              skewAmount={5}
            >
              {STEPS.map((step) => (
                <Card key={step.num}>
                  <div
                    style={{
                      padding: '2rem 1.85rem',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                    }}
                  >
                    {/* Phase header */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        marginBottom: '1.75rem',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-geist-mono), monospace',
                          fontSize: '9px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.28em',
                          color: 'rgba(255,79,26,0.7)',
                        }}
                      >
                        {step.num}
                      </span>
                      <span
                        style={{
                          flex: 1,
                          height: '1px',
                          background: 'var(--rule)',
                        }}
                      />
                      <span
                        style={{
                          fontFamily: 'var(--font-geist-mono), monospace',
                          fontSize: '8px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.22em',
                          color: 'var(--text-3)',
                        }}
                      >
                        {step.verb}
                      </span>
                    </div>

                    {/* Step title */}
                    <h3
                      style={{
                        fontFamily: 'var(--font-heading), "Syne", sans-serif',
                        fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                        fontWeight: 800,
                        letterSpacing: '-0.05em',
                        lineHeight: 1,
                        color: 'var(--text)',
                        marginBottom: '1.1rem',
                      }}
                    >
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p
                      style={{
                        fontSize: '13px',
                        lineHeight: 1.8,
                        color: 'var(--text-2)',
                        flex: 1,
                      }}
                    >
                      {step.desc}
                    </p>

                    {/* Tags */}
                    <div
                      style={{
                        marginTop: '1.5rem',
                        paddingTop: '1.25rem',
                        borderTop: '1px solid var(--rule)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.35rem',
                      }}
                    >
                      {step.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontFamily: 'var(--font-geist-mono), monospace',
                            fontSize: '8px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.18em',
                            color: 'var(--accent)',
                            border: '1px solid var(--accent-border)',
                            borderRadius: '2px',
                            padding: '0.2rem 0.5rem',
                            background: 'var(--accent-dim)',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </CardSwap>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
