/**
 * PSEUDOKO — Deterministic Daily Challenge Engine
 * Seeded by the current calendar date (YYYY-MM-DD)
 * Guarantees identical tactical puzzle for all players on the same day without a backend.
 */

(function(global) {
  'use strict';

  // Mulberry32 deterministic pseudo-random number generator
  function createSeededRNG(seed) {
    let s = seed | 0;
    return function() {
      s = (s + 0x6D2B79F5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const DailyChallenge = {
    getTodayDateString() {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    },

    getDateSeed(dateStr) {
      // e.g. "2026-09-11" -> 20260911
      const clean = dateStr.replace(/[^0-9]/g, '');
      return parseInt(clean, 10) || 20260911;
    },

    generateDailyPuzzle(dateStr = null) {
      const targetDate = dateStr || this.getTodayDateString();
      const seed = this.getDateSeed(targetDate);
      const rand = createSeededRNG(seed);

      const specialCells = [];
      const preplacedNodes = [];

      // 1. Deterministic Power Cores (2-3 cores)
      const coreCount = 3;
      const placedCoords = new Set();

      while (specialCells.length < coreCount) {
        const r = 1 + Math.floor(rand() * 6);
        const c = 1 + Math.floor(rand() * 6);
        const key = `${r}_${c}`;
        if (!placedCoords.has(key)) {
          placedCoords.add(key);
          specialCells.push({ row: r, col: c, type: 'core' });
        }
      }

      // 2. Deterministic Firewalls (2-3 firewalls)
      const fwCount = 3;
      while (specialCells.length < coreCount + fwCount) {
        const r = Math.floor(rand() * 8);
        const c = Math.floor(rand() * 8);
        const key = `${r}_${c}`;
        if (!placedCoords.has(key)) {
          placedCoords.add(key);
          specialCells.push({ row: r, col: c, type: 'firewall' });
        }
      }

      // 3. Deterministic Preplaced Logic Nodes (6-8 nodes)
      const nodeCount = 8;
      while (preplacedNodes.length < nodeCount) {
        const r = Math.floor(rand() * 8);
        const c = Math.floor(rand() * 8);
        const key = `${r}_${c}`;
        if (!placedCoords.has(key)) {
          placedCoords.add(key);
          const typeId = 1 + Math.floor(rand() * 4);
          preplacedNodes.push({ row: r, col: c, type: typeId, locked: true });
        }
      }

      const targetScore = 2400 + Math.floor(rand() * 600);
      const moves = 16 + Math.floor(rand() * 4);

      return {
        date: targetDate,
        seed: seed,
        title: `Daily Protocol: ${targetDate}`,
        objective: {
          type: 'score',
          target: targetScore,
          description: `Reach ${targetScore.toLocaleString()} pts & capture 2+ Cores`
        },
        moves: moves,
        starThresholds: [targetScore, Math.round(targetScore * 1.3), Math.round(targetScore * 1.7)],
        specialCells: specialCells,
        preplacedNodes: preplacedNodes
      };
    },

    getTimeUntilMidnight() {
      const now = new Date();
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
      const diff = midnight - now;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      return {
        totalMs: diff,
        formatted: `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
      };
    }
  };

  global.Pseudoko = global.Pseudoko || {};
  global.Pseudoko.Daily = DailyChallenge;

})(typeof window !== 'undefined' ? window : global);

