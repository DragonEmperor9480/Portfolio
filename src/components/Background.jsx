import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import styled from 'styled-components';

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  background: linear-gradient(to bottom, #000000, #0a0a2e);
`;

function OrbitalPath({ radius }) {
  const points = [];
  const segments = 128;
  
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    points.push(
      new THREE.Vector3(
        Math.cos(theta) * radius,
        0,
        Math.sin(theta) * radius * 0.4 // Make orbit elliptical
      )
    );
  }

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial attach="material" color="#ffffff" transparent opacity={0.1} />
    </line>
  );
}

function Planet({ name, radius, distance, speed, color, rotationSpeed = 0.01 }) {
  const planetRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    planetRef.current.position.x = Math.cos(t) * distance;
    planetRef.current.position.z = Math.sin(t) * distance * 0.4; // Make orbit elliptical
    planetRef.current.rotation.y += rotationSpeed;
  });

  return (
    <group>
      <OrbitalPath radius={distance} />
      <mesh ref={planetRef}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshPhysicalMaterial 
          color={color}
          roughness={0.7}
          metalness={0.3}
          clearcoat={0.4}
          clearcoatRoughness={0.25}
        />
      </mesh>
    </group>
  );
}

const PLANETS_DATA = [
  { 
    name: 'Mercury', 
    radius: 0.383, 
    distance: 5, 
    speed: 0.48, 
    color: '#A0522D' 
  },
  { 
    name: 'Venus', 
    radius: 0.949, 
    distance: 7, 
    speed: 0.35, 
    color: '#DEB887' 
  },
  { 
    name: 'Earth', 
    radius: 1, 
    distance: 9, 
    speed: 0.29, 
    color: '#4B6FA3' 
  },
  { 
    name: 'Mars', 
    radius: 0.532, 
    distance: 11, 
    speed: 0.24, 
    color: '#CD5C5C' 
  },
  { 
    name: 'Jupiter', 
    radius: 1.8, 
    distance: 14, 
    speed: 0.13, 
    color: '#DEB887' 
  },
  { 
    name: 'Saturn', 
    radius: 1.6, 
    distance: 17, 
    speed: 0.097, 
    color: '#F4A460' 
  },
  { 
    name: 'Uranus', 
    radius: 1.2, 
    distance: 20, 
    speed: 0.068, 
    color: '#87CEEB' 
  },
  { 
    name: 'Neptune', 
    radius: 1.2, 
    distance: 23, 
    speed: 0.054, 
    color: '#1E90FF' 
  },
];

function Sun() {
  const sunRef = useRef();

  useFrame(() => {
    sunRef.current.rotation.y += 0.002;
  });

  return (
    <mesh ref={sunRef}>
      <sphereGeometry args={[3, 32, 32]} />
      <meshPhongMaterial
        color="#FDB813"
        emissive="#FDB813"
        emissiveIntensity={2}
        shininess={100}
      />
      <pointLight
        color="#FDB813"
        intensity={2}
        distance={100}
        decay={2}
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      {/* Enhanced lighting setup */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#FDB813" />
      
      {/* Rotate entire scene for side view */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        <Sun />
        {PLANETS_DATA.map((planet) => (
          <Planet key={planet.name} {...planet} />
        ))}
      </group>
      
      {/* Stars */}
      {Array.from({ length: 500 }).map((_, i) => (
        <mesh key={i} position={[
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100
        ]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial 
            color={Math.random() > 0.5 ? "#ffffff" : "#ffff00"}
            transparent
            opacity={Math.random() * 0.5 + 0.5}
          />
        </mesh>
      ))}
      
      <fog attach="fog" args={['#000', 40, 60]} />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 2.5}
      />
    </>
  );
}

export default function Background() {
  return (
    <BackgroundContainer>
      <Canvas
        camera={{
          position: [0, 0, 50], // Changed camera position for side view
          fov: 60,
        }}
        gl={{ antialias: true }}
      >
        <Scene />
      </Canvas>
    </BackgroundContainer>
  );
}
