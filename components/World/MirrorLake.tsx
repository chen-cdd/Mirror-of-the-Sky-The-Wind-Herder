import React from 'react';
import { MeshReflectorMaterial } from '@react-three/drei';
import { ThreeElements } from '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

export const MirrorLake: React.FC = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
      <planeGeometry args={[5000, 5000]} />
      <MeshReflectorMaterial
        blur={[300, 100]} // Blur ground reflections (width, height), 0 skips blur
        resolution={1024} // Off-buffer resolution, lower=faster, higher=better quality
        mixBlur={1} // How much blur mixes with surface roughness (default = 1)
        mixStrength={40} // Strength of the reflection
        roughness={0.05} // Mirror-like but slightly imperfect
        depthScale={1.2} // Scale the depth factor (0 = no depth, default = 0)
        minDepthThreshold={0.4} // Lower edge for the depthTexture interpolation (default = 0)
        maxDepthThreshold={1.4} // Upper edge for the depthTexture interpolation (default = 0)
        color="#d0e6f0" // Base color of the salt crust
        metalness={0.6}
        mirror={1} // Mirror environment
      />
    </mesh>
  );
};