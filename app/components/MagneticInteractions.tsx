'use client';

import { useEffect, useRef } from 'react';
import { animate } from 'animejs';

export function useMagnetic() {
  const elementRef = useRef<HTMLElement>(null);
  return elementRef;
}

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
  const buttonRef = useRef<HTMLElement | null>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = buttonRef.current;
    const inner = innerRef.current;
    if (!node || !inner) return;

    const reset = () => {
      animate(node, { translateX: 0, translateY: 0, rotate: 0, duration: 420, ease: 'out(4)' });
      animate(inner, { translateX: 0, translateY: 0, scale: 1, duration: 460, ease: 'out(4)' });
    };

    const move = (event: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      const offsetX = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2 || 1);
      const offsetY = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2 || 1);

      animate(node, {
        translateX: offsetX * 12 * strength,
        translateY: offsetY * 12 * strength,
        rotate: offsetX * 1.8,
        duration: 220,
        ease: 'out(3)',
      });

      animate(inner, {
        translateX: offsetX * 20 * strength,
        translateY: offsetY * 20 * strength,
        scale: 1.02,
        duration: 220,
        ease: 'out(3)',
      });
    };

    const handleMouseEnter = () => {
      animate(node, { scale: [0.985, 1], duration: 260, ease: 'out(3)' });
    };

    const handleMouseLeave = () => {
      reset();
    };

    node.addEventListener('mousemove', move);
    node.addEventListener('mouseenter', handleMouseEnter);
    node.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      node.removeEventListener('mousemove', move);
      node.removeEventListener('mouseenter', handleMouseEnter);
      node.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  if (href) {
    return (
      <a
        ref={(node) => {
          buttonRef.current = node;
        }}
        className={`magnetic-element ${className}`}
        onClick={onClick}
        href={href}
        target={target}
        rel={rel}
        style={{ display: 'inline-block', willChange: 'transform' }}
      >
        <span ref={innerRef} style={{ display: 'inline-flex', willChange: 'transform' }}>{children}</span>
      </a>
    );
  }

  return (
    <button
      ref={(node) => {
        buttonRef.current = node;
      }}
      className={`magnetic-element ${className}`}
      onClick={onClick}
      style={{ display: 'inline-block', willChange: 'transform' }}
    >
      <span ref={innerRef} style={{ display: 'inline-flex', willChange: 'transform' }}>{children}</span>
    </button>
  );
}

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
  glowColor = 'rgba(56, 189, 248, 0.22)',
  onMouseEnter,
  onMouseLeave,
  style,
}: MagneticCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const sheen = sheenRef.current;
    if (!card || !sheen) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      const rotateX = (mouseY / (rect.height / 2)) * -rotationStrength;
      const rotateY = (mouseX / (rect.width / 2)) * rotationStrength;
      const translateX = (mouseX / rect.width) * 8;
      const translateY = (mouseY / rect.height) * 8;

      animate(card, {
        rotateX,
        rotateY,
        translateX,
        translateY,
        duration: 260,
        ease: 'out(3)',
      });

      const px = ((e.clientX - rect.left) / rect.width) * 100;
      const py = ((e.clientY - rect.top) / rect.height) * 100;
      sheen.style.background = `radial-gradient(circle at ${px}% ${py}%, ${glowColor}, transparent 52%)`;
      sheen.style.opacity = '1';
    };

    const handleMouseLeave = () => {
      animate(card, {
        rotateX: 0,
        rotateY: 0,
        translateX: 0,
        translateY: 0,
        duration: 420,
        ease: 'out(4)',
      });
      animate(sheen, { opacity: [1, 0], duration: 360, ease: 'out(3)' });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [glowColor, rotationStrength]);

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
      <div ref={sheenRef} className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200" aria-hidden="true" />
      {children}
    </div>
  );
}

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;

    const move = (event: MouseEvent) => {
      tx = event.clientX;
      ty = event.clientY;
    };

    const onDown = () => {
      animate([cursor, ring], { scale: [1, 0.88], duration: 140, ease: 'out(3)' });
    };

    const onUp = () => {
      animate([cursor, ring], { scale: [0.88, 1], duration: 180, ease: 'out(3)' });
    };

    const frame = () => {
      x += (tx - x) * 0.24;
      y += (ty - y) * 0.24;
      cursor.style.transform = `translate3d(${x - 4}px, ${y - 4}px, 0)`;
      ring.style.transform = `translate3d(${x - 16}px, ${y - 16}px, 0)`;
      raf = requestAnimationFrame(frame);
    };

    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    raf = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="pointer-events-none fixed z-9998 h-8 w-8 rounded-full border border-cyan-300/55 mix-blend-screen" />
      <div ref={cursorRef} className="pointer-events-none fixed z-9999 h-2 w-2 rounded-full bg-cyan-200 mix-blend-screen" />
    </>
  );
}
