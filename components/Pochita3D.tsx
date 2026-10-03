'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function PochitaModel() {
  const { scene } = useGLTF('/3d/pochita_lowpoly.glb');
  const meshRef = useRef<THREE.Group>(null);

  return <primitive ref={meshRef} object={scene} scale={1.2} />;
}

export default function Pochita3D({ fill = false }: { fill?: boolean }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div style={fill ? { width: '100%', height: '100%' } : { width: isMobile ? '200px' : '500px', height: isMobile ? '200px' : '500px' }}>
      <Canvas camera={{ position: [0, 0, 3], fov: 100 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <OrbitControls
          enableZoom={!isMobile && !fill}
          enablePan={!isMobile && !fill}
          enableRotate={!isMobile}
          autoRotate={true}
          autoRotateSpeed={2.0}
        />
        <PochitaModel />
      </Canvas>
    </div>
  );
}
