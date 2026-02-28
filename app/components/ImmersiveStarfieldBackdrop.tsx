'use client';

import { useEffect, useRef } from 'react';
import { animate } from 'animejs';

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function ImmersiveStarfieldBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null);
  const cometRef = useRef<HTMLDivElement>(null);

  const targetXRef = useRef(0);
  const targetYRef = useRef(0);
  const currentXRef = useRef(0);
  const currentYRef = useRef(0);
  const previousXRef = useRef(0);
  const previousYRef = useRef(0);
  const currentStretchRef = useRef(1);
  const targetStretchRef = useRef(1);
  const angleRef = useRef(0);

  const rafRef = useRef<number | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isCometVisibleRef = useRef(false);

  useEffect(() => {
    if (!rootRef.current || !cometRef.current) return;

    const root = rootRef.current;
    const comet = cometRef.current;

    const starCount = randomInt(50, 60);
    const starFragment = document.createDocumentFragment();

    for (let index = 0; index < starCount; index += 1) {
      const star = document.createElement('span');
      const size = randomBetween(1, 3);
      const opacity = randomBetween(0.2, 0.6);
      const color = Math.random() > 0.72 ? 'rgba(224, 241, 255, 1)' : 'rgba(255, 255, 255, 1)';

      star.className = 'immersive-star absolute rounded-full';
      star.style.left = `${randomBetween(0, 100)}%`;
      star.style.top = `${randomBetween(0, 100)}%`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.opacity = `${opacity}`;
      star.style.backgroundColor = color;
      star.style.boxShadow = '0 0 4px rgba(180, 220, 255, 0.35)';

      starFragment.appendChild(star);
    }

    root.appendChild(starFragment);

    const sparkleCount = randomInt(8, 12);
    const starElements = Array.from(root.querySelectorAll<HTMLElement>('.immersive-star'));
    const sparkleAnimations: Array<{ pause?: () => void }> = [];

    const shuffledIndexes = starElements
      .map((_, index) => index)
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(sparkleCount, starElements.length));

    shuffledIndexes.forEach((index) => {
      const element = starElements[index];
      if (!element) return;

      sparkleAnimations.push(
        animate(element, {
          opacity: [0.2, 0.9],
          duration: randomBetween(3000, 6000),
          direction: 'alternate',
          loop: true,
          ease: 'inOutSine',
        })
      );
    });

    const fadeInComet = () => {
      if (isCometVisibleRef.current) return;
      isCometVisibleRef.current = true;
      animate(comet, {
        opacity: [Number.parseFloat(comet.style.opacity || '0'), 1],
        duration: 160,
        ease: 'inOutSine',
      });
    };

    const fadeOutComet = () => {
      isCometVisibleRef.current = false;
      animate(comet, {
        opacity: [Number.parseFloat(comet.style.opacity || '1'), 0],
        duration: 400,
        ease: 'inOutSine',
      });
    };

    const scheduleIdleFade = () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      idleTimerRef.current = setTimeout(() => {
        fadeOutComet();
      }, 500);
    };

    const onMouseMove = (event: MouseEvent) => {
      const deltaX = event.clientX - targetXRef.current;
      const deltaY = event.clientY - targetYRef.current;
      const speed = Math.hypot(deltaX, deltaY);

      targetXRef.current = event.clientX;
      targetYRef.current = event.clientY;
      targetStretchRef.current = Math.min(8, Math.max(1, 1 + speed * 0.1));

      fadeInComet();
      scheduleIdleFade();
    };

    const updateComet = () => {
      currentXRef.current += (targetXRef.current - currentXRef.current) * 0.08;
      currentYRef.current += (targetYRef.current - currentYRef.current) * 0.08;
      currentStretchRef.current += (targetStretchRef.current - currentStretchRef.current) * 0.14;

      const dx = currentXRef.current - previousXRef.current;
      const dy = currentYRef.current - previousYRef.current;
      const speed = Math.hypot(dx, dy);
      if (speed > 0.06) {
        angleRef.current = Math.atan2(dy, dx) * (180 / Math.PI);
      }

      if (speed < 0.04) {
        targetStretchRef.current = 1;
      }

      comet.style.transform = `translate3d(${currentXRef.current}px, ${currentYRef.current}px, 0) rotate(${angleRef.current}deg) scaleX(${currentStretchRef.current})`;

      previousXRef.current = currentXRef.current;
      previousYRef.current = currentYRef.current;

      rafRef.current = window.requestAnimationFrame(updateComet);
    };

    const initialX = window.innerWidth / 2;
    const initialY = window.innerHeight / 2;

    targetXRef.current = initialX;
    targetYRef.current = initialY;
    currentXRef.current = initialX;
    currentYRef.current = initialY;
    previousXRef.current = initialX;
    previousYRef.current = initialY;
    currentStretchRef.current = 1;
    targetStretchRef.current = 1;
    angleRef.current = 0;

    comet.style.opacity = '0';
    comet.style.transform = `translate3d(${initialX}px, ${initialY}px, 0) rotate(0deg) scaleX(1)`;

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    rafRef.current = window.requestAnimationFrame(updateComet);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }

      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }

      sparkleAnimations.forEach((animation) => {
        animation.pause?.();
      });

      root.querySelectorAll('.immersive-star').forEach((star) => {
        star.remove();
      });
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{
        zIndex: 1,
        background: 'linear-gradient(180deg, #04060A 0%, #0B1220 100%)',
      }}
      aria-hidden="true"
    >
      <div
        ref={cometRef}
        className="absolute"
        style={{
          width: '12px',
          height: '2px',
          opacity: 0,
          filter: 'blur(0.6px)',
          borderRadius: '9999px',
          transformOrigin: 'center center',
          willChange: 'transform, opacity',
          background: 'linear-gradient(90deg, rgba(255,255,255,0.25), rgba(255,255,255,0.98), rgba(34,211,238,0.72), rgba(255,255,255,0.18))',
          boxShadow: '0 0 8px rgba(34, 211, 238, 0.35)',
        }}
      />
    </div>
  );
}
