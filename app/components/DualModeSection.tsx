'use client';

import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import type { Application } from '@splinetool/runtime';

const Spline = lazy(() => import('@splinetool/react-spline'));

const SCENE_URL = 'https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode';

export default function DualModeSection() {
  const [active, setActive] = useState<'design' | 'develop' | null>(null);
  const containerRef = useRef<HTMLElement>(null);
  const splineAppRef = useRef<Application | null>(null);

  // The WebGL scene is heavy on phones (GPU + battery + a multi-MB wasm/scene
  // download), so we skip it there entirely and fall back to a static background.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Only load the heavy WebGL Spline scene when we scroll within 800px of it.
  // This frees up massive resources for the top of the page.
  const isNear = useInView(containerRef, { once: true, margin: "800px" });

  // Once loaded, stop the render loop while the section is scrolled out of
  // view (and resume it when it scrolls back in) so it doesn't keep costing
  // GPU time for the rest of the page on desktop.
  const isVisible = useInView(containerRef, { margin: "200px" });
  useEffect(() => {
    const app = splineAppRef.current;
    if (!app) return;
    if (isVisible) app.play();
    else app.stop();
  }, [isVisible]);

  const handleSplineLoad = (app: Application) => {
    splineAppRef.current = app;
    if (!isVisible) app.stop();
  };

  return (
    <section
      ref={containerRef}
      style={{
        position: 'relative',
        background: '#080C18',
        minHeight: '100dvh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* ── Spline robot — full-bleed background ───────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        {isNear && !isMobile && (
          <Suspense
            fallback={
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: '#080C18',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-geist-mono), monospace',
                    fontSize: '9px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3em',
                    color: 'rgba(255,79,26,0.4)',
                  }}
                >
                  Initializing WebGL...
                </span>
              </div>
            }
          >
            <Spline scene={SCENE_URL} style={{ width: '100%', height: '100%' }} onLoad={handleSplineLoad} />
          </Suspense>
        )}
        {isMobile && (
          <div
            aria-hidden
            style={{
              width: '100%',
              height: '100%',
              background:
                'radial-gradient(60% 50% at 50% 45%, rgba(255,79,26,0.12) 0%, transparent 70%), #080C18',
            }}
          />
        )}
        {/* Hide Spline watermark */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '180px',
            height: '48px',
            background: '#080C18',
            zIndex: 10,
          }}
        />
      </div>

      {/* ── Side vignettes to keep text readable ───────────────────── */}
      <div
        className="dual-vignette"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background:
            'linear-gradient(to right, #080C18 0%, rgba(8,12,24,0.82) 26%, transparent 46%, transparent 54%, rgba(8,12,24,0.82) 74%, #080C18 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Top orange hairline ─────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '1px',
          background:
            'linear-gradient(90deg, transparent, rgba(255,79,26,0.35), transparent)',
          zIndex: 3,
        }}
      />

      {/* ── Content layer ──────────────────────────────────────────── */}
      <div
        className="dual-content"
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6rem clamp(1.25rem, 7vw, 9rem)',
          gap: '1rem',
        }}
      >
        {/* ─ Left: I CAN DESIGN ──────────────────────────────────── */}
        <motion.button
          onHoverStart={() => setActive('design')}
          onHoverEnd={() => setActive(null)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            padding: 0,
            flexShrink: 0,
          }}
          aria-label="I Can Design"
        >
          <motion.div
            animate={{ opacity: active === 'develop' ? 0.28 : 1 }}
            transition={{ duration: 0.35 }}
          >
            <p
              style={{
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '9px',
                textTransform: 'uppercase',
                letterSpacing: '0.32em',
                color: 'rgba(255,79,26,0.55)',
                marginBottom: '0.9rem',
              }}
            >
              01 · IDENTITY
            </p>

            <h2
              className="dual-heading"
              style={{
                fontFamily: 'var(--font-heading), "Syne", sans-serif',
                fontSize: 'clamp(2.8rem, 5.5vw, 6rem)',
                fontWeight: 800,
                letterSpacing: '-0.05em',
                lineHeight: 0.88,
                color: '#F5F1E8',
              }}
            >
              I CAN
              <br />
              <span style={{ color: '#FF4F1A' }}>DESIGN</span>
            </h2>

            {/* Animated underline */}
            <motion.div
              className="dual-underline"
              animate={{ width: active === 'design' ? '100%' : '36%' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                height: '2px',
                background: '#FF4F1A',
                marginTop: '1.1rem',
                borderRadius: '1px',
              }}
            />

            {/* Reveal copy */}
            <motion.div
              animate={{
                opacity: active === 'design' ? 1 : 0,
                y: active === 'design' ? 0 : 10,
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ marginTop: '1rem', pointerEvents: 'none' }}
            >
              {['Investor-grade product design', 'Fluid micro-interactions', 'Architected for retention'].map(
                (line) => (
                  <p
                    key={line}
                    style={{
                      fontFamily: 'var(--font-geist-mono), monospace',
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.16em',
                      color: 'rgba(245,241,232,0.42)',
                      lineHeight: 2,
                    }}
                  >
                    {line}
                  </p>
                )
              )}
            </motion.div>
          </motion.div>
        </motion.button>

        {/* ─ Center spacer (robot lives here in the BG) — hidden on mobile ── */}
        <div className="dual-spacer" style={{ flex: 1, minWidth: 0 }} />

        {/* ─ Right: I CAN DEVELOP ────────────────────────────────── */}
        <motion.button
          className="dual-develop-btn"
          onHoverStart={() => setActive('develop')}
          onHoverEnd={() => setActive(null)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'right',
            padding: 0,
            flexShrink: 0,
          }}
          aria-label="I Can Develop"
        >
          <motion.div
            animate={{ opacity: active === 'design' ? 0.28 : 1 }}
            transition={{ duration: 0.35 }}
          >
            <p
              style={{
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '9px',
                textTransform: 'uppercase',
                letterSpacing: '0.32em',
                color: 'rgba(255,79,26,0.55)',
                marginBottom: '0.9rem',
                textAlign: 'right',
              }}
            >
              02 · IDENTITY
            </p>

            <h2
              className="dual-heading"
              style={{
                fontFamily: 'var(--font-heading), "Syne", sans-serif',
                fontSize: 'clamp(2.8rem, 5.5vw, 6rem)',
                fontWeight: 800,
                letterSpacing: '-0.05em',
                lineHeight: 0.88,
                color: '#F5F1E8',
                textAlign: 'right',
              }}
            >
              I CAN
              <br />
              <span style={{ color: '#FF4F1A' }}>DEVELOP</span>
            </h2>

            {/* Animated underline — grows from right */}
            <motion.div
              className="dual-underline"
              animate={{ width: active === 'develop' ? '100%' : '36%' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                height: '2px',
                background: '#FF4F1A',
                marginTop: '1.1rem',
                borderRadius: '1px',
                marginLeft: 'auto',
              }}
            />

            {/* Reveal copy */}
            <motion.div
              animate={{
                opacity: active === 'develop' ? 1 : 0,
                y: active === 'develop' ? 0 : 10,
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ marginTop: '1rem', pointerEvents: 'none' }}
            >
              {['Enterprise-scale architecture', 'High-availability infrastructure', 'Rapid engineering velocity'].map(
                (line) => (
                  <p
                    key={line}
                    style={{
                      fontFamily: 'var(--font-geist-mono), monospace',
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.16em',
                      color: 'rgba(245,241,232,0.42)',
                      lineHeight: 2,
                      textAlign: 'right',
                    }}
                  >
                    {line}
                  </p>
                )
              )}
            </motion.div>
          </motion.div>
        </motion.button>
      </div>

      {/* ── Bottom thin rule ─────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '1px',
          background:
            'linear-gradient(90deg, transparent, rgba(255,79,26,0.2), transparent)',
          zIndex: 3,
        }}
      />
    </section>
  );
}
