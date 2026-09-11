/**
 * Railway Commander - UI Manager
 * Handles HUD gauges, digital speedometer, throttle/brake LED indicators,
 * warning banners, mission briefing, countdowns, pause, game-over, and results modals.
 */

export class UIManager {
  constructor(gameEngine) {
    this.engine = gameEngine;
    this.dom = {};
    this.notificationTimeout = null;
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

    // HUD Elements
    this.dom.hudSpeedVal = document.getElementById('hudSpeedVal');
    this.dom.hudSpeedGaugeNeedle = document.getElementById('hudSpeedGaugeNeedle');
    this.dom.hudSpeedLimitVal = document.getElementById('hudSpeedLimitVal');
    this.dom.hudOverspeedBadge = document.getElementById('hudOverspeedBadge');

    this.dom.hudThrottleFill = document.getElementById('hudThrottleFill');
    this.dom.hudThrottleLevel = document.getElementById('hudThrottleLevel');
    this.dom.hudBrakeFill = document.getElementById('hudBrakeFill');
    this.dom.hudBrakeLevel = document.getElementById('hudBrakeLevel');
    this.dom.hudEBrakeBadge = document.getElementById('hudEBrakeBadge');

    this.dom.hudSignalIcon = document.getElementById('hudSignalIcon');
    this.dom.hudSignalDist = document.getElementById('hudSignalDist');
    this.dom.hudSignalName = document.getElementById('hudSignalName');

    this.dom.hudStationName = document.getElementById('hudStationName');
    this.dom.hudStationDist = document.getElementById('hudStationDist');
    this.dom.hudDistanceDriven = document.getElementById('hudDistanceDriven');

    this.dom.hudMissionName = document.getElementById('hudMissionName');
    this.dom.hudMissionObjective = document.getElementById('hudMissionObjective');
    this.dom.hudAlertBanner = document.getElementById('hudAlertBanner');
    this.dom.hudCameraBadge = document.getElementById('hudCameraBadge');
    this.dom.hudHeadlightsBadge = document.getElementById('hudHeadlightsBadge');

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
    document.getElementById('btnMenuPlay')?.addEventListener('click', () => {
      this.engine.soundManager.playClick();
      this.showMissionsScreen();
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
  }

  showPause() {
    this.showScreen('screenPause');
  }

  showMissionFailed(reason) {
    if (this.dom.failedReason) {
      this.dom.failedReason.textContent = reason || 'Mission rules violation.';
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

  updateHUD(state, nextSignal, nextStation, missionConfig) {
    if (!state) return;

    const speed = Math.round(state.speedKmh);
    if (this.dom.hudSpeedVal) {
      this.dom.hudSpeedVal.textContent = speed;
    }

    if (this.dom.hudSpeedGaugeNeedle) {
      const ratio = Math.min(1.0, speed / 140);
      const angle = -120 + (ratio * 240);
      this.dom.hudSpeedGaugeNeedle.style.transform = `rotate(${angle}deg)`;
    }

    if (this.dom.hudSpeedLimitVal) {
      this.dom.hudSpeedLimitVal.textContent = state.speedLimitKmh;
    }
    if (this.dom.hudOverspeedBadge) {
      if (state.overspeedWarning) {
        this.dom.hudOverspeedBadge.classList.remove('hidden');
        this.dom.hudOverspeedBadge.textContent = '⚠ OVERSPEEDING';
      } else {
        this.dom.hudOverspeedBadge.classList.add('hidden');
      }
    }

    if (this.dom.hudThrottleLevel) {
      this.dom.hudThrottleLevel.textContent = `T: ${state.throttleLevel}/5`;
    }
    if (this.dom.hudThrottleFill) {
      this.dom.hudThrottleFill.style.width = `${(state.throttleLevel / 5) * 100}%`;
    }

    if (this.dom.hudBrakeLevel) {
      this.dom.hudBrakeLevel.textContent = `B: ${state.brakeLevel}/5`;
    }
    if (this.dom.hudBrakeFill) {
      this.dom.hudBrakeFill.style.width = `${(state.brakeLevel / 5) * 100}%`;
    }

    if (this.dom.hudEBrakeBadge) {
      this.dom.hudEBrakeBadge.style.display = state.emergencyBrake ? 'inline-block' : 'none';
    }

    if (nextSignal) {
      const colors = { GREEN: '🟢', YELLOW: '🟡', RED: '🔴' };
      if (this.dom.hudSignalIcon) this.dom.hudSignalIcon.textContent = colors[nextSignal.aspect] || '🟢';
      if (this.dom.hudSignalDist) this.dom.hudSignalDist.textContent = `${nextSignal.distanceMeters}m`;
      if (this.dom.hudSignalName) this.dom.hudSignalName.textContent = nextSignal.name;
    } else {
      if (this.dom.hudSignalIcon) this.dom.hudSignalIcon.textContent = '🟢';
      if (this.dom.hudSignalDist) this.dom.hudSignalDist.textContent = '--';
      if (this.dom.hudSignalName) this.dom.hudSignalName.textContent = 'Track Clear';
    }

    if (nextStation) {
      if (this.dom.hudStationName) this.dom.hudStationName.textContent = nextStation.name;
      if (this.dom.hudStationDist) this.dom.hudStationDist.textContent = `${nextStation.distanceMeters}m`;
    } else {
      if (this.dom.hudStationName) this.dom.hudStationName.textContent = 'Terminus Reached';
      if (this.dom.hudStationDist) this.dom.hudStationDist.textContent = '0m';
    }

    if (this.dom.hudDistanceDriven) {
      this.dom.hudDistanceDriven.textContent = `${state.positionKm} km`;
    }

    if (missionConfig) {
      if (this.dom.hudMissionName) this.dom.hudMissionName.textContent = missionConfig.title;
      if (this.dom.hudMissionObjective) this.dom.hudMissionObjective.textContent = missionConfig.objective;
    }

    if (this.dom.hudHeadlightsBadge) {
      this.dom.hudHeadlightsBadge.textContent = state.headlights ? '💡 LIGHTS ON' : '💡 LIGHTS OFF';
      this.dom.hudHeadlightsBadge.classList.toggle('active', state.headlights);
    }
    if (this.dom.hudCameraBadge) {
      this.dom.hudCameraBadge.textContent = this.engine.renderer.cameraMode === 'cab' ? '🎥 CAB VIEW' : '🎥 CHASE VIEW';
    }
  }

  showNotification(message, type = 'info', duration = 3000) {
    const banner = this.dom.hudAlertBanner;
    if (!banner) return;

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
