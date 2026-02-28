'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { animate, stagger } from 'animejs';
import { AnimatePresence, motion } from 'framer-motion';

interface SolarSystemSkillsProps {
  skills: Record<string, string[]>;
}

type ClusterId = 'frontend' | 'backend' | 'ai' | 'infrastructure';

type ClusterConfig = {
  id: ClusterId;
  label: string;
  sourceKey: string;
  description: string;
  role: string;
  radius: number;
  orbitDuration: number;
  nodeDuration: number;
  startAngle: number;
  accent: '#00E5FF' | '#7B61FF';
  depth: 'near' | 'far';
  planetSize: number;
};

const EASE_SINE: [number, number, number, number] = [0.445, 0.05, 0.55, 0.95];

const CLUSTERS: ClusterConfig[] = [
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    sourceKey: 'Cloud & Delivery',
    description: 'Runtime, deployment, and operational reliability architecture.',
    role: 'Supports delivery, resilience, observability, and production performance.',
    radius: 328,
    orbitDuration: 118000,
    nodeDuration: 18000,
    startAngle: 40,
    accent: '#7B61FF',
    depth: 'far',
    planetSize: 20,
  },
  {
    id: 'ai',
    label: 'AI',
    sourceKey: 'AI Engineering',
    description: 'LLM integration layer for retrieval, generation, and inference workflows.',
    role: 'Bridges model capability with practical product behavior and quality outputs.',
    radius: 258,
    orbitDuration: 106000,
    nodeDuration: 16400,
    startAngle: 210,
    accent: '#00E5FF',
    depth: 'far',
    planetSize: 18,
  },
  {
    id: 'backend',
    label: 'Backend',
    sourceKey: 'Backend & APIs',
    description: 'Service orchestration and API contracts across product modules.',
    role: 'Coordinates business logic, integrations, and secure data flow.',
    radius: 188,
    orbitDuration: 96000,
    nodeDuration: 14600,
    startAngle: 322,
    accent: '#7B61FF',
    depth: 'near',
    planetSize: 17,
  },
  {
    id: 'frontend',
    label: 'Frontend',
    sourceKey: 'Frontend Systems',
    description: 'Interface architecture for speed, clarity, and responsive interaction.',
    role: 'Delivers system capabilities through polished, maintainable user surfaces.',
    radius: 128,
    orbitDuration: 90000,
    nodeDuration: 12600,
    startAngle: 135,
    accent: '#00E5FF',
    depth: 'near',
    planetSize: 15,
  },
];

export default function SolarSystemSkills({ skills }: SolarSystemSkillsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const shootingInfoRef = useRef<HTMLDivElement>(null);
  const [hoveredCluster, setHoveredCluster] = useState<ClusterId | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<ClusterId>('frontend');

  const stars = useMemo(
    () =>
      Array.from({ length: 48 }, (_, index) => ({
        id: index,
        x: `${(index * 7.9 + 3.8) % 100}%`,
        y: `${(index * 11.6 + 9.5) % 100}%`,
        size: index % 5 === 0 ? 2 : 1,
      })),
    []
  );

  const clusters = useMemo(
    () =>
      CLUSTERS.map((cluster) => {
        const technologies = (skills[cluster.sourceKey] ?? []).slice(0, 8);
        const nodes = technologies.map((tech, index) => ({
          id: `${cluster.id}-${tech}`,
          tech,
          angle: (360 / Math.max(technologies.length, 1)) * index,
          orbitRadius: 20 + (index % 3) * 7,
          size: index % 4 === 0 ? 6 : 5,
        }));

        return {
          ...cluster,
          technologies,
          nodes,
        };
      }),
    [skills]
  );

  const activeClusterId = hoveredCluster ?? selectedCluster;
  const activeCluster = clusters.find((cluster) => cluster.id === activeClusterId) ?? clusters[0];

  useEffect(() => {
    if (!rootRef.current) return;

    const animations: Array<{ pause: () => void }> = [];

    const twinkles = rootRef.current.querySelectorAll('[data-solar-star]');
    animations.push(
      animate(twinkles, {
        opacity: [0.2, 0.72],
        duration: 2600,
        delay: stagger(90),
        direction: 'alternate',
        loop: true,
        ease: 'inOutSine',
      })
    );

    const core = rootRef.current.querySelector('[data-core-pulse]');
    if (core) {
      animations.push(
        animate(core, {
          scale: [1, 1.03],
          duration: 5600,
          direction: 'alternate',
          loop: true,
          ease: 'inOutSine',
        })
      );
    }

    const orbits = rootRef.current.querySelectorAll<HTMLElement>('[data-cluster-orbit]');
    orbits.forEach((orbit) => {
      const duration = Number(orbit.dataset.duration ?? 98000);
      const start = Number(orbit.dataset.start ?? 0);
      animations.push(
        animate(orbit, {
          rotate: [start, start + 360],
          duration,
          loop: true,
          ease: 'linear',
        })
      );
    });

    const nodeOrbits = rootRef.current.querySelectorAll<HTMLElement>('[data-node-orbit]');
    nodeOrbits.forEach((orbit) => {
      const duration = Number(orbit.dataset.duration ?? 14500);
      animations.push(
        animate(orbit, {
          rotate: [0, 360],
          duration,
          loop: true,
          ease: 'linear',
        })
      );
    });

    return () => {
      animations.forEach((animation) => animation.pause());
    };
  }, []);

  return (
    <section
      id="skills"
      className="relative flex min-h-screen w-full items-center overflow-hidden px-4 py-16"
      style={{ background: 'linear-gradient(180deg, #04060A 0%, #0B1220 100%)' }}
    >
      <div className="pointer-events-none absolute inset-0">
        {stars.map((star) => (
          <span
            key={star.id}
            data-solar-star
            className="absolute rounded-full"
            style={{
              left: star.x,
              top: star.y,
              width: `${star.size}px`,
              height: `${star.size}px`,
              background: 'rgba(230, 237, 243, 0.9)',
              opacity: 0.26,
              willChange: 'opacity',
            }}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(circle at 88% 52%, rgba(0, 229, 255, 0.08), transparent 38%)' }} />
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(circle at 6% 50%, rgba(123, 97, 255, 0.12), transparent 52%)' }} />

      <div ref={rootRef} className="container relative z-10">
        <div className="relative h-190 w-full">
          <div className="absolute left-[14%] top-1/2 z-40 -translate-y-1/2">
            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: '#00E5FF' }}>CORE SYSTEM</p>
              <p className="mt-1 text-sm" style={{ color: '#E6EDF3' }}>Full Stack Architecture</p>
            </div>
            <div
              data-core-pulse
              className="relative flex h-38 w-38 items-center justify-center rounded-full"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.98) 0%, rgba(0,229,255,0.64) 34%, rgba(0,229,255,0.14) 64%, transparent 100%)',
                boxShadow: '0 0 8px rgba(0,229,255,0.95), 0 0 20px rgba(0,229,255,0.44), 0 0 60px rgba(0,229,255,0.24)',
                willChange: 'transform',
              }}
            />
          </div>

          <div className="absolute right-0 top-1/2 h-[84%] w-[78%] -translate-y-1/2">
            <div className="absolute inset-0 overflow-hidden" style={{ clipPath: 'polygon(12% 0%, 100% 0%, 100% 100%, 12% 100%)' }}>
              {clusters.map((cluster) => {
                const isActive = cluster.id === activeClusterId;
                const isDimmed = hoveredCluster !== null && hoveredCluster !== cluster.id;
                const ringGlow = isActive ? `0 0 8px ${cluster.accent}, 0 0 20px ${cluster.accent}40, 0 0 60px ${cluster.accent}20` : 'none';

                return (
                  <div
                    key={cluster.id}
                    className="absolute left-[30%] top-1/2"
                    style={{ transform: 'translate(-50%, -50%)', zIndex: cluster.depth === 'near' ? 36 : 24 }}
                  >
                    <div
                      className="pointer-events-none absolute left-1/2 top-1/2 rounded-full border"
                      style={{
                        width: `${cluster.radius * 2}px`,
                        height: `${cluster.radius * 2}px`,
                        transform: 'translate(-50%, -50%) scaleY(0.8)',
                        borderColor: cluster.depth === 'near' ? 'rgba(0, 229, 255, 0.34)' : 'rgba(123, 97, 255, 0.24)',
                        opacity: cluster.depth === 'near' ? 0.75 : 0.48,
                        boxShadow: ringGlow,
                      }}
                    />

                    <div
                      data-cluster-orbit
                      data-duration={cluster.orbitDuration}
                      data-start={cluster.startAngle}
                      className="absolute left-1/2 top-1/2 h-0 w-0 will-change-transform"
                      style={{ transform: 'translate(-50%, -50%) scaleY(0.8)' }}
                    >
                      <motion.div
                        className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
                        style={{ transform: `translate(-50%, -50%) translateY(-${cluster.radius}px) scaleY(1.25)` }}
                        animate={{
                          opacity: isDimmed ? 0.42 : cluster.depth === 'near' ? 1 : 0.72,
                          scale: isActive ? 1.05 : cluster.depth === 'near' ? 1 : 0.95,
                        }}
                        transition={{ duration: 0.2, ease: EASE_SINE }}
                      >
                        <div
                          role="button"
                          tabIndex={0}
                          aria-label={`${cluster.label} cluster`}
                          onMouseEnter={() => setHoveredCluster(cluster.id)}
                          onMouseLeave={() => setHoveredCluster(null)}
                          onFocus={() => setHoveredCluster(cluster.id)}
                          onBlur={() => setHoveredCluster(null)}
                          onClick={() => setSelectedCluster(cluster.id)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              setSelectedCluster(cluster.id);
                            }
                          }}
                          className="relative h-28 w-28 cursor-pointer outline-none"
                          style={{ filter: cluster.depth === 'far' ? 'blur(0.5px)' : 'none' }}
                        >
                          <div
                            className="absolute left-1/2 top-1/2 rounded-full"
                            style={{
                              width: `${cluster.planetSize}px`,
                              height: `${cluster.planetSize}px`,
                              transform: 'translate(-50%, -50%)',
                              background: `radial-gradient(circle at 34% 28%, rgba(255,255,255,0.9) 0%, ${cluster.accent} 44%, rgba(8, 12, 22, 0.95) 100%)`,
                              boxShadow: `0 0 8px ${cluster.accent}, 0 0 20px ${cluster.accent}40, 0 0 60px ${cluster.accent}20`,
                            }}
                          />
                          <span
                            className="pointer-events-none absolute left-1/2 top-[62%] h-2.5 w-[58%] -translate-x-1/2 rounded-full"
                            style={{ background: 'rgba(0,0,0,0.32)', filter: 'blur(2px)' }}
                          />

                          <div
                            data-node-orbit
                            data-duration={cluster.nodeDuration}
                            className="absolute inset-0 will-change-transform"
                          >
                            {cluster.nodes.map((node) => (
                              <motion.span
                                key={node.id}
                                className="absolute left-1/2 top-1/2 rounded-full"
                                style={{
                                  width: `${node.size}px`,
                                  height: `${node.size}px`,
                                  transform: `translate(-50%, -50%) rotate(${node.angle}deg) translateY(-${node.orbitRadius}px)`,
                                  background: 'rgba(230, 237, 243, 0.92)',
                                  boxShadow: `0 0 8px ${cluster.accent}, 0 0 20px ${cluster.accent}40, 0 0 60px ${cluster.accent}20`,
                                  filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.35))',
                                }}
                                animate={{ opacity: isActive ? 1 : 0.72, scale: isActive ? 1.08 : 1 }}
                                transition={{ duration: 0.2, ease: EASE_SINE }}
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div ref={shootingInfoRef} className="absolute bottom-2 right-4 z-50 w-full max-w-160">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCluster.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.22, ease: EASE_SINE }}
                className="rounded-xl border px-4 py-3"
                style={{
                  borderColor: `${activeCluster.accent}66`,
                  background: 'rgba(11, 18, 32, 0.56)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 0 8px rgba(0,229,255,0.2), 0 0 20px rgba(123,97,255,0.16), 0 0 60px rgba(0,229,255,0.08)',
                }}
              >
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold" style={{ color: '#E6EDF3' }}>{activeCluster.label}</h3>
                  <span className="rounded-full border px-2 py-0.5 text-[11px] uppercase tracking-[0.12em]" style={{ borderColor: `${activeCluster.accent}66`, color: activeCluster.accent }}>
                    Cluster Active
                  </span>
                </div>
                <p className="mt-2 text-sm" style={{ color: 'rgba(230, 237, 243, 0.84)' }}>{activeCluster.description}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.12em]" style={{ color: 'rgba(230, 237, 243, 0.68)' }}>Technologies</p>
                <p className="mt-1 text-sm" style={{ color: '#E6EDF3' }}>{activeCluster.technologies.join(' • ')}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.12em]" style={{ color: 'rgba(230, 237, 243, 0.68)' }}>System Role</p>
                <p className="mt-1 text-sm" style={{ color: 'rgba(230, 237, 243, 0.88)' }}>{activeCluster.role}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
