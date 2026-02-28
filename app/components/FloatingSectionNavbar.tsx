'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const sectionLinks = [
  { href: '#home', label: 'Home' },
  { href: '#process', label: 'Process' },
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
];

export default function FloatingSectionNavbar() {
  const [activeHref, setActiveHref] = useState('#home');

  useEffect(() => {
    const sectionElements = sectionLinks
      .map((link) => document.getElementById(link.href.replace('#', '')))
      .filter((element): element is HTMLElement => element !== null);

    if (!sectionElements.length) return;

    const syncFromHash = () => {
      const hash = window.location.hash;
      if (sectionLinks.some((link) => link.href === hash)) {
        setActiveHref(hash);
      }
    };

    syncFromHash();

    const observer = new IntersectionObserver(
      (entries) => {
        const topVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (topVisible?.target.id) {
          setActiveHref(`#${topVisible.target.id}`);
        }
      },
      {
        root: null,
        rootMargin: '-35% 0px -45% 0px',
        threshold: [0.2, 0.35, 0.5, 0.7],
      }
    );

    sectionElements.forEach((section) => observer.observe(section));
    window.addEventListener('hashchange', syncFromHash);

    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', syncFromHash);
    };
  }, []);

  return (
    <nav className="fixed left-1/2 top-4 z-70 -translate-x-1/2 px-2" aria-label="Section navigation">
      <div className="flex max-w-[calc(100vw-1rem)] items-center gap-1.5 overflow-x-auto rounded-full border border-cyan-400/25 bg-slate-950/45 p-1.5 backdrop-blur-md">
        {sectionLinks.map((link) => {
          const isActive = activeHref === link.href;

          return (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setActiveHref(link.href)}
              aria-current={isActive ? 'page' : undefined}
              className={`shrink-0 rounded-full px-3 py-2 text-[11px] font-medium uppercase tracking-[0.12em] transition-colors ${
                isActive
                  ? 'bg-white/12 text-cyan-300'
                  : 'text-slate-200/85 hover:bg-white/10 hover:text-cyan-300'
              }`}
            >
              {link.label}
            </a>
          );
        })}

        <Link
          href="/projects"
          className="ml-1 inline-flex h-9 shrink-0 items-center rounded-full border border-cyan-300/35 bg-transparent px-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-300 transition-colors hover:bg-cyan-400/10"
          aria-label="Go to projects"
        >
          Projects
        </Link>
      </div>
    </nav>
  );
}
