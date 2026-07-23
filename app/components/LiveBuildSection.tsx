'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';

type Body = {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  hue: 'accent' | 'warm' | 'ivory';
};

const COLORS: Record<Body['hue'], string> = {
  accent: '#FF4F1A',
  warm:   '#FFA028',
  ivory:  '#F5F1E8',
};

const GRAVITY = 0.34;
const RESTITUTION = 0.62;
const FRICTION = 0.992;

export default function LiveBuildSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bodiesRef = useRef<Body[]>([]);
  const rafRef = useRef<number | null>(null);
  const dimsRef = useRef({ w: 0, h: 0 });
  const [count, setCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const isInView = useInView(sectionRef, { margin: '10% 0px' });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const maxBodies = isMobile ? 46 : 90;

  const spawn = useCallback((x: number, y: number, seedVX?: number) => {
    if (bodiesRef.current.length >= maxBodies) bodiesRef.current.shift();
    const hues: Body['hue'][] = ['accent', 'warm', 'ivory'];
    bodiesRef.current.push({
      x, y,
      vx: seedVX ?? (Math.random() - 0.5) * 3,
      vy: -1 - Math.random() * 1.5,
      r: 7 + Math.random() * 9,
      hue: hues[Math.floor(Math.random() * hues.length)],
    });
    setCount(bodiesRef.current.length);
  }, [maxBodies]);

  const clear = useCallback(() => {
    bodiesRef.current = [];
    setCount(0);
  }, []);

  // Resize canvas to container, capped DPR for perf
  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
      dimsRef.current = { w: rect.width, h: rect.height };
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext('2d');
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [isMobile]);

  // Seed a few bodies on first entering view
  useEffect(() => {
    if (!isInView || reducedMotion) return;
    if (bodiesRef.current.length > 0) return;
    const { w } = dimsRef.current;
    if (!w) return;
    let i = 0;
    const seedTimer = setInterval(() => {
      spawn(w * (0.2 + Math.random() * 0.6), -20);
      i++;
      if (i >= 6) clearInterval(seedTimer);
    }, 220);
    return () => clearInterval(seedTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView, reducedMotion]);

  // Physics + render loop — only while in view, tab visible, and motion allowed
  useEffect(() => {
    if (!isInView || reducedMotion) return;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      const { w, h } = dimsRef.current;
      if (ctx && w && h) {
        ctx.clearRect(0, 0, w, h);

        const bodies = bodiesRef.current;
        for (let i = 0; i < bodies.length; i++) {
          const b = bodies[i];
          b.vy += GRAVITY;
          b.vx *= FRICTION;
          b.x += b.vx;
          b.y += b.vy;

          if (b.x - b.r < 0) { b.x = b.r; b.vx *= -RESTITUTION; }
          if (b.x + b.r > w) { b.x = w - b.r; b.vx *= -RESTITUTION; }
          if (b.y + b.r > h) { b.y = h - b.r; b.vy *= -RESTITUTION; }
        }

        // cheap pairwise separation — body counts are capped, so O(n^2) is fine
        for (let i = 0; i < bodies.length; i++) {
          for (let j = i + 1; j < bodies.length; j++) {
            const a = bodies[i], c = bodies[j];
            const dx = c.x - a.x, dy = c.y - a.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
            const minDist = a.r + c.r;
            if (dist < minDist) {
              const overlap = (minDist - dist) / 2;
              const nx = dx / dist, ny = dy / dist;
              a.x -= nx * overlap; a.y -= ny * overlap;
              c.x += nx * overlap; c.y += ny * overlap;
            }
          }
        }

        for (const b of bodies) {
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.fillStyle = COLORS[b.hue];
          ctx.globalAlpha = b.hue === 'ivory' ? 0.9 : 1;
          ctx.shadowColor = COLORS[b.hue];
          ctx.shadowBlur = 14;
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.shadowBlur = 0;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isInView, reducedMotion]);

  const handlePointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    spawn(e.clientX - rect.left, e.clientY - rect.top, (Math.random() - 0.5) * 4);
  };

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#0C0A08',
        padding: 'clamp(4.5rem, 9vw, 8rem) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(rgba(255,79,26,0.05) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="label-mono"
          style={{ color: 'rgba(255,79,26,0.5)', marginBottom: '1rem' }}
        >
          Proof, not a portfolio screenshot
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-heading), "Syne", sans-serif',
            fontSize: 'clamp(2.2rem, 5vw, 4.25rem)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 0.95,
            color: '#F5F1E8',
            marginBottom: '0.9rem',
            maxWidth: '16ch',
          }}
        >
          This isn&apos;t a screenshot.<br />
          <span style={{ color: 'var(--accent)' }}>Click it.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{
            color: 'rgba(245,241,232,0.55)',
            maxWidth: '46ch',
            marginBottom: '2.25rem',
            fontSize: '0.95rem',
            lineHeight: 1.7,
          }}
        >
          A tiny, hand-rolled physics loop — the same gravity/collision math behind{' '}
          <span style={{ color: 'rgba(245,241,232,0.85)' }}>Triangle Field Sandbox</span>.
          Click or tap anywhere below to drop a body.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'relative',
            border: '1px solid rgba(245,241,232,0.1)',
            borderRadius: 'var(--r-md)',
            overflow: 'hidden',
            background: '#080705',
            height: 'clamp(320px, 42vw, 480px)',
          }}
        >
          {reducedMotion ? (
            <div
              style={{
                position: 'absolute', inset: 0, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                color: 'rgba(245,241,232,0.35)',
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em',
                textAlign: 'center', padding: '2rem',
              }}
            >
              Motion reduced — interactive demo paused for your system preference
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointer}
              /* pan-y (not none): lets a vertical swipe still scroll the page past
                 this section on touch devices — only a tap/click spawns a body */
              style={{ display: 'block', width: '100%', height: '100%', touchAction: 'pan-y', cursor: 'crosshair' }}
            />
          )}

          {/* HUD */}
          <div
            style={{
              position: 'absolute', bottom: '0.9rem', left: '1rem',
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.18em',
              color: 'rgba(245,241,232,0.4)', pointerEvents: 'none',
              maxWidth: isMobile ? '55%' : 'none',
            }}
          >
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4ade80', flexShrink: 0 }} />
            <span>{count} bodies{isMobile ? '' : ' · canvas 2d · no library'}</span>
          </div>

          {!reducedMotion && (
            <button
              onClick={clear}
              style={{
                position: 'absolute', bottom: '0.75rem', right: '1rem',
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.18em',
                color: 'rgba(245,241,232,0.5)',
                border: '1px solid rgba(245,241,232,0.15)',
                borderRadius: '4px', padding: '0.4rem 0.7rem',
                background: 'rgba(245,241,232,0.04)', cursor: 'pointer',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,79,26,0.4)'; (e.currentTarget as HTMLElement).style.color = '#F5F1E8'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,241,232,0.15)'; (e.currentTarget as HTMLElement).style.color = 'rgba(245,241,232,0.5)'; }}
            >
              Clear
            </button>
          )}
        </motion.div>
      </div>
    </section>
  );
}
