import React, { useState } from 'react';
import { Camera, Compass, RotateCcw, RotateCw, ZoomIn, ZoomOut, Eye } from 'lucide-react';

interface CameraPresetBarProps {
  onPreset: (preset: 'OVERVIEW' | 'FUEL' | 'STORE' | 'MOTEL') => void;
  onRotate: (deg: number) => void;
  onZoom: (factor: number) => void;
  onReset: () => void;
}

export const CameraPresetBar: React.FC<CameraPresetBarProps> = ({
  onPreset,
  onRotate,
  onZoom,
  onReset
}) => {
  const [activePreset, setActivePreset] = useState<'OVERVIEW' | 'FUEL' | 'STORE' | 'MOTEL'>('FUEL');

  const handleSelectPreset = (preset: 'OVERVIEW' | 'FUEL' | 'STORE' | 'MOTEL') => {
    setActivePreset(preset);
    onPreset(preset);
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 flex items-center gap-1.5 bg-slate-950/90 backdrop-blur-xl border border-slate-800/90 p-1.5 rounded-2xl shadow-2xl select-none">
      {/* Preset Camera Views */}
      <div className="flex items-center gap-1 bg-slate-900/80 rounded-xl p-1 border border-slate-800">
        <button
          onClick={() => handleSelectPreset('OVERVIEW')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            activePreset === 'OVERVIEW'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Full Travel Plaza Overview"
        >
          <span>🌐</span>
          <span className="hidden sm:inline text-[11px]">Overview</span>
        </button>

        <button
          onClick={() => handleSelectPreset('FUEL')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            activePreset === 'FUEL'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Focus on Fuel Station & Commercial Lanes"
        >
          <span>⛽</span>
          <span className="hidden sm:inline text-[11px]">Fuel</span>
        </button>

        <button
          onClick={() => handleSelectPreset('STORE')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            activePreset === 'STORE'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Focus on QuickMart Store & Diner"
        >
          <span>🏪</span>
          <span className="hidden sm:inline text-[11px]">Store</span>
        </button>

        <button
          onClick={() => handleSelectPreset('MOTEL')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            activePreset === 'MOTEL'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Focus on Motel Lodge & Rest Park"
        >
          <span>🏨</span>
          <span className="hidden sm:inline text-[11px]">Motel</span>
        </button>
      </div>

      {/* Manual Fine Controls */}
      <div className="flex items-center gap-1 pl-1 border-l border-slate-800">
        <button
          onClick={() => onZoom(0.85)}
          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onZoom(1.15)}
          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onRotate(30)}
          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          title="Rotate Left 30°"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onRotate(-30)}
          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          title="Rotate Right 30°"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onReset}
          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-amber-300 transition"
          title="Reset Front View"
        >
          <Compass className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
