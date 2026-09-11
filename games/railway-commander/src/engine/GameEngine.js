/**
 * Railway Commander - Master Game Engine
 * Orchestrates game state machine, main loop, physics integration,
 * signal checking, station stops, audio generation, and UI updates.
 */

import { TrainPhysics } from './TrainPhysics.js';
import { TrackManager } from './TrackManager.js';
import { SignalSystem } from './SignalSystem.js';
import { StationSystem } from './StationSystem.js';
import { MissionSystem } from './MissionSystem.js';
import { SoundManager } from './SoundManager.js';
import { InputManager } from './InputManager.js';
import { SaveManager } from './SaveManager.js';
import { Renderer25D } from './Renderer25D.js';
import { UIManager } from './UIManager.js';

export class GameEngine {
  constructor(canvas) {
    this.canvas = canvas;
    
    // Core Subsystems
    this.saveManager = new SaveManager();
    this.soundManager = new SoundManager(this.saveManager);
    this.physics = new TrainPhysics();
    this.trackManager = new TrackManager();
    this.signalSystem = new SignalSystem();
    this.stationSystem = new StationSystem();
    this.missionSystem = new MissionSystem(this.saveManager);
    this.renderer = new Renderer25D(canvas);
    this.uiManager = new UIManager(this);
    this.inputManager = new InputManager(this);

    // State Machine
    // 'MENU' | 'BRIEFING' | 'COUNTDOWN' | 'DRIVING' | 'PAUSED' | 'COMPLETE' | 'FAILED'
    this.state = 'MENU';
    this.currentMission = null;
    this.lastMissionResult = null;

    // Loop Timing
    this.lastTime = 0;
    this.isRunning = false;
    this.countdownTimer = 3;
    this.countdownInterval = null;
  }

  init() {
    this.renderer.resize();
    window.addEventListener('resize', () => this.renderer.resize());

    this.uiManager.init();
    this.inputManager.bindControls();

    // Start in Main Menu
    this.state = 'MENU';
    this.uiManager.showMainMenu();

    // Start Master Render Loop
    this.isRunning = true;
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  /**
   * Main Simulation Loop
   */
  gameLoop(currentTime) {
    if (!this.isRunning) return;

    const dt = Math.min(0.1, (currentTime - this.lastTime) / 1000);
    this.lastTime = currentTime;

    if (this.state === 'DRIVING') {
      this.updateDriving(dt);
    }

    // Always render canvas
    const trainState = this.physics.getState();
    this.renderer.render(
      trainState,
      this.trackManager,
      this.signalSystem,
      this.stationSystem,
      this.currentMission,
      dt
    );

    // Update HUD if in driving or countdown
    if (this.state === 'DRIVING' || this.state === 'COUNTDOWN' || this.state === 'PAUSED') {
      const nextSig = this.signalSystem.getNextSignal(this.physics.positionMeters);
      const nextSt = this.trackManager.getNextStation(this.physics.positionMeters);
      this.uiManager.updateHUD(trainState, nextSig, nextSt, this.currentMission);
    }

    requestAnimationFrame((t) => this.gameLoop(t));
  }

  /**
   * Physics, Signal, Station & Rule Updates
   */
  updateDriving(dt) {
    // 1. Dynamic Speed Limit Updates
    const curSpeedLimit = this.trackManager.getSpeedLimitAt(this.physics.positionMeters);
    this.physics.setSpeedLimit(curSpeedLimit);

    // 2. Train Physics Integration
    this.physics.update(dt);

    // 3. Audio Updates
    this.soundManager.updateEngineSound(this.physics.throttleLevel, this.physics.speedKmh);
    this.soundManager.updateWheelJoints(this.physics.positionMeters, this.physics.speedKmh);

    // 4. Overspeed Monitoring & Penalty
    if (this.physics.overspeedWarning) {
      this.missionSystem.recordOverspeed(dt);
      if (this.physics.overspeedTimer > 10.0) {
        this.failMission(`Safety Failure: Exceeded line speed limit of ${curSpeedLimit} km/h for more than 10 seconds!`);
        return;
      }
    }

    // 5. Signal System Checking
    const sigEvent = this.signalSystem.update(this.physics.positionMeters, this.physics.speedKmh, dt);
    if (sigEvent.failure) {
      this.failMission(sigEvent.failureReason);
      return;
    }
    if (sigEvent.warning) {
      this.uiManager.showNotification(sigEvent.warning, 'warning');
      this.soundManager.playWarningBeep();
    }

    // 6. Station Proximity & Accuracy Checking
    const stationEvent = this.stationSystem.update(
      this.physics.positionMeters,
      this.physics.speedKmh,
      this.physics.speedKmh < 0.2,
      dt
    );

    if (stationEvent) {
      if (stationEvent.type === 'APPROACHING_STATION' || stationEvent.type === 'PREPARE_TO_STOP') {
        this.uiManager.showNotification(stationEvent.message, 'info');
      } else if (stationEvent.type === 'ACCURATE_STOP') {
        this.uiManager.showNotification(stationEvent.message, 'success');
        this.soundManager.playStationChime();
      } else if (stationEvent.type === 'BOARDING_COMPLETE') {
        this.uiManager.showNotification(stationEvent.message, 'success');
        this.soundManager.playAirBrakeHiss(false);
      } else if (stationEvent.type === 'MISSED_STATION') {
        this.uiManager.showNotification(stationEvent.message, 'danger');
        this.soundManager.playWarningBeep();
        if (stationEvent.mandatory) {
          this.failMission(`Mission Rule Violation: You completely bypassed scheduled platform stop at ${stationEvent.stationName}!`);
          return;
        }
      }
    }

    // 7. Mission Destination / Completion Check
    const trackEnd = this.trackManager.totalDistanceMeters;
    if (this.physics.positionMeters >= trackEnd - 25) {
      // Must come to a safe stop at terminus
      if (this.physics.speedKmh < 1.0) {
        this.completeMission();
      } else {
        this.uiManager.showNotification('Approaching Terminus Buffer: Apply brakes to stop!', 'warning');
      }
    }
  }

  // --- Controls Handlers ---

  onThrottleUp() {
    this.soundManager.resume();
    if (this.physics.throttleUp()) {
      this.soundManager.playClick();
    }
  }

  onThrottleDown() {
    this.soundManager.resume();
    if (this.physics.throttleDown()) {
      this.soundManager.playClick();
    }
  }

  onBrakeUp() {
    this.soundManager.resume();
    if (this.physics.brakeUp()) {
      this.soundManager.playAirBrakeHiss(false);
    }
  }

  onBrakeDown() {
    this.soundManager.resume();
    if (this.physics.brakeDown()) {
      this.soundManager.playAirBrakeHiss(false);
    }
  }

  onEmergencyBrake() {
    this.soundManager.resume();
    this.physics.applyEmergencyBrake();
    this.missionSystem.recordEmergencyBrake();
    this.soundManager.playAirBrakeHiss(true);
    this.uiManager.showNotification('EMERGENCY BRAKE APPLIED!', 'danger');
  }

  onHorn(active) {
    this.physics.setHorn(active);
    this.soundManager.playHorn(active);
  }

  onToggleHeadlights() {
    const state = this.physics.toggleHeadlights();
    this.soundManager.playClick();
    this.uiManager.showNotification(state ? 'Headlights: ON' : 'Headlights: OFF', 'info', 1500);
  }

  onToggleCamera() {
    this.soundManager.playClick();
    const newMode = this.renderer.cameraMode === 'chase' ? 'cab' : 'chase';
    this.renderer.setCameraMode(newMode);
    this.uiManager.showNotification(`Camera View: ${newMode.toUpperCase()}`, 'info', 1500);
  }

  togglePause() {
    if (this.state === 'DRIVING') {
      this.state = 'PAUSED';
      this.soundManager.stopEngineSound();
      this.uiManager.showPause();
    } else if (this.state === 'PAUSED') {
      this.resumeGame();
    }
  }

  resumeGame() {
    if (this.state === 'PAUSED') {
      this.state = 'DRIVING';
      this.uiManager.showHUD();
    }
  }

  // --- Mission Progression & Flow ---

  prepareMission(missionId) {
    const mission = this.missionSystem.startMission(missionId);
    this.currentMission = mission;

    // Load Track & Systems
    this.trackManager.loadRoute(mission);
    this.signalSystem.loadSignals(mission.signals);
    this.stationSystem.loadStations(mission.stations);
    this.physics.reset(0, 0);

    this.state = 'BRIEFING';
    this.uiManager.showBriefing(mission);
  }

  beginJourneyCountdown() {
    this.state = 'COUNTDOWN';
    this.countdownTimer = 3;
    this.uiManager.showCountdown('3');
    this.soundManager.playClick();

    if (this.countdownInterval) clearInterval(this.countdownInterval);

    this.countdownInterval = setInterval(() => {
      this.countdownTimer--;
      if (this.countdownTimer === 2) {
        this.uiManager.showCountdown('2');
        this.soundManager.playClick();
      } else if (this.countdownTimer === 1) {
        this.uiManager.showCountdown('1');
        this.soundManager.playClick();
      } else if (this.countdownTimer === 0) {
        this.uiManager.showCountdown('GO!');
        this.soundManager.playStationChime();
      } else {
        clearInterval(this.countdownInterval);
        this.countdownInterval = null;
        this.startDriving();
      }
    }, 1000);
  }

  startDriving() {
    this.state = 'DRIVING';
    this.uiManager.showHUD();
    this.uiManager.showNotification('Route Clear. Increase Throttle to depart 🟢', 'success');
  }

  failMission(reason) {
    this.state = 'FAILED';
    this.soundManager.stopEngineSound();
    this.soundManager.playFailureSound();
    this.physics.applyEmergencyBrake();
    this.uiManager.showMissionFailed(reason);
  }

  completeMission() {
    this.state = 'COMPLETE';
    this.soundManager.stopEngineSound();
    this.soundManager.playVictoryFanfare();

    const results = this.missionSystem.evaluateResults(
      this.stationSystem.getCompletionSummary(),
      this.signalSystem.violations,
      this.physics.positionMeters
    );

    this.lastMissionResult = results;
    this.uiManager.showMissionComplete(results);
  }

  restartCurrentMission() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
    this.soundManager.stopEngineSound();
    if (this.currentMission) {
      this.prepareMission(this.currentMission.id);
    } else {
      this.prepareMission('mission-1');
    }
  }

  quitToMenu() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
    this.soundManager.stopEngineSound();
    this.physics.reset(0, 0);
    this.state = 'MENU';
    this.uiManager.showMainMenu();
  }
}
