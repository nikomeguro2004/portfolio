'use client';

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const crossRef = useRef<HTMLDivElement>(null);
  const [show, setShow]   = useState(false);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let cx = 0, cy = 0, tx = 0, ty = 0, raf = 0;
    let hovered = false;
    const outer = outerRef.current;
    const cross = crossRef.current;
    if (!outer || !cross) return;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      setShow(true);
    };
    const onLeave = () => setShow(false);
    const onEnter = () => setShow(true);

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    function loop() {
      cx += (tx - cx) * 0.1;
      cy += (ty - cy) * 0.1;

      // Lagged diamond — translate so its CENTER is at cursor
      outer.style.transform = hovered
        ? `translate(${cx - 23}px, ${cy - 23}px) rotate(0deg)`
        : `translate(${cx - 13}px, ${cy - 13}px) rotate(45deg)`;

      // Exact crosshair — 14×14 centered on cursor
      cross.style.transform = `translate(${tx - 7}px, ${ty - 7}px)`;

      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    const bindHover = () => {
      document.querySelectorAll('a, button, [data-cursor], input, textarea, select').forEach(el => {
        if ((el as HTMLElement).dataset.cursorBound) return;
        (el as HTMLElement).dataset.cursorBound = '1';
        el.addEventListener('mouseenter', () => {
          hovered = true;
          outer.style.width        = '46px';
          outer.style.height       = '46px';
          outer.style.borderRadius = '50%';
          outer.style.background   = 'rgba(255,79,26,0.07)';
          outer.style.borderColor  = 'rgba(255,79,26,0.5)';
        });
        el.addEventListener('mouseleave', () => {
          hovered = false;
          outer.style.width        = '26px';
          outer.style.height       = '26px';
          outer.style.borderRadius = '3px';
          outer.style.background   = 'transparent';
          outer.style.borderColor  = '#FF4F1A';
        });
      });
    };
    bindHover();
    const observer = new MutationObserver(bindHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      observer.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Diamond — lagged, rotates to circle on hover */}
      <div
        ref={outerRef}
        style={{
          position:      'fixed',
          top:           0,
          left:          0,
          width:         '26px',
          height:        '26px',
          border:        '1.5px solid #FF4F1A',
          borderRadius:  '3px',
          background:    'transparent',
          pointerEvents: 'none',
          zIndex:        99998,
          willChange:    'transform',
          opacity:       show ? 1 : 0,
          transform:     'translate(-200px,-200px) rotate(45deg)',
          transition:    'width 0.35s cubic-bezier(0.16,1,0.3,1), height 0.35s cubic-bezier(0.16,1,0.3,1), border-radius 0.35s cubic-bezier(0.16,1,0.3,1), background 0.28s ease, border-color 0.28s ease, opacity 0.2s ease',
        }}
      />

      {/* Crosshair — exact mouse position, gradient cross */}
      <div
        ref={crossRef}
        style={{
          position:      'fixed',
          top:           0,
          left:          0,
          width:         '14px',
          height:        '14px',
          pointerEvents: 'none',
          zIndex:        99999,
          willChange:    'transform',
          opacity:       show ? 1 : 0,
          transform:     'translate(-200px,-200px)',
          transition:    'opacity 0.18s ease',
          background:    'linear-gradient(#FF4F1A,#FF4F1A) center/14px 1.5px no-repeat, linear-gradient(#FF4F1A,#FF4F1A) center/1.5px 14px no-repeat',
        }}
      />
    </>
  );
}
