/**
 * InfinityPlay - Chess UI Coordinator & HUD Controller
 * Manages timers, player cards, captured piece trays, move history list,
 * chat feed, modals (promotion, game over, room join/create), and theme changes.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ChessUI = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {

  class ChessUI {
    constructor(elements = {}) {
      this.els = elements;
      this.timers = { w: 0, b: 0 };
      this.timerInterval = null;
      this.activeTurn = 'w';
      this.onPromotionSelect = null;
      this.onRematchClick = null;
      this.onNewGameClick = null;
    }

    /**
     * Format milliseconds into mm:ss or mm:ss.s
     */
    formatTime(ms) {
      if (ms <= 0) return '00:00';
      const totalSec = Math.floor(ms / 1000);
      const mins = Math.floor(totalSec / 60);
      const secs = totalSec % 60;
      return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    /**
     * Set Clocks
     */
    setClocks(whiteMs, blackMs, activeTurn = null) {
      this.timers.w = Math.max(0, whiteMs);
      this.timers.b = Math.max(0, blackMs);
      if (activeTurn) this.activeTurn = activeTurn;
      this.renderClocks();
    }

    renderClocks() {
      const wEl = document.getElementById('whiteTimerDisplay');
      const bEl = document.getElementById('blackTimerDisplay');

      if (wEl) {
        wEl.textContent = this.formatTime(this.timers.w);
        if (this.timers.w < 15000 && this.timers.w > 0) {
          wEl.classList.add('low-time');
        } else {
          wEl.classList.remove('low-time');
        }
      }

      if (bEl) {
        bEl.textContent = this.formatTime(this.timers.b);
        if (this.timers.b < 15000 && this.timers.b > 0) {
          bEl.classList.add('low-time');
        } else {
          bEl.classList.remove('low-time');
        }
      }

      // Highlight active turn on player cards
      const wCard = document.getElementById('playerCardWhite');
      const bCard = document.getElementById('playerCardBlack');
      if (wCard && bCard) {
        if (this.activeTurn === 'w') {
          wCard.classList.add('active-turn');
          bCard.classList.remove('active-turn');
        } else {
          bCard.classList.add('active-turn');
          wCard.classList.remove('active-turn');
        }
      }
    }

    /**
     * Update Player Card details
     */
    updatePlayerCards(whitePlayer, blackPlayer) {
      // White Player
      if (whitePlayer) {
        const nameEl = document.getElementById('whitePlayerName');
        const eloEl = document.getElementById('whitePlayerElo');
        const avatarEl = document.getElementById('whitePlayerAvatar');

        if (nameEl) nameEl.textContent = whitePlayer.name || 'White';
        if (eloEl) eloEl.textContent = `${whitePlayer.elo || 1200} ELO`;
        if (avatarEl) {
          if (whitePlayer.avatar && whitePlayer.avatar.includes('/')) {
            avatarEl.innerHTML = `<img src="${whitePlayer.avatar}" alt="${whitePlayer.name}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
          } else {
            avatarEl.textContent = (whitePlayer.avatar || whitePlayer.name || 'W').charAt(0).toUpperCase();
          }
        }
      }

      // Black Player
      if (blackPlayer) {
        const nameEl = document.getElementById('blackPlayerName');
        const eloEl = document.getElementById('blackPlayerElo');
        const avatarEl = document.getElementById('blackPlayerAvatar');

        if (nameEl) nameEl.textContent = blackPlayer.name || 'Black';
        if (eloEl) eloEl.textContent = `${blackPlayer.elo || 1200} ELO`;
        if (avatarEl) {
          if (blackPlayer.avatar && blackPlayer.avatar.includes('/')) {
            avatarEl.innerHTML = `<img src="${blackPlayer.avatar}" alt="${blackPlayer.name}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
          } else {
            avatarEl.textContent = (blackPlayer.avatar || blackPlayer.name || 'B').charAt(0).toUpperCase();
          }
        }
      }
    }

    /**
     * Update Captured Pieces tray & advantage badge
     */
    updateCapturedPieces(capturedWhite, capturedBlack, materialDiff = 0) {
      const SYMBOLS = {
        p: '♟', n: '♞', b: '♝', r: '♜', q: '♛'
      };

      const wTray = document.getElementById('whiteCapturedTray');
      const bTray = document.getElementById('blackCapturedTray');
      const wDiff = document.getElementById('whiteAdvantageBadge');
      const bDiff = document.getElementById('blackAdvantageBadge');

      if (wTray) {
        wTray.innerHTML = (capturedWhite || []).map(p => `<span>${SYMBOLS[p] || p}</span>`).join('');
      }
      if (bTray) {
        bTray.innerHTML = (capturedBlack || []).map(p => `<span>${SYMBOLS[p] || p}</span>`).join('');
      }

      if (wDiff && bDiff) {
        if (materialDiff > 0) {
          wDiff.textContent = `+${materialDiff}`;
          wDiff.style.display = 'inline-block';
          bDiff.style.display = 'none';
        } else if (materialDiff < 0) {
          bDiff.textContent = `+${Math.abs(materialDiff)}`;
          bDiff.style.display = 'inline-block';
          wDiff.style.display = 'none';
        } else {
          wDiff.style.display = 'none';
          bDiff.style.display = 'none';
        }
      }
    }

    /**
     * Update Move History Table
     */
    updateMoveHistory(history, onMoveClick = null) {
      const container = document.getElementById('moveHistoryList');
      if (!container) return;

      if (!history || history.length === 0) {
        container.innerHTML = `<div class="empty-history">Game started. Waiting for first move...</div>`;
        return;
      }

      let html = '';
      for (let i = 0; i < history.length; i += 2) {
        const turnNum = Math.floor(i / 2) + 1;
        const moveW = history[i];
        const moveB = history[i + 1];

        html += `
          <div class="move-history-row">
            <span class="move-turn-num">${turnNum}.</span>
            <span class="move-item ${i === history.length - 1 ? 'active' : ''}" data-index="${i}">${moveW ? moveW.san : ''}</span>
            <span class="move-item ${i + 1 === history.length - 1 ? 'active' : ''}" data-index="${i + 1}">${moveB ? moveB.san : ''}</span>
          </div>
        `;
      }

      container.innerHTML = html;
      container.scrollTop = container.scrollHeight;

      if (onMoveClick) {
        container.querySelectorAll('.move-item').forEach(item => {
          item.addEventListener('click', () => {
            const idx = parseInt(item.dataset.index, 10);
            onMoveClick(idx);
          });
        });
      }
    }

    /**
     * In-Game Chat Feed
     */
    addChatMessage(chat) {
      const container = document.getElementById('chatMessagesContainer');
      if (!container) return;

      const emptyEl = container.querySelector('.empty-chat');
      if (emptyEl) emptyEl.remove();

      const timeStr = new Date(chat.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const isSystem = !!chat.isSystem;

      const item = document.createElement('div');
      item.className = `chat-msg ${isSystem ? 'system-msg' : (chat.senderColor === 'w' ? 'white-msg' : 'black-msg')}`;
      item.innerHTML = `
        <div class="chat-meta">
          <span class="chat-sender">${chat.sender}</span>
          <span class="chat-time">${timeStr}</span>
        </div>
        <div class="chat-body">
          ${chat.emoji ? `<span class="chat-emoji">${chat.emoji}</span> ` : ''}
          <span>${chat.message || ''}</span>
        </div>
      `;

      container.appendChild(item);
      container.scrollTop = container.scrollHeight;
    }

    /**
     * Show Pawn Promotion Modal
     */
    showPromotionModal(color, onSelect) {
      this.onPromotionSelect = onSelect;
      const modal = document.getElementById('promotionModal');
      if (!modal) return;

      const piecesContainer = modal.querySelector('.promo-choices');
      if (piecesContainer) {
        const promoPieces = ['q', 'r', 'b', 'n'];
        const SYMBOLS = {
          w: { q: '♕', r: '♖', b: '♗', n: '♘' },
          b: { q: '♛', r: '♜', b: '♝', n: '♞' }
        };

        piecesContainer.innerHTML = promoPieces.map(type => `
          <button class="promo-choice-btn" data-type="${type}">
            <span class="promo-symbol">${SYMBOLS[color][type]}</span>
            <span class="promo-label">${type === 'q' ? 'Queen' : type === 'r' ? 'Rook' : type === 'b' ? 'Bishop' : 'Knight'}</span>
          </button>
        `).join('');

        piecesContainer.querySelectorAll('.promo-choice-btn').forEach(btn => {
          btn.onclick = () => {
            modal.classList.remove('active');
            if (this.onPromotionSelect) {
              this.onPromotionSelect(btn.dataset.type);
            }
          };
        });
      }

      modal.classList.add('active');
    }

    /**
     * Show Game Over Modal
     */
    showGameOverModal(result, playerStats = null) {
      const modal = document.getElementById('gameOverModal');
      if (!modal) return;

      const titleEl = document.getElementById('gameOverTitle');
      const subtitleEl = document.getElementById('gameOverSubtitle');
      const reasonEl = document.getElementById('gameOverReason');
      const eloBadge = document.getElementById('gameOverEloChange');

      const isWin = result.isWin;
      const isLoss = result.isLoss;
      const isDraw = result.isDraw;

      if (isWin) {
        if (titleEl) titleEl.textContent = '🏆 VICTORY!';
        if (subtitleEl) subtitleEl.textContent = 'Outstanding tactical strategy!';
        if (titleEl) titleEl.style.color = 'var(--color-gold)';
      } else if (isLoss) {
        if (titleEl) titleEl.textContent = '⚔ DEFEAT';
        if (subtitleEl) subtitleEl.textContent = 'Hard fought battle!';
        if (titleEl) titleEl.style.color = '#f87171';
      } else {
        if (titleEl) titleEl.textContent = '🤝 STALEMATE / DRAW';
        if (subtitleEl) subtitleEl.textContent = 'Honorable split point.';
        if (titleEl) titleEl.style.color = 'var(--color-cyan)';
      }

      if (reasonEl) {
        reasonEl.textContent = `Result: ${result.reason ? result.reason.replace(/_/g, ' ').toUpperCase() : 'GAME OVER'}`;
      }

      if (eloBadge && result.eloChange !== undefined) {
        const delta = result.eloChange;
        eloBadge.textContent = delta >= 0 ? `+${delta} ELO` : `${delta} ELO`;
        eloBadge.className = `elo-change-badge ${delta >= 0 ? 'gain' : 'loss'}`;
      }

      modal.classList.add('active');
    }

    hideGameOverModal() {
      const modal = document.getElementById('gameOverModal');
      if (modal) modal.classList.remove('active');
    }

    /**
     * Show Draw Offer Prompt Modal
     */
    showDrawOfferModal(byColor, onRespond) {
      const modal = document.getElementById('drawOfferModal');
      if (!modal) return;

      const textEl = modal.querySelector('.draw-offer-text');
      if (textEl) {
        textEl.textContent = `Your opponent (${byColor === 'w' ? 'White' : 'Black'}) has offered a draw.`;
      }

      const acceptBtn = document.getElementById('drawAcceptBtn');
      const declineBtn = document.getElementById('drawDeclineBtn');

      if (acceptBtn) {
        acceptBtn.onclick = () => {
          modal.classList.remove('active');
          onRespond(true);
        };
      }
      if (declineBtn) {
        declineBtn.onclick = () => {
          modal.classList.remove('active');
          onRespond(false);
        };
      }

      modal.classList.add('active');
    }

    /**
     * Show Toast Message
     */
    showToast(message, type = 'info') {
      let toastContainer = document.getElementById('chessToastContainer');
      if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'chessToastContainer';
        toastContainer.className = 'chess-toast-container';
        document.body.appendChild(toastContainer);
      }

      const toast = document.createElement('div');
      toast.className = `chess-toast toast-${type}`;
      toast.innerHTML = `
        <span class="toast-icon">${type === 'success' ? '✔' : type === 'warning' ? '⚠' : 'ℹ'}</span>
        <span class="toast-text">${message}</span>
      `;

      toastContainer.appendChild(toast);
      setTimeout(() => toast.classList.add('show'), 10);
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 3500);
    }
  }

  return ChessUI;
}));

