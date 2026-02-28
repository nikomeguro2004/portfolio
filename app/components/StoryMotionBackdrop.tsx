'use client';

import { useEffect, useRef } from 'react';
import { animate, createTimeline, stagger } from 'animejs';

interface StoryMotionBackdropProps {
  emphasize?: boolean;
}

export default function StoryMotionBackdrop({ emphasize = false }: StoryMotionBackdropProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const nodeLayerRef = useRef<HTMLDivElement>(null);
  const farFieldRef = useRef<HTMLDivElement>(null);
  const streamLayerRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;

    const arcs = rootRef.current.querySelectorAll('.story-arc');
    const nodes = rootRef.current.querySelectorAll('.story-node');
    const farNodes = rootRef.current.querySelectorAll('.story-far-node');
    const streams = rootRef.current.querySelectorAll('.story-stream');
    const codeRows = rootRef.current.querySelectorAll('.story-row');
    const pulseEl = rootRef.current.querySelector('.story-pulse');
    const coreEl = rootRef.current.querySelector('.story-core');

    const timeline = createTimeline({ defaults: { ease: 'inOutSine' } });

    timeline
      .add(arcs, {
        rotate: (_target: unknown, index: number) => (index % 2 === 0 ? 360 : -360),
        duration: (_target: unknown, index: number) => 16000 + index * 4200,
        delay: stagger(260),
        loop: true,
      })
      .add(codeRows, {
        opacity: [0.2, 0.95],
        translateX: ['-4%', '6%'],
        duration: 2600,
        direction: 'alternate',
        loop: true,
        delay: stagger(120),
      }, 0);

    animate(nodes, {
      scale: [0.8, 1.35],
      opacity: [0.3, 1],
      duration: 2200,
      loop: true,
      direction: 'alternate',
      delay: stagger(90),
      ease: 'inOut(3)',
    });

    animate(farNodes, {
      translateY: ['-8%', '12%'],
      opacity: [0.18, 0.55],
      duration: 9000,
      loop: true,
      direction: 'alternate',
      delay: stagger(80),
      ease: 'inOutSine',
    });

    animate(streams, {
      translateX: ['-112%', '126%'],
      opacity: [0, 0.85, 0],
      duration: 3200,
      loop: true,
      delay: stagger(360),
      ease: 'inOutSine',
    });

    if (pulseEl) {
      animate(pulseEl, {
        scale: [0.85, 1.24],
        opacity: [0.45, 0.08],
        duration: 2000,
        loop: true,
        ease: 'out(3)',
      });
    }

    if (coreEl) {
      animate(coreEl, {
        rotate: 360,
        duration: 18000,
        loop: true,
        ease: 'linear',
      });
    }

    if (beamRef.current) {
      animate(beamRef.current, {
        translateX: ['-52%', '112%'],
        duration: 3000,
        loop: true,
        ease: 'inOutSine',
      });
    }

    const handlePointer = (event: MouseEvent) => {
      if (!ringRef.current || !nodeLayerRef.current) return;
      const mx = (event.clientX / window.innerWidth - 0.5) * 2;
      const my = (event.clientY / window.innerHeight - 0.5) * 2;

      animate(ringRef.current, {
        rotateX: my * 8,
        rotateY: mx * -10,
        duration: 520,
        ease: 'out(3)',
      });

      animate(nodeLayerRef.current, {
        translateX: mx * 24,
        translateY: my * 18,
        duration: 600,
        ease: 'out(3)',
      });

      if (farFieldRef.current) {
        animate(farFieldRef.current, {
          translateX: mx * 12,
          translateY: my * 10,
          duration: 760,
          ease: 'out(3)',
        });
      }

      if (streamLayerRef.current) {
        animate(streamLayerRef.current, {
          translateX: mx * -10,
          translateY: my * -8,
          duration: 650,
          ease: 'out(3)',
        });
      }
    };

    const handleScroll = () => {
      if (!rootRef.current) return;
      const maxScrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(window.scrollY / maxScrollable, 0), 1);
      rootRef.current.style.opacity = `${emphasize ? 0.95 - progress * 0.35 : 0.75 - progress * 0.25}`;
    };

    window.addEventListener('mousemove', handlePointer);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      timeline.pause();
      window.removeEventListener('mousemove', handlePointer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [emphasize]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0, opacity: emphasize ? 0.95 : 0.75 }}
      aria-hidden="true"
    >
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 35%, rgba(56, 189, 248, 0.18), transparent 52%)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 18% 82%, rgba(129, 140, 248, 0.12), transparent 42%)' }} />

      <div
        ref={ringRef}
        className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2"
        style={{ width: emphasize ? 760 : 620, height: emphasize ? 760 : 620, transformStyle: 'preserve-3d' }}
      >
        <div className="story-arc absolute inset-0 rounded-full border border-cyan-400/25" />
        <div className="story-arc absolute inset-[12%] rounded-full border border-sky-300/20" />
        <div className="story-arc absolute inset-[24%] rounded-full border border-cyan-500/25" />
        <div className="story-arc absolute inset-[34%] rounded-full border border-cyan-200/20" />
        <div className="story-arc absolute inset-[42%] rounded-full border border-indigo-300/20" />

        <div className="story-pulse absolute inset-[32%] rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="story-core absolute inset-[44%] rounded-full border border-cyan-300/35" />
      </div>

      <div ref={nodeLayerRef} className="absolute inset-0">
        {Array.from({ length: emphasize ? 28 : 20 }).map((_, index) => (
          <span
            key={index}
            className="story-node absolute h-1.5 w-1.5 rounded-full bg-cyan-300"
            style={{
              left: `${12 + (index * 4.2) % 76}%`,
              top: `${8 + (index * 5.5) % 80}%`,
              boxShadow: '0 0 14px rgba(56, 189, 248, 0.7)',
            }}
          />
        ))}
      </div>

      <div ref={farFieldRef} className="absolute inset-0">
        {Array.from({ length: emphasize ? 54 : 36 }).map((_, index) => (
          <span
            key={`far-${index}`}
            className="story-far-node absolute h-1 w-1 rounded-full bg-indigo-200/60"
            style={{
              left: `${6 + (index * 5.1) % 90}%`,
              top: `${4 + (index * 7.3) % 92}%`,
              boxShadow: '0 0 10px rgba(129, 140, 248, 0.55)',
            }}
          />
        ))}
      </div>

      <div ref={streamLayerRef} className="absolute inset-x-[4%] top-[20%] space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={`stream-row-${index}`} className="relative h-1 overflow-hidden rounded-full bg-white/5">
            <div className="story-stream absolute top-0 left-0 h-full w-22" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(94, 234, 212, 0.9) 55%, transparent 100%)' }} />
          </div>
        ))}
      </div>

      <div className="absolute left-1/2 top-[44%] -translate-x-1/2 h-16 w-[72vw] max-w-225 overflow-hidden rounded-full border border-cyan-400/20 bg-cyan-500/5">
        <div ref={beamRef} className="h-full w-24" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(56, 189, 248, 0.75) 52%, transparent 100%)' }} />
      </div>

      <div className="absolute right-[6%] top-[12%] w-55 space-y-2 opacity-70">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="story-row h-1.5 rounded-full bg-cyan-300/25" style={{ width: `${88 - index * 9}%` }} />
        ))}
      </div>
    </div>
  );
}
