/**
 * Zombie Survival - Main Game Engine
 * Coordinates single requestAnimationFrame loop, physics, combat, modes, and pickups.
 */

class GameEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.camera = null;
    this.effects = null;
    this.particles = null;
    this.waveManager = null;
    this.ui = null;

    // Entities
    this.player = null;
    this.zombies = [];
    this.projectiles = [];
    this.enemyProjectiles = [];
    this.pickups = [];
    this.map = null;
    this.objectiveBeacons = [];

    // State
    this.state = 'MENU'; // MENU, PLAYING, PAUSED, RESULTS, GAME_OVER
    this.mode = 'STORY'; // STORY, WAVE_SURVIVAL, TIME_ATTACK, ENDLESS, BOSS_CHALLENGE
    this.currentLevelConfig = null;
    this.sessionTimer = 0;
    this.levelTimeRemaining = 0;
    this.objectiveCounter = 0;
    this.damageTakenThisSession = 0;

    // Kill combo
    this.comboCount = 0;
    this.comboMultiplier = 1;
    this.comboTimer = 0;
    this.maxComboThisSession = 1;

    // Time loop
    this.lastTime = 0;
    this.animationFrameId = null;

    // Input state
    this.input = {
      up: false,
      down: false,
      left: false,
      right: false,
      firing: false,
      targetScreenX: 0,
      targetScreenY: 0,
      targetWorldX: 0,
      targetWorldY: 0,
      joystickActive: false,
      joystickX: 0,
      joystickY: 0,
      aimActive: false,
      aimAngle: 0
    };
  }

  init(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.camera = new Camera(canvas.width, canvas.height);
    this.effects = new EnvironmentEffects();
    this.particles = new ParticleSystem();
    this.waveManager = new WaveManager();
    this.ui = new UIManager();

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.ui.init();
    this.bindInputs();

    // Start single continuous game loop
    this.lastTime = performance.now();
    this.loop = this.loop.bind(this);
    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  resizeCanvas() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    if (this.camera) {
      this.camera.resize(this.canvas.width, this.canvas.height);
    }
  }

  bindInputs() {
    // Keyboard
    window.addEventListener('keydown', (e) => {
      if (this.state === 'PLAYING') {
        if (e.code === 'KeyW' || e.code === 'ArrowUp') this.input.up = true;
        if (e.code === 'KeyS' || e.code === 'ArrowDown') this.input.down = true;
        if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.input.left = true;
        if (e.code === 'KeyD' || e.code === 'ArrowRight') this.input.right = true;
        if (e.code === 'KeyR') {
          if (this.player) this.player.reload();
        }
        if (e.code === 'Space') {
          e.preventDefault();
          if (this.player) this.player.triggerAbility();
        }
      }

      // Pause toggle
      if (e.code === 'KeyP' || e.code === 'Escape') {
        if (this.state === 'PLAYING') {
          this.togglePause(true);
        } else if (this.state === 'PAUSED') {
          this.togglePause(false);
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') this.input.up = false;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') this.input.down = false;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.input.left = false;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') this.input.right = false;
    });

    // Mouse aim & fire
    this.canvas.addEventListener('mousemove', (e) => {
      this.input.targetScreenX = e.clientX;
      this.input.targetScreenY = e.clientY;
      if (this.camera) {
        const world = this.camera.screenToWorld(e.clientX, e.clientY);
        this.input.targetWorldX = world.x;
        this.input.targetWorldY = world.y;
      }
    });

    this.canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0 && this.state === 'PLAYING') {
        this.input.firing = true;
        window.Sound.resume();
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) {
        this.input.firing = false;
      }
    });

    // Mobile Virtual Touch Controls
    this.bindMobileTouch();
  }

  bindMobileTouch() {
    const joyZone = document.getElementById('touchJoystick');
    const joyStick = document.getElementById('touchKnob');
    const fireBtn = document.getElementById('btnTouchFire');
    const dashBtn = document.getElementById('btnTouchDash');
    const reloadBtn = document.getElementById('btnTouchReload');

    if (!joyZone || !joyStick) return;

    let joyTouchId = null;
    let joyStartX = 0;
    let joyStartY = 0;
    const maxDist = 45;

    joyZone.addEventListener('touchstart', (e) => {
      e.preventDefault();
      window.Sound.resume();
      const touch = e.changedTouches[0];
      joyTouchId = touch.identifier;
      const rect = joyZone.getBoundingClientRect();
      joyStartX = rect.left + rect.width / 2;
      joyStartY = rect.top + rect.height / 2;
      this.input.joystickActive = true;
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
      if (joyTouchId === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === joyTouchId) {
          const dx = touch.clientX - joyStartX;
          const dy = touch.clientY - joyStartY;
          const dist = Math.hypot(dx, dy);
          const clampedDist = Math.min(dist, maxDist);
          const angle = Math.atan2(dy, dx);

          const knobX = Math.cos(angle) * clampedDist;
          const knobY = Math.sin(angle) * clampedDist;
          joyStick.style.transform = `translate(${knobX}px, ${knobY}px)`;

          this.input.joystickX = knobX / maxDist;
          this.input.joystickY = knobY / maxDist;
          break;
        }
      }
    }, { passive: false });

    const endJoy = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === joyTouchId) {
          joyTouchId = null;
          this.input.joystickActive = false;
          this.input.joystickX = 0;
          this.input.joystickY = 0;
          joyStick.style.transform = 'translate(0px, 0px)';
          break;
        }
      }
    };
    window.addEventListener('touchend', endJoy);
    window.addEventListener('touchcancel', endJoy);

    // Touch Buttons
    if (fireBtn) {
      fireBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        window.Sound.resume();
        this.input.firing = true;
      }, { passive: false });
      fireBtn.addEventListener('touchend', () => { this.input.firing = false; });
    }

    if (dashBtn) {
      dashBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (this.player) this.player.triggerAbility();
      }, { passive: false });
    }

    if (reloadBtn) {
      reloadBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (this.player) this.player.reload();
      }, { passive: false });
    }
  }

  // --- GAME MODE STARTERS ---

  startStoryLevel(levelId) {
    const lvl = window.LEVELS[levelId - 1];
    if (!lvl) return;
    this.mode = 'STORY';
    this.currentLevelConfig = lvl;
    this.setupMatch(lvl, false);
  }

  startEndlessMode() {
    this.mode = 'ENDLESS';
    const fakeLvl = {
      id: 999,
      name: 'Infinity Survival',
      mapId: 'map2',
      objective: 'SURVIVE',
      objectiveTarget: Infinity,
      objectiveDesc: 'Survive infinite relentless waves.',
      difficulty: 'Continuous Escalation',
      levelScaling: 1.0,
      enemyTypes: ['normal', 'runner', 'swarmer', 'tank', 'shielded', 'hunter', 'elite']
    };
    this.currentLevelConfig = fakeLvl;
    this.setupMatch(fakeLvl, true);
  }

  startWaveSurvivalMode() {
    this.mode = 'WAVE_SURVIVAL';
    const fakeLvl = {
      id: 101,
      name: 'Wave Survival Arena',
      mapId: 'map3',
      objective: 'SURVIVE',
      objectiveTarget: 10,
      waveCount: 10,
      enemyCount: 140,
      objectiveDesc: 'Survive all 10 heavy zombie waves.',
      difficulty: 'Hard',
      levelScaling: 1.25,
      enemyTypes: ['normal', 'runner', 'tank', 'shielded', 'swarmer']
    };
    this.currentLevelConfig = fakeLvl;
    this.setupMatch(fakeLvl, false);
  }

  startTimeAttackMode() {
    this.mode = 'TIME_ATTACK';
    const fakeLvl = {
      id: 102,
      name: 'Time Attack Challenge',
      mapId: 'map1',
      objective: 'ELIMINATE',
      objectiveTarget: 60,
      waveCount: 5,
      enemyCount: 80,
      timeLimit: 90,
      objectiveDesc: 'Eliminate 60 zombies before the 90-second timer expires!',
      difficulty: 'Medium / Fast',
      levelScaling: 1.1,
      enemyTypes: ['normal', 'runner', 'swarmer']
    };
    this.currentLevelConfig = fakeLvl;
    this.setupMatch(fakeLvl, false);
  }

  startBossChallengeMode() {
    this.mode = 'BOSS_CHALLENGE';
    const fakeLvl = {
      id: 103,
      name: 'Boss Showdown',
      mapId: 'map2',
      objective: 'BOSS',
      objectiveTarget: 1,
      waveCount: 2,
      enemyCount: 30,
      isBossLevel: true,
      bossType: 'overlord',
      objectiveDesc: 'Defeat the Overlord in combat!',
      difficulty: 'Extreme',
      levelScaling: 1.5,
      enemyTypes: ['normal', 'runner', 'tank', 'elite']
    };
    this.currentLevelConfig = fakeLvl;
    this.setupMatch(fakeLvl, false);
  }

  setupMatch(levelConfig, isEndless = false) {
    this.map = window.MAP_TEMPLATES[levelConfig.mapId] || window.MAP_TEMPLATES.map1;
    this.camera.setBounds({ minX: 0, minY: 0, maxX: this.map.width, maxY: this.map.height });

    // Spawn player in center
    this.player = new Player(this.map.width / 2, this.map.height / 2);
    this.camera.follow(this.player.x, this.player.y);

    this.zombies = [];
    this.projectiles = [];
    this.enemyProjectiles = [];
    this.pickups = [];
    this.objectiveBeacons = [];
    this.particles.reset();

    this.sessionTimer = 0;
    this.levelTimeRemaining = levelConfig.timeLimit || 0;
    this.objectiveCounter = 0;
    this.damageTakenThisSession = 0;
    this.comboCount = 0;
    this.comboMultiplier = 1;
    this.comboTimer = 0;
    this.maxComboThisSession = 1;

    // Objective beacons for COLLECT or ESCAPE
    if (levelConfig.objective === 'COLLECT') {
      const count = levelConfig.objectiveTarget || 5;
      for (let i = 0; i < count; i++) {
        this.objectiveBeacons.push({
          x: 180 + Math.random() * (this.map.width - 360),
          y: 180 + Math.random() * (this.map.height - 360),
          radius: 18,
          collected: false
        });
      }
    } else if (levelConfig.objective === 'ESCAPE') {
      this.objectiveBeacons.push({
        x: this.map.width - 150,
        y: this.map.height - 150,
        radius: 40,
        isExit: true
      });
    }

    this.effects.initFog(this.camera.bounds, 24);
    this.waveManager.startLevel(levelConfig, isEndless);

    this.state = 'PLAYING';
    this.ui.showScreen('PLAYING');
    window.Sound.startMusic();
  }

  restartCurrentLevel() {
    this.togglePause(false);
    if (this.mode === 'STORY' && this.currentLevelConfig) {
      this.startStoryLevel(this.currentLevelConfig.id);
    } else if (this.mode === 'ENDLESS') {
      this.startEndlessMode();
    } else if (this.mode === 'WAVE_SURVIVAL') {
      this.startWaveSurvivalMode();
    } else if (this.mode === 'TIME_ATTACK') {
      this.startTimeAttackMode();
    } else if (this.mode === 'BOSS_CHALLENGE') {
      this.startBossChallengeMode();
    }
  }

  startNextLevel() {
    if (this.currentLevelConfig && this.currentLevelConfig.id < 60) {
      this.startStoryLevel(this.currentLevelConfig.id + 1);
    } else {
      this.startEndlessMode();
    }
  }

  togglePause(paused) {
    if (paused && this.state === 'PLAYING') {
      this.state = 'PAUSED';
      document.getElementById('screenPause').classList.add('active');
    } else if (!paused && this.state === 'PAUSED') {
      this.state = 'PLAYING';
      document.getElementById('screenPause').classList.remove('active');
    }
  }

  // --- GAME LOOP ---

  loop(timestamp) {
    const dt = Math.min(0.1, (timestamp - this.lastTime) / 1000);
    this.lastTime = timestamp;

    if (this.state === 'PLAYING') {
      this.update(dt);
    }

    this.render();

    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  update(dt) {
    this.sessionTimer += dt;

    // Time Limit Countdown
    if (this.levelTimeRemaining > 0) {
      this.levelTimeRemaining -= dt;
      if (this.levelTimeRemaining <= 0) {
        if (this.currentLevelConfig.objective === 'SURVIVE') {
          // Survived time limit = victory!
          this.endMatch(true);
          return;
        } else {
          // Time ran out on Time Attack / Escape = defeat!
          this.endMatch(false);
          return;
        }
      }
    }

    // Combo decay
    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.comboCount = 0;
        this.comboMultiplier = 1;
      }
    }

    // 1. INPUT & PLAYER
    if (this.player && this.player.alive) {
      // Re-map screen cursor to world in case camera moved
      const world = this.camera.screenToWorld(this.input.targetScreenX, this.input.targetScreenY);
      this.input.targetWorldX = world.x;
      this.input.targetWorldY = world.y;

      this.player.update(dt, this.input, this.camera.bounds, this.map.obstacles);

      if (this.input.firing) {
        this.player.shoot(this.projectiles);
      }

      this.camera.follow(this.player.x, this.player.y);
    } else if (this.player && !this.player.alive) {
      // Player dead
      this.endMatch(false);
      return;
    }

    // 2. PROJECTILES vs ENEMIES & WALLS
    this.updateProjectiles(dt);

    // 3. ENEMY PROJECTILES vs PLAYER
    this.updateEnemyProjectiles(dt);

    // 4. ZOMBIE AI & SEPARATION
    this.updateZombies(dt);

    // 5. WAVES & SPAWNING
    const waveStatus = this.waveManager.update(
      dt,
      this.player,
      this.map,
      this.zombies,
      this.currentLevelConfig.levelScaling || 1.0
    );

    if (waveStatus === 'LEVEL_CLEARED' && this.currentLevelConfig.objective === 'ELIMINATE') {
      this.endMatch(true);
      return;
    }

    // 6. OBJECTIVES TRACKING
    this.updateObjectives();

    // 7. PICKUPS COLLECTION
    this.updatePickups(dt);

    // 8. PARTICLES & EFFECTS
    this.particles.update(dt);
    this.effects.update(dt, this.camera.bounds);
    this.camera.update(dt);

    // 9. HUD UI UPDATE
    let objProgressText = '';
    if (this.currentLevelConfig.objective === 'SURVIVE') {
      objProgressText = `${Math.ceil(this.levelTimeRemaining || 0)}s left`;
    } else if (this.currentLevelConfig.objective === 'ELIMINATE') {
      objProgressText = `${this.player.kills} / ${this.currentLevelConfig.objectiveTarget}`;
    } else if (this.currentLevelConfig.objective === 'COLLECT') {
      const collected = this.objectiveBeacons.filter(b => b.collected).length;
      objProgressText = `${collected} / ${this.objectiveBeacons.length} Crates`;
    } else if (this.currentLevelConfig.objective === 'ESCAPE') {
      objProgressText = `${Math.ceil(this.levelTimeRemaining || 0)}s to Exit`;
    } else if (this.currentLevelConfig.objective === 'BOSS') {
      const boss = this.zombies.find(z => z.isBoss && z.alive);
      objProgressText = boss ? `${Math.ceil(boss.hp)} HP` : 'Defeated!';
    }

    this.ui.updateHUD(
      this.player,
      this.waveManager,
      this.currentLevelConfig,
      this.comboMultiplier,
      this.comboTimer,
      objProgressText
    );
  }

  updateProjectiles(dt) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      if (!p.update(dt)) {
        this.projectiles.splice(i, 1);
        continue;
      }

      // Check collision with obstacles
      let hitWall = false;
      if (this.map.obstacles) {
        for (let obs of this.map.obstacles) {
          if (Collision.circleRect(p.x, p.y, p.radius, obs.x, obs.y, obs.w, obs.h)) {
            hitWall = true;
            this.particles.createHitSparks(p.x, p.y, p.angle, '#94a3b8', 5);
            break;
          }
        }
      }
      if (hitWall) {
        this.projectiles.splice(i, 1);
        continue;
      }

      // Check collision with zombies
      for (let z of this.zombies) {
        if (!z.alive || p.hitEntities.has(z)) continue;

        if (Collision.circleCircle(p.x, p.y, p.radius, z.x, z.y, z.radius)) {
          p.hitEntities.add(z);
          this.player.shotsHit++;

          const res = z.takeDamage(p.damage, p.angle, p.isCrit);
          const dmgDealt = res ? res.damage : p.damage;

          // Impact sparks & floating combat text
          this.particles.createHitSparks(p.x, p.y, p.angle, p.color, 8, p.isCrit);
          this.particles.addFloatingText(z.x, z.y, `-${dmgDealt}`, p.isCrit ? '#ffb703' : '#ffffff', 16, p.isCrit);

          // Cryo slow effect
          if (p.weapon.slowDuration) {
            z.applySlow(p.weapon.slowDuration, p.weapon.slowFactor || 0.4);
          }

          // Splash damage for Plasma Cannon
          if (p.weapon.splashRadius) {
            this.particles.createShockwave(p.x, p.y, '#22c55e', p.weapon.splashRadius, 0.3);
            for (let other of this.zombies) {
              if (other !== z && other.alive) {
                const dist = Math.hypot(other.x - p.x, other.y - p.y);
                if (dist <= p.weapon.splashRadius) {
                  other.takeDamage(p.damage * 0.65);
                }
              }
            }
          }

          // Chain lightning for Shock Launcher
          if (p.weapon.chainCount && p.weapon.chainCount > 0) {
            let chained = 0;
            for (let other of this.zombies) {
              if (other !== z && other.alive && chained < p.weapon.chainCount) {
                const dist = Math.hypot(other.x - z.x, other.y - z.y);
                if (dist <= (p.weapon.chainRange || 130)) {
                  other.takeDamage(p.damage * 0.7);
                  this.particles.createHitSparks(other.x, other.y, 0, '#facc15', 6);
                  chained++;
                }
              }
            }
          }

          // Check if zombie died
          if (!z.alive) {
            this.onZombieKilled(z);
          }

          // Pierce calculation
          if (p.pierceLeft > 0) {
            p.pierceLeft--;
          } else {
            this.projectiles.splice(i, 1);
            break;
          }
        }
      }
    }
  }

  updateEnemyProjectiles(dt) {
    for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
      const ep = this.enemyProjectiles[i];
      if (!ep.update(dt)) {
        this.enemyProjectiles.splice(i, 1);
        continue;
      }

      if (this.player && this.player.alive) {
        if (Collision.circleCircle(ep.x, ep.y, ep.radius, this.player.x, this.player.y, this.player.radius)) {
          this.player.takeDamage(ep.damage);
          this.particles.createHitSparks(ep.x, ep.y, ep.angle, '#ef4444', 8);
          this.enemyProjectiles.splice(i, 1);
        }
      }
    }
  }

  updateZombies(dt) {
    for (let i = 0; i < this.zombies.length; i++) {
      const z = this.zombies[i];
      if (!z.alive) continue;

      z.update(dt, this.player, this.map.obstacles, this.enemyProjectiles, this.zombies);

      // Soft crowd separation between zombies
      for (let j = i + 1; j < this.zombies.length; j++) {
        const other = this.zombies[j];
        if (other.alive) {
          Collision.resolveCircleCircle(z, other, 0.4, 0.4);
        }
      }
    }
  }

  onZombieKilled(zombie) {
    this.player.kills++;

    // Increment combo
    this.comboCount++;
    this.comboTimer = 3.5; // 3.5s refresh
    if (this.comboCount >= 20) this.comboMultiplier = 10;
    else if (this.comboCount >= 10) this.comboMultiplier = 5;
    else if (this.comboCount >= 5) this.comboMultiplier = 3;
    else if (this.comboCount >= 3) this.comboMultiplier = 2;
    else this.comboMultiplier = 1;

    this.maxComboThisSession = Math.max(this.maxComboThisSession, this.comboMultiplier);

    // Score calculation
    const earnedScore = zombie.score * this.comboMultiplier;
    this.player.score += earnedScore;

    // Particles vapor
    this.particles.createDefeatVapor(zombie.x, zombie.y, zombie.color, zombie.isBoss ? 35 : 14);

    // Mission updates
    window.Missions.updateProgress('kill_50', 1);
    window.Missions.updateProgress('kill_200', 1);
    if (this.comboMultiplier >= 10) window.Missions.updateProgress('combo_10', 10, false);
    if (this.comboMultiplier >= 20) window.Missions.updateProgress('combo_20', 20, false);
    if (zombie.type === 'elite') window.Missions.updateProgress('defeat_elite', 1);

    // Spawn Pickups
    this.spawnPickupsForZombie(zombie);

    // Check Boss Objective
    if (this.currentLevelConfig.objective === 'BOSS' && zombie.isBoss) {
      this.endMatch(true);
    }
  }

  spawnPickupsForZombie(zombie) {
    const rates = zombie.dropRates || { coin: 0.5, xp: 0.8, ammo: 0.2, health: 0.1 };

    // Always drop XP gem
    if (Math.random() < rates.xp) {
      this.pickups.push(new Pickup(zombie.x, zombie.y, 'xp', zombie.xp));
    }

    // Coin
    if (Math.random() < rates.coin) {
      const coinAmt = Math.round(15 + Math.random() * 25);
      this.pickups.push(new Pickup(zombie.x + 8, zombie.y + 8, 'coin', coinAmt));
    }

    // Ammo box
    if (Math.random() < (rates.ammo || 0.15)) {
      this.pickups.push(new Pickup(zombie.x - 8, zombie.y + 8, 'ammo', 30));
    }

    // Health / Armor
    if (Math.random() < (rates.health || 0.08)) {
      this.pickups.push(new Pickup(zombie.x, zombie.y - 8, 'health', 25));
    } else if (Math.random() < (rates.armor || 0.05)) {
      this.pickups.push(new Pickup(zombie.x - 6, zombie.y - 6, 'armor', 20));
    }
  }

  updatePickups(dt) {
    for (let i = this.pickups.length - 1; i >= 0; i--) {
      const pk = this.pickups[i];
      pk.update(dt, this.player);

      if (Collision.circleCircle(pk.x, pk.y, pk.radius, this.player.x, this.player.y, this.player.radius + 6)) {
        // Collect!
        if (pk.type === 'coin') {
          this.player.coinsCollected += pk.value;
          window.Storage.addCoins(pk.value);
          window.Missions.updateProgress('collect_100_coins', pk.value);
          this.particles.addFloatingText(pk.x, pk.y, `+${pk.value} 🪙`, '#fbbf24', 15);
          window.Sound.playPickup('coin');
        } else if (pk.type === 'xp') {
          this.player.xpCollected += pk.value;
          window.Storage.addXP(pk.value);
          this.particles.addFloatingText(pk.x, pk.y, `+${pk.value} XP`, '#38bdf8', 14);
          window.Sound.playPickup('xp');
        } else if (pk.type === 'health') {
          this.player.health = Math.min(this.player.maxHealth, this.player.health + pk.value);
          this.particles.addFloatingText(pk.x, pk.y, `+${pk.value} HP`, '#22c55e', 16);
          window.Sound.playPickup('health');
        } else if (pk.type === 'armor') {
          this.player.armor = Math.min(this.player.maxArmor, this.player.armor + pk.value);
          this.particles.addFloatingText(pk.x, pk.y, `+${pk.value} ARMOR`, '#38bdf8', 16);
          window.Sound.playPickup('armor');
        } else if (pk.type === 'ammo') {
          this.player.reserveAmmo += pk.value;
          this.particles.addFloatingText(pk.x, pk.y, `+${pk.value} AMMO`, '#f59e0b', 15);
          window.Sound.playPickup('ammo');
        }

        this.pickups.splice(i, 1);
      }
    }
  }

  updateObjectives() {
    if (!this.player || !this.player.alive) return;

    // Eliminate objective
    if (this.currentLevelConfig.objective === 'ELIMINATE') {
      if (this.player.kills >= this.currentLevelConfig.objectiveTarget) {
        this.endMatch(true);
      }
    }

    // Collect beacons objective
    if (this.currentLevelConfig.objective === 'COLLECT') {
      for (let b of this.objectiveBeacons) {
        if (!b.collected && Collision.circleCircle(b.x, b.y, b.radius, this.player.x, this.player.y, this.player.radius + 10)) {
          b.collected = true;
          this.particles.createShockwave(b.x, b.y, '#f59e0b', 40, 0.3);
          window.Sound.playPickup('coin');
        }
      }
      const allCollected = this.objectiveBeacons.every(b => b.collected);
      if (allCollected) {
        this.endMatch(true);
      }
    }

    // Escape zone objective
    if (this.currentLevelConfig.objective === 'ESCAPE') {
      const exit = this.objectiveBeacons.find(b => b.isExit);
      if (exit && Collision.circleCircle(exit.x, exit.y, exit.radius, this.player.x, this.player.y, this.player.radius)) {
        this.endMatch(true);
      }
    }
  }

  endMatch(victory) {
    this.state = victory ? 'RESULTS' : 'GAME_OVER';

    const accuracy = this.player.shotsFired > 0
      ? Math.round((this.player.shotsHit / this.player.shotsFired) * 100)
      : 100;

    // Calculate stars (1-3)
    let stars = 0;
    if (victory) {
      stars = 1;
      if (this.player.health >= this.player.maxHealth * 0.5) stars++;
      if (accuracy >= 70 || this.sessionTimer < 90) stars++;
    }

    const rewardXP = victory ? (this.currentLevelConfig.reward ? this.currentLevelConfig.reward.xp : 200) : Math.round(this.player.xpCollected);
    const rewardCoins = victory ? (this.currentLevelConfig.reward ? this.currentLevelConfig.reward.coins : 100) : Math.round(this.player.coinsCollected);

    if (victory) {
      window.Storage.addXP(rewardXP);
      window.Storage.addCoins(rewardCoins);
      if (this.mode === 'STORY') {
        window.Storage.completeLevel(
          this.currentLevelConfig.id,
          stars,
          this.player.score,
          Math.round(this.sessionTimer),
          this.player.kills,
          accuracy
        );
      }
    }

    if (this.mode === 'ENDLESS') {
      window.Storage.recordEndlessStats(
        this.waveManager.currentWave,
        this.player.score,
        this.player.kills,
        Math.round(this.sessionTimer)
      );
    }

    window.Storage.recordStats(this.player.kills, this.maxComboThisSession, Math.round(this.sessionTimer), this.currentLevelConfig.isBossLevel);

    const finalStats = {
      victory: victory,
      stars: stars,
      score: this.player.score,
      kills: this.player.kills,
      accuracy: accuracy,
      maxCombo: this.maxComboThisSession,
      time: Math.round(this.sessionTimer),
      rewardXP: rewardXP,
      rewardCoins: rewardCoins,
      damageTaken: this.damageTakenThisSession
    };

    window.Missions.checkSessionAchievements(this.player, this.currentLevelConfig, finalStats);
    this.ui.showResults(this.currentLevelConfig, finalStats);
  }

  // --- RENDER ---

  render() {
    if (!this.ctx || !this.canvas) return;

    // Clear Screen
    this.ctx.fillStyle = '#060a14';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.state !== 'PLAYING' && this.state !== 'PAUSED') {
      return;
    }

    // Apply Camera translation
    this.camera.apply(this.ctx);

    // 1. Render Map floor & grid
    this.renderMap(this.ctx);

    // 2. Render Objective Beacons / Exit Zones
    this.renderObjectives(this.ctx);

    // 3. Render Pickups
    for (let pk of this.pickups) {
      pk.render(this.ctx);
    }

    // 4. Render Obstacles (buildings, vehicles, crates)
    this.renderObstacles(this.ctx);

    // 5. Render Zombies
    for (let z of this.zombies) {
      z.render(this.ctx);
    }

    // 6. Render Player
    if (this.player) {
      this.player.render(this.ctx);
    }

    // 7. Render Projectiles
    for (let p of this.projectiles) {
      p.render(this.ctx);
    }
    for (let ep of this.enemyProjectiles) {
      ep.render(this.ctx);
    }

    // 8. Render Particles
    this.particles.render(this.ctx);

    // 9. Dynamic Lighting & Shadows
    const lights = this.projectiles.map(p => ({ x: p.x, y: p.y, radius: p.radius * 6, intensity: 0.7 }));
    this.effects.renderLighting(this.ctx, this.camera, this.player, lights, this.map.streetLamps || []);

    // Restore Camera
    this.camera.restore(this.ctx);

    // Screen-space hit flash overlay
    this.effects.renderScreenOverlay(this.ctx, this.canvas.width, this.canvas.height);
  }

  renderMap(ctx) {
    // Arena Floor
    ctx.fillStyle = this.map.floorColor || '#090d16';
    ctx.fillRect(0, 0, this.map.width, this.map.height);

    // Tactical Grid Lines
    ctx.strokeStyle = this.map.gridColor || 'rgba(30, 41, 59, 0.4)';
    ctx.lineWidth = 1;
    const gridSize = 64;
    ctx.beginPath();
    for (let x = 0; x <= this.map.width; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.map.height);
    }
    for (let y = 0; y <= this.map.height; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(this.map.width, y);
    }
    ctx.stroke();

    // Border Fence / Perimeter Barrier
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 6;
    ctx.strokeRect(0, 0, this.map.width, this.map.height);
  }

  renderObstacles(ctx) {
    if (!this.map.obstacles) return;

    for (let o of this.map.obstacles) {
      ctx.save();
      // Obstacle Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(o.x + 8, o.y + 8, o.w, o.h);

      if (o.type === 'car' || o.type === 'bus') {
        ctx.fillStyle = '#334155';
        ctx.fillRect(o.x, o.y, o.w, o.h);
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.strokeRect(o.x, o.y, o.w, o.h);
        // Vehicle windshields
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(o.x + 6, o.y + 6, o.w - 12, o.h * 0.35);
      } else {
        // Concrete building / barricade
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(o.x, o.y, o.w, o.h);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.strokeRect(o.x, o.y, o.w, o.h);
      }

      ctx.restore();
    }
  }

  renderObjectives(ctx) {
    for (let b of this.objectiveBeacons) {
      ctx.save();
      if (b.isExit) {
        // Exit extraction zone
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#22c55e';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(34, 197, 94, 0.15)';
        ctx.fill();
      } else {
        // Supply Crate
        if (!b.collected) {
          ctx.fillStyle = '#f59e0b';
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 10;
          ctx.fillRect(b.x - 12, b.y - 12, 24, 24);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.strokeRect(b.x - 12, b.y - 12, 24, 24);
        }
      }
      ctx.restore();
    }
  }
}

class Pickup {
  constructor(x, y, type, value) {
    this.x = x;
    this.y = y;
    this.type = type; // coin, xp, health, armor, ammo
    this.value = value;
    this.radius = 8;
    this.life = 25.0; // Seconds before decaying
    this.bobTimer = Math.random() * Math.PI * 2;
  }

  update(dt, player) {
    this.bobTimer += dt * 3;
    this.life -= dt;

    // Magnetic pull toward player if within 140px
    if (player && player.alive) {
      const dist = Math.hypot(player.x - this.x, player.y - this.y);
      if (dist < 140) {
        const pullSpeed = (1 - dist / 140) * 350;
        const angle = Math.atan2(player.y - this.y, player.x - this.x);
        this.x += Math.cos(angle) * pullSpeed * dt;
        this.y += Math.sin(angle) * pullSpeed * dt;
      }
    }
  }

  render(ctx) {
    const bob = Math.sin(this.bobTimer) * 3;
    ctx.save();
    ctx.translate(this.x, this.y + bob);

    if (this.type === 'coin') {
      ctx.fillStyle = '#facc15';
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'xp') {
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'health') {
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-6, -6, 12, 12);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-2, -5, 4, 10);
      ctx.fillRect(-5, -2, 10, 4);
    } else if (this.type === 'armor') {
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Ammo
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-5, -7, 10, 14);
    }

    ctx.restore();
  }
}

window.GameEngine = GameEngine;
window.Pickup = Pickup;

