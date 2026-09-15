import React from 'react';
import { Scenario } from '../../types';
import { Trophy, CheckCircle2, Circle, Target, X } from 'lucide-react';
import { sound } from '../../audio/SoundEngine';

interface ObjectivesModalProps {
  scenario: Scenario;
  isOpen: boolean;
  onClose: () => void;
}

export const ObjectivesModal: React.FC<ObjectivesModalProps> = ({ scenario, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-['Chakra_Petch'] text-white">
                {scenario.name}
              </h2>
              <p className="text-xs text-slate-400">{scenario.subtitle}</p>
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
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/60">
            {scenario.description}
          </p>

          <h3 className="text-xs font-bold uppercase text-slate-400 font-['Chakra_Petch'] pt-2">
            Mission Objectives
          </h3>

          <div className="space-y-2.5">
            {scenario.objectives.map(obj => {
              const percent = Math.min(100, Math.round((obj.current / obj.target) * 100));
              return (
                <div
                  key={obj.id}
                  className={`p-3 rounded-xl border ${
                    obj.completed
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : 'bg-slate-800/40 border-slate-700/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {obj.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-500" />
                      )}
                      <span className={`text-xs font-bold ${obj.completed ? 'text-emerald-300' : 'text-slate-200'}`}>
                        {obj.description}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      {obj.current} / {obj.target}
                    </span>
                  </div>

                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full ${obj.completed ? 'bg-emerald-500' : 'bg-amber-500'} transition-all`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800 text-xs text-slate-400 flex justify-between items-center">
          <span>Complete all objectives to secure your franchise dominance!</span>
          <button
            onClick={() => { sound.playClickSound(); onClose(); }}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
