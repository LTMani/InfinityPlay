import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { GameEngine } from '../core/GameEngine';
import { ThreeScene } from '../rendering/3d/ThreeScene';
import { sound } from '../audio/SoundEngine';
import { ArrowUpRight, X } from 'lucide-react';

interface InWorldBadgesOverlayProps {
  engine: GameEngine;
  threeScene: ThreeScene | null;
  onOpenFacilityInspector?: (type: 'FUEL' | 'SHOP' | 'MOTEL') => void;
}

interface SingleBadgeItem {
  id: string;
  worldPos: THREE.Vector3;
  type: 'FUEL' | 'DIESEL' | 'SHOP' | 'DINER' | 'MOTEL' | 'PARCEL' | 'HIGHWAY' | 'LEVEL_UP';
  title: string;
  subtitle?: string;
  cost: number;
  isUrgent?: boolean;
  canAfford: boolean;
  priority: number; // 1 = Highest (Urgent full queue), 2 = Level up, 3 = Next Goal
  onAction: () => void;
  accentColor: 'amber' | 'cyan' | 'purple' | 'emerald' | 'gold' | 'rose';
}

export const InWorldBadgesOverlay: React.FC<InWorldBadgesOverlayProps> = ({
  engine,
  threeScene,
  onOpenFacilityInspector
}) => {
  const [activeBadge, setActiveBadge] = useState<(SingleBadgeItem & { screenX: number; screenY: number }) | null>(null);
  const [dismissedId, setDismissedId] = useState<string | null>(null);
  const animRef = useRef<number>();

  useEffect(() => {
    const updatePosition = () => {
      if (!threeScene || !threeScene.camera) {
        animRef.current = requestAnimationFrame(updatePosition);
        return;
      }

      const camera = threeScene.camera;
      const cash = engine.economy.cash;
      const level = engine.plazaLevel;
      const nextLevel = engine.getNextLevelConfig();

      const candidates: SingleBadgeItem[] = [];

      // 1. Check Urgent Queues (Priority 1: Highest)
      const fuelQueue = threeScene.bayManager.waitingQueues.get('FUEL')?.length || 0;
      const storeQueue = threeScene.bayManager.waitingQueues.get('SHOP')?.length || 0;
      const motelQueue = threeScene.bayManager.waitingQueues.get('MOTEL')?.length || 0;

      if (fuelQueue > 0) {
        const fuelCost = 1200 * engine.fuelCapacityLevel;
        candidates.push({
          id: `fuel_urgent_${engine.fuelCapacityLevel}`,
          worldPos: new THREE.Vector3(22.0, 7.5, -60.0),
          type: 'FUEL',
          title: `🚨 PUMPS FULL! +2 Dispensers`,
          subtitle: `${fuelQueue} cars waiting! Expand throughput`,
          cost: fuelCost,
          isUrgent: true,
          canAfford: cash >= fuelCost,
          priority: 1,
          accentColor: 'amber',
          onAction: () => {
            if (engine.upgradeFacilityCapacity('FUEL')) {
              sound.playCashSound();
              setDismissedId(null);
            } else {
              sound.playErrorSound();
              onOpenFacilityInspector?.('FUEL');
            }
          }
        });
      } else if (storeQueue > 0) {
        const storeCost = 1500 * engine.storeCapacityLevel;
        candidates.push({
          id: `store_urgent_${engine.storeCapacityLevel}`,
          worldPos: new THREE.Vector3(35.0, 7.5, 5.0),
          type: 'SHOP',
          title: `🚨 STORE FULL! Expand Shelves`,
          subtitle: `${storeQueue} customers waiting!`,
          cost: storeCost,
          isUrgent: true,
          canAfford: cash >= storeCost,
          priority: 1,
          accentColor: 'cyan',
          onAction: () => {
            if (engine.upgradeFacilityCapacity('SHOP')) {
              sound.playCashSound();
              setDismissedId(null);
            } else {
              sound.playErrorSound();
              onOpenFacilityInspector?.('SHOP');
            }
          }
        });
      } else if (motelQueue > 0) {
        const motelCost = 2000 * engine.motelCapacityLevel;
        candidates.push({
          id: `motel_urgent_${engine.motelCapacityLevel}`,
          worldPos: new THREE.Vector3(35.0, 9.5, 75.0),
          type: 'MOTEL',
          title: `🚨 NO VACANCY! Add Suites`,
          subtitle: `${motelQueue} drivers need sleep!`,
          cost: motelCost,
          isUrgent: true,
          canAfford: cash >= motelCost,
          priority: 1,
          accentColor: 'purple',
          onAction: () => {
            if (engine.upgradeFacilityCapacity('MOTEL')) {
              sound.playCashSound();
              setDismissedId(null);
            } else {
              sound.playErrorSound();
              onOpenFacilityInspector?.('MOTEL');
            }
          }
        });
      }

      // 2. Check Level Up Ready (Priority 2)
      if (nextLevel) {
        const canLevelUp = engine.canUpgradePlazaLevel();
        if (canLevelUp.eligible) {
          candidates.push({
            id: `lvl_ready_${nextLevel.level}`,
            worldPos: new THREE.Vector3(12.0, 6.5, -25.0),
            type: 'LEVEL_UP',
            title: `⭐ LEVEL UP to Level ${nextLevel.level}`,
            subtitle: nextLevel.name,
            cost: nextLevel.upgradeCost,
            canAfford: true,
            priority: 2,
            accentColor: 'gold',
            onAction: () => {
              if (engine.upgradePlazaLevel()) {
                sound.playFanfare();
                setDismissedId(null);
              } else {
                sound.playErrorSound();
              }
            }
          });
        }
      }

      // 3. Check Next Development Prerequisite (Priority 3)
      if (nextLevel) {
        const req = nextLevel.requiredDev;
        if (req.type === 'FUEL_CAPACITY' && engine.fuelCapacityLevel < req.value) {
          const fuelCost = 1200 * engine.fuelCapacityLevel;
          if (cash >= fuelCost) {
            candidates.push({
              id: `req_fuel_${engine.fuelCapacityLevel}`,
              worldPos: new THREE.Vector3(22.0, 7.5, -60.0),
              type: 'FUEL',
              title: `⛽ Upgrade Pumps (Lvl ${engine.fuelCapacityLevel + 1})`,
              subtitle: `Requirement for Level ${nextLevel.level}`,
              cost: fuelCost,
              canAfford: true,
              priority: 3,
              accentColor: 'amber',
              onAction: () => {
                if (engine.upgradeFacilityCapacity('FUEL')) {
                  sound.playCashSound();
                  setDismissedId(null);
                } else {
                  sound.playErrorSound();
                }
              }
            });
          }
        } else if (req.type === 'STORE_CAPACITY' && engine.storeCapacityLevel < req.value) {
          const storeCost = 1500 * engine.storeCapacityLevel;
          if (cash >= storeCost) {
            candidates.push({
              id: `req_store_${engine.storeCapacityLevel}`,
              worldPos: new THREE.Vector3(35.0, 7.5, 5.0),
              type: 'SHOP',
              title: `🏪 Expand Store (Lvl ${engine.storeCapacityLevel + 1})`,
              subtitle: `Requirement for Level ${nextLevel.level}`,
              cost: storeCost,
              canAfford: true,
              priority: 3,
              accentColor: 'cyan',
              onAction: () => {
                if (engine.upgradeFacilityCapacity('SHOP')) {
                  sound.playCashSound();
                  setDismissedId(null);
                } else {
                  sound.playErrorSound();
                }
              }
            });
          }
        } else if (req.type === 'LAND_PARCELS') {
          if (!engine.purchasedParcels.has('plot_north') && cash >= 3500) {
            candidates.push({
              id: 'req_plot_north',
              worldPos: new THREE.Vector3(40.0, 3.5, -105.0),
              type: 'PARCEL',
              title: `🗺️ BUY NORTH COMMERCIAL LAND`,
              subtitle: `Requirement for Level ${nextLevel.level}`,
              cost: 3500,
              canAfford: true,
              priority: 3,
              accentColor: 'emerald',
              onAction: () => {
                if (engine.buyLandParcel('plot_north')) {
                  sound.playCashSound();
                  setDismissedId(null);
                } else {
                  sound.playErrorSound();
                }
              }
            });
          }
        }
      }

      // Sort by priority (lower number = higher priority)
      candidates.sort((a, b) => a.priority - b.priority);

      // Filter out dismissed badge
      const topBadge = candidates.find(c => c.id !== dismissedId) || null;

      if (!topBadge) {
        setActiveBadge(null);
        animRef.current = requestAnimationFrame(updatePosition);
        return;
      }

      // Project world coordinate to 2D screen coordinate
      const p = topBadge.worldPos.clone();
      p.project(camera);

      if (p.z > -1 && p.z < 1) {
        const screenX = (p.x * 0.5 + 0.5) * window.innerWidth;
        const screenY = (-(p.y * 0.5) + 0.5) * window.innerHeight;

        if (screenX >= 20 && screenX <= window.innerWidth - 20 && screenY >= 20 && screenY <= window.innerHeight - 20) {
          setActiveBadge({
            ...topBadge,
            screenX,
            screenY
          });
        } else {
          setActiveBadge(null);
        }
      } else {
        setActiveBadge(null);
      }

      animRef.current = requestAnimationFrame(updatePosition);
    };

    animRef.current = requestAnimationFrame(updatePosition);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [engine, threeScene, dismissedId, onOpenFacilityInspector]);

  if (!activeBadge) return null;

  const isGold = activeBadge.accentColor === 'gold';
  const isUrgent = activeBadge.isUrgent;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden select-none">
      <div
        style={{
          transform: `translate3d(${activeBadge.screenX}px, ${activeBadge.screenY}px, 0) translate(-50%, -100%)`,
          willChange: 'transform'
        }}
        className="absolute pointer-events-auto transition-transform duration-75 ease-out pb-2 group"
      >
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              activeBadge.onAction();
            }}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border-2 backdrop-blur-xl transition-all duration-200 shadow-2xl transform hover:scale-105 active:scale-95 ${
              isUrgent
                ? 'bg-gradient-to-r from-red-600/95 to-amber-600/95 border-amber-300 text-white shadow-red-950/80 animate-bounce'
                : isGold
                ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 border-yellow-100 text-slate-950 font-black shadow-yellow-500/40 animate-pulse ring-4 ring-yellow-400/40'
                : 'bg-slate-950/90 hover:bg-slate-900 border-amber-400/80 text-white shadow-black/80 hover:border-amber-300'
            }`}
          >
            {/* Primary Action & Title */}
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2 font-black text-xs sm:text-sm tracking-wide">
                <span>{activeBadge.title}</span>
                <ArrowUpRight className="w-4 h-4 text-white drop-shadow" />
              </div>
              {activeBadge.subtitle && (
                <span className={`text-[10px] font-medium opacity-90 ${isGold ? 'text-slate-900' : 'text-slate-300'}`}>
                  {activeBadge.subtitle}
                </span>
              )}
            </div>

            {/* Price Tag */}
            {activeBadge.cost > 0 && (
              <span className={`px-2.5 py-1 rounded-xl text-xs font-black border ${
                isGold 
                  ? 'bg-slate-950 text-amber-300 border-slate-800' 
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                ${activeBadge.cost.toLocaleString()}
              </span>
            )}
          </button>

          {/* Dismiss Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDismissedId(activeBadge.id);
            }}
            className="w-6 h-6 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs transition"
            title="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Downward Pointer Triangle */}
        <div className={`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] mx-auto -mt-0.5 filter drop-shadow ${
          isGold ? 'border-t-yellow-400' : isUrgent ? 'border-t-red-500' : 'border-t-amber-400'
        }`} />
      </div>
    </div>
  );
};
