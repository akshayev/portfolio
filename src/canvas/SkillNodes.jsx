import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Icosahedron, Text, Line } from '@react-three/drei';
import { generateFibonacciSphere } from '../utils/mathUtils';
import { playHoverPing } from '../utils/audioEngine';

const SKILLS = [
  'React 18',
  'TypeScript',
  'Python',
  'Agentic AI',
  'Gemini 2.0',
  'Supabase',
  'R3F',
  'GSAP',
  'Tailwind',
  'Node.js',
];

function SkillNode({ position, label }) {
  const [hovered, setHovered] = useState(false);

  const scale = hovered ? 1.5 : 1;
  const color = hovered ? '#FF7582' : '#C56C86';

  return (
    <group position={position}>
      <Line
        points={[[0, 0, 0], [-position[0], -position[1], -position[2]]]}
        color="#725A7A"
        opacity={0.3}
        transparent
      />
      <Icosahedron
        args={[0.5, 1]}
        scale={scale}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          playHoverPing();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <meshBasicMaterial color={color} wireframe />
      </Icosahedron>
      <Text
        position={[0, 1.2, 0]}
        fontSize={0.8}
        color="white"
        font="https://fonts.gstatic.com/s/spacegrotesk/v15/V8mQoQDjQSkGpu8PNMs46CEcOx3pD9E.woff"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        {label}
      </Text>
    </group>
  );
}

export default function SkillNodes() {
  const groupRef = useRef();

  // Generate sphere positions once
  const nodes = useMemo(() => generateFibonacciSphere(SKILLS.length, 15), []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
      groupRef.current.rotation.z += delta * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {SKILLS.map((skill, index) => (
        <SkillNode key={skill} position={nodes[index]} label={skill} />
      ))}
    </group>
  );
}
