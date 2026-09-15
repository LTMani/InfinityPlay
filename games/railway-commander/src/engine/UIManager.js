/**
 * Railway Commander - Indian Railways WAP-7 Cockpit & UI Manager
 * Handles:
 * - Top HUD: Next Stop ARAKKONAM cluster, Amber digital 7-segment 22:15 clock,
 *   bold 80 KMPH speed readout, circular speed gauge, 70 KMPH speed limit dial
 * - Left Warnings: Red Signal in 200Mts, Speed Limit in 150Mts, Track Change in 230Mts
 * - Bottom Timetable: Arrival target & real-time driver log
 * - Driver Console: Emergency Stop button, Auxiliary dock (Panto, Power, Lights, Doors, Chime, big blue Horn),
 *   Reverser [F] [R], Throttle slider with percentage readout
 * - Menus, countdown, briefing, results, and pause modals
 */

export class UIManager {
  constructor(gameEngine) {
    this.engine = gameEngine;
    this.dom = {};
    this.notificationTimeout = null;

    // Simulation Clock
    this.simSeconds = 22 * 3600 + 15 * 60; // 22:15:00 default
    this.lastLogMessage = '9:40 PM | CAB ACTIVE • TRACK CLEAR';
  }

  init() {
    this.cacheDomElements();
    this.bindEvents();
  }

  cacheDomElements() {
    // Screens
    this.dom.screenMainMenu = document.getElementById('screenMainMenu');
    this.dom.screenMissions = document.getElementById('screenMissions');
    this.dom.screenProgress = document.getElementById('screenProgress');
    this.dom.screenSettings = document.getElementById('screenSettings');
    this.dom.screenBriefing = document.getElementById('screenBriefing');
    this.dom.gameHUD = document.getElementById('gameHUD');
    this.dom.screenCountdown = document.getElementById('screenCountdown');
    this.dom.screenPause = document.getElementById('screenPause');
    this.dom.screenComplete = document.getElementById('screenComplete');
    this.dom.screenFailed = document.getElementById('screenFailed');

    // Top Bar HUD
    this.dom.hudCameraBadge = document.getElementById('hudCameraBadge');
    this.dom.btnCameraToggle = document.getElementById('btnCameraToggle');
    this.dom.btnPauseGame = document.getElementById('btnPauseGame');

    this.dom.hudNextStopName = document.getElementById('hudNextStopName');
    this.dom.hudNextStopDist = document.getElementById('hudNextStopDist');

    this.dom.hudDigitalClock = document.getElementById('hudDigitalClock');
    this.dom.hudSpeedVal = document.getElementById('hudSpeedVal');
    this.dom.hudSpeedArc = document.getElementById('hudSpeedArc');
    this.dom.hudSpeedLimitVal = document.getElementById('hudSpeedLimitVal');
    this.dom.hudSpeedLimitBadge = document.getElementById('hudSpeedLimitBadge');
    this.dom.hudLimitTimer = document.getElementById('hudLimitTimer');

    // Left Alert Chips
    this.dom.hudLeftAlerts = document.getElementById('hudLeftAlerts');
    this.dom.alertSignalChip = document.getElementById('alertSignalChip');
    this.dom.alertSignalOptic = document.getElementById('alertSignalOptic');
    this.dom.alertSignalText = document.getElementById('alertSignalText');

    this.dom.alertSpeedChip = document.getElementById('alertSpeedChip');
    this.dom.alertSpeedSignVal = document.getElementById('alertSpeedSignVal');
    this.dom.alertSpeedText = document.getElementById('alertSpeedText');

    this.dom.alertTrackChangeChip = document.getElementById('alertTrackChangeChip');
    this.dom.alertTrackChangeText = document.getElementById('alertTrackChangeText');

    this.dom.hudOverspeedToast = document.getElementById('hudOverspeedToast');

    // Bottom Timetable & Status Capsule
    this.dom.hudTimetableTarget = document.getElementById('hudTimetableTarget');
    this.dom.hudStatusLog = document.getElementById('hudStatusLog');

    // Bottom Driver Console Controls
    this.dom.btnEmergencyBrake = document.getElementById('btnEmergencyBrake');

    this.dom.btnPantograph = document.getElementById('btnPantograph');
    this.dom.ledPantograph = document.getElementById('ledPantograph');

    this.dom.btnEnginePower = document.getElementById('btnEnginePower');
    this.dom.ledPower = document.getElementById('ledPower');

    this.dom.btnHeadlights = document.getElementById('btnHeadlights');
    this.dom.ledHeadlights = document.getElementById('ledHeadlights');

    this.dom.btnDoors = document.getElementById('btnDoors');
    this.dom.ledDoors = document.getElementById('ledDoors');

    this.dom.btnStationChime = document.getElementById('btnStationChime');
    this.dom.ledChime = document.getElementById('ledChime');

    this.dom.btnHorn = document.getElementById('btnHorn');

    this.dom.btnRevForward = document.getElementById('btnRevForward');
    this.dom.btnRevReverse = document.getElementById('btnRevReverse');

    this.dom.hudThrottleReadout = document.getElementById('hudThrottleReadout');
    this.dom.hudThrottleSlider = document.getElementById('hudThrottleSlider');
    this.dom.btnThrottleDown = document.getElementById('btnThrottleDown');
    this.dom.btnThrottleUp = document.getElementById('btnThrottleUp');

    // Countdown
    this.dom.countdownNumber = document.getElementById('countdownNumber');

    // Briefing elements
    this.dom.briefingTitle = document.getElementById('briefingTitle');
    this.dom.briefingTagline = document.getElementById('briefingTagline');
    this.dom.briefingRoute = document.getElementById('briefingRoute');
    this.dom.briefingDistance = document.getElementById('briefingDistance');
    this.dom.briefingSpeedLimit = document.getElementById('briefingSpeedLimit');
    this.dom.briefingObjective = document.getElementById('briefingObjective');
    this.dom.briefingStations = document.getElementById('briefingStations');

    // Complete Screen elements
    this.dom.completeTitle = document.getElementById('completeTitle');
    this.dom.completeScore = document.getElementById('completeScore');
    this.dom.completeRank = document.getElementById('completeRank');
    this.dom.completeStars = document.getElementById('completeStars');
    this.dom.completeXp = document.getElementById('completeXp');
    this.dom.completeCoins = document.getElementById('completeCoins');
    this.dom.completeBreakdown = document.getElementById('completeBreakdown');

    // Failed Screen elements
    this.dom.failedReason = document.getElementById('failedReason');

    // Missions List Container
    this.dom.missionsListGrid = document.getElementById('missionsListGrid');

    // Progress Elements
    this.dom.progressLevel = document.getElementById('progressLevel');
    this.dom.progressXp = document.getElementById('progressXp');
    this.dom.progressCoins = document.getElementById('progressCoins');
    this.dom.progressStarsTotal = document.getElementById('progressStarsTotal');
    this.dom.progressMissionsTotal = document.getElementById('progressMissionsTotal');
  }

  bindEvents() {
    // Menu navigation
    document.getElementById('btnMenuPlay')?.addEventListener('click', () => {
      this.engine.soundManager.playClick();
      this.engine.prepareMission('mission-1');
    });
    document.getElementById('btnMenuMissions')?.addEventListener('click', () => {
      this.engine.soundManager.playClick();
      this.showMissionsScreen();
    });
    document.getElementById('btnMenuProgress')?.addEventListener('click', () => {
      this.engine.soundManager.playClick();
      this.showProgressScreen();
    });
    document.getElementById('btnMenuSettings')?.addEventListener('click', () => {
      this.engine.soundManager.playClick();
      this.showSettingsScreen();
    });

    document.querySelectorAll('.btn-back-menu').forEach(btn => {
      btn.addEventListener('click', () => {
        this.engine.soundManager.playClick();
        this.showMainMenu();
      });
    });

    document.getElementById('btnStartJourney')?.addEventListener('click', () => {
      this.engine.soundManager.playClick();
      this.engine.beginJourneyCountdown();
    });

    document.getElementById('btnResumeGame')?.addEventListener('click', () => {
      this.engine.soundManager.playClick();
      this.engine.resumeGame();
    });
    document.getElementById('btnRestartGame')?.addEventListener('click', () => {
      this.engine.soundManager.playClick();
      this.engine.restartCurrentMission();
    });
    document.getElementById('btnQuitToMenu')?.addEventListener('click', () => {
      this.engine.soundManager.playClick();
      this.engine.quitToMenu();
    });

    document.getElementById('btnRetryFailed')?.addEventListener('click', () => {
      this.engine.soundManager.playClick();
      this.engine.restartCurrentMission();
    });
    document.getElementById('btnFailedMenu')?.addEventListener('click', () => {
      this.engine.soundManager.playClick();
      this.engine.quitToMenu();
    });

    document.getElementById('btnNextMission')?.addEventListener('click', () => {
      this.engine.soundManager.playClick();
      const res = this.engine.lastMissionResult;
      if (res && res.nextMissionId) {
        this.engine.prepareMission(res.nextMissionId);
      } else {
        this.showMissionsScreen();
      }
    });
    document.getElementById('btnRetryComplete')?.addEventListener('click', () => {
      this.engine.soundManager.playClick();
      this.engine.restartCurrentMission();
    });
    document.getElementById('btnCompleteMenu')?.addEventListener('click', () => {
      this.engine.soundManager.playClick();
      this.engine.quitToMenu();
    });

    // Camera Mode Switcher Button
    this.dom.btnCameraToggle?.addEventListener('click', () => {
      this.engine.soundManager.playClick();
      const mode = this.engine.renderer.cycleCameraMode();
      if (this.dom.hudCameraBadge) {
        this.dom.hudCameraBadge.textContent = this.engine.renderer.getCameraModeLabel();
      }
      this.setEventLog(`CAMERA: ${mode.toUpperCase()} VIEW`);
    });

    // Pause Game Button
    this.dom.btnPauseGame?.addEventListener('click', () => {
      this.engine.soundManager.playClick();
      this.engine.pauseGame();
    });

    // Emergency Stop Button
    this.dom.btnEmergencyBrake?.addEventListener('click', () => {
      this.engine.applyEmergencyBrake();
      this.setEventLog('EMERGENCY BRAKE APPLIED');
      this.showNotification('🛑 EMERGENCY BRAKE ENGAGED!', 'danger');
    });

    // Pantograph Toggle Button
    this.dom.btnPantograph?.addEventListener('click', () => {
      const isUp = this.engine.physics.togglePantograph();
      this.engine.soundManager.playPantographSpark();
      if (this.dom.ledPantograph) {
        this.dom.ledPantograph.className = isUp ? 'aux-led on' : 'aux-led off';
      }
      this.dom.btnPantograph.classList.toggle('active', isUp);
      this.setEventLog(isUp ? 'PANTOGRAPH RAISED (25kV OHE)' : 'PANTOGRAPH LOWERED - NO TRACTION');
    });

    // Traction Inverter Power Toggle Button
    this.dom.btnEnginePower?.addEventListener('click', () => {
      const pwr = this.engine.physics.toggleEnginePower();
      this.engine.soundManager.playClick();
      if (this.dom.ledPower) {
        this.dom.ledPower.className = pwr ? 'aux-led on' : 'aux-led off';
      }
      this.dom.btnEnginePower.classList.toggle('active', pwr);
      this.setEventLog(pwr ? 'TRACTION INVERTERS ONLINE' : 'TRACTION INVERTERS OFFLINE');
    });

    // Headlights Toggle Button
    this.dom.btnHeadlights?.addEventListener('click', () => {
      const hl = this.engine.physics.toggleHeadlights();
      this.engine.soundManager.playClick();
      if (this.dom.ledHeadlights) {
        this.dom.ledHeadlights.className = hl ? 'aux-led on' : 'aux-led off';
      }
      this.dom.btnHeadlights.classList.toggle('active', hl);
      this.setEventLog(hl ? 'HEADLIGHTS HIGH BEAM ON' : 'HEADLIGHTS OFF');
    });

    // Passenger Doors Toggle Button
    this.dom.btnDoors?.addEventListener('click', () => {
      const ok = this.engine.physics.toggleDoors();
      if (ok) {
        const open = this.engine.physics.doorsOpen;
        this.engine.soundManager.playDoorSound(open);
        if (this.dom.ledDoors) {
          this.dom.ledDoors.className = open ? 'aux-led on' : 'aux-led off';
        }
        this.dom.btnDoors.classList.toggle('active', open);
        this.setEventLog(open ? 'DOORS OPEN - PLATFORM PASSENGERS' : 'DOORS CLOSED - SAFETY LOCKED');
      } else {
        this.showNotification('Cannot open doors while train is moving!', 'warning');
      }
    });

    // Station Announcement Chime Button
    this.dom.btnStationChime?.addEventListener('click', () => {
      this.engine.soundManager.playStationChime();
      this.setEventLog('STATION ANNOUNCEMENT CHIME');
      this.showNotification('📢 "Yatri kripya dhyan dein..."', 'info');
    });

    // Big Blue Circular Locomotive Horn Button (Touch & Mouse hold)
    const hornBtn = this.dom.btnHorn;
    if (hornBtn) {
      const hornStart = (e) => {
        e.preventDefault();
        this.engine.physics.setHorn(true);
        this.engine.soundManager.playHorn(true);
      };
      const hornEnd = (e) => {
        e.preventDefault();
        this.engine.physics.setHorn(false);
        this.engine.soundManager.playHorn(false);
      };

      hornBtn.addEventListener('mousedown', hornStart);
      hornBtn.addEventListener('mouseup', hornEnd);
      hornBtn.addEventListener('mouseleave', hornEnd);
      hornBtn.addEventListener('touchstart', hornStart, { passive: false });
      hornBtn.addEventListener('touchend', hornEnd, { passive: false });
    }

    // Reverser Selector [F] [R]
    this.dom.btnRevForward?.addEventListener('click', () => {
      if (this.engine.physics.setReverser('F')) {
        this.engine.soundManager.playClick();
        this.dom.btnRevForward.classList.add('active');
        this.dom.btnRevReverse.classList.remove('active');
        this.setEventLog('REVERSER: FORWARD (F)');
      }
    });

    this.dom.btnRevReverse?.addEventListener('click', () => {
      if (this.engine.physics.setReverser('R')) {
        this.engine.soundManager.playClick();
        this.dom.btnRevReverse.classList.add('active');
        this.dom.btnRevForward.classList.remove('active');
        this.setEventLog('REVERSER: REVERSE (R)');
      }
    });

    // Throttle Range Slider
    this.dom.hudThrottleSlider?.addEventListener('input', (e) => {
      const pct = parseInt(e.target.value, 10) || 0;
      this.engine.physics.setThrottlePercent(pct);
    });

    // Throttle Step Buttons
    this.dom.btnThrottleUp?.addEventListener('click', () => {
      this.engine.physics.throttleUp();
      this.engine.soundManager.playClick();
    });

    this.dom.btnThrottleDown?.addEventListener('click', () => {
      this.engine.physics.throttleDown();
      this.engine.soundManager.playClick();
    });

    // Sound & Settings
    const sfxBtn = document.getElementById('btnSettingSound');
    if (sfxBtn) {
      sfxBtn.addEventListener('click', () => {
        const active = this.engine.soundManager.toggleSound();
        sfxBtn.classList.toggle('active', active);
        sfxBtn.textContent = active ? 'ON' : 'OFF';
      });
    }

    const musicBtn = document.getElementById('btnSettingMusic');
    if (musicBtn) {
      musicBtn.addEventListener('click', () => {
        const active = !this.engine.soundManager.musicEnabled;
        this.engine.soundManager.musicEnabled = active;
        this.engine.saveManager.saveSettings({ music: active });
        musicBtn.classList.toggle('active', active);
        musicBtn.textContent = active ? 'ON' : 'OFF';
      });
    }

    document.querySelectorAll('.quality-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.engine.soundManager.playClick();
        const q = btn.getAttribute('data-quality');
        this.engine.saveManager.saveSettings({ quality: q });
        document.querySelectorAll('.quality-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }

  setEventLog(msg) {
    this.lastLogMessage = `9:40 PM | ${msg}`;
    if (this.dom.hudStatusLog) {
      this.dom.hudStatusLog.textContent = this.lastLogMessage;
    }
  }

  showScreen(targetId) {
    const screens = [
      'screenMainMenu', 'screenMissions', 'screenProgress', 'screenSettings',
      'screenBriefing', 'screenCountdown', 'screenPause', 'screenComplete', 'screenFailed'
    ];

    screens.forEach(id => {
      const el = this.dom[id];
      if (el) {
        if (id === targetId) {
          el.classList.add('active');
          el.style.display = 'flex';
        } else {
          el.classList.remove('active');
          el.style.display = 'none';
        }
      }
    });

    if (targetId === 'gameHUD' || targetId === 'screenCountdown') {
      if (this.dom.gameHUD) {
        this.dom.gameHUD.classList.remove('hidden');
        this.dom.gameHUD.style.display = 'flex';
      }
    } else if (targetId === 'screenPause') {
      if (this.dom.gameHUD) {
        this.dom.gameHUD.classList.remove('hidden');
        this.dom.gameHUD.style.display = 'flex';
      }
    } else {
      if (this.dom.gameHUD) {
        this.dom.gameHUD.classList.add('hidden');
        this.dom.gameHUD.style.display = 'none';
      }
    }
  }

  showMainMenu() {
    this.showScreen('screenMainMenu');
  }

  showMissionsScreen() {
    this.renderMissionsList();
    this.showScreen('screenMissions');
  }

  showProgressScreen() {
    const p = this.engine.saveManager.getProgress();
    if (this.dom.progressLevel) this.dom.progressLevel.textContent = `Level ${p.driverLevel}`;
    if (this.dom.progressXp) this.dom.progressXp.textContent = `${p.totalXp.toLocaleString()} XP`;
    if (this.dom.progressCoins) this.dom.progressCoins.textContent = `${p.coins.toLocaleString()} 🪙`;

    const totalStars = Object.values(p.missionStars || {}).reduce((a, b) => a + b, 0);
    if (this.dom.progressStarsTotal) this.dom.progressStarsTotal.textContent = `${totalStars} ★`;
    if (this.dom.progressMissionsTotal) this.dom.progressMissionsTotal.textContent = `${p.completedMissions.length} / 4`;

    this.showScreen('screenProgress');
  }

  showSettingsScreen() {
    const s = this.engine.saveManager.settings;
    const sfxBtn = document.getElementById('btnSettingSound');
    if (sfxBtn) {
      sfxBtn.classList.toggle('active', s.sound !== false);
      sfxBtn.textContent = s.sound !== false ? 'ON' : 'OFF';
    }

    const musicBtn = document.getElementById('btnSettingMusic');
    if (musicBtn) {
      musicBtn.classList.toggle('active', s.music !== false);
      musicBtn.textContent = s.music !== false ? 'ON' : 'OFF';
    }

    document.querySelectorAll('.quality-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-quality') === (s.quality || 'HIGH'));
    });

    this.showScreen('screenSettings');
  }

  showBriefing(mission) {
    if (!mission) return;
    if (this.dom.briefingTitle) this.dom.briefingTitle.textContent = `MISSION ${mission.number}: ${mission.title}`;
    if (this.dom.briefingTagline) this.dom.briefingTagline.textContent = mission.tagline;
    if (this.dom.briefingRoute) this.dom.briefingRoute.textContent = mission.route;
    if (this.dom.briefingDistance) this.dom.briefingDistance.textContent = mission.distanceFormatted;
    if (this.dom.briefingSpeedLimit) this.dom.briefingSpeedLimit.textContent = `${mission.speedLimitKmh} km/h`;
    if (this.dom.briefingObjective) this.dom.briefingObjective.textContent = mission.objective;

    if (this.dom.briefingStations) {
      this.dom.briefingStations.innerHTML = (mission.stations || []).map((s, idx) => `
        <div class="briefing-station-item">
          <span class="station-dot">🚉</span>
          <span class="station-name">${s.name} (${(s.stopPosition / 1000).toFixed(1)} km)</span>
        </div>
      `).join('');
    }

    this.showScreen('screenBriefing');
  }

  showCountdown(number) {
    if (this.dom.countdownNumber) {
      this.dom.countdownNumber.textContent = number;
      this.dom.countdownNumber.classList.remove('pulse');
      void this.dom.countdownNumber.offsetWidth;
      this.dom.countdownNumber.classList.add('pulse');
    }
    this.showScreen('screenCountdown');
  }

  showHUD() {
    this.showScreen('gameHUD');
    if (this.dom.hudCameraBadge) {
      this.dom.hudCameraBadge.textContent = this.engine.renderer.getCameraModeLabel();
    }
  }

  showPause() {
    this.showScreen('screenPause');
  }

  showMissionFailed(reason) {
    if (this.dom.failedReason) {
      this.dom.failedReason.textContent = reason || 'Safety regulations violation.';
    }
    this.showScreen('screenFailed');
  }

  showMissionComplete(results) {
    if (!results) return;

    if (this.dom.completeTitle) this.dom.completeTitle.textContent = `${results.missionTitle} Completed! 🎉`;
    if (this.dom.completeScore) this.dom.completeScore.textContent = `${results.finalScore.toLocaleString()} PTS`;
    if (this.dom.completeRank) this.dom.completeRank.textContent = results.rank;
    if (this.dom.completeStars) {
      let starsHtml = '';
      for (let i = 1; i <= 3; i++) {
        starsHtml += i <= results.stars ? '⭐ ' : '☆ ';
      }
      this.dom.completeStars.textContent = starsHtml.trim();
    }
    if (this.dom.completeXp) this.dom.completeXp.textContent = `+${results.earnedXp} XP`;
    if (this.dom.completeCoins) this.dom.completeCoins.textContent = `+${results.earnedCoins} COINS`;

    if (this.dom.completeBreakdown) {
      const b = results.breakdown;
      this.dom.completeBreakdown.innerHTML = `
        <div class="score-row"><span>Base Safe Driving:</span><strong>+${b.baseScore}</strong></div>
        <div class="score-row"><span>Station Stop Accuracy:</span><strong>+${b.stopScore}</strong></div>
        <div class="score-row"><span>Overspeed Deduction:</span><strong style="color: #ef4444;">-${b.overspeedPenalty}</strong></div>
        <div class="score-row"><span>Emergency Brake Penalty:</span><strong style="color: #ef4444;">-${b.emergencyBrakePenalty}</strong></div>
        <div class="score-row"><span>SPAD Signal Violations:</span><strong style="color: ${b.signalViolations > 0 ? '#ef4444' : '#22c55e'};">${b.signalViolations}</strong></div>
      `;
    }

    const nextBtn = document.getElementById('btnNextMission');
    if (nextBtn) {
      nextBtn.style.display = results.nextMissionId ? 'inline-flex' : 'none';
    }

    this.showScreen('screenComplete');
  }

  renderMissionsList() {
    const container = this.dom.missionsListGrid;
    if (!container) return;

    const missions = this.engine.missionSystem.getMissions();

    container.innerHTML = missions.map(m => {
      const isLocked = !m.isUnlocked;
      let starStr = '';
      for (let i = 1; i <= 3; i++) {
        starStr += i <= m.stars ? '★' : '☆';
      }

      return `
        <div class="mission-card ${isLocked ? 'locked' : ''} ${m.isCompleted ? 'completed' : ''}" 
             data-mission-id="${m.id}">
          <div class="mission-header-row">
            <span class="mission-number-pill">MISSION ${m.number}</span>
            <span class="mission-status-pill ${m.isCompleted ? 'comp' : (isLocked ? 'lock' : 'ready')}">
              ${m.isCompleted ? '✓ COMPLETED' : (isLocked ? '🔒 LOCKED' : '▶ READY')}
            </span>
          </div>

          <h3 class="mission-card-title">${m.title}</h3>
          <p class="mission-card-tagline">${m.tagline}</p>

          <div class="mission-meta-grid">
            <div><span class="meta-lbl">ROUTE:</span> <strong>${m.route}</strong></div>
            <div><span class="meta-lbl">DISTANCE:</span> <strong>${m.distanceFormatted}</strong></div>
            <div><span class="meta-lbl">SPEED LIMIT:</span> <strong>${m.speedLimitKmh} km/h</strong></div>
            <div><span class="meta-lbl">STATIONS:</span> <strong>${(m.stations || []).length} Stops</strong></div>
          </div>

          <div class="mission-footer-row">
            <div class="mission-stars">${m.isCompleted ? starStr : '☆☆☆'}</div>
            <button class="btn btn-select-mission" ${isLocked ? 'disabled' : ''} data-mission-id="${m.id}">
              ${isLocked ? '🔒 Locked' : (m.isCompleted ? 'Replay' : 'Drive')}
            </button>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.mission-card').forEach(card => {
      card.addEventListener('click', () => {
        const missionId = card.getAttribute('data-mission-id');
        const isLocked = card.classList.contains('locked');
        if (missionId && !isLocked) {
          this.engine.soundManager.playClick();
          this.engine.prepareMission(missionId);
        }
      });
    });

    container.querySelectorAll('.btn-select-mission').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const missionId = btn.getAttribute('data-mission-id');
        if (missionId) {
          this.engine.soundManager.playClick();
          this.engine.prepareMission(missionId);
        }
      });
    });
  }

  /**
   * Main HUD Frame Update
   */
  updateHUD(state, nextSignal, nextStation, missionConfig) {
    if (!state) return;

    // 1. Digital Speedometer & Speed Arc
    const speed = Math.round(state.speedKmh);
    if (this.dom.hudSpeedVal) {
      this.dom.hudSpeedVal.textContent = speed;
    }

    if (this.dom.hudSpeedArc) {
      // Circumference = 2 * PI * 38 = ~238.7
      const speedRatio = Math.min(1.0, speed / 140);
      const strokeOffset = 238 - (speedRatio * 180);
      this.dom.hudSpeedArc.style.strokeDashoffset = strokeOffset;
    }

    // Speed Limit Display
    if (this.dom.hudSpeedLimitVal) {
      this.dom.hudSpeedLimitVal.textContent = state.speedLimitKmh;
    }

    // Overspeed Toast
    if (this.dom.hudOverspeedToast) {
      if (state.overspeedWarning) {
        this.dom.hudOverspeedToast.classList.remove('hidden');
      } else {
        this.dom.hudOverspeedToast.classList.add('hidden');
      }
    }

    // 2. Top Center: Next Stop Station
    if (this.dom.hudNextStopName) {
      const stName = nextStation ? nextStation.name : (missionConfig?.stations?.[0]?.name || 'ARAKKONAM');
      this.dom.hudNextStopName.textContent = stName;
    }
    if (this.dom.hudNextStopDist) {
      if (nextStation) {
        this.dom.hudNextStopDist.textContent = `in ${nextStation.distanceMeters.toLocaleString()} Mts`;
      } else {
        this.dom.hudNextStopDist.textContent = 'ARRIVED';
      }
    }

    // 3. Digital Amber LED Clock (e.g. 22:15)
    if (this.dom.hudDigitalClock) {
      const clockStr = missionConfig?.initialClock || '22:15';
      this.dom.hudDigitalClock.textContent = clockStr;
    }

    // 4. Left Track Warnings Stack
    // 4a. Signal Alert
    if (this.dom.alertSignalChip && this.dom.alertSignalText) {
      if (nextSignal && nextSignal.distanceMeters <= 800) {
        this.dom.alertSignalChip.style.display = 'flex';
        this.dom.alertSignalText.textContent = `${nextSignal.aspect} SIGNAL in ${nextSignal.distanceMeters}Mts`;
        if (this.dom.alertSignalOptic) {
          this.dom.alertSignalOptic.className = `optic-lens-dot ${nextSignal.aspect.toLowerCase()}`;
        }
      } else {
        this.dom.alertSignalChip.style.display = 'none';
      }
    }

    // 4b. Speed Limit Notice Alert
    if (this.dom.alertSpeedChip && this.dom.alertSpeedText) {
      const speedNotice = this.engine.trackManager.getNextSpeedLimitNotice(state.positionMeters, 650);
      if (speedNotice) {
        this.dom.alertSpeedChip.style.display = 'flex';
        if (this.dom.alertSpeedSignVal) {
          this.dom.alertSpeedSignVal.textContent = speedNotice.nextLimit;
        }
        this.dom.alertSpeedText.textContent = `SPEED LIMIT in ${speedNotice.distance}Mts`;
      } else {
        this.dom.alertSpeedChip.style.display = 'none';
      }
    }

    // 4c. Track Change / Switch Notice Alert
    if (this.dom.alertTrackChangeChip && this.dom.alertTrackChangeText) {
      const trackSwitch = this.engine.trackManager.getNextTrackSwitch(state.positionMeters, 650);
      if (trackSwitch) {
        this.dom.alertTrackChangeChip.style.display = 'flex';
        this.dom.alertTrackChangeText.textContent = `TRACK CHANGE in ${trackSwitch.distanceMeters}Mts`;
      } else {
        this.dom.alertTrackChangeChip.style.display = 'none';
      }
    }

    // 5. Bottom Timetable Target
    if (this.dom.hudTimetableTarget && missionConfig) {
      const targetTime = missionConfig.targetTime || '10:45 PM';
      const destName = missionConfig.stations?.[missionConfig.stations.length - 1]?.name || 'ARAKKONAM';
      this.dom.hudTimetableTarget.textContent = `REACH ${destName} BY ${targetTime}`;
    }

    // Dynamic Log Status
    if (this.dom.hudStatusLog) {
      if (state.emergencyBrake) {
        this.dom.hudStatusLog.textContent = '9:40 PM | EMERGENCY BRAKE APPLIED';
      } else if (state.doorsOpen) {
        this.dom.hudStatusLog.textContent = '9:40 PM | DOORS OPEN • PASSENGERS BOARDING';
      } else if (state.overspeedWarning) {
        this.dom.hudStatusLog.textContent = '9:40 PM | ⚠ OVERSPEED RESTRICTION EXCEEDED';
      } else if (!state.pantographUp) {
        this.dom.hudStatusLog.textContent = '9:40 PM | PANTOGRAPH LOWERED • NO 25kV OHE';
      } else {
        this.dom.hudStatusLog.textContent = this.lastLogMessage;
      }
    }

    // 6. Throttle & Console Controls
    if (this.dom.hudThrottleReadout) {
      this.dom.hudThrottleReadout.textContent = `THROTTLE ${state.throttlePercent}%`;
    }
    if (this.dom.hudThrottleSlider) {
      if (document.activeElement !== this.dom.hudThrottleSlider) {
        this.dom.hudThrottleSlider.value = state.throttlePercent;
      }
    }

    // Aux button LEDs & states
    if (this.dom.ledPantograph) {
      this.dom.ledPantograph.className = state.pantographUp ? 'aux-led on' : 'aux-led off';
    }
    if (this.dom.btnPantograph) {
      this.dom.btnPantograph.classList.toggle('active', state.pantographUp);
    }

    if (this.dom.ledPower) {
      this.dom.ledPower.className = state.enginePower ? 'aux-led on' : 'aux-led off';
    }
    if (this.dom.btnEnginePower) {
      this.dom.btnEnginePower.classList.toggle('active', state.enginePower);
    }

    if (this.dom.ledHeadlights) {
      this.dom.ledHeadlights.className = state.headlights ? 'aux-led on' : 'aux-led off';
    }
    if (this.dom.btnHeadlights) {
      this.dom.btnHeadlights.classList.toggle('active', state.headlights);
    }

    if (this.dom.ledDoors) {
      this.dom.ledDoors.className = state.doorsOpen ? 'aux-led on' : 'aux-led off';
    }
    if (this.dom.btnDoors) {
      this.dom.btnDoors.classList.toggle('active', state.doorsOpen);
    }

    // Reverser buttons
    if (this.dom.btnRevForward && this.dom.btnRevReverse) {
      this.dom.btnRevForward.classList.toggle('active', state.reverser === 'F');
      this.dom.btnRevReverse.classList.toggle('active', state.reverser === 'R');
    }

    // Camera Badge
    if (this.dom.hudCameraBadge) {
      this.dom.hudCameraBadge.textContent = this.engine.renderer.getCameraModeLabel();
    }
  }

  showNotification(message, type = 'info', duration = 3200) {
    let banner = document.getElementById('hudNotificationToast');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'hudNotificationToast';
      banner.className = 'hud-alert-banner';
      document.body.appendChild(banner);
    }

    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
    }

    banner.textContent = message;
    banner.className = `hud-alert-banner show ${type}`;

    this.notificationTimeout = setTimeout(() => {
      banner.classList.remove('show');
    }, duration);
  }
}
