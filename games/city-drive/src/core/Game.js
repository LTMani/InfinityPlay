/**
 * Game.js
 * Central orchestrator for CITY DRIVE — Phase 2.
 * Initializes Three.js renderer, scene, camera, player vehicle, AI traffic,
 * mission system, collision system, audio synthesizers, day/night cycles,
 * and HUD dashboard.
 */

import * as THREE from 'three';
import { GameLoop } from './GameLoop.js';
import { InputManager } from './InputManager.js';
import { VehicleController } from '../vehicle/VehicleController.js';
import { World } from '../world/World.js';
import { FollowCamera } from '../camera/FollowCamera.js';
import { CollisionSystem } from '../collision/CollisionSystem.js';
import { HUD } from '../ui/HUD.js';
import { SoundEffects } from '../audio/SoundEffects.js';
import { TrafficManager } from '../traffic/TrafficManager.js';
import { MissionManager } from '../missions/MissionManager.js';

export class Game {
  constructor(canvasElement) {
    this.canvas = canvasElement || document.getElementById('gameCanvas');
    if (!this.canvas) {
      throw new Error('Game canvas element not found.');
    }

    this.isStarted = false;
    this.isPaused = false;
    this.currentMode = 'TIME_ATTACK';

    this._initThree();
    this._initSystems();
    this._initLoop();
    this._bindWindowEvents();
  }

  _initThree() {
    // 1. Three.js WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    // 2. Scene
    this.scene = new THREE.Scene();
  }

  _initSystems() {
    // 1. Input Manager
    this.inputManager = new InputManager();

    // 2. Third-person Follow Camera
    this.followCamera = new FollowCamera(window.innerWidth / window.innerHeight);

    // 3. Collision System
    this.collisionSystem = new CollisionSystem(this.scene);

    // 4. Vehicle Controller & 3D Car
    this.vehicleController = new VehicleController(this.scene, {
      color: 0x2563eb
    });

    // 5. World & Modular Road Streaming
    this.world = new World(this.scene, this.collisionSystem);

    // 6. Sound Effects Engine
    this.soundEffects = new SoundEffects();

    // 7. AI Traffic Simulation
    this.trafficManager = new TrafficManager(this.scene);

    // 8. Mission & Objective Manager
    this.missionManager = new MissionManager(this.scene, {
      onCheckpoint: (count, bonusTime, pts) => {
        this.soundEffects.playCheckpointChime();
        this.hud.showNotification(`GATE ${count} CLEARED! +${bonusTime}S (+${pts} PTS)`, 'success', 1600);
      },
      onCourierPhase: (phase, msg) => {
        if (phase === 'PICKUP') {
          this.soundEffects.playMissionSuccess();
          this.hud.showNotification(msg, 'success', 2000);
        } else {
          this.soundEffects.playCheckpointChime();
          this.hud.showNotification(msg, 'info', 1800);
        }
      },
      onMissionSuccess: (stats) => {
        this.soundEffects.playMissionSuccess();
        stats.distance = this.vehicleController.getDistanceMeters();
        this.hud.showSummaryModal(true, true, stats);
      },
      onMissionFail: (reason, stats) => {
        this.soundEffects.playMissionFail();
        stats.distance = this.vehicleController.getDistanceMeters();
        this.hud.showSummaryModal(true, false, stats);
      }
    });

    // 9. HUD & UI Coordinator
    this.hud = new HUD({
      onStart: (mode) => this.start(mode),
      onRestart: () => this.restart(),
      onPause: () => this.pause(),
      onResume: () => this.resume(),
      onToggleAudio: () => this.soundEffects.toggleMute(),
      onCycleTimeOfDay: () => this.world.environment.cycleTimeOfDay(this.vehicleController),
      onColorChange: (hex) => this.vehicleController.setColor(hex),
      onTuningChange: (tuning) => this.vehicleController.applyTuning(tuning),
      onReturnMenu: () => this.returnToMenu()
    });

    // Initial positioning
    this.vehicleController.reset(0, 0, 0, 0);
    this.followCamera.snap(this.vehicleController.physics);
  }

  _initLoop() {
    this.gameLoop = new GameLoop(
      (dt) => this.update(dt),
      () => this.render()
    );

    // Start background loop immediately to render scene behind start menu
    this.gameLoop.start();
  }

  _bindWindowEvents() {
    window.addEventListener('resize', () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.followCamera.onResize(width / height);
    });
  }

  start(mode = 'TIME_ATTACK') {
    this.currentMode = mode;
    this.isStarted = true;
    this.isPaused = false;
    this.soundEffects.init();

    this.vehicleController.reset(0, 0, 0, 0);
    this.world.reset();
    this.trafficManager.reset(0);
    this.missionManager.startMission(mode);
    this.followCamera.snap(this.vehicleController.physics);

    const modeLabels = {
      TIME_ATTACK: 'TIME ATTACK SPRINT - CLEAR CHECKPOINTS!',
      COURIER: 'CITY COURIER - PICK UP FARES & DELIVER!',
      FREE_CRUISE: 'FREE CRUISE - OVERTAKE TRAFFIC & EXPLORE!'
    };
    this.hud.showNotification(modeLabels[mode] || 'DRIVE SAFELY', 'info', 2200);
  }

  restart() {
    this.vehicleController.reset(0, 0, 0, 0);
    this.world.reset();
    this.trafficManager.reset(0);
    this.missionManager.startMission(this.currentMode);
    this.followCamera.snap(this.vehicleController.physics);
    this.inputManager.resetAll();
    this.isPaused = false;
    this.gameLoop.resume();
    this.hud.showPauseModal(false);
    this.hud.showSummaryModal(false);
    this.hud.showNotification('RESTARTING SPRINT...', 'info', 1200);
  }

  returnToMenu() {
    this.isStarted = false;
    this.isPaused = false;
    this.missionManager.reset();
    this.vehicleController.reset(0, 0, 0, 0);
    this.trafficManager.reset(0);
    this.world.reset();
    this.followCamera.snap(this.vehicleController.physics);
    this.inputManager.resetAll();
    this.gameLoop.resume();
  }

  pause() {
    if (!this.isStarted || this.isPaused) return;
    this.isPaused = true;
    this.gameLoop.pause();
    this.soundEffects.stopHorn();
    this.hud.showPauseModal(true);
  }

  resume() {
    if (!this.isStarted || !this.isPaused) return;
    this.isPaused = false;
    this.gameLoop.resume();
    this.hud.showPauseModal(false);
  }

  update(dt) {
    // 1. Input update
    this.inputManager.update(dt);

    // 2. Single-frame command consumption
    if (this.inputManager.consumeRestart()) {
      this.restart();
      return;
    }

    if (this.inputManager.consumePause()) {
      if (this.isPaused) {
        this.resume();
      } else {
        this.pause();
      }
      return;
    }

    if (this.inputManager.consumeTimeOfDayToggle()) {
      const mode = this.world.environment.cycleTimeOfDay(this.vehicleController);
      const icons = { DAY: '☀️', SUNSET: '🌅', NIGHT: '🌙' };
      if (this.hud.btnTimeToggle) {
        this.hud.btnTimeToggle.textContent = icons[mode] || '☀️';
      }
      this.hud.showNotification(`ATMOSPHERE: ${mode}`, 'info', 1000);
    }

    // Horn input check
    if (this.inputManager.isHornActive()) {
      this.soundEffects.startHorn();
    } else {
      this.soundEffects.stopHorn();
    }

    if (!this.isStarted) {
      // Idle camera tracking before click Play
      this.followCamera.snap(this.vehicleController.physics);
      return;
    }

    // 3. Vehicle movement & physics
    this.vehicleController.update(dt, this.inputManager);

    // 4. AI Traffic Simulation
    this.trafficManager.update(
      dt,
      this.vehicleController.physics,
      this.collisionSystem.obstacles,
      (tv) => {
        // High-speed Near Miss with AI car!
        this.soundEffects.playNearMiss();
        const res = this.missionManager.recordNearMiss();
        this.hud.showNotification(`⚡ NEAR MISS! +${res.bonus} PTS (x${res.count})`, 'warning', 1000);
      }
    );

    // 5. Collision detection & physical resolution
    this.collisionSystem.update(
      this.vehicleController,
      this.followCamera,
      dt,
      this.trafficManager,
      (hitType) => {
        this.soundEffects.playCollision();
        if (hitType === 'TRAFFIC') {
          this.hud.showNotification('💥 TRAFFIC COLLISION! WATCH YOUR LANE', 'danger', 1200);
        } else if (hitType === 'OBSTACLE') {
          this.hud.showNotification('⚠️ ROADBLOCK IMPACT! -70% SPEED', 'danger', 1200);
        } else {
          this.hud.showNotification('⚠️ GUARDRAIL SCRAPE', 'warning', 800);
        }
      }
    );

    // 6. Missions & Objectives update
    this.missionManager.update(dt, this.vehicleController.physics);

    // 7. Follow Camera
    this.followCamera.update(this.vehicleController.physics, dt);

    // 8. World chunk streaming & sun tracking
    this.world.update(this.vehicleController.getPosition());

    // 9. Sound Synthesis
    this.soundEffects.update(
      this.vehicleController.getSpeedKmh(),
      this.inputManager.throttle
    );

    // 10. UI Telemetry update
    this.hud.updateTelemetry(
      this.vehicleController.getSpeedKmh(),
      this.vehicleController.getGear(),
      this.vehicleController.getDistanceMeters()
    );

    // 11. Mission HUD Telemetry
    let objectiveText = '';
    const distToObj = this.missionManager.getDistanceToNextObjective(this.vehicleController.physics);

    if (this.currentMode === 'TIME_ATTACK') {
      objectiveText = `🏁 CHECKPOINT ${this.missionManager.nextCheckpointIndex}: ${distToObj}M`;
    } else if (this.currentMode === 'COURIER') {
      objectiveText = this.missionManager.courierPhase === 'PICKUP'
        ? `🧍 PICK UP FARE: ${distToObj}M`
        : `📍 DROP OFF DESTINATION: ${distToObj}M`;
    } else {
      objectiveText = `🛣️ HIGHWAY CRUISE: ${this.vehicleController.getDistanceMeters()}M`;
    }

    this.hud.updateMissionTelemetry(
      this.missionManager.timeRemaining,
      objectiveText,
      this.missionManager.score,
      this.currentMode
    );
  }

  render() {
    this.renderer.render(this.scene, this.followCamera.camera);
  }
}
