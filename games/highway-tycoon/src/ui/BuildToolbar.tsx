import React, { useState } from 'react';
import { BuildingDefinition } from '../types';
import { BUILDING_DEFINITIONS } from '../data/buildingDefinitions';
import { 
  Fuel, 
  Bed, 
  Store, 
  Hammer, 
  Trash2, 
  TreePine, 
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { sound } from '../audio/SoundEngine';

interface BuildToolbarProps {
  selectedDef: BuildingDefinition | null;
  onSelectDef: (def: BuildingDefinition | null) => void;
  isDemolishMode: boolean;
  onToggleDemolish: () => void;
  playerCash: number;
}

type CategoryTab = 'PETROL' | 'HOSPITALITY' | 'COMMERCIAL' | 'INFRASTRUCTURE' | 'DECOR';

export const BuildToolbar: React.FC<BuildToolbarProps> = ({
  selectedDef,
  onSelectDef,
  isDemolishMode,
  onToggleDemolish,
  playerCash
}) => {
  const [activeTab, setActiveTab] = useState<CategoryTab>('PETROL');
  // Default to collapsed so the entire 3D world is 100% visible!
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTabChange = (tab: CategoryTab) => {
    setActiveTab(tab);
    setIsExpanded(true); // Auto-expand when a tab is selected
    sound.playClickSound();
  };

  const handleSelectBuilding = (def: BuildingDefinition) => {
    sound.playClickSound();
    if (selectedDef?.id === def.id) {
      onSelectDef(null);
    } else {
      if (isDemolishMode) onToggleDemolish();
      onSelectDef(def);
    }
  };

  const items = Object.values(BUILDING_DEFINITIONS).filter(b => b.category === activeTab);

  // Helper icons for specific real-world buildings
  const getBuildingBadgeIcon = (id: string) => {
    if (id === 'EV_STATION') return '⚡';
    if (id === 'DIESEL_ISLAND') return '🚛';
    if (id === 'PUMP_ISLAND') return '⛽';
    if (id === 'MOTEL_ROOM') return '🏨';
    if (id === 'MOTEL_CABIN') return '🛏️';
    if (id === 'CONVENIENCE_STORE') return '🛒';
    if (id === 'DINER') return '🍔';
    if (id === 'CAR_WASH') return '🚿';
    if (id === 'RESTROOM') return '🚻';
    if (id === 'BILLBOARD') return '📢';
    if (id === 'TREE') return '🌴';
    return '🏗️';
  };

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 max-w-5xl w-full px-4 select-none pointer-events-auto">
      {/* Active Construction or Demolish Banner */}
      {(selectedDef || isDemolishMode) && (
        <div className="bg-slate-900/95 backdrop-blur-xl border border-amber-500/60 px-5 py-2 rounded-full flex items-center gap-3.5 text-xs shadow-2xl animate-in slide-in-from-bottom-2">
          {isDemolishMode ? (
            <span className="text-red-400 font-black flex items-center gap-2 tracking-wide font-['Chakra_Petch']">
              <Trash2 className="w-4 h-4 text-red-500" /> BULLDOZER ACTIVE — CLICK ANY FACILITY TO DEMOLISH (50% REFUND)
            </span>
          ) : (
            <span className="text-emerald-400 font-black flex items-center gap-2 tracking-wide font-['Chakra_Petch']">
              <Hammer className="w-4 h-4 text-emerald-400 animate-bounce" /> READY TO BUILD: {selectedDef?.name.toUpperCase()} (${selectedDef?.cost.toLocaleString()}) — CLICK ANYWHERE ON GROUND TO PLACE (DRIVEWAY CONNECTS AUTOMATICALLY)
            </span>
          )}
          <button
            onClick={() => {
              if (isDemolishMode) onToggleDemolish();
              onSelectDef(null);
              sound.playClickSound();
            }}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
            title="Cancel (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Architectural Dock */}
      <div className="bg-slate-950/92 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-2.5 shadow-2xl flex flex-col gap-2 w-full transition-all">
        {/* Top Header Bar & Category Navigation Tabs */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleTabChange('PETROL')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black font-['Chakra_Petch'] tracking-wide transition ${
                activeTab === 'PETROL' && isExpanded && !isDemolishMode
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Fuel className="w-3.5 h-3.5" />
              Fuel & EV
            </button>

            <button
              onClick={() => handleTabChange('HOSPITALITY')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black font-['Chakra_Petch'] tracking-wide transition ${
                activeTab === 'HOSPITALITY' && isExpanded && !isDemolishMode
                  ? 'bg-purple-500 text-slate-950 shadow-lg shadow-purple-500/25'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Bed className="w-3.5 h-3.5" />
              Motels & Lodging
            </button>

            <button
              onClick={() => handleTabChange('COMMERCIAL')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black font-['Chakra_Petch'] tracking-wide transition ${
                activeTab === 'COMMERCIAL' && isExpanded && !isDemolishMode
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              QuickMart & Diner
            </button>

            <button
              onClick={() => handleTabChange('INFRASTRUCTURE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black font-['Chakra_Petch'] tracking-wide transition ${
                activeTab === 'INFRASTRUCTURE' && isExpanded && !isDemolishMode
                  ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/25'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Hammer className="w-3.5 h-3.5" />
              Paving & Parking
            </button>

            <button
              onClick={() => handleTabChange('DECOR')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black font-['Chakra_Petch'] tracking-wide transition ${
                activeTab === 'DECOR' && isExpanded && !isDemolishMode
                  ? 'bg-pink-500 text-slate-950 shadow-lg shadow-pink-500/25'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <TreePine className="w-3.5 h-3.5" />
              Billboards & Decor
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Bulldozer Tool */}
            <button
              onClick={() => {
                if (selectedDef) onSelectDef(null);
                onToggleDemolish();
                sound.playClickSound();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black font-['Chakra_Petch'] transition ${
                isDemolishMode
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'bg-slate-900 text-red-400 hover:bg-red-500/10 border border-red-500/30'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Bulldozer
            </button>

            {/* Toggle Expand / Collapse Button */}
            <button
              onClick={() => {
                setIsExpanded(prev => !prev);
                sound.playClickSound();
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 transition"
              title={isExpanded ? 'Collapse Menu' : 'Expand Menu'}
            >
              {isExpanded ? (
                <>
                  <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold text-[11px]">Hide</span>
                </>
              ) : (
                <>
                  <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold text-[11px]">Build Menu</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Real-World Facility Cards Carousel (Shown only when expanded) */}
        {isExpanded && (
          <div className="flex items-stretch gap-3 overflow-x-auto pt-2 pb-1 border-t border-slate-800/80 animate-in fade-in-50 duration-200">
            {items.map(def => {
              const isSelected = selectedDef?.id === def.id;
              const canAfford = playerCash >= def.cost;

              return (
                <button
                  key={def.id}
                  onClick={() => handleSelectBuilding(def)}
                  className={`flex-shrink-0 w-48 text-left p-2.5 rounded-xl border transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-800/90 border-amber-400 ring-2 ring-amber-400/50 shadow-xl shadow-amber-950/40'
                      : canAfford
                      ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850 shadow-md'
                      : 'bg-slate-950/40 border-slate-900/80 opacity-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{getBuildingBadgeIcon(def.id)}</span>
                        <span className="font-black text-xs text-white truncate font-['Chakra_Petch']">
                          {def.name}
                        </span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                        {def.width}x{def.height}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed mb-2">
                      {def.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-800/90">
                    <span className={`text-xs font-mono font-black ${canAfford ? 'text-emerald-400' : 'text-red-400'}`}>
                      ${def.cost.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono font-semibold">
                      -${def.dailyUpkeep}/d
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
