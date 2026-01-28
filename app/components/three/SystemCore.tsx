'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SystemCoreProps {
  scrollProgress: number;
  mousePosition: { x: number; y: number };
}

// Neon colors
const NEON = {
  cyan: '#00FFFF',
  magenta: '#FF00FF',
  blue: '#0080FF',
  pink: '#FF0080',
};

// Inner glowing core
function GlowingCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef(0);
  
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.8, 2), []);
  const glowGeometry = useMemo(() => new THREE.IcosahedronGeometry(2.2, 1), []);
  
  useFrame((state, delta) => {
    pulseRef.current += delta * 0.8;
    
    if (meshRef.current) {
      const pulse = 1 + Math.sin(pulseRef.current) * 0.08;
      meshRef.current.scale.setScalar(pulse);
      meshRef.current.rotation.y += delta * 0.1;
      meshRef.current.rotation.x += delta * 0.05;
    }
    
    if (glowRef.current) {
      const glowPulse = 1.1 + Math.sin(pulseRef.current * 1.5) * 0.1;
      glowRef.current.scale.setScalar(glowPulse);
      glowRef.current.rotation.y -= delta * 0.05;
    }
  });
  
  return (
    <group>
      {/* Inner solid core */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          color={NEON.cyan}
          emissive={NEON.cyan}
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>
      
      {/* Outer glow shell */}
      <mesh ref={glowRef} geometry={glowGeometry}>
        <meshBasicMaterial
          color={NEON.blue}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// Neon orbital rings
function NeonRings() {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  
  const ringGeometry1 = useMemo(() => new THREE.TorusGeometry(4, 0.03, 16, 100), []);
  const ringGeometry2 = useMemo(() => new THREE.TorusGeometry(5.5, 0.025, 16, 100), []);
  const ringGeometry3 = useMemo(() => new THREE.TorusGeometry(7, 0.02, 16, 100), []);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = Math.PI * 0.35;
      ring1Ref.current.rotation.y = time * 0.12;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = Math.PI * 0.55;
      ring2Ref.current.rotation.z = time * 0.08;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = Math.PI * 0.75;
      ring3Ref.current.rotation.y = -time * 0.06;
    }
  });
  
  return (
    <group>
      <mesh ref={ring1Ref} geometry={ringGeometry1}>
        <meshStandardMaterial
          color={NEON.cyan}
          emissive={NEON.cyan}
          emissiveIntensity={1.5}
          transparent
          opacity={0.9}
        />
      </mesh>
      <mesh ref={ring2Ref} geometry={ringGeometry2}>
        <meshStandardMaterial
          color={NEON.magenta}
          emissive={NEON.magenta}
          emissiveIntensity={1.2}
          transparent
          opacity={0.8}
        />
      </mesh>
      <mesh ref={ring3Ref} geometry={ringGeometry3}>
        <meshStandardMaterial
          color={NEON.blue}
          emissive={NEON.blue}
          emissiveIntensity={1}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}

// Orbiting neon nodes
function NeonNodes() {
  const groupRef = useRef<THREE.Group>(null);
  const nodeCount = 16;
  
  const nodeData = useMemo(() => {
    const data: { position: THREE.Vector3; color: string; size: number }[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      const radius = 5 + (i % 4) * 0.5;
      data.push({
        position: new THREE.Vector3(
          radius * Math.cos(theta) * Math.sin(phi),
          radius * Math.sin(theta) * Math.sin(phi),
          radius * Math.cos(phi)
        ),
        color: i % 2 === 0 ? NEON.cyan : NEON.pink,
        size: 0.12 + (i % 3) * 0.04,
      });
    }
    return data;
  }, []);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    groupRef.current.rotation.y = time * 0.04;
    groupRef.current.rotation.x = Math.sin(time * 0.02) * 0.15;
  });
  
  return (
    <group ref={groupRef}>
      {nodeData.map((node, i) => (
        <mesh key={i} position={node.position}>
          <sphereGeometry args={[node.size, 12, 12]} />
          <meshStandardMaterial
            color={node.color}
            emissive={node.color}
            emissiveIntensity={2}
          />
        </mesh>
      ))}
    </group>
  );
}

// Connection lines between nodes
function ConnectionLines() {
  const linesRef = useRef<THREE.LineSegments>(null);
  
  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions: number[] = [];
    const arcCount = 10;
    
    for (let i = 0; i < arcCount; i++) {
      const angle1 = (i / arcCount) * Math.PI * 2;
      const angle2 = ((i + 4) / arcCount) * Math.PI * 2;
      const radius = 4.5;
      
      const segments = 25;
      for (let j = 0; j < segments; j++) {
        const t1 = j / segments;
        const t2 = (j + 1) / segments;
        
        const a1 = angle1 + (angle2 - angle1) * t1;
        const a2 = angle1 + (angle2 - angle1) * t2;
        
        const r1 = radius + Math.sin(t1 * Math.PI) * 1.5;
        const r2 = radius + Math.sin(t2 * Math.PI) * 1.5;
        
        positions.push(
          Math.cos(a1) * r1, Math.sin(t1 * Math.PI) * 2.5 - 1.25, Math.sin(a1) * r1,
          Math.cos(a2) * r2, Math.sin(t2 * Math.PI) * 2.5 - 1.25, Math.sin(a2) * r2
        );
      }
    }
    
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, []);
  
  useFrame((state) => {
    if (!linesRef.current) return;
    linesRef.current.rotation.y = state.clock.elapsedTime * 0.025;
  });
  
  return (
    <lineSegments ref={linesRef} geometry={lineGeometry}>
      <lineBasicMaterial color={NEON.magenta} transparent opacity={0.25} />
    </lineSegments>
  );
}

// Main SystemCore component
export function SystemCore({ scrollProgress, mousePosition }: SystemCoreProps) {
  const groupRef = useRef<THREE.Group>(null);
  const rotationRef = useRef(0);
  
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Slow constant rotation
    rotationRef.current += delta * (0.08 + scrollProgress * 0.1);
    groupRef.current.rotation.y = rotationRef.current;
    
    // Mouse parallax
    const targetX = mousePosition.y * 0.25;
    const targetZ = mousePosition.x * 0.15;
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.03;
    groupRef.current.rotation.z += (targetZ - groupRef.current.rotation.z) * 0.03;
    
    // Subtle floating
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.3;
  });
  
  return (
    <group ref={groupRef}>
      {/* Dark ambient */}
      <ambientLight intensity={0.1} />
      
      {/* Neon point lights */}
      <pointLight position={[8, 8, 8]} intensity={1} color={NEON.cyan} distance={30} />
      <pointLight position={[-8, -8, -8]} intensity={0.8} color={NEON.magenta} distance={30} />
      <pointLight position={[0, 10, 0]} intensity={0.6} color={NEON.blue} distance={25} />
      <pointLight position={[0, -10, 0]} intensity={0.5} color={NEON.pink} distance={25} />
      
      {/* Core glow light */}
      <pointLight position={[0, 0, 0]} intensity={2} color={NEON.cyan} distance={15} />
      
      {/* Core structure - scaled up */}
      <group scale={1.5}>
        <GlowingCore />
        <NeonRings />
        <NeonNodes />
        <ConnectionLines />
      </group>
    </group>
  );
}

export default SystemCore;
