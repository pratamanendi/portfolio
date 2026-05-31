'use client';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function ParticleField() {
  const mesh = useRef(null);
  const count = 1500;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      const hue = 0.5 + Math.random() * 0.2; // teal-cyan range
      const c = new THREE.Color().setHSL(hue, 0.6, 0.3 + Math.random() * 0.3);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.rotation.y = clock.getElapsedTime() * 0.03;
      mesh.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.015) * 0.05;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} vertexColors sizeAttenuation transparent opacity={0.7} />
    </points>
  );
}

export default function ThreeParticles() {
  return (
    <div className="three-bg" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }} dpr={[1, 1.5]} gl={{ antialias: false, powerPreference: 'low-power' }}>
        <ParticleField />
      </Canvas>
    </div>
  );
}
