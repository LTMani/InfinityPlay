/**
 * InfinityPlay - Zero-Dependency RFC 6455 WebSocket & SSE Server for Chess
 * Compliant with WebSocket standard RFC 6455 without any external npm packages.
 */

const crypto = require('crypto');

const WS_GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

class ChessSocketServer {
  constructor(chessManager) {
    this.chessManager = chessManager;
    this.clients = new Set(); // active raw sockets
  }

  /**
   * Handles HTTP Upgrade to WebSocket
   */
  handleUpgrade(req, socket, head) {
    const key = req.headers['sec-websocket-key'];
    if (!key) {
      socket.destroy();
      return;
    }

    // Compute accept key
    const acceptKey = crypto
      .createHash('sha1')
      .update(key + WS_GUID)
      .digest('base64');

    const responseHeaders = [
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${acceptKey}`,
      '\r\n'
    ].join('\r\n');

    socket.write(responseHeaders);

    const clientWrapper = this.wrapSocket(socket);
    this.clients.add(clientWrapper);

    this.setupMessageHandling(clientWrapper);

    if (head && head.length > 0) {
      socket.emit('data', head);
    }
  }

  wrapSocket(socket) {
    const client = {
      rawSocket: socket,
      readyState: 1, // 1 = OPEN
      sessionToken: null,
      roomId: null,
      lastPing: Date.now(),

      sendText(data) {
        if (client.readyState !== 1) return;
        const payload = Buffer.from(typeof data === 'string' ? data : JSON.stringify(data), 'utf8');
        const length = payload.length;

        let frame;
        if (length <= 125) {
          frame = Buffer.alloc(2 + length);
          frame[0] = 0x81; // FIN + text opcode (0x1)
          frame[1] = length;
          payload.copy(frame, 2);
        } else if (length <= 65535) {
          frame = Buffer.alloc(4 + length);
          frame[0] = 0x81;
          frame[1] = 126;
          frame.writeUInt16BE(length, 2);
          payload.copy(frame, 4);
        } else {
          frame = Buffer.alloc(10 + length);
          frame[0] = 0x81;
          frame[1] = 127;
          frame.writeBigUInt64BE(BigInt(length), 2);
          payload.copy(frame, 10);
        }

        try {
          socket.write(frame);
        } catch (e) {
          client.close();
        }
      },

      close() {
        if (client.readyState === 3) return;
        client.readyState = 3;
        try {
          // Send close frame
          socket.write(Buffer.from([0x88, 0x00]));
          socket.end();
        } catch (e) {}
      }
    };

    return client;
  }

  setupMessageHandling(client) {
    const socket = client.rawSocket;
    let buffer = Buffer.alloc(0);

    socket.on('data', (chunk) => {
      buffer = Buffer.concat([buffer, chunk]);

      while (buffer.length >= 2) {
        const firstByte = buffer[0];
        const secondByte = buffer[1];

        const isFinal = (firstByte & 0x80) !== 0;
        const opcode = firstByte & 0x0f;
        const isMasked = (secondByte & 0x80) !== 0;
        let payloadLen = secondByte & 0x7f;

        let offset = 2;

        if (payloadLen === 126) {
          if (buffer.length < 4) return; // need more data
          payloadLen = buffer.readUInt16BE(2);
          offset = 4;
        } else if (payloadLen === 127) {
          if (buffer.length < 10) return; // need more data
          payloadLen = Number(buffer.readBigUInt64BE(2));
          offset = 10;
        }

        let maskKey = null;
        if (isMasked) {
          if (buffer.length < offset + 4) return;
          maskKey = buffer.slice(offset, offset + 4);
          offset += 4;
        }

        if (buffer.length < offset + payloadLen) return; // wait for full payload

        const payload = buffer.slice(offset, offset + payloadLen);
        buffer = buffer.slice(offset + payloadLen);

        // Unmask payload if masked
        if (maskKey) {
          for (let i = 0; i < payload.length; i++) {
            payload[i] ^= maskKey[i % 4];
          }
        }

        // Handle opcodes
        if (opcode === 0x8) {
          // Connection Close
          client.close();
          return;
        } else if (opcode === 0x9) {
          // Ping -> Pong
          try {
            const pong = Buffer.alloc(2);
            pong[0] = 0x8A;
            pong[1] = 0x00;
            socket.write(pong);
          } catch (e) {}
          return;
        } else if (opcode === 0xA) {
          // Pong
          return;
        } else if (opcode === 0x1) {
          // Text frame
          const text = payload.toString('utf8');
          try {
            const msg = JSON.parse(text);
            this.handleClientMessage(client, msg);
          } catch (err) {
            console.warn('Invalid JSON received over WebSocket:', err.message);
          }
        }
      }
    });

    socket.on('close', () => {
      this.handleSocketTermination(client);
    });

    socket.on('error', () => {
      this.handleSocketTermination(client);
    });
  }

  handleSocketTermination(client) {
    client.readyState = 3;
    this.clients.delete(client);

    if (client.sessionToken) {
      this.chessManager.handleDisconnect(client.sessionToken);
    }
  }

  /**
   * Dispatch parsed incoming client messages
   */
  handleClientMessage(client, msg) {
    const type = msg.type;

    if (type === 'create_room') {
      const { room, hostColor, sessionToken } = this.chessManager.createRoom({
        isPrivate: msg.isPrivate !== false,
        timeControlKey: msg.timeControlKey || 'rapid_10',
        preferredColor: msg.preferredColor || 'random',
        hostUser: msg.user
      });

      client.sessionToken = sessionToken;
      client.roomId = room.id;
      room.players[hostColor].socket = client;

      client.sendText({
        type: 'room_created',
        roomId: room.id,
        color: hostColor,
        sessionToken,
        room: this.chessManager.sanitizeRoom(room)
      });
      return;
    }

    if (type === 'join_room') {
      const res = this.chessManager.joinRoom(msg.roomId, msg.user, msg.asSpectator);
      if (res.error) {
        client.sendText({ type: 'error', error: res.error });
        return;
      }

      client.sessionToken = res.sessionToken;
      client.roomId = res.room.id;

      if (res.color === 'w' || res.color === 'b') {
        res.room.players[res.color].socket = client;
      } else {
        const spec = res.room.spectators.find(s => s.sessionToken === res.sessionToken);
        if (spec) spec.socket = client;
      }

      client.sendText({
        type: 'room_joined',
        roomId: res.room.id,
        color: res.color,
        sessionToken: res.sessionToken,
        room: this.chessManager.sanitizeRoom(res.room)
      });
      return;
    }

    if (type === 'matchmake') {
      this.chessManager.joinMatchmaking(msg.timeControlKey, msg.user)
        .then(matchRes => {
          if (matchRes.matched) {
            client.sessionToken = matchRes.sessionToken;
            client.roomId = matchRes.roomId;

            const room = this.chessManager.rooms.get(matchRes.roomId);
            if (room && room.players[matchRes.color]) {
              room.players[matchRes.color].socket = client;
            }

            client.sendText({
              type: 'match_found',
              roomId: matchRes.roomId,
              color: matchRes.color,
              sessionToken: matchRes.sessionToken,
              room: matchRes.room
            });
          } else {
            client.sendText({
              type: 'matchmaking_status',
              status: matchRes.timeout ? 'timeout' : 'cancelled'
            });
          }
        });
      return;
    }

    if (type === 'cancel_matchmake') {
      const cancelled = this.chessManager.cancelMatchmaking(msg.timeControlKey, msg.userId);
      client.sendText({ type: 'matchmaking_cancelled', success: cancelled });
      return;
    }

    if (type === 'move') {
      const res = this.chessManager.makeMove(msg.roomId, msg.sessionToken, msg.move);
      if (res.error) {
        client.sendText({ type: 'error', error: res.error });
      }
      return;
    }

    if (type === 'resign') {
      const res = this.chessManager.resignGame(msg.roomId, msg.sessionToken);
      if (res.error) {
        client.sendText({ type: 'error', error: res.error });
      }
      return;
    }

    if (type === 'offer_draw') {
      const res = this.chessManager.offerDraw(msg.roomId, msg.sessionToken);
      if (res.error) {
        client.sendText({ type: 'error', error: res.error });
      }
      return;
    }

    if (type === 'respond_draw') {
      const res = this.chessManager.respondDraw(msg.roomId, msg.sessionToken, msg.accept);
      if (res.error) {
        client.sendText({ type: 'error', error: res.error });
      }
      return;
    }

    if (type === 'rematch') {
      const res = this.chessManager.requestRematch(msg.roomId, msg.sessionToken);
      if (res.error) {
        client.sendText({ type: 'error', error: res.error });
      }
      return;
    }

    if (type === 'chat') {
      const res = this.chessManager.sendChat(msg.roomId, msg.sessionToken, msg.message, msg.emoji);
      if (res.error) {
        client.sendText({ type: 'error', error: res.error });
      }
      return;
    }

    if (type === 'reconnect') {
      const res = this.chessManager.handleReconnect(msg.sessionToken, client);
      if (res.error) {
        client.sendText({ type: 'error', error: res.error });
        return;
      }

      client.sessionToken = msg.sessionToken;
      client.roomId = res.room.id;

      client.sendText({
        type: 'reconnected_success',
        color: res.color,
        room: res.room
      });
      return;
    }

    if (type === 'ping') {
      client.sendText({ type: 'pong', timestamp: Date.now() });
      return;
    }
  }

  /**
   * Handle Server-Sent Events (SSE) fallback endpoint
   */
  handleSSEStream(req, res, roomId, sessionToken) {
    const room = this.chessManager.rooms.get(roomId);
    if (!room) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Room not found');
    }

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });

    res.write(`data: ${JSON.stringify({ type: 'sse_connected', room: this.chessManager.sanitizeRoom(room) })}\n\n`);

    const session = this.chessManager.playerSessions.get(sessionToken);
    if (session) {
      if (session.color === 'w' || session.color === 'b') {
        if (room.players[session.color]) {
          room.players[session.color].sseRes = res;
          room.players[session.color].connected = true;
        }
      } else {
        const spec = room.spectators.find(s => s.sessionToken === sessionToken);
        if (spec) spec.sseRes = res;
      }
    }

    req.on('close', () => {
      if (sessionToken) {
        this.chessManager.handleDisconnect(sessionToken);
      }
    });
  }
}

module.exports = ChessSocketServer;

