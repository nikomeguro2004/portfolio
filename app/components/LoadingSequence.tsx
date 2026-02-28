'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, stagger } from 'animejs';

interface LoadingSequenceProps {
  onComplete: () => void;
  minDuration?: number;
}

const LOADING_STAGES = [
  'Booting runtime',
  'Mounting modules',
  'Syncing pipelines',
  'Stabilizing graph',
  'Ready to execute',
];

export default function LoadingSequence({ onComplete, minDuration = 2800 }: LoadingSequenceProps) {
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [complete, setComplete] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current || !linesRef.current) return;

    animate(linesRef.current.children, {
      opacity: [0, 1],
      translateX: [-10, 0],
      delay: stagger(150, { start: 220 }),
      duration: 560,
      ease: 'out(3)',
    });

    if (pulseRef.current) {
      animate(pulseRef.current, {
        scale: [0.85, 1.25],
        opacity: [0.65, 0.12],
        loop: true,
        duration: 1700,
        ease: 'out(3)',
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

      if (progressRef.current) {
        progressRef.current.style.width = `${percent}%`;
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
        scale: [1, 1.02],
        duration: 760,
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

      <div className="loader-aura absolute h-72 w-72 rounded-full" />
      <div ref={pulseRef} className="absolute h-72 w-72 rounded-full border border-cyan-300/30" />

      <div className="relative w-full max-w-xl rounded-2xl border border-cyan-300/20 bg-black/35 p-6 backdrop-blur-md">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-xs tracking-[0.2em] uppercase" style={{ color: 'var(--text-tertiary)' }}>
            Runtime Chamber
          </p>
          <p className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
            {Math.round(progress)}%
          </p>
        </div>

        <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full" style={{ background: 'rgba(148, 163, 184, 0.2)' }}>
          <div ref={progressRef} className="loader-progress h-full rounded-full" style={{ width: '0%' }} />
        </div>

        <p ref={statusRef} className="mb-4 text-sm font-medium" style={{ color: 'var(--accent)' }}>
          {LOADING_STAGES[stageIndex]}
        </p>

        <div ref={linesRef} className="space-y-2 font-mono text-xs">
          {LOADING_STAGES.map((line, index) => (
            <p key={line} className="opacity-0" style={{ color: index <= stageIndex ? 'var(--text-secondary)' : 'var(--text-tertiary)' }}>
              <span className="text-cyan-300">›</span> {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
