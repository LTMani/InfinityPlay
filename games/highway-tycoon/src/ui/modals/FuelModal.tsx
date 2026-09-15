import React from 'react';
import { FuelStorage } from '../../simulation/petrol/FuelStorage';
import { FuelType } from '../../types';
import { Fuel, Zap, RefreshCw, DollarSign, X, Truck, BarChart3 } from 'lucide-react';
import { sound } from '../../audio/SoundEngine';

interface FuelModalProps {
  fuelStorage: FuelStorage;
  isOpen: boolean;
  onClose: () => void;
}

export const FuelModal: React.FC<FuelModalProps> = ({ fuelStorage, isOpen, onClose }) => {
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  if (!isOpen) return null;

  const handlePriceChange = (type: FuelType, delta: number) => {
    const current = fuelStorage.tanks[type].retailPricePerLiter;
    fuelStorage.setRetailPrice(type, current + delta);
    sound.playClickSound();
    forceUpdate();
  };

  const handleReorder = (type: FuelType) => {
    fuelStorage.triggerReorder(type);
    sound.playPumpSound();
    forceUpdate();
  };

  const handleToggleAuto = (type: FuelType) => {
    fuelStorage.toggleAutoReorder(type);
    sound.playClickSound();
    forceUpdate();
  };

  // Real-world octane label metadata
  const octaneDetails: Record<FuelType, { octane: string; subtitle: string; badgeBg: string; badgeText: string }> = {
    REGULAR: {
      octane: '87 UNLEADED',
      subtitle: 'Standard Gasoline for Passenger Sedans & Compacts',
      badgeBg: 'bg-amber-500 text-slate-950',
      badgeText: '87'
    },
    PREMIUM: {
      octane: '93 V-POWER',
      subtitle: 'High-Octane Formula for Sports Cars & Luxury SUVs',
      badgeBg: 'bg-red-600 text-white',
      badgeText: '93'
    },
    DIESEL: {
      octane: 'ULTRA-LOW DIESEL #2',
      subtitle: 'High-Torque Commercial Fuel for 18-Wheelers & Reefers',
      badgeBg: 'bg-emerald-600 text-white',
      badgeText: 'DIESEL'
    },
    ELECTRIC: {
      octane: '350kW DC FAST',
      subtitle: 'Ultra-High Voltage Direct Current CCS & NACS Supercharging',
      badgeBg: 'bg-cyan-500 text-slate-950',
      badgeText: '⚡ 350kW'
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-amber-500/50 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Fuel className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black font-['Chakra_Petch'] text-white tracking-wide">
                Underground Fuel Terminal & Octane Pricing
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400 font-mono font-bold">
                  <BarChart3 className="w-3.5 h-3.5" /> Crude Oil WTI: ${fuelStorage.getCrudeOilPrice()}/barrel
                </span>
                <span>• Wholesale Fuel Logistics</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => { sound.playClickSound(); onClose(); }}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-World Fuel Dispensers & Underground Storage Tanks */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[75vh] overflow-y-auto">
          {(['REGULAR', 'PREMIUM', 'DIESEL', 'ELECTRIC'] as FuelType[]).map(type => {
            const tank = fuelStorage.tanks[type];
            const percent = Math.round((tank.currentLiters / tank.maxCapacityLiters) * 100);
            const isEV = type === 'ELECTRIC';
            const detail = octaneDetails[type];

            return (
              <div
                key={type}
                className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 flex flex-col justify-between shadow-lg"
              >
                <div>
                  {/* Real-World Octane Badge Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`px-2.5 py-1 rounded-md font-black text-xs tracking-tight shadow-md ${detail.badgeBg}`}>
                        {detail.badgeText}
                      </div>
                      <div>
                        <h3 className="font-black text-sm text-white font-['Chakra_Petch']">
                          {detail.octane}
                        </h3>
                        <p className="text-[10px] text-slate-400 leading-tight line-clamp-1">
                          {detail.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Underground Tank Level Bar */}
                  <div className="space-y-1 mb-3 pt-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-400">UST Tank Inventory:</span>
                      <span className={`font-bold ${percent < 25 ? 'text-red-400' : 'text-slate-200'}`}>
                        {isEV ? 'Continuous Grid Power' : `${tank.currentLiters.toLocaleString()}L / ${tank.maxCapacityLiters.toLocaleString()}L (${percent}%)`}
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-700/80 p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          type === 'REGULAR' ? 'bg-amber-500' :
                          type === 'PREMIUM' ? 'bg-red-500' :
                          type === 'DIESEL' ? 'bg-emerald-500' : 'bg-cyan-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Pricing Matrix */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 mb-3">
                    <div>
                      <span className="text-slate-400 text-[10px] block font-medium">Wholesale Rack:</span>
                      <span className="font-mono text-slate-200 font-bold">
                        ${tank.costPerLiterWholesale.toFixed(2)} / {isEV ? 'kWh' : 'L'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block font-medium">Plaza Retail Margin:</span>
                      <span className="font-mono text-emerald-400 font-bold">
                        ${tank.retailPricePerLiter.toFixed(2)} / {isEV ? 'kWh' : 'L'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pricing & Logistics Controls */}
                <div className="space-y-2 pt-2 border-t border-slate-700/70">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-medium">Retail Price Adjustment:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handlePriceChange(type, -0.05)}
                        className="px-2.5 py-1 bg-slate-750 hover:bg-slate-700 text-white rounded-lg text-xs font-bold font-mono transition"
                      >
                        -$0.05
                      </button>
                      <button
                        onClick={() => handlePriceChange(type, 0.05)}
                        className="px-2.5 py-1 bg-slate-750 hover:bg-slate-700 text-emerald-400 rounded-lg text-xs font-bold font-mono transition"
                      >
                        +$0.05
                      </button>
                    </div>
                  </div>

                  {!isEV && (
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => handleToggleAuto(type)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium transition ${
                          tank.autoReorder
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-slate-700 text-slate-400'
                        }`}
                      >
                        <RefreshCw className="w-3 h-3" />
                        Auto-Refill: {tank.autoReorder ? 'ACTIVE' : 'OFF'}
                      </button>

                      <button
                        onClick={() => handleReorder(type)}
                        disabled={tank.orderPending || percent > 90}
                        className="text-xs px-3 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-black font-['Chakra_Petch'] rounded-lg flex items-center gap-1.5 transition shadow-md"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        {tank.orderPending ? 'Tanker In Route...' : 'Dispatch Tanker'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex justify-between items-center">
          <span>💡 Real-World Tip: Truckers buy 150+ liters of Diesel per fill! Keep diesel margins competitive to attract fleets.</span>
          <button
            onClick={() => { sound.playClickSound(); onClose(); }}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition"
          >
            Confirm & Close
          </button>
        </div>
      </div>
    </div>
  );
};
