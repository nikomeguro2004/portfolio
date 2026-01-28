'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Step {
  title: string;
  content: string;
  highlight?: string;
  icon?: React.ReactNode;
  metric?: { value: string; label: string };
  weight?: number; // 1. WEIGHTED DURATION: Steps can have different scroll weights
  animationType?: 'slide' | 'scale' | 'fade' | 'snap'; // 4. PERSONALITY per step
}

interface ScrollPinnedSectionProps {
  children?: React.ReactNode;
  steps: Step[];
  className?: string;
  title?: string;
  subtitle?: string;
}

export default function ScrollPinnedSection({ 
  children, 
  steps, 
  className = '',
  title,
  subtitle,
}: ScrollPinnedSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  // 9. MOBILE DETECTION: Respect device context
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  useEffect(() => {
    if (!containerRef.current || !stepsRef.current || !pinnedRef.current) return;
    
    const container = containerRef.current;
    const stepElements = stepsRef.current.querySelectorAll('.pinned-step');
    
    // 1. WEIGHTED DURATION: Calculate total based on step weights
    const totalWeight = steps.reduce((sum, step) => sum + (step.weight || 1), 0);
    // 9. MOBILE: Reduced pin duration
    const scrollMultiplier = isMobile ? 60 : 100;
    const totalScrollLength = totalWeight * scrollMultiplier;
    
    // Main pin trigger with 7. ASYMMETRIC SCRUB
    const pinTrigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: `+=${totalScrollLength}%`,
      pin: pinnedRef.current,
      pinSpacing: true,
      scrub: isMobile ? 0.5 : 1.5, // 9. Faster scrub on mobile
      onUpdate: (self) => {
        // 2. ELASTIC CATCH-UP: Progress bar with lag + overshoot
        if (progressRef.current) {
          gsap.to(progressRef.current, {
            height: `${self.progress * 100}%`,
            duration: 0.4,
            ease: 'power3.out',
            overwrite: true,
          });
        }
        
        // Calculate active step based on weighted positions
        let accumulatedWeight = 0;
        let newActiveStep = 0;
        for (let i = 0; i < steps.length; i++) {
          const stepWeight = steps[i].weight || 1;
          const stepEnd = (accumulatedWeight + stepWeight) / totalWeight;
          if (self.progress < stepEnd) {
            newActiveStep = i;
            break;
          }
          accumulatedWeight += stepWeight;
          newActiveStep = i;
        }
        
        // 8. PEAK MOMENT: Stall at critical step (index 2 or middle)
        const peakIndex = Math.floor(steps.length / 2);
        const isPeakZone = newActiveStep === peakIndex && self.progress > 0.4 && self.progress < 0.6;
        
        if (isPeakZone && progressRef.current) {
          // Brief intensity spike
          gsap.to(progressRef.current, {
            boxShadow: '0 0 20px rgba(56, 189, 248, 0.8)',
            duration: 0.2,
          });
        }
        
        setActiveStep(newActiveStep);
      },
    });
    
    // Animate each step with 4. PERSONALITY
    stepElements.forEach((step, index) => {
      const stepWeight = steps[index].weight || 1;
      let accumulatedWeight = 0;
      for (let i = 0; i < index; i++) {
        accumulatedWeight += steps[i].weight || 1;
      }
      
      const stepStart = accumulatedWeight / totalWeight;
      const stepEnd = (accumulatedWeight + stepWeight) / totalWeight;
      
      ScrollTrigger.create({
        trigger: container,
        start: `${stepStart * 100}% top`,
        end: `${stepEnd * 100}% top`,
        onEnter: () => animateStepIn(step, index),
        onEnterBack: () => animateStepIn(step, index),
        onLeave: () => animateStepOut(step),
        onLeaveBack: () => animateStepOut(step),
      });
    });
    
    // 4. ANIMATION PERSONALITIES for each step
    const animateStepIn = (step: Element, index: number) => {
      const animationType = steps[index].animationType || 'slide';
      const content = step.querySelector('.step-content');
      const highlight = step.querySelector('.step-highlight');
      const metric = step.querySelector('.step-metric');
      
      // Dim others
      gsap.to(stepElements, { 
        opacity: 0.2, 
        scale: 0.95,
        y: 10,
        duration: 0.4,
        ease: 'power2.out'
      });
      
      // 5. DIRECTIONAL EMPHASIS: Nudge active step forward
      gsap.to(step, { 
        opacity: 1, 
        scale: 1,
        y: 0,
        x: 4, // Spatial shift for authority
        duration: 0.5,
        ease: 'power2.out'
      });
      
      // 4. Different dominant motion per step type
      if (content) {
        switch (animationType) {
          case 'scale':
            gsap.fromTo(content, 
              { opacity: 0, scale: 0.9 },
              { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' }
            );
            break;
          case 'fade':
            gsap.fromTo(content,
              { opacity: 0 },
              { opacity: 1, duration: 0.6, ease: 'power2.out' }
            );
            break;
          case 'snap':
            // 3. RULE BREAK: Brief blur before snap
            gsap.fromTo(content,
              { opacity: 0, x: -30, filter: 'blur(4px)' },
              { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.3, ease: 'power4.out' }
            );
            break;
          default: // slide
            gsap.fromTo(content, 
              { opacity: 0, x: -20 },
              { opacity: 1, x: 0, duration: 0.4, delay: 0.1 }
            );
        }
      }
      
      if (highlight) {
        gsap.fromTo(highlight,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4, delay: 0.2 }
        );
      }
      
      if (metric) {
        gsap.fromTo(metric,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, delay: 0.3 }
        );
      }
    };
    
    const animateStepOut = (step: Element) => {
      gsap.to(step, {
        opacity: 0.2,
        scale: 0.95,
        x: 0,
        duration: 0.3,
      });
    };
    
    // Initial state
    gsap.set(stepElements[0], { opacity: 1, scale: 1, y: 0 });
    gsap.set(Array.from(stepElements).slice(1), { opacity: 0.2, scale: 0.95, y: 10 });
    
    return () => {
      pinTrigger.kill();
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === container) t.kill();
      });
    };
  }, [steps, isMobile]);
  
  // 1. Calculate weighted min-height
  const totalWeight = steps.reduce((sum, step) => sum + (step.weight || 1), 0);
  const scrollMultiplier = isMobile ? 60 : 100;
  
  return (
    <div 
      ref={containerRef} 
      className={`relative ${className}`}
      style={{ minHeight: `${(totalWeight + 1) * scrollMultiplier}vh` }}
    >
      <div 
        ref={pinnedRef}
        className="min-h-screen flex items-center py-16"
      >
        <div className="container">
          {/* Section header */}
          {(title || subtitle) && (
            <div className="mb-12">
              {subtitle && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-12 bg-linear-to-r from-cyan-400 to-sky-500" />
                  <span className="text-cyan-400 font-medium text-sm uppercase tracking-wider">
                    {subtitle}
                  </span>
                </div>
              )}
              {title && (
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  {title}
                </h2>
              )}
            </div>
          )}
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left side - Steps with progress */}
            <div className="relative">
              {/* Progress track with 2. ELASTIC behavior */}
              <div 
                className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10"
                style={{ height: '100%' }}
              >
                <div 
                  ref={progressRef}
                  className="w-full bg-linear-to-b from-cyan-400 to-sky-500 transition-shadow duration-300"
                  style={{ height: '0%' }}
                />
              </div>
              
              {/* Steps */}
              <div ref={stepsRef} className="space-y-6 pl-12">
                {steps.map((step, index) => (
                  <div 
                    key={index}
                    className="pinned-step relative p-6 rounded-xl transition-all duration-300"
                    style={{
                      // 5. DIRECTIONAL EMPHASIS: Active step shifts spatially
                      background: activeStep === index 
                        ? 'rgba(56, 189, 248, 0.08)' 
                        : 'rgba(56, 189, 248, 0.02)',
                      border: `1px solid ${activeStep === index 
                        ? 'rgba(56, 189, 248, 0.25)' 
                        : 'rgba(56, 189, 248, 0.05)'}`,
                      transform: activeStep === index ? 'translateZ(10px)' : 'none',
                    }}
                  >
                    {/* Step indicator with glow on active */}
                    <div 
                      className="absolute -left-8 top-6 w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300"
                      style={{ 
                        background: activeStep >= index 
                          ? 'linear-gradient(135deg, var(--accent), var(--accent-secondary))'
                          : 'var(--border)',
                        boxShadow: activeStep === index 
                          ? '0 0 20px rgba(56, 189, 248, 0.6)' 
                          : 'none',
                      }}
                    >
                      {activeStep > index && (
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    
                    {/* Step number badge */}
                    <div className="flex items-center gap-3 mb-3">
                      <span 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ 
                          background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
                          color: 'var(--background)'
                        }}
                      >
                        {index + 1}
                      </span>
                      <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                    </div>
                    
                    {/* Step content */}
                    <p className="step-content" style={{ color: 'var(--text-secondary)' }}>
                      {step.content}
                    </p>
                    
                    {/* Optional highlight */}
                    {step.highlight && (
                      <div 
                        className="step-highlight mt-3 px-3 py-2 rounded-lg text-sm font-medium inline-block"
                        style={{ 
                          background: 'rgba(56, 189, 248, 0.1)',
                          color: 'var(--accent)'
                        }}
                      >
                        {step.highlight}
                      </div>
                    )}
                    
                    {/* Optional metric */}
                    {step.metric && (
                      <div className="step-metric mt-4 flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-gradient">
                          {step.metric.value}
                        </span>
                        <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                          {step.metric.label}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right side - Visual content with 6. ANTICIPATION */}
            <div className="lg:sticky lg:top-1/4 flex items-center justify-center min-h-100 relative">
              {/* Ghost of next step for forward momentum */}
              {activeStep < steps.length - 1 && (
                <div 
                  className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none"
                  style={{
                    transform: 'scale(0.95) translateY(20px)',
                    filter: 'blur(2px)',
                  }}
                >
                  {/* Next step preview - faint ghost */}
                </div>
              )}
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
