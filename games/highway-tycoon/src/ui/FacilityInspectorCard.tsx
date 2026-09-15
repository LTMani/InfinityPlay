import React from 'react';
import { GameEngine } from '../core/GameEngine';
import { Fuel, Store, Bed, X, ArrowUpCircle, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import { sound } from '../audio/SoundEngine';

interface FacilityInspectorCardProps {
  facilityType: 'FUEL' | 'SHOP' | 'MOTEL' | null;
  engine: GameEngine;
  onClose: () => void;
}

export const FacilityInspectorCard: React.FC<FacilityInspectorCardProps> = ({
  facilityType,
  engine,
  onClose
}) => {
  if (!facilityType) return null;

  const cash = engine.economy.cash;

  let title = '';
  let icon = <Fuel className="w-5 h-5 text-amber-400" />;
  let currentLevel = 1;
  let upgradeCost = 1200;
  let capacityDescription = '';
  let nextPerk = '';
  let onUpgrade = () => {};

  if (facilityType === 'FUEL') {
    title = 'Fuel Pumps & Commercial Lanes';
    icon = <Fuel className="w-5 h-5 text-amber-400" />;
    currentLevel = engine.fuelCapacityLevel;
    upgradeCost = 1200 * currentLevel;
    capacityDescription = `${currentLevel * 2} Regular & Commercial Diesel Dispensers`;
    nextPerk = `+2 Additional High-Flow Fuel Dispensers & Faster Service`;
    onUpgrade = () => {
      if (engine.upgradeFacilityCapacity('FUEL')) {
        sound.playCashSound();
      } else {
        sound.playErrorSound();
      }
    };
  } else if (facilityType === 'SHOP') {
    title = 'Oasis QuickMart & Route 66 Diner';
    icon = <Store className="w-5 h-5 text-cyan-400" />;
    currentLevel = engine.storeCapacityLevel;
    upgradeCost = 1500 * currentLevel;
    capacityDescription = `Level ${currentLevel} Merchandising Shelves & Dining Patio`;
    nextPerk = `+Expanded Beverage Coolers, Snack Aisles & Patio Seating`;
    onUpgrade = () => {
      if (engine.upgradeFacilityCapacity('SHOP')) {
        sound.playCashSound();
      } else {
        sound.playErrorSound();
      }
    };
  } else if (facilityType === 'MOTEL') {
    title = 'Highway Motel Suites & Sleeper Cabins';
    icon = <Bed className="w-5 h-5 text-purple-400" />;
    currentLevel = engine.motelCapacityLevel;
    upgradeCost = 2000 * currentLevel;
    capacityDescription = `Level ${currentLevel} Soundproof Guest Suites & Trucker Cabins`;
    nextPerk = `+Additional Deluxe Rooms & Soundproof Overnight Suites`;
    onUpgrade = () => {
      if (engine.upgradeFacilityCapacity('MOTEL')) {
        sound.playCashSound();
      } else {
        sound.playErrorSound();
      }
    };
  }

  const canAfford = cash >= upgradeCost;

  return (
    <div className="fixed bottom-20 right-4 z-40 w-80 bg-slate-950/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl p-4 flex flex-col gap-3 select-none text-white animate-in slide-in-from-right-4 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner">
            {icon}
          </div>
          <div>
            <h4 className="text-xs font-black tracking-wide text-slate-100">{title}</h4>
            <span className="text-[10px] text-amber-400 font-bold">Capacity Level {currentLevel}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Stats Summary */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-2.5 flex flex-col gap-1.5 text-xs">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Current Setup:</span>
          <span className="font-bold text-slate-200">{capacityDescription}</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Upgrade Perk:</span>
          <span className="font-bold text-emerald-400 text-[10px] truncate max-w-[150px]">{nextPerk}</span>
        </div>
      </div>

      {/* Upgrade Action Button */}
      <button
        onClick={onUpgrade}
        disabled={!canAfford}
        className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-between transition shadow-lg ${
          canAfford
            ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black shadow-amber-500/20 active:scale-98'
            : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
        }`}
      >
        <span className="flex items-center gap-1.5">
          <ArrowUpCircle className="w-4 h-4" />
          <span>Upgrade Capacity (Lvl {currentLevel + 1})</span>
        </span>
        <span className="font-mono text-xs">${upgradeCost.toLocaleString()}</span>
      </button>
    </div>
  );
};
