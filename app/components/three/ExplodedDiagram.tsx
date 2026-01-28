'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SystemComponent {
  id: string;
  label: string;
  description: string;
  color: string;
  basePosition: [number, number, number];
  explodedOffset: [number, number, number];
  geometry: 'box' | 'sphere' | 'cylinder' | 'octahedron';
  scale: number;
  mass: number; // 1. Per-component mass for motion personality
  connections?: string[];
}

// System architecture with mass values
const systemComponents: SystemComponent[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    description: 'React / Next.js',
    color: '#38BDF8',
    basePosition: [0, 1.5, 0],
    explodedOffset: [0, 2.8, 0],
    geometry: 'box',
    scale: 1.2,
    mass: 0.6, // Light, responsive
    connections: ['api', 'state'],
  },
  {
    id: 'api',
    label: 'API Layer',
    description: 'REST / GraphQL',
    color: '#8B5CF6',
    basePosition: [0, 0, 0],
    explodedOffset: [0, 0, 0],
    geometry: 'octahedron',
    scale: 0.8,
    mass: 0.8,
    connections: ['backend', 'cache'],
  },
  {
    id: 'backend',
    label: 'Backend',
    description: 'Node.js / FastAPI',
    color: '#10B981',
    basePosition: [0, -1.5, 0],
    explodedOffset: [0, -2.8, 0],
    geometry: 'cylinder',
    scale: 1,
    mass: 1.2, // Heavier, slower
    connections: ['database', 'ai'],
  },
  {
    id: 'database',
    label: 'Database',
    description: 'PostgreSQL / MongoDB',
    color: '#F59E0B',
    basePosition: [-1.5, -1.5, -0.5],
    explodedOffset: [-3.5, -2.5, -1],
    geometry: 'cylinder',
    scale: 0.8,
    mass: 1.8, // Very heavy
  },
  {
    id: 'ai',
    label: 'AI/ML',
    description: 'LLM / RAG',
    color: '#EC4899',
    basePosition: [1.5, -1.5, -0.5],
    explodedOffset: [3.5, -2.5, -1],
    geometry: 'sphere',
    scale: 0.9,
    mass: 0.5, // Erratic, fast
  },
  {
    id: 'cache',
    label: 'Cache',
    description: 'Redis',
    color: '#EF4444',
    basePosition: [-1.5, 0, -0.5],
    explodedOffset: [-3.5, 0, -1],
    geometry: 'box',
    scale: 0.6,
    mass: 0.4, // Very light
  },
  {
    id: 'state',
    label: 'State',
    description: 'Client Store',
    color: '#06B6D4',
    basePosition: [1.5, 1.5, -0.5],
    explodedOffset: [3.5, 2.5, -1],
    geometry: 'box',
    scale: 0.7,
    mass: 0.5,
  },
];

interface ComponentMeshProps {
  component: SystemComponent;
  explodeProgress: number;
  collapsePhase: number; // 8. Signature moment
  hovered: string | null;
  allComponents: SystemComponent[];
  onHover: (id: string | null) => void;
}

function ComponentMesh({ 
  component, 
  explodeProgress, 
  collapsePhase,
  hovered, 
  allComponents,
  onHover 
}: ComponentMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const velocityRef = useRef({ x: 0, y: 0, z: 0 });
  const isHovered = hovered === component.id;
  const otherHovered = hovered !== null && hovered !== component.id;
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const mesh = meshRef.current;
    const time = state.clock.elapsedTime;
    
    // Calculate target position
    let targetX = component.basePosition[0] + component.explodedOffset[0] * explodeProgress;
    let targetY = component.basePosition[1] + component.explodedOffset[1] * explodeProgress;
    let targetZ = component.basePosition[2] + component.explodedOffset[2] * explodeProgress;
    
    // 8. Signature moment: collapse before explode
    if (collapsePhase > 0 && collapsePhase < 1) {
      const collapse = Math.sin(collapsePhase * Math.PI);
      targetX *= (1 - collapse * 0.5);
      targetY *= (1 - collapse * 0.5);
      targetZ *= (1 - collapse * 0.5);
    }
    
    // 4. When hovering another, lean away slightly
    if (otherHovered) {
      const hoveredComp = allComponents.find(c => c.id === hovered);
      if (hoveredComp) {
        const dir = new THREE.Vector3(
          mesh.position.x - (hoveredComp.basePosition[0] + hoveredComp.explodedOffset[0] * explodeProgress),
          mesh.position.y - (hoveredComp.basePosition[1] + hoveredComp.explodedOffset[1] * explodeProgress),
          0
        ).normalize();
        targetX += dir.x * 0.15;
        targetY += dir.y * 0.15;
      }
    }
    
    // 1. Per-component motion with mass
    const damping = 0.08 / component.mass;
    
    velocityRef.current.x += (targetX - mesh.position.x) * damping;
    velocityRef.current.y += (targetY - mesh.position.y) * damping;
    velocityRef.current.z += (targetZ - mesh.position.z) * damping;
    
    // Apply friction
    const friction = 0.85;
    velocityRef.current.x *= friction;
    velocityRef.current.y *= friction;
    velocityRef.current.z *= friction;
    
    mesh.position.x += velocityRef.current.x;
    mesh.position.y += velocityRef.current.y;
    mesh.position.z += velocityRef.current.z;
    
    // 2. Rotation reflects energy, not cosmetic
    const energy = explodeProgress + (isHovered ? 0.6 : 0);
    mesh.rotation.y += 0.008 * energy / component.mass;
    mesh.rotation.x += Math.sin(time * 0.5) * 0.003 * energy;
    
    // Hover scale
    const targetScale = isHovered ? component.scale * 1.25 : component.scale;
    const currentScale = mesh.scale.x;
    mesh.scale.setScalar(currentScale + (targetScale - currentScale) * 0.12);
  });
  
  const geometry = useMemo(() => {
    switch (component.geometry) {
      case 'sphere':
        return <sphereGeometry args={[0.5, 32, 32]} />;
      case 'cylinder':
        return <cylinderGeometry args={[0.4, 0.4, 0.8, 32]} />;
      case 'octahedron':
        return <octahedronGeometry args={[0.5]} />;
      default:
        return <boxGeometry args={[0.8, 0.8, 0.8]} />;
    }
  }, [component.geometry]);
  
  return (
    <mesh
      ref={meshRef}
      position={component.basePosition}
      scale={component.scale}
      onPointerEnter={() => onHover(component.id)}
      onPointerLeave={() => onHover(null)}
    >
      {geometry}
      <meshStandardMaterial
        color={component.color}
        emissive={component.color}
        emissiveIntensity={isHovered ? 0.6 : 0.15 + explodeProgress * 0.15}
        metalness={0.4}
        roughness={0.3}
        transparent
        opacity={0.92}
      />
      
      {/* 7. Labels delay and fade properly */}
      {explodeProgress > 0.5 && (
        <Html
          position={[0, 0.9, 0]}
          center
          style={{
            opacity: Math.min((explodeProgress - 0.5) * 3, 1),
            pointerEvents: 'none',
            transform: `translateY(${(1 - Math.min((explodeProgress - 0.5) * 3, 1)) * 10}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        >
          <div className="bg-black/85 px-3 py-1.5 rounded-lg text-center whitespace-nowrap backdrop-blur-sm border border-white/10">
            <div className="text-xs font-semibold" style={{ color: component.color }}>
              {component.label}
            </div>
            <div className="text-[10px] text-gray-400">
              {component.description}
            </div>
          </div>
        </Html>
      )}
    </mesh>
  );
}

// 3. Connection lines with animated opacity
function ConnectionLines({ explodeProgress, hovered }: { explodeProgress: number; hovered: string | null }) {
  const linesRef = useRef<THREE.LineSegments>(null);
  const materialRef = useRef<THREE.LineBasicMaterial>(null);
  
  const positions = useMemo(() => {
    const positions: number[] = [];
    
    systemComponents.forEach(comp => {
      if (!comp.connections) return;
      
      const fromPos = comp.basePosition.map((p, i) => 
        p + comp.explodedOffset[i] * explodeProgress
      );
      
      comp.connections.forEach(targetId => {
        const target = systemComponents.find(c => c.id === targetId);
        if (!target) return;
        
        const toPos = target.basePosition.map((p, i) => 
          p + target.explodedOffset[i] * explodeProgress
        );
        
        positions.push(...fromPos, ...toPos);
      });
    });
    
    return new Float32Array(positions);
  }, [explodeProgress]);
  
  useFrame((state) => {
    if (linesRef.current && materialRef.current) {
      // Update positions
      const geometry = linesRef.current.geometry;
      const positionAttr = geometry.getAttribute('position');
      if (positionAttr) {
        positionAttr.array.set(positions);
        positionAttr.needsUpdate = true;
      }
      
      // 3. Pulse opacity for data flow effect
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.1;
      
      // Brighten on hover
      const isConnectionHovered = hovered && systemComponents.find(c => c.id === hovered)?.connections?.length;
      materialRef.current.opacity = 0.2 + explodeProgress * 0.4 + pulse + (isConnectionHovered ? 0.25 : 0);
    }
  });
  
  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial 
        ref={materialRef}
        color="#38BDF8" 
        transparent 
        opacity={0.3}
      />
    </lineSegments>
  );
}

// 5 & 6. Dynamic camera and lighting
function DynamicEnvironment({ explodeProgress, hovered }: { explodeProgress: number; hovered: string | null }) {
  const lightRef = useRef<THREE.PointLight>(null);
  const targetCamZ = useRef(8);
  const targetCamY = useRef(0);
  
  useFrame((state) => {
    // Access camera from state to properly modify in useFrame
    const camera = state.camera;
    
    // 5. Camera reacts to scroll
    targetCamZ.current = 8 - explodeProgress * 1.5;
    targetCamY.current = explodeProgress * 0.4;
    
    // 4. Camera shifts on hover
    if (hovered) {
      targetCamZ.current -= 0.3;
    }
    
    camera.position.z += (targetCamZ.current - camera.position.z) * 0.05;
    camera.position.y += (targetCamY.current - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
    
    // 6. Light intensity reacts
    if (lightRef.current) {
      const targetIntensity = 0.5 + explodeProgress * 0.7 + (hovered ? 0.3 : 0);
      lightRef.current.intensity += (targetIntensity - lightRef.current.intensity) * 0.1;
    }
  });
  
  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight ref={lightRef} position={[5, 5, 5]} intensity={0.6} color="#38BDF8" />
      <pointLight position={[-5, -5, -5]} intensity={0.4} color="#8B5CF6" />
    </>
  );
}

interface ExplodedDiagramSceneProps {
  explodeProgress: number;
  collapsePhase: number;
  hovered: string | null;
  onHover: (id: string | null) => void;
}

function ExplodedDiagramScene({ explodeProgress, collapsePhase, hovered, onHover }: ExplodedDiagramSceneProps) {
  return (
    <>
      <DynamicEnvironment explodeProgress={explodeProgress} hovered={hovered} />
      
      <ConnectionLines explodeProgress={explodeProgress} hovered={hovered} />
      
      {systemComponents.map(comp => (
        <ComponentMesh
          key={comp.id}
          component={comp}
          explodeProgress={explodeProgress}
          collapsePhase={collapsePhase}
          hovered={hovered}
          allComponents={systemComponents}
          onHover={onHover}
        />
      ))}
    </>
  );
}

interface ExplodedDiagramProps {
  className?: string;
}

export default function ExplodedDiagram({ className = '' }: ExplodedDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [explodeProgress, setExplodeProgress] = useState(0);
  const [collapsePhase, setCollapsePhase] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // 8. Signature moment: brief collapse before explosion
    let hasCollapsed = false;
    
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 75%',
      end: 'bottom 25%',
      scrub: 1.5,
      onUpdate: (self) => {
        const progress = self.progress;
        
        // Trigger collapse at very start
        if (progress > 0.02 && progress < 0.15 && !hasCollapsed) {
          setCollapsePhase(progress * 10);
        } else if (progress >= 0.15) {
          setCollapsePhase(0);
          hasCollapsed = true;
        }
        
        // Main explode progress starts after collapse
        const adjustedProgress = progress < 0.15 ? 0 : (progress - 0.15) / 0.85;
        setExplodeProgress(Math.max(0, adjustedProgress));
      },
      onLeaveBack: () => {
        hasCollapsed = false;
      }
    });
    
    return () => trigger.kill();
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className={`relative h-125 ${className}`}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ExplodedDiagramScene
          explodeProgress={explodeProgress}
          collapsePhase={collapsePhase}
          hovered={hovered}
          onHover={setHovered}
        />
      </Canvas>
      
      {/* Legend */}
      <div 
        className="absolute bottom-4 left-4 text-xs"
        style={{ 
          opacity: explodeProgress > 0.6 ? Math.min((explodeProgress - 0.6) * 2.5, 1) : 0,
          transition: 'opacity 0.4s ease',
          transform: `translateY(${explodeProgress > 0.6 ? 0 : 10}px)`,
        }}
      >
        <div className="text-gray-400 mb-2 font-medium">System Architecture</div>
        <div className="flex flex-wrap gap-3">
          {systemComponents.slice(0, 4).map(comp => (
            <div key={comp.id} className="flex items-center gap-1.5">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: comp.color }}
              />
              <span className="text-gray-500">{comp.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
