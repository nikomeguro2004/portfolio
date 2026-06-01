'use client';

import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.4, smoothWheel: true, syncTouch: false });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const handle = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(handle);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
