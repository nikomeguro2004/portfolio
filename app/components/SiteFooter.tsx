import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer style={{ borderTop: '1px solid var(--rule)' }}>
      <div className="container py-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div>
            <p className="label-mono mb-1" style={{ color: 'rgba(255,79,26,0.4)' }}>S Adityan</p>
            <p
              className="text-sm font-semibold"
              style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.01em' }}
            >
              Full-Stack Engineer &amp; AI Developer
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            {[
              { href: '/#work',       label: 'Work' },
              { href: '/#process',    label: 'Process' },
              { href: '/#experience', label: 'Experience' },
              { href: '/projects',    label: 'Projects' },
              { href: '/#contact',    label: 'Contact' },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="label-mono transition-colors hover:text-current"
                style={{ color: 'var(--text-3)' }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'var(--accent)')}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'var(--text-3)')}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <p className="label-mono" style={{ color: 'var(--text-3)', opacity: 0.5 }}>
            © {new Date().getFullYear()} · Next.js · TypeScript
          </p>

        </div>
      </div>
    </footer>
  );
}
