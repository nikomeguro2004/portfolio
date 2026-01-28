'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagneticButton, MagneticCard } from './components/MagneticEffects';

gsap.registerPlugin(ScrollTrigger);

// Skills reframed as "Systems I've Built With" - fewer, more selective
const skills = {
  'Frontend': ['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS'],
  'Backend': ['Node.js', 'FastAPI', 'Python', 'RESTful APIs'],
  'Data': ['PostgreSQL', 'MongoDB', 'Query Optimization'],
  'AI & ML': ['TensorFlow', 'LLM Fine-Tuning', 'RAG Systems'],
  'Cloud': ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
  'Security': ['Web Security', 'SSL/HTTPS', 'Browser Extensions'],
};

const experience = {
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

// Certifications - prioritized, with collapsible extras
const priorityCertifications = [
  'React Essentials', 'Node.js Essentials', 'AWS Essentials',
  'Data Science Fundamentals', 'Python DS & Algorithms', 'Prompt Engineering',
];
const additionalCertifications = [
  'NLP in Python', 'AI Workflow Enterprise', 'Web3 Design & Security',
  'UI/UX with Figma', 'Dart Mastery', 'Playwright Bootcamp',
  'Arduino Bootcamp', 'Bootstrap, JS, React, CSS',
];

// What I Do cards with explicit hierarchy
const whatIDo = [
  { 
    title: 'Product Engineering', 
    desc: 'From concept to deployment, balancing technical excellence with user experience.',
    priority: 'primary' // Dominant card
  },
  { 
    title: 'Full-Stack Development', 
    desc: 'End-to-end applications with React, Next.js, Node.js, and modern cloud infrastructure.',
    priority: 'secondary'
  },
  { 
    title: 'AI & Machine Learning', 
    desc: 'LLM integration, RAG systems, and ML models for real-world applications.',
    priority: 'secondary'
  },
  { 
    title: 'Cloud Architecture', 
    desc: 'Scalable AWS solutions with Docker, Kubernetes, and CI/CD automation.',
    priority: 'tertiary'
  },
  { 
    title: 'Security & DevOps', 
    desc: 'Web security best practices, SSL/HTTPS implementation, and automated deployment pipelines.',
    priority: 'tertiary'
  },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const signaturePauseRef = useRef<HTMLDivElement>(null);
  const [showAllCerts, setShowAllCerts] = useState(false);
  const [hasScrolledOnce, setHasScrolledOnce] = useState(false);

  useEffect(() => {
    // 1. HERO: Selective motion - name and CTA animate, subtitle stays STATIC
    const tl = gsap.timeline({ delay: 0.3 });
    
    // Name: dramatic entrance
    tl.fromTo(nameRef.current, 
      { y: 80, opacity: 0, skewY: 3 }, 
      { y: 0, opacity: 1, skewY: 0, duration: 1.2, ease: 'expo.out' }
    );
    
    // CTA: confident entrance
    tl.fromTo(ctaRef.current?.children || [], 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, stagger: 0.15, duration: 0.6, ease: 'power3.out' }, 
      '-=0.5'
    );
    
    // Subtitle is already visible - NO animation (contrast creates focus)

    // 2. STATS: Animate only on first scroll, not on load (feel earned)
    ScrollTrigger.create({
      trigger: statsRef.current,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        if (!hasScrolledOnce) {
          setHasScrolledOnce(true);
          gsap.fromTo(statsRef.current?.children || [],
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: 'power3.out' }
          );
        }
      }
    });

    // 3. COUNTER-PATTERN: Experience section does NOT fade-up (break the pattern)
    // Other sections use fade-up
    gsap.utils.toArray('.fade-up').forEach((el) => {
      gsap.fromTo(el as Element,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el as Element,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // 4. HORIZONTAL counter-pattern for What I Do cards
    gsap.utils.toArray('.slide-in-left').forEach((el, i) => {
      gsap.fromTo(el as Element,
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          delay: i * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el as Element,
            start: 'top 85%',
          },
        }
      );
    });

    // Stagger children
    gsap.utils.toArray('.stagger-up').forEach((container) => {
      const children = (container as Element).querySelectorAll('.stagger-child');
      gsap.fromTo(children,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container as Element,
            start: 'top 85%',
          },
        }
      );
    });

    // 10. SIGNATURE MOMENT: Deliberate scroll pause at mid-page
    ScrollTrigger.create({
      trigger: signaturePauseRef.current,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => {
        // Brief slowdown effect
        gsap.to(signaturePauseRef.current, {
          scale: 1.02,
          duration: 0.4,
          ease: 'power2.out',
        });
      },
      onLeave: () => {
        gsap.to(signaturePauseRef.current, {
          scale: 1,
          duration: 0.3,
        });
      },
      onEnterBack: () => {
        gsap.to(signaturePauseRef.current, {
          scale: 1.02,
          duration: 0.4,
        });
      },
      onLeaveBack: () => {
        gsap.to(signaturePauseRef.current, {
          scale: 1,
          duration: 0.3,
        });
      }
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [hasScrolledOnce]);

  return (
    <div className="relative" style={{ position: 'relative', zIndex: 10 }}>
      {/* 2. ORBS: Reduced count, semantic meaning */}
      {/* Hero Orb = Identity (single, intentional) */}
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

      {/* Hero */}
      <section ref={heroRef} className="min-h-screen flex items-center pt-12 pb-12">
        <div className="container">
          <div className="max-w-3xl">
            {/* 1. Name: Animated */}
            <h1 ref={nameRef} className="text-5xl md:text-7xl font-bold mb-6 tracking-tight opacity-0">
              <span className="text-gradient">S Adityan</span>
            </h1>
            
            {/* 1. Subtitle: STATIC - no animation (contrast creates focus) */}
            <p 
              className="text-xl md:text-2xl mb-10 leading-relaxed" 
              style={{ color: 'var(--text-secondary)' }}
            >
              Full-Stack Engineer & AI Developer crafting scalable systems and intelligent applications.
            </p>

            {/* 1. CTA: Animated */}
            <div ref={ctaRef} className="flex flex-wrap gap-4 mb-20">
              <MagneticButton href="/projects" className="btn-primary" strength={0.15}>
                View Work
              </MagneticButton>
              <MagneticButton href="#contact" className="btn-secondary" strength={0.15}>
                Get in Touch
              </MagneticButton>
            </div>

            {/* 2. Stats: Animate on first scroll only */}
            <div ref={statsRef} className="flex gap-16">
              {[
                { value: '6+', label: 'Projects' },
                { value: '25+', label: 'Technologies' },
                { value: '14', label: 'Certifications' },
              ].map((stat) => (
                <div key={stat.label} className="opacity-0">
                  <div className="text-3xl font-bold text-gradient">{stat.value}</div>
                  <div className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. What I Do - Cards with visual hierarchy */}
      <section id="about" className="py-16">
        <div className="container">
          <h2 className="fade-up text-3xl font-bold mb-12">What I Do</h2>
          
          <div className="grid md:grid-cols-2 gap-5 max-w-4xl">
            {whatIDo.map((item, index) => {
              const isPrimary = item.priority === 'primary';
              const isTertiary = item.priority === 'tertiary';
              
              return (
                <div 
                  key={item.title} 
                  className="slide-in-left"
                  style={{ 
                    // Primary card spans full width on first row
                    gridColumn: isPrimary && index === 0 ? 'span 2' : 'span 1',
                  }}
                >
                  {/* 9. Magnetic effects: Primary only, others just cards */}
                  {isPrimary ? (
                    <MagneticCard 
                      className="card" 
                      rotationStrength={5}
                      glowColor="rgba(56, 189, 248, 0.4)"
                    >
                      <h3 className="text-xl font-semibold mb-3 text-cyan-400">{item.title}</h3>
                      <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
                      {/* Glow indicator for primary */}
                      <div 
                        className="absolute inset-0 pointer-events-none rounded-2xl"
                        style={{
                          boxShadow: '0 0 30px rgba(56, 189, 248, 0.15)',
                        }}
                      />
                    </MagneticCard>
                  ) : (
                    <div 
                      className="card"
                      style={{
                        opacity: isTertiary ? 0.85 : 1,
                      }}
                    >
                      <h3 className={`font-semibold mb-2 ${isTertiary ? 'text-base text-cyan-400/80' : 'text-lg text-cyan-400'}`}>
                        {item.title}
                      </h3>
                      <p 
                        className={isTertiary ? 'text-sm' : ''} 
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. SIGNATURE MOMENT: Deliberate pause point */}
      <div 
        ref={signaturePauseRef}
        className="py-8 my-4"
        style={{
          background: 'linear-gradient(180deg, transparent, rgba(56, 189, 248, 0.02), transparent)',
        }}
      >
        <div className="container">
          <div className="max-w-xl mx-auto text-center">
            <p 
              className="text-lg italic"
              style={{ color: 'var(--text-tertiary)' }}
            >
              &ldquo;Building systems that work, not systems that impress.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* 5. Experience - NO fade-up (counter-pattern), reduced motion, increased weight */}
      <section id="experience" className="py-16">
        <div className="container">
          {/* No fade-up class - section is static */}
          <h2 className="text-3xl font-bold mb-12">Experience</h2>
          
          {/* No MagneticCard - content dominates, not animation */}
          <div className="max-w-3xl card" style={{ border: '1px solid rgba(56, 189, 248, 0.15)' }}>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
              <div>
                {/* Increased typography weight */}
                <h3 className="text-2xl font-bold">{experience.role}</h3>
                <p className="text-cyan-400 font-semibold text-lg">{experience.company}</p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>{experience.location}</p>
              </div>
              <span className="text-sm mt-2 md:mt-0 font-semibold" style={{ color: 'var(--text-secondary)' }}>
                {experience.period}
              </span>
            </div>
            <ul className="space-y-4">
              {experience.highlights.map((item, i) => (
                <li key={i} className="flex gap-3" style={{ color: 'var(--text-secondary)' }}>
                  <span className="text-cyan-400 mt-0.5 font-bold">→</span>
                  <span className="text-base">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 6. Skills - Reframed as senior systems, reduced badges, stronger categories */}
      <section id="skills" className="py-16">
        <div className="container">
          <h2 className="fade-up text-3xl font-bold mb-4">Systems I Work With</h2>
          <p className="fade-up text-sm mb-12" style={{ color: 'var(--text-tertiary)' }}>
            Production-ready technologies across the stack
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-up">
            {Object.entries(skills).map(([category, items]) => (
              <div key={category} className="stagger-child card">
                {/* Stronger category titles */}
                <h3 className="text-lg font-bold mb-4 text-cyan-400">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span 
                      key={skill} 
                      className="skill-badge"
                      style={{ opacity: 0.7 }} // Reduced opacity for badges
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Certifications - Collapsible, not flat */}
      <section id="certifications" className="py-16">
        <div className="container">
          <h2 className="fade-up text-3xl font-bold mb-12">Certifications</h2>
          
          {/* Priority certifications */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-4xl stagger-up">
            {priorityCertifications.map((cert) => (
              <div 
                key={cert} 
                className="stagger-child px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-white/5"
                style={{ 
                  background: 'rgba(56, 189, 248, 0.04)',
                  border: '1px solid rgba(56, 189, 248, 0.1)',
                  color: 'var(--text-secondary)',
                }}
              >
                {cert}
              </div>
            ))}
          </div>
          
          {/* Collapsible additional certifications */}
          {showAllCerts && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-4xl mt-3">
              {additionalCertifications.map((cert) => (
                <div 
                  key={cert} 
                  className="px-4 py-3 rounded-lg text-sm transition-colors hover:bg-white/5"
                  style={{ 
                    background: 'rgba(56, 189, 248, 0.02)',
                    border: '1px solid rgba(56, 189, 248, 0.05)',
                    color: 'var(--text-tertiary)',
                  }}
                >
                  {cert}
                </div>
              ))}
            </div>
          )}
          
          <button
            onClick={() => setShowAllCerts(!showAllCerts)}
            className="mt-6 text-sm font-medium transition-colors hover:text-cyan-400"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {showAllCerts ? '← Show fewer' : `+ ${additionalCertifications.length} more certifications`}
          </button>
        </div>
      </section>

      {/* 8. Contact - Confident, specific tone */}
      <section id="contact" className="py-16">
        <div className="container">
          <div className="fade-up max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Let&apos;s Connect</h2>
            {/* 8. Specific, confident - not generic */}
            <p className="text-lg mb-10" style={{ color: 'var(--text-secondary)' }}>
              I work best on systems that need to scale, problems that need untangling, and teams that ship.
            </p>
            
            <MagneticButton href="mailto:adihere2000@gmail.com" className="btn-primary mb-10" strength={0.15}>
              adihere2000@gmail.com
            </MagneticButton>

            {/* Social */}
            <div className="flex justify-center gap-6">
              {[
                { href: 'https://github.com/nikomeguro2004', label: 'GitHub', icon: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z' },
                { href: 'https://linkedin.com/in/adityan-suresh-781116256', label: 'LinkedIn', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
                { href: 'https://leetcode.com/u/NikoMeguro/', label: 'LeetCode', icon: 'M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z' },
              ].map((social) => (
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
      </section>

      {/* Footer */}
      <footer className="py-8 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              © {new Date().getFullYear()} S Adityan
            </p>
            <Link 
              href="/projects" 
              className="text-sm hover:text-cyan-400 transition-colors"
              style={{ color: 'var(--text-tertiary)' }}
            >
              View Projects →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
