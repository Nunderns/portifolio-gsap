'use client';

import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function PochitaModel() {
  const { scene } = useGLTF('/3d/pochita_lowpoly.glb');
  const meshRef = useRef<THREE.Group>(null);

  return <primitive ref={meshRef} object={scene} scale={1.2} />;
}

export default function Pochita3D() {
  return (
    <div style={{ width: '500px', height: '500px' }}>
      <Canvas camera={{ position: [0, 0, 3], fov: 100 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} autoRotate={true} autoRotateSpeed={2.0} />
        <PochitaModel />
      </Canvas>
    </div>
  );
}
