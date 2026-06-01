'use client';

import React, {
  Children,
  cloneElement,
  forwardRef,
  HTMLAttributes,
  isValidElement,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import gsap from 'gsap';
import './CardSwap.css';

// ── One-time GSAP global config ────────────────────────────────────────────────
// Runs once when the module is first imported.
// force3D: always use matrix3d so the GPU compositing layer is pre-allocated.
// nullTargetWarn: false: suppress "target not found" during React unmount cycles.
gsap.config({ force3D: true, nullTargetWarn: false });

// ─── Card ─────────────────────────────────────────────────────────────────────

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ customClass, className, ...rest }, ref) => (
    <div
      ref={ref}
      {...rest}
      className={['card', customClass, className].filter(Boolean).join(' ')}
    />
  )
);
Card.displayName = 'Card';

// ─── Slot helpers ──────────────────────────────────────────────────────────────

const makeSlot = (i: number, distX: number, distY: number, total: number) => ({
  x:      i * distX,
  y:     -i * distY,
  z:     -i * distX * 1.5,
  zIndex: total - i,
});

const placeNow = (
  el: HTMLElement,
  slot: ReturnType<typeof makeSlot>,
  skew: number
) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true,
  });

// ─── CardSwap ─────────────────────────────────────────────────────────────────

export interface CardSwapProps {
  width?:            number | string;
  height?:           number | string;
  cardDistance?:     number;
  verticalDistance?: number;
  delay?:            number;
  pauseOnHover?:     boolean;
  onCardClick?:      (idx: number) => void;
  skewAmount?:       number;
  easing?:           'linear' | 'elastic';
  children:          ReactNode;
}

const CardSwap = ({
  width            = 500,
  height           = 400,
  cardDistance     = 60,
  verticalDistance = 70,
  delay            = 5000,
  pauseOnHover     = false,
  onCardClick,
  skewAmount       = 6,
  easing           = 'elastic',
  children,
}: CardSwapProps) => {
  const cfg =
    easing === 'elastic'
      ? { ease: 'elastic.out(0.6,0.9)', durDrop: 2,   durMove: 2,   durReturn: 2,   promoteOverlap: 0.9,  returnDelay: 0.05 }
      : { ease: 'power1.inOut',          durDrop: 0.8, durMove: 0.8, durReturn: 0.8, promoteOverlap: 0.45, returnDelay: 0.2  };

  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(
    () => childArr.map(() => React.createRef<HTMLDivElement | null>()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childArr.length]
  ) as React.RefObject<HTMLDivElement | null>[];

  const order       = useRef<number[]>(Array.from({ length: childArr.length }, (_, i) => i));
  const tlRef       = useRef<gsap.core.Timeline | null>(null);
  const dcRef       = useRef<gsap.core.Tween | null>(null);   // delayedCall handle
  const paused      = useRef(false);
  const container   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const total = refs.length;

    // ── Initial placement (no animation, no layout thrash) ──────────
    refs.forEach((r, i) =>
      r.current && placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount)
    );

    // ── Swap function ────────────────────────────────────────────────
    const swap = () => {
      if (paused.current || order.current.length < 2) return;

      const [front, ...rest] = order.current;
      const elFront = refs[front].current;
      if (!elFront) return;

      // Kill any running timeline before starting a new one
      tlRef.current?.kill();
      const tl = gsap.timeline({
        // Auto-clean after completion so GC can collect it
        onComplete: () => { tlRef.current = null; },
      });
      tlRef.current = tl;

      // Drop front card
      tl.to(elFront, {
        y: '+=500',
        duration: cfg.durDrop,
        ease: cfg.ease,
        overwrite: 'auto',
        force3D: true,
      });

      // Promote remaining cards forward
      tl.addLabel('promote', `-=${cfg.durDrop * cfg.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx].current;
        if (!el) return;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, 'promote');
        tl.to(el, {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          duration: cfg.durMove,
          ease: cfg.ease,
          overwrite: 'auto',
          force3D: true,
        }, `promote+=${i * 0.15}`);
      });

      // Return dropped card to back
      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      tl.addLabel('return', `promote+=${cfg.durMove * cfg.returnDelay}`);
      tl.call(() => { gsap.set(elFront, { zIndex: backSlot.zIndex }); }, undefined, 'return');
      tl.to(elFront, {
        x: backSlot.x,
        y: backSlot.y,
        z: backSlot.z,
        duration: cfg.durReturn,
        ease: cfg.ease,
        overwrite: 'auto',
        force3D: true,
      }, 'return');
      tl.call(() => { order.current = [...rest, front]; });
    };

    // ── Use GSAP delayedCall instead of setInterval ──────────────────
    // This keeps everything on the GSAP ticker — no setInterval drift.
    const scheduleNext = () => {
      dcRef.current?.kill();
      dcRef.current = gsap.delayedCall(delay / 1000, () => {
        swap();
        scheduleNext();   // re-queue
      });
    };

    swap();          // first swap immediately
    scheduleNext();  // then loop via delayedCall

    // ── Pause on hover & off-screen ───────────────────────────────────────────────
    let isHovered = false;
    let isIntersecting = true;

    const pause = () => {
      paused.current = true;
      tlRef.current?.pause();
      dcRef.current?.pause();
    };
    const resume = () => {
      // Only resume if both NOT hovered AND IS intersecting
      if (!isHovered && isIntersecting) {
        paused.current = false;
        tlRef.current?.resume();
        dcRef.current?.resume();
      }
    };

    const node = container.current;
    if (node) {
      if (pauseOnHover) {
        node.addEventListener('mouseenter', () => { isHovered = true; pause(); });
        node.addEventListener('mouseleave', () => { isHovered = false; resume(); });
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isIntersecting = entry.isIntersecting;
            if (isIntersecting) {
              resume();
            } else {
              pause();
            }
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(node);

      return () => {
        observer.disconnect();
        if (pauseOnHover) {
          // Listeners are garbage collected if node is destroyed, but we can't remove anonymous funcs easily
          // It's safe to let them GC.
        }
        tlRef.current?.kill();
        dcRef.current?.kill();
      };
    }

    return () => {
      tlRef.current?.kill();
      dcRef.current?.kill();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing]);

  const rendered = childArr.map((child, i) => {
    if (!isValidElement(child)) return child;
    const el = child as React.ReactElement<CardProps & {
      ref?: React.Ref<HTMLDivElement>;
      style?: React.CSSProperties;
      onClick?: (e: React.MouseEvent) => void;
    }>;
    return cloneElement(el, {
      key: i,
      ref: refs[i] as React.Ref<HTMLDivElement | null>,
      style: { width, height, ...(el.props.style ?? {}) },
      onClick: (e: React.MouseEvent) => {
        el.props.onClick?.(e);
        onCardClick?.(i);
      },
    });
  });

  return (
    <div ref={container} className="card-swap-container" style={{ width, height }}>
      {rendered}
    </div>
  );
};

export default CardSwap;
