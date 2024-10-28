import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

function Planet({ radius, orbitRadius, speed, color, initialAngle = 0 }) {
  const ref = useRef();
  const orbit = useRef();

  // Create orbit points
  const points = [];
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2;
    points.push(
      Math.cos(angle) * orbitRadius,
      0,
      Math.sin(angle) * orbitRadius
    );
  }
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const angle = initialAngle + time * speed;
    
    // Update planet position in orbit
    ref.current.position.x = Math.cos(angle) * orbitRadius;
    ref.current.position.z = Math.sin(angle) * orbitRadius;
    
    // Rotate planet
    ref.current.rotation.y += 0.02;
  });

  return (
    <group ref={orbit}>
      {/* Orbit line */}
      <line>
        <bufferGeometry>
          <float32BufferAttribute 
            attach="attributes-position" 
            count={points.length / 3}
            array={new Float32Array(points)} 
            itemSize={3} 
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ffffff" opacity={0.2} transparent />
      </line>
      
      {/* Planet */}
      <mesh ref={ref}>
        <Sphere args={[radius, 32, 32]}>
          <meshPhongMaterial color={color} />
        </Sphere>
      </mesh>
    </group>
  );
}

function Sun() {
  const sunRef = useRef();
  
  useFrame(() => {
    sunRef.current.rotation.y += 0.005;
  });

  return (
    <mesh ref={sunRef}>
      <Sphere args={[2, 32, 32]}>
        <meshPhongMaterial
          color="#FDB813"
          emissive="#FDB813"
          emissiveIntensity={0.6}
        />
      </Sphere>
    </mesh>
  );
}

function Stars() {
  const starsRef = useRef();
  const starPositions = new Float32Array(6000);
  
  for (let i = 0; i < starPositions.length; i += 3) {
    starPositions[i] = (Math.random() - 0.5) * 100;
    starPositions[i + 1] = (Math.random() - 0.5) * 100;
    starPositions[i + 2] = (Math.random() - 0.5) * 100;
  }

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <float32BufferAttribute 
          attach="attributes-position" 
          count={starPositions.length / 3}
          array={starPositions} 
          itemSize={3} 
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#ffffff" />
    </points>
  );
}

function SolarSystemScene() {
  return (
    <>
      <Stars />
      
      {/* Lighting */}
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#FDB813" />
      
      {/* Sun */}
      <Sun />
      
      {/* Planets */}
      <Planet 
        radius={0.4} 
        orbitRadius={4} 
        speed={0.5} 
        color="#E27B58" 
        initialAngle={0}
      />
      <Planet 
        radius={0.6} 
        orbitRadius={6} 
        speed={0.3} 
        color="#8A7B72" 
        initialAngle={2}
      />
      <Planet 
        radius={0.8} 
        orbitRadius={8} 
        speed={0.2} 
        color="#2E619B" 
        initialAngle={4}
      />
      <Planet 
        radius={0.5} 
        orbitRadius={10} 
        speed={0.15} 
        color="#C1440E" 
        initialAngle={1}
      />
    </>
  );
}

export default function SolarSystem() {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      zIndex: -1,
      background: 'black'
    }}>
      <Canvas
        camera={{ 
          position: [0, 15, 20], 
          fov: 60,
          near: 0.1,
          far: 1000
        }}
      >
        <SolarSystemScene />
      </Canvas>
    </div>
  );
}
