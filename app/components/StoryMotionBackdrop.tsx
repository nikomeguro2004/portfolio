'use client';

import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

interface StoryMotionBackdropProps {
  emphasize?: boolean;
}

const NEAR_STARS = [
  { x: 8, y: 14, size: 6 },
  { x: 16, y: 28, size: 5 },
  { x: 24, y: 10, size: 6 },
  { x: 32, y: 34, size: 5 },
  { x: 41, y: 22, size: 6 },
  { x: 50, y: 12, size: 5 },
  { x: 58, y: 30, size: 6 },
  { x: 67, y: 16, size: 5 },
  { x: 76, y: 26, size: 6 },
  { x: 86, y: 18, size: 5 },
  { x: 14, y: 56, size: 6 },
  { x: 29, y: 62, size: 5 },
  { x: 44, y: 68, size: 6 },
  { x: 62, y: 58, size: 5 },
  { x: 79, y: 64, size: 6 },
];

const FAR_STARS = [
  { x: 5, y: 8, size: 3 },
  { x: 11, y: 18, size: 3 },
  { x: 18, y: 6, size: 2 },
  { x: 23, y: 20, size: 2 },
  { x: 29, y: 12, size: 3 },
  { x: 35, y: 6, size: 2 },
  { x: 40, y: 18, size: 2 },
  { x: 46, y: 9, size: 3 },
  { x: 53, y: 4, size: 2 },
  { x: 58, y: 14, size: 3 },
  { x: 64, y: 8, size: 2 },
  { x: 70, y: 20, size: 2 },
  { x: 76, y: 10, size: 3 },
  { x: 82, y: 6, size: 2 },
  { x: 88, y: 16, size: 3 },
  { x: 94, y: 12, size: 2 },
  { x: 7, y: 42, size: 2 },
  { x: 15, y: 54, size: 3 },
  { x: 22, y: 44, size: 2 },
  { x: 31, y: 52, size: 2 },
  { x: 39, y: 46, size: 3 },
  { x: 47, y: 57, size: 2 },
  { x: 55, y: 48, size: 2 },
  { x: 63, y: 56, size: 3 },
  { x: 72, y: 47, size: 2 },
  { x: 81, y: 53, size: 2 },
  { x: 90, y: 45, size: 3 },
  { x: 96, y: 58, size: 2 },
  { x: 12, y: 76, size: 2 },
  { x: 24, y: 84, size: 3 },
  { x: 36, y: 74, size: 2 },
  { x: 49, y: 82, size: 2 },
  { x: 61, y: 76, size: 3 },
  { x: 73, y: 84, size: 2 },
  { x: 85, y: 74, size: 2 },
  { x: 93, y: 86, size: 3 },
];

export default function StoryMotionBackdrop({ emphasize = false }: StoryMotionBackdropProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const nearStarRef = useRef<HTMLDivElement>(null);
  const farStarRef = useRef<HTMLDivElement>(null);
  const shootingRef = useRef<HTMLDivElement>(null);
  const shootingXRef = useRef(0);
  const shootingYRef = useRef(0);
  const shootingIdleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;

    const nearStars = rootRef.current.querySelectorAll('.story-star-near');
    const farStars = rootRef.current.querySelectorAll('.story-star-far');
    const streaks = rootRef.current.querySelectorAll('.story-shooting-star');

    animate(nearStars, {
      scale: [0.96, 1.06],
      opacity: [0.55, 1],
      duration: 4600,
      loop: true,
      direction: 'alternate',
      delay: stagger(120),
      ease: 'inOut(3)',
    });

    animate(farStars, {
      translateX: ['-1%', '1%'],
      opacity: [0.16, 0.38],
      duration: 18000,
      loop: true,
      direction: 'alternate',
      delay: stagger(70),
      ease: 'inOutSine',
    });

    animate(streaks, {
      translateX: [0, 34],
      translateY: [0, 18],
      opacity: [0, 0.7, 0],
      duration: 2600,
      loop: true,
      delay: stagger(460),
      ease: 'inOutSine',
    });

    if (shootingRef.current) {
      shootingRef.current.style.opacity = '0';
      shootingRef.current.style.left = '50vw';
      shootingRef.current.style.top = '50vh';
    }

    const handlePointer = (event: MouseEvent) => {
      if (!nearStarRef.current) return;
      const mx = (event.clientX / window.innerWidth - 0.5) * 2;
      const my = (event.clientY / window.innerHeight - 0.5) * 2;

      animate(nearStarRef.current, {
        translateX: mx * 14,
        translateY: my * 10,
        duration: 700,
        ease: 'out(3)',
      });

      if (farStarRef.current) {
        animate(farStarRef.current, {
          translateX: mx * 4,
          translateY: my * 3,
          duration: 820,
          ease: 'out(3)',
        });
      }

      if (shootingRef.current) {
        shootingXRef.current = event.clientX;
        shootingYRef.current = event.clientY;
        shootingRef.current.style.left = `${shootingXRef.current}px`;
        shootingRef.current.style.top = `${shootingYRef.current}px`;

        animate(shootingRef.current, {
          rotate: mx * 10,
          duration: 260,
          ease: 'inOutSine',
        });

        animate(shootingRef.current, {
          opacity: [Number.parseFloat(shootingRef.current.style.opacity || '0'), 0.95],
          duration: 180,
          ease: 'inOutSine',
        });

        if (shootingIdleTimerRef.current) {
          clearTimeout(shootingIdleTimerRef.current);
        }

        shootingIdleTimerRef.current = setTimeout(() => {
          if (!shootingRef.current) return;
          animate(shootingRef.current, {
            opacity: [Number.parseFloat(shootingRef.current.style.opacity || '0.95'), 0],
            duration: 520,
            ease: 'inOutSine',
          });
        }, 360);
      }

    };

    const handlePointerLeave = () => {
      if (!shootingRef.current) return;
      animate(shootingRef.current, {
        opacity: [Number.parseFloat(shootingRef.current.style.opacity || '0.95'), 0],
        duration: 420,
        ease: 'inOutSine',
      });
    };

    window.addEventListener('mousemove', handlePointer);
    window.addEventListener('mouseleave', handlePointerLeave);

    return () => {
      window.removeEventListener('mousemove', handlePointer);
      window.removeEventListener('mouseleave', handlePointerLeave);
      if (shootingIdleTimerRef.current) {
        clearTimeout(shootingIdleTimerRef.current);
      }
    };
  }, [emphasize]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1, opacity: emphasize ? 0.95 : 0.8 }}
      aria-hidden="true"
    >
      <div ref={nearStarRef} className="absolute inset-0">
        {NEAR_STARS.slice(0, emphasize ? NEAR_STARS.length : 10).map((star, index) => (
          <span
            key={`near-${index}`}
            className="story-star-near absolute bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              clipPath: 'polygon(50% 0%, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0% 50%, 38% 38%)',
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.65)',
            }}
          />
        ))}
      </div>

      <div ref={farStarRef} className="absolute inset-0">
        {FAR_STARS.slice(0, emphasize ? FAR_STARS.length : 22).map((star, index) => (
          <span
            key={`far-${index}`}
            className="story-star-far absolute rounded-full bg-slate-100"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              boxShadow: '0 0 8px rgba(226, 232, 240, 0.35)',
            }}
          />
        ))}
      </div>

      <div ref={shootingRef} className="absolute" style={{ left: '50vw', top: '50vh', opacity: 0 }}>
        {Array.from({ length: 3 }).map((_, index) => (
          <span
            key={`shooting-${index}`}
            className="story-shooting-star absolute h-px w-20"
            style={{
              left: `${index * -10}px`,
              top: `${index * 7}px`,
              background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(230,237,243,0.95), rgba(0,229,255,0.2), rgba(255,255,255,0))',
              filter: 'blur(0.2px)',
            }}
          />
        ))}
      </div>

    </div>
  );
}
