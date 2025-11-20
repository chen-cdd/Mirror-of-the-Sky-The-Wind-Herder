import React, { useState, useEffect } from 'react';
import { Wind, Disc, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { generateWindWhisper } from '../services/geminiService';
import { LocationType, LoreEntry } from '../types';

export const UIOverlay: React.FC = () => {
  const [lore, setLore] = useState<LoreEntry[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [muted, setMuted] = useState(true); // Simulating audio state
  const [currentLocation, setCurrentLocation] = useState<LocationType>(LocationType.MIRROR_VOID);

  // In a real app, we would raycast to find actual location. 
  // Here we simulate location changing periodically or randomly for the demo experience
  useEffect(() => {
    const timer = setInterval(() => {
       const locs = Object.values(LocationType);
       setCurrentLocation(locs[Math.floor(Math.random() * locs.length)]);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const handleListenToWind = async () => {
    setIsListening(true);
    const text = await generateWindWhisper(currentLocation);
    
    const newEntry: LoreEntry = {
      id: Date.now().toString(),
      text,
      location: currentLocation,
      timestamp: Date.now()
    };

    setLore(prev => [newEntry, ...prev].slice(0, 3)); // Keep last 3
    setIsListening(false);
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 md:p-12 z-10">
      
      {/* Header */}
      <header className="flex justify-between items-start">
        <div>
            <h1 className="text-3xl md:text-5xl font-thin tracking-[0.2em] text-white drop-shadow-lg uppercase opacity-90">
              Sky Realm
            </h1>
            <h2 className="text-sm md:text-lg font-light tracking-widest text-slate-200 opacity-80 mt-1">
              WIND SHEPHERD
            </h2>
        </div>

        <div className="pointer-events-auto">
          <button 
            onClick={() => setMuted(!muted)}
            className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all text-white"
          >
            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      </header>

      {/* Center/Right: Lore Display */}
      <div className="absolute top-1/2 right-6 md:right-12 transform -translate-y-1/2 w-full md:w-96 flex flex-col items-end space-y-4 pointer-events-none">
        {lore.map((entry, index) => (
            <div 
                key={entry.id}
                className={`bg-black/20 backdrop-blur-lg border-r-2 border-white/40 p-6 text-right transition-all duration-1000 ease-out ${index === 0 ? 'opacity-100 translate-x-0' : 'opacity-50 translate-x-4 scale-95'}`}
            >
                <p className="text-white/90 font-light italic leading-relaxed text-lg font-serif">
                    "{entry.text}"
                </p>
                <div className="mt-2 flex items-center justify-end gap-2 text-xs text-white/60 uppercase tracking-widest">
                    <Wind size={12} />
                    <span>{entry.location}</span>
                </div>
            </div>
        ))}
      </div>

      {/* Footer Controls */}
      <footer className="flex justify-between items-end">
        
        {/* Location Indicator */}
        <div className="flex flex-col gap-1">
            <div className="text-xs text-white/50 uppercase tracking-widest">Current Region</div>
            <div className="text-xl text-white font-light tracking-wide flex items-center gap-2">
                <Disc size={18} className="animate-spin-slow" />
                {currentLocation}
            </div>
            <div className="h-px w-24 bg-white/30 mt-2"></div>
        </div>

        {/* Interaction Button */}
        <div className="pointer-events-auto">
            <button
                onClick={handleListenToWind}
                disabled={isListening}
                className={`
                    group relative overflow-hidden px-8 py-4 rounded-none 
                    bg-gradient-to-r from-white/10 to-white/5 
                    backdrop-blur-md border border-white/20
                    hover:border-white/50 transition-all duration-500
                    flex items-center gap-3
                `}
            >
                <div className={`absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500`}></div>
                
                {isListening ? (
                    <Sparkles className="text-cyan-200 animate-pulse" />
                ) : (
                    <Wind className="text-white group-hover:rotate-12 transition-transform" />
                )}
                
                <span className="text-white font-light tracking-[0.15em] uppercase relative z-10">
                    {isListening ? "Listening..." : "Commune with Wind"}
                </span>
            </button>
        </div>
      </footer>

      {/* Decorative Elements */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-white/20 text-xs tracking-[0.5em] pointer-events-none">
         THE VOID REFLECTS ALL
      </div>
    </div>
  );
};
