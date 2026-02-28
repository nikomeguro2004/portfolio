'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, stagger } from 'animejs';

interface AppLoadingSequenceProps {
  onComplete: () => void;
  minDuration?: number;
}

const LOADING_STAGES = [
  'Calibrating interface field',
  'Warming service mesh',
  'Routing data streams',
  'Locking deployment vectors',
  'Preparing launch corridor',
];

export default function AppLoadingSequence({ onComplete, minDuration = 2800 }: AppLoadingSequenceProps) {
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [complete, setComplete] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const primaryProgressRef = useRef<HTMLDivElement>(null);
  const secondaryProgressRef = useRef<HTMLDivElement>(null);
  const ringCoreRef = useRef<HTMLDivElement>(null);
  const ringOuterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current || !linesRef.current) return;

    animate(linesRef.current.children, {
      opacity: [0, 1],
      translateX: [-14, 0],
      delay: stagger(120, { start: 180 }),
      duration: 480,
      ease: 'out(3)',
    });

    if (ringCoreRef.current) {
      animate(ringCoreRef.current, {
        rotate: 360,
        duration: 6500,
        loop: true,
        ease: 'linear',
      });
    }

    if (ringOuterRef.current) {
      animate(ringOuterRef.current, {
        rotate: -360,
        scale: [0.98, 1.03, 0.98],
        duration: 5200,
        loop: true,
        ease: 'inOutSine',
      });
    }
  }, []);

  useEffect(() => {
    const startTime = Date.now();
    let frameId = 0;
    let done = false;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(elapsed / minDuration, 1);
      const eased = 1 - Math.pow(1 - rawProgress, 3);
      const normalized = eased > 0.9 && rawProgress < 1 ? 0.9 + Math.sin(elapsed * 0.002) * 0.012 : eased;
      const percent = Math.max(0, Math.min(100, normalized * 100));

      setProgress(percent);

      const nextStage = Math.min(Math.floor((percent / 100) * LOADING_STAGES.length), LOADING_STAGES.length - 1);
      setStageIndex(nextStage);

      if (primaryProgressRef.current) {
        primaryProgressRef.current.style.width = `${percent}%`;
      }

      if (secondaryProgressRef.current) {
        const secondary = Math.max(0, percent - 18) * 1.08;
        secondaryProgressRef.current.style.width = `${Math.min(100, secondary)}%`;
      }

      if (rawProgress < 1) {
        frameId = requestAnimationFrame(tick);
      } else if (!done) {
        done = true;
        performExit();
      }
    };

    const performExit = () => {
      if (!rootRef.current) {
        setComplete(true);
        onComplete();
        return;
      }

      animate(rootRef.current, {
        opacity: [1, 0],
        scale: [1, 1.03],
        filter: ['blur(0px)', 'blur(8px)'],
        duration: 700,
        ease: 'inOut(3)',
        complete: () => {
          setComplete(true);
          onComplete();
        },
      });
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [minDuration, onComplete]);

  useEffect(() => {
    if (!statusRef.current) return;

    animate(statusRef.current, {
      opacity: [0.5, 1],
      translateY: [4, 0],
      duration: 260,
      ease: 'out(3)',
    });
  }, [stageIndex]);

  if (complete) return null;

  return (
    <div ref={rootRef} className="loader-chamber fixed inset-0 z-9999 flex items-center justify-center px-6">
      <div className="loader-grid absolute inset-0" />

      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.12), transparent 56%)' }} />

      <div className="relative w-full max-w-2xl rounded-2xl border border-cyan-300/25 bg-black/45 p-6 backdrop-blur-md">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-xs tracking-[0.2em] uppercase" style={{ color: 'var(--text-tertiary)' }}>
            Launch Director
          </p>
          <p className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
            {Math.round(progress)}%
          </p>
        </div>

        <div className="mb-5 grid gap-2">
          <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: 'rgba(148, 163, 184, 0.22)' }}>
            <div ref={primaryProgressRef} className="h-full rounded-full bg-linear-to-r from-cyan-300 via-sky-400 to-indigo-400" style={{ width: '0%' }} />
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full" style={{ background: 'rgba(71, 85, 105, 0.28)' }}>
            <div ref={secondaryProgressRef} className="h-full rounded-full bg-linear-to-r from-indigo-300 via-cyan-300 to-cyan-100" style={{ width: '0%' }} />
          </div>
        </div>

        <div className="mb-6 grid grid-cols-[auto_1fr] items-center gap-5">
          <div className="relative h-20 w-20 rounded-full border border-cyan-300/25 bg-cyan-500/5">
            <div ref={ringOuterRef} className="absolute inset-1 rounded-full border border-indigo-300/30" />
            <div ref={ringCoreRef} className="absolute inset-3 rounded-full border border-cyan-200/45" />
            <div className="absolute rounded-full bg-cyan-300/70" style={{ inset: '26px' }} />
          </div>

          <p ref={statusRef} className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
            {LOADING_STAGES[stageIndex]}
          </p>
        </div>

        <div ref={linesRef} className="grid gap-2.5 font-mono text-xs">
          {LOADING_STAGES.map((line, index) => (
            <p key={line} className="opacity-0" style={{ color: index <= stageIndex ? 'var(--text-secondary)' : 'var(--text-tertiary)' }}>
              <span className="mr-2 text-cyan-300">[{String(index + 1).padStart(2, '0')}]</span>
              {line}
            </p>
          ))}
        </div>

        <p className="mt-4 text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--text-tertiary)' }}>
          Runtime aligned · Experience initiating
        </p>
      </div>

      <div className="pointer-events-none absolute bottom-10 text-[10px] uppercase tracking-[0.26em]" style={{ color: 'var(--text-tertiary)' }}>
        ADITYAN SYSTEM INTERFACE
      </div>
    </div>
  );
}
