/**
 * InfinityPlay - Multiplayer WebSocket & SSE Client for Chess
 * Communicates with backend Node server via native WebSockets with seamless
 * fallback to Server-Sent Events (SSE) and REST actions.
 * Supports session persistence in sessionStorage for flawless reconnection!
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ChessSocketClient = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {

  const SESSION_STORAGE_KEY = 'infinityplay_chess_session';

  class ChessSocketClient {
    constructor(baseUrl = '') {
      const isHttp = typeof window !== 'undefined' && window.location.origin && window.location.origin.startsWith('http');
      this.baseUrl = baseUrl || (isHttp ? window.location.origin : 'http://localhost:3000');
      this.socket = null;
      this.eventSource = null;
      this.isConnected = false;
      this.useSSE = false;

      this.currentRoomId = null;
      this.sessionToken = null;
      this.playerColor = null;

      this.listeners = new Map();

      // Load existing active session from sessionStorage
      this.loadSavedSession();
    }

    on(event, callback) {
      if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
      }
      this.listeners.get(event).push(callback);
      return this;
    }

    off(event, callback) {
      if (!this.listeners.has(event)) return this;
      const list = this.listeners.get(event).filter(cb => cb !== callback);
      this.listeners.set(event, list);
      return this;
    }

    emit(event, data) {
      const list = this.listeners.get(event) || [];
      list.forEach(cb => {
        try { cb(data); } catch (e) { console.error('Listener error:', e); }
      });
    }

    saveSession(roomId, sessionToken, color) {
      this.currentRoomId = roomId;
      this.sessionToken = sessionToken;
      this.playerColor = color;
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ roomId, sessionToken, color }));
      } catch (e) {}
    }

    clearSession() {
      this.currentRoomId = null;
      this.sessionToken = null;
      this.playerColor = null;
      try {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      } catch (e) {}
    }

    loadSavedSession() {
      try {
        const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          this.currentRoomId = parsed.roomId;
          this.sessionToken = parsed.sessionToken;
          this.playerColor = parsed.color;
        }
      } catch (e) {}
    }

    hasActiveSession() {
      return !!(this.currentRoomId && this.sessionToken);
    }

    /**
     * Connect to backend via WebSocket (falls back to SSE)
     */
    connect() {
      if (this.isConnected && this.socket && this.socket.readyState === 1) {
        return Promise.resolve();
      }

      return new Promise((resolve) => {
        const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
        const wsProto = isSecure ? 'wss:' : 'ws:';
        let host = (typeof window !== 'undefined' && window.location.host) || 'localhost:3000';
        if (!host || host === 'null') host = 'localhost:3000';
        const wsUrl = `${wsProto}//${host}/ws/chess`;

        try {
          this.socket = new WebSocket(wsUrl);

          this.socket.onopen = () => {
            this.isConnected = true;
            this.useSSE = false;
            this.emit('connected', { mode: 'websocket' });

            // Start heartbeat
            this.pingInterval = setInterval(() => {
              if (this.socket && this.socket.readyState === 1) {
                this.socket.send(JSON.stringify({ type: 'ping' }));
              }
            }, 25000);

            resolve();
          };

          this.socket.onmessage = (event) => {
            try {
              const msg = JSON.parse(event.data);
              this.handleIncomingMessage(msg);
            } catch (err) {
              console.warn('Failed to parse socket message:', err);
            }
          };

          this.socket.onerror = (err) => {
            console.warn('WebSocket connection error, switching to SSE mode:', err);
            this.switchToSSE();
            resolve();
          };

          this.socket.onclose = () => {
            this.isConnected = false;
            clearInterval(this.pingInterval);
            this.emit('disconnected', {});
          };
        } catch (e) {
          this.switchToSSE();
          resolve();
        }
      });
    }

    switchToSSE() {
      this.useSSE = true;
      this.isConnected = true;
      this.emit('connected', { mode: 'sse' });

      if (this.currentRoomId && this.sessionToken) {
        this.initSSEStream(this.currentRoomId, this.sessionToken);
      }
    }

    initSSEStream(roomId, sessionToken) {
      if (this.eventSource) {
        this.eventSource.close();
      }

      try {
        const url = `${this.baseUrl}/api/chess/stream/${roomId}?token=${encodeURIComponent(sessionToken || '')}`;
        this.eventSource = new EventSource(url);

        this.eventSource.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);
            this.handleIncomingMessage(msg);
          } catch (e) {}
        };

        this.eventSource.onerror = () => {
          // Retry automatically by EventSource
        };
      } catch (e) {}
    }

    send(data) {
      if (!this.useSSE && this.socket && this.socket.readyState === 1) {
        this.socket.send(JSON.stringify(data));
        return Promise.resolve({ success: true });
      }

      // Fallback via HTTP REST Action
      return fetch(`${this.baseUrl}/api/chess/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: this.currentRoomId,
          sessionToken: this.sessionToken,
          ...data
        })
      }).then(res => res.json()).catch(() => ({ error: 'Network error' }));
    }

    handleIncomingMessage(msg) {
      const type = msg.type;

      if (type === 'room_created') {
        this.saveSession(msg.roomId, msg.sessionToken, msg.color);
      } else if (type === 'room_joined') {
        this.saveSession(msg.roomId, msg.sessionToken, msg.color);
      } else if (type === 'match_found') {
        this.saveSession(msg.roomId, msg.sessionToken, msg.color);
      } else if (type === 'game_over') {
        // match ended
      }

      this.emit(type, msg);
    }

    /**
     * Create private room
     */
    async createRoom({ timeControlKey = 'rapid_10', preferredColor = 'random', user = null } = {}) {
      await this.connect();

      if (!this.useSSE && this.socket && this.socket.readyState === 1) {
        this.socket.send(JSON.stringify({
          type: 'create_room',
          isPrivate: true,
          timeControlKey,
          preferredColor,
          user
        }));
      } else {
        const res = await fetch(`${this.baseUrl}/api/chess/rooms/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ timeControlKey, preferredColor, user, isPrivate: true })
        });
        const data = await res.json();
        if (data.success) {
          this.saveSession(data.roomId, data.sessionToken, data.color);
          this.initSSEStream(data.roomId, data.sessionToken);
          this.emit('room_created', data);
        } else {
          this.emit('error', data);
        }
      }
    }

    /**
     * Join existing room by code
     */
    async joinRoom(roomId, user = null, asSpectator = false) {
      await this.connect();
      const cleanRoomId = (roomId || '').toUpperCase().trim();

      if (!this.useSSE && this.socket && this.socket.readyState === 1) {
        this.socket.send(JSON.stringify({
          type: 'join_room',
          roomId: cleanRoomId,
          user,
          asSpectator
        }));
      } else {
        const res = await fetch(`${this.baseUrl}/api/chess/rooms/join`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomId: cleanRoomId, user, asSpectator })
        });
        const data = await res.json();
        if (data.success) {
          this.saveSession(data.roomId, data.sessionToken, data.color);
          this.initSSEStream(data.roomId, data.sessionToken);
          this.emit('room_joined', data);
        } else {
          this.emit('error', data);
        }
      }
    }

    /**
     * Matchmaking queue
     */
    async joinMatchmaking(timeControlKey = 'rapid_10', user = null) {
      await this.connect();

      if (!this.useSSE && this.socket && this.socket.readyState === 1) {
        this.socket.send(JSON.stringify({
          type: 'matchmake',
          timeControlKey,
          user
        }));
      } else {
        const res = await fetch(`${this.baseUrl}/api/chess/matchmaking`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ timeControlKey, user })
        });
        const data = await res.json();
        if (data.matched) {
          this.saveSession(data.roomId, data.sessionToken, data.color);
          this.initSSEStream(data.roomId, data.sessionToken);
          this.emit('match_found', data);
        } else {
          this.emit('matchmaking_status', data);
        }
      }
    }

    cancelMatchmaking(timeControlKey, userId) {
      this.send({ type: 'cancel_matchmake', timeControlKey, userId });
    }

    /**
     * Send chess move
     */
    makeMove(moveData) {
      return this.send({
        type: 'move',
        action: 'move',
        roomId: this.currentRoomId,
        sessionToken: this.sessionToken,
        move: moveData
      });
    }

    /**
     * In-game actions
     */
    resign() {
      return this.send({
        type: 'resign',
        action: 'resign',
        roomId: this.currentRoomId,
        sessionToken: this.sessionToken
      });
    }

    offerDraw() {
      return this.send({
        type: 'offer_draw',
        action: 'offer_draw',
        roomId: this.currentRoomId,
        sessionToken: this.sessionToken
      });
    }

    respondDraw(accept) {
      return this.send({
        type: 'respond_draw',
        action: 'respond_draw',
        roomId: this.currentRoomId,
        sessionToken: this.sessionToken,
        accept
      });
    }

    requestRematch() {
      return this.send({
        type: 'rematch',
        action: 'rematch',
        roomId: this.currentRoomId,
        sessionToken: this.sessionToken
      });
    }

    sendChat(message, emoji = null) {
      return this.send({
        type: 'chat',
        action: 'chat',
        roomId: this.currentRoomId,
        sessionToken: this.sessionToken,
        message,
        emoji
      });
    }

    /**
     * Reconnect to previous game if session exists
     */
    async attemptReconnect() {
      if (!this.hasActiveSession()) return false;
      await this.connect();

      if (!this.useSSE) {
        this.socket.send(JSON.stringify({
          type: 'reconnect',
          sessionToken: this.sessionToken
        }));
      } else {
        this.initSSEStream(this.currentRoomId, this.sessionToken);
        const res = await fetch(`${this.baseUrl}/api/chess/action`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'reconnect',
            roomId: this.currentRoomId,
            sessionToken: this.sessionToken
          })
        });
        const data = await res.json();
        if (data.success) {
          this.emit('reconnected_success', data);
        }
      }
      return true;
    }
  }

  return ChessSocketClient;
}));

