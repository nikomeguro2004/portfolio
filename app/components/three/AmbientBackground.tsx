'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Seeded random for deterministic particles
function seededRandom(seed: number): () => number {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

// Enhanced vertex shader with phase-shifted noise, violent mouse, depth fade
const ambientVertexShader = `
  uniform float uTime;
  uniform float uScrollVelocity;
  uniform vec2 uMouse;
  uniform float uEnergy;
  
  attribute float aSize;
  attribute float aSpeed;
  attribute float aOpacity;
  attribute float aPhase;
  
  varying float vOpacity;
  varying float vSize;
  varying float vEnergy;
  
  void main() {
    vec3 pos = position;
    
    // 1. Phase-shifted biased noise - NOT pure sine
    float phase = aPhase * 6.28318;
    float scrollTime = uTime + uScrollVelocity * 2.0; // 5. Scroll warps time
    float t = scrollTime * aSpeed * 0.3 + phase;
    
    float n = sin(t + pos.y * 0.8) * cos(t * 0.7 + pos.x * 0.5);
    float m = cos(t * 0.5 + pos.z) * sin(t * 0.9 - pos.y * 0.3);
    
    pos.x += normalize(vec2(n, m)).x * 0.25 * (1.0 + uEnergy * 0.5);
    pos.y += normalize(vec2(m, n)).y * 0.2 * (1.0 + uEnergy * 0.5);
    pos.z += sin(t * 0.4) * 0.15;
    
    // 8. Directional flow
    float flow = sin((pos.x + pos.y) * 1.5 + scrollTime * 0.5);
    pos.z += flow * 0.08;
    
    // 2. Violent mouse interaction - exponential falloff
    vec2 mousePos = uMouse * 4.0;
    float dist = length(pos.xy - mousePos);
    float force = exp(-dist * 1.2) * 1.2;
    
    vec2 dir = normalize(pos.xy - mousePos + 0.001);
    pos.xy += dir * force * 0.6;
    pos.z += force * 0.3;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    // 3. Clamped point size
    gl_PointSize = clamp(aSize * (120.0 / -mvPosition.z), 1.0, 6.0);
    
    // 4. Depth-based opacity fade
    float depthFade = smoothstep(8.0, 2.0, -mvPosition.z);
    vOpacity = aOpacity * depthFade;
    
    // Mouse proximity boost
    vOpacity *= (0.4 + smoothstep(4.0, 0.0, dist) * 0.4);
    
    vSize = aSize;
    vEnergy = force + uEnergy * 0.5;
    
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Enhanced fragment shader with motion-reactive color
const ambientFragmentShader = `
  varying float vOpacity;
  varying float vSize;
  varying float vEnergy;
  
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    
    float alpha = smoothstep(0.5, 0.05, dist) * vOpacity * 0.5;
    
    // 6. Color reacts to motion/energy
    float energy = clamp(vEnergy * 0.5 + vSize * 0.15, 0.0, 1.0);
    vec3 cold = vec3(0.15, 0.55, 0.85);
    vec3 hot = vec3(0.55, 0.9, 1.0);
    vec3 color = mix(cold, hot, energy);
    
    gl_FragColor = vec4(color, alpha);
  }
`;

interface AmbientBackgroundProps {
  particleCount?: number;
}

export default function AmbientBackground({ 
  particleCount = 120
}: AmbientBackgroundProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const scrollVelocityRef = useRef(0);
  const lastScrollRef = useRef(0);
  const timeRef = useRef(0);
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const targetMouseRef = useRef(new THREE.Vector2(0, 0));
  const energyRef = useRef(0);
  const reducedMotionRef = useRef(false);

  // Generate particle attributes
  const { positions, sizes, speeds, opacities, phases, uniforms } = useMemo(() => {
    const random = seededRandom(789);
    
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount);
    const opacities = new Float32Array(particleCount);
    const phases = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (random() - 0.5) * 12;
      positions[i * 3 + 1] = (random() - 0.5) * 10;
      positions[i * 3 + 2] = (random() - 0.5) * 5 - 2;

      sizes[i] = random() * 2.5 + 0.5;
      speeds[i] = random() * 0.6 + 0.4;
      opacities[i] = random() * 0.5 + 0.3;
      phases[i] = random(); // Unique phase per particle
    }

    const uniforms = {
      uTime: { value: 0 },
      uScrollVelocity: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uEnergy: { value: 0 },
    };

    return { positions, sizes, speeds, opacities, phases, uniforms };
  }, [particleCount]);

  // Track scroll velocity with energy accumulation
  useEffect(() => {
    let rafId: number;
    
    const updateScrollVelocity = () => {
      const currentScroll = window.scrollY;
      const velocity = Math.abs(currentScroll - lastScrollRef.current) * 0.015;
      scrollVelocityRef.current = THREE.MathUtils.lerp(scrollVelocityRef.current, velocity, 0.08);
      lastScrollRef.current = currentScroll;
      
      // Energy builds with scroll, decays slowly
      energyRef.current = THREE.MathUtils.lerp(
        energyRef.current, 
        Math.min(velocity * 3, 1), 
        velocity > 0.01 ? 0.15 : 0.02
      );
      
      rafId = requestAnimationFrame(updateScrollVelocity);
    };

    updateScrollVelocity();
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Track mouse with lerp for smooth recovery
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetMouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 7. Proper reduced motion handling
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = mediaQuery.matches;
    
    const handleChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useFrame((_, delta) => {
    if (!materialRef.current) return;
    
    const mat = materialRef.current;
    
    // 7. Reduced motion: slow time, disable interactions
    if (reducedMotionRef.current) {
      timeRef.current += delta * 0.1;
      mat.uniforms.uScrollVelocity.value *= 0.1;
    } else {
      timeRef.current += delta;
    }
    
    // 2. Mouse lerps slowly for calm recovery
    mouseRef.current.lerp(targetMouseRef.current, reducedMotionRef.current ? 0.01 : 0.05);
    
    mat.uniforms.uTime.value = timeRef.current;
    mat.uniforms.uScrollVelocity.value = scrollVelocityRef.current;
    mat.uniforms.uMouse.value.copy(mouseRef.current);
    mat.uniforms.uEnergy.value = energyRef.current;

    // Subtle rotation
    if (pointsRef.current) {
      pointsRef.current.rotation.z += delta * 0.008;
    }
  });

  const positionAttr = useMemo(() => new THREE.BufferAttribute(positions, 3), [positions]);
  const sizeAttr = useMemo(() => new THREE.BufferAttribute(sizes, 1), [sizes]);
  const speedAttr = useMemo(() => new THREE.BufferAttribute(speeds, 1), [speeds]);
  const opacityAttr = useMemo(() => new THREE.BufferAttribute(opacities, 1), [opacities]);
  const phaseAttr = useMemo(() => new THREE.BufferAttribute(phases, 1), [phases]);

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <primitive object={positionAttr} attach="attributes-position" />
        <primitive object={sizeAttr} attach="attributes-aSize" />
        <primitive object={speedAttr} attach="attributes-aSpeed" />
        <primitive object={opacityAttr} attach="attributes-aOpacity" />
        <primitive object={phaseAttr} attach="attributes-aPhase" />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={ambientVertexShader}
        fragmentShader={ambientFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Enhanced wave system with directionality and edge fade
const waveVertexShader = `
  uniform float uTime;
  uniform float uScrollProgress;
  uniform float uEnergy;
  
  varying vec2 vUv;
  varying float vElevation;
  
  void main() {
    vUv = uv;
    
    vec3 pos = position;
    
    // 8. Directional flow waves
    float flow = sin((pos.x + pos.y) * 1.5 + uTime * 0.4);
    
    // Multiple wave frequencies with energy boost
    float energyMult = 1.0 + uEnergy * 0.8;
    float wave1 = sin(pos.x * 2.0 + uTime * 0.5) * 0.12 * energyMult;
    float wave2 = sin(pos.x * 4.0 + pos.y * 2.0 + uTime * 0.3) * 0.06 * energyMult;
    float wave3 = cos(pos.y * 3.0 + uTime * 0.4) * 0.09 * energyMult;
    
    pos.z = wave1 + wave2 + wave3 + flow * 0.08;
    pos.z *= 1.0 + uScrollProgress * 0.6;
    
    vElevation = pos.z;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const waveFragmentShader = `
  varying vec2 vUv;
  varying float vElevation;
  
  void main() {
    vec3 color1 = vec3(0.18, 0.65, 0.9);
    vec3 color2 = vec3(0.12, 0.78, 0.88);
    
    float mixValue = (vElevation + 0.2) * 2.5;
    vec3 color = mix(color1, color2, clamp(mixValue, 0.0, 1.0));
    
    // 8. Edge fade - no visible plane edges
    float edgeX = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x);
    float edgeY = smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.8, vUv.y);
    float edge = edgeX * edgeY;
    
    float alpha = (0.025 + abs(vElevation) * 0.12) * edge;
    
    gl_FragColor = vec4(color, alpha);
  }
`;

export function WaveBackground() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const scrollProgressRef = useRef(0);
  const energyRef = useRef(0);
  const timeRef = useRef(0);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uScrollProgress: { value: 0 },
    uEnergy: { value: 0 },
  }), []);

  // 9. Unified scroll/energy tracking
  useEffect(() => {
    let lastScroll = 0;
    
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgressRef.current = window.scrollY / scrollHeight;
      
      const velocity = Math.abs(window.scrollY - lastScroll) * 0.01;
      energyRef.current = THREE.MathUtils.lerp(energyRef.current, Math.min(velocity * 2, 1), 0.1);
      lastScroll = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((_, delta) => {
    timeRef.current += delta;
    
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = timeRef.current;
      materialRef.current.uniforms.uScrollProgress.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uScrollProgress.value,
        scrollProgressRef.current,
        0.05
      );
      // 9. Waves share energy with particles
      materialRef.current.uniforms.uEnergy.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uEnergy.value,
        energyRef.current,
        0.08
      );
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, -5]}>
      <planeGeometry args={[24, 24, 80, 80]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={waveVertexShader}
        fragmentShader={waveFragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}
