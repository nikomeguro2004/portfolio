'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { animate } from 'animejs';

interface TechStackGalaxyProps {
  skills: Record<string, string[]>;
}

type ClusterKey = 'frontend' | 'backend' | 'ai' | 'infra';

export default function TechStackGalaxy({ skills }: TechStackGalaxyProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const [activeCluster, setActiveCluster] = useState<ClusterKey>('frontend');
  const [hoveredCluster, setHoveredCluster] = useState<ClusterKey | null>(null);

  const clusterData = useMemo(() => {
    return {
      frontend: {
        label: 'Frontend Planet',
        color: '#00F0FF',
        orbitSize: 420,
        duration: 36000,
        initialAngle: 28,
        skills: (skills['Frontend Systems'] ?? []).slice(0, 8),
      },
      backend: {
        label: 'Backend Planet',
        color: '#9D4EDD',
        orbitSize: 330,
        duration: 30000,
        initialAngle: 182,
        skills: (skills['Backend & APIs'] ?? []).slice(0, 8),
      },
      ai: {
        label: 'AI Planet',
        color: '#00F0FF',
        orbitSize: 248,
        duration: 24000,
        initialAngle: 300,
        skills: (skills['AI Engineering'] ?? []).slice(0, 8),
      },
      infra: {
        label: 'Infra Planet',
        color: '#9D4EDD',
        orbitSize: 168,
        duration: 18000,
        initialAngle: 120,
        skills: (skills['Cloud & Delivery'] ?? []).slice(0, 8),
      },
    } as const;
  }, [skills]);

  const visibleCluster = hoveredCluster ?? activeCluster;
  const visibleInfo = clusterData[visibleCluster];

  useEffect(() => {
    if (!rootRef.current) return;

    const cards = rootRef.current.querySelectorAll('.constellation-card');
    const stars = rootRef.current.querySelectorAll('.constellation-starfield');
    const planets = rootRef.current.querySelectorAll('.orbit-planet-wrapper');

    const animations: Array<{ pause: () => void }> = [];

    animations.push(animate(cards, {
      translateY: [18, 0],
      opacity: [0, 1],
      delay: (_, i) => i * 70 + 80,
      duration: 520,
      ease: 'out(3)',
    }));

    animations.push(animate(stars, {
      opacity: [0.28, 0.62],
      delay: (_, i) => i * 120,
      duration: 2200,
      loop: true,
      direction: 'alternate',
      ease: 'inOutSine',
    }));

    planets.forEach((planet) => {
      const duration = Number((planet as HTMLElement).dataset.duration || 30000);
      const start = Number((planet as HTMLElement).dataset.start || 0);
      animations.push(animate(planet, {
        rotate: [start, start + 360],
        duration,
        ease: 'linear',
        loop: true,
      }));
    });

    return () => {
      animations.forEach((animation) => animation.pause());
    };
  }, []);

  useEffect(() => {
    if (!detailsRef.current) return;

    animate(detailsRef.current, {
      opacity: [0.35, 1],
      translateY: [8, 0],
      duration: 260,
      ease: 'out(3)',
    });

    const skillItems = detailsRef.current.querySelectorAll('.cluster-skill');
    animate(skillItems, {
      opacity: [0, 1],
      translateY: [6, 0],
      delay: (_, index) => index * 26,
      duration: 220,
      ease: 'out(3)',
    });
  }, [visibleCluster]);

  return (
    <section id="skills" className="py-16" style={{ background: 'var(--background)' }}>
      <div ref={rootRef} className="container">
        <div className="constellation-card mb-7 rounded-2xl border p-5 opacity-0 md:p-6" style={{ borderColor: 'rgba(0, 240, 255, 0.24)', background: 'rgba(10, 10, 15, 0.88)' }}>
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--accent)' }}>Skills Broadcast</p>
              <h2 className="mt-2 text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Tech Constellation TV</h2>
              <p className="mt-3 max-w-3xl text-sm" style={{ color: 'rgba(229, 231, 235, 0.78)' }}>
                TV-styled orbital map where each planet is a skills channel across your engineering stack.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="constellation-card rounded-xl border px-4 py-3 opacity-0" style={{ borderColor: 'rgba(0, 240, 255, 0.22)', background: 'rgba(0, 240, 255, 0.05)' }}>
                <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'rgba(229, 231, 235, 0.62)' }}>Channels</p>
                <p className="mt-1 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>4</p>
              </div>
              <div className="constellation-card rounded-xl border px-4 py-3 opacity-0" style={{ borderColor: 'rgba(157, 78, 221, 0.32)', background: 'rgba(157, 78, 221, 0.08)' }}>
                <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'rgba(229, 231, 235, 0.62)' }}>Preset Orbits</p>
                <p className="mt-1 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>4</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="constellation-card relative overflow-hidden rounded-2xl border p-4 opacity-0" style={{ borderColor: 'rgba(0, 240, 255, 0.24)', background: 'linear-gradient(180deg, rgba(20, 24, 36, 0.98) 0%, rgba(10, 10, 15, 0.98) 100%)', boxShadow: '0 20px 45px rgba(0, 0, 0, 0.5)' }}>
            <div className="mb-3 flex items-center justify-between rounded-xl border px-3 py-2" style={{ borderColor: 'rgba(157, 78, 221, 0.28)', background: 'rgba(6, 8, 14, 0.82)' }}>
              <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--accent)' }}>Skills Broadcast</p>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em]" style={{ color: 'rgba(229, 231, 235, 0.68)' }}>
                <span>CH {visibleCluster.toUpperCase()}</span>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
                <span>LIVE</span>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl border p-4" style={{ borderColor: 'rgba(157, 78, 221, 0.32)', background: 'radial-gradient(120% 140% at 50% 15%, rgba(0, 240, 255, 0.08), rgba(6, 8, 14, 0.95) 56%)', boxShadow: 'inset 0 0 40px rgba(0,0,0,0.52)' }}>
              <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'repeating-linear-gradient(180deg, rgba(229,231,235,0.85) 0, rgba(229,231,235,0.85) 1px, transparent 1px, transparent 4px)' }} />
              <div className="pointer-events-none absolute inset-0 opacity-35" style={{ background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.12), transparent 38%)' }} />
              <div className="pointer-events-none absolute inset-0" style={{ boxShadow: 'inset 0 0 55px rgba(0,0,0,0.45)' }} />

              <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.08), transparent 62%)' }} />

            <div className="pointer-events-none absolute inset-0">
              {Array.from({ length: 14 }).map((_, index) => (
                <span
                  key={`bg-star-${index}`}
                  className="constellation-starfield absolute rounded-full bg-slate-100/75"
                  style={{
                    width: `${index % 2 === 0 ? 2 : 1}px`,
                    height: `${index % 2 === 0 ? 2 : 1}px`,
                    left: `${8 + (index * 6.1) % 84}%`,
                    top: `${10 + (index * 7.3) % 78}%`,
                    opacity: 0.38,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 mx-auto w-full" style={{ height: '520px', maxWidth: '520px' }}>
              <div
                className="pointer-events-none absolute inset-6"
                style={{
                  transform: 'perspective(1000px) rotateX(58deg)',
                  transformOrigin: 'center center',
                }}
              >
                {(Object.entries(clusterData) as Array<[ClusterKey, typeof clusterData[ClusterKey]]>).map(([key, cluster]) => {
                  const isActive = visibleCluster === key;

                  return (
                    <div
                      key={`orbit-shadow-${key}`}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
                      style={{
                        width: `${cluster.orbitSize}px`,
                        height: `${cluster.orbitSize}px`,
                        borderColor: isActive ? 'rgba(0, 240, 255, 0.28)' : 'rgba(157, 78, 221, 0.16)',
                        boxShadow: isActive ? '0 0 24px rgba(0, 240, 255, 0.1)' : 'none',
                      }}
                    />
                  );
                })}
              </div>

              <div
                className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border"
                style={{
                  borderColor: 'rgba(0, 240, 255, 0.4)',
                  background: 'radial-gradient(circle, rgba(0, 240, 255, 0.22), rgba(157, 78, 221, 0.14))',
                  boxShadow: '0 0 34px rgba(0, 240, 255, 0.22)',
                }}
              />

              {(Object.entries(clusterData) as Array<[ClusterKey, typeof clusterData[ClusterKey]]>).map(([key, cluster]) => {
                const isActive = visibleCluster === key;

                return (
                  <div
                    key={key}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
                    style={{
                      width: `${cluster.orbitSize}px`,
                      height: `${cluster.orbitSize}px`,
                      borderColor: isActive ? 'rgba(0, 240, 255, 0.45)' : 'rgba(157, 78, 221, 0.24)',
                    }}
                  >
                    <div
                      className="orbit-planet-wrapper absolute inset-0"
                      data-start={cluster.initialAngle}
                      data-duration={cluster.duration}
                      style={{ transform: `rotate(${cluster.initialAngle}deg)` }}
                    >
                      <button
                        type="button"
                        className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border transition-all"
                        style={{
                          width: isActive ? '28px' : '20px',
                          height: isActive ? '28px' : '20px',
                          borderColor: cluster.color,
                          background: `radial-gradient(circle at 34% 28%, rgba(255, 255, 255, 0.9) 0%, ${cluster.color} 42%, rgba(12, 18, 30, 0.85) 100%)`,
                          boxShadow: isActive ? `0 0 18px ${cluster.color}88, 0 7px 18px rgba(0,0,0,0.55)` : `0 0 10px ${cluster.color}55, 0 5px 12px rgba(0,0,0,0.5)`,
                        }}
                        onClick={() => setActiveCluster(key)}
                        onMouseEnter={() => setHoveredCluster(key)}
                        onMouseLeave={() => setHoveredCluster(null)}
                        aria-label={cluster.label}
                      >
                        <span
                          className="pointer-events-none absolute left-[18%] top-[18%] h-[26%] w-[26%] rounded-full bg-white/80"
                          style={{ filter: 'blur(1px)' }}
                        />
                        <span
                          className="pointer-events-none absolute left-1/2 top-[74%] h-[24%] w-[54%] -translate-x-1/2 rounded-full"
                          style={{ background: 'rgba(2, 8, 18, 0.45)', filter: 'blur(2px)' }}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="relative z-20 mt-2 rounded-lg border px-3 py-2" style={{ borderColor: 'rgba(157, 78, 221, 0.25)', background: 'rgba(157, 78, 221, 0.08)' }}>
              <p className="text-xs uppercase tracking-[0.14em]" style={{ color: '#E5E7EB' }}>
                Touch or hover a planet to preview. Click to select and lock the cluster.
              </p>
            </div>
            </div>
          </div>

          <div ref={detailsRef} className="constellation-card rounded-xl border p-5 opacity-0" style={{ borderColor: 'rgba(157, 78, 221, 0.28)', background: 'rgba(12, 14, 22, 0.9)' }}>
            <p className="text-xs uppercase tracking-[0.14em]" style={{ color: 'rgba(229, 231, 235, 0.62)' }}>Selected Cluster</p>
            <p className="mt-2 text-2xl font-semibold" style={{ color: '#E5E7EB' }}>{visibleInfo.label}</p>

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {visibleInfo.skills.map((skill) => (
                <div
                  key={skill}
                  className="cluster-skill rounded-md border px-3 py-2 text-sm"
                  style={{
                    borderColor: `${visibleInfo.color}66`,
                    background: `${visibleInfo.color}1A`,
                    color: '#E5E7EB',
                    transition: 'all 0.25s ease',
                  }}
                >
                  {skill}
                </div>
              ))}
            </div>

            <p className="mt-4 text-sm" style={{ color: 'rgba(229, 231, 235, 0.72)' }}>
              This view highlights how technologies are grouped into interoperable systems across the stack.
            </p>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {(Object.entries(clusterData) as Array<[ClusterKey, typeof clusterData[ClusterKey]]>).map(([key, cluster]) => {
                const isActive = key === activeCluster;
                return (
                  <button
                    key={`preset-${key}`}
                    type="button"
                    onClick={() => setActiveCluster(key)}
                    onMouseEnter={() => setHoveredCluster(key)}
                    onMouseLeave={() => setHoveredCluster(null)}
                    className="rounded-md border px-3 py-2 text-left text-xs uppercase tracking-[0.12em] transition-all"
                    style={{
                      borderColor: isActive ? 'rgba(0, 240, 255, 0.55)' : 'rgba(157, 78, 221, 0.35)',
                      background: isActive ? 'rgba(0, 240, 255, 0.12)' : 'rgba(157, 78, 221, 0.08)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    CH {cluster.label.replace(' Planet', '').toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
