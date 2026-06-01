'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const PROJECTS = [
  {
    num: '002',
    name: 'GameDen OS',
    scope: 'IoT-powered gaming café SaaS — Raspberry Pi nodes track every station in real-time. Next.js dashboard for operators, automated session billing, and Flutter mobile apps for owners and customers.',
    timeline: '—',
    metric: 'IoT · Cross-platform',
    category: 'IoT · SaaS',
    status: 'Active',
    href: 'https://github.com/nikomeguro2004',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=900&q=85&auto=format&fit=crop',
    stack: ['Next.js', 'Flutter', 'Supabase', 'Drizzle', 'Raspberry Pi', 'IoT'],
    featured: false,
  },
  {
    num: '003',
    name: 'Triangle Field Sandbox',
    scope: 'Real-time physics engine — Matter.js rigid-body collision, deterministic simulation loop, locked 60 FPS on HTML5 canvas.',
    timeline: '4 weeks',
    metric: '60 FPS locked',
    category: 'Creative Engineering',
    status: 'Live',
    href: 'https://github.com/nikomeguro2004',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=900&q=85&auto=format&fit=crop',
    stack: ['Matter.js', 'Canvas 2D', 'TypeScript'],
    featured: false,
  },
  {
    num: '004',
    name: 'SivaComics Publishing',
    scope: 'Full-stack comic platform — React + Vite frontend, AWS S3 media, Razorpay subscriptions. Full content delivery pipeline from creator upload to reader.',
    timeline: '6 weeks',
    metric: '95+ Lighthouse',
    category: 'Platform',
    status: 'Live',
    href: 'https://sivacomics.com',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900&q=85&auto=format&fit=crop',
    stack: ['React', 'Vite', 'AWS'],
    featured: false,
  },
  {
    num: '005',
    name: 'EssayRaccoon SaaS',
    scope: 'AI writing SaaS — Next.js, Supabase auth & storage, live Razorpay subscription checkout. Essay generation with real payments from day one.',
    timeline: '2 weeks',
    metric: 'Live payments',
    category: 'SaaS Product',
    status: 'Live',
    href: 'https://essayraccoon.com',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=85&auto=format&fit=crop',
    stack: ['Next.js', 'Supabase', 'Razorpay'],
    featured: false,
  },
  {
    num: '006',
    name: 'MACT Calc',
    scope: 'Compensation calculator for accident victims — MACT tribunal-ready claim estimates and legal report generation.',
    timeline: '8 weeks',
    metric: 'Mobile + Web',
    category: 'LegalTech',
    status: 'Active',
    href: 'https://github.com/nikomeguro2004',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=900&q=85&auto=format&fit=crop',
    stack: ['Flutter', 'Supabase', 'Dart'],
    featured: false,
  },
  {
    num: '007',
    name: 'Support Chatbot RAG',
    scope: 'Vector DB + LLM inference pipeline — Pinecone, OpenAI embeddings, streaming responses under 200ms p95.',
    timeline: '3 weeks',
    metric: '<200ms p95',
    category: 'AI Engineering',
    status: 'Complete',
    href: 'https://github.com/nikomeguro2004',
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=900&q=85&auto=format&fit=crop',
    stack: ['OpenAI', 'Pinecone', 'FastAPI'],
    featured: false,
  },
  {
    num: '007',
    name: 'CA Practice OS',
    scope: 'Enterprise SaaS platform built for Chartered Accountant firms — AI-assisted ITR preparation, automated GST reconciliation, multi-client ledger management, and real-time compliance dashboards. Multi-tenant architecture with role-based access, dual-ORM data layer (Prisma + Drizzle) across PostgreSQL and SQL Server, and a fully offline-capable PWA so CAs can work without connectivity during audits.',
    timeline: '—',
    metric: 'PWA · Multi-tenant',
    category: 'FinTech · Enterprise SaaS',
    status: 'Active',
    href: 'https://github.com/nikomeguro2004',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=900&q=85&auto=format&fit=crop',
    stack: ['Next.js', 'Prisma', 'Drizzle', 'PostgreSQL', 'SQL Server', 'AI', 'PWA'],
    featured: true,
  },
];

const STATUS_DOT: Record<string, string> = {
  Live: '#4ade80', Active: '#fb923c', Complete: '#6b7280',
};

function useTilt(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let rect: DOMRect | null = null;
    let rafId = 0;

    const onEnter = () => {
      rect = el.getBoundingClientRect();
      el.style.transition = 'none';
    };

    const onMove = (e: MouseEvent) => {
      if (!rect) return;
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
      
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        el.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${y}deg)`;
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(rafId);
      rect = null;
      el.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
      el.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg)';
      setTimeout(() => { if (!rect && el) el.style.transition = ''; }, 600);
    };

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => { 
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafId);
    };
  }, [ref]);
}

function FeaturedCard({ p }: { p: typeof PROJECTS[0] }) {
  const ref = useRef<HTMLDivElement>(null);
  useTilt(ref);
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="mb-3"
    >
      <div
        ref={ref}
        style={{
          position: 'relative', overflow: 'hidden', borderRadius: 'var(--r-md)',
          border: '1px solid var(--rule)', background: 'var(--surface)',
          minHeight: '400px', display: 'flex', transition: 'border-color 0.3s, box-shadow 0.3s',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,79,26,0.35)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 48px rgba(0,0,0,0.12)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--rule)';
          (e.currentTarget as HTMLElement).style.boxShadow = 'none';
        }}
      >
        {/* Image — right half, more visible */}
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: '58%',
          backgroundImage: `url(${p.image})`, backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.28,
          transition: 'opacity 0.4s ease',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.38'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '0.28'; }}
        />
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: '58%',
          background: 'linear-gradient(to right, var(--surface) 0%, rgba(237,233,223,0.2) 55%, transparent 85%)',
        }} />

        {/* Huge project number watermark */}
        <span style={{
          position: 'absolute', top: '-0.1em', right: '0.1em',
          fontFamily: 'var(--font-heading), "Syne", sans-serif',
          fontSize: 'clamp(6rem, 14vw, 12rem)', fontWeight: 800,
          letterSpacing: '-0.07em', lineHeight: 1,
          color: 'var(--accent)', opacity: 0.04, userSelect: 'none', pointerEvents: 'none',
        }}>
          {p.num}
        </span>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, maxWidth: '60%' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.24em', color: 'rgba(255,79,26,0.5)' }}>Featured</span>
              <span style={{ height: '1px', flex: 1, background: 'var(--rule)' }} />
              <span className="label-mono">{p.category}</span>
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading), "Syne", sans-serif', fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '0.75rem' }}>
              {p.name}
            </h3>
            <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--text-2)', maxWidth: '380px' }}>{p.scope}</p>
          </div>

          {/* Stack tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '1rem' }}>
            {p.stack.map(s => (
              <span key={s} style={{
                fontFamily: 'var(--font-geist-mono), monospace', fontSize: '9px',
                textTransform: 'uppercase', letterSpacing: '0.16em',
                color: 'var(--text-3)', border: '1px solid var(--rule)',
                borderRadius: '2px', padding: '0.2rem 0.55rem',
                background: 'rgba(0,0,0,0.03)',
              }}>{s}</span>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--rule)', alignItems: 'flex-end' }}>
            {[
              { l: 'Key Metric', v: p.metric },
              { l: 'Status', v: p.status },
            ].map(d => (
              <div key={d.l}>
                <p className="label-mono" style={{ marginBottom: '3px', color: 'rgba(255,79,26,0.4)' }}>{d.l}</p>
                <p style={{ fontFamily: 'var(--font-heading), "Syne", sans-serif', fontSize: '13px', fontWeight: 600, color: d.l === 'Key Metric' ? 'var(--accent)' : 'var(--text)' }}>{d.v}</p>
              </div>
            ))}
            <a
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                fontFamily: 'var(--font-geist-mono), monospace', fontSize: '10px',
                textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700,
                color: 'var(--accent)', textDecoration: 'none',
                padding: '0.5rem 0.9rem', border: '1px solid rgba(255,79,26,0.3)',
                borderRadius: '3px', transition: 'background 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,79,26,0.06)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.transform = ''; }}
            >
              View ↗
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectCard({ p, i }: { p: typeof PROJECTS[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useTilt(ref);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        ref={ref}
        style={{
          position: 'relative', overflow: 'hidden', borderRadius: 'var(--r-md)',
          border: '1px solid var(--rule)', background: 'var(--surface)',
          height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          transition: 'border-color 0.3s, box-shadow 0.3s',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,79,26,0.3)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 36px rgba(0,0,0,0.12)';
          const img = e.currentTarget.querySelector('.card-img') as HTMLElement;
          if (img) img.style.opacity = '0.2';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--rule)';
          (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          const img = e.currentTarget.querySelector('.card-img') as HTMLElement;
          if (img) img.style.opacity = '0.12';
        }}
      >
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${p.image})`, backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.12, transition: 'opacity 0.4s ease',
        }} className="card-img" />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(237,233,223,0.02) 0%, rgba(237,233,223,0.95) 55%)',
        }} />

        {/* Project number watermark */}
        <span style={{
          position: 'absolute', top: '-0.05em', left: '0.2em',
          fontFamily: 'var(--font-heading), "Syne", sans-serif',
          fontSize: '5rem', fontWeight: 800, letterSpacing: '-0.06em', lineHeight: 1,
          color: 'var(--accent)', opacity: 0.05, userSelect: 'none', pointerEvents: 'none',
        }}>
          {p.num}
        </span>

        <div style={{ position: 'relative', zIndex: 1, padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
            <p className="label-mono" style={{ color: 'rgba(255,79,26,0.5)' }}>{p.category}</p>
            <span style={{
              display: 'flex', alignItems: 'center', gap: '0.35rem',
              fontFamily: 'var(--font-geist-mono), monospace', fontSize: '8px',
              textTransform: 'uppercase', letterSpacing: '0.12em',
              color: STATUS_DOT[p.status],
            }}>
              <span style={{ width:'5px',height:'5px',borderRadius:'50%',background: STATUS_DOT[p.status], display:'inline-block' }} />
              {p.status}
            </span>
          </div>
          <h3 style={{ fontFamily: 'var(--font-heading), "Syne", sans-serif', fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
            {p.name}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.6, marginBottom: '0.75rem' }}>{p.scope}</p>
          {/* Stack */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.6rem' }}>
            {p.stack.map(s => (
              <span key={s} style={{
                fontFamily: 'var(--font-geist-mono), monospace', fontSize: '8px',
                textTransform: 'uppercase', letterSpacing: '0.14em',
                color: 'var(--text-3)', border: '1px solid var(--rule)',
                borderRadius: '2px', padding: '0.15rem 0.45rem',
              }}>{s}</span>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.6rem', borderTop: '1px solid var(--rule)' }}>
            <span className="label-mono" style={{ color: STATUS_DOT[p.status] }}>
              <span style={{ display: 'inline-block', width: '5px', height: '5px', borderRadius: '50%', background: STATUS_DOT[p.status], marginRight: '0.35rem', verticalAlign: 'middle' }} />
              {p.status}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '10px', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.08em' }}>{p.metric}</span>
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--text-3)', fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--accent)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--text-3)')}
                onClick={e => e.stopPropagation()}
              >
                ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectGrid() {
  const featured = PROJECTS.find(p => p.featured) ?? PROJECTS[0];
  const rest = PROJECTS.filter(p => !p.featured);

  return (
    <section id="work" className="py-20">
      <div className="container max-w-[1400px]">
        <motion.p
          className="body-text mb-8 max-w-xl"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
        >
          Every card is a real product shipped to production. No concepts, no mockups.
        </motion.p>

        <FeaturedCard p={featured} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.875rem' }}>
          {rest.map((p, i) => <ProjectCard key={p.num} p={p} i={i} />)}
        </div>
      </div>
    </section>
  );
}
