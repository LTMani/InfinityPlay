import React from 'react';
import { GameEngine } from '../core/GameEngine';
import { GameSpeed } from '../types';
import { 
  DollarSign, 
  Clock, 
  Play, 
  Pause, 
  FastForward, 
  Volume2, 
  VolumeX, 
  Fuel, 
  Bed, 
  Users, 
  TrendingUp, 
  Cpu, 
  Star, 
  Trophy,
  RotateCcw,
  Zap,
  Store,
  Camera
} from 'lucide-react';
import { sound } from '../audio/SoundEngine';

interface HUDProps {
  engine: GameEngine;
  bayStats?: { occupied: number; total: number; queued: number };
  onResetCamera: () => void;
  onOpenFuel: () => void;
  onOpenMotel: () => void;
  onOpenStaff: () => void;
  onOpenFinance: () => void;
  onOpenTechTree: () => void;
  onOpenReviews: () => void;
  onOpenObjectives: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  engine,
  bayStats,
  onResetCamera,
  onOpenFuel,
  onOpenMotel,
  onOpenStaff,
  onOpenFinance,
  onOpenTechTree,
  onOpenReviews,
  onOpenObjectives
}) => {
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);
  const [isMuted, setIsMuted] = React.useState(sound.getIsMuted());

  const handleSpeedChange = (speed: GameSpeed) => {
    engine.gameSpeed = speed;
    sound.playClickSound();
    forceUpdate();
  };

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    forceUpdate();
  };

  const hourFormatted = engine.hour.toString().padStart(2, '0');
  const minuteFormatted = engine.minute.toString().padStart(2, '0');
  const isNight = engine.hour < 6 || engine.hour >= 20;

  // Active occupancy & fuel percentages
  const regularTank = engine.fuelStorage.tanks.REGULAR;
  const regularPct = Math.round((regularTank.currentLiters / regularTank.maxCapacityLiters) * 100);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 px-4 py-2 flex items-center justify-between gap-3 shadow-2xl">
      {/* Brand & Highway Shield */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="relative flex flex-col items-center justify-center w-10 h-10 bg-gradient-to-b from-blue-700 to-blue-900 border-2 border-white rounded-t-xl rounded-b-2xl shadow-lg shadow-blue-950/80">
          <div className="w-full bg-red-600 text-[7px] font-black text-center text-white uppercase tracking-tighter leading-none py-0.5 rounded-t-lg">
            INTERSTATE
          </div>
          <span className="text-white font-black text-xs font-['Chakra_Petch'] leading-none mt-0.5">
            66
          </span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xs sm:text-sm font-black tracking-wider uppercase font-['Chakra_Petch'] text-white">
              Highway Oasis <span className="text-amber-400">Plaza</span>
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 flex items-center gap-1">
              <span>★</span>
              <span>LVL {engine.plazaLevel}</span>
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
            {engine.scenario.name} • Milepost 142.8
          </p>
        </div>
      </div>

      {/* Primary Financial & Clock Gauges */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Cash Treasury */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-emerald-500/40 px-3 py-1.5 rounded-xl shadow-inner shadow-emerald-950/40">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/40">
            <DollarSign className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[8px] uppercase font-bold tracking-widest text-slate-400 block leading-none">
              Operating Funds
            </span>
            <span className="text-sm sm:text-base font-black font-mono text-emerald-400 leading-tight">
              ${engine.economy.cash.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Date & Time Digital Clock */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/90 px-2.5 py-1.5 rounded-xl">
          <span className="text-sm">{isNight ? '🌙' : '☀️'}</span>
          <div>
            <span className="text-[8px] uppercase font-bold tracking-widest text-slate-400 block leading-none">
              Day {engine.day}
            </span>
            <span className="text-xs sm:text-sm font-black font-mono text-slate-200 leading-tight">
              {hourFormatted}:{minuteFormatted}
            </span>
          </div>
        </div>

        {/* Plaza Bays Gauge */}
        {bayStats && (
          <div className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition ${
            bayStats.queued > 0
              ? 'bg-amber-500/15 border-amber-500/60 shadow-lg shadow-amber-950/40 animate-pulse'
              : 'bg-slate-900/90 border-slate-700/90'
          }`}>
            <span className="text-sm">{bayStats.queued > 0 ? '⚠️' : '🅿️'}</span>
            <div>
              <span className="text-[8px] uppercase font-bold tracking-widest text-slate-400 block leading-none">
                Bays
              </span>
              <span className={`text-xs font-black font-mono leading-tight ${
                bayStats.queued > 0 ? 'text-amber-400' : 'text-slate-200'
              }`}>
                {bayStats.occupied}/{bayStats.total} {bayStats.queued > 0 ? `(${bayStats.queued} Q)` : ''}
              </span>
            </div>
          </div>
        )}

        {/* Speed Controls */}
        <div className="flex items-center bg-slate-900 rounded-xl p-0.5 border border-slate-800">
          <button
            onClick={() => handleSpeedChange(0)}
            className={`p-1.5 rounded-lg text-xs transition ${
              engine.gameSpeed === 0
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Pause Simulation (Space)"
          >
            <Pause className="w-3 h-3" />
          </button>
          <button
            onClick={() => handleSpeedChange(1)}
            className={`px-2 py-1 rounded-lg text-xs font-bold font-mono transition ${
              engine.gameSpeed === 1
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Normal Speed 1x (Key 1)"
          >
            1x
          </button>
          <button
            onClick={() => handleSpeedChange(2)}
            className={`px-2 py-1 rounded-lg text-xs font-bold font-mono transition ${
              engine.gameSpeed === 2
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Fast Speed 2x (Key 2)"
          >
            2x
          </button>
          <button
            onClick={() => handleSpeedChange(5)}
            className={`px-2 py-1 rounded-lg text-xs font-bold font-mono transition ${
              engine.gameSpeed === 5
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Hyper Speed 5x (Key 5)"
          >
            5x
          </button>
        </div>

        {/* Reputation Star Badge */}
        <button
          onClick={onOpenReviews}
          className="flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-800 border border-amber-500/40 px-2.5 py-1.5 rounded-xl transition shadow-md"
          title="Customer Reviews & Rating"
        >
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs sm:text-sm font-bold text-amber-400 font-mono">
            {engine.reputationStars}
          </span>
          <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
            ({engine.reviews.length})
          </span>
        </button>
      </div>

      {/* Streamlined Management Portals */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Operations Hub: Fuel, Motel, Staff */}
        <div className="flex items-center gap-1 bg-slate-900/70 p-0.5 rounded-xl border border-slate-800/80">
          <button
            onClick={onOpenFuel}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition"
            title="Fuel Storage & Tank Management"
          >
            <Fuel className="w-3 h-3" />
            <span className="hidden lg:inline">Fuel</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 font-mono">
              {regularPct}%
            </span>
          </button>

          <button
            onClick={onOpenMotel}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-bold transition"
            title="Motel Rooms & Housekeeping"
          >
            <Bed className="w-3 h-3" />
            <span className="hidden lg:inline">Motel</span>
          </button>

          <button
            onClick={onOpenStaff}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold transition"
            title="Staff Hiring & Wages"
          >
            <Users className="w-3 h-3" />
            <span className="hidden lg:inline">Staff</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-blue-500/20 font-mono">
              {engine.staffManager.staff.length}
            </span>
          </button>
        </div>

        {/* Corporate Hub: Ledger, R&D, Goals */}
        <div className="flex items-center gap-1 bg-slate-900/70 p-0.5 rounded-xl border border-slate-800/80">
          <button
            onClick={onOpenFinance}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition"
            title="Financial Ledger & Income Statement"
          >
            <TrendingUp className="w-3 h-3" />
            <span className="hidden xl:inline">Ledger</span>
          </button>

          <button
            onClick={onOpenTechTree}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition"
            title="Research & Technology"
          >
            <Cpu className="w-3 h-3" />
            <span className="hidden xl:inline">R&D</span>
          </button>

          <button
            onClick={onOpenObjectives}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs font-bold transition"
            title="Milestone Goals & Objectives"
          >
            <Trophy className="w-3 h-3" />
            <span className="hidden xl:inline">Goals</span>
          </button>
        </div>

        {/* System & Audio Controls */}
        <div className="flex items-center gap-1 pl-1 border-l border-slate-800">
          <button
            onClick={handleToggleMute}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-slate-200" />}
          </button>

          <button
            onClick={() => {
              if (confirm('Reset scenario and start over?')) {
                engine.resetGame();
              }
            }}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 transition"
            title="Reset Scenario"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
