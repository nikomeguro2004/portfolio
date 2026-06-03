'use client';

import { motion } from 'framer-motion';
import {
  FaReact, FaAws, FaDocker, FaNodeJs, FaGithub, FaPython,
} from 'react-icons/fa';
import {
  SiNextdotjs, SiVercel, SiTypescript, SiSupabase,
  SiStripe, SiPostgresql, SiRedis, SiTailwindcss,
  SiPrisma, SiOpenai, SiFramer, SiFastapi, SiRazorpay,
} from 'react-icons/si';

// ─── Stack used in real shipped products ──────────────────────────────────────

const ORBIT_ICONS = [
  /* Orbit 1 — Frontend & Framework */
  { Icon: FaReact,      color: '#61DAFB', name: 'React'      },
  { Icon: SiNextdotjs,  color: '#141210', name: 'Next.js'    },
  { Icon: SiTypescript, color: '#3178C6', name: 'TypeScript' },
  { Icon: SiTailwindcss,color: '#06B6D4', name: 'Tailwind'   },
  { Icon: SiFramer,     color: '#FF0055', name: 'Framer'     },
  /* Orbit 2 — Backend, DB & Cloud */
  { Icon: FaNodeJs,     color: '#339933', name: 'Node.js'    },
  { Icon: SiFastapi,    color: '#009688', name: 'FastAPI'    },
  { Icon: FaPython,     color: '#3776AB', name: 'Python'     },
  { Icon: SiSupabase,   color: '#3ECF8E', name: 'Supabase'   },
  { Icon: SiPostgresql, color: '#4169E1', name: 'PostgreSQL' },
  { Icon: SiPrisma,     color: '#4A5568', name: 'Prisma'     },
  { Icon: SiRedis,      color: '#DC382D', name: 'Redis'      },
  /* Orbit 3 — Infra, AI & Payments */
  { Icon: FaAws,        color: '#FF9900', name: 'AWS'        },
  { Icon: FaDocker,     color: '#2496ED', name: 'Docker'     },
  { Icon: SiVercel,     color: '#141210', name: 'Vercel'     },
  { Icon: FaGithub,     color: '#181717', name: 'GitHub'     },
  { Icon: SiOpenai,     color: '#10A37F', name: 'OpenAI'     },
  { Icon: SiStripe,     color: '#6259FF', name: 'Stripe'     },
  { Icon: SiRazorpay,   color: '#072654', name: 'Razorpay'   },
];

// 3 orbits, spread icons evenly
const ORBIT_SIZES   = [13, 21, 29]; // rem — even spacing
const ORBIT_SPEEDS  = [24,  36, 50]; // seconds per rotation
const ICONS_PER = [5, 7, 7];        // how many icons per ring

const ORBIT_SLICES = ICONS_PER.reduce<{ start: number; end: number }[]>((acc, n, i) => {
  const start = i === 0 ? 0 : acc[i - 1].end;
  acc.push({ start, end: start + n });
  return acc;
}, []);

export default function TechOrbitSection() {
  const maxOrbit = ORBIT_SIZES[ORBIT_SIZES.length - 1]; // 29rem

  return (
    <section
      style={{
        background: 'var(--bg)',
        borderTop: '1px solid var(--rule)',
        borderBottom: '1px solid var(--rule)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        className="container orbit-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '520px',
          position: 'relative',
          gap: '2rem',
        }}
      >
        {/* ─ Left: copy ──────────────────────────────────────────── */}
        <motion.div
          style={{ zIndex: 10, flex: '0 0 auto', maxWidth: '400px' }}
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p
            className="label-mono"
            style={{ color: 'rgba(255,79,26,0.5)', marginBottom: '0.8rem' }}
          >
            PRODUCTION TOOLKIT · {ORBIT_ICONS.length} TOOLS
          </p>

          <h2
            style={{
              fontFamily: 'var(--font-heading), "Syne", sans-serif',
              fontSize: 'clamp(2rem, 4vw, 3.75rem)',
              fontWeight: 800,
              letterSpacing: '-0.045em',
              lineHeight: 0.95,
              marginBottom: '1.1rem',
            }}
          >
            I ship with<br />
            <span style={{ color: 'var(--accent)' }}>these tools.</span>
          </h2>

          <p
            className="body-text"
            style={{ maxWidth: '330px', marginBottom: '1.75rem' }}
          >
            Every tool in this orbit has shipped real product. No checkbox skills — if it&apos;s spinning, I&apos;ve deployed with it.
          </p>

          {/* Key stack pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {['React', 'Next.js', 'TypeScript', 'Supabase', 'AWS', 'OpenAI', 'FastAPI'].map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: 'var(--font-geist-mono), monospace',
                  fontSize: '9px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  color: 'var(--text-3)',
                  border: '1px solid var(--rule)',
                  borderRadius: '2px',
                  padding: '0.22rem 0.55rem',
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>

        {/* ─ Right: Orbit system — hidden on mobile ──────────────── */}
        <div
          className="hidden md:flex"
          style={{
            flex: 1,
            height: '100%',
            overflow: 'hidden',
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          {/* Orbit container — shift right so left half clips on container edge */}
          <div
            style={{
              position: 'relative',
              width:  `${maxOrbit + 4}rem`,
              height: `${maxOrbit + 4}rem`,
              transform: 'translateX(42%)',
              flexShrink: 0,
            }}
          >
            {/* Centre accent dot */}
            <div
              style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '64px', height: '64px',
                borderRadius: '50%',
                background: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 0 8px rgba(255,79,26,0.1), 0 0 40px rgba(255,79,26,0.22)',
                zIndex: 10,
              }}
            >
              <FaReact size={30} color="#F5F1E8" />
            </div>

            {/* Orbit rings */}
            {ORBIT_SIZES.map((sizeRem, orbitIdx) => {
              const speed    = ORBIT_SPEEDS[orbitIdx];
              const { start, end } = ORBIT_SLICES[orbitIdx];
              const slice    = ORBIT_ICONS.slice(start, end);
              const angleStep = (2 * Math.PI) / slice.length;

              return (
                <div
                  key={orbitIdx}
                  style={{
                    position: 'absolute',
                    top:  '50%',
                    left: '50%',
                    width:  `${sizeRem}rem`,
                    height: `${sizeRem}rem`,
                    marginTop:  `${-sizeRem / 2}rem`,
                    marginLeft: `${-sizeRem / 2}rem`,
                    borderRadius: '50%',
                    border: '1px dashed rgba(0,0,0,0.09)',
                    animation: `techSpin ${speed}s linear infinite`,
                  }}
                >
                  {slice.map((cfg, iconIdx) => {
                    const angle = iconIdx * angleStep - Math.PI / 2; // start from top
                    const x = 50 + 50 * Math.cos(angle);
                    const y = 50 + 50 * Math.sin(angle);

                    return (
                      <div
                        key={iconIdx}
                        title={cfg.name}
                        style={{
                          position: 'absolute',
                          left: `${x}%`,
                          top:  `${y}%`,
                          transform: 'translate(-50%,-50%)',
                          width:  '38px',
                          height: '38px',
                          borderRadius: '50%',
                          background: 'var(--surface)',
                          border: '1px solid var(--rule)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.07)',
                          /* counter-spin so icons stay upright */
                          animation: `techSpin ${speed}s linear infinite reverse`,
                        }}
                      >
                        <cfg.Icon size={18} color={cfg.color} />
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Keyframes injected via style tag */}
      <style>{`
        @keyframes techSpin {
          from { transform: rotate(0deg);   }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
