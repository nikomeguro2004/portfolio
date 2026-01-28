'use client';

import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';

interface LoadingSequenceProps {
  onComplete: () => void;
  minDuration?: number;
}

// ABSTRACT LOADING TEXT: Not technical, matches unreal aesthetic
const LOADING_STAGES = [
  'Assembling system',
  'Aligning structures',
  'Calibrating depth',
  'Stabilizing state',
  'Final calibration'
];

export default function LoadingSequence({ onComplete, minDuration = 1500 }: LoadingSequenceProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [loadingText, setLoadingText] = useState('Assembling system');
  const [showReady, setShowReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const isAnimatingOutRef = useRef(false);
  
  // Initial animation with TYPOGRAPHY AUTHORITY
  useEffect(() => {
    const tl = gsap.timeline();
    
    // Text appears with letter-spacing animation
    tl.fromTo(textRef.current, 
      { y: 30, opacity: 0, letterSpacing: '0.3em' },
      { y: 0, opacity: 1, letterSpacing: '0.05em', duration: 0.6, ease: 'expo.out' }
    );
    
    // Progress bar appears
    tl.fromTo(progressRef.current,
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 0.5, ease: 'power3.out' },
      '-=0.3'
    );
    
    // Particles float in
    if (particlesRef.current) {
      const particles = particlesRef.current.children;
      gsap.fromTo(particles,
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 0.6, 
          duration: 1, 
          stagger: 0.1, 
          ease: 'power2.out',
          delay: 0.3
        }
      );
    }
  }, []);
  
  // Progress with INTENTIONAL HESITATION
  useEffect(() => {
    const startTime = Date.now();
    let frameId: number;
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(elapsed / minDuration, 1);
      
      // Eased progress with HESITATION near 85-92%
      let easedProgress = 1 - Math.pow(1 - rawProgress, 3);
      
      // Intentional hesitation for tension
      if (rawProgress > 0.85 && rawProgress < 0.95) {
        easedProgress = 0.85 + Math.sin(elapsed * 0.002) * 0.02;
      }
      
      const newProgress = easedProgress * 100;
      setProgress(newProgress);
      
      // HIDE PERCENTAGE after 90%: Show "READY" instead
      if (newProgress >= 90 && !showReady) {
        setShowReady(true);
      }
      
      // Update loading text based on progress
      const stageIndex = Math.min(
        Math.floor(easedProgress * LOADING_STAGES.length),
        LOADING_STAGES.length - 1
      );
      setLoadingText(LOADING_STAGES[stageIndex]);
      
      if (rawProgress < 1) {
        frameId = requestAnimationFrame(updateProgress);
      } else if (!isAnimatingOutRef.current) {
        isAnimatingOutRef.current = true;
        setTimeout(() => {
          performAnimateOut();
        }, 300);
      }
    };
    
    const performAnimateOut = () => {
      if (!containerRef.current) {
        setIsComplete(true);
        onComplete();
        return;
      }
      
      const tl = gsap.timeline({
        onComplete: () => {
          setIsComplete(true);
          onComplete();
        }
      });
      
      // MICRO-JOLT before dissolve: The interrupt
      tl.to(containerRef.current, {
        scale: 1.03,
        duration: 0.08,
        ease: 'power4.out'
      });
      
      // Scale back and fade progress bar
      tl.to(progressRef.current, {
        scaleY: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in'
      });
      
      // Text slides up and fades
      tl.to(textRef.current, {
        y: -50,
        opacity: 0,
        duration: 0.4,
        ease: 'power3.in'
      }, '-=0.2');
      
      // DIRECTIONAL PARTICLE ESCAPE: Toward the scene
      if (particlesRef.current) {
        const particles = particlesRef.current.children;
        tl.to(particles, {
          x: (i: number) => (i % 2 === 0 ? 200 : -200),
          y: -300,
          opacity: 0,
          duration: 0.6,
          stagger: 0.03,
          ease: 'power3.in'
        }, '-=0.4');
      }
      
      // VERTICAL TEAR reveal instead of circle
      tl.to(containerRef.current, {
        clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
        duration: 0.8,
        ease: 'power3.inOut'
      }, '-=0.3');
    };
    
    frameId = requestAnimationFrame(updateProgress);
    
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [minDuration, onComplete, showReady]);
  
  if (isComplete) return null;
  
  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{ 
        background: 'var(--background)',
        zIndex: 9999,
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      }}
    >
      {/* Floating particles */}
      <div ref={particlesRef} className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 4 + (i % 3) * 3,
              height: 4 + (i % 3) * 3,
              left: `${10 + (i * 4.5) % 80}%`,
              top: `${15 + (i * 3.7) % 70}%`,
              background: `radial-gradient(circle, var(--accent) 0%, transparent 70%)`,
              opacity: 0,
            }}
          />
        ))}
      </div>
      
      {/* Main content */}
      <div ref={textRef} className="text-center z-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          <span className="text-gradient">S Adityan</span>
        </h1>
        <p className="text-sm font-medium mb-2" style={{ color: 'var(--accent)' }}>
          Full-Stack Engineer & AI Developer
        </p>
        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          {loadingText}...
        </p>
      </div>
      
      {/* Progress bar */}
      <div 
        className="mt-8 w-56 h-1 rounded-full overflow-hidden" 
        style={{ background: 'var(--border)' }}
      >
        <div 
          ref={progressRef}
          className="h-full rounded-full"
          style={{ 
            width: `${progress}%`,
            background: 'linear-gradient(90deg, var(--accent) 0%, var(--accent-secondary) 100%)',
            transformOrigin: 'left center',
            transition: 'width 0.1s ease-out',
          }}
        />
      </div>
      
      {/* Progress percentage - HIDES after 90% */}
      <p 
        className="mt-4 text-xs font-mono tabular-nums"
        style={{ color: 'var(--text-tertiary)' }}
      >
        {showReady ? 'READY' : `${Math.round(progress)}%`}
      </p>
      
      {/* Decorative gradient orbs */}
      <div 
        className="absolute w-125 h-125 rounded-full opacity-20 blur-3xl"
        style={{ 
          background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
          top: '-20%',
          right: '-10%',
        }}
      />
      <div 
        className="absolute w-100 h-100 rounded-full opacity-15 blur-3xl"
        style={{ 
          background: 'radial-gradient(circle, var(--accent-secondary) 0%, transparent 70%)',
          bottom: '-15%',
          left: '-5%',
        }}
      />
    </div>
  );
}
