'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface SceneMorphProps {
  scrollProgress?: number;
  targetState?: 'sphere' | 'network' | 'grid' | 'lines';
}

// Seeded random for deterministic results
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

const POINT_COUNT = 600;

// IMPROVED: Vertex shader with non-monotonic morph, cluster delays, stress turbulence
const morphVertexShader = `
  uniform float uTime;
  uniform float uMorphProgress;
  uniform vec3 uColor;
  
  attribute vec3 aTargetPosition;
  attribute float aDelay;
  
  varying vec3 vColor;
  varying float vAlpha;
  varying float vFlash;
  
  void main() {
    // CLUSTER-BASED DELAYS: Spatial bias - core reacts first
    float spatialBias = length(position) * 0.05;
    float adjustedProgress = clamp(uMorphProgress - aDelay * 0.25 - spatialBias, 0.0, 1.0);
    
    // NON-MONOTONIC MORPH: Overshoot + recoil
    float p = adjustedProgress;
    float overshoot = sin(p * 3.1415) * 0.15;
    float ease = smoothstep(0.0, 1.0, p) + overshoot;
    ease = clamp(ease, 0.0, 1.2);
    
    // COLLAPSE MOMENT: Brief inward collapse at morph start
    float collapse = smoothstep(0.0, 0.15, uMorphProgress)
                   * (1.0 - smoothstep(0.15, 0.3, uMorphProgress));
    
    vec3 pos = mix(position, aTargetPosition, ease);
    
    // Apply collapse
    pos *= 1.0 - collapse * 0.7;
    
    // MORPH-DRIVEN TURBULENCE: Violent during transformation
    float stress = smoothstep(0.2, 0.8, uMorphProgress) * (1.0 - smoothstep(0.8, 1.0, uMorphProgress));
    pos += vec3(
      sin(uTime * 2.0 + position.x * 4.0),
      cos(uTime * 2.3 + position.y * 4.0),
      sin(uTime * 2.6 + position.z * 4.0)
    ) * 0.05 * stress;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // ENERGY-WEIGHTED SIZE: Motion makes particles larger
    float energy = abs(ease - 0.6) + uMorphProgress * 0.5;
    float baseSize = 2.5 * (200.0 / -mvPosition.z);
    gl_PointSize = baseSize * (1.0 + energy * 0.6);
    gl_PointSize = clamp(gl_PointSize, 1.0, 12.0);
    
    vColor = uColor;
    vAlpha = 0.6 + sin(uTime + aDelay * 6.28) * 0.2;
    
    // STRESS FLASH: Luminance spike at morph midpoint
    vFlash = smoothstep(0.45, 0.5, uMorphProgress)
           * (1.0 - smoothstep(0.5, 0.55, uMorphProgress));
  }
`;

// IMPROVED: Fragment shader with stress flash
const morphFragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vFlash;
  
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    
    float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;
    
    // Soft glow
    vec3 color = vColor + vec3(0.2) * (1.0 - dist * 2.0);
    
    // STRESS FLASH: Brief luminance spike
    color += vFlash * vec3(0.4, 0.4, 0.4);
    
    gl_FragColor = vec4(color, alpha);
  }
`;

// Generate all geometry states outside component
function generateSpherePositions(): Float32Array {
  const positions = new Float32Array(POINT_COUNT * 3);
  for (let i = 0; i < POINT_COUNT; i++) {
    const phi = Math.acos(2 * (i / POINT_COUNT) - 1);
    const theta = Math.sqrt(POINT_COUNT * Math.PI) * phi;
    const radius = 3;
    const i3 = i * 3;
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);
  }
  return positions;
}

function generateNetworkPositions(): Float32Array {
  const positions = new Float32Array(POINT_COUNT * 3);
  // Clustered network - multiple clusters connected
  const clusterCount = 5;
  const pointsPerCluster = Math.floor(POINT_COUNT / clusterCount);
  
  for (let c = 0; c < clusterCount; c++) {
    const clusterX = (seededRandom(c * 100) - 0.5) * 6;
    const clusterY = (seededRandom(c * 200) - 0.5) * 4;
    const clusterZ = (seededRandom(c * 300) - 0.5) * 3;
    
    for (let p = 0; p < pointsPerCluster; p++) {
      const i = c * pointsPerCluster + p;
      if (i >= POINT_COUNT) break;
      const i3 = i * 3;
      
      positions[i3] = clusterX + (seededRandom(i * 1.1) - 0.5) * 2;
      positions[i3 + 1] = clusterY + (seededRandom(i * 2.2) - 0.5) * 2;
      positions[i3 + 2] = clusterZ + (seededRandom(i * 3.3) - 0.5) * 2;
    }
  }
  return positions;
}

function generateGridPositions(): Float32Array {
  const positions = new Float32Array(POINT_COUNT * 3);
  const gridSize = Math.ceil(Math.cbrt(POINT_COUNT));
  let idx = 0;
  
  for (let x = 0; x < gridSize && idx < POINT_COUNT; x++) {
    for (let y = 0; y < gridSize && idx < POINT_COUNT; y++) {
      for (let z = 0; z < gridSize && idx < POINT_COUNT; z++) {
        const i3 = idx * 3;
        positions[i3] = (x - gridSize / 2) * 0.5;
        positions[i3 + 1] = (y - gridSize / 2) * 0.5;
        positions[i3 + 2] = (z - gridSize / 2) * 0.5;
        idx++;
      }
    }
  }
  return positions;
}

function generateLinesPositions(): Float32Array {
  const positions = new Float32Array(POINT_COUNT * 3);
  const numLines = 15;
  const pointsPerLine = Math.floor(POINT_COUNT / numLines);
  
  for (let line = 0; line < numLines; line++) {
    const startX = (seededRandom(line * 10) - 0.5) * 8;
    const endX = (seededRandom(line * 11) - 0.5) * 8;
    const y = (line - numLines / 2) * 0.6;
    
    for (let p = 0; p < pointsPerLine; p++) {
      const i = line * pointsPerLine + p;
      if (i >= POINT_COUNT) break;
      const i3 = i * 3;
      const t = p / pointsPerLine;
      
      positions[i3] = startX + (endX - startX) * t;
      positions[i3 + 1] = y + Math.sin(t * Math.PI * 2) * 0.5;
      positions[i3 + 2] = Math.sin(t * Math.PI * 3) * 2;
    }
  }
  return positions;
}

function generateDelays(): Float32Array {
  const delays = new Float32Array(POINT_COUNT);
  for (let i = 0; i < POINT_COUNT; i++) {
    delays[i] = seededRandom(i * 7.7);
  }
  return delays;
}

// Pre-generate all states
const spherePositions = generateSpherePositions();
const networkPositions = generateNetworkPositions();
const gridPositions = generateGridPositions();
const linesPositions = generateLinesPositions();
const delays = generateDelays();

const statePositions: Record<string, Float32Array> = {
  sphere: spherePositions,
  network: networkPositions,
  grid: gridPositions,
  lines: linesPositions,
};

const stateColors: Record<string, string> = {
  sphere: '#38BDF8',
  network: '#8B5CF6',
  grid: '#10B981',
  lines: '#F59E0B',
};

export function SceneMorph({ targetState = 'sphere' }: SceneMorphProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const currentStateRef = useRef(targetState);
  const morphProgressRef = useRef({ value: 0 });
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMorphProgress: { value: 0 },
    uColor: { value: new THREE.Color(stateColors[targetState]) },
  }), [targetState]);
  
  // Handle state transitions with GSAP - ASYMMETRIC EASING
  useEffect(() => {
    if (currentStateRef.current !== targetState && pointsRef.current) {
      const geometry = pointsRef.current.geometry;
      const currentPositions = geometry.getAttribute('position');
      const targetPositionsAttr = geometry.getAttribute('aTargetPosition');
      
      // Copy current positions to base
      for (let i = 0; i < POINT_COUNT * 3; i++) {
        currentPositions.array[i] = targetPositionsAttr.array[i];
      }
      currentPositions.needsUpdate = true;
      
      // Set new target
      const newTarget = statePositions[targetState];
      for (let i = 0; i < POINT_COUNT * 3; i++) {
        (targetPositionsAttr.array as Float32Array)[i] = newTarget[i];
      }
      targetPositionsAttr.needsUpdate = true;
      
      // ASYMMETRIC EASING: Fast collapse, slow rebuild
      gsap.fromTo(
        morphProgressRef.current,
        { value: 0 },
        { 
          value: 1, 
          duration: 1.0, 
          ease: 'expo.inOut',
          onUpdate: () => {
            if (materialRef.current) {
              materialRef.current.uniforms.uMorphProgress.value = morphProgressRef.current.value;
            }
          }
        }
      );
      
      // Animate color
      gsap.to(uniforms.uColor.value, {
        r: new THREE.Color(stateColors[targetState]).r,
        g: new THREE.Color(stateColors[targetState]).g,
        b: new THREE.Color(stateColors[targetState]).b,
        duration: 0.8,
        ease: 'power2.out',
      });
      
      currentStateRef.current = targetState;
    }
  }, [targetState, uniforms]);
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    
    if (pointsRef.current) {
      // ROTATION REFLECTS STATE CHANGE: Instability during morph
      const stress = Math.sin(morphProgressRef.current.value * Math.PI);
      pointsRef.current.rotation.y += 0.01 + stress * 0.05;
      pointsRef.current.rotation.x += stress * 0.02;
    }
  });
  
  const basePositions = useMemo(() => new Float32Array(spherePositions), []);
  const targetPositions = useMemo(() => new Float32Array(spherePositions), []);
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[basePositions, 3]} />
        <bufferAttribute attach="attributes-aTargetPosition" args={[targetPositions, 3]} />
        <bufferAttribute attach="attributes-aDelay" args={[delays, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={morphVertexShader}
        fragmentShader={morphFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default SceneMorph;
