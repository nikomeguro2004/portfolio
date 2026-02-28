'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { animate, stagger } from 'animejs';
import { useExperience } from './ClientLayout';

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const logoIconRef = useRef<HTMLDivElement>(null);
  const logoTextRef = useRef<HTMLSpanElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const activeIndicatorRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [scrollState, setScrollState] = useState({ y: 0, velocity: 0, direction: 'up' as 'up' | 'down' });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const { scrollVelocity } = useExperience();

  // 1. INTENTIONAL LOCK-IN ENTRANCE: Nav anchors the page with subtle scale
  useEffect(() => {
    if (navRef.current) {
      animate(navRef.current, {
        translateY: [-60, 0],
        scaleY: [0.9, 1],
        opacity: [0, 1],
        duration: 860,
        ease: 'out(4)',
        delay: 280,
      });
    }
  }, []);

  // 2. PROGRESSIVE DENSITY + 9. AUTO-HIDE: Interpolated scroll styles
  useEffect(() => {
    let ticking = false;
    let hideTimeout: ReturnType<typeof setTimeout>;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const velocity = currentY - lastScrollY.current;
          const direction = velocity > 0 ? 'down' : 'up';
          
          setScrollState({ y: currentY, velocity, direction });
          
          // 9. AUTO-HIDE on fast scroll down, snap back on scroll up
          if (direction === 'down' && Math.abs(velocity) > 10 && currentY > 200) {
            clearTimeout(hideTimeout);
            hideTimeout = setTimeout(() => setIsNavVisible(false), 100);
          } else if (direction === 'up' || currentY < 100) {
            clearTimeout(hideTimeout);
            setIsNavVisible(true);
          }
          
          lastScrollY.current = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(hideTimeout);
    };
  }, []);

  // 2. Calculate progressive styles based on scroll
  const scrollProgress = Math.min(scrollState.y / 120, 1);
  const backgroundOpacity = 0.95 * scrollProgress;
  const blurAmount = 16 * scrollProgress;
  const borderOpacity = scrollProgress > 0.8 ? (scrollProgress - 0.8) * 5 : 0;
  
  // 8. NAV REACTS TO SCROLL VELOCITY: Subtle parallax drift
  const navDrift = isNavVisible ? scrollVelocity * 2 : 0;

  // 7. Smooth section jump for premium navigation flow
  const scrollToSection = useCallback((id: string) => {
    setIsMobileMenuOpen(false);
    if (pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  }, [pathname]);

  // 5. LOGO HOVER: Layered motion - icon shifts, text lags behind
  const handleLogoEnter = () => {
    if (logoIconRef.current && logoTextRef.current) {
      animate(logoIconRef.current, { rotate: 8, scale: 1.08, duration: 260, ease: 'out(3)' });
      animate(logoTextRef.current, { translateX: 4, duration: 320, ease: 'out(3)', delay: 40 });
    }
  };

  const handleLogoLeave = () => {
    if (logoIconRef.current && logoTextRef.current) {
      animate(logoIconRef.current, { rotate: 0, scale: 1, duration: 360, ease: 'out(4)' });
      animate(logoTextRef.current, { translateX: 0, duration: 260, ease: 'out(3)' });
    }
  };

  // 3. NAV LINK INTERACTION: Micro underline drift + directional hover
  const handleLinkEnter = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    const target = e.currentTarget;
    const underline = target.querySelector('.link-underline') as HTMLElement;
    
    animate(target, { translateY: -2, color: 'var(--text-primary)', duration: 180, ease: 'out(3)' });
    
    if (underline) {
      animate(underline, { scaleX: 1, opacity: 1, duration: 240, ease: 'out(3)' });
    }
  };

  const handleLinkLeave = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    const target = e.currentTarget;
    const underline = target.querySelector('.link-underline') as HTMLElement;
    const isActive = target.getAttribute('data-active') === 'true';
    
    animate(target, {
      translateY: 0,
      color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
      duration: 240,
      ease: 'out(3)',
    });
    
    if (underline && !isActive) {
      animate(underline, { scaleX: 0, opacity: 0, duration: 180, ease: 'in(3)' });
    }
  };

  // Click: Snap hard interaction
  const handleLinkClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    const target = e.currentTarget;
    const underline = target.querySelector('.link-underline') as HTMLElement;
    
    if (underline) {
      animate(underline, {
        scaleX: [1, 1.2, 1],
        duration: 240,
        ease: 'out(4)',
      });
    }
  };

  // 6. MOBILE MENU: Staggered reveal with hierarchy
  useEffect(() => {
    if (mobileMenuRef.current && isMobileMenuOpen) {
      const items = mobileMenuRef.current.querySelectorAll('.mobile-nav-item');
      animate(items, {
        translateY: [20, 0],
        translateX: [-10, 0],
        opacity: [0, 1],
        delay: stagger(80),
        duration: 360,
        ease: 'out(3)',
      });
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
  ];
  
  const isProjectsPage = pathname === '/projects';

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isNavVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
      style={{
        padding: `${1 - scrollProgress * 0.25}rem 0`,
        background: `rgba(11, 15, 20, ${backgroundOpacity})`,
        backdropFilter: scrollProgress > 0.1 ? `blur(${blurAmount}px)` : 'none',
        borderBottom: borderOpacity > 0 ? `1px solid rgba(56, 189, 248, ${borderOpacity * 0.15})` : 'none',
        transform: `translateY(${navDrift}px)`,
      }}
    >
      <div className="container">
        <div className="flex items-center justify-between">
          {/* 5. LOGO with layered hover animation */}
          <Link 
            href="/" 
            className="flex items-center gap-2 group"
            onMouseEnter={handleLogoEnter}
            onMouseLeave={handleLogoLeave}
          >
            <div 
              ref={logoIconRef}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold text-white relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
                boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)',
              }}
            >
              <span className="relative z-10">A</span>
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)',
                }}
              />
            </div>
            <span 
              ref={logoTextRef}
              className="text-lg font-bold tracking-tight hidden sm:block"
            >
              Adityan
            </span>
          </Link>

          {/* Nav Links - Desktop with magnetic interactions */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button 
                key={link.id}
                onClick={(e) => { handleLinkClick(e); scrollToSection(link.id); }}
                onMouseEnter={handleLinkEnter}
                onMouseLeave={handleLinkLeave}
                className="nav-link-enhanced px-4 py-2 relative font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                <span className="relative z-10">{link.label}</span>
                <span className="link-underline absolute bottom-1 left-4 right-4 h-0.5 bg-linear-to-r from-cyan-400 to-sky-500 transform scale-x-0 origin-left opacity-0 rounded-full" />
              </button>
            ))}
            
            {/* 4. ACTIVE STATE: Projects link with animated spatial marker */}
            <Link 
              href="/projects" 
              className={`nav-link-enhanced px-4 py-2 relative font-medium ${isProjectsPage ? 'text-cyan-400' : ''}`}
              style={{ color: isProjectsPage ? 'var(--accent)' : 'var(--text-secondary)' }}
              data-active={isProjectsPage}
              onMouseEnter={handleLinkEnter}
              onMouseLeave={handleLinkLeave}
            >
              <span className="relative z-10">Projects</span>
              <span className="link-underline absolute bottom-1 left-4 right-4 h-0.5 bg-linear-to-r from-cyan-400 to-sky-500 transform scale-x-0 origin-left opacity-0 rounded-full" />
              {isProjectsPage && (
                <span 
                  ref={activeIndicatorRef}
                  className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full animate-pulse"
                  style={{
                    background: 'linear-gradient(90deg, var(--accent), var(--accent-secondary))',
                    boxShadow: '0 0 10px rgba(56, 189, 248, 0.6)',
                  }}
                />
              )}
            </Link>
            
            <button 
              onClick={(e) => { handleLinkClick(e); scrollToSection('contact'); }}
              className="btn-primary ml-3 text-sm py-2 px-5 relative overflow-hidden group"
            >
              <span className="relative z-10">Contact</span>
              <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* 6. Mobile Menu - Staggered reveal with hierarchy, CTA last */}
        {isMobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            className="md:hidden mt-4 py-4 border-t"
            style={{ borderColor: 'var(--border)' }}
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link, index) => (
                <button 
                  key={link.id}
                  onClick={() => scrollToSection(link.id)} 
                  className="mobile-nav-item nav-link text-left py-3 px-3 rounded-lg hover:bg-white/5 transition-colors"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  {link.label}
                </button>
              ))}
              <Link 
                href="/projects" 
                className={`mobile-nav-item nav-link py-3 px-3 rounded-lg hover:bg-white/5 transition-colors ${isProjectsPage ? 'text-cyan-400 bg-cyan-400/5' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Projects
              </Link>
              {/* Contact CTA appears last with delay */}
              <button 
                onClick={() => scrollToSection('contact')} 
                className="mobile-nav-item btn-primary mt-3 text-sm py-3 px-4 w-full"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
