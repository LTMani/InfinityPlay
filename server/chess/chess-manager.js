/**
 * InfinityPlay - Multiplayer Chess Room & Matchmaking Manager
 * Handles rooms, player sessions, time controls, clock ticks,
 * reconnection handling, move synchronization, and chat.
 */

const crypto = require('crypto');

// Standard initial chess FEN
const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

// Preset time controls in seconds
const TIME_CONTROLS = {
  'bullet_1': { minutes: 1, seconds: 60, increment: 0, label: 'Bullet 1 min' },
  'blitz_3': { minutes: 3, seconds: 180, increment: 0, label: 'Blitz 3 min' },
  'blitz_5': { minutes: 5, seconds: 300, increment: 0, label: 'Blitz 5 min' },
  'rapid_10': { minutes: 10, seconds: 600, increment: 0, label: 'Rapid 10 min' },
  'rapid_15': { minutes: 15, seconds: 900, increment: 0, label: 'Rapid 15 min' },
  'classical_30': { minutes: 30, seconds: 1800, increment: 0, label: 'Classical 30 min' }
};

class ChessManager {
  constructor(store) {
    this.store = store;
    this.rooms = new Map(); // roomId -> room object
    this.matchmakingQueue = new Map(); // timeControlKey -> [queueItem]
    this.playerSessions = new Map(); // sessionToken -> { roomId, color, playerId }

    // Start clock tick interval (runs every 500ms)
    this.clockInterval = setInterval(() => this.tickClocks(), 500);
    if (this.clockInterval.unref) this.clockInterval.unref();
  }

  generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
      if (i === 2) code += '-';
    }
    return code; // e.g. "K7G-9X2"
  }

  generateSessionToken() {
    return 'sess_' + crypto.randomBytes(16).toString('hex');
  }

  /**
   * Create a new chess room (private or matchmaking)
   */
  createRoom({ isPrivate = true, timeControlKey = 'rapid_10', preferredColor = 'random', hostUser = null } = {}) {
    let roomId = this.generateRoomCode();
    while (this.rooms.has(roomId)) {
      roomId = this.generateRoomCode();
    }

    const tc = TIME_CONTROLS[timeControlKey] || TIME_CONTROLS['rapid_10'];
    const totalMs = tc.seconds * 1000;

    let hostColor = 'w';
    if (preferredColor === 'b') hostColor = 'b';
    else if (preferredColor === 'random') hostColor = Math.random() < 0.5 ? 'w' : 'b';

    const sessionToken = this.generateSessionToken();

    const hostPlayer = {
      id: hostUser?.id || 'host_' + Date.now(),
      name: hostUser?.name || 'Player 1',
      avatar: hostUser?.avatar || 'P1',
      elo: hostUser?.elo || 1200,
      connected: true,
      ready: true,
      sessionToken,
      timeLeftMs: totalMs,
      socket: null,
      sseRes: null
    };

    const room = {
      id: roomId,
      isPrivate,
      timeControlKey,
      timeControl: tc,
      status: 'waiting', // waiting, ready, playing, game_over
      fen: INITIAL_FEN,
      history: [],
      turn: 'w',
      lastTickTimestamp: null,
      disconnectTimers: {},
      disconnectCountdowns: {},
      drawOffer: null,
      rematchOffers: new Set(),
      chatMessages: [
        {
          id: 'msg_init',
          sender: 'System',
          senderColor: 'system',
          message: `Room created with ${tc.label}. Share code ${roomId} with your opponent.`,
          timestamp: Date.now(),
          isSystem: true
        }
      ],
      players: {
        [hostColor]: hostPlayer,
        [hostColor === 'w' ? 'b' : 'w']: null
      },
      spectators: [],
      result: null,
      createdAt: Date.now()
    };

    this.rooms.set(roomId, room);
    this.playerSessions.set(sessionToken, { roomId, color: hostColor, playerId: hostPlayer.id });

    return { room, hostColor, sessionToken };
  }

  /**
   * Join an existing room
   */
  joinRoom(roomId, user, asSpectator = false) {
    const room = this.rooms.get(roomId);
    if (!room) return { error: 'Room not found' };

    // Check if room is full for playing
    const hasWhite = !!room.players.w;
    const hasBlack = !!room.players.b;

    if (!asSpectator && (!hasWhite || !hasBlack)) {
      const assignedColor = !hasWhite ? 'w' : 'b';
      const sessionToken = this.generateSessionToken();

      const newPlayer = {
        id: user?.id || 'player_' + Date.now(),
        name: user?.name || (assignedColor === 'w' ? 'White' : 'Black'),
        avatar: user?.avatar || (assignedColor === 'w' ? 'W' : 'B'),
        elo: user?.elo || 1200,
        connected: true,
        ready: true,
        sessionToken,
        timeLeftMs: room.timeControl.seconds * 1000,
        socket: null,
        sseRes: null
      };

      room.players[assignedColor] = newPlayer;
      this.playerSessions.set(sessionToken, { roomId, color: assignedColor, playerId: newPlayer.id });

      // Both players present: start game!
      room.status = 'playing';
      room.lastTickTimestamp = Date.now();

      this.addSystemChat(room, `${newPlayer.name} joined as ${assignedColor === 'w' ? 'White' : 'Black'}. Game started!`);
      this.broadcastRoom(room, {
        type: 'game_started',
        room: this.sanitizeRoom(room)
      });

      return { room, color: assignedColor, sessionToken };
    }

    // Join as spectator
    const spectatorToken = this.generateSessionToken();
    const spectator = {
      id: user?.id || 'spec_' + Date.now(),
      name: user?.name || 'Spectator',
      avatar: user?.avatar || 'S',
      sessionToken: spectatorToken,
      socket: null,
      sseRes: null
    };

    room.spectators.push(spectator);
    this.playerSessions.set(spectatorToken, { roomId, color: 'spectator', playerId: spectator.id });

    this.addSystemChat(room, `${spectator.name} joined as a spectator.`);
    this.broadcastRoom(room, {
      type: 'spectator_joined',
      spectator: { id: spectator.id, name: spectator.name },
      spectatorCount: room.spectators.length
    });

    return { room, color: 'spectator', sessionToken: spectatorToken };
  }

  /**
   * Matchmaking Queue
   */
  joinMatchmaking(timeControlKey = 'rapid_10', user = null) {
    if (!this.matchmakingQueue.has(timeControlKey)) {
      this.matchmakingQueue.set(timeControlKey, []);
    }

    const queue = this.matchmakingQueue.get(timeControlKey);

    // Remove any stale request by same user
    const userId = user?.id || 'guest';
    const existingIdx = queue.findIndex(q => q.user?.id === userId);
    if (existingIdx >= 0) {
      queue.splice(existingIdx, 1);
    }

    // If opponent in queue, match immediately!
    if (queue.length > 0) {
      const opponent = queue.shift();
      const { room, hostColor, sessionToken: p1Token } = this.createRoom({
        isPrivate: false,
        timeControlKey,
        preferredColor: 'random',
        hostUser: opponent.user
      });

      const p2Color = hostColor === 'w' ? 'b' : 'w';
      const p2Token = this.generateSessionToken();

      const p2Player = {
        id: user?.id || 'p2_' + Date.now(),
        name: user?.name || 'Player 2',
        avatar: user?.avatar || 'P2',
        elo: user?.elo || 1200,
        connected: true,
        ready: true,
        sessionToken: p2Token,
        timeLeftMs: room.timeControl.seconds * 1000,
        socket: null,
        sseRes: null
      };

      room.players[p2Color] = p2Player;
      this.playerSessions.set(p2Token, { roomId: room.id, color: p2Color, playerId: p2Player.id });

      room.status = 'playing';
      room.lastTickTimestamp = Date.now();

      // Notify opponent
      if (opponent.resolve) {
        opponent.resolve({
          matched: true,
          roomId: room.id,
          color: hostColor,
          sessionToken: p1Token,
          room: this.sanitizeRoom(room)
        });
      }

      return {
        matched: true,
        roomId: room.id,
        color: p2Color,
        sessionToken: p2Token,
        room: this.sanitizeRoom(room)
      };
    }

    // Wait in queue
    let resolvePromise;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    const queueItem = {
      user,
      timeControlKey,
      timestamp: Date.now(),
      resolve: resolvePromise
    };

    queue.push(queueItem);

    // Timeout after 30 seconds
    const timeout = setTimeout(() => {
      const idx = queue.indexOf(queueItem);
      if (idx >= 0) {
        queue.splice(idx, 1);
        resolvePromise({ matched: false, timeout: true });
      }
    }, 30000);

    queueItem.timeout = timeout;

    return promise;
  }

  cancelMatchmaking(timeControlKey, userId) {
    const queue = this.matchmakingQueue.get(timeControlKey);
    if (!queue) return false;
    const idx = queue.findIndex(q => q.user?.id === userId);
    if (idx >= 0) {
      const item = queue.splice(idx, 1)[0];
      if (item.timeout) clearTimeout(item.timeout);
      if (item.resolve) item.resolve({ matched: false, cancelled: true });
      return true;
    }
    return false;
  }

  /**
   * Handle Player Move
   */
  makeMove(roomId, sessionToken, moveData) {
    const room = this.rooms.get(roomId);
    if (!room) return { error: 'Room not found' };
    if (room.status !== 'playing') return { error: 'Game is not in playing state' };

    const session = this.playerSessions.get(sessionToken);
    if (!session || session.roomId !== roomId) return { error: 'Invalid session token' };

    const playerColor = session.color;
    if (playerColor !== room.turn) {
      return { error: `Not your turn. Active turn is ${room.turn}` };
    }

    const { from, to, promotion, san, fen, isCheck, isCheckmate, isDraw, drawReason } = moveData;

    // Deduct elapsed time from player clock
    const now = Date.now();
    if (room.lastTickTimestamp) {
      const elapsed = now - room.lastTickTimestamp;
      room.players[playerColor].timeLeftMs = Math.max(0, room.players[playerColor].timeLeftMs - elapsed);
    }
    room.lastTickTimestamp = now;

    // Record move in history
    const moveRecord = {
      from,
      to,
      promotion: promotion || null,
      san: san || `${from}-${to}`,
      fen,
      player: playerColor,
      timestamp: now,
      timeRemainingMs: room.players[playerColor].timeLeftMs
    };
    room.history.push(moveRecord);

    // Update board state
    room.fen = fen;
    room.turn = room.turn === 'w' ? 'b' : 'w';

    // Clear any active draw offers
    room.drawOffer = null;

    // Check end conditions
    if (isCheckmate) {
      this.endGame(room, playerColor, 'checkmate');
    } else if (isDraw) {
      this.endGame(room, null, drawReason || 'draw');
    }

    // Broadcast move to all connected clients
    this.broadcastRoom(room, {
      type: 'move_made',
      move: moveRecord,
      turn: room.turn,
      fen: room.fen,
      clocks: {
        w: room.players.w?.timeLeftMs || 0,
        b: room.players.b?.timeLeftMs || 0
      },
      isCheck: !!isCheck,
      isCheckmate: !!isCheckmate,
      isDraw: !!isDraw,
      status: room.status,
      result: room.result
    });

    return { success: true, move: moveRecord };
  }

  /**
   * Resign game
   */
  resignGame(roomId, sessionToken) {
    const room = this.rooms.get(roomId);
    if (!room || room.status !== 'playing') return { error: 'Invalid room or game state' };

    const session = this.playerSessions.get(sessionToken);
    if (!session || session.roomId !== roomId || (session.color !== 'w' && session.color !== 'b')) {
      return { error: 'Invalid player' };
    }

    const winner = session.color === 'w' ? 'b' : 'w';
    this.endGame(room, winner, 'resignation');

    this.addSystemChat(room, `${room.players[session.color].name} resigned. ${room.players[winner].name} wins!`);
    this.broadcastRoom(room, {
      type: 'game_over',
      status: 'game_over',
      result: room.result
    });

    return { success: true, result: room.result };
  }

  /**
   * Offer Draw
   */
  offerDraw(roomId, sessionToken) {
    const room = this.rooms.get(roomId);
    if (!room || room.status !== 'playing') return { error: 'Invalid room' };

    const session = this.playerSessions.get(sessionToken);
    if (!session || session.roomId !== roomId || (session.color !== 'w' && session.color !== 'b')) {
      return { error: 'Invalid player' };
    }

    room.drawOffer = session.color;
    const opponentColor = session.color === 'w' ? 'b' : 'w';

    this.addSystemChat(room, `${room.players[session.color].name} offered a draw.`);
    this.broadcastRoom(room, {
      type: 'draw_offered',
      byColor: session.color,
      targetColor: opponentColor
    });

    return { success: true };
  }

  /**
   * Respond to Draw Offer
   */
  respondDraw(roomId, sessionToken, accept) {
    const room = this.rooms.get(roomId);
    if (!room || room.status !== 'playing' || !room.drawOffer) return { error: 'No active draw offer' };

    const session = this.playerSessions.get(sessionToken);
    if (!session || session.roomId !== roomId) return { error: 'Invalid player' };

    const opponentColor = room.drawOffer;
    if (session.color === opponentColor) return { error: 'Cannot accept own draw offer' };

    if (accept) {
      this.endGame(room, null, 'draw_agreement');
      this.addSystemChat(room, `Draw agreed by mutual agreement.`);
      this.broadcastRoom(room, {
        type: 'game_over',
        status: 'game_over',
        result: room.result
      });
    } else {
      room.drawOffer = null;
      this.addSystemChat(room, `${room.players[session.color].name} declined the draw offer.`);
      this.broadcastRoom(room, {
        type: 'draw_declined',
        byColor: session.color
      });
    }

    return { success: true, accepted: accept };
  }

  /**
   * Rematch request
   */
  requestRematch(roomId, sessionToken) {
    const room = this.rooms.get(roomId);
    if (!room || room.status !== 'game_over') return { error: 'Can only rematch after game over' };

    const session = this.playerSessions.get(sessionToken);
    if (!session || (session.color !== 'w' && session.color !== 'b')) return { error: 'Invalid player' };

    room.rematchOffers.add(session.color);

    if (room.rematchOffers.size === 2) {
      // Both agreed -> start rematch with swapped colors!
      const oldW = room.players.w;
      const oldB = room.players.b;

      const totalMs = room.timeControl.seconds * 1000;
      oldW.timeLeftMs = totalMs;
      oldB.timeLeftMs = totalMs;

      // Swap colors
      room.players.w = oldB;
      room.players.b = oldW;

      // Update session mappings
      this.playerSessions.set(oldW.sessionToken, { roomId: room.id, color: 'b', playerId: oldW.id });
      this.playerSessions.set(oldB.sessionToken, { roomId: room.id, color: 'w', playerId: oldB.id });

      room.fen = INITIAL_FEN;
      room.history = [];
      room.turn = 'w';
      room.status = 'playing';
      room.result = null;
      room.drawOffer = null;
      room.rematchOffers.clear();
      room.lastTickTimestamp = Date.now();

      this.addSystemChat(room, `Rematch started! Colors swapped.`);
      this.broadcastRoom(room, {
        type: 'rematch_started',
        room: this.sanitizeRoom(room)
      });

      return { success: true, started: true };
    }

    this.addSystemChat(room, `${room.players[session.color].name} wants a rematch.`);
    this.broadcastRoom(room, {
      type: 'rematch_requested',
      byColor: session.color
    });

    return { success: true, waiting: true };
  }

  /**
   * Send In-Game Chat Message
   */
  sendChat(roomId, sessionToken, message, emoji = null) {
    const room = this.rooms.get(roomId);
    if (!room) return { error: 'Room not found' };

    const session = this.playerSessions.get(sessionToken);
    let senderName = 'Spectator';
    let senderColor = 'spectator';

    if (session) {
      senderColor = session.color;
      if (session.color === 'w') senderName = room.players.w?.name || 'White';
      else if (session.color === 'b') senderName = room.players.b?.name || 'Black';
      else {
        const spec = room.spectators.find(s => s.sessionToken === sessionToken);
        if (spec) senderName = spec.name;
      }
    }

    const cleanMsg = (message || '').trim().slice(0, 200);
    if (!cleanMsg && !emoji) return { error: 'Empty message' };

    const chatItem = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      sender: senderName,
      senderColor,
      message: cleanMsg,
      emoji: emoji || null,
      timestamp: Date.now(),
      isSystem: false
    };

    room.chatMessages.push(chatItem);
    if (room.chatMessages.length > 100) {
      room.chatMessages = room.chatMessages.slice(-100);
    }

    this.broadcastRoom(room, {
      type: 'chat_message',
      chat: chatItem
    });

    return { success: true, chat: chatItem };
  }

  /**
   * Reconnection handling
   */
  handleDisconnect(sessionToken) {
    const session = this.playerSessions.get(sessionToken);
    if (!session) return;

    const room = this.rooms.get(session.roomId);
    if (!room || room.status !== 'playing') return;

    const color = session.color;
    if (color !== 'w' && color !== 'b') return;

    const player = room.players[color];
    if (!player) return;

    player.connected = false;
    room.disconnectCountdowns[color] = 60; // 60 seconds grace period

    this.addSystemChat(room, `${player.name} disconnected. Reconnect window: 60s.`);
    this.broadcastRoom(room, {
      type: 'player_disconnected',
      color,
      playerName: player.name,
      reconnectSeconds: 60
    });

    // Start 60s countdown timer
    if (room.disconnectTimers[color]) {
      clearInterval(room.disconnectTimers[color]);
    }

    room.disconnectTimers[color] = setInterval(() => {
      room.disconnectCountdowns[color] -= 1;
      const left = room.disconnectCountdowns[color];

      this.broadcastRoom(room, {
        type: 'reconnect_countdown',
        color,
        secondsLeft: left
      });

      if (left <= 0) {
        clearInterval(room.disconnectTimers[color]);
        delete room.disconnectTimers[color];

        // Opponent wins by abandonment
        if (room.status === 'playing') {
          const winner = color === 'w' ? 'b' : 'w';
          this.endGame(room, winner, 'abandonment');
          this.addSystemChat(room, `${player.name} failed to reconnect. ${room.players[winner].name} wins by abandonment.`);
          this.broadcastRoom(room, {
            type: 'game_over',
            status: 'game_over',
            result: room.result
          });
        }
      }
    }, 1000);
  }

  handleReconnect(sessionToken, newSocket = null, newSseRes = null) {
    const session = this.playerSessions.get(sessionToken);
    if (!session) return { error: 'Session not found' };

    const room = this.rooms.get(session.roomId);
    if (!room) return { error: 'Room expired or closed' };

    const color = session.color;
    if (color === 'w' || color === 'b') {
      const player = room.players[color];
      if (player) {
        player.connected = true;
        if (newSocket) player.socket = newSocket;
        if (newSseRes) player.sseRes = newSseRes;

        // Clear disconnect timer
        if (room.disconnectTimers[color]) {
          clearInterval(room.disconnectTimers[color]);
          delete room.disconnectTimers[color];
        }
        delete room.disconnectCountdowns[color];

        this.addSystemChat(room, `${player.name} reconnected.`);
        this.broadcastRoom(room, {
          type: 'player_reconnected',
          color,
          playerName: player.name
        });
      }
    } else {
      const spec = room.spectators.find(s => s.sessionToken === sessionToken);
      if (spec) {
        if (newSocket) spec.socket = newSocket;
        if (newSseRes) spec.sseRes = newSseRes;
      }
    }

    return {
      success: true,
      room: this.sanitizeRoom(room),
      color: session.color
    };
  }

  /**
   * Clock Tick Runner
   */
  tickClocks() {
    const now = Date.now();
    for (const [, room] of this.rooms) {
      if (room.status !== 'playing') continue;

      if (!room.lastTickTimestamp) {
        room.lastTickTimestamp = now;
        continue;
      }

      const elapsed = now - room.lastTickTimestamp;
      room.lastTickTimestamp = now;

      const activeColor = room.turn;
      const activePlayer = room.players[activeColor];
      if (!activePlayer) continue;

      activePlayer.timeLeftMs = Math.max(0, activePlayer.timeLeftMs - elapsed);

      // Check timeout
      if (activePlayer.timeLeftMs <= 0) {
        const winner = activeColor === 'w' ? 'b' : 'w';
        this.endGame(room, winner, 'timeout');
        this.addSystemChat(room, `${activePlayer.name} ran out of time! ${room.players[winner].name} wins on time.`);
        this.broadcastRoom(room, {
          type: 'game_over',
          status: 'game_over',
          result: room.result
        });
      }
    }
  }

  /**
   * End Game & Calculate ELO
   */
  endGame(room, winnerColor, reason) {
    room.status = 'game_over';
    room.lastTickTimestamp = null;

    // Calculate ELO adjustments
    let eloDeltaW = 0;
    let eloDeltaB = 0;

    const pW = room.players.w;
    const pB = room.players.b;

    if (pW && pB) {
      const eloW = pW.elo || 1200;
      const eloB = pB.elo || 1200;

      const expectedW = 1 / (1 + Math.pow(10, (eloB - eloW) / 400));
      const expectedB = 1 - expectedW;

      let scoreW = 0.5;
      let scoreB = 0.5;

      if (winnerColor === 'w') {
        scoreW = 1;
        scoreB = 0;
      } else if (winnerColor === 'b') {
        scoreW = 0;
        scoreB = 1;
      }

      const K = 32;
      eloDeltaW = Math.round(K * (scoreW - expectedW));
      eloDeltaB = Math.round(K * (scoreB - expectedB));

      pW.elo = Math.max(100, eloW + eloDeltaW);
      pB.elo = Math.max(100, eloB + eloDeltaB);
    }

    room.result = {
      winner: winnerColor,
      reason,
      winnerName: winnerColor ? (winnerColor === 'w' ? pW?.name : pB?.name) : 'Draw',
      eloChange: {
        w: eloDeltaW,
        b: eloDeltaB
      },
      durationMs: Date.now() - room.createdAt,
      totalMoves: room.history.length
    };

    // Save completed game to store history if store exists
    if (this.store && this.store.recordChessMatch) {
      this.store.recordChessMatch({
        id: 'match_' + room.id + '_' + Date.now(),
        roomId: room.id,
        date: new Date().toISOString(),
        timeControl: room.timeControl.label,
        durationSeconds: Math.round((Date.now() - room.createdAt) / 1000),
        result: room.result,
        whitePlayer: { id: pW?.id, name: pW?.name, elo: pW?.elo },
        blackPlayer: { id: pB?.id, name: pB?.name, elo: pB?.elo },
        history: room.history,
        finalFen: room.fen
      });
    }
  }

  addSystemChat(room, message) {
    const item = {
      id: 'sys_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5),
      sender: 'System',
      senderColor: 'system',
      message,
      timestamp: Date.now(),
      isSystem: true
    };
    room.chatMessages.push(item);
  }

  /**
   * Broadcast message to all room members (WebSockets + SSE)
   */
  broadcastRoom(room, data) {
    const payload = JSON.stringify(data);

    // Send to players
    ['w', 'b'].forEach(col => {
      const p = room.players[col];
      if (p) {
        if (p.socket && p.socket.readyState === 1) {
          try { p.socket.sendText(payload); } catch (e) {}
        }
        if (p.sseRes && !p.sseRes.writableEnded) {
          try {
            p.sseRes.write(`data: ${payload}\n\n`);
          } catch (e) {}
        }
      }
    });

    // Send to spectators
    room.spectators.forEach(s => {
      if (s.socket && s.socket.readyState === 1) {
        try { s.socket.sendText(payload); } catch (e) {}
      }
      if (s.sseRes && !s.sseRes.writableEnded) {
        try {
          s.sseRes.write(`data: ${payload}\n\n`);
        } catch (e) {}
      }
    });
  }

  sanitizeRoom(room) {
    return {
      id: room.id,
      isPrivate: room.isPrivate,
      timeControlKey: room.timeControlKey,
      timeControl: room.timeControl,
      status: room.status,
      fen: room.fen,
      turn: room.turn,
      history: room.history,
      clocks: {
        w: room.players.w?.timeLeftMs || 0,
        b: room.players.b?.timeLeftMs || 0
      },
      players: {
        w: room.players.w ? {
          id: room.players.w.id,
          name: room.players.w.name,
          avatar: room.players.w.avatar,
          elo: room.players.w.elo,
          connected: room.players.w.connected
        } : null,
        b: room.players.b ? {
          id: room.players.b.id,
          name: room.players.b.name,
          avatar: room.players.b.avatar,
          elo: room.players.b.elo,
          connected: room.players.b.connected
        } : null
      },
      spectatorCount: room.spectators.length,
      chatMessages: room.chatMessages.slice(-50),
      result: room.result,
      drawOffer: room.drawOffer
    };
  }

  getRoom(roomId) {
    const room = this.rooms.get(roomId);
    return room ? this.sanitizeRoom(room) : null;
  }
}

module.exports = ChessManager;
