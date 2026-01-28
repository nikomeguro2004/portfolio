'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ═══════════════════════════════════════════════════════════════════════════
// INFRASTRUCTURE MACHINE - Structural Background System
// Spans 80 units vertically - you move THROUGH it, not look AT it
// ═══════════════════════════════════════════════════════════════════════════

// Section Y positions (semantic anchors)
const SECTIONS = {
  hero: 35,
  about: 21,
  experience: 7,
  skills: -7,
  projects: -21,
  contact: -35,
  footer: -42,
};

// Color palette - dark industrial
const COLORS = {
  spineOuter: '#1E293B',
  spineCore: '#0EA5E9',
  conduit: '#334155',
  conduitEnergy: '#38BDF8',
  module: '#1E293B',
  moduleAccent: '#475569',
  gear: '#0F172A',
  gearAccent: '#334155',
  emissive: '#0284C7',
};

// ═══════════════════════════════════════════════════════════════════════════
// ENERGY SPINE - Central power backbone (TALL - spans entire page)
// ═══════════════════════════════════════════════════════════════════════════

function EnergySpine({ intensity }: { intensity: number }) {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const rotationRef = useRef(0);
  const pulseRef = useRef(0);

  const outerGeometry = useMemo(() => new THREE.CylinderGeometry(0.6, 0.6, 85, 8, 1, true), []);
  const innerGeometry = useMemo(() => new THREE.CylinderGeometry(0.35, 0.35, 84, 8, 16, false), []);
  const coreGeometry = useMemo(() => new THREE.CylinderGeometry(0.15, 0.15, 83, 16, 1, false), []);

  const rings = useMemo(() => {
    const positions: number[] = [];
    for (let y = -40; y <= 40; y += 7) {
      positions.push(y);
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    rotationRef.current += delta * 0.03 * (1 + intensity * 0.2);
    pulseRef.current += delta * 0.6;

    if (outerRef.current) outerRef.current.rotation.y = rotationRef.current;
    if (innerRef.current) innerRef.current.rotation.y = -rotationRef.current * 0.3;

    if (coreRef.current && coreRef.current.material instanceof THREE.MeshStandardMaterial) {
      coreRef.current.material.emissiveIntensity = 0.25 + Math.sin(pulseRef.current) * 0.1 + intensity * 0.3;
    }
  });

  return (
    <group position={[1.5, 0, -2]}>
      <mesh ref={outerRef} geometry={outerGeometry}>
        <meshStandardMaterial color={COLORS.spineOuter} transparent opacity={0.25} side={THREE.DoubleSide} roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh ref={innerRef} geometry={innerGeometry}>
        <meshStandardMaterial color={COLORS.moduleAccent} roughness={0.4} metalness={0.6} wireframe />
      </mesh>
      <mesh ref={coreRef} geometry={coreGeometry}>
        <meshStandardMaterial color={COLORS.spineCore} emissive={COLORS.emissive} emissiveIntensity={0.4} roughness={0.1} metalness={0.2} />
      </mesh>
      {rings.map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.7, 0.04, 8, 16]} />
          <meshStandardMaterial color={COLORS.gearAccent} roughness={0.3} metalness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ENERGY CONDUIT
// ═══════════════════════════════════════════════════════════════════════════

interface ConduitProps {
  points: THREE.Vector3[];
  intensity: number;
  flowSpeed?: number;
  flowOffset?: number;
}

function EnergyConduit({ points, intensity, flowSpeed = 1, flowOffset = 0 }: ConduitProps) {
  const energyRef = useRef<THREE.Mesh>(null);
  const flowRef = useRef(flowOffset);

  const { tubeCurve, tubeGeometry, energyGeometry } = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5);
    const tube = new THREE.TubeGeometry(curve, 48, 0.06, 8, false);
    const energy = new THREE.TubeGeometry(curve, 48, 0.03, 8, false);
    return { tubeCurve: curve, tubeGeometry: tube, energyGeometry: energy };
  }, [points]);

  const particleData = useMemo(() => [
    { t: 0, speed: 0.28 }, { t: 0.2, speed: 0.35 }, { t: 0.4, speed: 0.32 }, { t: 0.6, speed: 0.40 }, { t: 0.8, speed: 0.30 }
  ], []);

  const particleRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state, delta) => {
    flowRef.current += delta * flowSpeed * (0.4 + intensity * 0.4);

    particleRefs.current.forEach((mesh, i) => {
      if (mesh) {
        const t = (particleData[i].t + flowRef.current * particleData[i].speed) % 1;
        mesh.position.copy(tubeCurve.getPointAt(t));
      }
    });

    if (energyRef.current && energyRef.current.material instanceof THREE.MeshStandardMaterial) {
      energyRef.current.material.emissiveIntensity = 0.2 + intensity * 0.4 + Math.sin(flowRef.current * 2) * 0.1;
    }
  });

  return (
    <group>
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial color={COLORS.conduit} roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh ref={energyRef} geometry={energyGeometry}>
        <meshStandardMaterial color={COLORS.conduitEnergy} emissive={COLORS.emissive} emissiveIntensity={0.3} transparent opacity={0.7} />
      </mesh>
      {particleData.map((_, i) => (
        <mesh key={i} ref={(el) => { particleRefs.current[i] = el; }}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshBasicMaterial color={COLORS.spineCore} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION MODULE
// ═══════════════════════════════════════════════════════════════════════════

interface SectionModuleProps {
  position: [number, number, number];
  size?: [number, number, number];
  intensity: number;
  type: 'logic' | 'data' | 'ai' | 'infra' | 'terminal';
  rotationOffset?: number;
}

function SectionModule({ position, size = [1.2, 0.5, 0.8], intensity, type, rotationOffset = 0 }: SectionModuleProps) {
  const groupRef = useRef<THREE.Group>(null);
  const slideRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(rotationOffset);

  const bodyGeometry = useMemo(() => new THREE.BoxGeometry(size[0], size[1], size[2]), [size]);
  const plateGeometry = useMemo(() => new THREE.BoxGeometry(size[0] * 0.7, 0.04, size[2] * 0.5), [size]);
  const bracketGeometry = useMemo(() => new THREE.BoxGeometry(0.08, size[1] * 1.1, 0.12), [size]);

  const emissiveColor = useMemo(() => {
    const colors: Record<string, string> = { logic: '#10B981', data: '#F59E0B', ai: '#8B5CF6', infra: '#0EA5E9', terminal: '#EF4444' };
    return colors[type] || COLORS.emissive;
  }, [type]);

  useFrame((state, delta) => {
    timeRef.current += delta;
    if (groupRef.current) groupRef.current.position.y = position[1] + Math.sin(timeRef.current * 0.3 + rotationOffset) * 0.02;
    if (slideRef.current) slideRef.current.position.x = Math.sin(timeRef.current * 0.2 + rotationOffset) * 0.08 * (0.4 + intensity * 0.4);
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh geometry={bodyGeometry}>
        <meshStandardMaterial color={COLORS.module} roughness={0.5} metalness={0.7} />
      </mesh>
      <mesh ref={slideRef} geometry={plateGeometry} position={[0, size[1] / 2 + 0.025, 0]}>
        <meshStandardMaterial color={COLORS.moduleAccent} roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh geometry={bracketGeometry} position={[-size[0] / 2 - 0.06, 0, 0]}>
        <meshStandardMaterial color={COLORS.gearAccent} roughness={0.4} metalness={0.7} />
      </mesh>
      <mesh position={[size[0] / 2 - 0.08, size[1] / 2 + 0.01, size[2] / 2 - 0.08]}>
        <boxGeometry args={[0.06, 0.015, 0.06]} />
        <meshStandardMaterial color={emissiveColor} emissive={emissiveColor} emissiveIntensity={0.4 + intensity * 0.4} />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MECHANICAL GEAR
// ═══════════════════════════════════════════════════════════════════════════

interface GearProps {
  position: [number, number, number];
  radius: number;
  intensity: number;
  rotationSpeed?: number;
  direction?: 1 | -1;
}

function MechanicalGear({ position, radius, intensity, rotationSpeed = 0.015, direction = 1 }: GearProps) {
  const gearRef = useRef<THREE.Group>(null);
  const rotationRef = useRef(0);

  const teethCount = Math.floor(radius * 12);
  const toothGeometry = useMemo(() => new THREE.BoxGeometry(0.06, 0.1, 0.15), []);
  const ringGeometry = useMemo(() => new THREE.TorusGeometry(radius, 0.04, 8, teethCount * 2), [radius, teethCount]);
  const hubGeometry = useMemo(() => new THREE.CylinderGeometry(radius * 0.25, radius * 0.25, 0.2, 8), [radius]);
  const spokeGeometry = useMemo(() => new THREE.BoxGeometry(radius * 0.6, 0.03, 0.06), [radius]);

  useFrame((state, delta) => {
    rotationRef.current += delta * rotationSpeed * direction * (1 + intensity * 0.3);
    if (gearRef.current) gearRef.current.rotation.z = rotationRef.current;
  });

  return (
    <group position={position} rotation={[Math.PI / 2, 0, 0]}>
      <group ref={gearRef}>
        <mesh geometry={ringGeometry}>
          <meshStandardMaterial color={COLORS.gear} roughness={0.3} metalness={0.8} />
        </mesh>
        {Array.from({ length: teethCount }).map((_, i) => {
          const angle = (i / teethCount) * Math.PI * 2;
          return (
            <mesh key={i} geometry={toothGeometry} position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]} rotation={[0, 0, angle]}>
              <meshStandardMaterial color={COLORS.gearAccent} roughness={0.4} metalness={0.7} />
            </mesh>
          );
        })}
        {[0, 1, 2, 3].map((i) => (
          <mesh key={`spoke-${i}`} geometry={spokeGeometry} rotation={[0, 0, (i / 4) * Math.PI * 2]}>
            <meshStandardMaterial color={COLORS.gearAccent} roughness={0.4} metalness={0.6} />
          </mesh>
        ))}
      </group>
      <mesh geometry={hubGeometry} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={COLORS.module} roughness={0.3} metalness={0.8} />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ORBITAL RING
// ═══════════════════════════════════════════════════════════════════════════

function OrbitalRing({ position, radius, intensity, axis = 'y' }: { position: [number, number, number]; radius: number; intensity: number; axis?: 'x' | 'y' | 'z' }) {
  const ringRef = useRef<THREE.Group>(null);
  const rotationRef = useRef(0);

  const mainRingGeometry = useMemo(() => new THREE.TorusGeometry(radius, 0.03, 8, 48), [radius]);
  const nodeGeometry = useMemo(() => new THREE.BoxGeometry(0.1, 0.06, 0.06), []);

  useFrame((state, delta) => {
    rotationRef.current += delta * 0.02 * (1 + intensity * 0.2);
    if (ringRef.current) {
      if (axis === 'x') ringRef.current.rotation.x = rotationRef.current;
      else if (axis === 'y') ringRef.current.rotation.y = rotationRef.current;
      else ringRef.current.rotation.z = rotationRef.current;
    }
  });

  const rotation: [number, number, number] = axis === 'x' ? [0, 0, 0] : axis === 'y' ? [Math.PI / 2, 0, 0] : [0, Math.PI / 2, 0];

  return (
    <group position={position} rotation={rotation}>
      <group ref={ringRef}>
        <mesh geometry={mainRingGeometry}>
          <meshStandardMaterial color={COLORS.gearAccent} roughness={0.3} metalness={0.7} />
        </mesh>
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <mesh key={i} geometry={nodeGeometry} position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]} rotation={[0, 0, angle]}>
              <meshStandardMaterial color={COLORS.module} emissive={COLORS.emissive} emissiveIntensity={0.15 + intensity * 0.2} roughness={0.3} metalness={0.7} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// JUNCTION NODE
// ═══════════════════════════════════════════════════════════════════════════

function JunctionNode({ position, intensity }: { position: [number, number, number]; intensity: number }) {
  const nodeRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef(0);

  useFrame((state, delta) => {
    pulseRef.current += delta * 1.5;
    if (nodeRef.current && nodeRef.current.material instanceof THREE.MeshStandardMaterial) {
      nodeRef.current.material.emissiveIntensity = 0.3 + Math.sin(pulseRef.current) * 0.15 + intensity * 0.3;
    }
  });

  return (
    <mesh ref={nodeRef} position={position}>
      <octahedronGeometry args={[0.15, 0]} />
      <meshStandardMaterial color={COLORS.spineCore} emissive={COLORS.emissive} emissiveIntensity={0.4} roughness={0.2} metalness={0.5} />
    </mesh>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN INFRASTRUCTURE MACHINE
// ═══════════════════════════════════════════════════════════════════════════

interface InfrastructureMachineProps {
  scrollProgress: number;
  mousePosition: { x: number; y: number };
}

export function InfrastructureMachine({ scrollProgress, mousePosition }: InfrastructureMachineProps) {
  const groupRef = useRef<THREE.Group>(null);
  const intensity = scrollProgress;
  const spineX = 1.5;
  const spineZ = -2;

  const conduitPaths = useMemo(() => {
    const sx = spineX;
    const sz = spineZ;
    return {
    heroLeft: [new THREE.Vector3(sx - 0.6, SECTIONS.hero, sz), new THREE.Vector3(-1, SECTIONS.hero + 1, 0), new THREE.Vector3(-3, SECTIONS.hero, 1), new THREE.Vector3(-4.5, SECTIONS.hero - 1, 0.5)],
    heroRight: [new THREE.Vector3(sx + 0.6, SECTIONS.hero - 2, sz), new THREE.Vector3(4, SECTIONS.hero - 1, -1), new THREE.Vector3(5.5, SECTIONS.hero - 3, 0)],
    aboutMain: [new THREE.Vector3(sx - 0.6, SECTIONS.about, sz), new THREE.Vector3(-1.5, SECTIONS.about + 0.5, 0), new THREE.Vector3(-3.5, SECTIONS.about, 1), new THREE.Vector3(-5, SECTIONS.about - 1, 0.5)],
    expMain: [new THREE.Vector3(sx - 0.6, SECTIONS.experience, sz), new THREE.Vector3(-2, SECTIONS.experience + 1, 0.5), new THREE.Vector3(-4, SECTIONS.experience, 1), new THREE.Vector3(-5.5, SECTIONS.experience - 0.5, 0.3)],
    expSecondary: [new THREE.Vector3(sx + 0.6, SECTIONS.experience + 2, sz), new THREE.Vector3(3, SECTIONS.experience + 1, 0), new THREE.Vector3(4.5, SECTIONS.experience, -0.5)],
    expTertiary: [new THREE.Vector3(sx - 0.6, SECTIONS.experience - 2, sz), new THREE.Vector3(-1, SECTIONS.experience - 3, 1), new THREE.Vector3(-3, SECTIONS.experience - 2.5, 1.5)],
    skillsMain: [new THREE.Vector3(sx + 0.6, SECTIONS.skills, sz), new THREE.Vector3(3, SECTIONS.skills + 0.5, 0), new THREE.Vector3(5, SECTIONS.skills, 0.5)],
    projectsMain: [new THREE.Vector3(sx - 0.6, SECTIONS.projects, sz), new THREE.Vector3(-2, SECTIONS.projects, 0.5), new THREE.Vector3(-4, SECTIONS.projects + 1, 1), new THREE.Vector3(-6, SECTIONS.projects, 0.5)],
    projectsSecondary: [new THREE.Vector3(sx + 0.6, SECTIONS.projects + 2, sz), new THREE.Vector3(2.5, SECTIONS.projects + 1, 0), new THREE.Vector3(4, SECTIONS.projects, -0.5), new THREE.Vector3(5.5, SECTIONS.projects - 1, 0)],
    projectsCross: [new THREE.Vector3(-6, SECTIONS.projects, 0.5), new THREE.Vector3(-3, SECTIONS.projects - 2, 0), new THREE.Vector3(0, SECTIONS.projects - 3, 0), new THREE.Vector3(3, SECTIONS.projects - 2, -0.5), new THREE.Vector3(5.5, SECTIONS.projects - 1, 0)],
    contactMain: [new THREE.Vector3(sx - 0.6, SECTIONS.contact, sz), new THREE.Vector3(-2, SECTIONS.contact, 0.5), new THREE.Vector3(-4, SECTIONS.contact - 1, 0.8)],
    verticalLeft: [new THREE.Vector3(-4.5, SECTIONS.hero - 1, 0.5), new THREE.Vector3(-5, SECTIONS.about, 0.6), new THREE.Vector3(-5.5, SECTIONS.experience - 0.5, 0.3), new THREE.Vector3(-5, SECTIONS.skills, 0.4), new THREE.Vector3(-6, SECTIONS.projects, 0.5)],
    verticalRight: [new THREE.Vector3(5.5, SECTIONS.hero - 3, 0), new THREE.Vector3(5, SECTIONS.experience, 0.5), new THREE.Vector3(5.5, SECTIONS.projects - 1, 0)],
  };
  }, [spineX, spineZ]);

  useFrame(() => {
    if (groupRef.current) {
      const targetRotX = mousePosition.y * 0.012;
      const targetRotY = mousePosition.x * 0.015;
      groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.02;
      groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.12} />
      <directionalLight position={[5, 10, 8]} intensity={0.35} color="#E0F2FE" />
      <directionalLight position={[-5, -5, -8]} intensity={0.15} color="#38BDF8" />
      <pointLight position={[0, 0, 6]} intensity={0.25 + intensity * 0.2} color="#0EA5E9" distance={20} />

      <EnergySpine intensity={intensity} />

      {Object.entries(conduitPaths).map(([key, points]) => (
        <EnergyConduit key={key} points={points} intensity={intensity} flowSpeed={key.includes('projects') ? 1.2 : 0.8} flowOffset={Object.keys(conduitPaths).indexOf(key) * 0.7} />
      ))}

      {/* HERO */}
      <SectionModule position={[-4.5, SECTIONS.hero - 1, 0.5]} size={[1.4, 0.6, 1]} intensity={intensity} type="logic" rotationOffset={0} />
      <SectionModule position={[5.5, SECTIONS.hero - 3, 0]} size={[1.2, 0.5, 0.9]} intensity={intensity} type="infra" rotationOffset={1.2} />

      {/* ABOUT */}
      <SectionModule position={[-5, SECTIONS.about - 1, 0.5]} size={[1.3, 0.55, 0.85]} intensity={intensity} type="data" rotationOffset={2.1} />

      {/* EXPERIENCE */}
      <SectionModule position={[-5.5, SECTIONS.experience - 0.5, 0.3]} size={[1.5, 0.7, 1.1]} intensity={intensity * 0.5} type="logic" rotationOffset={3} />
      <SectionModule position={[4.5, SECTIONS.experience, -0.5]} size={[1.2, 0.5, 0.8]} intensity={intensity * 0.5} type="data" rotationOffset={3.8} />
      <SectionModule position={[-3, SECTIONS.experience - 2.5, 1.5]} size={[1, 0.45, 0.7]} intensity={intensity * 0.5} type="infra" rotationOffset={4.5} />

      {/* SKILLS */}
      <SectionModule position={[5, SECTIONS.skills, 0.5]} size={[1.3, 0.6, 0.9]} intensity={intensity} type="ai" rotationOffset={5.2} />

      {/* PROJECTS - HIGH ENERGY */}
      <SectionModule position={[-6, SECTIONS.projects, 0.5]} size={[1.6, 0.75, 1.2]} intensity={intensity * 1.3} type="ai" rotationOffset={6} />
      <SectionModule position={[5.5, SECTIONS.projects - 1, 0]} size={[1.4, 0.65, 1]} intensity={intensity * 1.3} type="logic" rotationOffset={6.8} />
      <SectionModule position={[0, SECTIONS.projects - 3, 0]} size={[1.2, 0.5, 0.85]} intensity={intensity * 1.2} type="data" rotationOffset={7.5} />

      {/* CONTACT - TERMINAL */}
      <SectionModule position={[-4, SECTIONS.contact - 1, 0.8]} size={[1.1, 0.5, 0.75]} intensity={intensity * 0.6} type="terminal" rotationOffset={8} />

      {/* JUNCTION NODES */}
      <JunctionNode position={[spineX, SECTIONS.hero, spineZ]} intensity={intensity} />
      <JunctionNode position={[spineX, SECTIONS.about, spineZ]} intensity={intensity} />
      <JunctionNode position={[spineX, SECTIONS.experience, spineZ]} intensity={intensity * 0.7} />
      <JunctionNode position={[spineX, SECTIONS.skills, spineZ]} intensity={intensity} />
      <JunctionNode position={[spineX, SECTIONS.projects, spineZ]} intensity={intensity * 1.3} />
      <JunctionNode position={[spineX, SECTIONS.contact, spineZ]} intensity={intensity * 0.5} />

      {/* GEARS */}
      <MechanicalGear position={[-2, SECTIONS.hero + 3, -3]} radius={1.8} intensity={intensity} rotationSpeed={0.012} direction={1} />
      <MechanicalGear position={[4, SECTIONS.experience - 5, -2.5]} radius={1.5} intensity={intensity} rotationSpeed={0.015} direction={-1} />
      <MechanicalGear position={[-3, SECTIONS.projects + 4, -2]} radius={2} intensity={intensity} rotationSpeed={0.01} direction={1} />
      <MechanicalGear position={[3, SECTIONS.contact + 3, -3]} radius={1.3} intensity={intensity} rotationSpeed={0.018} direction={-1} />

      {/* ORBITAL RINGS */}
      <OrbitalRing position={[spineX, SECTIONS.hero - 7, spineZ]} radius={2} intensity={intensity} axis="y" />
      <OrbitalRing position={[spineX, SECTIONS.experience, spineZ]} radius={1.8} intensity={intensity * 0.7} axis="x" />
      <OrbitalRing position={[spineX, SECTIONS.projects + 7, spineZ]} radius={2.2} intensity={intensity * 1.2} axis="z" />
      <OrbitalRing position={[spineX, SECTIONS.contact, spineZ]} radius={1.5} intensity={intensity * 0.5} axis="y" />
    </group>
  );
}

export default InfrastructureMachine;
