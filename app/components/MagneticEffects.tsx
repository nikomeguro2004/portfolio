'use client';

import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';

// IMPROVED: Nonlinear attraction curve with cursor resistance
export function useMagnetic(strength: number = 0.3) {
  const elementRef = useRef<HTMLElement>(null);
  const bounds = useRef<DOMRect | null>(null);
  const quickToX = useRef<gsap.QuickToFunc | null>(null);
  const quickToY = useRef<gsap.QuickToFunc | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    quickToX.current = gsap.quickTo(element, 'x', { duration: 0.4, ease: 'power3.out' });
    quickToY.current = gsap.quickTo(element, 'y', { duration: 0.4, ease: 'power3.out' });

    const updateBounds = () => {
      bounds.current = element.getBoundingClientRect();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!bounds.current || !quickToX.current || !quickToY.current) return;

      const centerX = bounds.current.left + bounds.current.width / 2;
      const centerY = bounds.current.top + bounds.current.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = Math.max(bounds.current.width, bounds.current.height) * 2;

      if (distance < maxDistance) {
        // NONLINEAR ATTRACTION: Weak at distance, sudden snap near center
        const normalized = distance / maxDistance;
        const pull = Math.pow(1 - normalized, 2.5);
        
        // CURSOR RESISTANCE: Reduced pull when very close
        const resistance = Math.abs(deltaX) < bounds.current.width * 0.15 ? 0.6 : 1;
        
        quickToX.current(deltaX * strength * pull * resistance);
        quickToY.current(deltaY * strength * pull * resistance);
      }
    };

    const handleMouseLeave = () => {
      if (quickToX.current && quickToY.current) {
        quickToX.current(0);
        quickToY.current(0);
      }
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', updateBounds);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return elementRef;
}

// IMPROVED: MagneticButton with firm container, elastic content
interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
}

export function MagneticButton({ 
  children, 
  className = '', 
  strength = 0.3,
  onClick,
  href,
  target,
  rel,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement & HTMLAnchorElement>(null);
  const contentRef = useRef<HTMLSpanElement>(null);
  const bounds = useRef<DOMRect | null>(null);
  const quickToX = useRef<gsap.QuickToFunc | null>(null);
  const quickToY = useRef<gsap.QuickToFunc | null>(null);
  const contentQuickToX = useRef<gsap.QuickToFunc | null>(null);
  const contentQuickToY = useRef<gsap.QuickToFunc | null>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const content = contentRef.current;
    if (!button || !content) return;

    // FIRM CONTAINER: Decisive movement
    quickToX.current = gsap.quickTo(button, 'x', { duration: 0.4, ease: 'power3.out' });
    quickToY.current = gsap.quickTo(button, 'y', { duration: 0.4, ease: 'power3.out' });
    
    // ELASTIC CONTENT: Keeps the playful feel only on inner element
    contentQuickToX.current = gsap.quickTo(content, 'x', { duration: 0.3, ease: 'power3.out' });
    contentQuickToY.current = gsap.quickTo(content, 'y', { duration: 0.3, ease: 'power3.out' });

    const updateBounds = () => {
      bounds.current = button.getBoundingClientRect();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!bounds.current) return;

      const centerX = bounds.current.left + bounds.current.width / 2;
      const centerY = bounds.current.top + bounds.current.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      quickToX.current?.(deltaX * strength);
      quickToY.current?.(deltaY * strength);
      contentQuickToX.current?.(deltaX * strength * 0.4);
      contentQuickToY.current?.(deltaY * strength * 0.4);
    };

    const handleMouseEnter = () => {
      updateBounds();
      gsap.to(button, { scale: 1.05, duration: 0.3, ease: 'power2.out' });
    };

    const handleMouseLeave = () => {
      // ELASTIC RESET: Keeps playfulness on exit
      quickToX.current?.(0);
      quickToY.current?.(0);
      contentQuickToX.current?.(0);
      contentQuickToY.current?.(0);
      gsap.to(button, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);
    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', updateBounds);
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  const Component = href ? 'a' : 'button';

  return (
    <Component
      ref={buttonRef as React.RefObject<HTMLButtonElement> & React.RefObject<HTMLAnchorElement>}
      className={`magnetic-element ${className}`}
      onClick={onClick}
      href={href}
      target={target}
      rel={rel}
      style={{ display: 'inline-block', willChange: 'transform' }}
    >
      <span ref={contentRef} style={{ display: 'inline-block', willChange: 'transform' }}>
        {children}
      </span>
    </Component>
  );
}

// IMPROVED: Card with clamped rotation and lagged glow
interface MagneticCardProps {
  children: React.ReactNode;
  className?: string;
  rotationStrength?: number;
  glowColor?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  style?: React.CSSProperties;
}

export function MagneticCard({ 
  children, 
  className = '', 
  rotationStrength = 10,
  glowColor = 'rgba(56, 189, 248, 0.3)',
  onMouseEnter,
  onMouseLeave,
  style,
}: MagneticCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const glowPosition = useRef({ x: 50, y: 50 });

  useEffect(() => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      // CLAMPED ROTATION: Heavier feel
      const clamp = (v: number) => Math.max(-1, Math.min(1, v));
      const rotateX = clamp(mouseY / (rect.height / 2)) * -rotationStrength;
      const rotateY = clamp(mouseX / (rect.width / 2)) * rotationStrength;

      // Faster entry, same exit
      gsap.to(card, {
        rotateX,
        rotateY,
        duration: 0.2,
        ease: 'power2.out',
        transformPerspective: 1000,
      });

      // LAGGED GLOW: Light reacts, not follows
      const glowX = ((e.clientX - rect.left) / rect.width) * 100;
      const glowY = ((e.clientY - rect.top) / rect.height) * 100;
      
      gsap.to(glowPosition.current, {
        x: glowX,
        y: glowY,
        duration: 0.4,
        ease: 'power3.out',
        onUpdate: () => {
          glow.style.background = `radial-gradient(circle at ${glowPosition.current.x}% ${glowPosition.current.y}%, ${glowColor} 0%, transparent 50%)`;
        }
      });
      glow.style.opacity = '1';
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)',
      });
      glow.style.opacity = '0';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [rotationStrength, glowColor]);

  return (
    <div 
      ref={cardRef} 
      className={`magnetic-card ${className}`}
      style={{ 
        position: 'relative', 
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        ...style,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div 
        ref={glowRef}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          opacity: 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
}

// IMPROVED: Context-aware cursor with states
type CursorState = 'idle' | 'interactive' | 'primary';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorStateRef = useRef<CursorState>('idle');

  // Check if we should show cursor at all
  const checkDevice = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return !('ontouchstart' in window) && window.innerWidth >= 768;
  }, []);

  useEffect(() => {
    const isDesktop = checkDevice();
    if (!isDesktop) return;

    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    if (!cursor || !cursorDot) return;

    document.documentElement.classList.add('cursor-ready');

    const quickToX = gsap.quickTo(cursor, 'x', { duration: 0.5, ease: 'power3.out' });
    const quickToY = gsap.quickTo(cursor, 'y', { duration: 0.5, ease: 'power3.out' });
    const dotQuickToX = gsap.quickTo(cursorDot, 'x', { duration: 0.1, ease: 'power3.out' });
    const dotQuickToY = gsap.quickTo(cursorDot, 'y', { duration: 0.1, ease: 'power3.out' });

    const handleMouseMove = (e: MouseEvent) => {
      quickToX(e.clientX);
      quickToY(e.clientY);
      dotQuickToX(e.clientX);
      dotQuickToY(e.clientY);
    };

    const setCursorState = (state: CursorState) => {
      if (cursorStateRef.current === state) return;
      cursorStateRef.current = state;

      switch (state) {
        case 'primary':
          // PRIMARY ACTION: Extra emphasis
          gsap.to(cursor, { scale: 2.5, borderWidth: 2, opacity: 0.6, duration: 0.3 });
          gsap.to(cursorDot, { scale: 0, duration: 0.3 });
          break;
        case 'interactive':
          // INTERACTIVE: Standard hover
          gsap.to(cursor, { scale: 2, borderWidth: 1, opacity: 0.5, duration: 0.3 });
          gsap.to(cursorDot, { scale: 0, duration: 0.3 });
          break;
        case 'idle':
        default:
          gsap.to(cursor, { scale: 1, borderWidth: 1, opacity: 1, duration: 0.3 });
          gsap.to(cursorDot, { scale: 1, duration: 0.3 });
          break;
      }
    };

    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.matches('.primary-action, [data-cursor="primary"]')) {
        setCursorState('primary');
      } else if (target.matches('a, button, .magnetic-element, .magnetic-card, [role="button"]')) {
        setCursorState('interactive');
      }
    };

    const handleMouseLeave = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.matches('a, button, .magnetic-element, .magnetic-card, .primary-action, [role="button"], [data-cursor]')) {
        setCursorState('idle');
      }
    };
    
    // UNCOMFORTABLE INTERACTION: Brief freeze on click
    const handleClick = () => {
      gsap.to(cursor, { 
        scale: 0.8, 
        duration: 0.05,
        onComplete: () => {
          gsap.to(cursor, { scale: cursorStateRef.current === 'idle' ? 1 : 2, duration: 0.3, ease: 'elastic.out(1, 0.5)' });
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);
    document.addEventListener('click', handleClick);

    return () => {
      document.documentElement.classList.remove('cursor-ready');
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
      document.removeEventListener('click', handleClick);
    };
  }, [checkDevice]);

  return (
    <>
      <div
        ref={cursorRef}
        className="custom-cursor hidden md:block"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1px solid rgba(56, 189, 248, 0.5)',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
          // SELECTIVE BLEND: Only on specific sections
          mixBlendMode: 'normal',
        }}
      />
      <div
        ref={cursorDotRef}
        className="custom-cursor-dot hidden md:block"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: '#38bdf8',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
        }}
      />
    </>
  );
}
