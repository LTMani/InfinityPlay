/**
 * Zombie Survival - Wave & Spawner Controller
 * Controls wave pacing, controlled safe spawning, inter-wave breathers, and endless scaling.
 */

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
    this.safePlayerRadius = 260; // Never spawn closer than 260px to player
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

    let count;
    if (this.isEndless) {
      count = 8 + Math.floor(waveNum * 3.5);
      this.spawnInterval = Math.max(0.4, 1.4 - waveNum * 0.05);
    } else {
      const perWave = Math.ceil(this.levelConfig.enemyCount / this.totalWaves);
      count = perWave + (waveNum - 1) * 3;
      this.spawnInterval = Math.max(0.6, 1.3 - (this.levelConfig.id * 0.01));
    }

    this.enemiesInWave = count;
    this.enemiesSpawnedThisWave = 0;
    this.enemiesRemainingToSpawn = count;
    this.spawnTimer = 0.5; // Short delay before first spawn

    window.Sound.playWaveStart();

    if (window.gameInstance && window.gameInstance.ui) {
      window.gameInstance.ui.showWaveBanner(
        this.isBossWave() ? '⚠️ WARNING: BOSS WAVE' : `WAVE ${this.currentWave}`
      );
    }
  }

  isBossWave() {
    if (this.isEndless) {
      return this.currentWave % 5 === 0;
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
      return;
    }

    if (!this.isWaveActive) return;

    // Spawning ticks
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
      // Wave complete!
      this.isWaveActive = false;

      if (!this.isEndless && this.currentWave >= this.totalWaves) {
        // Level cleared!
        return 'LEVEL_CLEARED';
      } else {
        // Next wave intermission
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

    let type = 'normal';
    if (this.isBossWave() && this.enemiesRemainingToSpawn === 0) {
      // Spawn Boss as final enemy of the wave
      type = 'boss';
      const bossVariant = (this.levelConfig && this.levelConfig.bossType) || 'abomination';
      const boss = new Zombie(pos.x, pos.y, 'boss', levelScaling * 1.25, bossVariant);
      zombiesList.push(boss);
      window.Sound.playBossAlarm();
      return;
    }

    // Pool of available enemy types
    let pool = (this.levelConfig && this.levelConfig.enemyTypes) || ['normal', 'runner'];
    if (this.isEndless) {
      pool = ['normal'];
      if (this.currentWave >= 2) pool.push('runner');
      if (this.currentWave >= 4) pool.push('swarmer');
      if (this.currentWave >= 6) pool.push('tank');
      if (this.currentWave >= 8) pool.push('shielded');
      if (this.currentWave >= 10) pool.push('hunter');
      if (this.currentWave >= 12) pool.push('elite');
    }

    // Weighted random selection
    type = pool[Math.floor(Math.random() * pool.length)];

    // Spawn regular enemy
    const z = new Zombie(pos.x, pos.y, type, levelScaling);
    zombiesList.push(z);

    // Visual spawn dust
    if (window.gameInstance && window.gameInstance.particles) {
      window.gameInstance.particles.createSmokePuff(pos.x, pos.y, 'rgba(56, 189, 248, 0.4)', 6);
    }
  }

  findSafeSpawnPosition(player, map) {
    const bounds = {
      minX: 60,
      minY: 60,
      maxX: map.width - 60,
      maxY: map.height - 60
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
    for (let attempts = 0; attempts < 15; attempts++) {
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
        // Verify not inside obstacle
        let insideObstacle = false;
        if (map.obstacles) {
          for (let o of map.obstacles) {
            if (Collision.circleRect(sx, sy, 20, o.x, o.y, o.w, o.h)) {
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

    // Default safe fallback
    return { x: bounds.minX + 50, y: bounds.minY + 50 };
  }
}

window.WaveManager = WaveManager;

