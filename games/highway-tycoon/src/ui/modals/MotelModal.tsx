import React from 'react';
import { RoomManager } from '../../simulation/hospitality/RoomManager';
import { PlacedBuilding } from '../../types';
import { Bed, Sparkles, Moon, X, AlertCircle } from 'lucide-react';
import { sound } from '../../audio/SoundEngine';

interface MotelModalProps {
  roomManager: RoomManager;
  buildings: PlacedBuilding[];
  hasHousekeepers: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export const MotelModal: React.FC<MotelModalProps> = ({
  roomManager,
  buildings,
  hasHousekeepers,
  isOpen,
  onClose
}) => {
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  if (!isOpen) return null;

  const stats = roomManager.getStats(buildings);

  const handleRateChange = (type: 'STANDARD' | 'CABIN', delta: number) => {
    if (type === 'STANDARD') {
      roomManager.nightlyRateStandard = Math.max(20, Math.min(250, roomManager.nightlyRateStandard + delta));
    } else {
      roomManager.nightlyRateCabin = Math.max(15, Math.min(180, roomManager.nightlyRateCabin + delta));
    }
    sound.playClickSound();
    forceUpdate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-purple-500/40 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
              <Bed className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-['Chakra_Petch'] text-white">
                Highway Motel & Trucker Sleeper Cabins
              </h2>
              <p className="text-xs text-slate-400">
                Hospitality Operations, Cleanliness Turnover & Night Rates
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

        {/* Warning if no housekeepers */}
        {!hasHousekeepers && (
          <div className="mx-6 mt-4 p-3 bg-amber-500/20 border border-amber-500/40 rounded-xl flex items-center gap-3 text-xs text-amber-300">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-400" />
            <span>
              <strong>Warning:</strong> You have no housekeepers on staff! Dirty rooms will remain uncleaned and cannot be rented out until you hire housekeeping staff in the HR panel.
            </span>
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Occupancy Stats Grid */}
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="bg-slate-800/60 border border-slate-700 p-3 rounded-xl">
              <span className="text-xs text-slate-400 block mb-1">Total Rooms</span>
              <span className="text-xl font-bold text-white font-mono">{stats.totalRooms}</span>
            </div>
            <div className="bg-slate-800/60 border border-slate-700 p-3 rounded-xl">
              <span className="text-xs text-slate-400 block mb-1">Occupied</span>
              <span className="text-xl font-bold text-purple-400 font-mono">{stats.occupiedRooms}</span>
            </div>
            <div className="bg-slate-800/60 border border-slate-700 p-3 rounded-xl">
              <span className="text-xs text-slate-400 block mb-1">Vacant Clean</span>
              <span className="text-xl font-bold text-emerald-400 font-mono">{stats.cleanVacantRooms}</span>
            </div>
            <div className="bg-slate-800/60 border border-slate-700 p-3 rounded-xl">
              <span className="text-xs text-slate-400 block mb-1">Dirty / Turn</span>
              <span className="text-xl font-bold text-amber-400 font-mono">{stats.dirtyRooms}</span>
            </div>
          </div>

          {/* Rate Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Standard Motel Room */}
            <div className="bg-slate-800/40 border border-slate-700 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Bed className="w-5 h-5 text-purple-400" />
                <span className="font-bold text-sm text-purple-300 font-['Chakra_Petch']">
                  Classic Motel Suites
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Used by family roadtrippers, vacationers, and tourists.
              </p>
              <div className="flex items-center justify-between bg-slate-900/80 p-3 rounded-lg">
                <div>
                  <span className="text-xs text-slate-400 block">Nightly Rate:</span>
                  <span className="text-lg font-bold font-mono text-emerald-400">
                    ${roomManager.nightlyRateStandard}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRateChange('STANDARD', -5)}
                    className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded font-bold text-xs"
                  >
                    -$5
                  </button>
                  <button
                    onClick={() => handleRateChange('STANDARD', 5)}
                    className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded font-bold text-xs"
                  >
                    +$5
                  </button>
                </div>
              </div>
            </div>

            {/* Trucker Sleeper Cabin */}
            <div className="bg-slate-800/40 border border-slate-700 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Moon className="w-5 h-5 text-indigo-400" />
                <span className="font-bold text-sm text-indigo-300 font-['Chakra_Petch']">
                  Soundproof Trucker Cabins
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                High-demand sleeper pods favored by long-haul freight drivers.
              </p>
              <div className="flex items-center justify-between bg-slate-900/80 p-3 rounded-lg">
                <div>
                  <span className="text-xs text-slate-400 block">Nightly Rate:</span>
                  <span className="text-lg font-bold font-mono text-emerald-400">
                    ${roomManager.nightlyRateCabin}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRateChange('CABIN', -5)}
                    className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded font-bold text-xs"
                  >
                    -$5
                  </button>
                  <button
                    onClick={() => handleRateChange('CABIN', 5)}
                    className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded font-bold text-xs"
                  >
                    +$5
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800 text-xs text-slate-400 flex justify-between items-center">
          <span>💡 Tip: Sleepers check out in the morning. Fast housekeepers keep occupancy revenue continuous!</span>
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
