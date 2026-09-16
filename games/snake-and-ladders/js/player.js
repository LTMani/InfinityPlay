/**
 * Snake & Ladders - Player & Token Manager
 * Manages player state, token visual representations, and multi-token positioning.
 */

(function() {
  'use strict';

  const DEFAULT_TOKENS = [
    {
      id: 'p1',
      name: 'Player 1',
      colorName: 'ruby',
      color: '#ef4444',
      glow: 'rgba(239, 68, 68, 0.6)',
      symbol: '🔴',
      svgShape: 'circle',
      isAI: false
    },
    {
      id: 'p2',
      name: 'Player 2',
      colorName: 'cyan',
      color: '#06b6d4',
      glow: 'rgba(6, 182, 212, 0.6)',
      symbol: '🔷',
      svgShape: 'diamond',
      isAI: true
    },
    {
      id: 'p3',
      name: 'Player 3',
      colorName: 'gold',
      color: '#f59e0b',
      glow: 'rgba(245, 158, 11, 0.6)',
      symbol: '⭐',
      svgShape: 'star',
      isAI: true
    },
    {
      id: 'p4',
      name: 'Player 4',
      colorName: 'emerald',
      color: '#10b981',
      glow: 'rgba(16, 185, 129, 0.6)',
      symbol: '🛡️',
      svgShape: 'shield',
      isAI: true
    }
  ];

  class Player {
    constructor(config) {
      this.id = config.id || 'p1';
      this.name = config.name || 'Player';
      this.colorName = config.colorName || 'ruby';
      this.color = config.color || '#ef4444';
      this.glow = config.glow || 'rgba(239, 68, 68, 0.6)';
      this.symbol = config.symbol || '🔴';
      this.svgShape = config.svgShape || 'circle';
      this.isAI = !!config.isAI;
      this.position = typeof config.position === 'number' ? config.position : 0; // 0 = start yard
      this.stats = config.stats || {
        rolls: 0,
        snakesHit: 0,
        laddersHit: 0,
        turnsTaken: 0,
        highestPos: 0
      };
      this.tokenEl = null;
    }

    createTokenElement() {
      const el = document.createElement('div');
      el.className = `player-token token-${this.colorName}`;
      el.id = `token-${this.id}`;
      el.title = `${this.name} (${this.isAI ? 'AI' : 'Human'})`;
      el.setAttribute('data-player-id', this.id);

      el.innerHTML = `
        <div class="token-pin" style="--token-color: ${this.color}; --token-glow: ${this.glow};">
          <span class="token-glyph">${this.symbol}</span>
        </div>
      `;

      this.tokenEl = el;
      return el;
    }

    reset() {
      this.position = 0;
      this.stats = {
        rolls: 0,
        snakesHit: 0,
        laddersHit: 0,
        turnsTaken: 0,
        highestPos: 0
      };
    }
  }

  class PlayerManager {
    constructor() {
      this.players = [];
      this.tokenPresets = DEFAULT_TOKENS;
    }

    /**
     * Initializes players according to game mode and setup configuration.
     */
    setupPlayers(configs) {
      this.players = configs.map(cfg => new Player(cfg));
      return this.players;
    }

    getPlayers() {
      return this.players;
    }

    getPlayer(id) {
      return this.players.find(p => p.id === id);
    }

    /**
     * Updates all player tokens on the board, clustering tokens if they share a cell.
     */
    updateAllTokenPositions() {
      // Clear tokens from all slots
      document.querySelectorAll('.cell-token-slot, .start-token-slot').forEach(slot => {
        slot.innerHTML = '';
      });

      // Group players by position
      const posMap = {};
      this.players.forEach(p => {
        const pos = p.position;
        if (!posMap[pos]) posMap[pos] = [];
        posMap[pos].push(p);
      });

      // Render tokens into appropriate slots with offsets
      Object.entries(posMap).forEach(([posStr, group]) => {
        const pos = parseInt(posStr, 10);
        let targetSlot;

        if (pos === 0) {
          targetSlot = document.getElementById('startYardSlot');
        } else {
          targetSlot = document.getElementById(`slot-cell-${pos}`);
        }

        if (!targetSlot) return;

        group.forEach((player, idx) => {
          let tokenEl = player.tokenEl;
          if (!tokenEl) {
            tokenEl = player.createTokenElement();
          }

          // Compute cluster offset if multiple players share the cell
          tokenEl.style.position = 'relative';
          if (group.length > 1 && pos > 0) {
            const offsets = [
              { x: -6, y: -6 },
              { x: 6, y: -6 },
              { x: -6, y: 6 },
              { x: 6, y: 6 }
            ];
            const off = offsets[idx % offsets.length];
            tokenEl.style.transform = `translate(${off.x}px, ${off.y}px) scale(0.85)`;
            tokenEl.style.zIndex = 10 + idx;
          } else {
            tokenEl.style.transform = 'translate(0px, 0px) scale(1)';
            tokenEl.style.zIndex = 10;
          }

          targetSlot.appendChild(tokenEl);
        });
      });
    }

    /**
     * Highlights the active player's token.
     */
    setActivePlayer(activePlayerId) {
      this.players.forEach(p => {
        if (p.tokenEl) {
          if (p.id === activePlayerId) {
            p.tokenEl.classList.add('token-active');
          } else {
            p.tokenEl.classList.remove('token-active');
          }
        }
      });
    }
  }

  window.SNPlayerManager = new PlayerManager();
  window.SNPlayer = Player;
  window.DEFAULT_TOKENS = DEFAULT_TOKENS;
})();
