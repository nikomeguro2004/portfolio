'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// Simplified magnetic hook - returns ref for compatibility
export function useMagnetic() {
  const elementRef = useRef<HTMLElement>(null);
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
  strength = 0.15,
  onClick,
  href,
  target,
  rel,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement & HTMLAnchorElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseEnter = () => {
      gsap.to(button, { y: -2, duration: 0.3, ease: 'power2.out' });
    };

    const handleMouseLeave = () => {
      gsap.to(button, { y: 0, duration: 0.3, ease: 'power2.out' });
    };

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
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
      style={{ display: 'inline-block', transition: 'transform 0.3s ease' }}
    >
      {children}
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
  rotationStrength = 3,
  onMouseEnter,
  onMouseLeave,
  style,
}: MagneticCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      // Subtle rotation
      const rotateX = (mouseY / (rect.height / 2)) * -rotationStrength;
      const rotateY = (mouseX / (rect.width / 2)) * rotationStrength;

      gsap.to(card, {
        rotateX,
        rotateY,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 1000,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [rotationStrength]);

  return (
    <div 
      ref={cardRef} 
      className={`magnetic-card ${className}`}
      style={{ 
        position: 'relative', 
        transformStyle: 'preserve-3d',
        ...style,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
}

// Custom cursor disabled - using native cursor for cleaner experience
export function CustomCursor() {
  return null;
}
