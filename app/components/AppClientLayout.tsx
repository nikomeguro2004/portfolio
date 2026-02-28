'use client';

import { useSyncExternalStore, useCallback, useState, createContext, useContext, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import AppLoadingSequence from '@/app/components/AppLoadingSequence';
import ImmersiveStarfieldBackdrop from './ImmersiveStarfieldBackdrop';

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

// Hook to detect touch devices - only true for small-screen mobile devices
function useIsTouchDevice(): boolean {
  const subscribe = useCallback(() => () => {}, []);
  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined') return false;
    // Only consider it a "touch device" if it's a small screen mobile
    // Many laptops have touch but should still show full backdrop effects
    const isMobile = window.innerWidth < 768;
    const hasTouchOnly = ('ontouchstart' in window || navigator.maxTouchPoints > 0) && !window.matchMedia('(pointer: fine)').matches;
    return isMobile && hasTouchOnly;
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

interface AppClientLayoutProps {
  children: React.ReactNode;
}

export default function AppClientLayout({ children }: AppClientLayoutProps) {
  const pathname = usePathname();
  const isTouchDevice = useIsTouchDevice();
  const mounted = useMounted();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const lastScrollRef = useRef(0);
  
  // Always show loader on full reload unless reduced motion is enabled
  const [phase, setPhase] = useState<ExperiencePhase>(() => {
    if (typeof window === 'undefined') return 'live'; // Default to live for SSR
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (reducedMotion) return 'live';
    return 'loading';
  });

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
    setTimeout(() => {
      setPhase('live');
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

  // Determine if backdrop should show
  const showStarfieldBackdrop = mounted && !isTouchDevice && !prefersReducedMotion;
  const showSimplifiedScene = mounted && isTouchDevice && !prefersReducedMotion;
  const showReducedScene = mounted && prefersReducedMotion;

  // Show loading on every full reload (except reduced motion users)
  const shouldShowLoader = mounted && effectivePhase === 'loading' && !prefersReducedMotion;

  return (
    <ExperienceContext.Provider value={contextValue}>
      {/* Loading sequence - every full reload */}
      {shouldShowLoader && (
        <AppLoadingSequence onComplete={handleLoadingComplete} minDuration={2800} />
      )}
      
      {/* Minimal immersive starfield backdrop (desktop) */}
      {showStarfieldBackdrop && <ImmersiveStarfieldBackdrop />}
      
      {/* TOUCH DEVICE: Simplified atmosphere instead of nothing */}
      {showSimplifiedScene && <SimplifiedSceneFallback />}
      
      {/* REDUCED MOTION: Static depth + color, no animation */}
      {showReducedScene && <SimplifiedSceneFallback />}
      
      {/* Main content */}
      {children}
    </ExperienceContext.Provider>
  );
}
