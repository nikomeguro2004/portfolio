'use client';

import { motion } from 'framer-motion';
import { MagneticButton } from './components/MagneticInteractions';
import SiteNav from './components/SiteNav';
import DeliveryPanel from './components/DeliveryPanel';
import ProcessSection from './components/ProcessSection';
import ServicesSection from './components/ServicesSection';
import SkillsSection from './components/SkillsSection';
import ContactBlock from './components/ContactBlock';
import DualModeSection from './components/DualModeSection';
import TechOrbitSection from './components/TechOrbitSection';
import StatsSection from './components/StatsSection';

// ─── Tech marquee ─────────────────────────────────────────────────────────────
const TECH_STRIP = [
  'React', 'Next.js', 'TypeScript', 'Node.js', 'Python',
  'AWS Lambda', 'Supabase', 'Docker', 'FastAPI', 'PostgreSQL',
  'Prisma ORM', 'OpenAI API', 'LLM Pipelines', 'NestJS', 'Stripe',
  'Razorpay', 'Redis', 'Framer Motion', 'RAG Systems', 'Kubernetes',
  'Drizzle ORM', 'Whisper', 'Hugging Face', 'Ollama', 'Sanity CMS',
];

function TechMarquee() {
  const doubled = [...TECH_STRIP, ...TECH_STRIP];
  return (
    <div
      className="marquee-outer"
      aria-hidden="true"
      style={{
        borderTop: '1px solid var(--rule)',
        borderBottom: '1px solid var(--rule)',
        padding: '0.9rem 0',
        overflow: 'hidden',
      }}
    >
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="marquee-item">
            <span className="marquee-sep">·</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Chapter label — the Swiss spine ──────────────────────────────────────────
function ChapterLabel({ num, title, sub }: { num: string; title: string; sub: string }) {
  return (
    <motion.div
      className="relative container pt-8 mb-0"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.7 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="chapter-num-bg" aria-hidden="true">{num}</span>
      <div className="chapter-bar relative z-10">
        <span className="label-mono" style={{ color: 'rgba(255,79,26,0.45)' }}>{num}</span>
        <span className="h-3 w-px hidden sm:block" style={{ background: 'var(--rule)' }} />
        <span className="chapter-title">{title}</span>
        <span className="flex-1" style={{ height: '1px', background: 'var(--rule)', margin: '0 0.25rem' }} />
        <span className="label-mono hidden sm:inline">{sub}</span>
      </div>
    </motion.div>
  );
}

// ─── Hero Editorial Panel (cream/on-brand) ────────────────────────────────────
function HeroEditorialPanel() {
  const domains = [
    'React · Next.js · TypeScript',
    'Node.js · FastAPI · Supabase',
    'AI / LLMs · RAG · OpenAI',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '100%',
        maxWidth: '340px',
        border: '1px solid var(--rule-strong)',
        borderRadius: 'var(--r-md)',
        background: 'var(--surface)',
        overflow: 'hidden',
      }}
    >
      {/* Orange top accent bar */}
      <div style={{ height: '2px', background: 'var(--accent)' }} />

      {/* Header */}
      <div style={{
        padding: '0.9rem 1.3rem',
        borderBottom: '1px solid var(--rule)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span className="label-mono" style={{ color: 'var(--text-3)' }}>AVAILABILITY</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span className="animate-pulse" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
          <span className="label-mono" style={{ color: '#22c55e' }}>OPEN TO WORK</span>
        </div>
      </div>

      {/* Info rows */}
      <div style={{ padding: '1rem 1.3rem', borderBottom: '1px solid var(--rule)' }}>
        {([
          ['FOCUS',    'Full-Stack · AI Engineering'],
          ['RESPONSE', '< 24 hours'],
          ['MODE',     'Async-first · Ship-first'],
          ['BASE',     'Chennai, India'],
        ] as [string, string][]).map(([l, v]) => (
          <div key={l} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            marginBottom: '0.55rem',
          }}>
            <span className="label-mono" style={{ color: 'var(--text-3)' }}>{l}</span>
            <span style={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '10px', letterSpacing: '0.08em',
              color: 'var(--text-2)',
            }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Core domains */}
      <div style={{ padding: '1rem 1.3rem', borderBottom: '1px solid var(--rule)' }}>
        <p className="label-mono" style={{ color: 'rgba(255,79,26,0.45)', marginBottom: '0.65rem' }}>CORE STACK</p>
        {domains.map((d) => (
          <div key={d} style={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: '10px', letterSpacing: '0.07em',
            color: 'var(--text-2)',
            padding: '0.3rem 0',
            borderBottom: '1px solid var(--rule)',
          }}>{d}</div>
        ))}
      </div>

      {/* Stats */}
      <div style={{ padding: '1rem 1.3rem', display: 'flex', gap: '2rem' }}>
        {([['9+', 'SHIPPED'], ['30+', 'TOOLS'], ['95+', 'LIGHTHOUSE']] as [string, string][]).map(([v, l]) => (
          <div key={l}>
            <div style={{
              fontFamily: 'var(--font-heading), "Syne", sans-serif',
              fontSize: '1.4rem', fontWeight: 700,
              color: 'var(--accent)', letterSpacing: '-0.03em',
            }}>{v}</div>
            <div className="label-mono" style={{ color: 'var(--text-3)', marginTop: '2px' }}>{l}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <SiteNav />

      {/* ════════════════════════════════════════════════════════════════
          01 — HERO
      ════════════════════════════════════════════════════════════════ */}
      <section id="home" className="relative min-h-screen flex flex-col justify-center pt-24 pb-16 overflow-x-hidden">

        {/* Floating ambient orbs */}
        <div className="pointer-events-none absolute inset-0" style={{ zIndex: 0 }}>
          <motion.div
            animate={{ x: [0, 34, -20, 0], y: [0, -48, 24, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', top: '0%', left: '-10%',
              width: '55vw', height: '55vw',
              background: 'radial-gradient(circle, rgba(255,79,26,0.08) 0%, transparent 65%)',
              filter: 'blur(90px)',
            }}
          />
          <motion.div
            animate={{ x: [0, -48, 20, 0], y: [0, 32, -38, 0] }}
            transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
            style={{
              position: 'absolute', top: '20%', right: '-8%',
              width: '42vw', height: '42vw',
              background: 'radial-gradient(circle, rgba(255,160,26,0.06) 0%, transparent 65%)',
              filter: 'blur(110px)',
            }}
          />
          <motion.div
            animate={{ x: [0, 24, -32, 0], y: [0, -22, 42, 0] }}
            transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut', delay: 14 }}
            style={{
              position: 'absolute', bottom: '5%', left: '28%',
              width: '36vw', height: '36vw',
              background: 'radial-gradient(circle, rgba(255,79,26,0.045) 0%, transparent 65%)',
              filter: 'blur(100px)',
            }}
          />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>

          {/* Status row */}
          <motion.div
            className="flex items-center justify-between pb-4 mb-12"
            style={{ borderBottom: '1px solid var(--rule)' }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center gap-4 flex-wrap">
              <span className="label-mono" style={{ color: 'rgba(255,79,26,0.4)' }}>001 / Portfolio</span>
              <span className="h-3 w-px hidden sm:block" style={{ background: 'var(--rule)' }} />
              <span className="label-mono hidden sm:block">Chennai · Full-Stack · AI · Cloud</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: '#4ade80' }} />
              <span className="label-mono" style={{ color: 'rgba(74,222,128,0.8)' }}>Available for Contract</span>
            </div>
          </motion.div>

          {/* NAME */}
          <div className="overflow-hidden mb-4">
            <motion.h1
              className="hero-name"
              initial={{ y: '106%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1], delay: 0.28 }}
            >
              S Adityan
            </motion.h1>
          </div>

          {/* Accent rule */}
          <motion.div
            className="mb-14 rule-accent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            style={{ transformOrigin: 'left' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.88 }}
          />

          {/* 2-col: Left = full narrative, Right = CardSwap */}
          <div className="grid lg:grid-cols-2 gap-12 items-end mb-16">

            {/* Left — complete narrative */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="section-heading mb-5">
                Full-Stack Engineer<br />&amp; AI Developer
              </h2>
              <p className="body-text max-w-md mb-8" style={{ lineHeight: 1.8 }}>
                I architect and build enterprise-grade software that scales. 
                Specializing in high-performance SaaS and AI-driven platforms, I deliver robust solutions from concept to production with absolute ownership.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 mb-9">
                <MagneticButton href="/projects" className="btn-primary" strength={0.15}>
                  See Work ↗
                </MagneticButton>
                <MagneticButton href="#contact" className="btn-ghost" strength={0.15}>
                  Let&apos;s Build →
                </MagneticButton>
              </div>

              {/* Stats */}
              <div className="pt-6 grid grid-cols-4 gap-3 sm:flex sm:flex-wrap sm:gap-8" style={{ borderTop: '1px solid var(--rule)' }}>
                {[
                  { value: '9+',  label: 'Shipped'    },
                  { value: '30+', label: 'Stack'      },
                  { value: '6wk', label: 'Avg Cycle'  },
                  { value: '95+', label: 'Lighthouse' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 1.28 + i * 0.07 }}
                  >
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right — Editorial availability panel (desktop only) */}
            <div className="hidden lg:block" style={{ position: 'relative', height: '420px' }}>
              <HeroEditorialPanel />
            </div>
          </div>

          {/* Delivery Panel */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <DeliveryPanel />
          </motion.div>

        </div>
      </section>

      {/* ── Tech strip ──────────────────────────────────────────────── */}
      <TechMarquee />

      {/* ════════════════════════════════════════════════════════════════
          DUAL MODE — I CAN DESIGN · I CAN DEVELOP
      ════════════════════════════════════════════════════════════════ */}
      <DualModeSection />

      {/* ════════════════════════════════════════════════════════════════
          TECH ORBIT — PRODUCTION TOOLKIT
      ════════════════════════════════════════════════════════════════ */}
      <TechOrbitSection />

      {/* ════════════════════════════════════════════════════════════════
          02 — PROCESS
      ════════════════════════════════════════════════════════════════ */}
      <ChapterLabel num="02" title="Process" sub="Engineering workflows for production scale" />
      <ProcessSection />

      <div className="section-thread" aria-hidden="true" />

      {/* ════════════════════════════════════════════════════════════════
          STATS — By the numbers
      ════════════════════════════════════════════════════════════════ */}
      <StatsSection />

      {/* ════════════════════════════════════════════════════════════════
          03 — SERVICES
      ════════════════════════════════════════════════════════════════ */}
      <ChapterLabel num="03" title="Services" sub="Comprehensive technical execution and strategic architecture" />
      <ServicesSection />

      <div className="section-thread" aria-hidden="true" />

      {/* ════════════════════════════════════════════════════════════════
          04 — SKILLS
      ════════════════════════════════════════════════════════════════ */}
      <ChapterLabel num="04" title="Skills" sub="Battle-tested technologies driving production systems" />
      <SkillsSection />

      <div className="section-thread" aria-hidden="true" />

      {/* Contact */}
      <ContactBlock />
    </>
  );
}
