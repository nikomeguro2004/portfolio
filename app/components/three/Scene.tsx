'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SystemCore } from './SystemCore';

gsap.registerPlugin(ScrollTrigger);

export function Scene() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mobile detection - disable on mobile for performance
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 768 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      );
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Tab visibility - pause when inactive
  const [isTabActive, setIsTabActive] = useState(true);
  
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabActive(!document.hidden);
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);
  
  // Mouse tracking for parallax
  useEffect(() => {
    if (isMobile) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);
  
  // Scroll tracking with GSAP ScrollTrigger
  useEffect(() => {
    const scrollTrigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      },
    });
    
    return () => {
      scrollTrigger.kill();
    };
  }, []);
  
  // Visibility-based frame loop control (IntersectionObserver)
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  // Render on all devices (simplified on mobile)
  
  // Determine if animation should run
  const shouldAnimate = isVisible && isTabActive;
  
  return (
    <div 
      ref={containerRef}
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, #0a0a12 0%, #000005 100%)',
      }}
    >
      <Canvas
        camera={{ 
          position: [0, 0, isMobile ? 25 : 20],
          fov: isMobile ? 60 : 50,
          near: 0.1,
          far: 100,
        }}
        gl={{ 
          antialias: true, 
          alpha: false,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.5]}
        frameloop={shouldAnimate ? 'always' : 'demand'}
      >
        <Suspense fallback={null}>
          <SystemCore 
            scrollProgress={scrollProgress}
            mousePosition={mousePosition}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Scene;
