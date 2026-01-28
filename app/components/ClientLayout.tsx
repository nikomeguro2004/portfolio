'use client';

import { useSyncExternalStore, useCallback, useState, lazy, Suspense, createContext, useContext, useEffect, useRef } from 'react';
import { CustomCursor } from './MagneticEffects';
import LoadingSequence from './LoadingSequence';

// Lazy load the Three.js scene for better initial load
const Scene = lazy(() => import('./three/Scene'));

// EXPERIENCE CONTEXT: Global narrative state
type ExperiencePhase = 'loading' | 'revealing' | 'live';

interface ExperienceContextType {
  phase: ExperiencePhase;
  setPhase: (phase: ExperiencePhase) => void;
  prefersReducedMotion: boolean;
  isTouch: boolean;
  scrollVelocity: number;
}

const ExperienceContext = createContext<ExperienceContextType>({
  phase: 'loading',
  setPhase: () => {},
  prefersReducedMotion: false,
  isTouch: false,
  scrollVelocity: 0,
});

export const useExperience = () => useContext(ExperienceContext);

// Hook to detect touch devices
function useIsTouchDevice(): boolean {
  const subscribe = useCallback(() => () => {}, []);
  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);
  const getServerSnapshot = () => false;
  
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function useMounted(): boolean {
  const subscribe = useCallback(() => () => {}, []);
  const getSnapshot = useCallback(() => true, []);
  const getServerSnapshot = () => false;
  
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Check for reduced motion preference
function usePrefersReducedMotion(): boolean {
  const subscribe = useCallback(() => () => {}, []);
  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);
  const getServerSnapshot = () => false;
  
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// FIRST-VISIT EXPERIENCE: Skip loader on subsequent visits
function useFirstVisit(): boolean {
  // Initialize state directly from sessionStorage to avoid effect setState
  const [isFirstVisit] = useState(() => {
    if (typeof window === 'undefined') return true;
    const hasVisited = sessionStorage.getItem('portfolio-visited');
    if (!hasVisited) {
      sessionStorage.setItem('portfolio-visited', 'true');
      return true;
    }
    return false;
  });
  
  return isFirstVisit;
}

// SUSPENSE FALLBACK: Visual placeholder instead of null
function SceneFallback() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none"
      style={{ 
        zIndex: 0,
        background: 'radial-gradient(ellipse at center, rgba(56, 189, 248, 0.05) 0%, transparent 60%)'
      }}
    >
      {/* Soft noise placeholder */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `repeating-conic-gradient(from 0deg, transparent 0deg 90deg, rgba(56, 189, 248, 0.02) 90deg 180deg)`,
          animation: 'pulse 4s ease-in-out infinite',
        }}
      />
    </div>
  );
}

// SIMPLIFIED SCENE FOR TOUCH: Fewer particles, no scroll coupling
function SimplifiedSceneFallback() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {/* Static gradient atmosphere for mobile */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(56, 189, 248, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(139, 92, 246, 0.06) 0%, transparent 50%)
          `,
        }}
      />
    </div>
  );
}

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const isTouchDevice = useIsTouchDevice();
  const mounted = useMounted();
  const prefersReducedMotion = usePrefersReducedMotion();
  const isFirstVisit = useFirstVisit();
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const lastScrollRef = useRef(0);
  
  // Initialize phase based on conditions to avoid effect setState
  const [phase, setPhase] = useState<ExperiencePhase>(() => {
    if (typeof window === 'undefined') return 'live'; // Default to live for SSR
    // Skip loader for repeat visits or reduced motion
    const hasVisited = sessionStorage.getItem('portfolio-visited-once');
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (hasVisited || reducedMotion) return 'live';
    return 'loading';
  });
  const [cursorVisible, setCursorVisible] = useState(() => phase === 'live');

  // Track scroll velocity for nav and scene coordination
  useEffect(() => {
    let velocityTimeout: ReturnType<typeof setTimeout>;
    
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const velocity = (currentScroll - lastScrollRef.current) / 100;
      lastScrollRef.current = currentScroll;
      setScrollVelocity(velocity);
      
      clearTimeout(velocityTimeout);
      velocityTimeout = setTimeout(() => setScrollVelocity(0), 150);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(velocityTimeout);
    };
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setPhase('revealing');
    // Mark as visited once loading completes
    sessionStorage.setItem('portfolio-visited-once', 'true');
    // Cursor appears as reward after scene stabilizes
    setTimeout(() => {
      setPhase('live');
      setCursorVisible(true);
    }, 600);
  }, []);

  // Sync phase for edge cases (mounted check)
  const effectivePhase = mounted ? phase : 'live';

  const contextValue: ExperienceContextType = {
    phase: effectivePhase,
    setPhase,
    prefersReducedMotion,
    isTouch: isTouchDevice,
    scrollVelocity,
  };

  // Determine if scene should show - ALWAYS show after loading on desktop
  const showFullScene = mounted && !isTouchDevice && !prefersReducedMotion;
  const showSimplifiedScene = mounted && isTouchDevice && !prefersReducedMotion;
  const showReducedScene = mounted && prefersReducedMotion;

  // Show loading only for first visit and not reduced motion
  const shouldShowLoader = mounted && isFirstVisit && effectivePhase === 'loading' && !prefersReducedMotion;

  return (
    <ExperienceContext.Provider value={contextValue}>
      {/* Loading sequence - first visit only */}
      {shouldShowLoader && (
        <LoadingSequence onComplete={handleLoadingComplete} minDuration={1200} />
      )}
      
      {/* Three.js background scene (desktop) - ALWAYS render when not loading */}
      {showFullScene && (
        <Suspense fallback={<SceneFallback />}>
          <Scene />
        </Suspense>
      )}
      
      {/* TOUCH DEVICE: Simplified atmosphere instead of nothing */}
      {showSimplifiedScene && <SimplifiedSceneFallback />}
      
      {/* REDUCED MOTION: Static depth + color, no animation */}
      {showReducedScene && <SimplifiedSceneFallback />}
      
      {/* Custom cursor - appears after scene stabilizes */}
      {mounted && !isTouchDevice && cursorVisible && <CustomCursor />}
      
      {/* Main content */}
      {children}
    </ExperienceContext.Provider>
  );
}
