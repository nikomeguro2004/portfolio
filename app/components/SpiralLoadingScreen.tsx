'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpiralAnimation } from './SpiralAnimation';

interface Props {
  onEnter: () => void;
}

export default function SpiralLoadingScreen({ onEnter }: Props) {
  const [showEnter, setShowEnter] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowEnter(true), 2200);
    return () => clearTimeout(t);
  }, []);

  const handleEnter = useCallback(() => {
    if (exiting) return;
    setExiting(true);
  }, [exiting]);

  return (
    <AnimatePresence onExitComplete={onEnter}>
      {!exiting && (
        <motion.div
          key="spiral-screen"
          className="fixed inset-0 z-[9999] overflow-hidden"
          style={{ background: '#0a0a0a' }}
          exit={{
            opacity: 0,
            scale: 1.06,
            filter: 'blur(18px)',
          }}
          transition={{ duration: 0.72, ease: [0.4, 0, 1, 1] }}
        >
          {/* Spiral canvas — fills entire screen */}
          <div className="absolute inset-0">
            <SpiralAnimation />
          </div>

          {/* Radial vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 70% 70% at center, transparent 20%, rgba(0,0,0,0.6) 100%)',
            }}
          />

          {/* Enter — plain div handles centering so Framer Motion can't override translate(-50%,-50%) */}
          <AnimatePresence>
            {showEnter && (
              /* Plain div: centering only — no animation, no transform conflict */
              <div
                className="pointer-events-none"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10,
                }}
              >
              {/* Inner motion.div: animation only, no positioning */}
              <motion.div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1.5rem',
                }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              >
                <button
                  onClick={handleEnter}
                  className="pointer-events-auto relative"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  {/* Pulse ring */}
                  <span
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{
                      background: 'rgba(255,79,26,0.12)',
                      animationDuration: '2.2s',
                    }}
                  />
                  <EnterLabel />
                </button>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.7 }}
                  style={{
                    fontFamily: 'var(--font-geist-mono), "JetBrains Mono", monospace',
                    fontSize: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.34em',
                    color: 'rgba(255,255,255,0.18)',
                    userSelect: 'none',
                  }}
                >
                  S Adityan · Portfolio
                </motion.p>
              </motion.div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function EnterLabel() {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        position: 'relative',
        zIndex: 1,
        padding: '0.8rem 2.75rem',
        fontFamily: 'var(--font-geist-mono), "JetBrains Mono", monospace',
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: hovered ? '0.46em' : '0.36em',
        color: hovered ? '#FF4F1A' : 'rgba(255,255,255,0.82)',
        border: `1px solid ${hovered ? 'rgba(255,79,26,0.45)' : 'rgba(255,255,255,0.14)'}`,
        borderRadius: '100px',
        backdropFilter: 'blur(10px)',
        background: hovered ? 'rgba(255,79,26,0.06)' : 'rgba(255,255,255,0.03)',
        transition: 'color 0.3s, letter-spacing 0.4s, border-color 0.3s, background 0.3s',
        whiteSpace: 'nowrap',
      }}
    >
      Enter
    </span>
  );
}
