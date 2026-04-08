import { Canvas, useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import TimelineStops from './TimelineStops';
import useStore from '../store/useStore';

const DESKTOP_STAR_COUNT = 900;
const MOBILE_STAR_COUNT = 300;
const STOP_SPACING_Z = 50;
const CAMERA_START_Z = 14;
const CAMERA_END_PADDING = 28;
const FOCUS_RANGE = 24;

const clamp01 = (value) => Math.min(1, Math.max(0, value));

const getZIndex = (stop, fallback = 0) => {
  const parsed = Number(stop?.z_index);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const buildStopAnchor = (stop, index) => ({
  x: index % 2 === 0 ? -5.5 : 5.5,
  y: (index % 3) * 0.85 - 0.85,
  z: getZIndex(stop, index) * -STOP_SPACING_Z,
});

function CameraRig({ stops }) {
  const { camera } = useThree();
  const scrollProgress = useStore((state) => state.scrollProgress);
  const lookTarget = useRef({ x: 0, y: 0, z: 0 });
  const tiltState = useRef({ y: 0, z: 0 });

  const quickXRef = useRef(null);
  const quickYRef = useRef(null);
  const quickZRef = useRef(null);
  const quickTiltYRef = useRef(null);
  const quickTiltZRef = useRef(null);

  const sortedStops = useMemo(
    () => [...stops].sort((a, b) => getZIndex(a) - getZIndex(b)),
    [stops],
  );

  const stopAnchors = useMemo(
    () => sortedStops.map((stop, index) => buildStopAnchor(stop, index)),
    [sortedStops],
  );

  useEffect(() => {
    quickXRef.current = gsap.quickTo(camera.position, 'x', {
      duration: 0.65,
      ease: 'power3.out',
    });
    quickYRef.current = gsap.quickTo(camera.position, 'y', {
      duration: 0.65,
      ease: 'power3.out',
    });
    quickZRef.current = gsap.quickTo(camera.position, 'z', {
      duration: 0.85,
      ease: 'power3.out',
    });

    quickTiltYRef.current = gsap.quickTo(tiltState.current, 'y', {
      duration: 0.55,
      ease: 'sine.out',
    });
    quickTiltZRef.current = gsap.quickTo(tiltState.current, 'z', {
      duration: 0.55,
      ease: 'sine.out',
    });

    return () => {
      if (quickXRef.current?.tween) quickXRef.current.tween.kill();
      if (quickYRef.current?.tween) quickYRef.current.tween.kill();
      if (quickZRef.current?.tween) quickZRef.current.tween.kill();
      if (quickTiltYRef.current?.tween) quickTiltYRef.current.tween.kill();
      if (quickTiltZRef.current?.tween) quickTiltZRef.current.tween.kill();
    };
  }, [camera]);

  useEffect(() => {
    const normalizedProgress = clamp01(scrollProgress);
    const lastStopZ = stopAnchors.length ? stopAnchors[stopAnchors.length - 1].z : 0;
    const cameraEndZ = lastStopZ - CAMERA_END_PADDING;
    const targetZ = gsap.utils.interpolate(CAMERA_START_Z, cameraEndZ, normalizedProgress);

    let nearestStop = null;
    let nearestDistance = Number.POSITIVE_INFINITY;

    stopAnchors.forEach((anchor) => {
      const distance = Math.abs(targetZ - anchor.z);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestStop = anchor;
      }
    });

    const focusStrength = nearestStop ? clamp01(1 - nearestDistance / FOCUS_RANGE) : 0;
    const kineticSwayX = Math.sin(normalizedProgress * Math.PI * 5.5) * 2.8;
    const kineticSwayY = Math.sin(normalizedProgress * Math.PI * 3.25) * 1.1;

    const targetX = nearestStop
      ? gsap.utils.interpolate(kineticSwayX, nearestStop.x * 0.72, focusStrength)
      : kineticSwayX;
    const targetY = nearestStop
      ? gsap.utils.interpolate(kineticSwayY, nearestStop.y * 0.62, focusStrength)
      : kineticSwayY;

    quickXRef.current?.(targetX);
    quickYRef.current?.(targetY);
    quickZRef.current?.(targetZ);

    const lookAheadZ = targetZ - (12 + focusStrength * 8);
    lookTarget.current = {
      x: nearestStop ? gsap.utils.interpolate(0, nearestStop.x * 0.5, focusStrength) : 0,
      y: nearestStop ? gsap.utils.interpolate(0, nearestStop.y * 0.45, focusStrength) : 0,
      z: lookAheadZ,
    };

    quickTiltZRef.current?.((Math.sin(normalizedProgress * Math.PI * 8) * 0.075) * (1 - focusStrength * 0.35));
    quickTiltYRef.current?.((Math.cos(normalizedProgress * Math.PI * 6.5) * 0.06) * (1 - focusStrength * 0.2));
  }, [scrollProgress, stopAnchors]);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    const microSway = Math.sin(elapsed * 3.4 + scrollProgress * 9) * 0.012;
    const microYaw = Math.cos(elapsed * 2.8 + scrollProgress * 6.5) * 0.01;

    camera.lookAt(lookTarget.current.x, lookTarget.current.y, lookTarget.current.z);
    camera.rotation.z = tiltState.current.z + microSway;
    camera.rotation.y = tiltState.current.y + microYaw;
  });

  return null;
}

function TimelineScene() {
  return <TimelineStops />;
}

function ProceduralBackdrop({ onInitialized }) {
  const fieldRef = useRef();
  const cloudsRef = useRef();

  useEffect(() => {
    if (typeof onInitialized === 'function') {
      onInitialized();
    }
  }, [onInitialized]);

  const starCount = useMemo(
    () => (typeof window !== 'undefined' && window.innerWidth < 768 ? MOBILE_STAR_COUNT : DESKTOP_STAR_COUNT),
    [],
  );

  const starPositions = useMemo(() => {
    const positions = new Float32Array(starCount * 3);

    for (let index = 0; index < starCount; index += 1) {
      const radius = 18 + Math.random() * 28;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[index * 3 + 2] = radius * Math.cos(phi);
    }

    return positions;
  }, [starCount]);

  const cloudData = useMemo(
    () => [
      { position: [-7, 3, -18], scale: 3.8, opacity: 0.16 },
      { position: [6, 4, -22], scale: 4.4, opacity: 0.14 },
      { position: [0, -1, -16], scale: 5.2, opacity: 0.1 },
    ],
    [],
  );

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();

    if (fieldRef.current) {
      fieldRef.current.rotation.y = elapsed * 0.025;
      fieldRef.current.rotation.x = Math.sin(elapsed * 0.12) * 0.03;
    }

    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = elapsed * 0.015;
      cloudsRef.current.position.y = Math.sin(elapsed * 0.35) * 0.1;
      cloudsRef.current.children.forEach((cloud, index) => {
        const pulse = 1 + Math.sin(elapsed * 0.7 + index) * 0.035;
        cloud.scale.setScalar(cloud.userData.baseScale * pulse);
      });
    }
  });

  return (
    <group>
      <color attach="background" args={['#355C7D']} />
      <fog attach="fog" args={['#355C7D', 30, 340]} />

      <ambientLight intensity={1.4} />
      <directionalLight position={[8, 10, 6]} intensity={1.8} color="#FF7582" />
      <directionalLight position={[-8, -4, -8]} intensity={0.5} color="#ffffff" />

      <group ref={fieldRef}>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={0.08}
            color="#ffffff"
            transparent
            opacity={0.9}
            depthWrite={false}
            sizeAttenuation
          />
        </points>
      </group>

      <group ref={cloudsRef}>
        {cloudData.map((cloud, index) => (
          <mesh
            key={cloud.position.join('-')}
            position={cloud.position}
            scale={cloud.scale}
            userData={{ baseScale: cloud.scale }}
          >
            <sphereGeometry args={[1, 24, 24]} />
            <meshStandardMaterial
              color={index === 0 ? '#C56C86' : '#725A7A'}
              transparent
              opacity={cloud.opacity}
              roughness={1}
              metalness={0}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function PortfolioCanvas() {
  const projectData = useStore((state) => state.projectData);
  const onReady = useStore((state) => state.onReady);
  const stops = projectData?.timeline_stops || [];

  return (
    <Canvas
      className="pointer-events-auto fixed inset-0 z-0"
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 8], fov: 45, near: 0.1, far: 500 }}
    >
      <Suspense fallback={null}>
        <CameraRig stops={stops} />
        <ProceduralBackdrop onInitialized={onReady} />
        <TimelineScene />
      </Suspense>
    </Canvas>
  );
}
