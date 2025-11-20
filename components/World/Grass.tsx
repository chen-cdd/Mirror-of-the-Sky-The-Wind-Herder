import React, { useRef, useMemo, useLayoutEffect } from 'react';
import { useFrame, ThreeElements } from '@react-three/fiber';
import * as THREE from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

// Vertex shader to simulate wind waves
const vertexShader = `
  varying vec2 vUv;
  uniform float uTime;
  
  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Wind simulation using simple sine waves based on world position
    vec4 worldPos = instanceMatrix * vec4(pos, 1.0);
    
    float waveBig = sin(uTime * 0.5 + worldPos.x * 0.05 + worldPos.z * 0.05);
    float waveSmall = sin(uTime * 2.0 + worldPos.x * 0.5 + worldPos.z * 0.2);
    
    // Apply bend only to the top vertices (uv.y > 0.5)
    if (vUv.y > 0.1) {
      float lean = vUv.y * vUv.y; // Quadratic curve for bending
      pos.x += (waveBig * 1.5 + waveSmall * 0.5) * lean;
      pos.z += (waveBig * 0.5 + waveSmall * 0.2) * lean;
    }
    
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  
  void main() {
    // Gradient from deep teal to golden tip
    vec3 colorRoot = vec3(0.0, 0.2, 0.25); // Deep teal
    vec3 colorMid = vec3(0.2, 0.6, 0.3);   // Grassy green
    vec3 colorTip = vec3(0.8, 0.9, 0.6);   // Golden/White light
    
    vec3 color = mix(colorRoot, colorMid, vUv.y);
    color = mix(color, colorTip, smoothstep(0.7, 1.0, vUv.y));
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

export const WhisperingGrass: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  // Increased count for larger world
  const instanceCount = 60000;
  
  // Generate random positions for grass
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  useLayoutEffect(() => {
    if (!meshRef.current) return;
    
    // Distribute grass in a much larger area
    // Start further out (60m) and extend deep into the fog (600m)
    for (let i = 0; i < instanceCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      // Exponential distribution to keep some density near but allow far spread
      const radius = 60 + Math.pow(Math.random(), 1.5) * 540; 
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      // Perlin-ish noise for height variance (simplified)
      const scaleY = 1.5 + Math.random() * 1.5; 
      
      dummy.position.set(x, 0, z);
      dummy.scale.set(1, scaleY, 1);
      dummy.rotation.y = Math.random() * Math.PI;
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const uniforms = useMemo(() => ({
    uTime: { value: 0 }
  }), []);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, instanceCount]} castShadow receiveShadow>
      <planeGeometry args={[0.3, 2, 1, 4]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.DoubleSide}
        uniforms={uniforms}
        transparent
      />
    </instancedMesh>
  );
};