// UIManager.js - Luxury Board Game Interface, HUD, Modals, and Confetti

export class UIManager {
  constructor({ gameEngine, soundManager, cameraManager, onStartGame, onRollDice }) {
    this.gameEngine = gameEngine;
    this.soundManager = soundManager;
    this.cameraManager = cameraManager;
    this.onStartGame = onStartGame;
    this.onRollDice = onRollDice;

    this.confettiCanvas = null;
    this.confettiParticles = [];
    this.confettiAnimId = null;

    this.initDOM();
    this.bindGameEvents();
  }

  initDOM() {
    const uiOverlay = document.getElementById('ui-overlay') || document.getElementById('app');
    uiOverlay.innerHTML = `
      <!-- Top Navigation Bar -->
      <header id="top-bar" class="hidden">
        <div class="top-left">
          <div class="game-logo-pill">
            <span class="logo-die">🎲</span>
            <span class="logo-text">SNAKES & LADDERS</span>
          </div>
          <div id="turn-banner" class="turn-badge">
            <span class="turn-dot"></span>
            <span id="turn-text">Player 1's Turn</span>
          </div>
        </div>

        <div class="top-center">
          <div class="cam-presets">
            <button id="cam-tabletop" class="cam-btn active" title="Tabletop View">Tabletop</button>
            <button id="cam-topdown" class="cam-btn" title="Top-Down View">Top-Down</button>
            <button id="cam-cinematic" class="cam-btn" title="Cinematic View">Cinematic</button>
          </div>
        </div>

        <div class="top-right">
          <button id="btn-sound" class="icon-btn" title="Toggle Sound SFX">🔊</button>
          <button id="btn-music" class="icon-btn" title="Toggle Music">🎵</button>
          <button id="btn-help" class="icon-btn" title="How to Play">❓</button>
          <button id="btn-pause" class="icon-btn" title="Pause Game">⏸️</button>
          <button id="btn-menu" class="icon-btn" title="Main Menu">🏠</button>
          <a href="../../index.html" id="btn-exit" class="icon-btn" title="Exit to InfinityPlay Portal">✕</a>
        </div>
      </header>

      <!-- Player HUD Cards (Bottom Left & Right) -->
      <div id="players-hud" class="hidden">
        <div id="player-cards-container"></div>
      </div>

      <!-- Center Action Area (Big 3D Roll Button, Dice Pop Result & Event Message) -->
      <div id="action-hud" class="hidden">
        <div id="dice-pop-result" class="dice-pop-result hidden">
          <div class="dice-pop-box">
            <span class="dice-pop-icon">🎲</span>
            <span id="dice-pop-count" class="dice-pop-count">1</span>
          </div>
          <span id="dice-pop-label" class="dice-pop-label">ROLLED 1</span>
        </div>
        <div id="event-toast" class="event-toast">Roll the dice to begin!</div>
        <button id="btn-roll-dice" class="roll-dice-btn">
          <div class="dice-btn-inner">
            <span class="dice-icon">🎲</span>
            <span class="dice-btn-label">ROLL DICE</span>
          </div>
          <div class="dice-glow"></div>
        </button>
      </div>

      <!-- Cinematic Start Screen Menu -->
      <div id="start-screen" class="screen-overlay">
        <div class="start-card glass-panel">
          <div class="ornament-top">✦ ✦ ✦</div>
          <h1 class="main-title">SNAKES & LADDERS</h1>
          <h2 class="sub-title">THE CLASSIC GAME OF LUCK</h2>
          <div class="divider-line"></div>

          <div class="menu-buttons">
            <button id="menu-play-local" class="btn-primary">
              <span class="btn-icon">👥</span>
              <span class="btn-text">PLAY LOCAL</span>
              <span class="btn-sub">Pass & Play with Friends</span>
            </button>
            <button id="menu-play-ai" class="btn-primary">
              <span class="btn-icon">🤖</span>
              <span class="btn-text">PLAY VS AI</span>
              <span class="btn-sub">Challenge Intelligent Opponents</span>
            </button>
            <button id="menu-rules" class="btn-secondary">
              <span class="btn-icon">📜</span>
              <span class="btn-text">HOW TO PLAY</span>
            </button>
            <button id="menu-settings" class="btn-secondary">
              <span class="btn-icon">⚙️</span>
              <span class="btn-text">SETTINGS</span>
            </button>
          </div>

          <div class="badge-heritage">DELUXE 3D TABLETOP EDITION</div>
        </div>
      </div>

      <!-- Game Setup Modal -->
      <div id="setup-modal" class="modal-overlay hidden">
        <div class="modal-card glass-panel">
          <div class="modal-header">
            <h3 id="setup-title">Game Setup</h3>
            <button id="btn-close-setup" class="close-btn">&times;</button>
          </div>
          <div class="modal-body">
            <div class="setup-group">
              <label>Number of Players:</label>
              <div class="pill-selector" id="player-count-pills">
                <button class="pill-opt" data-count="2">2 Players</button>
                <button class="pill-opt active" data-count="3">3 Players</button>
                <button class="pill-opt" data-count="4">4 Players</button>
              </div>
            </div>

            <div id="ai-difficulty-group" class="setup-group hidden">
              <label>AI Difficulty:</label>
              <div class="pill-selector" id="ai-diff-pills">
                <button class="pill-opt" data-diff="easy">Easy</button>
                <button class="pill-opt active" data-diff="medium">Medium</button>
                <button class="pill-opt" data-diff="hard">Hard</button>
              </div>
            </div>

            <div class="setup-group">
              <label>Players:</label>
              <div id="player-inputs-list" class="player-inputs-list"></div>
            </div>

            <button id="btn-start-match" class="btn-primary btn-start-match">START GAME</button>
          </div>
        </div>
      </div>

      <!-- How to Play Modal -->
      <div id="rules-modal" class="modal-overlay hidden">
        <div class="modal-card glass-panel">
          <div class="modal-header">
            <h3>How to Play</h3>
            <button id="btn-close-rules" class="close-btn">&times;</button>
          </div>
          <div class="modal-body rules-content">
            <div class="rule-item">
              <span class="rule-icon">🎯</span>
              <div>
                <strong>The Objective:</strong>
                <p>Be the first player to navigate the 100 squares of the board and reach square 100 exactly!</p>
              </div>
            </div>
            <div class="rule-item">
              <span class="rule-icon">🎲</span>
              <div>
                <strong>Movement & Turns:</strong>
                <p>Roll the 3D die on your turn. Move forward the exact number of squares rolled.</p>
              </div>
            </div>
            <div class="rule-item">
              <span class="rule-icon">🪜</span>
              <div>
                <strong>Ladders:</strong>
                <p>Landing at the base of a ladder lets you climb straight to the higher square connected at its top!</p>
              </div>
            </div>
            <div class="rule-item">
              <span class="rule-icon">🐍</span>
              <div>
                <strong>Snakes:</strong>
                <p>Beware of snake heads! Landing on a square with a snake head forces you to slide all the way down to its tail.</p>
              </div>
            </div>
            <div class="rule-item">
              <span class="rule-icon">⭐</span>
              <div>
                <strong>Exact Roll to Finish:</strong>
                <p>To win, you must land on square 100 with an exact roll. If your roll exceeds 100, your token stays in place for that turn.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Settings Modal -->
      <div id="settings-modal" class="modal-overlay hidden">
        <div class="modal-card glass-panel">
          <div class="modal-header">
            <h3>Settings</h3>
            <button id="btn-close-settings" class="close-btn">&times;</button>
          </div>
          <div class="modal-body settings-content">
            <div class="setting-row">
              <span>Sound Effects (SFX)</span>
              <input type="checkbox" id="toggle-sfx" checked>
            </div>
            <div class="setting-row">
              <span>Acoustic Tabletop Music</span>
              <input type="checkbox" id="toggle-music" checked>
            </div>
            <div class="setting-row">
              <span>Camera Tracking</span>
              <input type="checkbox" id="toggle-cam-follow" checked>
            </div>
          </div>
        </div>
      </div>

      <!-- Victory Celebration Modal -->
      <div id="victory-modal" class="modal-overlay hidden">
        <canvas id="confetti-canvas"></canvas>
        <div class="modal-card glass-panel victory-card">
          <div class="victory-crown">👑</div>
          <h2 id="victory-winner-title">PLAYER 1 WINS!</h2>
          <p class="victory-subtitle">Congratulations on mastering the board!</p>

          <div class="stats-grid">
            <div class="stat-box">
              <span class="stat-num" id="stat-turns">0</span>
              <span class="stat-label">Total Turns</span>
            </div>
            <div class="stat-box">
              <span class="stat-num" id="stat-ladders">0</span>
              <span class="stat-label">Ladders Climbed</span>
            </div>
            <div class="stat-box">
              <span class="stat-num" id="stat-snakes">0</span>
              <span class="stat-label">Snakes Bitten</span>
            </div>
          </div>

          <div class="victory-buttons">
            <button id="btn-play-again" class="btn-primary">PLAY AGAIN</button>
            <button id="btn-victory-menu" class="btn-secondary">MAIN MENU</button>
          </div>
        </div>
      </div>
    `;

    this.setupListeners();
  }

  setupListeners() {
    const getEl = id => document.getElementById(id);

    // Menu Buttons
    getEl('menu-play-local').addEventListener('click', () => {
      this.soundManager.playButtonClick();
      this.openSetupModal(false);
    });

    getEl('menu-play-ai').addEventListener('click', () => {
      this.soundManager.playButtonClick();
      this.openSetupModal(true);
    });

    getEl('menu-rules').addEventListener('click', () => {
      this.soundManager.playButtonClick();
      getEl('rules-modal').classList.remove('hidden');
    });

    getEl('menu-settings').addEventListener('click', () => {
      this.soundManager.playButtonClick();
      getEl('settings-modal').classList.remove('hidden');
    });

    getEl('btn-close-setup').addEventListener('click', () => {
      this.soundManager.playButtonClick();
      getEl('setup-modal').classList.add('hidden');
    });

    getEl('btn-close-rules').addEventListener('click', () => {
      this.soundManager.playButtonClick();
      getEl('rules-modal').classList.add('hidden');
    });

    getEl('btn-close-settings').addEventListener('click', () => {
      this.soundManager.playButtonClick();
      getEl('settings-modal').classList.add('hidden');
    });

    // Top Bar Actions
    getEl('btn-sound').addEventListener('click', () => {
      const next = !this.soundManager.soundEnabled;
      this.soundManager.setSoundEnabled(next);
      getEl('btn-sound').textContent = next ? '🔊' : '🔇';
      getEl('toggle-sfx').checked = next;
    });

    getEl('btn-music').addEventListener('click', () => {
      const next = !this.soundManager.musicEnabled;
      this.soundManager.setMusicEnabled(next);
      getEl('btn-music').textContent = next ? '🎵' : '🔇';
      getEl('toggle-music').checked = next;
    });

    getEl('btn-help').addEventListener('click', () => {
      this.soundManager.playButtonClick();
      getEl('rules-modal').classList.remove('hidden');
    });

    getEl('btn-pause').addEventListener('click', () => {
      this.soundManager.playButtonClick();
      if (this.gameEngine.state === 'PAUSED') {
        this.gameEngine.resume();
        getEl('btn-pause').textContent = '⏸️';
      } else {
        this.gameEngine.pause();
        getEl('btn-pause').textContent = '▶️';
      }
    });

    getEl('btn-menu').addEventListener('click', () => {
      this.soundManager.playButtonClick();
      this.showStartScreen();
    });

    // Camera Presets
    const camBtns = ['cam-tabletop', 'cam-topdown', 'cam-cinematic'];
    camBtns.forEach(btnId => {
      getEl(btnId).addEventListener('click', () => {
        this.soundManager.playButtonClick();
        camBtns.forEach(b => getEl(b).classList.remove('active'));
        getEl(btnId).classList.add('active');

        const preset = btnId.replace('cam-', '');
        this.cameraManager.setPreset(preset);
      });
    });

    // Roll Dice Button
    getEl('btn-roll-dice').addEventListener('click', () => {
      if (this.gameEngine.canRoll()) {
        const curPlayer = this.gameEngine.getCurrentPlayer();
        if (curPlayer && !curPlayer.isAI) {
          this.soundManager.playButtonClick();
          this.onRollDice();
        }
      }
    });

    // Setup Modal Player Count Pills
    document.querySelectorAll('#player-count-pills .pill-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        this.soundManager.playButtonClick();
        document.querySelectorAll('#player-count-pills .pill-opt').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.updatePlayerInputsList(parseInt(btn.dataset.count, 10), this.isVsAISetup);
      });
    });

    // Setup Modal AI Difficulty Pills
    document.querySelectorAll('#ai-diff-pills .pill-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        this.soundManager.playButtonClick();
        document.querySelectorAll('#ai-diff-pills .pill-opt').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Start Game from setup modal
    getEl('btn-start-match').addEventListener('click', () => {
      this.soundManager.playButtonClick();
      const activeCountBtn = document.querySelector('#player-count-pills .pill-opt.active');
      const count = parseInt(activeCountBtn.dataset.count, 10);

      const activeDiffBtn = document.querySelector('#ai-diff-pills .pill-opt.active');
      const aiDiff = activeDiffBtn ? activeDiffBtn.dataset.diff : 'medium';

      const inputs = document.querySelectorAll('.player-input-name');
      const customNames = Array.from(inputs).map(inp => inp.value.trim());

      getEl('setup-modal').classList.add('hidden');
      getEl('start-screen').classList.add('hidden');
      getEl('top-bar').classList.remove('hidden');
      getEl('players-hud').classList.remove('hidden');
      getEl('action-hud').classList.remove('hidden');

      this.onStartGame({
        numPlayers: count,
        isVsAI: this.isVsAISetup,
        aiDifficulty: aiDiff,
        customNames
      });
    });

    // Victory Buttons
    getEl('btn-play-again').addEventListener('click', () => {
      this.soundManager.playButtonClick();
      this.stopConfetti();
      getEl('victory-modal').classList.add('hidden');
      this.onStartGame({
        numPlayers: this.gameEngine.players.length,
        isVsAI: this.gameEngine.isVsAI,
        aiDifficulty: this.gameEngine.aiDifficulty
      });
    });

    getEl('btn-victory-menu').addEventListener('click', () => {
      this.soundManager.playButtonClick();
      this.stopConfetti();
      getEl('victory-modal').classList.add('hidden');
      this.showStartScreen();
    });

    // Settings checkboxes
    getEl('toggle-sfx').addEventListener('change', (e) => {
      this.soundManager.setSoundEnabled(e.target.checked);
      getEl('btn-sound').textContent = e.target.checked ? '🔊' : '🔇';
    });
    getEl('toggle-music').addEventListener('change', (e) => {
      this.soundManager.setMusicEnabled(e.target.checked);
      getEl('btn-music').textContent = e.target.checked ? '🎵' : '🔇';
    });
  }

  openSetupModal(isVsAI) {
    this.isVsAISetup = isVsAI;
    const getEl = id => document.getElementById(id);

    getEl('setup-title').textContent = isVsAI ? 'Play vs AI Setup' : 'Local Multiplayer Setup';
    if (isVsAI) {
      getEl('ai-difficulty-group').classList.remove('hidden');
    } else {
      getEl('ai-difficulty-group').classList.add('hidden');
    }

    const activeCountBtn = document.querySelector('#player-count-pills .pill-opt.active');
    const count = parseInt(activeCountBtn.dataset.count, 10);
    this.updatePlayerInputsList(count, isVsAI);

    getEl('setup-modal').classList.remove('hidden');
  }

  updatePlayerInputsList(count, isVsAI) {
    const container = document.getElementById('player-inputs-list');
    container.innerHTML = '';

    const colors = ['#d32f2f', '#1976d2', '#2e7d32', '#f57f17'];
    const colorNames = ['Ruby Red', 'Sapphire Blue', 'Emerald Green', 'Amber Gold'];

    for (let i = 0; i < count; i++) {
      const isAI = isVsAI && i > 0;
      const defaultName = isAI ? `AI Player ${i + 1}` : `Player ${i + 1}`;

      const row = document.createElement('div');
      row.className = 'player-input-row';
      row.innerHTML = `
        <span class="player-color-dot" style="background: ${colors[i]};" title="${colorNames[i]}"></span>
        <input type="text" class="player-input-name" value="${defaultName}" placeholder="Enter name">
        ${isAI ? '<span class="ai-tag">AI 🤖</span>' : '<span class="human-tag">YOU 👤</span>'}
      `;
      container.appendChild(row);
    }
  }

  bindGameEvents() {
    this.gameEngine.on('turnChange', ({ player }) => {
      this.updateTurnDisplay(player);
      this.updatePlayerCards();
      this.updateRollButtonState();
    });

    this.gameEngine.on('stateChange', () => {
      this.updateRollButtonState();
    });

    this.gameEngine.on('message', ({ text, type }) => {
      this.showEventToast(text, type);
    });

    this.gameEngine.on('gameOver', ({ winner, totalTurns, players }) => {
      this.showVictory(winner, totalTurns, players);
    });
  }

  showStartScreen() {
    const getEl = id => document.getElementById(id);
    getEl('start-screen').classList.remove('hidden');
    getEl('top-bar').classList.add('hidden');
    getEl('players-hud').classList.add('hidden');
    getEl('action-hud').classList.add('hidden');
    this.cameraManager.setPreset('tabletop');
  }

  updateTurnDisplay(player) {
    if (!player) return;
    const turnText = document.getElementById('turn-text');
    const turnDot = document.querySelector('.turn-dot');

    if (turnText && turnDot) {
      turnText.textContent = `${player.name}'s Turn`;
      turnDot.style.background = player.colorHex;
    }
  }

  updatePlayerCards() {
    const container = document.getElementById('player-cards-container');
    if (!container) return;

    container.innerHTML = '';
    const currentIdx = this.gameEngine.currentPlayerIndex;

    // Find highest position leader
    let maxPos = 0;
    this.gameEngine.players.forEach(p => {
      if (p.position > maxPos) maxPos = p.position;
    });

    this.gameEngine.players.forEach((player, idx) => {
      const isCurrent = idx === currentIdx;
      const isLeader = player.position === maxPos && player.position > 1;

      const card = document.createElement('div');
      card.className = `player-card glass-panel ${isCurrent ? 'active-turn' : ''}`;
      card.innerHTML = `
        <div class="player-card-left">
          <div class="player-avatar" style="background: ${player.colorHex}; box-shadow: 0 0 12px ${player.colorHex}66;">
            ${player.isAI ? '🤖' : '👤'}
          </div>
          <div class="player-details">
            <div class="player-card-name">
              ${player.name}
              ${isLeader ? '<span class="crown-badge" title="Current Leader">👑</span>' : ''}
            </div>
            <div class="player-status-tag">
              ${isCurrent ? (player.isAI ? 'Thinking...' : 'Your Turn') : 'Waiting'}
            </div>
          </div>
        </div>
        <div class="player-card-right">
          <div class="pos-num">${player.position}</div>
          <div class="pos-label">SQ</div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  updateRollButtonState() {
    const btn = document.getElementById('btn-roll-dice');
    if (!btn) return;

    const label = btn.querySelector('.dice-btn-label');
    const curPlayer = this.gameEngine.getCurrentPlayer();
    const isRolling = this.gameEngine.state === 'ROLLING';
    const canRoll = this.gameEngine.canRoll() && curPlayer && !curPlayer.isAI;

    if (label) {
      label.textContent = isRolling ? 'ROLLING...' : 'ROLL DICE';
    }

    if (canRoll) {
      btn.classList.remove('disabled');
      btn.classList.add('pulse');
    } else {
      btn.classList.add('disabled');
      btn.classList.remove('pulse');
    }
  }

  showDiceResult(player, rolledValue) {
    const pop = document.getElementById('dice-pop-result');
    const countEl = document.getElementById('dice-pop-count');
    const labelEl = document.getElementById('dice-pop-label');
    if (!pop || !countEl || !labelEl) return;

    countEl.textContent = rolledValue;
    labelEl.textContent = `${player ? player.name.toUpperCase() : 'PLAYER'} ROLLED ${rolledValue}`;
    if (player && player.colorHex) {
      pop.style.borderColor = player.colorHex;
      pop.style.boxShadow = `0 10px 30px rgba(0, 0, 0, 0.6), 0 0 25px ${player.colorHex}88`;
    }

    pop.classList.remove('hidden');

    // Trigger reflow to cleanly restart the bounce pop animation
    pop.style.animation = 'none';
    pop.offsetHeight;
    pop.style.animation = '';

    clearTimeout(this.dicePopTimer);
    this.dicePopTimer = setTimeout(() => {
      pop.classList.add('hidden');
    }, 2800);
  }

  hideDiceResult() {
    const pop = document.getElementById('dice-pop-result');
    if (pop) {
      pop.classList.add('hidden');
    }
    clearTimeout(this.dicePopTimer);
  }

  showEventToast(text, type = 'info') {
    const toast = document.getElementById('event-toast');
    if (!toast) return;

    toast.textContent = text;
    toast.className = `event-toast visible type-${type}`;

    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.remove('visible');
    }, 2800);
  }

  showVictory(winner, totalTurns, players) {
    const getEl = id => document.getElementById(id);
    getEl('victory-winner-title').textContent = `${winner.name.toUpperCase()} WINS!`;
    getEl('stat-turns').textContent = winner.turns;
    getEl('stat-ladders').textContent = winner.laddersClimbed;
    getEl('stat-snakes').textContent = winner.snakesBitten;

    getEl('victory-modal').classList.remove('hidden');
    this.startConfetti();
  }

  startConfetti() {
    this.confettiCanvas = document.getElementById('confetti-canvas');
    if (!this.confettiCanvas) return;

    const ctx = this.confettiCanvas.getContext('2d');
    const width = (this.confettiCanvas.width = window.innerWidth);
    const height = (this.confettiCanvas.height = window.innerHeight);

    this.confettiParticles = [];
    const colors = ['#d4af37', '#e63946', '#457b9d', '#2a9d8f', '#f4a261'];

    for (let i = 0; i < 140; i++) {
      this.confettiParticles.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        w: Math.random() * 10 + 6,
        h: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vy: Math.random() * 3 + 2.5,
        vx: Math.random() * 2 - 1,
        angle: Math.random() * 360,
        spin: Math.random() * 6 - 3
      });
    }

    const renderConfetti = () => {
      ctx.clearRect(0, 0, width, height);
      this.confettiParticles.forEach(p => {
        p.y += p.vy;
        p.x += p.vx;
        p.angle += p.spin;

        if (p.y > height) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.angle * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      this.confettiAnimId = requestAnimationFrame(renderConfetti);
    };

    renderConfetti();
  }

  stopConfetti() {
    if (this.confettiAnimId) {
      cancelAnimationFrame(this.confettiAnimId);
      this.confettiAnimId = null;
    }
  }
}
