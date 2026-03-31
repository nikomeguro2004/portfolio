'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'process', label: 'Process' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];

export default function FloatingSectionNavbar() {
  const pathname = usePathname();
  const onProjectsPage = pathname === '/projects';
  const sectionLinks = useMemo(
    () =>
      sections.map((section) => ({
        href: onProjectsPage ? `/#${section.id}` : `#${section.id}`,
        hash: `#${section.id}`,
        label: section.label,
      })),
    [onProjectsPage]
  );

  const [activeHref, setActiveHref] = useState('#home');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (onProjectsPage) {
      setActiveHref('/projects');
      return;
    }

    const sectionElements = sectionLinks
      .map((link) => document.getElementById(link.hash.replace('#', '')))
      .filter((element): element is HTMLElement => element !== null);

    if (!sectionElements.length) return;

    const syncFromHash = () => {
      const hash = window.location.hash;
      if (sectionLinks.some((link) => link.hash === hash)) {
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
  }, [onProjectsPage, sectionLinks]);

  useEffect(() => {
    let lastY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastY;

      if (currentY <= 24) {
        setIsVisible(true);
      } else if (delta > 8) {
        setIsVisible(false);
      } else if (delta < -8) {
        setIsVisible(true);
      }

      lastY = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed left-1/2 top-4 z-70 -translate-x-1/2 px-2 transition-all duration-300 md:ml-8 ${
        isVisible ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-16 opacity-0 pointer-events-none'
      }`}
      aria-label="Section navigation"
    >
      <div className="flex max-w-[calc(100vw-1rem)] items-center gap-1.5 overflow-x-auto rounded-full border border-cyan-300/30 bg-[linear-gradient(120deg,rgba(15,23,42,0.86),rgba(15,23,42,0.62))] p-1.5 shadow-[0_10px_36px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        {sectionLinks.map((link) => {
          const isActive = activeHref === link.hash;

          return (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setActiveHref(link.hash)}
              aria-current={isActive ? 'page' : undefined}
              className={`shrink-0 rounded-full px-3 py-2 text-[11px] font-medium uppercase tracking-[0.12em] transition-colors ${
                isActive
                  ? 'bg-white/14 text-cyan-200'
                  : 'text-slate-200/85 hover:bg-white/10 hover:text-cyan-300'
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                {isActive && <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.85)]" />}
                {link.label}
              </span>
            </a>
          );
        })}

        <Link
          href="/projects"
          onClick={() => setActiveHref('/projects')}
          className={`ml-1 inline-flex h-9 shrink-0 items-center rounded-full border px-4 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors ${
            activeHref === '/projects'
              ? 'border-cyan-300/55 bg-cyan-400/12 text-cyan-200'
              : 'border-cyan-300/35 bg-transparent text-cyan-300 hover:bg-cyan-400/10'
          }`}
          aria-label="Go to projects"
          aria-current={activeHref === '/projects' ? 'page' : undefined}
        >
          Projects
        </Link>
      </div>
    </nav>
  );
}
