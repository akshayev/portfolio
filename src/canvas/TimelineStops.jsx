import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import useStore from '../store/useStore';
import { getZIndex } from '../utils/mathUtils';
import SkillNodes from './SkillNodes';

const STOP_SPACING_Z = 50;

const getDataKey = (sourceType) => (sourceType === 'project' ? 'projects' : sourceType);

const resolveRecord = (projectData, stop) => {
  const dataKey = getDataKey(stop?.source_type);
  const list = projectData?.[dataKey] || [];
  return list.find((item) => item.id === stop.source_id) || null;
};

const getColor = (stop, record) => {
  const label = String(stop?.label || record?.title || record?.organization || '').toLowerCase();
  if (stop?.source_type === 'project') return '#FF7582';
  if (stop?.source_type === 'creative' || label.includes('cucek')) return '#C56C86';
  return '#725A7A';
};

const getMeshType = (stop) => {
  if (stop?.type === 'major_milestone') return 'dodecahedron';
  if (stop?.source_type === 'project') return 'icosahedron';
  if (stop?.source_type === 'creative') return 'torus';
  return 'box';
};

// ---------------------------------------------------------------------------
// TimelineStopMesh — one 3D milestone object.
// quality.ringSegments controls orbit ring & halo detail.
// ---------------------------------------------------------------------------
function TimelineStopMesh({ stop, index, record, quality }) {
  const groupRef = useRef();
  const ringRef = useRef();
  const accentRef = useRef();
  const haloRef = useRef();
  const [isHovered, setIsHovered] = useState(false);

  const color = useMemo(() => getColor(stop, record), [record, stop]);
  const meshType = useMemo(() => getMeshType(stop), [stop]);
  const position = useMemo(() => {
    const x = index % 2 === 0 ? -5.5 : 5.5;
    const y = (index % 3) * 0.85 - 0.85;
    const z = getZIndex(stop, index) * -STOP_SPACING_Z;
    return [x, y, z];
  }, [index, stop]);

  // Derive segment counts from the quality profile.
  // ring/halo use ringSegments; accent icosahedron detail is always 0 (low-poly by design).
  const seg = quality.ringSegments;

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    const phase = elapsed * 1.1 + index * 0.65;
    const hoverBoost = isHovered ? 1.16 : 1;

    if (groupRef.current) {
      groupRef.current.rotation.y = elapsed * 0.5 + index * 0.08;
      groupRef.current.rotation.x = Math.sin(phase * 0.6) * 0.2;
      groupRef.current.position.y = position[1] + Math.sin(phase) * 0.45;
      groupRef.current.scale.setScalar(hoverBoost);
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = elapsed * 0.95;
      const pulse = 1 + Math.sin(phase * 1.7) * 0.06;
      ringRef.current.scale.setScalar(pulse * (isHovered ? 1.12 : 1));
    }

    if (accentRef.current) {
      accentRef.current.rotation.z = elapsed * 0.75;
      accentRef.current.scale.setScalar((1 + Math.sin(phase * 1.9) * 0.04) * (isHovered ? 1.08 : 1));
    }

    if (haloRef.current) {
      haloRef.current.rotation.y = elapsed * 0.45;
      haloRef.current.rotation.z = elapsed * 0.25;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh
        castShadow
        receiveShadow
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        {meshType === 'icosahedron' ? <icosahedronGeometry args={[3, 1]} /> : null}
        {meshType === 'box' ? <boxGeometry args={[4, 4, 4]} /> : null}
        {meshType === 'torus' ? <torusGeometry args={[2.8, 0.85, Math.max(8, seg / 4), seg]} /> : null}
        {meshType === 'dodecahedron' ? <dodecahedronGeometry args={[3.1, 0]} /> : null}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHovered ? 0.7 : 0.35}
          roughness={0.3}
          metalness={0.62}
        />
      </mesh>

      <mesh ref={accentRef} scale={1.38}>
        <icosahedronGeometry args={[2.2, 0]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={isHovered ? 0.26 : 0.14}
          roughness={1}
          metalness={0}
          emissive={color}
          emissiveIntensity={isHovered ? 0.9 : 0.55}
        />
      </mesh>

      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.6, 4.4, seg]} />
        <meshBasicMaterial color={color} transparent opacity={isHovered ? 0.4 : 0.24} />
      </mesh>

      <mesh ref={haloRef}>
        <torusGeometry args={[4.9, 0.2, Math.max(8, seg / 4), seg]} />
        <meshBasicMaterial color={color} transparent opacity={isHovered ? 0.3 : 0.12} />
      </mesh>

      <mesh position={[0, 3.7, 0]} scale={[0.3, 0.3, 0.3]}>
        <sphereGeometry args={[1, 20, 20]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isHovered ? 1.8 : 1.2} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// TimelineStops — renders all stops from the store in z_index order.
// ---------------------------------------------------------------------------
export default function TimelineStops({ quality }) {
  const projectData = useStore((state) => state.projectData);
  const rawStops = projectData?.timeline_stops || [];

  const stops = useMemo(
    () => [...rawStops].sort((a, b) => getZIndex(a) - getZIndex(b)),
    [rawStops],
  );

  return (
    <group>
      {stops.map((stop, index) => {
        const isSkillsStop = stop.id === 'stop-skills' || stop.source_type === 'skills';

        if (isSkillsStop) {
          const position = [
            index % 2 === 0 ? -5.5 : 5.5,
            (index % 3) * 0.85 - 0.85,
            getZIndex(stop, index) * -STOP_SPACING_Z,
          ];
          return (
            <group key={stop.id || `skills-${index}`} position={position}>
              <SkillNodes />
            </group>
          );
        }

        return (
          <TimelineStopMesh
            key={stop.id || `${stop.source_id}-${index}`}
            stop={stop}
            index={index}
            record={resolveRecord(projectData, stop)}
            quality={quality}
          />
        );
      })}
    </group>
  );
}
