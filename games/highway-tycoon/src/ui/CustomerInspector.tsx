import React from 'react';
import { Vehicle } from '../types';
import { Fuel, Moon, Utensils, DollarSign, X, ShieldAlert, Navigation, Gauge } from 'lucide-react';
import { sound } from '../audio/SoundEngine';

interface CustomerInspectorProps {
  vehicle: Vehicle | null;
  onClose: () => void;
}

export const CustomerInspector: React.FC<CustomerInspectorProps> = ({ vehicle, onClose }) => {
  if (!vehicle) return null;

  const stateLabels: Record<string, string> = {
    HIGHWAY_APPROACH: 'Cruising Interstate 66 Highway',
    DECIDING_EXIT: 'Evaluating Exit 142 Ramp',
    ENTERING_RAMP: 'Exiting via Deceleration Off-Ramp',
    QUEUING_FOR_PUMP: 'Queuing for Fuel Dispenser',
    REFUELING: 'Refueling at Pump Island',
    AT_MOTEL: 'Sleeping in Motel Suite',
    SHOPPING: 'Browsing Oasis QuickMart',
    EATING: 'Dining at Highway Grill',
    PARKED: 'Resting in Commercial Parking Bay',
    DRIVING_TO_EXIT: 'Navigating to On-Ramp',
    HIGHWAY_LEAVE: 'Merging onto Interstate Traffic'
  };

  const getClassIcon = (cls: string) => {
    switch (cls) {
      case 'SEMI_TRUCK':
      case 'REEFER_TRUCK':
        return '🚛 18-Wheeler Semi-Truck';
      case 'CAMPER_RV':
        return '🚐 Class-A Motorhome RV';
      case 'ELECTRIC_CAR':
        return '⚡ Electric Sedan (BEV)';
      case 'SPORTS_CAR':
        return '🏎️ High-Performance Coupe';
      case 'SUV':
        return '🚙 4x4 Sport Utility Vehicle';
      case 'MOTORCYCLE':
        return '🏍️ Cruiser Motorcycle';
      case 'TOUR_BUS':
        return '🚌 Commercial Highway Coach';
      default:
        return '🚗 Midsize Sedan';
    }
  };

  return (
    <div className="fixed top-20 right-4 z-40 w-88 bg-slate-950/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-right-4">
      {/* Header with Driver Profile */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg border border-white/20"
            style={{ backgroundColor: vehicle.color }}
          >
            🧑‍✈️
          </div>
          <div>
            <h3 className="font-black text-sm text-white font-['Chakra_Petch'] leading-tight">
              {vehicle.driverName}
            </h3>
            <span className="text-[10px] text-amber-400 font-medium">
              {getClassIcon(vehicle.vehicleClass)}
            </span>
          </div>
        </div>
        <button
          onClick={() => { sound.playClickSound(); onClose(); }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Live Activity Telemetry */}
      <div className="bg-slate-900/90 rounded-xl p-3 mb-3 border border-slate-800 shadow-inner">
        <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 mb-1">
          <span className="flex items-center gap-1">
            <Navigation className="w-3 h-3 text-sky-400" /> Current Action
          </span>
          <span className="font-mono text-emerald-400 font-bold">
            {vehicle.speed > 0.05 ? 'IN TRANSIT' : 'STATIONARY'}
          </span>
        </div>
        <span className="text-xs font-bold text-amber-300 font-['Chakra_Petch'] block leading-snug">
          {stateLabels[vehicle.state] || vehicle.state}
        </span>
      </div>

      {/* Driver Real-World Needs Gauges */}
      <div className="space-y-2.5 mb-3 bg-slate-900/50 p-3 rounded-xl border border-slate-800/80">
        {/* Fuel Gauge */}
        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-slate-300 flex items-center gap-1.5 font-medium">
              <Fuel className="w-3.5 h-3.5 text-amber-400" />
              Tank Level ({vehicle.fuelType})
            </span>
            <span className="font-mono font-bold text-slate-200">{Math.round(vehicle.fuelLevel)}%</span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all ${
                vehicle.fuelLevel < 25 ? 'bg-red-500' : 'bg-amber-500'
              }`}
              style={{ width: `${vehicle.fuelLevel}%` }}
            />
          </div>
        </div>

        {/* Fatigue Gauge */}
        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-slate-300 flex items-center gap-1.5 font-medium">
              <Moon className="w-3.5 h-3.5 text-purple-400" />
              Fatigue & Drowsiness
            </span>
            <span className="font-mono font-bold text-slate-200">{Math.round(vehicle.fatigue)}%</span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all ${
                vehicle.fatigue > 70 ? 'bg-red-500' : 'bg-purple-500'
              }`}
              style={{ width: `${vehicle.fatigue}%` }}
            />
          </div>
        </div>

        {/* Hunger Gauge */}
        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-slate-300 flex items-center gap-1.5 font-medium">
              <Utensils className="w-3.5 h-3.5 text-emerald-400" />
              Hunger & Appetite
            </span>
            <span className="font-mono font-bold text-slate-200">{Math.round(vehicle.hunger)}%</span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{ width: `${vehicle.hunger}%` }}
            />
          </div>
        </div>
      </div>

      {/* Financials & Toll Spend */}
      <div className="flex justify-between items-center bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Plaza Spend</span>
          <span className="font-mono font-black text-sm text-emerald-400">
            ${vehicle.spentTotal.toFixed(2)}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Driver Wallet</span>
          <span className="font-mono text-slate-300 font-bold">
            ${vehicle.cash.toFixed(0)}
          </span>
        </div>
      </div>
    </div>
  );
};
