/**
 * PSEUDOKO — Core Game Engine
 * Manages the 8x8 Tactical Grid, Constraints, Influence, Combos, and Scoring
 */

(function(global) {
  'use strict';

  // Core Constants
  const GRID_SIZE = 8;
  const TOTAL_CELLS = 64;

  const NODE_TYPES = {
    ALPHA: { id: 1, key: 'alpha', symbol: 'α', name: 'Alpha', color: '#00f0ff', glow: 'rgba(0, 240, 255, 0.6)' },
    BETA:  { id: 2, key: 'beta',  symbol: 'β', name: 'Beta',  color: '#a855f7', glow: 'rgba(168, 85, 247, 0.6)' },
    GAMMA: { id: 3, key: 'gamma', symbol: 'γ', name: 'Gamma', color: '#3b82f6', glow: 'rgba(59, 130, 246, 0.6)' },
    DELTA: { id: 4, key: 'delta', symbol: 'δ', name: 'Delta', color: '#ec4899', glow: 'rgba(236, 72, 153, 0.6)' }
  };

  const CELL_TYPES = {
    EMPTY: 'empty',
    CORE: 'core',         // Power Core: +250 pts, grants +1 move & territory pulse
    FIREWALL: 'firewall', // Firewall: Encrypted barrier
    VORTEX: 'vortex',     // Vortex: Diagonal energy emitter
    GLITCH: 'glitch',     // Glitch: Hazard requiring clearing
    VOID: 'void'          // Void: Inactive void space
  };

  class PseudokoBoard {
    constructor() {
      this.size = GRID_SIZE;
      this.grid = [];
      this.history = [];
      this.combo = 1;
      this.maxCombo = 1;
      this.score = 0;
      this.movesRemaining = 0;
      this.movesMade = 0;
      this.perfectDeductions = true;
      this.circuitsCompleted = 0;
      this.coresCaptured = 0;
      this.initGrid();
    }

    initGrid() {
      this.grid = [];
      for (let r = 0; r < this.size; r++) {
        const row = [];
        for (let c = 0; c < this.size; c++) {
          row.push({
            row: r,
            col: c,
            coord: `${String.fromCharCode(65 + c)}${r + 1}`,
            sector: this.getSectorIndex(r, c),
            quadrant: this.getQuadrantIndex(r, c),
            type: CELL_TYPES.EMPTY,
            node: null, // { type: 1..4, owner: 'player'|'ai'|'neutral', locked: bool }
            owner: null, // 'player' | 'ai' | null
            influence: { player: 0, ai: 0 },
            isPreplaced: false
          });
        }
        this.grid.push(row);
      }
    }

    getSectorIndex(r, c) {
      // 16 sectors of 2x2 cells
      const sr = Math.floor(r / 2);
      const sc = Math.floor(c / 2);
      return sr * 4 + sc;
    }

    getQuadrantIndex(r, c) {
      // 4 quadrants of 4x4 cells: 0: TL, 1: TR, 2: BL, 3: BR
      const qr = Math.floor(r / 4);
      const qc = Math.floor(c / 4);
      return qr * 2 + qc;
    }

    getCell(r, c) {
      if (r < 0 || r >= this.size || c < 0 || c >= this.size) return null;
      return this.grid[r][c];
    }

    cloneState() {
      return JSON.stringify({
        grid: this.grid,
        score: this.score,
        combo: this.combo,
        movesRemaining: this.movesRemaining,
        movesMade: this.movesMade,
        coresCaptured: this.coresCaptured,
        circuitsCompleted: this.circuitsCompleted
      });
    }

    saveSnapshot() {
      this.history.push(this.cloneState());
      if (this.history.length > 20) this.history.shift();
    }

    undo() {
      if (this.history.length === 0) return false;
      const stateStr = this.history.pop();
      const state = JSON.parse(stateStr);
      this.grid = state.grid;
      this.score = state.score;
      this.combo = state.combo;
      this.movesRemaining = state.movesRemaining;
      this.movesMade = state.movesMade;
      this.coresCaptured = state.coresCaptured;
      this.circuitsCompleted = state.circuitsCompleted;
      this.updateInfluence();
      return true;
    }

    /**
     * Checks if placing nodeType at (r, c) is a valid move
     */
    isValidMove(r, c, nodeTypeId, owner = 'player') {
      const cell = this.getCell(r, c);
      if (!cell) return { valid: false, reason: 'Out of bounds' };
      if (cell.type === CELL_TYPES.VOID) return { valid: false, reason: 'Cell is an inactive void' };
      if (cell.node && cell.node.locked) return { valid: false, reason: 'Cell is permanently locked' };
      if (cell.type === CELL_TYPES.FIREWALL && (!cell.firewallBypassed)) {
        return { valid: false, reason: 'Cell is shielded by a Firewall' };
      }

      // 1. Constraint Rule: A 2x2 sector cannot contain two identical node frequencies
      const sectorCells = this.getSectorCells(cell.sector);
      for (const sc of sectorCells) {
        if (sc.row === r && sc.col === c) continue;
        if (sc.node && sc.node.type === nodeTypeId) {
          return {
            valid: false,
            reason: `Frequency conflict: ${NODE_TYPES[this.getNodeKeyById(nodeTypeId)].symbol} already active in Sector ${cell.sector + 1}`,
            conflictCell: { row: sc.row, col: sc.col }
          };
        }
      }

      // 2. Direct orthogonal conflict: cannot place directly adjacent to the same node frequency
      const neighbors = this.getOrthogonalNeighbors(r, c);
      for (const n of neighbors) {
        if (n.node && n.node.type === nodeTypeId) {
          return {
            valid: false,
            reason: `Proximity overload: Adjacent node shares ${NODE_TYPES[this.getNodeKeyById(nodeTypeId)].symbol} frequency`,
            conflictCell: { row: n.row, col: n.col }
          };
        }
      }

      return { valid: true };
    }

    getNodeKeyById(id) {
      for (const key of Object.keys(NODE_TYPES)) {
        if (NODE_TYPES[key].id === id) return key;
      }
      return 'ALPHA';
    }

    /**
     * Place a node and calculate tactical outcomes
     */
    placeNode(r, c, nodeTypeId, owner = 'player', options = {}) {
      const validation = this.isValidMove(r, c, nodeTypeId, owner);
      if (!validation.valid && !options.force) {
        this.perfectDeductions = false;
        return { success: false, ...validation };
      }

      this.saveSnapshot();
      const cell = this.getCell(r, c);
      const wasEmpty = !cell.node;

      // Assign node
      cell.node = {
        type: nodeTypeId,
        owner: owner,
        locked: options.locked || false,
        placedAt: Date.now()
      };
      cell.owner = owner;

      if (!options.freeMove) {
        this.movesRemaining = Math.max(0, this.movesRemaining - 1);
        this.movesMade += 1;
      }

      // Base move points
      let moveScore = 60;
      const events = [];

      // Check special cell triggers
      if (cell.type === CELL_TYPES.CORE && !cell.coreCaptured) {
        cell.coreCaptured = true;
        this.coresCaptured += 1;
        moveScore += 300;
        this.movesRemaining += 1; // Bonus move
        events.push({ type: 'core_capture', row: r, col: c, bonusMove: 1 });
      }

      if (cell.type === CELL_TYPES.VORTEX) {
        moveScore += 150;
        events.push({ type: 'vortex_pulse', row: r, col: c });
      }

      // Check for harmonic circuit completions
      const circuitResults = this.checkCircuits(r, c, owner);
      if (circuitResults.completedCircuits > 0) {
        this.combo = Math.min(5, this.combo + circuitResults.completedCircuits);
        if (this.combo > this.maxCombo) this.maxCombo = this.combo;
        const circuitBonus = circuitResults.completedCircuits * 400 * this.combo;
        moveScore += circuitBonus;
        this.circuitsCompleted += circuitResults.completedCircuits;
        this.movesRemaining += circuitResults.bonusMoves;
        events.push({
          type: 'circuit_resonance',
          count: circuitResults.completedCircuits,
          bonus: circuitBonus,
          bonusMoves: circuitResults.bonusMoves,
          circuits: circuitResults.circuits
        });
      } else {
        // Combo decays gently if no circuit completed
        if (this.combo > 1 && !options.maintainCombo) {
          this.combo = Math.max(1, this.combo - 0.5);
        }
      }

      // Apply multiplier
      const finalGain = Math.round(moveScore * (options.overcharged ? 2 : 1) * Math.floor(this.combo));
      this.score += finalGain;

      // Recalculate board influence
      this.updateInfluence();

      return {
        success: true,
        scoreGain: finalGain,
        combo: Math.floor(this.combo),
        movesRemaining: this.movesRemaining,
        events: events
      };
    }

    /**
     * Detects completed 2x2 sectors or rows/columns containing all 4 unique frequencies
     */
    checkCircuits(r, c, owner) {
      let completedCircuits = 0;
      let bonusMoves = 0;
      const circuits = [];

      // 1. Check Sector completion (all 4 cells in 2x2 filled with 4 distinct nodes)
      const cell = this.getCell(r, c);
      const sectorCells = this.getSectorCells(cell.sector);
      const sectorTypes = new Set();
      let sectorFull = true;

      for (const sc of sectorCells) {
        if (!sc.node) {
          sectorFull = false;
          break;
        }
        sectorTypes.add(sc.node.type);
      }

      if (sectorFull && sectorTypes.size === 4 && !this.isSectorCircuitClaimed(cell.sector)) {
        completedCircuits += 1;
        bonusMoves += 1;
        this.markSectorCircuitClaimed(cell.sector, owner);
        circuits.push({ type: 'sector', index: cell.sector, cells: sectorCells });
      }

      // 2. Check Row Harmony (any segment of 4 consecutive distinct nodes)
      const rowHarmony = this.checkLineHarmony(this.grid[r], owner, `row_${r}`);
      if (rowHarmony.harmonized) {
        completedCircuits += rowHarmony.count;
        bonusMoves += rowHarmony.count;
        circuits.push(...rowHarmony.circuits);
      }

      // 3. Check Col Harmony (any segment of 4 consecutive distinct nodes)
      const colCells = [];
      for (let i = 0; i < this.size; i++) colCells.push(this.grid[i][c]);
      const colHarmony = this.checkLineHarmony(colCells, owner, `col_${c}`);
      if (colHarmony.harmonized) {
        completedCircuits += colHarmony.count;
        bonusMoves += colHarmony.count;
        circuits.push(...colHarmony.circuits);
      }

      return { completedCircuits, bonusMoves, circuits };
    }

    checkLineHarmony(cells, owner, lineId) {
      let count = 0;
      const circuits = [];
      for (let i = 0; i <= cells.length - 4; i++) {
        const slice = cells.slice(i, i + 4);
        const types = new Set();
        let allFilled = true;
        for (const cl of slice) {
          if (!cl.node) {
            allFilled = false;
            break;
          }
          types.add(cl.node.type);
        }
        const sliceId = `${lineId}_${i}`;
        if (allFilled && types.size === 4 && !this._claimedHarmonies?.has(sliceId)) {
          this._claimedHarmonies = this._claimedHarmonies || new Set();
          this._claimedHarmonies.add(sliceId);
          count++;
          circuits.push({ type: 'line', sliceId, cells: slice });
        }
      }
      return { harmonized: count > 0, count, circuits };
    }

    isSectorCircuitClaimed(secIdx) {
      this._claimedSectors = this._claimedSectors || new Set();
      return this._claimedSectors.has(secIdx);
    }

    markSectorCircuitClaimed(secIdx, owner) {
      this._claimedSectors = this._claimedSectors || new Set();
      this._claimedSectors.add(secIdx);
      // Give owner dominance over the entire sector
      const cells = this.getSectorCells(secIdx);
      cells.forEach(c => {
        c.owner = owner;
        if (c.node) c.node.locked = true;
      });
    }

    getSectorCells(secIdx) {
      const sr = Math.floor(secIdx / 4) * 2;
      const sc = (secIdx % 4) * 2;
      return [
        this.getCell(sr, sc),
        this.getCell(sr, sc + 1),
        this.getCell(sr + 1, sc),
        this.getCell(sr + 1, sc + 1)
      ].filter(Boolean);
    }

    getOrthogonalNeighbors(r, c) {
      const coords = [
        [r - 1, c],
        [r + 1, c],
        [r, c - 1],
        [r, c + 1]
      ];
      return coords.map(([nr, nc]) => this.getCell(nr, nc)).filter(Boolean);
    }

    getAllNeighbors(r, c) {
      const neighbors = [];
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const cell = this.getCell(r + dr, c + dc);
          if (cell) neighbors.push(cell);
        }
      }
      return neighbors;
    }

    /**
     * Computes territory control and radiating influence across the grid
     */
    updateInfluence() {
      // Reset influence
      for (let r = 0; r < this.size; r++) {
        for (let c = 0; c < this.size; c++) {
          this.grid[r][c].influence.player = 0;
          this.grid[r][c].influence.ai = 0;
        }
      }

      // Propagate influence from active nodes and cores
      for (let r = 0; r < this.size; r++) {
        for (let c = 0; c < this.size; c++) {
          const cell = this.grid[r][c];
          if (cell.node) {
            const side = cell.node.owner;
            if (side === 'player' || side === 'ai') {
              cell.influence[side] += 3;
              // Orthogonal influence
              this.getOrthogonalNeighbors(r, c).forEach(n => {
                n.influence[side] += 2;
              });
              // Diagonal influence
              const diagonals = [
                this.getCell(r - 1, c - 1),
                this.getCell(r - 1, c + 1),
                this.getCell(r + 1, c - 1),
                this.getCell(r + 1, c + 1)
              ].filter(Boolean);
              diagonals.forEach(d => {
                d.influence[side] += 1;
              });

              // Vortex multiplier
              if (cell.type === CELL_TYPES.VORTEX) {
                diagonals.forEach(d => { d.influence[side] += 2; });
              }
            }
          }

          // Core captured radiates permanent quadrant influence
          if (cell.type === CELL_TYPES.CORE && cell.coreCaptured && cell.owner) {
            const quadCells = this.getQuadrantCells(cell.quadrant);
            quadCells.forEach(qc => {
              qc.influence[cell.owner] += 2;
            });
          }
        }
      }

      // Update ownership of un-nodded cells based on influence dominance
      for (let r = 0; r < this.size; r++) {
        for (let c = 0; c < this.size; c++) {
          const cell = this.grid[r][c];
          if (!cell.node) {
            if (cell.influence.player > cell.influence.ai + 1) {
              cell.owner = 'player';
            } else if (cell.influence.ai > cell.influence.player + 1) {
              cell.owner = 'ai';
            } else {
              cell.owner = null;
            }
          }
        }
      }
    }

    getQuadrantCells(quadIdx) {
      const qr = Math.floor(quadIdx / 2) * 4;
      const qc = (quadIdx % 2) * 4;
      const cells = [];
      for (let r = qr; r < qr + 4; r++) {
        for (let c = qc; c < qc + 4; c++) {
          const cell = this.getCell(r, c);
          if (cell) cells.push(cell);
        }
      }
      return cells;
    }

    /**
     * Returns territory stats for both sides
     */
    getTerritoryStats() {
      let playerCells = 0;
      let aiCells = 0;
      let neutralCells = 0;
      let playableTotal = 0;

      for (let r = 0; r < this.size; r++) {
        for (let c = 0; c < this.size; c++) {
          const cell = this.grid[r][c];
          if (cell.type === CELL_TYPES.VOID) continue;
          playableTotal++;
          if (cell.owner === 'player') playerCells++;
          else if (cell.owner === 'ai') aiCells++;
          else neutralCells++;
        }
      }

      return {
        playerCells,
        aiCells,
        neutralCells,
        playableTotal,
        playerPercent: playableTotal > 0 ? Math.round((playerCells / playableTotal) * 100) : 0,
        aiPercent: playableTotal > 0 ? Math.round((aiCells / playableTotal) * 100) : 0
      };
    }

    /**
     * Tactical Scan ability: finds valid high-yield placement coordinates
     */
    findTacticalMoves(owner = 'player') {
      const tacticalMoves = [];

      for (let r = 0; r < this.size; r++) {
        for (let c = 0; c < this.size; c++) {
          const cell = this.getCell(r, c);
          if (cell.type === CELL_TYPES.VOID || cell.node) continue;
          if (cell.type === CELL_TYPES.FIREWALL && !cell.firewallBypassed) continue;

          for (let typeId = 1; typeId <= 4; typeId++) {
            const check = this.isValidMove(r, c, typeId, owner);
            if (check.valid) {
              // Heuristic value
              let value = 10;
              if (cell.type === CELL_TYPES.CORE) value += 80;
              if (cell.type === CELL_TYPES.VORTEX) value += 40;
              // Center control
              const centerDist = Math.abs(r - 3.5) + Math.abs(c - 3.5);
              value += (7 - centerDist) * 3;
              tacticalMoves.push({ row: r, col: c, nodeType: typeId, value });
            }
          }
        }
      }

      tacticalMoves.sort((a, b) => b.value - a.value);
      return tacticalMoves;
    }

    /**
     * EMP purge ability: removes a firewall or opponent cell
     */
    purgeCell(r, c) {
      const cell = this.getCell(r, c);
      if (!cell) return false;
      if (cell.type === CELL_TYPES.FIREWALL) {
        cell.firewallBypassed = true;
        cell.type = CELL_TYPES.EMPTY;
        return true;
      }
      if (cell.type === CELL_TYPES.GLITCH) {
        cell.type = CELL_TYPES.EMPTY;
        return true;
      }
      if (cell.node && !cell.isPreplaced) {
        cell.node = null;
        cell.owner = null;
        this.updateInfluence();
        return true;
      }
      return false;
    }
  }

  // Export to global
  global.Pseudoko = global.Pseudoko || {};
  global.Pseudoko.Board = PseudokoBoard;
  global.Pseudoko.NODE_TYPES = NODE_TYPES;
  global.Pseudoko.CELL_TYPES = CELL_TYPES;
  global.Pseudoko.GRID_SIZE = GRID_SIZE;

})(typeof window !== 'undefined' ? window : global);

