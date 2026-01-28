'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
  count?: number;
  scrollProgress?: number;
  currentSection?: number;
  scrollVelocity?: number;
}

// Seeded random for deterministic results
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// IMPROVED: Vertex shader with time discontinuities, phase explosion, energy-based sizing
const vertexShader = `
  uniform float uTime;
  uniform float uScrollProgress;
  uniform float uSection;
  uniform float uScrollVelocity;
  uniform float uShockProgress;
  
  attribute float aScale;
  attribute float aRandomness;
  attribute float aPhase;
  attribute float aEnergy;
  
  varying vec3 vPosition;
  varying float vAlpha;
  varying float vEnergy;
  varying float vDepth;
  
  // Noise function for organic movement
  float noise(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
  }
  
  void main() {
    vPosition = position;
    vEnergy = aEnergy;
    
    vec3 pos = position;
    
    // TIME DISCONTINUITIES: Each particle has its own time stream
    float localTime = uTime + aRandomness * 4.0 + sin(uTime * 0.2 + aPhase) * 0.5;
    
    // SPATIAL PHASE EXPLOSION: Particles explode from center based on phase
    float phaseOffset = aPhase * 6.28318;
    float explosionWave = sin(uScrollProgress * 3.14159 + phaseOffset);
    float radialDist = length(pos.xz);
    vec3 explosionDir = normalize(pos + vec3(0.001));
    pos += explosionDir * explosionWave * 2.0 * (1.0 - aRandomness * 0.5);
    
    // Organic wave motion with local time
    float wave = sin(pos.x * 0.5 + localTime * 0.3) * cos(pos.z * 0.5 + localTime * 0.2);
    pos.y += wave * 0.4 * (1.0 - uScrollProgress * 0.3);
    
    // Velocity-responsive turbulence
    float velocityInfluence = abs(uScrollVelocity) * 3.0;
    pos.x += sin(localTime * 2.0 + aRandomness * 10.0) * 0.15 * (1.0 + velocityInfluence);
    pos.z += cos(localTime * 1.5 + aRandomness * 10.0) * 0.15 * (1.0 + velocityInfluence);
    
    // SIGNATURE SHOCK MOMENT at scrollProgress ≈ 0.45
    float shockZone = smoothstep(0.4, 0.45, uScrollProgress) * (1.0 - smoothstep(0.45, 0.5, uScrollProgress));
    float shockWave = sin(radialDist * 3.0 - uTime * 8.0) * shockZone * 2.0;
    pos += explosionDir * shockWave;
    
    // SEMANTIC ROTATION: Tie to scroll progress meaningfully
    float rotAngle = uScrollProgress * 1.5 + aPhase * 0.5;
    float cosR = cos(rotAngle);
    float sinR = sin(rotAngle);
    vec3 rotatedPos = pos;
    rotatedPos.x = pos.x * cosR - pos.z * sinR;
    rotatedPos.z = pos.x * sinR + pos.z * cosR;
    pos = rotatedPos;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // ENERGY-BASED SIZE: High energy = larger, more visible
    float energySize = 1.0 + aEnergy * 0.8;
    float velocitySize = 1.0 + velocityInfluence * 0.3;
    float shockSize = 1.0 + shockZone * 1.5;
    float sizeMultiplier = energySize * velocitySize * shockSize;
    
    gl_PointSize = aScale * sizeMultiplier * (300.0 / -mvPosition.z);
    gl_PointSize = clamp(gl_PointSize, 1.0, 20.0);
    
    vAlpha = 0.5 + sin(localTime + aRandomness * 6.28) * 0.25;
    vAlpha *= (1.0 - abs(pos.y) * 0.04);
    vAlpha *= 0.8 + aEnergy * 0.4;
    
    vDepth = -mvPosition.z;
  }
`;

// IMPROVED: Fragment shader with energy-based color
const fragmentShader = `
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uAccentColor;
  uniform float uScrollProgress;
  uniform float uScrollVelocity;
  
  varying vec3 vPosition;
  varying float vAlpha;
  varying float vEnergy;
  varying float vDepth;
  
  void main() {
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    if (dist > 0.5) discard;
    
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    alpha *= vAlpha;
    
    // ENERGY-BASED COLOR: High energy particles glow differently
    float colorMix = (vPosition.y + 10.0) / 20.0;
    colorMix = clamp(colorMix + uScrollProgress * 0.3, 0.0, 1.0);
    vec3 baseColor = mix(uColor1, uColor2, colorMix);
    
    // High energy particles get accent color
    vec3 color = mix(baseColor, uAccentColor, vEnergy * 0.6);
    
    // Velocity-responsive brightness
    float velocityGlow = abs(uScrollVelocity) * 0.3;
    color += vec3(velocityGlow * 0.1, velocityGlow * 0.15, velocityGlow * 0.2);
    
    // Core glow effect
    float glow = 1.0 - dist * 2.0;
    color += vec3(0.1, 0.2, 0.3) * glow * (1.0 + vEnergy);
    
    // Depth fade for atmosphere
    float depthFade = clamp(1.0 - vDepth * 0.02, 0.5, 1.0);
    alpha *= depthFade;
    
    gl_FragColor = vec4(color, alpha * 0.85);
  }
`;

// Generate particle data with additional attributes
function generateParticleData(count: number) {
  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  const randomness = new Float32Array(count);
  const phases = new Float32Array(count);
  const energies = new Float32Array(count);
  
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const radius = 8 + seededRandom(i * 1.1) * 12;
    const theta = seededRandom(i * 2.2) * Math.PI * 2;
    const phi = Math.acos(2 * seededRandom(i * 3.3) - 1);
    
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.5 - 2;
    positions[i3 + 2] = radius * Math.cos(phi);
    
    scales[i] = 0.5 + seededRandom(i * 4.4) * 1.5;
    randomness[i] = seededRandom(i * 5.5);
    phases[i] = seededRandom(i * 6.6); // Phase for staggered effects
    energies[i] = seededRandom(i * 7.7); // Energy level 0-1
  }
  
  return { positions, scales, randomness, phases, energies };
}

const particleData2000 = generateParticleData(2000);
const particleData1500 = generateParticleData(1500);

export function ParticleField({ 
  count = 2000, 
  scrollProgress = 0, 
  currentSection = 0,
  scrollVelocity = 0 
}: ParticleFieldProps) {
  const meshRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const { positions, scales, randomness, phases, energies } = useMemo(() => {
    if (count <= 1500) return particleData1500;
    return particleData2000;
  }, [count]);
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uScrollProgress: { value: 0 },
    uSection: { value: 0 },
    uScrollVelocity: { value: 0 },
    uShockProgress: { value: 0 },
    uColor1: { value: new THREE.Color('#38BDF8') },
    uColor2: { value: new THREE.Color('#22D3EE') },
    uAccentColor: { value: new THREE.Color('#F59E0B') },
  }), []);
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Smooth scroll progress transition
      materialRef.current.uniforms.uScrollProgress.value += 
        (scrollProgress - materialRef.current.uniforms.uScrollProgress.value) * 0.05;
      
      // Smooth velocity with decay
      materialRef.current.uniforms.uScrollVelocity.value += 
        (scrollVelocity - materialRef.current.uniforms.uScrollVelocity.value) * 0.1;
      
      materialRef.current.uniforms.uSection.value = currentSection;
      
      // Calculate shock progress for signature moment
      const currentProg = materialRef.current.uniforms.uScrollProgress.value;
      const shockIntensity = currentProg > 0.4 && currentProg < 0.5 ? 
        Math.sin((currentProg - 0.4) * Math.PI * 10) : 0;
      materialRef.current.uniforms.uShockProgress.value = shockIntensity;
    }
    
    // SEMANTIC ROTATION tied to scroll (removed decorative rotation)
    if (meshRef.current) {
      // Only subtle breathing, main rotation is in shader
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
    }
  });
  
  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aRandomness" args={[randomness, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
        <bufferAttribute attach="attributes-aEnergy" args={[energies, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

interface NetworkNodesProps {
  scrollProgress?: number;
  nodeCount?: number;
  scrollVelocity?: number;
}

function generateNetworkData(nodeCount: number) {
  const nodePositions: THREE.Vector3[] = [];
  const linePositions: number[] = [];
  
  for (let i = 0; i < nodeCount; i++) {
    const x = (seededRandom(i * 10.1) - 0.5) * 15;
    const y = (seededRandom(i * 20.2) - 0.5) * 8;
    const z = (seededRandom(i * 30.3) - 0.5) * 10 - 5;
    nodePositions.push(new THREE.Vector3(x, y, z));
  }
  
  const maxDistance = 4;
  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      const dist = nodePositions[i].distanceTo(nodePositions[j]);
      if (dist < maxDistance) {
        linePositions.push(
          nodePositions[i].x, nodePositions[i].y, nodePositions[i].z,
          nodePositions[j].x, nodePositions[j].y, nodePositions[j].z
        );
      }
    }
  }
  
  return { nodePositions, linePositions: new Float32Array(linePositions) };
}

const networkData40 = generateNetworkData(40);
const networkData50 = generateNetworkData(50);

export function NetworkNodes({ 
  scrollProgress = 0, 
  nodeCount = 50,
  scrollVelocity = 0 
}: NetworkNodesProps) {
  const groupRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  
  const { nodePositions, linePositions } = useMemo(() => {
    if (nodeCount <= 40) return networkData40;
    return networkData50;
  }, [nodeCount]);
  
  useFrame((state) => {
    if (groupRef.current) {
      const visibility = Math.min(scrollProgress * 2, 1);
      const time = state.clock.elapsedTime;
      
      groupRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        const delay = i * 0.02;
        const progress = Math.max(0, visibility - delay);
        
        // ELASTIC NODE BIRTH with overshoot
        let scale: number;
        if (progress < 1) {
          // Elastic easing: overshoot then settle
          const elasticProgress = Math.sin(progress * Math.PI * 1.5) * (1.0 + (1 - progress) * 0.3);
          scale = Math.min(elasticProgress, 1.2);
        } else {
          scale = 1.0;
        }
        
        // DATA PULSES: nodes pulse with scroll velocity
        const pulseIntensity = Math.abs(scrollVelocity) * 0.5;
        const pulse = 1.0 + Math.sin(time * 3 + i * 0.5) * pulseIntensity * 0.3;
        
        mesh.scale.setScalar(scale * pulse);
        
        // Update material opacity based on energy
        const material = mesh.material as THREE.MeshBasicMaterial;
        material.opacity = 0.6 + progress * 0.3 + pulseIntensity * 0.2;
      });
    }
    
    if (linesRef.current) {
      const material = linesRef.current.material as THREE.LineBasicMaterial;
      // DATA PULSES: Lines pulse with velocity
      const pulseOpacity = 0.4 + Math.abs(scrollVelocity) * 0.3;
      material.opacity = scrollProgress * pulseOpacity;
    }
  });
  
  return (
    <>
      <group ref={groupRef}>
        {nodePositions.map((pos, i) => (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#38BDF8" transparent opacity={0.8} />
          </mesh>
        ))}
      </group>
      
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#38BDF8" transparent opacity={0} />
      </lineSegments>
    </>
  );
}
