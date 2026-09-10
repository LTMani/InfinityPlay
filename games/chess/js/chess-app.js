/**
 * InfinityPlay - Chess Grandmaster Master Application Coordinator
 * Connects Rules Engine, AI, Web Audio Synthesizer, Responsive Board,
 * Real-Time Multiplayer, Clocks, Daily Puzzles, Match Replay, and Platform Profile.
 */

(function() {
  const App = {
    mode: 'single', // 'single' | 'multiplayer' | 'puzzle' | 'replay'
    difficulty: 'medium', // 'easy' | 'medium' | 'hard' | 'expert'
    timeControlKey: 'rapid_10',
    playerColor: 'w', // 'w' or 'b'
    isAIThinking: false,

    async init() {
      // 1. Instantiate modules
      this.engine = new window.ChessEngine();
      this.ai = new window.ChessAI();
      this.audio = new window.ChessAudio();
      this.stats = new window.ChessStats();
      this.puzzles = new window.ChessPuzzles();
      this.replay = new window.ChessReplay(window.ChessEngine);
      this.socket = new window.ChessSocketClient();
      this.ui = new window.ChessUI();

      // 2. Load Current Platform User
      this.loadPlatformUser();

      // 3. Initialize Board
      const boardContainer = document.getElementById('chessBoardContainer');
      this.board = new window.ChessBoard(boardContainer, {
        orientation: this.playerColor,
        boardTheme: localStorage.getItem('infinityplay_chess_board_theme') || 'cyber',
        pieceTheme: localStorage.getItem('infinityplay_chess_piece_theme') || 'neo',
        onMove: (move) => this.handlePlayerMove(move)
      });

      // 4. Bind UI Controls, Tabs & Modals
      this.bindControls();
      this.bindTabs();
      this.bindSocketEvents();
      this.bindThemeSettings();

      // 5. Check URL parameters (e.g. ?room=KNG-739 or ?mode=puzzle)
      const params = new URLSearchParams(window.location.search);
      const roomParam = params.get('room');
      const modeParam = params.get('mode');

      if (roomParam) {
        this.switchMode('multiplayer');
        this.joinRoomByCode(roomParam);
      } else if (modeParam === 'puzzle') {
        this.switchMode('puzzle');
        this.startDailyPuzzle();
      } else {
        // Start default Single Player game
        this.startSinglePlayerGame();
      }

      // 6. Check for active reconnectable session
      if (this.socket.hasActiveSession() && !roomParam) {
        this.ui.showToast('Resuming active multiplayer match...', 'info');
        this.socket.attemptReconnect();
      }

      console.log('⚡ Chess Grandmaster initialized successfully.');
    },

    loadPlatformUser() {
      try {
        const raw = localStorage.getItem('infinityplay_current_user');
        if (raw) {
          this.currentUser = JSON.parse(raw);
        }
      } catch (e) {}

      if (!this.currentUser) {
        this.currentUser = {
          id: 'user_tharun',
          name: 'Tharun',
          avatar: 'T',
          elo: 2150
        };
      }

      const stats = this.stats.getStats();
      this.currentUser.elo = stats.elo;
    },

    /**
     * Start Single Player vs AI
     */
    startSinglePlayerGame() {
      this.mode = 'single';
      this.engine.reset();
      this.board.setLastMove(null, null);
      this.board.setOrientation(this.playerColor);

      const tcMap = {
        bullet_1: 60 * 1000,
        blitz_3: 180 * 1000,
        blitz_5: 300 * 1000,
        rapid_10: 600 * 1000,
        rapid_15: 900 * 1000,
        classical_30: 1800 * 1000
      };

      const durationMs = tcMap[this.timeControlKey] || (10 * 60 * 1000);
      this.ui.setClocks(durationMs, durationMs, 'w');

      const opponentName = `${this.difficulty.toUpperCase()} AI`;
      const opponentElo = this.difficulty === 'easy' ? 950 : (this.difficulty === 'medium' ? 1450 : (this.difficulty === 'hard' ? 1850 : 2250));

      const whiteInfo = this.playerColor === 'w' 
        ? { name: this.currentUser.name, avatar: this.currentUser.avatar, elo: this.currentUser.elo }
        : { name: opponentName, avatar: '🤖', elo: opponentElo };

      const blackInfo = this.playerColor === 'w'
        ? { name: opponentName, avatar: '🤖', elo: opponentElo }
        : { name: this.currentUser.name, avatar: this.currentUser.avatar, elo: this.currentUser.elo };

      this.ui.updatePlayerCards(whiteInfo, blackInfo);
      this.ui.updateCapturedPieces([], [], 0);
      this.ui.updateMoveHistory([]);
      this.board.render(this.engine);
      this.audio.play('gameStart');

      this.startLocalTimer();

      // If player is Black, AI moves first as White
      if (this.playerColor === 'b') {
        setTimeout(() => this.triggerAIMove(), 500);
      }
    },

    startLocalTimer() {
      if (this.localTimerInterval) clearInterval(this.localTimerInterval);

      let lastTick = Date.now();
      this.localTimerInterval = setInterval(() => {
        if (this.engine.isGameOver()) {
          clearInterval(this.localTimerInterval);
          return;
        }

        const now = Date.now();
        const elapsed = now - lastTick;
        lastTick = now;

        const turn = this.engine.turn;
        this.ui.timers[turn] = Math.max(0, this.ui.timers[turn] - elapsed);
        this.ui.renderClocks();

        // Low time alert
        if (this.ui.timers[turn] < 15000 && this.ui.timers[turn] > 0 && Math.floor(now / 1000) % 2 === 0) {
          this.audio.play('timerAlert');
        }

        if (this.ui.timers[turn] <= 0) {
          clearInterval(this.localTimerInterval);
          const winner = turn === 'w' ? 'b' : 'w';
          this.handleGameOver(winner, 'timeout');
        }
      }, 500);
    },

    /**
     * Handle Move Execution from Board
     */
    async handlePlayerMove(moveInput) {
      if (this.mode === 'single') {
        // Only allow move on player's turn
        if (this.engine.turn !== this.playerColor || this.isAIThinking) {
          this.audio.play('illegal');
          return;
        }

        // Check if pawn promotion needed
        const fromPiece = this.engine.get(moveInput.from);
        const toRank = moveInput.to.charAt(1);
        if (fromPiece && fromPiece.type === 'p' && (toRank === '8' || toRank === '1') && !moveInput.promotion) {
          this.ui.showPromotionModal(this.playerColor, (chosenType) => {
            this.executeSinglePlayerMove({ ...moveInput, promotion: chosenType });
          });
          return;
        }

        this.executeSinglePlayerMove(moveInput);
      } else if (this.mode === 'multiplayer') {
        if (this.engine.turn !== this.socket.playerColor) {
          this.audio.play('illegal');
          return;
        }

        // Check pawn promotion
        const fromPiece = this.engine.get(moveInput.from);
        const toRank = moveInput.to.charAt(1);
        if (fromPiece && fromPiece.type === 'p' && (toRank === '8' || toRank === '1') && !moveInput.promotion) {
          this.ui.showPromotionModal(this.socket.playerColor, (chosenType) => {
            this.sendMultiplayerMove({ ...moveInput, promotion: chosenType });
          });
          return;
        }

        this.sendMultiplayerMove(moveInput);
      } else if (this.mode === 'puzzle') {
        this.handlePuzzleMove(moveInput);
      }
    },

    executeSinglePlayerMove(moveInput) {
      const executed = this.engine.move(moveInput);
      if (!executed) {
        this.audio.play('illegal');
        return;
      }

      this.board.setLastMove(executed.from, executed.to);
      this.board.render(this.engine);
      this.playMoveSound(executed);

      this.ui.updateMoveHistory(this.engine.history);
      this.ui.updateCapturedPieces(
        this.engine.capturedPieces.w,
        this.engine.capturedPieces.b,
        this.engine.getMaterialDifference()
      );

      // Check for Game Over
      if (this.engine.isGameOver()) {
        if (this.engine.isCheckmate()) {
          const winner = this.engine.turn === 'w' ? 'b' : 'w';
          this.handleGameOver(winner, 'checkmate');
        } else {
          this.handleGameOver(null, this.engine.getDrawReason());
        }
        return;
      }

      // Trigger AI Response
      setTimeout(() => this.triggerAIMove(), 350);
    },

    async triggerAIMove() {
      if (this.engine.isGameOver()) return;

      this.isAIThinking = true;
      const statusEl = document.getElementById('aiThinkingIndicator');
      if (statusEl) statusEl.style.display = 'flex';

      try {
        const bestMove = await this.ai.getBestMove(this.engine, this.difficulty, (progress) => {
          const progressEl = document.getElementById('aiThinkingText');
          if (progressEl) progressEl.textContent = `AI calculating depth ${progress.depth}...`;
        });

        if (bestMove) {
          const executed = this.engine.move(bestMove);
          if (executed) {
            this.board.setLastMove(executed.from, executed.to);
            this.board.render(this.engine);
            this.playMoveSound(executed);

            this.ui.updateMoveHistory(this.engine.history);
            this.ui.updateCapturedPieces(
              this.engine.capturedPieces.w,
              this.engine.capturedPieces.b,
              this.engine.getMaterialDifference()
            );

            if (this.engine.isGameOver()) {
              if (this.engine.isCheckmate()) {
                const winner = this.engine.turn === 'w' ? 'b' : 'w';
                this.handleGameOver(winner, 'checkmate');
              } else {
                this.handleGameOver(null, this.engine.getDrawReason());
              }
            }
          }
        }
      } catch (err) {
        console.error('AI Error:', err);
      } finally {
        this.isAIThinking = false;
        if (statusEl) statusEl.style.display = 'none';
      }
    },

    playMoveSound(move) {
      if (this.engine.isCheckmate()) {
        this.audio.play('checkmate');
      } else if (this.engine.isCheck()) {
        this.audio.play('check');
      } else if (move.isCastling) {
        this.audio.play('castle');
      } else if (move.captured) {
        this.audio.play('capture');
      } else {
        this.audio.play('move');
      }
    },

    handleGameOver(winnerColor, reason) {
      if (this.localTimerInterval) clearInterval(this.localTimerInterval);

      const isWin = winnerColor === this.playerColor;
      const isLoss = winnerColor !== null && winnerColor !== this.playerColor;
      const isDraw = winnerColor === null;

      if (isWin) this.audio.play('victory');
      else if (isLoss) this.audio.play('defeat');
      else this.audio.play('draw');

      const outcome = isWin ? 'win' : (isLoss ? 'loss' : 'draw');
      const oppElo = this.difficulty === 'easy' ? 950 : (this.difficulty === 'medium' ? 1450 : (this.difficulty === 'hard' ? 1850 : 2250));

      const { delta } = this.stats.recordMatch(
        outcome,
        { name: `${this.difficulty.toUpperCase()} AI`, elo: oppElo },
        {
          timeControl: this.timeControlKey,
          reason,
          movesCount: this.engine.history.length,
          pgn: this.engine.pgn()
        }
      );

      this.ui.showGameOverModal({
        isWin,
        isLoss,
        isDraw,
        reason,
        eloChange: delta
      });
    },

    /**
     * Multiplayer Handlers
     */
    sendMultiplayerMove(moveInput) {
      const executed = this.engine.move(moveInput);
      if (!executed) {
        this.audio.play('illegal');
        return;
      }

      this.board.setLastMove(executed.from, executed.to);
      this.board.render(this.engine);
      this.playMoveSound(executed);

      this.ui.updateMoveHistory(this.engine.history);
      this.ui.updateCapturedPieces(
        this.engine.capturedPieces.w,
        this.engine.capturedPieces.b,
        this.engine.getMaterialDifference()
      );

      // Send to server
      this.socket.makeMove({
        from: executed.from,
        to: executed.to,
        promotion: executed.promotion,
        san: executed.san,
        fen: this.engine.fen(),
        isCheck: this.engine.isCheck(),
        isCheckmate: this.engine.isCheckmate(),
        isDraw: this.engine.isDraw(),
        drawReason: this.engine.getDrawReason()
      });
    },

    bindSocketEvents() {
      this.socket.on('room_created', (data) => {
        this.handleRoomJoined(data);
        this.ui.showToast(`Private room created! Code: ${data.roomId}`, 'success');
        const codeInput = document.getElementById('shareRoomCodeInput');
        if (codeInput) codeInput.value = data.roomId;
      });

      this.socket.on('room_joined', (data) => {
        this.handleRoomJoined(data);
        this.ui.showToast(`Joined room ${data.roomId}`, 'success');
      });

      this.socket.on('match_found', (data) => {
        this.handleRoomJoined(data);
        this.ui.showToast('Match found! Starting game...', 'success');
      });

      this.socket.on('game_started', (data) => {
        this.handleRoomStateUpdate(data.room);
        this.audio.play('gameStart');
        this.ui.showToast('Opponent joined! Game started.', 'success');
      });

      this.socket.on('move_made', (data) => {
        // If move was from opponent, apply to local engine
        if (data.move.player !== this.socket.playerColor) {
          this.engine.load(data.fen);
          this.board.setLastMove(data.move.from, data.move.to);
          this.board.render(this.engine);
          this.playMoveSound(data.move);

          this.ui.updateMoveHistory(this.engine.history);
          this.ui.updateCapturedPieces(
            this.engine.capturedPieces.w,
            this.engine.capturedPieces.b,
            this.engine.getMaterialDifference()
          );
        }

        this.ui.setClocks(data.clocks.w, data.clocks.b, data.turn);

        if (data.status === 'game_over') {
          this.handleMultiplayerGameOver(data.result);
        }
      });

      this.socket.on('draw_offered', (data) => {
        if (data.targetColor === this.socket.playerColor) {
          this.ui.showDrawOfferModal(data.byColor, (accept) => {
            this.socket.respondDraw(accept);
          });
        }
      });

      this.socket.on('draw_declined', () => {
        this.ui.showToast('Draw offer was declined.', 'warning');
      });

      this.socket.on('game_over', (data) => {
        this.handleMultiplayerGameOver(data.result);
      });

      this.socket.on('rematch_started', (data) => {
        this.handleRoomStateUpdate(data.room);
        this.ui.hideGameOverModal();
        this.audio.play('gameStart');
        this.ui.showToast('Rematch started! Colors swapped.', 'success');
      });

      this.socket.on('chat_message', (data) => {
        this.ui.addChatMessage(data.chat);
      });

      this.socket.on('player_disconnected', (data) => {
        this.ui.showToast(`${data.playerName} disconnected. Reconnect window: 60s.`, 'warning');
      });

      this.socket.on('reconnected_success', (data) => {
        this.handleRoomStateUpdate(data.room);
        this.ui.showToast('Reconnected to game successfully!', 'success');
      });
    },

    handleRoomJoined(data) {
      const room = data.room;
      this.engine.load(room.fen);
      this.playerColor = data.color === 'spectator' ? 'w' : data.color;
      this.board.setOrientation(this.playerColor);
      this.handleRoomStateUpdate(room);

      // Close room setup modal
      const modal = document.getElementById('multiplayerModal');
      if (modal) modal.classList.remove('active');
    },

    handleRoomStateUpdate(room) {
      this.engine.load(room.fen);
      this.ui.setClocks(room.clocks.w, room.clocks.b, room.turn);

      this.ui.updatePlayerCards(room.players.w, room.players.b);
      this.ui.updateMoveHistory(room.history);
      this.ui.updateCapturedPieces(
        this.engine.capturedPieces.w,
        this.engine.capturedPieces.b,
        this.engine.getMaterialDifference()
      );

      this.board.render(this.engine);
    },

    handleMultiplayerGameOver(result) {
      if (!result) return;
      const myColor = this.socket.playerColor;
      const isWin = result.winner === myColor;
      const isLoss = result.winner !== null && result.winner !== myColor;
      const isDraw = result.winner === null;

      if (isWin) this.audio.play('victory');
      else if (isLoss) this.audio.play('defeat');
      else this.audio.play('draw');

      const eloDelta = myColor === 'w' ? result.eloChange?.w : result.eloChange?.b;

      this.ui.showGameOverModal({
        isWin,
        isLoss,
        isDraw,
        reason: result.reason,
        eloChange: eloDelta
      });
    },

    joinRoomByCode(code) {
      this.socket.joinRoom(code, this.currentUser, false);
    },

    /**
     * Daily Puzzle Challenge Mode
     */
    startDailyPuzzle() {
      this.mode = 'puzzle';
      const puzzle = this.puzzles.getDailyPuzzle();
      this.engine.load(puzzle.fen);
      this.playerColor = puzzle.playerColor;

      this.board.setLastMove(null, null);
      this.board.setOrientation(this.playerColor);
      this.board.render(this.engine);

      const titleEl = document.getElementById('puzzleTitle');
      const descEl = document.getElementById('puzzleDesc');
      const hintTextEl = document.getElementById('puzzleHintText');

      if (titleEl) titleEl.textContent = puzzle.title;
      if (descEl) descEl.textContent = puzzle.description;
      if (hintTextEl) hintTextEl.textContent = '';

      this.ui.updatePlayerCards(
        { name: 'Daily Tactical Puzzle', avatar: '🧩', elo: puzzle.rating },
        { name: this.currentUser.name, avatar: this.currentUser.avatar, elo: this.currentUser.elo }
      );

      this.ui.showToast(`Daily Challenge: ${puzzle.title}`, 'info');
    },

    handlePuzzleMove(moveInput) {
      const puzzle = this.puzzles.getDailyPuzzle();
      const executed = this.engine.move(moveInput);
      if (!executed) {
        this.audio.play('illegal');
        return;
      }

      this.board.setLastMove(executed.from, executed.to);
      this.board.render(this.engine);
      this.playMoveSound(executed);

      const uciMove = `${executed.from}${executed.to}`;
      const checkRes = this.puzzles.checkMove(puzzle, executed.san, uciMove);

      if (checkRes.correct) {
        if (checkRes.finished) {
          this.audio.play('victory');
          this.ui.showToast(`🎉 Puzzle Solved! +${checkRes.xp} XP added!`, 'success');
        } else if (checkRes.reply) {
          // Play scripted opponent response
          setTimeout(() => {
            const oppMove = this.engine.move(checkRes.reply);
            if (oppMove) {
              this.board.setLastMove(oppMove.from, oppMove.to);
              this.board.render(this.engine);
              this.playMoveSound(oppMove);
              this.ui.showToast('Good move! Find the next continuation...', 'info');
            }
          }, 450);
        }
      } else {
        this.audio.play('illegal');
        this.ui.showToast('Incorrect move. Try again!', 'warning');
        setTimeout(() => {
          this.engine.undo();
          this.board.render(this.engine);
        }, 500);
      }
    },

    /**
     * Match Replay Mode
     */
    startMatchReplay(matchData = null) {
      this.mode = 'replay';
      const history = this.stats.getHistory();
      const targetMatch = matchData || history[0];

      if (!targetMatch) {
        this.ui.showToast('No completed matches in history to replay.', 'warning');
        return;
      }

      this.replay.onPositionChange = (info) => {
        this.engine.load(info.fen);
        if (info.move) {
          this.board.setLastMove(info.move.from, info.move.to);
        } else {
          this.board.setLastMove(null, null);
        }
        this.board.render(this.engine);

        const counterEl = document.getElementById('replayMoveCounter');
        if (counterEl) counterEl.textContent = `Move ${info.index} / ${info.total}`;

        const playBtn = document.getElementById('replayPlayPauseBtn');
        if (playBtn) playBtn.textContent = info.isPlaying ? '⏸ Pause' : '▶ Play';
      };

      this.replay.loadMatch(targetMatch);
      this.ui.showToast(`Replaying match vs ${targetMatch.opponent?.name || 'Opponent'}`, 'info');
    },

    /**
     * UI Control Bindings
     */
    bindControls() {
      // New Game
      document.getElementById('btnNewGame')?.addEventListener('click', () => {
        this.audio.play('move');
        this.startSinglePlayerGame();
      });

      // Resign
      document.getElementById('btnResign')?.addEventListener('click', () => {
        if (confirm('Are you sure you want to resign this match?')) {
          if (this.mode === 'single') {
            const winner = this.playerColor === 'w' ? 'b' : 'w';
            this.handleGameOver(winner, 'resignation');
          } else if (this.mode === 'multiplayer') {
            this.socket.resign();
          }
        }
      });

      // Offer Draw
      document.getElementById('btnDraw')?.addEventListener('click', () => {
        if (this.mode === 'single') {
          if (this.engine.getMaterialDifference() === 0 && this.engine.history.length > 20) {
            this.ui.showToast('Computer accepted the draw offer.', 'success');
            this.handleGameOver(null, 'draw_agreement');
          } else {
            this.ui.showToast('Computer declined the draw offer. Fight on!', 'warning');
          }
        } else if (this.mode === 'multiplayer') {
          this.socket.offerDraw();
          this.ui.showToast('Draw offer sent to opponent.', 'info');
        }
      });

      // Undo Move (Single Player only)
      document.getElementById('btnUndo')?.addEventListener('click', () => {
        if (this.mode !== 'single') {
          this.ui.showToast('Undo is only available in Single Player mode.', 'warning');
          return;
        }
        if (this.engine.history.length >= 2) {
          this.engine.undo(); // Undo AI move
          this.engine.undo(); // Undo player move
          this.board.clearSelection();
          this.board.render(this.engine);
          this.ui.updateMoveHistory(this.engine.history);
          this.audio.play('move');
          this.ui.showToast('Undid last turn.', 'info');
        } else {
          this.ui.showToast('No turns to undo.', 'warning');
        }
      });

      // Flip Board
      document.getElementById('btnFlip')?.addEventListener('click', () => {
        this.board.flip();
        this.audio.play('move');
      });

      // Rematch Button
      document.getElementById('gameOverRematchBtn')?.addEventListener('click', () => {
        this.ui.hideGameOverModal();
        if (this.mode === 'single') {
          this.playerColor = this.playerColor === 'w' ? 'b' : 'w';
          this.startSinglePlayerGame();
        } else if (this.mode === 'multiplayer') {
          this.socket.requestRematch();
        }
      });

      // New Game from Game Over Modal
      document.getElementById('gameOverNewBtn')?.addEventListener('click', () => {
        this.ui.hideGameOverModal();
        this.startSinglePlayerGame();
      });

      // Difficulty Selector
      document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.difficulty = btn.dataset.difficulty || 'medium';
          this.ui.showToast(`AI difficulty set to ${this.difficulty.toUpperCase()}`, 'info');
          this.startSinglePlayerGame();
        });
      });

      // Time Control Selector
      document.querySelectorAll('.tc-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.tc-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.timeControlKey = btn.dataset.tc || 'rapid_10';
          this.ui.showToast(`Time control set to ${btn.textContent}`, 'info');
          if (this.mode === 'single') {
            this.startSinglePlayerGame();
          }
        });
      });

      // In-Game Chat Send
      const chatInput = document.getElementById('chatTextInput');
      const chatSendBtn = document.getElementById('chatSendBtn');
      const doSendChat = () => {
        const text = chatInput?.value?.trim();
        if (text) {
          this.socket.sendChat(text);
          if (chatInput) chatInput.value = '';
        }
      };

      if (chatSendBtn) chatSendBtn.addEventListener('click', doSendChat);
      if (chatInput) {
        chatInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') doSendChat();
        });
      }

      // Quick Emoji Reactions
      document.querySelectorAll('.quick-emoji-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const emoji = btn.textContent.trim();
          this.socket.sendChat('', emoji);
        });
      });

      // Quick Chat Phrases
      document.querySelectorAll('.quick-chat-phrase').forEach(btn => {
        btn.addEventListener('click', () => {
          const phrase = btn.textContent.trim();
          this.socket.sendChat(phrase);
        });
      });

      // Exit Game to InfinityPlay Dashboard
      document.getElementById('btnExitGame')?.addEventListener('click', () => {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'exitGame', gameId: 'chess' }, '*');
        } else {
          window.location.href = '../../index.html';
        }
      });
    },

    bindTabs() {
      document.querySelectorAll('.side-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.side-tab-btn').forEach(b => b.classList.remove('active'));
          document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

          btn.classList.add('active');
          const target = btn.dataset.tab;
          const panel = document.getElementById(`tabPanel_${target}`);
          if (panel) panel.classList.add('active');

          if (target === 'puzzle') {
            this.startDailyPuzzle();
          } else if (target === 'replay') {
            this.startMatchReplay();
          } else if (target === 'leaderboard') {
            this.renderLeaderboard();
          }
        });
      });

      // Daily Puzzle Hint Button
      document.getElementById('puzzleHintBtn')?.addEventListener('click', () => {
        const puzzle = this.puzzles.getDailyPuzzle();
        const hintEl = document.getElementById('puzzleHintText');
        if (hintEl && puzzle) {
          hintEl.textContent = `💡 Hint: ${puzzle.hint}`;
        }
      });

      // Replay Controls
      document.getElementById('replayFirstBtn')?.addEventListener('click', () => this.replay.first());
      document.getElementById('replayPrevBtn')?.addEventListener('click', () => this.replay.prev());
      document.getElementById('replayPlayPauseBtn')?.addEventListener('click', () => this.replay.togglePlay());
      document.getElementById('replayNextBtn')?.addEventListener('click', () => this.replay.next());
      document.getElementById('replayLastBtn')?.addEventListener('click', () => this.replay.last());

      // PGN and FEN Copy
      document.getElementById('copyPgnBtn')?.addEventListener('click', () => {
        const pgn = this.replay.getPgn() || this.engine.pgn();
        navigator.clipboard.writeText(pgn);
        this.ui.showToast('PGN copied to clipboard!', 'success');
      });

      document.getElementById('copyFenBtn')?.addEventListener('click', () => {
        const fen = this.engine.fen();
        navigator.clipboard.writeText(fen);
        this.ui.showToast('FEN copied to clipboard!', 'success');
      });
    },

    async renderLeaderboard() {
      const container = document.getElementById('chessLeaderboardContainer');
      if (!container) return;

      container.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-muted);">Loading rankings...</div>';
      const list = await this.stats.getLeaderboard();

      container.innerHTML = list.map(item => `
        <div class="lb-row ${item.name === this.currentUser.name ? 'is-me' : ''}">
          <div class="lb-rank rank-${item.rank}">#${item.rank}</div>
          <div class="lb-player">
            <div class="lb-avatar">${item.avatar && item.avatar.includes('/') ? `<img src="../../${item.avatar}">` : item.name.charAt(0)}</div>
            <div class="lb-details">
              <strong>${item.name}</strong>
              <span>${item.title || 'Player'}</span>
            </div>
          </div>
          <div class="lb-stats">
            <div class="lb-elo">${item.elo} ELO</div>
            <div class="lb-winrate">${item.winRate || '65%'} Win</div>
          </div>
        </div>
      `).join('');
    },

    bindThemeSettings() {
      // Board Theme Picker
      document.querySelectorAll('.theme-dot').forEach(dot => {
        dot.addEventListener('click', () => {
          document.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active'));
          dot.classList.add('active');
          const theme = dot.dataset.theme;
          this.board.setTheme(theme);
          localStorage.setItem('infinityplay_chess_board_theme', theme);
          this.ui.showToast(`Board theme changed to ${theme}`, 'info');
        });
      });

      // Sound Toggle
      const soundCheckbox = document.getElementById('soundToggleInput');
      if (soundCheckbox) {
        soundCheckbox.checked = this.audio.enabled;
        soundCheckbox.addEventListener('change', (e) => {
          this.audio.setEnabled(e.target.checked);
          this.ui.showToast(`Sound FX ${e.target.checked ? 'enabled' : 'muted'}`, 'info');
        });
      }

      // Settings Modal Open/Close
      document.getElementById('btnOpenSettings')?.addEventListener('click', () => {
        document.getElementById('settingsModal')?.classList.add('active');
      });

      // Multiplayer Room Modal Open
      document.getElementById('btnOpenMultiplayerModal')?.addEventListener('click', () => {
        document.getElementById('multiplayerModal')?.classList.add('active');
      });

      // Close modals
      document.querySelectorAll('.modal-close-btn, .modal-overlay').forEach(el => {
        el.addEventListener('click', (e) => {
          if (e.target === el || e.target.classList.contains('modal-close-btn')) {
            document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
          }
        });
      });

      // Create Room Action in Modal
      document.getElementById('btnCreatePrivateRoom')?.addEventListener('click', () => {
        this.socket.createRoom({
          timeControlKey: this.timeControlKey,
          preferredColor: 'random',
          user: this.currentUser
        });
      });

      // Join Room Action in Modal
      document.getElementById('btnJoinRoomSubmit')?.addEventListener('click', () => {
        const input = document.getElementById('joinRoomCodeInput');
        const code = input?.value?.trim().toUpperCase();
        if (code) {
          this.socket.joinRoom(code, this.currentUser, false);
        } else {
          this.ui.showToast('Please enter a 6-digit room code.', 'warning');
        }
      });

      // Find Match Queue in Modal
      document.getElementById('btnStartMatchmaking')?.addEventListener('click', () => {
        this.socket.joinMatchmaking(this.timeControlKey, this.currentUser);
        this.ui.showToast('Searching for an online opponent...', 'info');
      });

      // Copy Room Code
      document.getElementById('copyRoomCodeBtn')?.addEventListener('click', () => {
        const code = document.getElementById('shareRoomCodeInput')?.value;
        if (code) {
          navigator.clipboard.writeText(code);
          this.ui.showToast(`Room code ${code} copied!`, 'success');
        }
      });
    },

    switchMode(mode) {
      this.mode = mode;
      document.querySelectorAll('.side-tab-btn').forEach(b => {
        if (b.dataset.tab === mode) b.classList.add('active');
        else b.classList.remove('active');
      });
      document.querySelectorAll('.tab-panel').forEach(p => {
        if (p.id === `tabPanel_${mode}`) p.classList.add('active');
        else p.classList.remove('active');
      });
    }
  };

  window.addEventListener('DOMContentLoaded', () => {
    App.init();
    window.ChessApp = App;
  });
})();

