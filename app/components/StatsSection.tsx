'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { projects } from '../projects/projectData';

const STATS = [
  { value: 9,   suffix: '+',  label: 'Projects Shipped',  sub: 'All live, all real'              },
  { value: 100, suffix: '%',  label: 'Delivery Rate',      sub: 'On time, on spec'                },
  { value: 30,  suffix: '+',  label: 'Tech Stack',         sub: 'Tools & Frameworks'              },
  { value: 95,  suffix: '+',  label: 'Lighthouse Score',   sub: 'Avg across all sites'            },
];

const TIMELINE = [...projects]
  .sort((a, b) => a.orderKey - b.orderKey)
  .map((p) => ({ title: p.title, orderKey: p.orderKey, status: p.status }));

const MIN_KEY = TIMELINE[0].orderKey;
const MAX_KEY = TIMELINE[TIMELINE.length - 1].orderKey;
const KEY_SPAN = Math.max(MAX_KEY - MIN_KEY, 1);

function CountUp({ target, suffix, active }: { target: number; suffix: string; active: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    const duration = 1600;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * target));
      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [active, target]);

  return <>{count}{suffix}</>;
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-12% 0px' });
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      ref={ref}
      style={{
        background: '#111009',
        padding: 'clamp(5rem, 10vw, 9rem) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Grid background */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage:
            'linear-gradient(rgba(255,79,26,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,79,26,0.05) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      {/* Ambient glow bottom-left */}
      <div
        aria-hidden
        style={{
          position: 'absolute', bottom: '-30%', left: '5%',
          width: '55vw', height: '55vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,79,26,0.08) 0%, transparent 65%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.3em',
            color: 'rgba(255,79,26,0.4)',
            marginBottom: '3.5rem',
          }}
        >
          By the numbers
        </motion.p>

        {/* Stats grid */}
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}
          className="sm:grid-cols-4"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: i * 0.13, ease: [0.16, 1, 0.3, 1] }}
              style={{
                padding: 'clamp(1.5rem, 3vw, 2.5rem) clamp(1rem, 2.5vw, 2rem)',
                borderLeft: i % 2 === 1 ? '1px solid rgba(255,79,26,0.1)' : 'none',
                borderTop: i >= 2 ? '1px solid rgba(255,79,26,0.1)' : 'none',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Oversized ghost numeral — type as visual texture */}
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  top: '-0.3em', right: '-0.12em',
                  fontFamily: 'var(--font-heading), "Syne", sans-serif',
                  fontSize: 'clamp(6rem, 13vw, 11rem)',
                  fontWeight: 800,
                  color: '#F5F1E8',
                  opacity: 0.035,
                  lineHeight: 1,
                  pointerEvents: 'none',
                  userSelect: 'none',
                  zIndex: 0,
                }}
              >
                {stat.value}
              </div>

              {/* Accent corner dot */}
              {i === 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : {}}
                  transition={{ delay: 0.8, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position: 'absolute', top: 0, left: 0,
                    width: '4px', height: '4px',
                    background: 'var(--accent)',
                    borderRadius: '50%',
                  }}
                />
              )}

              {/* Count */}
              <div style={{
                position: 'relative', zIndex: 1,
                fontFamily: 'var(--font-heading), "Syne", sans-serif',
                fontSize: 'clamp(3rem, 7vw, 6.5rem)',
                fontWeight: 800,
                letterSpacing: '-0.05em',
                lineHeight: 1,
                color: '#F5F1E8',
                marginBottom: '0.8rem',
                fontVariantNumeric: 'tabular-nums',
              }}>
                <CountUp target={stat.value} suffix={stat.suffix} active={inView} />
              </div>

              {/* Label */}
              <div style={{
                position: 'relative', zIndex: 1,
                fontFamily: 'var(--font-heading), "Syne", sans-serif',
                fontSize: 'clamp(0.85rem, 1.4vw, 1rem)',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                color: 'rgba(245,241,232,0.7)',
                marginBottom: '0.3rem',
              }}>
                {stat.label}
              </div>

              {/* Sub */}
              <div style={{
                position: 'relative', zIndex: 1,
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.2em',
                color: 'rgba(255,79,26,0.38)',
              }}>
                {stat.sub}
              </div>

              {/* Bottom accent bar — only on hovered/animated */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ delay: 0.4 + i * 0.13, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'absolute',
                  bottom: 0, left: 0,
                  height: '1px',
                  width: '40%',
                  background: 'linear-gradient(90deg, rgba(255,79,26,0.4), transparent)',
                  transformOrigin: 'left',
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Shipped timeline — real dates, not decoration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginTop: 'clamp(3rem, 6vw, 5rem)' }}
        >
          <p style={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.24em',
            color: 'rgba(245,241,232,0.3)', marginBottom: '1.5rem',
          }}>
            Shipped timeline · hover a marker
          </p>

          <div style={{ position: 'relative', height: '3rem' }}>
            {/* Base line */}
            <div style={{
              position: 'absolute', left: 0, right: 0, top: '50%',
              height: '1px', background: 'rgba(245,241,232,0.12)',
            }} />

            {TIMELINE.map((p, i) => {
              const pct = ((p.orderKey - MIN_KEY) / KEY_SPAN) * 100;
              const isHov = hovered === i;
              // Clamp tooltip alignment near the edges so it can't clip off-screen
              // on narrow viewports — center by default, pin to the inner edge near ends.
              const tooltipAlign = pct < 8 ? 'left' : pct > 92 ? 'right' : 'center';
              const tooltipX = tooltipAlign === 'left' ? '0%' : tooltipAlign === 'right' ? '-100%' : '-50%';
              return (
                <div
                  key={`${p.title}-${p.orderKey}`}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    position: 'absolute',
                    left: `${pct}%`, top: '50%',
                    transform: 'translate(-50%, -50%)',
                    cursor: 'default',
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={inView ? { scale: 1 } : {}}
                    transition={{ delay: 0.7 + i * 0.05, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      width: isHov ? '10px' : '7px',
                      height: isHov ? '10px' : '7px',
                      borderRadius: '50%',
                      background: p.status === 'Completed' ? 'rgba(245,241,232,0.4)' : 'var(--accent)',
                      transition: 'width 0.2s, height 0.2s',
                      boxShadow: isHov ? '0 0 0 6px rgba(255,79,26,0.15)' : 'none',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute', bottom: '1.4rem', left: tooltipAlign === 'left' ? '-0.5rem' : tooltipAlign === 'right' ? 'auto' : '50%',
                      right: tooltipAlign === 'right' ? '-0.5rem' : 'auto',
                      transform: tooltipAlign === 'center' ? `translateX(${tooltipX}) translateY(${isHov ? '0' : '4px'})` : `translateY(${isHov ? '0' : '4px'})`,
                      opacity: isHov ? 1 : 0,
                      transition: 'opacity 0.18s, transform 0.18s',
                      whiteSpace: 'nowrap', pointerEvents: 'none',
                      fontFamily: 'var(--font-geist-mono), monospace',
                      fontSize: '9px', letterSpacing: '0.05em',
                      color: '#F5F1E8',
                      background: '#1a1712',
                      border: '1px solid rgba(255,79,26,0.25)',
                      borderRadius: '4px',
                      padding: '0.3rem 0.55rem',
                    }}
                  >
                    {p.title}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
