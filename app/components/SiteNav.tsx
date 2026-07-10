'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { id: 'projects',   label: 'Projects', href: '/projects' },
  { id: 'process',    label: 'Process', href: '/#process' },
  { id: 'services',   label: 'Services', href: '/#services' },
  { id: 'skills',     label: 'Skills', href: '/#skills' },
  { id: 'contact',    label: 'Contact', href: '/#contact' },
];

export default function SiteNav() {
  const router = useRouter();
  const [active, setActive] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      setVisible(y < 80 || y < lastY.current);
      lastY.current = y;
      let found = '';
      for (const item of [...NAV_ITEMS].reverse()) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= 100) { found = item.id; break; }
      }
      setActive(found);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string, href?: string) => {
    if (href && href.startsWith('/')) {
      router.push(href);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header
      animate={{ y: visible ? 0 : -90 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: '64px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(1rem, 4vw, 4rem)',
        background: scrolled ? 'rgba(245,241,232,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(140%)' : 'none',
        borderBottom: `1px solid ${scrolled ? 'var(--rule)' : 'transparent'}`,
        transition: 'background 0.35s, border-color 0.35s',
      }}
    >
      {/* Logotype */}
      <a href="#home" style={{
        fontFamily: 'var(--font-heading), "Syne", sans-serif',
        fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.02em',
        color: 'var(--text)', textDecoration: 'none', whiteSpace: 'nowrap',
      }}>
        S·ADI
      </a>

      {/* Center links — hidden on mobile, absolutely centered on md+ */}
      <nav className="hidden md:flex" style={{
        alignItems: 'center', gap: '0.125rem',
        position: 'absolute', left: '50%', transform: 'translateX(-50%)',
      }}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id, item.href)}
            style={{
              position: 'relative', background: 'none', border: 'none',
              padding: '0.4rem 0.75rem', borderRadius: '100px',
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.18em',
              color: active === item.id ? 'var(--accent)' : 'var(--text-3)',
              cursor: 'none', transition: 'color 0.2s',
            }}
            onMouseEnter={e => { if (active !== item.id) (e.currentTarget as HTMLElement).style.color = 'var(--text)'; }}
            onMouseLeave={e => { if (active !== item.id) (e.currentTarget as HTMLElement).style.color = 'var(--text-3)'; }}
          >
            {item.label}
            {active === item.id && (
              <motion.span
                layoutId="nav-pill"
                style={{
                  position: 'absolute', inset: 0, borderRadius: '100px',
                  background: 'rgba(255,79,26,0.07)',
                  border: '1px solid rgba(255,79,26,0.2)', zIndex: -1,
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        ))}
      </nav>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.18em',
          color: 'rgba(74,222,128,0.85)',
        }} className="hidden sm:flex">
          <span style={{ width:'5px',height:'5px',borderRadius:'50%',background:'#4ade80' }} className="animate-pulse" />
          Available
        </span>
        <a href="#contact" className="btn-primary" style={{ fontSize:'10px', padding:'0.5rem 1rem' }}>
          Let&apos;s Talk
        </a>
      </div>
    </motion.header>
  );
}
