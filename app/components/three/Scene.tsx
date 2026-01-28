'use client';

import { useEffect, useRef, useState, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ParticleField, NetworkNodes } from './ParticleField';
import { SceneMorph } from './SceneMorph';

gsap.registerPlugin(ScrollTrigger);

interface ScrollSceneProps {
  scrollProgress: number;
  currentSection: number;
  scrollVelocity: number;
}

// IMPROVED: Camera with micro-disorientation, velocity shake, and uncomfortable moment
function CameraController({ scrollProgress, scrollVelocity }: { scrollProgress: number; scrollVelocity: number }) {
  const targetPosition = useRef(new THREE.Vector3(0, 0, 15));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const rollRef = useRef(0);
  const shakeRef = useRef({ x: 0, y: 0 });
  const fovRef = useRef(60);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    // Camera reference for mutations (Three.js requires direct camera manipulation)
    const cam = state.camera as THREE.PerspectiveCamera;
    
    // Camera dolly on scroll
    const cameraY = -scrollProgress * 8;
    const cameraZ = 15 - scrollProgress * 5;
    const cameraX = Math.sin(scrollProgress * Math.PI * 0.5) * 2;
    
    targetPosition.current.set(cameraX, cameraY, Math.max(cameraZ, 6));
    targetLookAt.current.set(0, cameraY - 3, -5);
    
    // VELOCITY IMPULSE: Fast scroll = FOV shift
    const velocityMag = Math.abs(scrollVelocity);
    const targetFov = 60 + velocityMag * 8;
    fovRef.current = THREE.MathUtils.lerp(fovRef.current, targetFov, 0.1);
    cam.fov = fovRef.current;
    cam.updateProjectionMatrix();
    
    // MICRO-DISORIENTATION: Subtle roll based on velocity
    const targetRoll = scrollVelocity * 0.03;
    rollRef.current = THREE.MathUtils.lerp(rollRef.current, targetRoll, 0.05);
    
    // VELOCITY SHAKE: High velocity = camera shake
    const shakeIntensity = velocityMag * 0.02;
    shakeRef.current.x = Math.sin(time * 30) * shakeIntensity;
    shakeRef.current.y = Math.cos(time * 25) * shakeIntensity;
    
    // UNCOMFORTABLE MOMENT at scrollProgress ≈ 0.7
    const uncomfortZone = smoothstep(0.65, 0.7, scrollProgress) * (1 - smoothstep(0.7, 0.75, scrollProgress));
    const uncomfortShake = Math.sin(time * 50) * uncomfortZone * 0.15;
    const uncomfortRoll = Math.sin(time * 8) * uncomfortZone * 0.1;
    
    // Smooth lerp with velocity-based speed
    const lerpSpeed = 0.03 + velocityMag * 0.02;
    cam.position.lerp(targetPosition.current, lerpSpeed);
    
    // Apply shake and disorientation via direct position set
    const shakeX = shakeRef.current.x + uncomfortShake;
    const shakeY = shakeRef.current.y;
    cam.position.set(
      cam.position.x + shakeX,
      cam.position.y + shakeY,
      cam.position.z
    );
    
    // Apply roll
    cam.rotation.z = rollRef.current + uncomfortRoll;
    
    // Smooth look-at
    const lookAtVec = new THREE.Vector3();
    lookAtVec.copy(targetLookAt.current);
    cam.lookAt(lookAtVec);
    
    // Re-apply roll after lookAt (which resets z rotation)
    cam.rotation.z = rollRef.current + uncomfortRoll;
  });
  
  return null;
}

// Helper function
function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// IMPROVED: Color with threshold accents at section boundaries
function useScrollColors(scrollProgress: number, scrollVelocity: number) {
  return useMemo(() => {
    // Color milestones at 0%, 33%, 66%, 100%
    const colors = [
      { primary: '#38BDF8', secondary: '#22D3EE' }, // Hero - cyan
      { primary: '#8B5CF6', secondary: '#A78BFA' }, // About - purple
      { primary: '#10B981', secondary: '#34D399' }, // Projects - green
      { primary: '#F59E0B', secondary: '#FBBF24' }, // Experience - amber
    ];
    
    const index = Math.min(Math.floor(scrollProgress * 4), 3);
    const nextIndex = Math.min(index + 1, 3);
    const localProgress = (scrollProgress * 4) % 1;
    
    // COLOR THRESHOLD ACCENTS: Flash at boundaries
    const atBoundary = localProgress < 0.1 || localProgress > 0.9;
    const boundaryFlash = atBoundary ? 0.3 : 0;
    
    const primary = new THREE.Color(colors[index].primary).lerp(
      new THREE.Color(colors[nextIndex].primary),
      localProgress
    );
    const secondary = new THREE.Color(colors[index].secondary).lerp(
      new THREE.Color(colors[nextIndex].secondary),
      localProgress
    );
    
    // Add white flash at boundaries
    if (boundaryFlash > 0) {
      primary.lerp(new THREE.Color('#FFFFFF'), boundaryFlash * Math.abs(scrollVelocity));
      secondary.lerp(new THREE.Color('#FFFFFF'), boundaryFlash * Math.abs(scrollVelocity) * 0.5);
    }
    
    return { primary, secondary, atBoundary };
  }, [scrollProgress, scrollVelocity]);
}

// IMPROVED: Reactive lighting that responds to velocity
function ReactiveLighting({ 
  scrollProgress, 
  scrollVelocity, 
  colors 
}: { 
  scrollProgress: number; 
  scrollVelocity: number; 
  colors: { primary: THREE.Color; secondary: THREE.Color; atBoundary: boolean };
}) {
  const light1Ref = useRef<THREE.PointLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const velocityMag = Math.abs(scrollVelocity);
    
    // REACTIVE LIGHTING: Intensity tied to scroll velocity
    const baseIntensity1 = 0.5 + velocityMag * 0.8;
    const baseIntensity2 = 0.3 + velocityMag * 0.5;
    
    if (light1Ref.current) {
      // Flickering intensity at high velocity
      const flicker = velocityMag > 0.3 ? Math.sin(time * 20) * 0.2 : 0;
      light1Ref.current.intensity = baseIntensity1 + flicker;
      light1Ref.current.position.x = 10 + scrollProgress * 5 + Math.sin(time * 0.5) * 2;
      light1Ref.current.color.copy(colors.primary);
    }
    
    if (light2Ref.current) {
      light2Ref.current.intensity = baseIntensity2;
      light2Ref.current.position.y = -10 - scrollProgress * 5;
      light2Ref.current.color.copy(colors.secondary);
    }
    
    if (ambientRef.current) {
      // Ambient dims during high velocity (dramatic effect)
      ambientRef.current.intensity = 0.2 + scrollProgress * 0.1 - velocityMag * 0.1;
    }
  });
  
  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.2} />
      <pointLight 
        ref={light1Ref}
        position={[10, 10, 10]} 
        intensity={0.5} 
      />
      <pointLight 
        ref={light2Ref}
        position={[-10, -10, -10]} 
        intensity={0.3} 
      />
    </>
  );
}

// IMPROVED: Environment with rotation based on scroll
function RotatingEnvironment({ scrollProgress }: { scrollProgress: number }) {
  const envRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (envRef.current) {
      // ENVIRONMENT ROTATION: Passive but present
      envRef.current.rotation.y = scrollProgress * Math.PI * 0.5;
    }
  });
  
  return (
    <group ref={envRef}>
      <Environment preset="night" />
    </group>
  );
}

// REACTION LAYERS: Different response speeds
function ReactionLayers({ 
  scrollProgress, 
  scrollVelocity, 
  currentSection 
}: ScrollSceneProps) {
  const foregroundRef = useRef<THREE.Group>(null);
  const midgroundRef = useRef<THREE.Group>(null);
  const backgroundRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const velocityMag = Math.abs(scrollVelocity);
    
    // FOREGROUND: Violent, immediate response
    if (foregroundRef.current) {
      foregroundRef.current.position.y = scrollVelocity * 2;
      foregroundRef.current.rotation.z = scrollVelocity * 0.1;
    }
    
    // MIDGROUND: Elastic, delayed response
    if (midgroundRef.current) {
      const elasticY = Math.sin(state.clock.elapsedTime * 2 + scrollProgress * 10) * velocityMag * 0.5;
      midgroundRef.current.position.y = elasticY;
    }
    
    // BACKGROUND: Slow, atmospheric drift
    if (backgroundRef.current) {
      backgroundRef.current.position.y = -scrollProgress * 2;
      backgroundRef.current.rotation.y = scrollProgress * 0.2;
    }
  });
  
  return (
    <>
      {/* FOREGROUND LAYER - Violent response */}
      <group ref={foregroundRef}>
        <ParticleField 
          count={800} 
          scrollProgress={scrollProgress}
          currentSection={currentSection}
          scrollVelocity={scrollVelocity}
        />
      </group>
      
      {/* MIDGROUND LAYER - Elastic response */}
      <group ref={midgroundRef}>
        <NetworkNodes 
          scrollProgress={scrollProgress}
          nodeCount={50}
          scrollVelocity={scrollVelocity}
        />
      </group>
      
      {/* BACKGROUND LAYER - Slow drift */}
      <group ref={backgroundRef}>
        <ParticleField 
          count={1200} 
          scrollProgress={scrollProgress * 0.5}
          currentSection={currentSection}
          scrollVelocity={scrollVelocity * 0.3}
        />
      </group>
    </>
  );
}

// SCENEMORPHSIGNATURE: Collapse/reformation beat
function SceneMorphWithSignature({ 
  scrollProgress, 
  morphState,
}: { 
  scrollProgress: number; 
  morphState: 'sphere' | 'network' | 'grid' | 'lines';
}) {
  const groupRef = useRef<THREE.Group>(null);
  const signatureRef = useRef({ triggered: false, progress: 0 });
  
  useFrame(() => {
    if (!groupRef.current) return;
    
    // SIGNATURE BEAT: Dramatic collapse at scrollProgress ≈ 0.5
    const signatureZone = scrollProgress > 0.48 && scrollProgress < 0.52;
    
    if (signatureZone && !signatureRef.current.triggered) {
      signatureRef.current.triggered = true;
      signatureRef.current.progress = 0;
    }
    
    if (signatureRef.current.triggered && signatureRef.current.progress < 1) {
      signatureRef.current.progress += 0.02;
      
      // Collapse then reform
      const p = signatureRef.current.progress;
      const collapsePhase = p < 0.5 ? p * 2 : 1;
      const reformPhase = p > 0.5 ? (p - 0.5) * 2 : 0;
      
      // Scale collapse
      const scale = 1 - collapsePhase * 0.8 + reformPhase * 0.8;
      groupRef.current.scale.setScalar(scale);
      
      // Spin during collapse
      groupRef.current.rotation.y += collapsePhase * 0.3;
      groupRef.current.rotation.x = Math.sin(p * Math.PI) * 0.5;
    }
    
    // Reset trigger when leaving zone
    if (!signatureZone && signatureRef.current.progress >= 1) {
      signatureRef.current.triggered = false;
    }
    
    // Normal position tied to scroll
    groupRef.current.position.y = -scrollProgress * 15;
  });
  
  return (
    <group ref={groupRef}>
      <SceneMorph 
        scrollProgress={scrollProgress}
        targetState={morphState}
      />
    </group>
  );
}

function ScrollScene({ scrollProgress, currentSection, scrollVelocity }: ScrollSceneProps) {
  const colors = useScrollColors(scrollProgress, scrollVelocity);
  
  // Morph state based on section
  const morphState = useMemo(() => {
    const states: ('sphere' | 'network' | 'grid' | 'lines')[] = ['sphere', 'network', 'grid', 'lines'];
    return states[Math.min(currentSection, states.length - 1)];
  }, [currentSection]);
  
  return (
    <>
      <CameraController scrollProgress={scrollProgress} scrollVelocity={scrollVelocity} />
      
      {/* REACTION LAYERS: Different response at different depths */}
      <ReactionLayers 
        scrollProgress={scrollProgress}
        currentSection={currentSection}
        scrollVelocity={scrollVelocity}
      />
      
      {/* SCENEMORPHWITHSIGNATURE: Dramatic beat */}
      <SceneMorphWithSignature 
        scrollProgress={scrollProgress}
        morphState={morphState}
      />
      
      {/* REACTIVE LIGHTING */}
      <ReactiveLighting 
        scrollProgress={scrollProgress}
        scrollVelocity={scrollVelocity}
        colors={colors}
      />
      
      {/* ROTATING ENVIRONMENT */}
      <RotatingEnvironment scrollProgress={scrollProgress} />
    </>
  );
}

export function Scene() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let velocityTimeout: ReturnType<typeof setTimeout>;
    
    // Create master scroll trigger for the entire page
    const scrollTrigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5, // Smooth scrub for Three.js sync
      onUpdate: (self) => {
        setScrollProgress(self.progress);
        
        // Calculate velocity
        const currentScrollY = window.scrollY;
        const velocity = (currentScrollY - lastScrollY) / 100;
        setScrollVelocity(velocity);
        lastScrollY = currentScrollY;
        
        // Decay velocity
        clearTimeout(velocityTimeout);
        velocityTimeout = setTimeout(() => {
          setScrollVelocity(0);
        }, 150);
      },
    });
    
    // Section detection with ScrollTrigger
    const sections = document.querySelectorAll('section[id], section[data-section]');
    const sectionTriggers: ScrollTrigger[] = [];
    
    sections.forEach((section, index) => {
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setCurrentSection(index),
        onEnterBack: () => setCurrentSection(index),
      });
      sectionTriggers.push(trigger);
    });
    
    return () => {
      scrollTrigger.kill();
      sectionTriggers.forEach(t => t.kill());
      clearTimeout(velocityTimeout);
    };
  }, []);
  
  // Visibility-based frame loop control for performance
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.5]}
        frameloop={isVisible ? 'always' : 'demand'}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ScrollScene 
            scrollProgress={scrollProgress}
            currentSection={currentSection}
            scrollVelocity={scrollVelocity}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Scene;
