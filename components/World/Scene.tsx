import React, { Suspense } from 'react';
import { Canvas, ThreeElements } from '@react-three/fiber';
import { Cloud, Sky, Environment, OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { WhisperingGrass } from './Grass';
import { MirrorLake } from './MirrorLake';
import { ErodedRuins } from './Ruins';

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

interface SceneProps {
  onLocationChange: (pos: THREE.Vector3) => void;
}

const Lights = () => (
  <>
    <ambientLight intensity={0.6} color="#b8dbe6" />
    <directionalLight
      position={[100, 50, 50]}
      intensity={2}
      color="#fff8e7" // Warm sun
      castShadow
      shadow-mapSize={[2048, 2048]}
      shadow-camera-left={-200}
      shadow-camera-right={200}
      shadow-camera-top={200}
      shadow-camera-bottom={-200}
    />
    {/* Rim light for the ruins to emphasize curves */}
    <spotLight position={[-50, 50, -50]} intensity={1.5} color="#c9b8e6" angle={1} penumbra={1} />
  </>
);

export const WorldScene: React.FC<SceneProps> = () => {
  return (
    <Canvas shadows dpr={[1, 2]}>
      <PerspectiveCamera makeDefault position={[0, 10, 60]} fov={55} />
      <OrbitControls 
        enablePan={true} 
        enableZoom={true} 
        maxPolarAngle={Math.PI / 2 - 0.05} // Prevent going under ground
        minDistance={5}
        maxDistance={500} // Allow looking from much further away
        autoRotate={true}
        autoRotateSpeed={0.2}
      />

      <Lights />

      {/* Environment / Atmosphere */}
      <Sky 
        distance={450000} 
        sunPosition={[100, 20, 50]} 
        inclination={0} 
        azimuth={0.25} 
        turbidity={0.5}
        rayleigh={0.5} // Tiffany Blue / Clean feel
        mieCoefficient={0.005}
        mieDirectionalG={0.7}
      />
      <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Volumetric-ish Clouds Layered for scale */}
      <group position={[0, 0, 0]}>
         {/* Low lying heavy clouds/fog */}
         <Cloud opacity={0.6} speed={0.2} width={100} depth={20} segments={40} position={[-100, 20, -100]} color="#e6f5f8" />
         <Cloud opacity={0.6} speed={0.2} width={100} depth={20} segments={40} position={[100, 30, 100]} color="#e6f5f8" />
         
         {/* Mid level vast clouds */}
         <Cloud opacity={0.4} speed={0.1} width={200} depth={50} segments={50} position={[0, 60, -200]} color="white" />
         <Cloud opacity={0.4} speed={0.15} width={200} depth={50} segments={50} position={[150, 50, 0]} color="#d4e9ed" />
         
         {/* High altitude whisps */}
         <Cloud opacity={0.2} speed={0.3} width={300} depth={10} segments={30} position={[0, 120, 0]} color="#fff" />
      </group>

      {/* World Elements */}
      <Suspense fallback={null}>
        <group>
            <MirrorLake />
            <WhisperingGrass />
            <ErodedRuins />
        </group>
      </Suspense>

      {/* Post Processing */}
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.85} mipmapBlur intensity={1.2} radius={0.7} />
        <Vignette eskil={false} offset={0.1} darkness={0.4} />
      </EffectComposer>
      
      {/* Fog blending horizon - Increased range for larger world */}
      <fog attach="fog" args={['#d4e9ed', 80, 800]} />
    </Canvas>
  );
};