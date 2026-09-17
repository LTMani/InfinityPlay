/**
 * Zombie Survival V2 - Wave & Spawner Controller
 * Controls wave pacing, 7 special wave events, controlled safe spawning, and tiered loot drops.
 */

const SPECIAL_WAVE_EVENTS = {
  ZOMBIE_RUSH: {
    id: 'ZOMBIE_RUSH',
    name: '⚡ ZOMBIE RUSH',
    desc: 'High-speed swarm approaching! Rapid spawn frequency.',
    spawnMult: 0.5, // Spawn twice as fast
    color: '#fb7185',
    enemyPool: ['runner', 'swarmer', 'normal']
  },
  RUNNER_WAVE: {
    id: 'RUNNER_WAVE',
    name: '🔴 RUNNER WAVE',
    desc: 'Pure sprint horde detected! Keep moving.',
    spawnMult: 0.7,
    color: '#ef4444',
    enemyPool: ['runner']
  },
  TANK_WAVE: {
    id: 'TANK_WAVE',
    name: '🛡️ TANK BRIGADE',
    desc: 'Heavy armor column breaching perimeter.',
    spawnMult: 1.2,
    color: '#a855f7',
    enemyPool: ['tank', 'shielded']
  },
  GOLDEN_WAVE: {
    id: 'GOLDEN_WAVE',
    name: '⭐ GOLDEN HORDE',
    desc: 'Jackpot wave! Defeated mutants drop 3x coins and bonus XP.',
    spawnMult: 0.9,
    color: '#facc15',
    isGolden: true,
    enemyPool: ['swarmer', 'normal', 'runner']
  },
  DARK_WAVE: {
    id: 'DARK_WAVE',
    name: '🌑 DARK AMBUSH',
    desc: 'Biohazard haze thickens. Lethal stalkers inbound.',
    spawnMult: 0.8,
    color: '#64748b',
    enemyPool: ['hunter', 'exploder', 'swarmer']
  },
  CHAOS_WAVE: {
    id: 'CHAOS_WAVE',
    name: '☣️ CHAOS INVASION',
    desc: 'Unstable mutation! Mixed batch of all hostile archetypes.',
    spawnMult: 0.65,
    color: '#ec4899',
    enemyPool: ['normal', 'runner', 'swarmer', 'tank', 'shielded', 'hunter', 'exploder', 'healer', 'elite']
  },
  BOSS_WAVE: {
    id: 'BOSS_WAVE',
    name: '💀 BOSS CONFRONTATION',
    desc: 'Sector Boss detected on radar. Eliminate the threat!',
    spawnMult: 1.0,
    color: '#dc2626',
    isBoss: true,
    enemyPool: ['normal', 'swarmer']
  }
};

class WaveManager {
  constructor() {
    this.currentWave = 1;
    this.totalWaves = 1;
    this.enemiesInWave = 0;
    this.enemiesSpawnedThisWave = 0;
    this.enemiesRemainingToSpawn = 0;
    this.spawnTimer = 0;
    this.spawnInterval = 1.2;
    this.isWaveActive = false;
    this.isIntermission = false;
    this.intermissionTimer = 0;
    this.levelConfig = null;
    this.isEndless = false;
    this.safePlayerRadius = 260; // Safe distance from player for spawning
    this.activeEvent = null; // Currently active Special Wave Event
  }

  startLevel(levelConfig, isEndless = false) {
    this.levelConfig = levelConfig;
    this.isEndless = isEndless;
    this.currentWave = 1;
    this.totalWaves = isEndless ? Infinity : (levelConfig.waveCount || 3);
    this.startWave(1);
  }

  startWave(waveNum) {
    this.currentWave = waveNum;
    this.isWaveActive = true;
    this.isIntermission = false;
    this.intermissionTimer = 0;

    // Determine special wave event
    this.activeEvent = this.selectWaveEvent(waveNum);

    let count;
    let baseInterval;
    if (this.isEndless) {
      count = 8 + Math.floor(waveNum * 3.5);
      baseInterval = Math.max(0.35, 1.3 - waveNum * 0.04);
    } else {
      const perWave = Math.ceil((this.levelConfig.enemyCount || 24) / this.totalWaves);
      count = perWave + (waveNum - 1) * 3;
      baseInterval = Math.max(0.55, 1.25 - ((this.levelConfig.id || 1) * 0.01));
    }

    if (this.activeEvent) {
      baseInterval *= (this.activeEvent.spawnMult || 1.0);
    }

    this.spawnInterval = baseInterval;
    this.enemiesInWave = count;
    this.enemiesSpawnedThisWave = 0;
    this.enemiesRemainingToSpawn = count;
    this.spawnTimer = 0.5; // Quick initial spawn

    window.Sound.playWaveStart();

    // Trigger HUD wave banner announcement
    if (window.gameInstance && window.gameInstance.ui) {
      if (this.isBossWave()) {
        const bossName = (this.levelConfig && this.levelConfig.bossType) ? this.levelConfig.bossType.toUpperCase() : 'BOSS';
        window.gameInstance.ui.showWaveBanner(`⚠️ WARNING: ${bossName} ENCOUNTER!`, '#ef4444');
      } else if (this.activeEvent) {
        window.gameInstance.ui.showWaveBanner(this.activeEvent.name, this.activeEvent.color);
      } else {
        window.gameInstance.ui.showWaveBanner(`WAVE ${this.currentWave}`);
      }
    }
  }

  selectWaveEvent(waveNum) {
    if (this.isBossWave()) {
      return SPECIAL_WAVE_EVENTS.BOSS_WAVE;
    }

    // In story mode, certain waves trigger special events
    if (!this.isEndless) {
      if (this.totalWaves >= 3 && waveNum === 2) {
        // Wave 2 in worlds 2+ often has an event
        const worldId = this.levelConfig ? this.levelConfig.worldId : 1;
        if (worldId === 2) return SPECIAL_WAVE_EVENTS.RUNNER_WAVE;
        if (worldId === 3) return SPECIAL_WAVE_EVENTS.DARK_WAVE;
        if (worldId === 4) return SPECIAL_WAVE_EVENTS.TANK_WAVE;
        if (worldId === 5) return SPECIAL_WAVE_EVENTS.ZOMBIE_RUSH;
        if (worldId >= 6) return (waveNum % 2 === 0) ? SPECIAL_WAVE_EVENTS.CHAOS_WAVE : SPECIAL_WAVE_EVENTS.GOLDEN_WAVE;
      }
      return null;
    }

    // In Endless mode, events trigger every 3-4 waves
    if (waveNum % 7 === 0) return SPECIAL_WAVE_EVENTS.CHAOS_WAVE;
    if (waveNum % 5 === 0) return SPECIAL_WAVE_EVENTS.GOLDEN_WAVE;
    if (waveNum % 4 === 0) return SPECIAL_WAVE_EVENTS.ZOMBIE_RUSH;
    if (waveNum % 3 === 0) return SPECIAL_WAVE_EVENTS.DARK_WAVE;

    return null;
  }

  isBossWave() {
    if (this.isEndless) {
      return this.currentWave > 0 && this.currentWave % 10 === 0;
    }
    return (this.levelConfig && this.levelConfig.isBossLevel && this.currentWave === this.totalWaves);
  }

  update(dt, player, map, zombiesList, levelScaling = 1.0) {
    // Intermission between waves
    if (this.isIntermission) {
      this.intermissionTimer -= dt;
      if (this.intermissionTimer <= 0) {
        this.isIntermission = false;
        this.startWave(this.currentWave + 1);
      }
      return null;
    }

    if (!this.isWaveActive) return null;

    // Spawner ticks
    if (this.enemiesRemainingToSpawn > 0) {
      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0) {
        this.spawnTimer = this.spawnInterval;
        this.spawnEnemy(player, map, zombiesList, levelScaling);
        this.enemiesRemainingToSpawn--;
        this.enemiesSpawnedThisWave++;
      }
    }

    // Check if wave is cleared
    const livingZombies = zombiesList.filter(z => z.alive).length;
    if (this.enemiesRemainingToSpawn === 0 && livingZombies === 0) {
      this.isWaveActive = false;

      if (!this.isEndless && this.currentWave >= this.totalWaves) {
        return 'LEVEL_CLEARED';
      } else {
        this.isIntermission = true;
        this.intermissionTimer = 3.0; // 3 seconds breather
        window.Sound.playClick();
      }
    }

    return null;
  }

  spawnEnemy(player, map, zombiesList, levelScaling) {
    const pos = this.findSafeSpawnPosition(player, map);
    if (!pos) return;

    // Boss spawn at end of boss wave
    if (this.isBossWave() && this.enemiesRemainingToSpawn === 0) {
      const bossVariant = (this.levelConfig && this.levelConfig.bossType) || 'brute';
      const boss = new Zombie(pos.x, pos.y, 'boss', levelScaling * 1.25, bossVariant);
      zombiesList.push(boss);
      window.Sound.playBossAlarm();
      return;
    }

    // Determine enemy type from special event pool or level pool
    let pool;
    if (this.activeEvent && this.activeEvent.enemyPool) {
      pool = this.activeEvent.enemyPool;
    } else if (this.isEndless) {
      pool = ['normal'];
      if (this.currentWave >= 2) pool.push('runner');
      if (this.currentWave >= 4) pool.push('swarmer');
      if (this.currentWave >= 6) pool.push('exploder');
      if (this.currentWave >= 8) pool.push('tank');
      if (this.currentWave >= 10) pool.push('shielded');
      if (this.currentWave >= 12) pool.push('healer');
      if (this.currentWave >= 14) pool.push('hunter');
      if (this.currentWave >= 16) pool.push('elite');
    } else {
      pool = (this.levelConfig && this.levelConfig.enemyTypes) || ['normal', 'runner'];
    }

    const type = pool[Math.floor(Math.random() * pool.length)];
    const z = new Zombie(pos.x, pos.y, type, levelScaling);

    // Apply Golden Wave multiplier
    if (this.activeEvent && this.activeEvent.isGolden) {
      z.dropRates = { coin: 1.0, xp: 1.0, ammo: 0.5, health: 0.3 };
      z.color = '#facc15';
    }

    zombiesList.push(z);

    // Visual spawn dust
    if (window.gameInstance && window.gameInstance.particles) {
      window.gameInstance.particles.createSmokePuff(pos.x, pos.y, 'rgba(56, 189, 248, 0.4)', 6);
    }
  }

  findSafeSpawnPosition(player, map) {
    const bounds = {
      minX: 70,
      minY: 70,
      maxX: map.width - 70,
      maxY: map.height - 70
    };

    // First try predefined map spawns
    if (map.spawns && map.spawns.length > 0) {
      const candidates = map.spawns.filter(sp => {
        const d = Math.hypot(sp.x - player.x, sp.y - player.y);
        return d >= this.safePlayerRadius;
      });
      if (candidates.length > 0) {
        const sp = candidates[Math.floor(Math.random() * candidates.length)];
        return {
          x: sp.x + (Math.random() - 0.5) * 40,
          y: sp.y + (Math.random() - 0.5) * 40
        };
      }
    }

    // Fallback: search around perimeter outside safe radius
    for (let attempts = 0; attempts < 16; attempts++) {
      const edge = Math.floor(Math.random() * 4);
      let sx, sy;
      if (edge === 0) { // Top
        sx = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
        sy = bounds.minY;
      } else if (edge === 1) { // Bottom
        sx = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
        sy = bounds.maxY;
      } else if (edge === 2) { // Left
        sx = bounds.minX;
        sy = bounds.minY + Math.random() * (bounds.maxY - bounds.minY);
      } else { // Right
        sx = bounds.maxX;
        sy = bounds.minY + Math.random() * (bounds.maxY - bounds.minY);
      }

      const dist = Math.hypot(sx - player.x, sy - player.y);
      if (dist >= this.safePlayerRadius) {
        let insideObstacle = false;
        if (map.obstacles) {
          for (let o of map.obstacles) {
            if (Collision.circleRect(sx, sy, 22, o.x, o.y, o.w, o.h)) {
              insideObstacle = true;
              break;
            }
          }
        }
        if (!insideObstacle) {
          return { x: sx, y: sy };
        }
      }
    }

    return { x: bounds.minX + 60, y: bounds.minY + 60 };
  }
}

window.SPECIAL_WAVE_EVENTS = SPECIAL_WAVE_EVENTS;
window.WaveManager = WaveManager;
