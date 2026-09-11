/**
 * Game.js
 * Central orchestrator. Initializes Three.js renderer, scene, camera,
 * vehicle, world, collisions, audio, input, HUD, and coordinates the game loop.
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

export class Game {
  constructor(canvasElement) {
    this.canvas = canvasElement || document.getElementById('gameCanvas');
    if (!this.canvas) {
      throw new Error('Game canvas element not found.');
    }

    this.isStarted = false;
    this.isPaused = false;

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
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap at 2 for performance
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
      color: 0x2563eb // Modern racing electric blue
    });

    // 5. World & Modular Road Streaming
    this.world = new World(this.scene, this.collisionSystem);

    // 6. Sound Effects Engine
    this.soundEffects = new SoundEffects();

    // 7. HUD & UI Coordinator
    this.hud = new HUD({
      onStart: () => this.start(),
      onRestart: () => this.restart(),
      onPause: () => this.pause(),
      onResume: () => this.resume(),
      onToggleAudio: () => this.soundEffects.toggleMute()
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

  start() {
    this.isStarted = true;
    this.isPaused = false;
    this.soundEffects.init();
    this.vehicleController.reset(0, 0, 0, 0);
    this.followCamera.snap(this.vehicleController.physics);
    this.hud.showNotification('ENGINE STARTED - DRIVE SAFELY', 'info', 1800);
  }

  restart() {
    this.vehicleController.reset(0, 0, 0, 0);
    this.world.reset();
    this.followCamera.snap(this.vehicleController.physics);
    this.inputManager.resetAll();
    this.isPaused = false;
    this.gameLoop.resume();
    this.hud.showPauseModal(false);
    this.hud.showNotification('VEHICLE RESET', 'info', 1400);
  }

  pause() {
    if (!this.isStarted || this.isPaused) return;
    this.isPaused = true;
    this.gameLoop.pause();
    this.hud.showPauseModal(true);
  }

  resume() {
    if (!this.isStarted || !this.isPaused) return;
    this.isPaused = false;
    this.gameLoop.resume();
    this.hud.showPauseModal(false);
  }

  /**
   * Main game systems update pipeline.
   * Suggested sequence:
   * 1. Input
   * 2. Single-frame command consumption
   * 3. Vehicle physics & movement
   * 4. Collision check & response
   * 5. Camera follow & shake
   * 6. World updates
   * 7. Sound updates
   * 8. UI updates
   */
  update(dt) {
    // 1. Input update
    this.inputManager.update(dt);

    // 2. Consume single-frame triggers
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

    if (!this.isStarted) {
      // Idle turntable camera before clicking Play
      this.vehicleController.physics.position.z += 0;
      this.followCamera.snap(this.vehicleController.physics);
      return;
    }

    // 3. Vehicle movement & physics
    this.vehicleController.update(dt, this.inputManager);

    // 4. Collision detection & physical resolution
    this.collisionSystem.update(
      this.vehicleController,
      this.followCamera,
      dt,
      (hitType) => {
        this.soundEffects.playCollision();
        if (hitType === 'OBSTACLE') {
          this.hud.showNotification('⚠️ IMPACT DETECTED! -70% SPEED', 'danger', 1200);
        } else {
          this.hud.showNotification('⚠️ GUARDRAIL SCRAPE', 'warning', 800);
        }
      }
    );

    // 5. Follow Camera
    this.followCamera.update(this.vehicleController.physics, dt);

    // 6. World chunk streaming & sun tracking
    this.world.update(this.vehicleController.getPosition());

    // 7. Sound Synthesis
    this.soundEffects.update(
      this.vehicleController.getSpeedKmh(),
      this.inputManager.throttle
    );

    // 8. UI Telemetry update
    this.hud.updateTelemetry(
      this.vehicleController.getSpeedKmh(),
      this.vehicleController.getGear(),
      this.vehicleController.getDistanceMeters()
    );
  }

  render() {
    this.renderer.render(this.scene, this.followCamera.camera);
  }
}

