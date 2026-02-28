import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="border-t py-10" style={{ borderColor: 'var(--border)' }}>
      <div className="container">
        <div className="rounded-2xl border border-cyan-400/10 bg-slate-900/20 p-6 sm:p-7">
          <div className="grid gap-7 md:grid-cols-[1.2fr_1fr_1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-cyan-300/80">S Adityan</p>
              <p className="mt-3 text-base font-semibold">Full-Stack Engineer & AI Developer</p>
              <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                Building production-focused applications with scalable architecture and reliable delivery.
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--text-tertiary)' }}>Navigate</p>
              <div className="mt-3 flex flex-col gap-2 text-sm">
                <Link href="/" className="transition-colors hover:text-cyan-300" style={{ color: 'var(--text-secondary)' }}>Home</Link>
                <Link href="/#about" className="transition-colors hover:text-cyan-300" style={{ color: 'var(--text-secondary)' }}>About</Link>
                <Link href="/#experience" className="transition-colors hover:text-cyan-300" style={{ color: 'var(--text-secondary)' }}>Experience</Link>
                <Link href="/projects" className="transition-colors hover:text-cyan-300" style={{ color: 'var(--text-secondary)' }}>Projects</Link>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--text-tertiary)' }}>Contact</p>
              <div className="mt-3 flex flex-col gap-2 text-sm">
                <a href="mailto:adihere2000@gmail.com" className="transition-colors hover:text-cyan-300" style={{ color: 'var(--text-secondary)' }}>
                  adihere2000@gmail.com
                </a>
                <a href="https://github.com/nikomeguro2004" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-cyan-300" style={{ color: 'var(--text-secondary)' }}>
                  GitHub
                </a>
                <a href="https://linkedin.com/in/adityan-suresh-781116256" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-cyan-300" style={{ color: 'var(--text-secondary)' }}>
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-2 border-t border-cyan-400/10 pt-4 text-xs md:flex-row md:items-center md:justify-between" style={{ color: 'var(--text-tertiary)' }}>
            <p>© {new Date().getFullYear()} S Adityan. All rights reserved.</p>
            <p>Engineered with Next.js, TypeScript, and Tailwind CSS.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
