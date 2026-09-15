import React from 'react';
import { GameEngine } from '../../core/GameEngine';
import { RESEARCH_TECHS } from '../../data/researchTree';
import { Cpu, CheckCircle2, Lock, Zap, X } from 'lucide-react';
import { sound } from '../../audio/SoundEngine';

interface TechTreeModalProps {
  engine: GameEngine;
  isOpen: boolean;
  onClose: () => void;
}

export const TechTreeModal: React.FC<TechTreeModalProps> = ({ engine, isOpen, onClose }) => {
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  if (!isOpen) return null;

  const handleResearch = (techId: string, cost: number) => {
    const success = engine.unlockTech(techId, cost);
    if (success) {
      forceUpdate();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-['Chakra_Petch'] text-white">
                R&D Technology Tree
              </h2>
              <p className="text-xs text-slate-400">
                Unlock Automation, Throughput Upgrades & Solar Microgrids
              </p>
            </div>
          </div>
          <button
            onClick={() => { sound.playClickSound(); onClose(); }}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[75vh] overflow-y-auto">
          {RESEARCH_TECHS.map(tech => {
            const isUnlocked = engine.unlockedTechIds.has(tech.id);
            const canAfford = engine.economy.canAfford(tech.cost);
            const prereqsMet = tech.prerequisites.every(p => engine.unlockedTechIds.has(p));
            const canResearch = !isUnlocked && canAfford && prereqsMet;

            return (
              <div
                key={tech.id}
                className={`p-4 rounded-xl border flex flex-col justify-between transition ${
                  isUnlocked
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : prereqsMet
                    ? 'bg-slate-800/60 border-slate-700'
                    : 'bg-slate-950/40 border-slate-800 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-white font-['Chakra_Petch']">
                      {tech.name}
                    </span>
                    {isUnlocked ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold">
                        <CheckCircle2 className="w-4 h-4" /> Active
                      </span>
                    ) : !prereqsMet ? (
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Lock className="w-3.5 h-3.5" /> Locked
                      </span>
                    ) : (
                      <span className="text-xs font-mono font-bold text-amber-400">
                        ${tech.cost.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mb-2">{tech.description}</p>
                  <div className="inline-block px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 text-[11px] font-medium mb-3">
                    ⚡ {tech.effectDescription}
                  </div>
                </div>

                {!isUnlocked && (
                  <button
                    onClick={() => handleResearch(tech.id, tech.cost)}
                    disabled={!canResearch}
                    className={`w-full py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                      canResearch
                        ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/20'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {!prereqsMet
                      ? 'Requires Prior Technology'
                      : !canAfford
                      ? 'Insufficient Funds'
                      : `Unlock Upgrade ($${tech.cost.toLocaleString()})`}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800 text-xs text-slate-400 flex justify-between items-center">
          <span>💡 Solar Canopies cut your building electrical bills in half forever!</span>
          <button
            onClick={() => { sound.playClickSound(); onClose(); }}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg text-xs transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
