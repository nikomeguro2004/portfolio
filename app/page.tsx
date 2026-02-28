'use client';

import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';
import { MagneticButton } from './components/MagneticEffects';
import HeroNarrativeCluster from './components/HeroNarrativeCluster';
import NarrativeAxisSection from './components/NarrativeAxisSection';
import ServiceConstellation from './components/ServiceConstellation';
import ExperienceSpectrum from './components/ExperienceSpectrum';
import TechStackGalaxy from './components/TechStackGalaxy';
import CertificationNebula from './components/CertificationNebula';
import ContactRelay from './components/ContactRelay';

const skills = {
  Frontend: ['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS'],
  Backend: ['Node.js', 'FastAPI', 'Python', 'RESTful APIs'],
  Data: ['PostgreSQL', 'MongoDB', 'Query Optimization'],
  'AI & ML': ['TensorFlow', 'LLM Fine-Tuning', 'RAG Systems'],
  Cloud: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
  Security: ['Web Security', 'SSL/HTTPS', 'Browser Extensions'],
};

const experiences = [
  {
    company: 'Pepul',
    role: 'Full Stack Intern',
    period: '2025 – Present',
    location: 'Startup Product Ecosystem',
    highlights: [
      'Built startup-specific websites on high-velocity weekly cycles, from landing pages to full product surfaces.',
      'Worked across Next.js, React, Nuxt.js, Astro, and NestJS to match each product’s architecture and launch timeline.',
      'Used Supabase for backend workflows and Sanity CMS for flexible, non-technical content operations.',
      'Shipped interaction-heavy interfaces with Three.js, Anime.js, Framer Motion, and GSAP based on UX needs.',
      'Integrated end-to-end payment experiences with Razorpay and Stripe, including subscriptions and checkout flows.',
      'Partnered with founders to convert rough startup ideas into production-ready, measurable web products.',
    ],
  },
  {
    company: 'Ambalsoft',
    role: 'Full Stack AI Intern',
    period: 'Sep – Oct 2025',
    location: 'Chennai, India',
    highlights: [
      'Built Node.js conversational systems with RESTful microservices and MongoDB.',
      'Fine-tuned domain-specific LLMs using Hugging Face transformers.',
      'Architected local LLM inference with Ollama, containerized via Docker.',
      'Developed analytics platform with Streamlit and FastAPI dashboards.',
      'Implemented dashboard data pipelines and backend endpoints for analytics-heavy product modules.',
      'Collaborated in rapid delivery cycles to ship stable features and improve production reliability.',
    ],
  },
];

const priorityCertifications = [
  'React Essentials',
  'Node.js Essentials',
  'AWS Essentials',
  'Data Science Fundamentals',
  'Python DS & Algorithms',
  'Prompt Engineering',
];

const additionalCertifications = [
  'NLP in Python',
  'AI Workflow Enterprise',
  'Web3 Design & Security',
  'UI/UX with Figma',
  'Dart Mastery',
  'Playwright Bootcamp',
  'Arduino Bootcamp',
  'Bootstrap, JS, React, CSS',
];

const whatIDo = [
  {
    title: 'Product Engineering',
    desc: 'From concept to deployment, balancing technical excellence with user experience.',
    chips: ['Product Discovery', 'Execution Strategy', 'Delivery Ownership'],
  },
  {
    title: 'Full-Stack Development',
    desc: 'End-to-end applications with React, Next.js, Node.js, and modern cloud infrastructure.',
    chips: ['Frontend Architecture', 'Backend Design', 'Platform Integration'],
  },
  {
    title: 'AI & Machine Learning',
    desc: 'LLM integration, RAG systems, and ML models for real-world applications.',
    chips: ['Intelligent Workflows', 'Inference Design', 'Applied AI Features'],
  },
  {
    title: 'Cloud Architecture',
    desc: 'Scalable AWS solutions with Docker, Kubernetes, and CI/CD automation.',
    chips: ['Scalable Infrastructure', 'Deployment Automation', 'Reliability Focus'],
  },
  {
    title: 'Security & DevOps',
    desc: 'Web security best practices, SSL/HTTPS implementation, and automated deployment pipelines.',
    chips: ['Security Hardening', 'Operational Quality', 'Release Discipline'],
  },
  {
    title: 'Commerce & Content Systems',
    desc: 'Subscription-ready product stacks with CMS control and secure payment journeys.',
    chips: ['Checkout Experience', 'Subscription Flows', 'CMS Operations'],
  },
];

const guidingQuote = '“Building systems that work, not systems that impress.”';

const ambalsoftSpotlight = {
  company: 'Ambalsoft',
  role: 'Full Stack AI Intern',
  period: 'Sep – Oct 2025',
  location: 'Chennai, India',
  highlights: [
    'Built Node.js conversational systems with RESTful microservices and MongoDB',
    'Fine-tuned domain-specific LLMs using Hugging Face transformers',
    'Architected local LLM inference with Ollama, containerized via Docker',
    'Developed analytics platform with Streamlit and FastAPI dashboards',
  ],
};

const socials = [
  {
    href: 'https://github.com/nikomeguro2004',
    label: 'GitHub',
    icon: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z',
  },
  {
    href: 'https://linkedin.com/in/adityan-suresh-781116256',
    label: 'LinkedIn',
    icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  {
    href: 'https://leetcode.com/u/NikoMeguro/',
    label: 'LeetCode',
    icon: 'M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z',
  },
];

const storySteps = [
  {
    title: 'Discover',
    content: 'Translate founder vision into scope, user journeys, and launch constraints for startup-focused builds.',
    highlight: 'Discovery + startup framing',
    metric: { value: '01', label: 'Context pass' },
    weight: 1,
    animationType: 'slide' as const,
  },
  {
    title: 'Design',
    content: 'Pick the right stack per product (Next.js, React, Nuxt.js, Astro, NestJS) and shape a scalable architecture.',
    highlight: 'Stack-fit system design',
    metric: { value: '02', label: 'Architecture pass' },
    weight: 1.2,
    animationType: 'scale' as const,
  },
  {
    title: 'Ship',
    content: 'Deliver production-ready experiences quickly with CMS workflows, backend integrations, and clean QA cycles.',
    highlight: 'Fast launch quality',
    metric: { value: '03', label: 'Delivery pass' },
    weight: 1.2,
    animationType: 'snap' as const,
  },
  {
    title: 'Evolve',
    content: 'Scale with analytics, payment reliability, and iterative UX improvements after release.',
    highlight: 'Post-launch optimization',
    metric: { value: '04', label: 'Scale pass' },
    weight: 1,
    animationType: 'fade' as const,
  },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const title = heroRef.current.querySelector('.hero-name');
    const subtitles = heroRef.current.querySelectorAll('.hero-subtitle');

    if (title) {
      animate(title, { translateY: [60, 0], opacity: [0, 1], duration: 900, ease: 'out(4)', delay: 180 });
    }

    if (subtitles.length) {
      animate(subtitles, {
        translateY: [24, 0],
        opacity: [0, 1],
        duration: 700,
        ease: 'out(3)',
        delay: stagger(90, { start: 300 }),
      });
    }

    if (ctaRef.current?.children.length) {
      animate(ctaRef.current.children, {
        translateY: [24, 0],
        opacity: [0, 1],
        delay: stagger(100, { start: 420 }),
        duration: 640,
        ease: 'out(3)',
      });
    }

    if (statsRef.current?.children.length) {
      animate(statsRef.current.children, {
        translateY: [18, 0],
        opacity: [0, 1],
        delay: stagger(90, { start: 620 }),
        duration: 520,
        ease: 'out(3)',
      });
    }

    const reveals = document.querySelectorAll('.anime-reveal');
    const staggerGroups = document.querySelectorAll('.anime-stagger');

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animate(entry.target, {
            translateY: [26, 0],
            opacity: [0, 1],
            duration: 650,
            ease: 'out(3)',
          });
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
    );

    const staggerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const children = (entry.target as HTMLElement).querySelectorAll('.anime-stagger-child');
          animate(children, {
            translateY: [30, 0],
            opacity: [0, 1],
            delay: stagger(75),
            duration: 600,
            ease: 'out(3)',
          });
          staggerObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.16 }
    );

    reveals.forEach((el) => revealObserver.observe(el));
    staggerGroups.forEach((el) => staggerObserver.observe(el));

    return () => {
      revealObserver.disconnect();
      staggerObserver.disconnect();
    };
  }, []);

  return (
    <div className="relative" style={{ position: 'relative', zIndex: 10 }}>
      <div
        className="fixed pointer-events-none"
        style={{
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 60%)',
          top: '-100px',
          right: '-100px',
          filter: 'blur(50px)',
        }}
        aria-hidden="true"
      />

      <section ref={heroRef} className="min-h-screen flex items-center pt-12 pb-12">
        <div className="container">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
            <div className="max-w-3xl">
              <p className="hero-subtitle text-xs uppercase tracking-[0.2em] mb-4 opacity-0" style={{ color: 'var(--text-tertiary)' }}>
                Full-Stack Intern · Startup Systems Builder
              </p>
              <h1 className="hero-name text-5xl md:text-7xl font-bold mb-6 tracking-tight opacity-0">
                <span className="text-gradient">S Adityan</span>
              </h1>

              <p className="hero-subtitle text-xl md:text-2xl mb-4 leading-relaxed opacity-0" style={{ color: 'var(--text-secondary)' }}>
                Full-Stack Engineer & AI Developer crafting scalable systems and intelligent applications.
              </p>

              <p className="hero-subtitle text-sm md:text-base mb-5 opacity-0" style={{ color: 'var(--text-tertiary)' }}>
                Building startup-ready products with modern frontend systems, scalable backends, and motion-rich digital experiences.
              </p>

              <div className="mb-6 w-full max-w-2xl">
                <HeroNarrativeCluster />
              </div>

              <div ref={ctaRef} className="flex flex-wrap gap-4 mb-10">
                <MagneticButton href="/projects" className="btn-primary" strength={0.15}>
                  View Work
                </MagneticButton>
                <MagneticButton href="#contact" className="btn-secondary" strength={0.15}>
                  Get in Touch
                </MagneticButton>
              </div>

              <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-xl">
                {[
                  { value: '6+', label: 'Projects' },
                  { value: '25+', label: 'Technologies' },
                  { value: '14', label: 'Certifications' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-cyan-400/10 bg-slate-900/30 px-4 py-3 opacity-0">
                    <div className="text-2xl font-bold text-gradient">{stat.value}</div>
                    <div className="text-xs mt-1 uppercase tracking-[0.14em]" style={{ color: 'var(--text-tertiary)' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="anime-reveal space-y-4">
              <div className="rounded-2xl border border-cyan-400/15 bg-slate-900/35 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-cyan-300/80">Launch Pattern</p>
                <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Discover → Design → Ship → Scale with product-speed cycles and measurable outcomes.
                </p>
              </div>
              <div className="rounded-2xl border border-indigo-400/15 bg-indigo-500/5 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-indigo-300/80">Product Outcome</p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {[
                    { label: 'Build rhythm', value: 'Weekly' },
                    { label: 'Delivery mode', value: 'Ship-first' },
                    { label: 'Scope', value: 'Startup web' },
                    { label: 'Focus', value: 'Growth + scale' },
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg border border-indigo-300/20 bg-black/20 p-3">
                      <p className="text-[10px] uppercase tracking-[0.12em]" style={{ color: 'var(--text-tertiary)' }}>{item.label}</p>
                      <p className="mt-1 text-sm font-semibold text-indigo-200">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <NarrativeAxisSection steps={storySteps} />

      <ServiceConstellation items={whatIDo} quote={guidingQuote} />

      <ExperienceSpectrum items={experiences} spotlight={ambalsoftSpotlight} />

      <TechStackGalaxy skills={skills} />

      <CertificationNebula priority={priorityCertifications} additional={additionalCertifications} />

      <ContactRelay socials={socials} />
    </div>
  );
}
