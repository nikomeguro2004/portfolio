'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { animate } from 'animejs';
import { AnimatePresence, motion } from 'framer-motion';

interface GalaxyOrbitHybridProps {
  skills: Record<string, string[]>;
}

type ClusterId = 'infrastructure' | 'ai' | 'backend' | 'frontend';

type ClusterConfig = {
  id: ClusterId;
  label: string;
  sourceKey: string;
  description: string;
  role: string;
  radius: number;
  ringDuration: number;
  clusterDuration: number;
  nodeDuration: number;
  initialAngle: number;
  accent: '#00E5FF' | '#7B61FF';
  depth: 'front' | 'back';
  planetSize: number;
};

const EASE_SINE: [number, number, number, number] = [0.445, 0.05, 0.55, 0.95];

const CLUSTERS: ClusterConfig[] = [
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    sourceKey: 'Cloud & Delivery',
    description: 'Delivery backbone focused on reliability, deployment, and runtime stability.',
    role: 'Maintains resilient compute, release pipelines, and observability for production systems.',
    radius: 300,
    ringDuration: 120000,
    clusterDuration: 94000,
    nodeDuration: 18000,
    initialAngle: 20,
    accent: '#7B61FF',
    depth: 'back',
    planetSize: 22,
  },
  {
    id: 'ai',
    label: 'AI Engineering',
    sourceKey: 'AI Engineering',
    description: 'Applied intelligence layer for generation, retrieval, and inference workflows.',
    role: 'Connects model capabilities to product behavior with dependable output quality.',
    radius: 236,
    ringDuration: 108000,
    clusterDuration: 84000,
    nodeDuration: 16000,
    initialAngle: 208,
    accent: '#00E5FF',
    depth: 'back',
    planetSize: 20,
  },
  {
    id: 'backend',
    label: 'Backend Systems',
    sourceKey: 'Backend & APIs',
    description: 'Service logic and API orchestration across product and platform boundaries.',
    role: 'Coordinates data, auth, and business workflows across distributed modules.',
    radius: 176,
    ringDuration: 98000,
    clusterDuration: 76000,
    nodeDuration: 14500,
    initialAngle: 320,
    accent: '#7B61FF',
    depth: 'front',
    planetSize: 18,
  },
  {
    id: 'frontend',
    label: 'Frontend Systems',
    sourceKey: 'Frontend Systems',
    description: 'User-facing interfaces optimized for performance, clarity, and interaction quality.',
    role: 'Presents product behavior as fast, accessible, and scalable application surfaces.',
    radius: 124,
    ringDuration: 90000,
    clusterDuration: 70000,
    nodeDuration: 12500,
    initialAngle: 132,
    accent: '#00E5FF',
    depth: 'front',
    planetSize: 16,
  },
];

export default function GalaxyOrbitHybrid({ skills }: GalaxyOrbitHybridProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [hoveredCluster, setHoveredCluster] = useState<ClusterId | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<ClusterId>('frontend');

  const stars = useMemo(
    () =>
      Array.from({ length: 52 }, (_, index) => ({
        id: index,
        x: `${(index * 13.73) % 100}%`,
        y: `${(index * 9.91 + 7) % 100}%`,
        size: index % 5 === 0 ? 2 : 1,
        duration: 2300 + (index % 9) * 320,
        delay: (index % 7) * 210,
      })),
    []
  );

  const clusters = useMemo(
    () =>
      CLUSTERS.map((cluster) => {
        const source = skills[cluster.sourceKey] ?? [];
        const tech = source.slice(0, 8);
        const nodes = tech.map((item, index) => ({
          id: `${cluster.id}-${item}`,
          label: item,
          angle: (360 / Math.max(tech.length, 1)) * index,
          orbitRadius: 20 + (index % 3) * 8,
          size: index % 4 === 0 ? 6 : 5,
        }));

        return {
          ...cluster,
          tech,
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

    const rings = rootRef.current.querySelectorAll<HTMLElement>('[data-ring-rotate]');
    rings.forEach((ring) => {
      const duration = Number(ring.dataset.duration ?? 100000);
      const start = Number(ring.dataset.start ?? 0);
      animations.push(
        animate(ring, {
          rotate: [start, start + 360],
          duration,
          ease: 'linear',
          loop: true,
        })
      );
    });

    const clustersOrbit = rootRef.current.querySelectorAll<HTMLElement>('[data-cluster-orbit]');
    clustersOrbit.forEach((orbit) => {
      const duration = Number(orbit.dataset.duration ?? 76000);
      const start = Number(orbit.dataset.start ?? 0);
      animations.push(
        animate(orbit, {
          rotate: [start, start + 360],
          duration,
          ease: 'linear',
          loop: true,
        })
      );
    });

    const microOrbits = rootRef.current.querySelectorAll<HTMLElement>('[data-node-orbit]');
    microOrbits.forEach((orbit) => {
      const duration = Number(orbit.dataset.duration ?? 15000);
      animations.push(
        animate(orbit, {
          rotate: [0, 360],
          duration,
          ease: 'linear',
          loop: true,
        })
      );
    });

    const core = rootRef.current.querySelector('[data-core-pulse]');
    if (core) {
      animations.push(
        animate(core, {
          scale: [1, 1.02],
          duration: 5000,
          ease: 'inOutSine',
          direction: 'alternate',
          loop: true,
        })
      );
    }

    const starNodes = rootRef.current.querySelectorAll<HTMLElement>('[data-twinkle-star]');
    starNodes.forEach((star) => {
      const duration = Number(star.dataset.duration ?? 2800);
      const delay = Number(star.dataset.delay ?? 0);
      animations.push(
        animate(star, {
          opacity: [0.18, 0.78],
          duration,
          delay,
          ease: 'inOutSine',
          direction: 'alternate',
          loop: true,
        })
      );
    });

    return () => {
      animations.forEach((instance) => instance.pause());
    };
  }, []);

  return (
    <section
      id="skills"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-16"
      style={{ background: 'linear-gradient(180deg, #04060A 0%, #0B1220 100%)' }}
    >
      <div className="pointer-events-none absolute inset-0">
        {stars.map((star) => (
          <span
            key={star.id}
            data-twinkle-star
            data-duration={star.duration}
            data-delay={star.delay}
            className="absolute rounded-full"
            style={{
              left: star.x,
              top: star.y,
              width: `${star.size}px`,
              height: `${star.size}px`,
              background: 'rgba(230, 237, 243, 0.9)',
              opacity: 0.22,
              willChange: 'opacity',
            }}
          />
        ))}
      </div>

      <div ref={rootRef} className="relative h-190 w-full max-w-270">
        <div className="pointer-events-none absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(0, 229, 255, 0.08) 0%, rgba(123, 97, 255, 0.05) 38%, transparent 72%)' }} />

        {clusters.map((cluster) => {
          const isActive = activeClusterId === cluster.id;
          const isDimmed = hoveredCluster !== null && hoveredCluster !== cluster.id;
          const ringGlow = isActive ? `0 0 8px ${cluster.accent}, 0 0 20px ${cluster.accent}40, 0 0 60px ${cluster.accent}20` : 'none';

          return (
            <div
              key={`ring-${cluster.id}`}
              className="absolute left-1/2 top-1/2"
              style={{ transform: 'translate(-50%, -50%)', zIndex: cluster.depth === 'front' ? 30 : 20 }}
            >
              <div
                data-ring-rotate
                data-duration={cluster.ringDuration}
                data-start={cluster.initialAngle}
                className="absolute left-1/2 top-1/2 will-change-transform"
                style={{
                  width: `${cluster.radius * 2}px`,
                  height: `${cluster.radius * 2}px`,
                  transform: 'translate(-50%, -50%) scaleY(0.85)',
                }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full border"
                  animate={{
                    opacity: isActive ? 0.7 : 0.38,
                  }}
                  transition={{ duration: 0.22, ease: EASE_SINE }}
                  style={{
                    borderColor: cluster.accent,
                    boxShadow: ringGlow,
                    willChange: 'opacity, transform',
                  }}
                />
              </div>

              <div
                data-cluster-orbit
                data-duration={cluster.clusterDuration}
                data-start={cluster.initialAngle}
                className="absolute left-1/2 top-1/2 h-0 w-0 will-change-transform"
                style={{ transform: 'translate(-50%, -50%)' }}
              >
                <motion.button
                  type="button"
                  className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 will-change-transform"
                  style={{
                    transform: `translate(-50%, -50%) translateY(-${cluster.radius}px) scaleY(1.176)`,
                    filter: cluster.depth === 'back' ? 'blur(0.5px)' : 'none',
                  }}
                  onMouseEnter={() => setHoveredCluster(cluster.id)}
                  onMouseLeave={() => setHoveredCluster(null)}
                  onFocus={() => setHoveredCluster(cluster.id)}
                  onBlur={() => setHoveredCluster(null)}
                  onClick={() => setSelectedCluster(cluster.id)}
                  aria-label={`Focus ${cluster.label}`}
                  animate={{
                    scale: isActive ? 1.08 : cluster.depth === 'back' ? 0.95 : 1,
                    opacity: isDimmed ? 0.4 : cluster.depth === 'back' ? 0.78 : 1,
                  }}
                  transition={{ duration: 0.2, ease: EASE_SINE }}
                >
                  <div className="relative h-27 w-27">
                    <div
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                      style={{
                        width: `${cluster.planetSize}px`,
                        height: `${cluster.planetSize}px`,
                        background: `radial-gradient(circle at 34% 28%, rgba(255,255,255,0.9) 0%, ${cluster.accent} 46%, rgba(8, 12, 22, 0.94) 100%)`,
                        boxShadow: `0 0 8px ${cluster.accent}, 0 0 20px ${cluster.accent}40, 0 0 60px ${cluster.accent}20`,
                        willChange: 'transform, opacity',
                      }}
                    />

                    <span
                      className="pointer-events-none absolute left-1/2 top-1/2 rounded-full border"
                      style={{
                        width: `${cluster.planetSize + 8}px`,
                        height: `${cluster.planetSize + 8}px`,
                        transform: 'translate(-50%, -50%)',
                        borderColor: `${cluster.accent}66`,
                        opacity: isActive ? 0.8 : 0.45,
                      }}
                    />

                    <div
                      data-node-orbit
                      data-duration={cluster.nodeDuration}
                      className="absolute inset-0 will-change-transform"
                    >
                      {isActive ? (
                        <motion.svg
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.28 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2, ease: EASE_SINE }}
                          className="pointer-events-none absolute inset-0"
                          viewBox="0 0 108 108"
                          fill="none"
                        >
                          {cluster.nodes.map((node) => {
                            const x = 54 + Math.cos((node.angle * Math.PI) / 180) * node.orbitRadius;
                            const y = 54 + Math.sin((node.angle * Math.PI) / 180) * node.orbitRadius;
                            return (
                              <line
                                key={`line-${node.id}`}
                                x1="54"
                                y1="54"
                                x2={x}
                                y2={y}
                                stroke={cluster.accent}
                                strokeWidth="1"
                                style={{ filter: `drop-shadow(0 0 4px ${cluster.accent})` }}
                              />
                            );
                          })}
                        </motion.svg>
                      ) : null}

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
                            willChange: 'transform, opacity',
                          }}
                          animate={{ scale: isActive ? 1.08 : 1 }}
                          transition={{ duration: 0.2, ease: EASE_SINE }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.button>
              </div>
            </div>
          );
        })}

        <div className="pointer-events-none absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2">
          <div
            data-core-pulse
            className="relative flex h-33 w-33 items-center justify-center rounded-full"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.94) 0%, rgba(0,229,255,0.58) 32%, rgba(0,229,255,0.12) 66%, transparent 100%)',
              boxShadow: '0 0 8px rgba(0,229,255,0.9), 0 0 20px rgba(0,229,255,0.4), 0 0 60px rgba(0,229,255,0.2)',
              willChange: 'transform',
            }}
          >
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: '#E6EDF3' }}>
                CORE ENGINE
              </p>
              <p className="mt-1 text-[11px]" style={{ color: 'rgba(230, 237, 243, 0.85)' }}>
                System Architecture
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-3 left-1/2 z-50 w-full max-w-165 -translate-x-1/2 px-3 md:px-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCluster.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.22, ease: EASE_SINE }}
              className="rounded-xl border px-4 py-3"
              style={{
                borderColor: 'rgba(0, 229, 255, 0.35)',
                background: 'rgba(11, 18, 32, 0.55)',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 0 8px rgba(0,229,255,0.24), 0 0 20px rgba(0,229,255,0.14), 0 0 60px rgba(0,229,255,0.08)',
              }}
            >
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-lg font-semibold" style={{ color: '#E6EDF3' }}>
                  {activeCluster.label}
                </h3>
                <span className="rounded-full px-2 py-0.5 text-[11px] uppercase tracking-[0.12em]" style={{ color: activeCluster.accent, border: `1px solid ${activeCluster.accent}55`, background: `${activeCluster.accent}14` }}>
                  Cluster Active
                </span>
              </div>
              <p className="mt-2 text-sm" style={{ color: 'rgba(230, 237, 243, 0.82)' }}>
                {activeCluster.description}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.12em]" style={{ color: 'rgba(230, 237, 243, 0.66)' }}>
                Technologies
              </p>
              <p className="mt-1 text-sm" style={{ color: '#E6EDF3' }}>
                {activeCluster.tech.join(' • ')}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.12em]" style={{ color: 'rgba(230, 237, 243, 0.66)' }}>
                System Role
              </p>
              <p className="mt-1 text-sm" style={{ color: 'rgba(230, 237, 243, 0.86)' }}>
                {activeCluster.role}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
