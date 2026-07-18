'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const STATS = [
  { value: 9,   suffix: '+',  label: 'Projects Shipped',  sub: 'All live, all real'              },
  { value: 100, suffix: '%',  label: 'Delivery Rate',      sub: 'On time, on spec'                },
  { value: 30,  suffix: '+',  label: 'Tech Stack',         sub: 'Tools & Frameworks'              },
  { value: 95,  suffix: '+',  label: 'Lighthouse Score',   sub: 'Avg across all sites'            },
];

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
              }}
            >
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
      </div>
    </section>
  );
}
