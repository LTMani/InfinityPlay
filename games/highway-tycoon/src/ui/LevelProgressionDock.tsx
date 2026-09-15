import React, { useState } from 'react';
import { GameEngine } from '../core/GameEngine';
import { 
  ChevronUp, 
  ChevronDown, 
  ArrowUpCircle, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Trophy,
  Building2,
  DollarSign
} from 'lucide-react';
import { sound } from '../audio/SoundEngine';

interface LevelProgressionDockProps {
  engine: GameEngine;
  playerCash: number;
}

export const LevelProgressionDock: React.FC<LevelProgressionDockProps> = ({
  engine,
  playerCash
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const currentLevel = engine.plazaLevel;
  const currentConfig = engine.getCurrentLevelConfig();
  const nextConfig = engine.getNextLevelConfig();

  const canLevelUp = engine.canUpgradePlazaLevel();
  const devCheck = nextConfig ? engine.checkDevelopmentPrerequisite(nextConfig) : { met: true, details: '' };

  const handleLevelUpgrade = () => {
    if (engine.upgradePlazaLevel()) {
      sound.playFanfare();
    } else {
      sound.playErrorSound();
    }
  };

  const cashPercent = nextConfig && nextConfig.upgradeCost > 0
    ? Math.min(100, Math.round((playerCash / nextConfig.upgradeCost) * 100))
    : 100;

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1.5 max-w-3xl w-full px-4 select-none pointer-events-auto">
      {/* Main Glassmorphic Level Progression Panel */}
      <div className="w-full bg-slate-950/90 backdrop-blur-xl border border-slate-700/80 shadow-2xl rounded-2xl p-3 flex flex-col gap-2.5">
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/30 to-amber-600/10 border border-amber-400/60 flex flex-col items-center justify-center text-amber-400 font-black shadow-lg">
              <span className="text-[9px] uppercase tracking-tighter text-amber-300">LVL</span>
              <span className="text-base leading-none">{currentLevel}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white tracking-wide">
                  {currentConfig.name}
                </h3>
                <span className="text-[10px] font-bold text-slate-400 border border-slate-700 px-1.5 py-0.5 rounded-full">
                  100 Levels
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-sm hidden sm:block">
                {currentConfig.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Level Up Action */}
            {nextConfig ? (
              <button
                onClick={handleLevelUpgrade}
                disabled={!canLevelUp.eligible}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md ${
                  canLevelUp.eligible
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black shadow-amber-500/30 animate-pulse'
                    : 'bg-slate-900 border border-slate-700/80 text-slate-500 cursor-not-allowed'
                }`}
              >
                <ArrowUpCircle className="w-4 h-4" />
                <span>
                  {canLevelUp.eligible 
                    ? `Level Up ($${nextConfig.upgradeCost.toLocaleString()})`
                    : `Lvl ${nextConfig.level} Locked`}
                </span>
              </button>
            ) : (
              <div className="px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-xs font-bold flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                <span>Max Level 100</span>
              </div>
            )}

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              title="Toggle Level Details"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Next Level Dual Requirements Bar */}
        {nextConfig && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-900/80 border border-slate-800/80 rounded-xl p-2 text-xs">
            {/* 1. Cash Requirement */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1 font-bold text-slate-300">
                  <DollarSign className="w-3 h-3 text-emerald-400" />
                  <span>Required Cash:</span>
                </span>
                <span className={playerCash >= nextConfig.upgradeCost ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                  ${playerCash.toLocaleString()} / ${nextConfig.upgradeCost.toLocaleString()}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                  style={{ width: `${cashPercent}%` }}
                />
              </div>
            </div>

            {/* 2. Development Requirement */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1 font-bold text-slate-300">
                  <Building2 className="w-3 h-3 text-cyan-400" />
                  <span>Development Goal:</span>
                </span>
                <span className={devCheck.met ? 'text-cyan-400 font-bold' : 'text-amber-400'}>
                  {devCheck.details}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-400 truncate">
                {devCheck.met ? (
                  <CheckCircle2 className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-3 h-3 text-amber-400 flex-shrink-0" />
                )}
                <span className="truncate">{nextConfig.requiredDev.label}</span>
              </div>
            </div>
          </div>
        )}

        {/* Expanded Details Drawer */}
        {isExpanded && (
          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2 text-xs">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span className="font-bold text-slate-300">Current Level Unlocked Features:</span>
              <span className="text-[10px] text-amber-400/90 font-mono">
                Tip: Facility upgrades pop up directly in the 3D world
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {currentConfig.unlockedFeatures.map((feat, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-slate-300 text-[11px] flex items-center gap-1"
                >
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  <span>{feat}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
