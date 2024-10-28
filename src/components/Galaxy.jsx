import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function GalaxyParticles({ color, size, speed, radius }) {
  const ref = useRef();
  
  // Generate spiral galaxy positions
  const positions = new Float32Array(2000 * 3);
  const arms = 3; // number of spiral arms
  
  for (let i = 0; i < 2000; i++) {
    const i3 = i * 3;
    const angle = (i / 2000) * Math.PI * 2;
    const spiral = (i / 2000) * radius;
    
    // Add spiral effect
    const armAngle = (angle * arms) + ((i / 2000) * Math.PI * 8);
    
    positions[i3] = Math.cos(armAngle) * spiral;
    positions[i3 + 1] = (Math.random() - 0.5) * 0.5;
    positions[i3 + 2] = Math.sin(armAngle) * spiral;
  }

  useFrame((state, delta) => {
    ref.current.rotation.y += delta * speed;
    ref.current.rotation.z += delta * speed * 0.1;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={size}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function Scene() {
  return (
    <>
      {/* Main purple galaxy */}
      <GalaxyParticles 
        color="#9c4dcc" 
        size={0.005} 
        speed={0.1} 
        radius={1.5} 
      />
      
      {/* Blue galaxy arm */}
      <GalaxyParticles 
        color="#4d7ccc" 
        size={0.003} 
        speed={0.15} 
        radius={1.2} 
      />
      
      {/* Pink galaxy arm */}
      <GalaxyParticles 
        color="#cc4d94" 
        size={0.004} 
        speed={0.12} 
        radius={1.3} 
      />
      
      {/* Background stars */}
      <GalaxyParticles 
        color="#ffffff" 
        size={0.002} 
        speed={0.05} 
        radius={2} 
      />
    </>
  );
}

export default function Galaxy() {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      zIndex: -1,
      background: 'linear-gradient(to bottom, #000000, #0a0a0a)'
    }}>
      <Canvas
        camera={{ position: [0, 0, 2], fov: 60 }}
        style={{ background: 'black' }}
      >
        <Scene />
        <ambientLight intensity={0.5} />
      </Canvas>
    </div>
  );
}
