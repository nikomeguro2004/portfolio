'use client';

import { useSyncExternalStore, useCallback, useState, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import SpiralLoadingScreen from './SpiralLoadingScreen';
import CustomCursor from './CustomCursor';
import LenisProvider from './LenisProvider';

// EXPERIENCE CONTEXT: Global narrative state
type ExperiencePhase = 'loading' | 'live';

interface ExperienceContextType {
  phase: ExperiencePhase;
  setPhase: (phase: ExperiencePhase) => void;
  prefersReducedMotion: boolean;
  isTouch: boolean;
}

const ExperienceContext = createContext<ExperienceContextType>({
  phase: 'loading',
  setPhase: () => {},
  prefersReducedMotion: false,
  isTouch: false,
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


interface AppClientLayoutProps {
  children: React.ReactNode;
}

export default function AppClientLayout({ children }: AppClientLayoutProps) {
  const pathname = usePathname();
  const isTouchDevice = useIsTouchDevice();
  const mounted = useMounted();
  const prefersReducedMotion = usePrefersReducedMotion();
  
  const [phase, setPhase] = useState<ExperiencePhase>(() => {
    if (typeof window === 'undefined') return 'live';
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (reducedMotion) return 'live';
    return 'loading';
  });

  // Scroll velocity tracking removed for performance

  const handleEnter = useCallback(() => {
    setPhase('live');
  }, []);

  // The loader intentionally never shows on /projects (see shouldShowLoader below).
  // Without this, `phase` stays stuck at 'loading' forever on a direct visit to that
  // route (bookmark, shared link, refresh) since nothing ever calls setPhase('live'),
  // leaving the page permanently blank.
  const skipsLoader = pathname === '/projects';

  // Sync phase for edge cases (mounted check)
  const effectivePhase = mounted ? (skipsLoader ? 'live' : phase) : 'live';

  const contextValue: ExperienceContextType = {
    phase: effectivePhase,
    setPhase,
    prefersReducedMotion,
    isTouch: isTouchDevice,
  };

  // Starfield removed — using CSS dot grid background instead
  const showStarfieldBackdrop = false;
  const showSimplifiedScene = false;
  const showReducedScene = false;

  const shouldShowLoader = mounted && effectivePhase === 'loading' && !prefersReducedMotion;

  return (
    <ExperienceContext.Provider value={contextValue}>
      <CustomCursor />
      {shouldShowLoader && (
        <SpiralLoadingScreen onEnter={handleEnter} />
      )}
      
      {/* Background: CSS dot grid via globals.css — no canvas needed */}
      {showStarfieldBackdrop && null}
      {showSimplifiedScene && null}
      {showReducedScene && null}
      
      {/* Main content — reveals with cinematic entrance after Enter */}
      <AnimatePresence>
        {effectivePhase === 'live' && (
          <motion.div
            key="main-content"
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <LenisProvider>{children}</LenisProvider>
          </motion.div>
        )}
      </AnimatePresence>
    </ExperienceContext.Provider>
  );
}
