'use client';

import Link from 'next/link';

const sectionLinks = [
  { href: '#home', label: 'Home' },
  { href: '#process', label: 'Process' },
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
];

export default function FloatingSectionNavbar() {
  return (
    <nav className="fixed left-1/2 top-4 z-70 -translate-x-1/2 px-2" aria-label="Section navigation">
      <div className="flex max-w-[calc(100vw-1rem)] items-center gap-1.5 overflow-x-auto rounded-full border border-cyan-400/25 bg-slate-950/45 p-1.5 backdrop-blur-md">
        {sectionLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="shrink-0 rounded-full px-3 py-2 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-200/85 transition-colors hover:bg-white/10 hover:text-cyan-300"
          >
            {link.label}
          </a>
        ))}

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
