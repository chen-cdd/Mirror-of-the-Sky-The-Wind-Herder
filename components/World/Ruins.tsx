import React from 'react';
import * as THREE from 'three';
import { ThreeElements } from '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

// Material: Chalky white ceramic/bone with micro-pores (simplified via roughness)
const RuinMaterial = () => (
  <meshPhysicalMaterial 
    color="#f0f4f5" 
    roughness={0.4}
    clearcoat={0.1}
    clearcoatRoughness={0.2}
    reflectivity={0.5}
  />
);

export const ErodedRuins: React.FC = () => {
  return (
    <group>
      {/* Giant Broken Ring - Scaled up and moved back */}
      <mesh position={[-120, 40, -150]} rotation={[0.5, 0.5, 0]} receiveShadow castShadow>
        <torusGeometry args={[80, 12, 32, 100, 4]} />
        <RuinMaterial />
      </mesh>
      
      {/* Fallen Monolith - Further out */}
      <mesh position={[120, 10, 80]} rotation={[0, 0, 1.4]} receiveShadow castShadow>
        <capsuleGeometry args={[15, 120, 8, 32]} />
        <RuinMaterial />
      </mesh>

      {/* Distant Spheres/Floating shapes - Massive scale in the sky */}
      <mesh position={[0, 150, -400]} receiveShadow>
        <sphereGeometry args={[60, 64, 64]} />
        <RuinMaterial />
      </mesh>

      {/* Partially buried arch near the mirror lake - Slightly larger */}
      <mesh position={[-40, -10, 40]} rotation={[0, -0.5, 0]} receiveShadow castShadow>
        <torusGeometry args={[30, 4, 16, 100, 3.5]} />
        <RuinMaterial />
      </mesh>
      
      {/* Distant Needles (New) */}
      <mesh position={[200, 0, -200]} rotation={[0, 0, 0]} receiveShadow castShadow>
         <coneGeometry args={[10, 200, 32]} />
         <RuinMaterial />
      </mesh>
      
      {/* Small debris details */}
      <mesh position={[25, 2, 25]} rotation={[Math.random(), Math.random(), Math.random()]} castShadow>
         <dodecahedronGeometry args={[4]} />
         <RuinMaterial />
      </mesh>
    </group>
  );
};