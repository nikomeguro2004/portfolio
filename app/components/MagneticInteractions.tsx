'use client';

import { useEffect, useRef, useState } from 'react';

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

  useEffect(() => {
    const node = buttonRef.current;
    if (!node) return;

    let rafId = 0;
    const move = (event: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      const x = (event.clientX - (rect.left + rect.width / 2)) * (strength * 40);
      const y = (event.clientY - (rect.top + rect.height / 2)) * (strength * 40);
      
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        node.style.setProperty('--mx', `${x}px`);
        node.style.setProperty('--my', `${y}px`);
      });
    };

    const reset = () => {
      cancelAnimationFrame(rafId);
      node.style.setProperty('--mx', `0px`);
      node.style.setProperty('--my', `0px`);
    };

    node.addEventListener('mousemove', move);
    node.addEventListener('mouseleave', reset);

    return () => {
      node.removeEventListener('mousemove', move);
      node.removeEventListener('mouseleave', reset);
      cancelAnimationFrame(rafId);
    };
  }, [strength]);

  const props = {
    className: `css-magnetic-btn ${className}`,
    onClick,
  };

  const inner = <span className="css-magnetic-inner">{children}</span>;

  if (href) {
    return (
      <a ref={(n) => { buttonRef.current = n; }} href={href} target={target} rel={rel} {...props}>
        {inner}
      </a>
    );
  }
  return <button ref={(n) => { buttonRef.current = n; }} {...props}>{inner}</button>;
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

    let rafId = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const mouseX = e.clientX - (rect.left + rect.width / 2);
      const mouseY = e.clientY - (rect.top + rect.height / 2);

      const rotateX = (mouseY / (rect.height / 2)) * -rotationStrength;
      const rotateY = (mouseX / (rect.width / 2)) * rotationStrength;

      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        card.style.setProperty('--crx', `${rotateX}deg`);
        card.style.setProperty('--cry', `${rotateY}deg`);

        const px = ((e.clientX - rect.left) / rect.width) * 100;
        const py = ((e.clientY - rect.top) / rect.height) * 100;
        sheen.style.background = `radial-gradient(circle at ${px}% ${py}%, ${glowColor}, transparent 52%)`;
        sheen.style.opacity = '1';
      });
    };

    const handleMouseLeave = () => {
      cancelAnimationFrame(rafId);
      card.style.setProperty('--crx', `0deg`);
      card.style.setProperty('--cry', `0deg`);
      sheen.style.opacity = '0';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, [glowColor, rotationStrength]);

  return (
    <div 
      ref={cardRef} 
      className={`css-magnetic-card ${className}`}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div ref={sheenRef} className="css-magnetic-sheen" aria-hidden="true" />
      {children}
    </div>
  );
}

export function CustomCursor() {
  const cursorWrapperRef = useRef<HTMLDivElement>(null);
  const ringWrapperRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);

  useEffect(() => {
    const cursor = cursorWrapperRef.current;
    const ring = ringWrapperRef.current;
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

    const onDown = () => setIsDown(true);
    const onUp = () => setIsDown(false);

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
      <style dangerouslySetInnerHTML={{__html: `
        .css-magnetic-btn {
          display: inline-block;
          transform: translate3d(var(--mx, 0), var(--my, 0), 0);
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          will-change: transform;
        }
        .css-magnetic-btn:hover {
          transition: transform 0.1s ease-out;
        }
        .css-magnetic-inner {
          display: inline-flex;
          transform: translate3d(calc(var(--mx, 0) * 1.2), calc(var(--my, 0) * 1.2), 0);
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          will-change: transform;
        }
        .css-magnetic-btn:hover .css-magnetic-inner {
          transition: transform 0.1s ease-out;
        }

        .css-magnetic-card {
          position: relative;
          transform-style: preserve-3d;
          transform: perspective(1000px) rotateX(var(--crx, 0deg)) rotateY(var(--cry, 0deg));
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform;
        }
        .css-magnetic-card:hover {
          transition: transform 0.1s ease-out;
        }
        .css-magnetic-sheen {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .cursor-scale-inner {
          width: 100%; height: 100%;
          border-radius: 50%;
          transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cursor-scale-down {
          transform: scale(0.85);
        }
      `}} />
      <div ref={ringWrapperRef} className="pointer-events-none fixed top-0 left-0 z-[9998] h-8 w-8 mix-blend-screen will-change-transform">
        <div className={`cursor-scale-inner border border-cyan-300/55 ${isDown ? 'cursor-scale-down' : ''}`} />
      </div>
      <div ref={cursorWrapperRef} className="pointer-events-none fixed top-0 left-0 z-[9999] h-2 w-2 mix-blend-screen will-change-transform">
        <div className={`cursor-scale-inner bg-cyan-200 ${isDown ? 'cursor-scale-down' : ''}`} />
      </div>
    </>
  );
}
