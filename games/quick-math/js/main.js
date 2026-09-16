/**
 * Quick Math: Infinity Challenge - Application Bootstrap & UI Controller
 * Orchestrates screen transitions, 100-Level World Map navigation,
 * Serpentine progression rendering, keyboard bindings, modals, and economy HUD.
 */

(function() {
  'use strict';

  let game = null;
  let currentWorldId = 1;

  document.addEventListener('DOMContentLoaded', () => {
    initApp();
  });

  function initApp() {
    window.QuickMath.SaveManager.init();
    const settings = window.QuickMath.SaveManager.getSettings();
    window.QuickMath.SoundFX.init(settings);
    window.QuickMath.Effects.init('bgCanvas');
    window.QuickMath.Effects.setMotionEnabled(settings.motion);

    game = new window.QuickMath.GameManager();
    window.QuickMath.instance = game;

    currentWorldId = window.QuickMath.SaveManager.getData().highestWorld || 1;

    bindGameEvents();
    bindUIEvents();
    bindKeyboardControls();
    listenAchievements();

    updateSoundButtonUI();
    updateEconomyUI();
    showScreen('screenMenu');
  }

  /* -------------------------------------------------------------------------- */
  /* SCREEN ROUTING & MODAL CONTROLLERS                                        */
  /* -------------------------------------------------------------------------- */

  function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) target.classList.add('active');
  }

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
  }

  function updateEconomyUI() {
    const econ = window.QuickMath.SaveManager.getPlayerEconomy();
    const xpEl = document.getElementById('playerTotalXP');
    const creditsEl = document.getElementById('playerTotalCredits');
    if (xpEl) xpEl.textContent = econ.xp.toLocaleString();
    if (creditsEl) creditsEl.textContent = econ.credits.toLocaleString();
  }

  /* -------------------------------------------------------------------------- */
  /* GAME EVENT BINDINGS                                                        */
  /* -------------------------------------------------------------------------- */

  function bindGameEvents() {
    // 1. Question Loaded
    game.onQuestionLoaded = (data) => {
      const q = data.question;

      // Update HUD
      const countEl = document.getElementById('hudQuestionCount');
      if (countEl) {
        if (data.totalQuestions === Infinity) {
          countEl.textContent = `Q ${data.questionIndex}`;
        } else {
          countEl.textContent = `Q ${String(data.questionIndex).padStart(2, '0')} / ${String(data.totalQuestions).padStart(2, '0')}`;
        }
      }

      updateHUDMetrics(data.score, data.streak, data.combo, data.lives, data.mode);

      // Render Question Equation
      const equationEl = document.getElementById('questionText');
      if (equationEl) {
        equationEl.textContent = q.question;
      }

      const opBadge = document.getElementById('questionOpBadge');
      if (opBadge) {
        opBadge.textContent = q.operation.replace('_', ' ').toUpperCase();
      }

      const levelBadge = document.getElementById('questionLevelBadge');
      if (levelBadge) {
        if (data.mode === window.QuickMath.MODES.CLASSIC) {
          const spec = data.levelConfig?.specialBadge;
          levelBadge.textContent = spec ? spec : `LEVEL ${data.levelConfig?.id || 1}`;
        } else if (data.mode === window.QuickMath.MODES.DAILY) {
          levelBadge.textContent = 'DAILY CHALLENGE';
        } else if (data.mode === window.QuickMath.MODES.INFINITY) {
          levelBadge.textContent = 'INFINITY MODE';
        } else {
          levelBadge.textContent = data.mode.replace('_', ' ').toUpperCase();
        }
      }

      // Render 4 Answer Buttons
      const btnGrid = document.getElementById('answerButtonsGrid');
      if (btnGrid) {
        btnGrid.innerHTML = '';
        q.options.forEach((val, idx) => {
          const btn = document.createElement('button');
          btn.className = 'answer-btn';
          btn.setAttribute('data-index', idx);
          btn.setAttribute('aria-label', `Option ${idx + 1}: ${val}`);
          btn.innerHTML = `
            <span class="btn-hotkey">${idx + 1}</span>
            <span class="btn-value">${val}</span>
          `;
          btn.addEventListener('click', () => {
            game.submitAnswer(idx);
          });
          btnGrid.appendChild(btn);
        });
      }

      // Reset timer bar color
      const timerBar = document.getElementById('timerBar');
      if (timerBar) {
        timerBar.style.width = '100%';
        timerBar.className = 'timer-bar';
      }

      const feedbackEl = document.getElementById('questionFeedback');
      if (feedbackEl) {
        feedbackEl.textContent = '';
        feedbackEl.className = 'question-feedback-text';
      }
    };

    // 2. Timer Update
    game.onTimerUpdate = (remaining, total) => {
      const timerText = document.getElementById('hudTimeValue');
      if (timerText) {
        timerText.textContent = remaining.toFixed(1) + 's';
      }

      const timerBar = document.getElementById('timerBar');
      if (timerBar) {
        const pct = Math.max(0, Math.min(100, (remaining / total) * 100));
        timerBar.style.width = pct + '%';

        if (remaining <= 2.2) {
          timerBar.className = 'timer-bar urgent';
        } else if (remaining <= 4.0) {
          timerBar.className = 'timer-bar warning';
        } else {
          timerBar.className = 'timer-bar';
        }
      }
    };

    // 3. Question Resolved
    game.onQuestionResolved = (data) => {
      const buttons = document.querySelectorAll('.answer-btn');
      const feedbackEl = document.getElementById('questionFeedback');

      buttons.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === data.correctAnswerIndex) {
          btn.classList.add('correct');
        } else if (idx === data.selectedAnswerIndex && !data.isCorrect) {
          btn.classList.add('wrong');
        }
      });

      if (feedbackEl) {
        if (data.isCorrect) {
          const speedBonus = data.scoreDetails ? data.scoreDetails.speedBonus : 0;
          let bonusText = '';
          if (speedBonus === 100) bonusText = ' ⚡ LIGHTNING SPEED! +100';
          else if (speedBonus === 50) bonusText = ' ⚡ FAST! +50';

          feedbackEl.textContent = `+${data.scoreDetails ? data.scoreDetails.totalEarned : 100}${bonusText}`;
          feedbackEl.className = 'question-feedback-text correct';
        } else if (data.isTimeout) {
          feedbackEl.textContent = data.specialFailReason || 'TIME OUT!';
          feedbackEl.className = 'question-feedback-text wrong';
        } else {
          feedbackEl.textContent = data.specialFailReason || 'INCORRECT';
          feedbackEl.className = 'question-feedback-text wrong';
        }
      }

      updateHUDMetrics(data.score, data.streak, data.combo, data.lives, game.mode);
    };

    // 4. Round Complete
    game.onRoundComplete = (summary) => {
      setTimeout(() => {
        updateEconomyUI();
        if (summary.isLevel100Clear) {
          renderChampionshipScreen(summary);
        } else {
          renderResultScreen(summary);
        }
      }, 650);
    };
  }

  function updateHUDMetrics(score, streak, combo, lives, mode) {
    const scoreEl = document.getElementById('hudScoreValue');
    if (scoreEl) scoreEl.textContent = score.toLocaleString();

    const streakEl = document.getElementById('hudStreakValue');
    if (streakEl) {
      streakEl.textContent = streak > 0 ? `${streak}🔥` : '—';
    }

    const multEl = document.getElementById('hudMultiplierValue');
    if (multEl) {
      let multiplier = 1.0;
      if (streak >= 5) multiplier = 3.0;
      else if (streak === 4) multiplier = 2.0;
      else if (streak === 3) multiplier = 1.5;
      else if (streak === 2) multiplier = 1.2;
      multEl.textContent = `${multiplier.toFixed(1)}×`;
    }

    const livesBox = document.getElementById('hudLivesBox');
    const livesVal = document.getElementById('hudLivesValue');
    if (livesBox && livesVal) {
      if (mode === window.QuickMath.MODES.SURVIVAL) {
        livesBox.style.display = 'flex';
        livesVal.textContent = '❤️'.repeat(Math.max(0, lives));
      } else {
        livesBox.style.display = 'none';
      }
    }
  }

  /* -------------------------------------------------------------------------- */
  /* RESULT & CHAMPIONSHIP RENDERING                                            */
  /* -------------------------------------------------------------------------- */

  function renderResultScreen(res) {
    document.getElementById('resScore').textContent = res.score.toLocaleString();
    document.getElementById('resCorrect').textContent = res.correct;
    document.getElementById('resWrong').textContent = res.wrong;
    document.getElementById('resTimedOut').textContent = res.timedOut;
    document.getElementById('resAccuracy').textContent = `${res.accuracy}%`;
    document.getElementById('resBestStreak').textContent = res.bestStreak;
    document.getElementById('resAvgTime').textContent = `${res.avgTime}s`;

    // Stars display
    const starsContainer = document.getElementById('resStarsContainer');
    if (starsContainer) {
      if (res.mode === window.QuickMath.MODES.CLASSIC && !res.isFailed) {
        starsContainer.style.display = 'flex';
        let starsHtml = '';
        for (let i = 1; i <= 3; i++) {
          starsHtml += `<span class="res-star ${i <= res.stars ? 'earned' : ''}">★</span>`;
        }
        starsContainer.innerHTML = starsHtml;
      } else {
        starsContainer.style.display = 'none';
      }
    }

    // Perfect 100% accuracy banner
    const perfectBanner = document.getElementById('resPerfectBanner');
    if (perfectBanner) {
      if (res.isPerfect) {
        perfectBanner.classList.remove('hidden');
      } else {
        perfectBanner.classList.add('hidden');
      }
    }

    // Rewards display
    const xpEl = document.getElementById('resXP');
    const creditsEl = document.getElementById('resCredits');
    if (xpEl && creditsEl && res.rewards) {
      xpEl.textContent = res.rewards.xp.toLocaleString();
      creditsEl.textContent = res.rewards.credits.toLocaleString();
    }

    // Next Level Button
    const nextBtn = document.getElementById('btnResNextLevel');
    if (nextBtn) {
      if (res.mode === window.QuickMath.MODES.CLASSIC && res.level < 100 && res.stars >= 1) {
        nextBtn.style.display = 'inline-flex';
        nextBtn.textContent = `NEXT LEVEL ▶ (L${res.level + 1})`;
        nextBtn.onclick = () => {
          window.QuickMath.SoundFX.playClick();
          closeModal('modalResult');
          game.startSession(window.QuickMath.MODES.CLASSIC, res.level + 1);
        };
      } else {
        nextBtn.style.display = 'none';
      }
    }

    const titleEl = document.getElementById('resTitle');
    if (titleEl) {
      titleEl.textContent = res.isFailed ? 'ROUND FAILED' : 'ROUND COMPLETE';
      titleEl.className = res.isFailed ? 'modal-title failed' : 'modal-title victory';
    }

    openModal('modalResult');
  }

  function renderChampionshipScreen(res) {
    document.getElementById('champScore').textContent = res.score.toLocaleString();
    document.getElementById('champAccuracy').textContent = `${res.accuracy}%`;
    document.getElementById('champStreak').textContent = res.bestStreak;
    document.getElementById('champTime').textContent = `${res.avgTime}s`;

    const btnInfinity = document.getElementById('btnChampInfinity');
    if (btnInfinity) {
      btnInfinity.onclick = () => {
        window.QuickMath.SoundFX.playClick();
        closeModal('modalChampionship');
        showScreen('screenGame');
        game.startSession(window.QuickMath.MODES.INFINITY);
      };
    }

    const btnMenu = document.getElementById('btnChampMenu');
    if (btnMenu) {
      btnMenu.onclick = () => {
        window.QuickMath.SoundFX.playClick();
        closeModal('modalChampionship');
        renderWorldMap(10);
        showScreen('screenLevelSelect');
      };
    }

    openModal('modalChampionship');
  }

  /* -------------------------------------------------------------------------- */
  /* WORLD MAP & SERPENTINE LEVEL RENDERER                                      */
  /* -------------------------------------------------------------------------- */

  function renderWorldMap(worldId = currentWorldId) {
    currentWorldId = Math.max(1, Math.min(10, worldId));
    const wConfig = window.QuickMath.LevelsEngine.getWorldConfig(currentWorldId);
    const progress = window.QuickMath.SaveManager.getWorldProgress(currentWorldId);
    const isUnlocked = progress.isUnlocked;

    // 1. World Banner Info
    const badgeEl = document.getElementById('worldBadge');
    if (badgeEl) badgeEl.textContent = `WORLD ${currentWorldId} OF 10`;

    const titleEl = document.getElementById('worldTitle');
    if (titleEl) {
      titleEl.textContent = `${wConfig.icon} WORLD ${currentWorldId} — ${wConfig.name}`;
      titleEl.style.color = wConfig.themeColor;
    }

    const subEl = document.getElementById('worldSubtitle');
    if (subEl) subEl.textContent = wConfig.subtitle;

    const bannerBox = document.getElementById('worldBanner');
    if (bannerBox) {
      bannerBox.style.background = wConfig.bgGradient;
      bannerBox.style.borderColor = isUnlocked ? `${wConfig.themeColor}55` : 'rgba(255, 255, 255, 0.1)';
    }

    // 2. Progress Tracker
    const progLevelsEl = document.getElementById('worldProgressLevels');
    if (progLevelsEl) progLevelsEl.textContent = `Levels: ${progress.completedCount} / 10 Complete`;

    const progStarsEl = document.getElementById('worldProgressStars');
    if (progStarsEl) progStarsEl.textContent = `⭐ ${progress.totalStars} / 30 Stars`;

    const progBar = document.getElementById('worldProgressBar');
    if (progBar) {
      const pct = (progress.completedCount / 10) * 100;
      progBar.style.width = `${pct}%`;
      progBar.style.backgroundColor = wConfig.themeColor;
    }

    // Prev / Next button states
    const prevBtn = document.getElementById('btnWorldPrev');
    const nextBtn = document.getElementById('btnWorldNext');
    if (prevBtn) prevBtn.disabled = currentWorldId <= 1;
    if (nextBtn) nextBtn.disabled = currentWorldId >= 10;

    // 3. Quick Jump Tabs Bar
    renderWorldTabs();

    // 4. Serpentine Level Path Grid
    renderSerpentineLevels(currentWorldId, wConfig);
    updateEconomyUI();
  }

  function renderWorldTabs() {
    const tabsBar = document.getElementById('worldTabsBar');
    if (!tabsBar) return;
    tabsBar.innerHTML = '';

    for (let w = 1; w <= 10; w++) {
      const wProg = window.QuickMath.SaveManager.getWorldProgress(w);
      const isCurrent = w === currentWorldId;
      const tab = document.createElement('button');
      tab.className = `world-tab ${isCurrent ? 'active' : ''} ${wProg.isUnlocked ? 'unlocked' : 'locked'} ${wProg.completedCount === 10 ? 'mastered' : ''}`;
      
      let badgeHtml = `W${w}`;
      if (!wProg.isUnlocked) {
        badgeHtml = `🔒 W${w}`;
      } else if (wProg.completedCount === 10) {
        badgeHtml = `✓ W${w}`;
      }

      tab.innerHTML = `
        <span class="tab-badge">${badgeHtml}</span>
        <span class="tab-stars">★${wProg.totalStars}</span>
      `;

      tab.addEventListener('click', () => {
        window.QuickMath.SoundFX.playClick();
        if (wProg.isUnlocked) {
          renderWorldMap(w);
        } else {
          window.QuickMath.SoundFX.playWrong();
          alert(`World ${w} is locked! Complete Level ${(w - 1) * 10} to unlock this world.`);
        }
      });

      tabsBar.appendChild(tab);
    }
  }

  /**
   * Renders 10 levels in Serpentine winding layout:
   * Row 1 (Levels 1 to 5): Left -> Right
   * Row 2 (Levels 6 to 10): Right -> Left
   */
  function renderSerpentineLevels(worldId, wConfig) {
    const grid = document.getElementById('levelsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const levels = window.QuickMath.LevelsEngine.getWorldLevels(worldId);
    if (!levels || levels.length === 0) return;

    // Split into Row 1 (1..5) and Row 2 (6..10)
    const row1Levels = levels.slice(0, 5);
    const row2Levels = levels.slice(5, 10); // Displayed 10, 9, 8, 7, 6 for snake path

    // Row 1 Container (L1 -> L2 -> L3 -> L4 -> L5)
    const row1El = document.createElement('div');
    row1El.className = 'serpentine-row row-ltr';
    row1Levels.forEach((cfg, idx) => {
      row1El.appendChild(createLevelNode(cfg, wConfig));
      if (idx < 4) {
        const connector = document.createElement('div');
        connector.className = 'path-connector horizontal';
        row1El.appendChild(connector);
      }
    });

    // Vertical Turn Elbow (L5 down to L6)
    const turnRowEl = document.createElement('div');
    turnRowEl.className = 'serpentine-turn-row';
    const elbow = document.createElement('div');
    elbow.className = 'path-connector vertical-turn';
    turnRowEl.appendChild(elbow);

    // Row 2 Container (L10 <- L9 <- L8 <- L7 <- L6)
    const row2El = document.createElement('div');
    row2El.className = 'serpentine-row row-rtl';
    const reversedRow2 = [...row2Levels].reverse();
    reversedRow2.forEach((cfg, idx) => {
      row2El.appendChild(createLevelNode(cfg, wConfig));
      if (idx < 4) {
        const connector = document.createElement('div');
        connector.className = 'path-connector horizontal';
        row2El.appendChild(connector);
      }
    });

    grid.appendChild(row1El);
    grid.appendChild(turnRowEl);
    grid.appendChild(row2El);
  }

  function createLevelNode(cfg, wConfig) {
    const isUnlocked = window.QuickMath.SaveManager.isLevelUnlocked(cfg.id);
    const stars = window.QuickMath.SaveManager.getLevelStars(cfg.id);
    const highScore = window.QuickMath.SaveManager.getLevelHighScore(cfg.id);
    const bestTime = window.QuickMath.SaveManager.getLevelBestTime(cfg.id);
    const isCompleted = stars >= 1;

    const node = document.createElement('div');
    node.className = `level-node ${isUnlocked ? 'unlocked' : 'locked'} ${isCompleted ? 'completed' : ''} ${cfg.specialRule ? 'special-node' : ''}`;
    node.style.setProperty('--world-accent', wConfig.themeColor);

    let badgeHtml = '';
    if (cfg.specialBadge) {
      badgeHtml = `<span class="special-badge">${cfg.specialBadge}</span>`;
    }

    node.innerHTML = `
      <div class="node-header">
        <span class="node-num">${String(cfg.id).padStart(2, '0')}</span>
        ${badgeHtml}
        <span class="node-status">${isUnlocked ? (isCompleted ? '✓' : 'PLAY') : '🔒'}</span>
      </div>
      <div class="node-name">${cfg.name}</div>
      <div class="node-stars">
        <span class="star ${stars >= 1 ? 'earned' : ''}">★</span>
        <span class="star ${stars >= 2 ? 'earned' : ''}">★</span>
        <span class="star ${stars >= 3 ? 'earned' : ''}">★</span>
      </div>
      <div class="node-footer">
        ${highScore > 0 ? `<span class="node-score">${highScore} pts</span>` : `<span class="node-diff">Diff ${cfg.difficulty}/10</span>`}
        ${bestTime > 0 ? `<span class="node-time">⚡${bestTime}s</span>` : ''}
      </div>
    `;

    if (isUnlocked) {
      node.addEventListener('click', () => {
        window.QuickMath.SoundFX.playClick();
        showScreen('screenGame');
        game.startSession(window.QuickMath.MODES.CLASSIC, cfg.id);
      });
    } else {
      node.addEventListener('click', () => {
        window.QuickMath.SoundFX.playWrong();
        alert(`Level ${cfg.id} is locked! Complete Level ${cfg.id - 1} first.`);
      });
    }

    return node;
  }

  /* -------------------------------------------------------------------------- */
  /* UI BUTTON BINDINGS                                                         */
  /* -------------------------------------------------------------------------- */

  function bindUIEvents() {
    // Header Buttons
    document.getElementById('btnHeaderMute')?.addEventListener('click', () => {
      const s = window.QuickMath.SaveManager.getSettings();
      const nextSound = !s.sound;
      window.QuickMath.SaveManager.updateSettings({ sound: nextSound });
      window.QuickMath.SoundFX.setSoundEnabled(nextSound);
      updateSoundButtonUI();
    });

    document.getElementById('btnHeaderPause')?.addEventListener('click', () => {
      window.QuickMath.SoundFX.playClick();
      game.pause();
      openModal('modalPause');
    });

    // Main Menu Buttons
    document.getElementById('btnMenuStart')?.addEventListener('click', () => {
      window.QuickMath.SoundFX.playClick();
      renderWorldMap(window.QuickMath.SaveManager.getData().highestWorld || 1);
      showScreen('screenLevelSelect');
    });

    document.getElementById('btnMenuModes')?.addEventListener('click', () => {
      window.QuickMath.SoundFX.playClick();
      updateArcadeModesScreen();
      showScreen('screenModeSelect');
    });

    document.getElementById('btnMenuLeaderboard')?.addEventListener('click', () => {
      window.QuickMath.SoundFX.playClick();
      renderLeaderboard();
      openModal('modalLeaderboard');
    });

    document.getElementById('btnMenuAchievements')?.addEventListener('click', () => {
      window.QuickMath.SoundFX.playClick();
      renderAchievements();
      openModal('modalAchievements');
    });

    document.getElementById('btnMenuHowToPlay')?.addEventListener('click', () => {
      window.QuickMath.SoundFX.playClick();
      openModal('modalHowToPlay');
    });

    document.getElementById('btnMenuSettings')?.addEventListener('click', () => {
      window.QuickMath.SoundFX.playClick();
      populateSettingsModal();
      openModal('modalSettings');
    });

    // Back to Menu Buttons
    document.querySelectorAll('.btn-back-menu').forEach(b => {
      b.addEventListener('click', () => {
        window.QuickMath.SoundFX.playClick();
        closeAllModals();
        showScreen('screenMenu');
      });
    });

    // World Map Carousel Prev/Next Buttons
    document.getElementById('btnWorldPrev')?.addEventListener('click', () => {
      window.QuickMath.SoundFX.playClick();
      renderWorldMap(currentWorldId - 1);
    });

    document.getElementById('btnWorldNext')?.addEventListener('click', () => {
      window.QuickMath.SoundFX.playClick();
      renderWorldMap(currentWorldId + 1);
    });

    // Mode Selection Buttons
    document.getElementById('btnModeTimeAttack')?.addEventListener('click', () => {
      window.QuickMath.SoundFX.playClick();
      showScreen('screenGame');
      game.startSession(window.QuickMath.MODES.TIME_ATTACK);
    });

    document.getElementById('btnModeSurvival')?.addEventListener('click', () => {
      window.QuickMath.SoundFX.playClick();
      showScreen('screenGame');
      game.startSession(window.QuickMath.MODES.SURVIVAL);
    });

    document.getElementById('btnModeEndless')?.addEventListener('click', () => {
      window.QuickMath.SoundFX.playClick();
      showScreen('screenGame');
      game.startSession(window.QuickMath.MODES.ENDLESS);
    });

    document.getElementById('btnModeDaily')?.addEventListener('click', () => {
      window.QuickMath.SoundFX.playClick();
      showScreen('screenGame');
      game.startSession(window.QuickMath.MODES.DAILY);
    });

    document.getElementById('btnModeInfinity')?.addEventListener('click', () => {
      if (window.QuickMath.SaveManager.isInfinityModeUnlocked()) {
        window.QuickMath.SoundFX.playClick();
        showScreen('screenGame');
        game.startSession(window.QuickMath.MODES.INFINITY);
      } else {
        window.QuickMath.SoundFX.playWrong();
        alert('Infinity Mode is locked! Conquer Level 100 in the Campaign to unlock this mode.');
      }
    });

    // Modal Close Buttons
    document.querySelectorAll('.modal-close-btn').forEach(b => {
      b.addEventListener('click', () => {
        window.QuickMath.SoundFX.playClick();
        closeAllModals();
      });
    });

    // Pause Modal Buttons
    document.getElementById('btnPauseResume')?.addEventListener('click', () => {
      window.QuickMath.SoundFX.playClick();
      closeModal('modalPause');
      game.resume();
    });

    document.getElementById('btnPauseRestart')?.addEventListener('click', () => {
      window.QuickMath.SoundFX.playClick();
      closeModal('modalPause');
      game.restart();
    });

    document.getElementById('btnPauseMenu')?.addEventListener('click', () => {
      window.QuickMath.SoundFX.playClick();
      closeModal('modalPause');
      game.cleanupTimers();
      renderWorldMap(currentWorldId);
      showScreen('screenLevelSelect');
    });

    // Result Modal Buttons
    document.getElementById('btnResMenu')?.addEventListener('click', () => {
      window.QuickMath.SoundFX.playClick();
      closeModal('modalResult');
      renderWorldMap(currentWorldId);
      showScreen('screenLevelSelect');
    });

    document.getElementById('btnResPlayAgain')?.addEventListener('click', () => {
      window.QuickMath.SoundFX.playClick();
      closeModal('modalResult');
      game.restart();
    });

    // Settings Modal Save
    document.getElementById('btnSaveSettings')?.addEventListener('click', () => {
      window.QuickMath.SoundFX.playClick();
      const soundVal = document.getElementById('settingSound').checked;
      const musicVal = document.getElementById('settingMusic').checked;
      const motionVal = document.getElementById('settingMotion').checked;
      const nameVal = document.getElementById('settingPlayerName').value.trim() || 'Player';

      window.QuickMath.SaveManager.updateSettings({
        sound: soundVal,
        music: musicVal,
        motion: motionVal,
        playerName: nameVal
      });

      window.QuickMath.SoundFX.setSoundEnabled(soundVal);
      window.QuickMath.SoundFX.setMusicEnabled(musicVal);
      window.QuickMath.Effects.setMotionEnabled(motionVal);
      updateSoundButtonUI();
      closeModal('modalSettings');
    });

    // Reset Data Button
    document.getElementById('btnResetData')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all Quick Math statistics, stars, and campaign progress?')) {
        window.QuickMath.SaveManager.resetAllData();
        closeModal('modalSettings');
        currentWorldId = 1;
        updateEconomyUI();
        alert('All Quick Math progression reset successfully.');
      }
    });
  }

  function updateArcadeModesScreen() {
    const isInfinityUnlocked = window.QuickMath.SaveManager.isInfinityModeUnlocked();
    const card = document.getElementById('btnModeInfinity');
    const badge = document.getElementById('infinityModeBadge');
    const desc = document.getElementById('infinityModeDesc');

    if (card && badge && desc) {
      if (isInfinityUnlocked) {
        card.classList.remove('locked-mode');
        badge.textContent = 'UNLOCKED ♾️';
        badge.className = 'mode-badge emerald';
        desc.textContent = 'Procedurally escalating grandmaster challenge unlocked! Compete for the ultimate high score.';
      } else {
        card.classList.add('locked-mode');
        badge.textContent = '🔒 LOCKED';
        badge.className = 'mode-badge gold';
        desc.textContent = 'Procedurally escalating grandmaster gauntlet. Unlocks after completing Level 100.';
      }
    }
  }

  function updateSoundButtonUI() {
    const s = window.QuickMath.SaveManager.getSettings();
    const btn = document.getElementById('btnHeaderMute');
    if (btn) {
      btn.textContent = s.sound ? '🔊' : '🔇';
      btn.title = s.sound ? 'Mute Sound' : 'Unmute Sound';
    }
  }

  /* -------------------------------------------------------------------------- */
  /* LEADERBOARD & ACHIEVEMENTS RENDERER                                        */
  /* -------------------------------------------------------------------------- */

  function renderLeaderboard() {
    const tbody = document.getElementById('leaderboardTableBody');
    if (!tbody) return;
    const entries = window.QuickMath.SaveManager.getData().leaderboard;

    tbody.innerHTML = entries.map(item => `
      <tr>
        <td class="col-rank"><span class="rank-badge rank-${item.rank}">#${item.rank}</span></td>
        <td class="col-player">${item.player}</td>
        <td class="col-score">${item.score.toLocaleString()}</td>
        <td class="col-acc">${item.accuracy}%</td>
        <td class="col-mode">${item.mode}</td>
      </tr>
    `).join('');
  }

  function renderAchievements() {
    const list = document.getElementById('achievementsList');
    if (!list) return;
    const defs = window.QuickMath.SaveManager.getAchievementsDef();
    const unlocked = window.QuickMath.SaveManager.getUnlockedAchievements();

    list.innerHTML = defs.map(ach => {
      const isEarned = Boolean(unlocked[ach.id]);
      return `
        <div class="achievement-card ${isEarned ? 'earned' : 'locked'}">
          <div class="ach-icon">${ach.icon}</div>
          <div class="ach-info">
            <h4 class="ach-name">${ach.name}</h4>
            <p class="ach-desc">${ach.description}</p>
          </div>
          <span class="ach-status-badge">${isEarned ? 'UNLOCKED' : '🔒 LOCKED'}</span>
        </div>
      `;
    }).join('');
  }

  function populateSettingsModal() {
    const s = window.QuickMath.SaveManager.getSettings();
    const soundChk = document.getElementById('settingSound');
    const musicChk = document.getElementById('settingMusic');
    const motionChk = document.getElementById('settingMotion');
    const nameInput = document.getElementById('settingPlayerName');

    if (soundChk) soundChk.checked = s.sound;
    if (musicChk) musicChk.checked = s.music;
    if (motionChk) motionChk.checked = s.motion;
    if (nameInput) nameInput.value = s.playerName || 'Player';
  }

  /* -------------------------------------------------------------------------- */
  /* KEYBOARD SHORTCUT CONTROLS                                                 */
  /* -------------------------------------------------------------------------- */

  function bindKeyboardControls() {
    window.addEventListener('keydown', (e) => {
      // Hotkeys 1-4 for answer options
      if (['1', '2', '3', '4'].includes(e.key) && game.state === window.QuickMath.STATES.PLAYING) {
        const btnIndex = parseInt(e.key, 10) - 1;
        game.submitAnswer(btnIndex);
        return;
      }

      // Hotkey P: Pause
      if ((e.key === 'p' || e.key === 'P') && game.state === window.QuickMath.STATES.PLAYING) {
        game.pause();
        openModal('modalPause');
        return;
      }

      // Hotkey Escape: Resume if paused, or close modals
      if (e.key === 'Escape') {
        if (game.state === window.QuickMath.STATES.PAUSED) {
          closeModal('modalPause');
          game.resume();
        } else {
          closeAllModals();
        }
        return;
      }

      // Hotkey R: Restart
      if ((e.key === 'r' || e.key === 'R') && (game.state === window.QuickMath.STATES.PLAYING || game.state === window.QuickMath.STATES.PAUSED)) {
        closeAllModals();
        game.restart();
        return;
      }
    });
  }

  /* -------------------------------------------------------------------------- */
  /* ACHIEVEMENT UNLOCK NOTIFICATION LISTENER                                   */
  /* -------------------------------------------------------------------------- */

  function listenAchievements() {
    window.addEventListener('qm_achievement_unlocked', (e) => {
      const ach = e.detail;
      window.QuickMath.SoundFX?.playAchievement();
      
      const toast = document.createElement('div');
      toast.className = 'achievement-toast';
      toast.innerHTML = `
        <span class="toast-icon">${ach.icon}</span>
        <div class="toast-details">
          <span class="toast-title">ACHIEVEMENT UNLOCKED!</span>
          <span class="toast-name">${ach.name}</span>
        </div>
      `;

      document.body.appendChild(toast);
      setTimeout(() => toast.classList.add('visible'), 50);
      setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 400);
      }, 4000);
    });
  }

})();
