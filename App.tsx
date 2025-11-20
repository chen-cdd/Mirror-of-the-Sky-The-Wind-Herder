import React from 'react';
import { WorldScene } from './components/World/Scene';
import { UIOverlay } from './components/UIOverlay';

const App: React.FC = () => {
  return (
    <div className="w-full h-screen relative bg-gradient-to-b from-[#d4e9ed] to-[#a8c0cc]">
      <UIOverlay />
      <WorldScene onLocationChange={(pos) => console.log(pos)} />
    </div>
  );
};

export default App;
