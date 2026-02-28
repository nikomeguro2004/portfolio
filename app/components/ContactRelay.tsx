'use client';

import Link from 'next/link';
import { MagneticButton } from './MagneticEffects';

interface SocialItem {
  href: string;
  label: string;
  icon: string;
}

interface ContactRelayProps {
  socials: SocialItem[];
}

export default function ContactRelay({ socials }: ContactRelayProps) {
  return (
    <>
      <section id="contact" className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-stretch">
            <div className="rounded-2xl border border-cyan-400/15 bg-slate-900/35 p-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Let&apos;s Connect</h2>
              <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
                I work best on systems that need to scale, problems that need untangling, and teams that ship.
              </p>
              <MagneticButton href="mailto:adihere2000@gmail.com" className="btn-primary" strength={0.15}>
                adihere2000@gmail.com
              </MagneticButton>
            </div>

            <div className="rounded-2xl border border-indigo-400/15 bg-indigo-500/5 p-8 flex flex-col justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-indigo-300/80">Social Channels</p>
                <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Open to freelance, intern-to-full-time roles, and collaboration on startup products.
                </p>
              </div>

              <div className="flex flex-wrap gap-5 mt-8">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-cyan-400 transition-colors duration-300"
                    aria-label={social.label}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d={social.icon} clipRule="evenodd" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 rounded-xl border border-cyan-400/10 bg-slate-900/20 px-4 py-4">
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              © {new Date().getFullYear()} S Adityan
            </p>
            <Link href="/projects" className="text-sm hover:text-cyan-400 transition-colors" style={{ color: 'var(--text-tertiary)' }}>
              View Projects →
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
