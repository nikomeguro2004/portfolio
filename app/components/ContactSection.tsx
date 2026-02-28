'use client';

import Link from 'next/link';
import { MagneticButton } from './MagneticInteractions';

interface SocialItem {
  href: string;
  label: string;
  icon: string;
}

interface ContactSectionProps {
  socials: SocialItem[];
}

export default function ContactSection({ socials }: ContactSectionProps) {
  return (
    <>
      <section id="contact" className="py-16">
        <div className="container">
          <div className="grid items-stretch gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-2xl border border-cyan-400/15 bg-slate-900/35 p-8">
              <p className="text-xs uppercase tracking-[0.16em] text-cyan-300/80">Contact</p>
              <h2 className="mb-3 mt-3 text-3xl font-bold md:text-4xl">Let&apos;s Build a Strong Product</h2>
              <p className="mb-6 text-base md:text-lg" style={{ color: 'var(--text-secondary)' }}>
                I collaborate on startup products that need clean architecture, reliable delivery, and measurable outcomes.
              </p>

              <div className="mb-6 grid gap-3 sm:grid-cols-2">
                {[
                  { label: 'Response window', value: 'Within 24 hours' },
                  { label: 'Current focus', value: 'Full-stack + AI product builds' },
                  { label: 'Availability', value: 'Internship / full-time opportunities' },
                  { label: 'Collaboration mode', value: 'Async-first, execution-driven' },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg border border-cyan-300/15 bg-black/20 p-3">
                    <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--text-tertiary)' }}>{item.label}</p>
                    <p className="mt-1 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <MagneticButton href="mailto:adihere2000@gmail.com" className="btn-primary" strength={0.2}>
                  Email Me
                </MagneticButton>
                <MagneticButton href="/projects" className="btn-secondary" strength={0.15}>
                  See Project Work
                </MagneticButton>
              </div>
            </div>

            <div className="flex flex-col rounded-2xl border border-indigo-400/15 bg-indigo-500/5 p-8">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-indigo-300/80">Social Channels</p>
                <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Pick your preferred platform for opportunities, project discussions, or technical collaboration.
                </p>
              </div>

              <div className="mt-6 space-y-3">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-lg border border-indigo-300/20 bg-black/15 px-4 py-3 text-gray-400 transition-colors duration-300 hover:text-cyan-300"
                    aria-label={social.label}
                  >
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d={social.icon} clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium transition-transform group-hover:translate-x-0.5">{social.label}</span>
                    </span>
                    <span className="text-xs text-indigo-200/70">Open</span>
                  </a>
                ))}
              </div>

              <div className="mt-5 rounded-lg border border-indigo-300/20 bg-black/15 p-3">
                <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--text-tertiary)' }}>Preferred brief</p>
                <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Share your product stage, stack, timeline, and expected outcomes for a faster kickoff.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-cyan-400/10 bg-slate-900/20 px-4 py-4 md:flex-row">
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              © {new Date().getFullYear()} S Adityan
            </p>
            <Link href="/projects" className="text-sm transition-colors hover:text-cyan-400" style={{ color: 'var(--text-tertiary)' }}>
              View Projects →
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
