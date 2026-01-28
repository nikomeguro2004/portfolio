'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Shared material colors - muted, architectural
const COLORS = {
  interface: '#E2E8F0',    // Light gray - Interface Layer
  application: '#94A3B8',  // Slate - Application Layer
  data: '#64748B',         // Darker slate - Data Layer
  compute: '#38BDF8',      // Muted cyan - AI/Compute Layer
  infrastructure: '#475569', // Dark slate - Infrastructure Layer
};

// Layer component - reusable for each system layer
interface LayerProps {
  geometry: THREE.BufferGeometry;
  color: string;
  position: [number, number, number];
  layerRef: React.RefObject<THREE.Mesh | null>;
}

function Layer({ geometry, color, position, layerRef }: LayerProps) {
  return (
    <mesh ref={layerRef} position={position} geometry={geometry}>
      <meshStandardMaterial 
        color={color} 
        roughness={0.7} 
        metalness={0.1}
        flatShading
      />
    </mesh>
  );
}

// Interface Layer - Thin flat plane, slightly wider
function InterfaceLayer({ layerRef }: { layerRef: React.RefObject<THREE.Mesh | null> }) {
  const geometry = useMemo(() => new THREE.BoxGeometry(4.5, 0.15, 3), []);
  return <Layer geometry={geometry} color={COLORS.interface} position={[0, 0, 0]} layerRef={layerRef} />;
}

// Application Layer - Modular rectangular blocks with separation
function ApplicationLayer({ layerRef }: { layerRef: React.RefObject<THREE.Group | null> }) {
  const blockGeometry = useMemo(() => new THREE.BoxGeometry(1.2, 0.25, 2.5), []);
  
  return (
    <group ref={layerRef} position={[0, 0, 0]}>
      {/* Left block */}
      <mesh position={[-1.4, 0, 0]} geometry={blockGeometry}>
        <meshStandardMaterial color={COLORS.application} roughness={0.7} metalness={0.1} flatShading />
      </mesh>
      {/* Center block */}
      <mesh position={[0, 0, 0]} geometry={blockGeometry}>
        <meshStandardMaterial color={COLORS.application} roughness={0.7} metalness={0.1} flatShading />
      </mesh>
      {/* Right block */}
      <mesh position={[1.4, 0, 0]} geometry={blockGeometry}>
        <meshStandardMaterial color={COLORS.application} roughness={0.7} metalness={0.1} flatShading />
      </mesh>
    </group>
  );
}

// Data Layer - Dense grid / compressed slab
function DataLayer({ layerRef }: { layerRef: React.RefObject<THREE.Group | null> }) {
  const slabGeometry = useMemo(() => new THREE.BoxGeometry(3.8, 0.4, 2.8), []);
  const gridLineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions: number[] = [];
    
    // Create grid lines on top surface
    const gridSize = 3.6;
    const divisions = 8;
    const step = gridSize / divisions;
    const y = 0.21;
    
    for (let i = 0; i <= divisions; i++) {
      const pos = -gridSize / 2 + i * step;
      // Horizontal lines
      positions.push(-gridSize / 2, y, pos, gridSize / 2, y, pos);
      // Vertical lines
      positions.push(pos, y, -gridSize / 2 + 0.2, pos, y, gridSize / 2 - 0.2);
    }
    
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, []);
  
  return (
    <group ref={layerRef} position={[0, 0, 0]}>
      <mesh geometry={slabGeometry}>
        <meshStandardMaterial color={COLORS.data} roughness={0.8} metalness={0.05} flatShading />
      </mesh>
      <lineSegments geometry={gridLineGeometry}>
        <lineBasicMaterial color="#1E293B" opacity={0.3} transparent />
      </lineSegments>
    </group>
  );
}

// AI/Compute Layer - Central solid geometric core
function ComputeLayer({ layerRef }: { layerRef: React.RefObject<THREE.Mesh | null> }) {
  const geometry = useMemo(() => new THREE.BoxGeometry(2.5, 0.5, 2.5), []);
  return <Layer geometry={geometry} color={COLORS.compute} position={[0, 0, 0]} layerRef={layerRef} />;
}

// Infrastructure Layer - Long horizontal base platform
function InfrastructureLayer({ layerRef }: { layerRef: React.RefObject<THREE.Mesh | null> }) {
  const geometry = useMemo(() => new THREE.BoxGeometry(5, 0.2, 3.5), []);
  return <Layer geometry={geometry} color={COLORS.infrastructure} position={[0, 0, 0]} layerRef={layerRef} />;
}

interface SystemDiagramProps {
  scrollProgress: number;
  mousePosition: { x: number; y: number };
}

export function SystemDiagram({ scrollProgress, mousePosition }: SystemDiagramProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Layer refs for animation
  const interfaceRef = useRef<THREE.Mesh>(null);
  const applicationRef = useRef<THREE.Group>(null);
  const dataRef = useRef<THREE.Group>(null);
  const computeRef = useRef<THREE.Mesh>(null);
  const infrastructureRef = useRef<THREE.Mesh>(null);
  
  // Ambient rotation ref
  const rotationRef = useRef(0);
  
  // Layer separation based on scroll progress
  // Layers spread along Y-axis (vertical in camera view)
  const layerPositions = useMemo(() => {
    // Start collapsed, spread as scroll progresses
    const spread = scrollProgress * 1.2; // Max separation
    return {
      interface: 2 * spread,      // Top
      application: 1 * spread,    // Upper middle
      data: 0,                    // Center
      compute: -1 * spread,       // Lower middle
      infrastructure: -2 * spread, // Bottom
    };
  }, [scrollProgress]);
  
  // Update layer positions on scroll
  useFrame(() => {
    // Very slow ambient rotation (only when not scrolling much)
    const rotationSpeed = 0.0003 * (1 - scrollProgress * 0.5);
    rotationRef.current += rotationSpeed;
    
    if (groupRef.current) {
      // Apply ambient rotation
      groupRef.current.rotation.y = rotationRef.current;
      
      // Subtle parallax from mouse (max ±3 degrees = ±0.052 radians)
      const targetRotX = mousePosition.y * 0.03;
      const targetRotZ = mousePosition.x * -0.02;
      groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.03;
      groupRef.current.rotation.z += (targetRotZ - groupRef.current.rotation.z) * 0.03;
    }
    
    // Smooth layer separation
    if (interfaceRef.current) {
      interfaceRef.current.position.y += (layerPositions.interface - interfaceRef.current.position.y) * 0.08;
    }
    if (applicationRef.current) {
      applicationRef.current.position.y += (layerPositions.application - applicationRef.current.position.y) * 0.08;
    }
    if (dataRef.current) {
      dataRef.current.position.y += (layerPositions.data - dataRef.current.position.y) * 0.08;
    }
    if (computeRef.current) {
      computeRef.current.position.y += (layerPositions.compute - computeRef.current.position.y) * 0.08;
    }
    if (infrastructureRef.current) {
      infrastructureRef.current.position.y += (layerPositions.infrastructure - infrastructureRef.current.position.y) * 0.08;
    }
  });
  
  return (
    <group ref={groupRef} rotation={[0.3, 0, 0.1]}>
      {/* Professional minimal lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[5, 8, 5]} 
        intensity={0.6} 
        castShadow={false}
      />
      {/* Subtle rim light for depth */}
      <directionalLight 
        position={[-3, -2, -5]} 
        intensity={0.15} 
        color="#94A3B8"
      />
      
      {/* System Layers - from top to bottom */}
      <InterfaceLayer layerRef={interfaceRef} />
      <ApplicationLayer layerRef={applicationRef} />
      <DataLayer layerRef={dataRef} />
      <ComputeLayer layerRef={computeRef} />
      <InfrastructureLayer layerRef={infrastructureRef} />
    </group>
  );
}

export default SystemDiagram;
