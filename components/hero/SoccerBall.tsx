'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// The 12 vertex directions of an icosahedron — where the black pentagons sit
// on a classic football. White hexagons are implied by the space between them.
function icoDirections(): THREE.Vector3[] {
  const t = (1 + Math.sqrt(5)) / 2;
  const raw: [number, number, number][] = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ];
  return raw.map(([x, y, z]) => new THREE.Vector3(x, y, z).normalize());
}

function Ball({ onHoverChange }: { onHoverChange: (hovered: boolean) => void }) {
  const group = useRef<THREE.Group>(null);
  const hovered = useRef(false);

  const pentagons = useMemo(() => {
    const up = new THREE.Vector3(0, 0, 1);
    return icoDirections().map((dir) => {
      const q = new THREE.Quaternion().setFromUnitVectors(up, dir);
      const pos = dir.clone().multiplyScalar(1.004);
      return {
        position: [pos.x, pos.y, pos.z] as [number, number, number],
        quaternion: [q.x, q.y, q.z, q.w] as [number, number, number, number],
      };
    });
  }, []);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.x = 0.35;
    group.current.rotation.y += delta * (hovered.current ? 0.08 : 0.5);
  });

  return (
    <group
      ref={group}
      onPointerOver={() => {
        hovered.current = true;
        onHoverChange(true);
      }}
      onPointerOut={() => {
        hovered.current = false;
        onHoverChange(false);
      }}
    >
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color="#f6f9f7" roughness={0.34} metalness={0.08} />
      </mesh>
      {pentagons.map((p, i) => (
        <mesh key={i} position={p.position} quaternion={p.quaternion}>
          <circleGeometry args={[0.42, 5]} />
          <meshStandardMaterial
            color="#0a0c0b"
            roughness={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function SoccerBall({
  onHoverChange,
}: {
  onHoverChange: (hovered: boolean) => void;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.2], fov: 45 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent', cursor: 'pointer' }}
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 4, 5]} intensity={2.6} />
      <directionalLight position={[-4, -1, -3]} intensity={1.3} color="#2bff88" />
      <Ball onHoverChange={onHoverChange} />
    </Canvas>
  );
}
