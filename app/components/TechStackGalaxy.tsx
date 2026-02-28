'use client';

import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';
import { MagneticCard } from './MagneticEffects';

interface TechStackGalaxyProps {
  skills: Record<string, string[]>;
}

export default function TechStackGalaxy({ skills }: TechStackGalaxyProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;

    const cards = rootRef.current.querySelectorAll('.tech-galaxy-card');
    const dots = rootRef.current.querySelectorAll('.tech-galaxy-dot');

    animate(cards, {
      translateY: [20, 0],
      opacity: [0, 1],
      delay: stagger(75, { start: 120 }),
      duration: 560,
      ease: 'out(3)',
    });

    animate(dots, {
      scale: [0.8, 1.25],
      opacity: [0.4, 1],
      delay: stagger(45),
      duration: 1600,
      loop: true,
      direction: 'alternate',
      ease: 'inOut(3)',
    });
  }, []);

  return (
    <section id="skills" className="py-16">
      <div className="container">
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-4">Systems I Work With</h2>
          <p className="text-sm max-w-2xl" style={{ color: 'var(--text-tertiary)' }}>
            Production-ready technologies across the stack
          </p>
          <p className="text-sm mt-2 max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
            A modular stack that shifts by product context, from fast-launch startup websites to backend-heavy production systems.
          </p>
        </div>

        <div ref={rootRef} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {Object.entries(skills).map(([category, items]) => (
            <MagneticCard
              key={category}
              className="tech-galaxy-card card h-full relative overflow-hidden opacity-0"
              rotationStrength={2.4}
              glowColor="rgba(56, 189, 248, 0.2)"
            >
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 80% 10%, rgba(56, 189, 248, 0.14), transparent 38%)' }} />
              <h3 className="text-lg font-bold mb-4 text-cyan-400">{category}</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {items.map((skill) => (
                  <span key={skill} className="skill-badge" style={{ opacity: 0.85 }}>{skill}</span>
                ))}
              </div>
              <div className="grid grid-cols-10 gap-1.5">
                {Array.from({ length: 20 }).map((_, i) => (
                  <span key={i} className="tech-galaxy-dot h-1.5 w-1.5 rounded-full bg-cyan-300" style={{ boxShadow: '0 0 8px rgba(94, 234, 212, 0.65)' }} />
                ))}
              </div>
            </MagneticCard>
          ))}
        </div>
      </div>
    </section>
  );
}
