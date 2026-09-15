import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from './core/GameEngine';
import { ThreeScene } from './rendering/3d/ThreeScene';
import { BuildingDefinition, Vehicle } from './types';
import { sound } from './audio/SoundEngine';

// Modern Real-World UI Overlays
import { HUD } from './ui/HUD';
import { LevelProgressionDock } from './ui/LevelProgressionDock';
import { InWorldBadgesOverlay } from './ui/InWorldBadgesOverlay';
import { FacilityInspectorCard } from './ui/FacilityInspectorCard';
import { CameraPresetBar } from './ui/CameraPresetBar';
import { CustomerInspector } from './ui/CustomerInspector';
import { FuelModal } from './ui/modals/FuelModal';
import { MotelModal } from './ui/modals/MotelModal';
import { StaffModal } from './ui/modals/StaffModal';
import { FinanceModal } from './ui/modals/FinanceModal';
import { TechTreeModal } from './ui/modals/TechTreeModal';
import { ReviewsModal } from './ui/modals/ReviewsModal';
import { ObjectivesModal } from './ui/modals/ObjectivesModal';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const threeSceneRef = useRef<ThreeScene | null>(null);

  // Initialize engine once
  if (!engineRef.current) {
    engineRef.current = new GameEngine();
  }
  const engine = engineRef.current;

  // UI State
  const [, setTickState] = useState(0);
  const [selectedBuildDef, setSelectedBuildDef] = useState<BuildingDefinition | null>(null);
  const [isDemolishMode, setIsDemolishMode] = useState(false);
  const [inspectedVehicle, setInspectedVehicle] = useState<Vehicle | null>(null);
  const [inspectedFacility, setInspectedFacility] = useState<'FUEL' | 'SHOP' | 'MOTEL' | null>(null);

  // Modals state
  const [isFuelOpen, setIsFuelOpen] = useState(false);
  const [isMotelOpen, setIsMotelOpen] = useState(false);
  const [isStaffOpen, setIsStaffOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [isTechTreeOpen, setIsTechTreeOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [isObjectivesOpen, setIsObjectivesOpen] = useState(false);

  // Mount 3D Scene (matching user reference image)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const threeScene = new ThreeScene(canvas, engine);
    threeScene.onSelectFacility = (type) => {
      setInspectedFacility(type);
    };
    threeSceneRef.current = threeScene;

    const handleResize = () => {
      threeScene.handleResize();
    };
    window.addEventListener('resize', handleResize);

    // 60 FPS WebGL Animation Loop
    let lastTime = performance.now();
    let animationId: number;
    let uiTimer = 0;

    const animate = (time: number) => {
      const dt = Math.min(0.08, (time - lastTime) / 1000);
      lastTime = time;

      // 1. Advance Simulation Economics & Clock
      engine.tick(dt);

      // 2. Render 3D Coastal Highway Scene & Traffic
      threeScene.render(dt);

      // 3. UI Update Ticker (4Hz)
      uiTimer += dt;
      if (uiTimer >= 0.25) {
        uiTimer = 0;
        setTickState(prev => prev + 1);
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      threeScene.destroy();
    };
  }, [engine]);

  // Sync Construction Toolbar selection with 3D Building Placer
  useEffect(() => {
    if (threeSceneRef.current?.buildingPlacer) {
      threeSceneRef.current.buildingPlacer.setActiveDef(selectedBuildDef);
      threeSceneRef.current.buildingPlacer.setDemolishMode(isDemolishMode);
    }
  }, [selectedBuildDef, isDemolishMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedBuildDef(null);
        setIsDemolishMode(false);
        setInspectedVehicle(null);
        sound.playClickSound();
      } else if (e.key === ' ') {
        engine.gameSpeed = engine.gameSpeed === 0 ? 1 : 0;
        sound.playClickSound();
      } else if (e.key === '1') {
        engine.gameSpeed = 1;
        sound.playClickSound();
      } else if (e.key === '2') {
        engine.gameSpeed = 2;
        sound.playClickSound();
      } else if (e.key === '5') {
        engine.gameSpeed = 5;
        sound.playClickSound();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [engine]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-['Plus_Jakarta_Sans'] select-none">
      {/* 3D WebGL Canvas matching user's coastal highway reference image */}
      <canvas
        ref={canvasRef}
        className="block w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* In-World Single Focused Priority Badge */}
      <InWorldBadgesOverlay
        engine={engine}
        threeScene={threeSceneRef.current}
        onOpenFacilityInspector={(type) => setInspectedFacility(type)}
      />

      {/* Facility Inspector Card when clicked */}
      <FacilityInspectorCard
        facilityType={inspectedFacility}
        engine={engine}
        onClose={() => setInspectedFacility(null)}
      />

      {/* Modern Camera Preset Bar (Bottom Left) */}
      <CameraPresetBar
        onPreset={(preset) => threeSceneRef.current?.setCameraPreset(preset)}
        onRotate={(deg) => threeSceneRef.current?.rotateCamera(deg)}
        onZoom={(factor) => threeSceneRef.current?.zoomCamera(factor)}
        onReset={() => threeSceneRef.current?.resetToPhotoView()}
      />

      {/* Top Real-World Management HUD */}
      <HUD
        engine={engine}
        bayStats={threeSceneRef.current?.bayManager.getTotalStats()}
        onResetCamera={() => threeSceneRef.current?.resetToPhotoView()}
        onOpenFuel={() => setIsFuelOpen(true)}
        onOpenMotel={() => setIsMotelOpen(true)}
        onOpenStaff={() => setIsStaffOpen(true)}
        onOpenFinance={() => setIsFinanceOpen(true)}
        onOpenTechTree={() => setIsTechTreeOpen(true)}
        onOpenReviews={() => setIsReviewsOpen(true)}
        onOpenObjectives={() => setIsObjectivesOpen(true)}
      />

      {/* Bottom Level Progression & Facility Upgrades Dock */}
      <LevelProgressionDock
        engine={engine}
        playerCash={engine.economy.cash}
      />

      {/* Real-World Vehicle Telemetry & Customer Inspector */}
      <CustomerInspector
        vehicle={inspectedVehicle}
        onClose={() => setInspectedVehicle(null)}
      />

      {/* Modals */}
      <FuelModal
        fuelStorage={engine.fuelStorage}
        isOpen={isFuelOpen}
        onClose={() => setIsFuelOpen(false)}
      />

      <MotelModal
        roomManager={engine.roomManager}
        buildings={engine.buildings}
        hasHousekeepers={engine.staffManager.hasActiveHousekeeper()}
        isOpen={isMotelOpen}
        onClose={() => setIsMotelOpen(false)}
      />

      <StaffModal
        staffManager={engine.staffManager}
        isOpen={isStaffOpen}
        onClose={() => setIsStaffOpen(false)}
      />

      <FinanceModal
        economy={engine.economy}
        currentDay={engine.day}
        isOpen={isFinanceOpen}
        onClose={() => setIsFinanceOpen(false)}
      />

      <TechTreeModal
        engine={engine}
        isOpen={isTechTreeOpen}
        onClose={() => setIsTechTreeOpen(false)}
      />

      <ReviewsModal
        reviews={engine.reviews}
        reputationStars={engine.reputationStars}
        isOpen={isReviewsOpen}
        onClose={() => setIsReviewsOpen(false)}
      />

      <ObjectivesModal
        scenario={engine.scenario}
        isOpen={isObjectivesOpen}
        onClose={() => setIsObjectivesOpen(false)}
      />
    </div>
  );
}
