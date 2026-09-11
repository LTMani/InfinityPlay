/**
 * InfinityPlay Ultimate Racing - Game State Machine & Master Loop
 * Orchestrates race modes, countdown, laps, championship, results, and frame loop
 */

(function() {
  const STATES = {
    MENU: 'MENU',
    MODE_SELECT: 'MODE_SELECT',
    TRACK_SELECT: 'TRACK_SELECT',
    CAR_SELECT: 'CAR_SELECT',
    GARAGE: 'GARAGE',
    SETTINGS: 'SETTINGS',
    COUNTDOWN: 'COUNTDOWN',
    RACING: 'RACING',
    PAUSED: 'PAUSED',
    RESULTS: 'RESULTS'
  };

  class GameManager {
    constructor() {
      this.state = STATES.MENU;
      this.lastTimestamp = 0;
      this.isRunning = false;

      // Active race configuration
      this.mode = 'quick-race'; // 'quick-race', 'time-trial', 'championship'
      this.currentTrackData = null;
      this.currentTrackGeometry = null;
      this.championshipTracks = [
        'neon-city',
        'mountain-pass',
        'coastal-highway',
        'desert-storm',
        'arctic-run',
        'jungle-rush',
        'volcanic-circuit',
        'cyberpunk-district',
        'skyway-extreme',
        'infinity-grand-prix'
      ];
      this.championshipIndex = 0;
      this.championshipPoints = { player: 0, Nova: 0, Rex: 0, Shadow: 0, Blaze: 0, Vortex: 0 };

      // Countdown state
      this.countdownTimer = 3.5;
      this.lastCountdownFloor = 4;

      // Systems
      this.player = new window.UR.Player();
      this.aiManager = new window.UR.AIManager();
      this.trafficManager = new window.UR.TrafficManager();
      this.particleSystem = new window.UR.ParticleSystem();
      this.camera = new window.UR.Camera();
      this.trackBuilder = new window.UR.TrackBuilder();
      this.hud = new window.UR.HUD();
      this.renderer = null;
      this.debugMode = false;

      // DOM UI Overlays
      this.screens = {};
    }

    init(canvas) {
      this.renderer = new window.UR.RoadRenderer(canvas);

      // Cache DOM overlay screen elements
      this.screens = {
        menu: document.getElementById('screenMenu'),
        modeSelect: document.getElementById('screenModeSelect'),
        trackSelect: document.getElementById('screenTrackSelect'),
        garage: document.getElementById('screenGarage'),
        settings: document.getElementById('screenSettings'),
        countdown: document.getElementById('overlayCountdown'),
        countdownNum: document.getElementById('countdownText'),
        pause: document.getElementById('overlayPause'),
        results: document.getElementById('screenResults'),
        hud: document.getElementById('gameHUD'),
        mobileControls: document.getElementById('mobileControls')
      };

      // Toggle Developer Track Diagnostics overlay via backslash (\) or 0 key
      window.addEventListener('keydown', (e) => {
        if (e.key === '\\' || e.code === 'Backslash' || e.key === '0' || e.code === 'Digit0') {
          this.debugMode = !this.debugMode;
          window.UR = window.UR || {};
          window.UR.debugMode = this.debugMode;
          if (this.hud) {
            this.hud.showNotification(this.debugMode ? 'DEV GEOMETRY DEBUG: ON' : 'DEV DEBUG: OFF', 1400);
          }
        }
      });

      this.bindUIEvents();
      this.setState(STATES.MENU);

      // Start RAF loop
      this.isRunning = true;
      this.lastTimestamp = performance.now();
      requestAnimationFrame((t) => this.gameLoop(t));
    }

    setState(newState) {
      this.state = newState;

      // Hide all overlays initially
      for (const key of Object.keys(this.screens)) {
        if (this.screens[key]) {
          this.screens[key].style.display = 'none';
        }
      }

      // Show overlay corresponding to current state
      switch (newState) {
        case STATES.MENU:
          if (this.screens.menu) this.screens.menu.style.display = 'flex';
          window.UR.audio.stopEngine();
          window.UR.audio.startMusic();
          break;

        case STATES.MODE_SELECT:
          if (this.screens.modeSelect) this.screens.modeSelect.style.display = 'flex';
          break;

        case STATES.TRACK_SELECT:
          if (this.screens.trackSelect) this.screens.trackSelect.style.display = 'flex';
          this.renderTrackSelectionCards();
          break;

        case STATES.GARAGE:
          if (this.screens.garage) this.screens.garage.style.display = 'flex';
          window.UR.garage.init();
          window.UR.garage.render();
          break;

        case STATES.SETTINGS:
          if (this.screens.settings) this.screens.settings.style.display = 'flex';
          this.syncSettingsUI();
          break;

        case STATES.COUNTDOWN:
          if (this.screens.hud) this.screens.hud.style.display = 'block';
          if (this.screens.countdown) this.screens.countdown.style.display = 'flex';
          if (this.screens.mobileControls) this.screens.mobileControls.style.display = 'flex';
          window.UR.audio.startEngine();
          break;

        case STATES.RACING:
          if (this.screens.hud) this.screens.hud.style.display = 'block';
          if (this.screens.mobileControls) this.screens.mobileControls.style.display = 'flex';
          break;

        case STATES.PAUSED:
          if (this.screens.hud) this.screens.hud.style.display = 'block';
          if (this.screens.pause) this.screens.pause.style.display = 'flex';
          window.UR.audio.stopEngine();
          break;

        case STATES.RESULTS:
          if (this.screens.results) this.screens.results.style.display = 'flex';
          window.UR.audio.stopEngine();
          window.UR.audio.playVictory();
          break;
      }
    }

    startRace(trackId, mode = 'quick-race') {
      this.mode = mode;
      const trackCfg = window.UR.TRACKS.find(t => t.id === trackId) || window.UR.TRACKS[0];
      this.currentTrackData = trackCfg;

      // 1. Build road segments
      this.currentTrackGeometry = this.trackBuilder.buildTrack(trackCfg);

      // 2. Setup Player
      const saveData = window.UR.SaveSystem.getData();
      const carData = window.UR.CARS.find(c => c.id === saveData.selectedCar) || window.UR.CARS[0];
      const upgrades = window.UR.SaveSystem.getCarUpgrades(carData.id);

      this.player.resetAll();
      this.player.setupCar(carData, upgrades);
      this.player.maxLaps = trackCfg.laps || 3;
      this.player.z = 240; // starting line offset
      this.player.prevZ = 240;
      this.player.finishLineArmed = false;

      // 3. Setup Camera & Systems
      const startElevation = this.currentTrackGeometry.segments[0]?.p1?.world?.y || 0;
      this.camera.reset(this.player.x, this.player.z, startElevation, this.currentTrackGeometry.roadWidth);
      this.particleSystem.clear();

      // 4. Setup AI Opponents (5 racing rival cars + 1 user car = 6 cars on track)
      if (this.mode !== 'time-trial') {
        this.aiManager.createOpponents(this.currentTrackGeometry.length, 5);
      } else {
        this.aiManager.opponents = [];
      }

      // 5. Setup Civilian Traffic
      this.trafficManager.init(this.currentTrackGeometry.length, 3000);

      // 6. Reset Countdown
      this.countdownTimer = 3.5;
      this.lastCountdownFloor = 4;
      this.setState(STATES.COUNTDOWN);
      window.UR.audio.playCountdown(false);

      // Defocus any clicked UI button to guarantee keyboard focus on window
      if (document.activeElement && typeof document.activeElement.blur === 'function') {
        document.activeElement.blur();
      }
      try { window.focus(); } catch (_) {}
    }

    gameLoop(timestamp) {
      if (!this.isRunning) return;

      const dt = Math.min(0.1, (timestamp - this.lastTimestamp) / 1000);
      this.lastTimestamp = timestamp;

      this.update(dt);
      this.render();

      requestAnimationFrame((t) => this.gameLoop(t));
    }

    update(dt) {
      // Pause check via ESC key
      if (window.UR.input.consumePause()) {
        if (this.state === STATES.RACING) {
          this.setState(STATES.PAUSED);
          return;
        } else if (this.state === STATES.PAUSED) {
          this.setState(STATES.RACING);
          return;
        }
      }

      // 1. Handle COUNTDOWN State
      if (this.state === STATES.COUNTDOWN) {
        this.countdownTimer -= dt;
        const currentFloor = Math.ceil(this.countdownTimer);

        if (this.screens.countdownNum) {
          if (currentFloor >= 1 && currentFloor <= 3) {
            this.screens.countdownNum.textContent = currentFloor;
            if (currentFloor < this.lastCountdownFloor) {
              this.lastCountdownFloor = currentFloor;
              window.UR.audio.playCountdown(false);
            }
          } else if (this.countdownTimer <= 0.6) {
            this.screens.countdownNum.textContent = 'GO!';
            this.screens.countdownNum.style.color = '#00f0ff';
            if (this.lastCountdownFloor !== 0) {
              this.lastCountdownFloor = 0;
              window.UR.audio.playCountdown(true);
            }
          }
        }

        if (this.countdownTimer <= 0) {
          this.setState(STATES.RACING);
          if (document.activeElement && typeof document.activeElement.blur === 'function') {
            document.activeElement.blur();
          }
          try { window.focus(); } catch (_) {}
        }
        return;
      }

      // Only run game physics during RACING
      if (this.state !== STATES.RACING) return;

      const input = window.UR.input;
      const track = this.currentTrackGeometry;
      const trackLength = track.length;

      // Car Reset Check (R key)
      if (input.consumeReset()) {
        const segIdx = Math.floor((this.player.z % trackLength) / 200);
        this.player.resetPosition(segIdx, trackLength);
        const segElev = track.segments[segIdx]?.p1?.world?.y || 0;
        this.camera.reset(this.player.x, this.player.z, segElev);
        this.hud.showNotification('CAR RESET', 1500);
      }

      // 1. Current Segment Lookup
      const segmentIndex = Math.floor((this.player.z % trackLength) / 200);
      const currentSegment = track.segments[segmentIndex] || track.segments[0];

      // 2. Update Player Physics
      const settings = window.UR.SaveSystem.getSettings();
      window.UR.physics.updatePlayerPhysics(this.player, input, currentSegment, dt, settings.controlSensitivity || 1.0);

      // 3. Update Audio SFX
      window.UR.audio.updateEngine(this.player.getSpeedRatio(), input.isActionActive('accelerate'), input.isActionActive('brake'));
      window.UR.audio.setNitroState(this.player.isNitroActive);
      window.UR.audio.setDriftState(this.player.isDrifting ? Math.min(1.0, this.player.currentDriftScore / 1000) : 0);

      // 4. Update AI & Traffic
      if (this.mode !== 'time-trial') {
        this.aiManager.update(dt, this.player, track.segments, this.trafficManager.getVehicles(), trackLength, this.currentTrackData.difficulty);
      }
      this.trafficManager.update(dt, this.player.z, trackLength);

      // 5. Update Collisions
      window.UR.collision.checkCollisions(
        this.player, 
        this.aiManager, 
        this.trafficManager, 
        this.particleSystem, 
        this.camera, 
        window.UR.audio
      );

      // 6. Spawn Particles
      if (this.player.isDrifting) {
        this.particleSystem.spawnTireSmoke(this.player.x, this.player.z, 1.2);
      }
      if (this.player.isNitroActive) {
        this.particleSystem.spawnNitroFlame(this.player.x, this.player.z, this.player.carData?.visuals?.exhaustFlame || '#00f0ff');
      }
      if (this.player.isOffRoad && this.player.speed > 800) {
        this.particleSystem.spawnOffroadDust(this.player.x, this.player.z);
      }
      this.particleSystem.update(dt);

      // 7. Update Camera with Road Ground-Tracking Elevation
      this.camera.update(dt, this.player, track.roadWidth, currentSegment.p1.world.y);

      // 8. Track Laps & Checkpoints
      this.updateRaceProgression(dt, trackLength, currentSegment);

      // 9. Update Live Leaderboard Rank Position (1st to 6th)
      this.updateRacePositions();

      // 10. Update HUD
      this.hud.update(this.player, track, this.aiManager, this.mode);
    }

    updateRaceProgression(dt, trackLength, currentSegment) {
      if (this.player.hasFinished) return;

      this.player.raceTime += dt * 1000;
      this.player.currentLapTime += dt * 1000;

      // Distance logged in km (1 world unit ~ 0.05 meters)
      const distKm = (Math.max(0, this.player.speed) * dt * 0.05) / 1000;
      this.player.totalDistanceTravelled += distKm;

      // Track forward delta distance inside current lap
      const deltaZ = this.player.z - (this.player.prevZ !== undefined ? this.player.prevZ : this.player.z);
      this.player.prevZ = this.player.z;
      if (deltaZ > 0) {
        this.player.lapDistanceTravelled += deltaZ;
      }

      // Checkpoint passing check (strict sequential ordering: 1 -> 2 -> 3)
      if (currentSegment.checkpoint > 0) {
        if (currentSegment.checkpoint === this.player.currentCheckpoint + 1) {
          this.player.currentCheckpoint = currentSegment.checkpoint;
          this.player.checkpointsPassed[this.player.currentCheckpoint - 1] = true;
          const sectorTime = this.hud.formatTime(this.player.currentLapTime);
          this.hud.showNotification(`SECTOR ${this.player.currentCheckpoint} • ${sectorTime}`, 1800);
          if (window.UR && window.UR.audio) {
            window.UR.audio.playCheckpoint();
          }

          // Clearing Sector 3 arms the finish line for valid circuit completion
          if (this.player.currentCheckpoint === 3) {
            this.player.finishLineArmed = true;
          }
        }
      }

      // Authoritative Finish Line Crossing Check:
      // Must satisfy:
      // 1. Forward motion (speed > 0)
      // 2. Finish line armed by clearing checkpoint 3
      // 3. All 3 checkpoints cleared
      // 4. Valid forward circuit distance completed (>= 85% of trackLength)
      // 5. Within start/finish area (segment index < 4 or currDist < 600)
      // 6. Debounced so single crossing triggers once (z - lastFinishCrossingZ > trackLength * 0.5)
      const currentSegmentIndex = currentSegment.index;
      const currDist = this.player.z % trackLength;
      const isAtFinishLine = (currentSegmentIndex < 4 || currDist < 600);
      const hasDebounce = (this.player.z - (this.player.lastFinishCrossingZ || -1000) > trackLength * 0.5);

      if (
        this.player.speed > 0 &&
        this.player.finishLineArmed &&
        this.player.currentCheckpoint === 3 &&
        this.player.checkpointsPassed[0] &&
        this.player.checkpointsPassed[1] &&
        this.player.checkpointsPassed[2] &&
        this.player.lapDistanceTravelled >= trackLength * 0.85 &&
        isAtFinishLine &&
        hasDebounce
      ) {
        this.player.lastFinishCrossingZ = this.player.z;
        const completedLapTime = this.player.currentLapTime;
        this.player.lapTimes.push(completedLapTime);

        if (!this.player.bestLapTime || completedLapTime < this.player.bestLapTime) {
          this.player.bestLapTime = completedLapTime;
        }

        if (this.player.lap < this.player.maxLaps) {
          this.player.lap++;
          this.player.currentCheckpoint = 0;
          this.player.checkpointsPassed = [false, false, false];
          this.player.finishLineArmed = false;
          this.player.lapDistanceTravelled = 0;
          this.player.currentLapTime = 0;

          const isFinal = (this.player.lap === this.player.maxLaps);
          this.hud.showNotification(isFinal ? `FINAL LAP • ${this.player.lap} / ${this.player.maxLaps}` : `LAP ${this.player.lap} / ${this.player.maxLaps}`, 2500);
          if (window.UR && window.UR.audio) {
            window.UR.audio.playLapComplete();
          }
          // Immediate HUD update
          if (this.hud.lapText) {
            this.hud.lapText.textContent = `LAP ${this.player.lap} / ${this.player.maxLaps}`;
          }
        } else {
          // Finished Final Lap!
          this.finishRace();
        }
      }
    }

    updateRacePositions() {
      if (this.mode === 'time-trial') {
        this.player.position = 1;
        return;
      }

      const trackLength = this.currentTrackGeometry ? this.currentTrackGeometry.length : 1;
      const getScore = (racer) => {
        if (racer.finished && racer.finishTime) {
          return 1000000000 - racer.finishTime;
        }
        return (racer.lap - 1) * trackLength + (racer.z % trackLength);
      };

      const allRacers = [
        { name: 'player', lap: this.player.lap, z: this.player.z, finished: this.player.hasFinished, finishTime: this.player.finishTime },
        ...this.aiManager.getOpponents().map(ai => ({
          name: ai.name,
          lap: ai.lap || 1,
          z: ai.z,
          finished: ai.hasFinished,
          finishTime: ai.finishTime
        }))
      ];

      allRacers.sort((a, b) => getScore(b) - getScore(a));
      const playerRank = allRacers.findIndex(r => r.name === 'player') + 1;
      this.player.position = Math.max(1, Math.min(allRacers.length, playerRank));
    }

    finishRace() {
      this.player.hasFinished = true;
      this.player.finishTime = this.player.raceTime;

      // Award credits & XP scaled by level
      const level = this.currentTrackData?.level || 1;
      const levelBonus = level * 80;
      let earnedCredits = 200 + levelBonus; // Base completion
      let earnedXP = 100 + Math.round(levelBonus * 0.6);

      const pos = this.player.position;
      if (pos === 1) {
        earnedCredits += 1000;
        earnedXP += 400;
      } else if (pos === 2) {
        earnedCredits += 600;
        earnedXP += 250;
      } else if (pos === 3) {
        earnedCredits += 350;
        earnedXP += 150;
      } else {
        earnedCredits += 120;
        earnedXP += 50;
      }

      // Drift points conversion (100 drift pts = 1 credit)
      const driftCredits = Math.min(500, Math.floor(this.player.totalDriftScore / 100));
      earnedCredits += driftCredits;

      // Level progression unlock (podium finish or time-trial unlocks next level)
      let unlockedNewLevel = false;
      if (pos <= 3 || this.mode === 'time-trial') {
        unlockedNewLevel = window.UR.SaveSystem.completeLevel(level);
      }

      // Save progression
      window.UR.SaveSystem.addCredits(earnedCredits);
      window.UR.SaveSystem.addXP(earnedXP);
      window.UR.SaveSystem.recordDistance(this.player.totalDistanceTravelled);
      window.UR.SaveSystem.recordDriftScore(this.player.bestSingleDrift);

      const raceSummary = {
        trackId: this.currentTrackData.id,
        position: this.player.position,
        totalTime: this.player.finishTime,
        bestLap: this.player.bestLapTime,
        driftScore: this.player.totalDriftScore,
        topSpeed: this.player.getSpeedKmH(),
        perfectLap: this.player.perfectLapCandidate,
        nitroUses: Math.floor(this.player.nitroBurnCount / 2),
        championshipWon: false
      };

      // Handle Championship points
      if (this.mode === 'championship') {
        const pointsMap = [10, 8, 6, 4, 2, 1];
        this.championshipPoints.player += pointsMap[pos - 1] || 1;

        // Distribute points to AI
        const opponents = this.aiManager.getOpponents();
        opponents.forEach((ai, idx) => {
          this.championshipPoints[ai.name] = (this.championshipPoints[ai.name] || 0) + (pointsMap[(idx + 1) % 6] || 1);
        });

        if (this.championshipIndex === this.championshipTracks.length - 1) {
          // Championship complete!
          if (this.championshipPoints.player >= Math.max(...Object.values(this.championshipPoints))) {
            raceSummary.championshipWon = true;
            earnedCredits += 2500;
            earnedXP += 1500;
            window.UR.SaveSystem.addCredits(2500);
            window.UR.SaveSystem.addXP(1500);
          }
        }
      }

      const saveResult = window.UR.SaveSystem.recordRaceResult(raceSummary);

      // Render Results Screen
      this.renderResultsScreen(earnedCredits, earnedXP, saveResult.isPersonalBest, unlockedNewLevel);
      this.setState(STATES.RESULTS);
    }

    renderResultsScreen(earnedCredits, earnedXP, isPersonalBest, unlockedNewLevel) {
      const setTxt = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
      };

      const totalRacers = (this.aiManager && this.aiManager.getOpponents().length > 0) ? this.aiManager.getOpponents().length + 1 : 1;
      setTxt('resPosition', this.mode === 'time-trial' ? 'SOLO' : `${this.player.position} / ${totalRacers}`);
      setTxt('resTime', this.hud.formatTime(this.player.finishTime));
      setTxt('resBestLap', this.hud.formatTime(this.player.bestLapTime));
      setTxt('resTopSpeed', `${this.player.getSpeedKmH()} KM/H`);
      setTxt('resDriftScore', this.player.totalDriftScore.toLocaleString());
      setTxt('resCredits', `+${earnedCredits.toLocaleString()} CR`);
      setTxt('resXP', `+${earnedXP.toLocaleString()} XP`);

      const pbBanner = document.getElementById('resPersonalBestBanner');
      if (pbBanner) {
        pbBanner.style.display = isPersonalBest ? 'block' : 'none';
      }

      const unlockBanner = document.getElementById('resLevelUnlockedBanner');
      if (unlockBanner) {
        unlockBanner.style.display = unlockedNewLevel ? 'block' : 'none';
      }

      // Next race button in championship mode
      const nextBtn = document.getElementById('resNextRaceBtn');
      if (nextBtn) {
        if (this.mode === 'championship' && this.championshipIndex < this.championshipTracks.length - 1) {
          nextBtn.style.display = 'inline-flex';
        } else {
          nextBtn.style.display = 'none';
        }
      }
    }

    render() {
      if (this.renderer && this.currentTrackGeometry) {
        this.renderer.render(
          this.currentTrackGeometry, 
          this.player, 
          this.camera, 
          this.aiManager, 
          this.trafficManager, 
          this.particleSystem
        );

        if (this.debugMode) {
          this.renderDebugOverlay();
        }
      }
    }

    renderDebugOverlay() {
      if (!this.renderer || !this.currentTrackGeometry) return;
      const ctx = this.renderer.ctx;
      const track = this.currentTrackGeometry;
      const segCount = track.segments.length;
      const segIdx = Math.floor((this.player.z % track.length) / 200) % segCount;
      const seg = track.segments[segIdx] || track.segments[0];

      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1.5;
      const boxW = 350;
      const boxH = 215;
      ctx.fillRect(16, 16, boxW, boxH);
      ctx.strokeRect(16, 16, boxW, boxH);

      ctx.fillStyle = '#00f0ff';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`CIRCUIT TELEMETRY [\\ to toggle]`, 26, 36);

      ctx.fillStyle = '#f8fafc';
      ctx.font = '11px monospace';
      ctx.fillText(`CIRCUIT: ${this.currentTrackData?.name || 'N/A'} • ${this.currentTrackData?.difficulty || 'Normal'}`, 26, 54);
      ctx.fillText(`SECTOR: S${seg.sector} • ${seg.sectionName}`, 26, 72);
      ctx.fillText(`SEGMENT: ${seg.index} / ${segCount} (${Math.round((seg.index / segCount) * 100)}%)`, 26, 90);
      ctx.fillText(`CURVE: ${seg.curve.toFixed(2)} | ELEV: ${seg.elevation.toFixed(1)}m`, 26, 108);
      const idealX = seg.waypoint?.idealX !== undefined ? seg.waypoint.idealX.toFixed(2) : '0.00';
      const recSpeed = Math.round((seg.waypoint?.recommendedSpeedRatio || 1.0) * 100);
      ctx.fillText(`WAYPOINT: IdealX ${idealX} | CornerTarget ${recSpeed}%`, 26, 126);
      ctx.fillText(`PLAYER: ${this.player.getSpeedKmH()} km/h | RoadX: ${this.player.x.toFixed(2)}`, 26, 144);
      ctx.fillText(`CHECKPOINTS: ${this.player.currentCheckpoint} / 3 | LAP: ${this.player.lap} / ${this.player.maxLaps}`, 26, 162);

      // Live Input & Control State (Requirement #29)
      const inp = window.UR.input;
      const wState = inp.isActionActive('accelerate') ? 'ON' : 'OFF';
      const sState = inp.isActionActive('brake') ? 'ON' : 'OFF';
      const aState = inp.isActionActive('steerLeft') ? 'ON' : 'OFF';
      const dState = inp.isActionActive('steerRight') ? 'ON' : 'OFF';
      const spState = inp.isActionActive('drift') ? 'ON' : 'OFF';
      const shState = inp.isActionActive('nitro') ? 'ON' : 'OFF';

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`KEYS: W:${wState} S:${sState} A:${aState} D:${dState} SPACE:${spState} SHIFT:${shState}`, 26, 182);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`STEER: ${this.player.steeringAngle ? (this.player.steeringAngle * 57.3).toFixed(1) + '°' : '0.0°'} | DRIFT: ${this.player.isDrifting ? 'YES (' + this.player.currentDriftScore + ')' : 'NO'}`, 26, 200);
      ctx.restore();
    }

    renderTrackSelectionCards() {
      const container = document.getElementById('trackCardsGrid');
      if (!container) return;

      const tracks = window.UR.TRACKS || [];
      const bestTimes = window.UR.SaveSystem.getData().bestTimes || {};

      container.innerHTML = tracks.map(track => {
        const best = bestTimes[track.id] ? this.hud.formatTime(bestTimes[track.id]) : '--:--.---';
        const isUnlocked = window.UR.SaveSystem.isLevelUnlocked(track.level);
        const isCompleted = window.UR.SaveSystem.isLevelCompleted(track.level);

        const cardClass = `track-card ${isUnlocked ? '' : 'locked'} ${isCompleted ? 'completed' : ''}`;
        const lockBadge = isUnlocked
          ? (isCompleted ? '<span class="track-completed-tag"><i class="fas fa-check-circle"></i> COMPLETED</span>' : '')
          : `<span class="track-locked-tag"><i class="fas fa-lock"></i> LOCKED (COMPLETE LVL ${track.level - 1})</span>`;

        const btnText = isUnlocked ? (isCompleted ? 'Race Again' : 'Select Track') : 'Locked';
        const btnClass = isUnlocked ? 'btn btn-primary track-select-btn' : 'btn btn-secondary track-select-btn disabled';

        return `
          <div class="${cardClass}" data-track-id="${track.id}" data-level="${track.level}">
            <div class="track-card-header">
              <span class="track-level-badge">LVL ${track.level}</span>
              <span class="track-badge ${track.difficulty.toLowerCase().replace(/\\s+/g, '-')}">${track.difficulty}</span>
              <span class="track-weather">${track.timeOfDay.toUpperCase()} • ${track.weather.toUpperCase()}</span>
            </div>
            <h3 class="track-title">${track.name}</h3>
            <p class="track-tagline">${track.tagline}</p>
            <div class="track-meta">
              <span>Laps: <strong>${track.laps}</strong></span>
              <span>Record: <strong>${best}</strong></span>
            </div>
            <div class="track-card-status">
              ${lockBadge}
            </div>
            <button class="${btnClass}" data-track-id="${track.id}" ${isUnlocked ? '' : 'disabled'} style="width: 100%; margin-top: 10px;">
              ${btnText}
            </button>
          </div>
        `;
      }).join('');

      container.querySelectorAll('.track-card:not(.locked)').forEach(el => {
        el.addEventListener('click', (e) => {
          const trackId = el.getAttribute('data-track-id');
          if (trackId) {
            window.UR.audio.playClick();
            this.startRace(trackId, this.mode);
          }
        });
      });
    }

    syncSettingsUI() {
      const s = window.UR.SaveSystem.getSettings();
      const setCheck = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.checked = Boolean(val);
      };

      setCheck('chkSfx', s.soundEffects);
      setCheck('chkMusic', s.music);
      setCheck('chkShake', s.screenShake);
      setCheck('chkFPS', s.showFPS);
      setCheck('chkMinimap', s.showMinimap);

      const sensInput = document.getElementById('inputSens');
      if (sensInput) sensInput.value = s.controlSensitivity || 1.0;
    }

    bindUIEvents() {
      // Main Menu Buttons
      document.getElementById('btnQuickRace')?.addEventListener('click', () => {
        window.UR.audio.playClick();
        this.mode = 'quick-race';
        this.setState(STATES.TRACK_SELECT);
      });

      document.getElementById('btnTimeTrial')?.addEventListener('click', () => {
        window.UR.audio.playClick();
        this.mode = 'time-trial';
        this.setState(STATES.TRACK_SELECT);
      });

      document.getElementById('btnChampionship')?.addEventListener('click', () => {
        window.UR.audio.playClick();
        this.mode = 'championship';
        this.championshipIndex = 0;
        this.championshipPoints = { player: 0, Nova: 0, Rex: 0, Shadow: 0, Blaze: 0, Vortex: 0 };
        this.startRace(this.championshipTracks[0], 'championship');
      });

      document.getElementById('btnGarage')?.addEventListener('click', () => {
        window.UR.audio.playClick();
        this.setState(STATES.GARAGE);
      });

      document.getElementById('btnTracks')?.addEventListener('click', () => {
        window.UR.audio.playClick();
        this.setState(STATES.TRACK_SELECT);
      });

      document.getElementById('btnSettings')?.addEventListener('click', () => {
        window.UR.audio.playClick();
        this.setState(STATES.SETTINGS);
      });

      // Return to InfinityPlay Buttons
      const returnToInfinityPlay = () => {
        window.UR.audio.playClick();
        window.location.href = '../../index.html';
      };

      document.querySelectorAll('.btn-back-infinityplay').forEach(btn => {
        btn.addEventListener('click', returnToInfinityPlay);
      });

      // Back buttons in submenus
      document.querySelectorAll('.btn-back-menu').forEach(btn => {
        btn.addEventListener('click', () => {
          window.UR.audio.playClick();
          this.setState(STATES.MENU);
        });
      });

      // Garage Car Navigation & Upgrades
      document.getElementById('garagePrevCar')?.addEventListener('click', () => window.UR.garage.prevCar());
      document.getElementById('garageNextCar')?.addEventListener('click', () => window.UR.garage.nextCar());
      document.getElementById('garageSelectBtn')?.addEventListener('click', () => window.UR.garage.selectCurrentCar());

      const parts = ['engine', 'turbo', 'brakes', 'handling', 'nitro'];
      for (const p of parts) {
        document.getElementById(`partBtn_${p}`)?.addEventListener('click', () => {
          window.UR.garage.upgradePart(p);
        });
      }

      // Pause Menu Actions
      document.getElementById('btnResume')?.addEventListener('click', () => {
        window.UR.audio.playClick();
        this.setState(STATES.RACING);
      });

      document.getElementById('btnRestart')?.addEventListener('click', () => {
        window.UR.audio.playClick();
        this.startRace(this.currentTrackData?.id || 'neon-city', this.mode);
      });

      document.getElementById('btnPauseSettings')?.addEventListener('click', () => {
        window.UR.audio.playClick();
        this.setState(STATES.SETTINGS);
      });

      // Results Screen Actions
      document.getElementById('resRetryBtn')?.addEventListener('click', () => {
        window.UR.audio.playClick();
        this.startRace(this.currentTrackData?.id || 'neon-city', this.mode);
      });

      document.getElementById('resNextRaceBtn')?.addEventListener('click', () => {
        window.UR.audio.playClick();
        this.championshipIndex++;
        const nextTrack = this.championshipTracks[this.championshipIndex] || this.championshipTracks[0];
        this.startRace(nextTrack, 'championship');
      });

      document.getElementById('resGarageBtn')?.addEventListener('click', () => {
        window.UR.audio.playClick();
        this.setState(STATES.GARAGE);
      });

      document.getElementById('resMainMenuBtn')?.addEventListener('click', () => {
        window.UR.audio.playClick();
        this.setState(STATES.MENU);
      });

      // Settings Checkbox & Sensitivity Inputs
      const bindSettingChange = (id, key) => {
        document.getElementById(id)?.addEventListener('change', (e) => {
          window.UR.SaveSystem.saveSettings({ [key]: e.target.checked });
        });
      };
      bindSettingChange('chkSfx', 'soundEffects');
      bindSettingChange('chkMusic', 'music');
      bindSettingChange('chkShake', 'screenShake');
      bindSettingChange('chkFPS', 'showFPS');
      bindSettingChange('chkMinimap', 'showMinimap');

      document.getElementById('inputSens')?.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) || 1.0;
        window.UR.SaveSystem.saveSettings({ controlSensitivity: val });
      });

      // Fullscreen Button
      document.getElementById('btnFullscreen')?.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });

      // Bind Mobile Touch Buttons
      const input = window.UR.input;
      input.bindTouchButton(document.getElementById('btnTouchLeft'), 'steerLeft');
      input.bindTouchButton(document.getElementById('btnTouchRight'), 'steerRight');
      input.bindTouchButton(document.getElementById('btnTouchAccel'), 'accelerate');
      input.bindTouchButton(document.getElementById('btnTouchBrake'), 'brake');
      input.bindTouchButton(document.getElementById('btnTouchDrift'), 'drift');
      input.bindTouchButton(document.getElementById('btnTouchNitro'), 'nitro');

      // Quick in-game actions
      document.getElementById('btnQuickPause')?.addEventListener('click', () => {
        window.UR.audio.playClick();
        if (this.state === STATES.RACING) {
          this.setState(STATES.PAUSED);
        } else if (this.state === STATES.PAUSED) {
          this.setState(STATES.RACING);
        }
      });

      document.getElementById('btnQuickReset')?.addEventListener('click', () => {
        window.UR.audio.playClick();
        if (this.state === STATES.RACING && this.currentTrackGeometry) {
          const trackLength = this.currentTrackGeometry.length;
          const segIdx = Math.floor((this.player.z % trackLength) / 200);
          this.player.resetPosition(segIdx, trackLength);
          const segElev = this.currentTrackGeometry.segments[segIdx]?.p1?.world?.y || 0;
          this.camera.reset(this.player.x, this.player.z, segElev);
          this.hud.showNotification('CAR RESET', 1500);
        }
      });

      const btnToggleControls = document.getElementById('btnToggleControls');
      const clusterLeft = document.getElementById('touchClusterLeft');
      const clusterRight = document.getElementById('touchClusterRight');
      if (btnToggleControls && clusterLeft && clusterRight) {
        let controlsVisible = true;
        btnToggleControls.addEventListener('click', () => {
          window.UR.audio.playClick();
          controlsVisible = !controlsVisible;
          clusterLeft.style.display = controlsVisible ? 'flex' : 'none';
          clusterRight.style.display = controlsVisible ? 'flex' : 'none';
          btnToggleControls.textContent = controlsVisible ? '🎮 CONTROLS: ON' : '🎮 CONTROLS: OFF';
        });
      }
    }
  }

  window.UR = window.UR || {};
  window.UR.GameManager = GameManager;
})();

