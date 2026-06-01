'use client';

import { motion } from 'framer-motion';
import SiteFooter from './SiteFooter';

const SOCIALS = [
  { label: 'GitHub',   href: 'https://github.com/nikomeguro2004',                handle: 'nikomeguro2004'    },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/adityan-suresh-781116256', handle: 'adityan-suresh'    },
  { label: 'Email',    href: 'mailto:adihere2000@gmail.com',                     handle: 'adihere2000@gmail.com' },
];

const DETAILS = [
  { label: 'Response',     value: 'Within 24 hours'        },
  { label: 'Availability', value: 'Internship / Full-time' },
  { label: 'Mode',         value: 'Async-first'            },
  { label: 'Focus',        value: 'Full-Stack + AI'        },
];

export default function ContactBlock() {
  return (
    <>
      <section
        id="contact"
        style={{
          background: '#141210',
          color: '#F5F1E8',
          padding: 'clamp(4rem, 8vw, 8rem) 0 clamp(3rem, 6vw, 6rem)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Dot grid */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(rgba(255,79,26,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px', zIndex: 0,
        }} />

        {/* Ambient orb */}
        <div style={{
          position: 'absolute', top: '-20%', right: '-10%',
          width: '60vw', height: '60vw', maxWidth: '600px', maxHeight: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,79,26,0.09) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1440px', margin: '0 auto', padding: '0 clamp(1rem, 4vw, 4rem)' }}>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginBottom: 'clamp(2.5rem, 5vw, 5rem)' }}
          >
            <p style={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em',
              color: 'rgba(255,79,26,0.55)', marginBottom: '1.25rem',
            }}>
              07 / Contact
            </p>
            <h2 style={{
              fontFamily: 'var(--font-heading), "Syne", sans-serif',
              fontSize: 'clamp(2.5rem, 8vw, 6.5rem)',
              fontWeight: 800, letterSpacing: '-0.045em', lineHeight: 0.92,
              color: '#F5F1E8', maxWidth: '16ch',
            }}>
              Have a Deadline?{' '}
              <span style={{ color: 'var(--accent)' }}>Let&apos;s Ship It.</span>
            </h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16,1,0.3,1] }}
              style={{
                marginTop: '1.75rem', height: '2px', maxWidth: '380px',
                background: 'linear-gradient(90deg, var(--accent) 0%, rgba(255,79,26,0.15) 60%, transparent 100%)',
                transformOrigin: 'left',
              }}
            />
          </motion.div>

          {/* 2-col layout */}
          <div style={{ display: 'grid', gap: 'clamp(2rem, 6vw, 6rem)', alignItems: 'start' }} className="lg:grid-cols-2">

            {/* Left — Calendly primary + details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Calendly hero CTA */}
              <p style={{
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.24em',
                color: 'rgba(245,241,232,0.35)', marginBottom: '0.75rem',
              }}>
                Fastest way to connect
              </p>

              <a
                href="https://calendly.com/adihere2000/30min"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: '1rem',
                  padding: '1.4rem 1.6rem',
                  background: 'var(--accent)',
                  color: '#141210',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  border: '1px solid var(--accent)',
                  transition: 'background 0.2s, transform 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#ff6633'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--accent)'; (e.currentTarget as HTMLElement).style.transform = ''; }}
              >
                <div>
                  <p style={{
                    fontFamily: 'var(--font-heading), "Syne", sans-serif',
                    fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
                    fontWeight: 700, letterSpacing: '-0.025em',
                    color: '#141210', marginBottom: '2px',
                  }}>
                    Book a 30-min call
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-geist-mono), monospace',
                    fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.2em',
                    color: 'rgba(20,18,16,0.55)',
                  }}>
                    calendly.com/adihere2000
                  </p>
                </div>
                <span style={{ fontSize: '20px', color: '#141210', opacity: 0.7 }}>↗</span>
              </a>

              {/* Email — secondary */}
              <a
                href="mailto:adihere2000@gmail.com"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: '2rem',
                  padding: '1rem 1.4rem',
                  background: 'transparent',
                  color: 'rgba(245,241,232,0.65)',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  border: '1px solid rgba(245,241,232,0.1)',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,79,26,0.35)'; (e.currentTarget as HTMLElement).style.color = '#F5F1E8'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,241,232,0.1)'; (e.currentTarget as HTMLElement).style.color = 'rgba(245,241,232,0.65)'; }}
              >
                <div>
                  <p style={{
                    fontFamily: 'var(--font-geist-mono), monospace',
                    fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.2em',
                    color: 'rgba(245,241,232,0.3)', marginBottom: '3px',
                  }}>Or email directly</p>
                  <p style={{
                    fontFamily: 'var(--font-heading), "Syne", sans-serif',
                    fontSize: '15px', fontWeight: 600, letterSpacing: '-0.01em',
                  }}>
                    adihere2000@gmail.com
                  </p>
                </div>
                <span style={{ fontSize: '14px', opacity: 0.4 }}>→</span>
              </a>

              {/* Detail grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                {DETAILS.map(d => (
                  <div key={d.label} style={{
                    padding: '0.85rem 1rem', borderRadius: '4px',
                    border: '1px solid rgba(245,241,232,0.07)',
                    background: 'rgba(245,241,232,0.03)',
                  }}>
                    <p style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(245,241,232,0.28)', marginBottom: '4px' }}>{d.label}</p>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(245,241,232,0.72)' }}>{d.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — socials + brief card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <p style={{
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.24em',
                color: 'rgba(245,241,232,0.35)', marginBottom: '1rem',
              }}>Elsewhere</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {SOCIALS.map((s, i) => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.25 + i * 0.08 }}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '1rem 1.25rem', borderRadius: '6px',
                      border: '1px solid rgba(245,241,232,0.08)',
                      background: 'rgba(245,241,232,0.03)',
                      textDecoration: 'none', transition: 'border-color 0.2s, background 0.2s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,79,26,0.3)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,79,26,0.04)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,241,232,0.08)'; (e.currentTarget as HTMLElement).style.background = 'rgba(245,241,232,0.03)'; }}
                  >
                    <div>
                      <p style={{ fontFamily: 'var(--font-heading), "Syne", sans-serif', fontSize: '15px', fontWeight: 600, letterSpacing: '-0.01em', color: '#F5F1E8', marginBottom: '2px' }}>{s.label}</p>
                      <p style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(245,241,232,0.3)' }}>{s.handle}</p>
                    </div>
                    <span style={{ color: 'rgba(245,241,232,0.3)', fontSize: '16px' }}>↗</span>
                  </motion.a>
                ))}
              </div>

              {/* Ideal brief card */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                style={{
                  marginTop: '1.25rem', padding: '1.25rem',
                  border: '1px solid rgba(255,79,26,0.2)',
                  borderRadius: '6px', background: 'rgba(255,79,26,0.05)',
                }}
              >
                <p style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,79,26,0.6)', marginBottom: '0.6rem' }}>Ideal Brief</p>
                <p style={{ fontSize: '14px', lineHeight: 1.75, color: 'rgba(245,241,232,0.6)' }}>
                  Product stage → tech stack → timeline → success metric.
                  I reply within 24 hours and can start within a week.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
