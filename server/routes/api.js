/**
 * InfinityPlay Backend - API Router
 */
const store = require('../data/store');
const ChessManager = require('../chess/chess-manager');
const ChessSocketServer = require('../chess/chess-socket-server');
const CityBuilderManager = require('../city-builder/city-builder-manager');

const chessManager = typeof ChessManager === 'function' ? new ChessManager() : ChessManager;
const chessSocketServer = typeof ChessSocketServer === 'function' ? new ChessSocketServer(chessManager) : ChessSocketServer;
const cityBuilderManager = typeof CityBuilderManager === 'function' ? new CityBuilderManager() : CityBuilderManager;

function sendJSON(res, data, statusCode = 200) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

async function handleAPIRoute(req, res) {
  const host = req.headers.host || 'localhost:3000';
  const myUrl = new URL(req.url, `http://${host}`);
  const pathname = myUrl.pathname;
  const query = Object.fromEntries(myUrl.searchParams.entries());
  const method = req.method.toUpperCase();

  // Handle CORS Preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  // GET /api/health
  if (pathname === '/api/health' && method === 'GET') {
    return sendJSON(res, { status: 'healthy', platform: 'InfinityPlay', timestamp: Date.now() });
  }

  // GET /api/stats
  if (pathname === '/api/stats' && method === 'GET') {
    return sendJSON(res, store.getStats());
  }

  // GET /api/games
  if (pathname === '/api/games' && method === 'GET') {
    const games = store.getGames({
      category: query.category,
      search: query.search,
      sort: query.sort,
      topOnly: query.topOnly
    });
    return sendJSON(res, { count: games.length, games });
  }

  // GET /api/games/:id
  const gameMatch = pathname.match(/^\/api\/games\/([a-zA-Z0-9_-]+)$/);
  if (gameMatch && method === 'GET') {
    const gameId = gameMatch[1];
    const game = store.getGameById(gameId);
    if (!game) {
      return sendJSON(res, { error: 'Game not found', id: gameId }, 404);
    }
    return sendJSON(res, { game });
  }

  // GET /api/categories
  if (pathname === '/api/categories' && method === 'GET') {
    return sendJSON(res, { categories: store.getCategories() });
  }

  // GET /api/leaderboard
  if (pathname === '/api/leaderboard' && method === 'GET') {
    return sendJSON(res, { leaderboard: store.getLeaderboard() });
  }

  // GET /api/recently-played
  if (pathname === '/api/recently-played' && method === 'GET') {
    return sendJSON(res, { recentlyPlayed: store.getRecentlyPlayed() });
  }

  // POST /api/recently-played
  if (pathname === '/api/recently-played' && method === 'POST') {
    const body = await parseBody(req);
    if (!body.gameId) {
      return sendJSON(res, { error: 'Missing gameId in request body' }, 400);
    }
    const updated = store.addRecentlyPlayed(body.gameId);
    return sendJSON(res, { success: true, recentlyPlayed: updated });
  }

  // GET /api/favorites
  if (pathname === '/api/favorites' && method === 'GET') {
    return sendJSON(res, { favorites: store.getFavorites() });
  }

  // POST /api/favorites/toggle
  if (pathname === '/api/favorites/toggle' && method === 'POST') {
    const body = await parseBody(req);
    if (!body.gameId) {
      return sendJSON(res, { error: 'Missing gameId in request body' }, 400);
    }
    const result = store.toggleFavorite(body.gameId);
    return sendJSON(res, { success: true, ...result });
  }

  // POST /api/auth/login
  if (pathname === '/api/auth/login' && method === 'POST') {
    const body = await parseBody(req);
    const result = store.authenticateUser(body.email, body.password);
    if (!result.success) {
      return sendJSON(res, { error: result.error }, 401);
    }
    return sendJSON(res, result);
  }

  // POST /api/auth/register
  if (pathname === '/api/auth/register' && method === 'POST') {
    const body = await parseBody(req);
    const result = store.registerUser(body.username, body.email, body.password);
    return sendJSON(res, result);
  }

  // GET /api/achievements
  if (pathname === '/api/achievements' && method === 'GET') {
    return sendJSON(res, { achievements: store.getAchievements() });
  }

  // GET /api/settings
  if (pathname === '/api/settings' && method === 'GET') {
    return sendJSON(res, { settings: store.getSettings() });
  }

  // POST /api/settings
  if (pathname === '/api/settings' && (method === 'POST' || method === 'PUT')) {
    const body = await parseBody(req);
    const updated = store.updateSettings(body);
    return sendJSON(res, { success: true, settings: updated });
  }

  // GET /api/profile
  if (pathname === '/api/profile' && method === 'GET') {
    const user = store.getProfile(query.email);
    return sendJSON(res, { user });
  }

  // POST /api/profile
  if (pathname === '/api/profile' && (method === 'POST' || method === 'PUT')) {
    const body = await parseBody(req);
    const updated = store.updateProfile(body);
    return sendJSON(res, { success: true, user: updated });
  }

  // ==========================================
  // CHESS GAME ENDPOINTS
  // ==========================================

  // GET /api/chess/leaderboard
  if (pathname === '/api/chess/leaderboard' && method === 'GET') {
    const lb = (store.getChessLeaderboard && store.getChessLeaderboard()) || [];
    return sendJSON(res, { leaderboard: lb });
  }

  // GET /api/chess/history
  if (pathname === '/api/chess/history' && method === 'GET') {
    const hist = (store.getChessHistory && store.getChessHistory(query.userId)) || [];
    return sendJSON(res, { history: hist });
  }

  // GET /api/chess/stats
  if (pathname === '/api/chess/stats' && method === 'GET') {
    const stats = (store.getChessStats && store.getChessStats(query.userId)) || { elo: 1200, gamesPlayed: 0 };
    return sendJSON(res, { stats });
  }

  // POST /api/chess/rooms/create
  if (pathname === '/api/chess/rooms/create' && method === 'POST') {
    const body = await parseBody(req);
    const result = chessManager.createRoom({
      isPrivate: body.isPrivate !== false,
      timeControlKey: body.timeControlKey || 'rapid_10',
      preferredColor: body.preferredColor || 'random',
      hostUser: body.user
    });
    return sendJSON(res, {
      success: true,
      roomId: result.room.id,
      color: result.hostColor,
      sessionToken: result.sessionToken,
      room: chessManager.sanitizeRoom(result.room)
    });
  }

  // POST /api/chess/rooms/join
  if (pathname === '/api/chess/rooms/join' && method === 'POST') {
    const body = await parseBody(req);
    if (!body.roomId) {
      return sendJSON(res, { error: 'Missing roomId' }, 400);
    }
    const result = chessManager.joinRoom(body.roomId.toUpperCase().trim(), body.user, body.asSpectator);
    if (result.error) {
      return sendJSON(res, { error: result.error }, 400);
    }
    return sendJSON(res, {
      success: true,
      roomId: result.room.id,
      color: result.color,
      sessionToken: result.sessionToken,
      room: chessManager.sanitizeRoom(result.room)
    });
  }

  // GET /api/chess/rooms/:code
  const roomMatch = pathname.match(/^\/api\/chess\/rooms\/([a-zA-Z0-9_-]+)$/);
  if (roomMatch && method === 'GET') {
    const code = roomMatch[1].toUpperCase();
    const room = chessManager.getRoom(code);
    if (!room) {
      return sendJSON(res, { error: 'Chess room not found' }, 404);
    }
    return sendJSON(res, { room });
  }

  // POST /api/chess/matchmaking
  if (pathname === '/api/chess/matchmaking' && method === 'POST') {
    const body = await parseBody(req);
    const result = await chessManager.joinMatchmaking(body.timeControlKey || 'rapid_10', body.user);
    return sendJSON(res, result);
  }

  // POST /api/chess/matchmaking/cancel
  if (pathname === '/api/chess/matchmaking/cancel' && method === 'POST') {
    const body = await parseBody(req);
    const success = chessManager.cancelMatchmaking(body.timeControlKey, body.userId);
    return sendJSON(res, { success });
  }

  // GET /api/chess/stream/:code (SSE Fallback)
  const streamMatch = pathname.match(/^\/api\/chess\/stream\/([a-zA-Z0-9_-]+)$/);
  if (streamMatch && method === 'GET') {
    const code = streamMatch[1].toUpperCase();
    const sessionToken = query.token;
    return chessSocketServer.handleSSEStream(req, res, code, sessionToken);
  }

  // POST /api/chess/action (REST fallback for move/chat/draw/resign/rematch)
  if (pathname === '/api/chess/action' && method === 'POST') {
    const body = await parseBody(req);
    const { action, roomId, sessionToken } = body;
    if (!roomId || !sessionToken) {
      return sendJSON(res, { error: 'Missing roomId or sessionToken' }, 400);
    }

    if (action === 'move') {
      const result = chessManager.makeMove(roomId, sessionToken, body.move);
      return sendJSON(res, result);
    }
    if (action === 'resign') {
      const result = chessManager.resignGame(roomId, sessionToken);
      return sendJSON(res, result);
    }
    if (action === 'offer_draw') {
      const result = chessManager.offerDraw(roomId, sessionToken);
      return sendJSON(res, result);
    }
    if (action === 'respond_draw') {
      const result = chessManager.respondDraw(roomId, sessionToken, body.accept);
      return sendJSON(res, result);
    }
    if (action === 'rematch') {
      const result = chessManager.requestRematch(roomId, sessionToken);
      return sendJSON(res, result);
    }
    if (action === 'chat') {
      const result = chessManager.sendChat(roomId, sessionToken, body.message, body.emoji);
      return sendJSON(res, result);
    }
    if (action === 'reconnect') {
      const result = chessManager.handleReconnect(sessionToken);
      return sendJSON(res, result);
    }

    return sendJSON(res, { error: `Unknown chess action ${action}` }, 400);
  }

  // ==========================================
  // CITY BUILDER GAME ENDPOINTS
  // ==========================================

  // GET /api/city-builder/state
  if (pathname === '/api/city-builder/state' && method === 'GET') {
    const userId = query.userId || 'user_tharun';
    const userName = query.userName || 'Mayor';
    const result = cityBuilderManager.getCity(userId, userName);
    return sendJSON(res, { success: true, ...result });
  }

  // POST /api/city-builder/place
  if (pathname === '/api/city-builder/place' && method === 'POST') {
    const body = await parseBody(req);
    const userId = body.userId || 'user_tharun';
    const result = cityBuilderManager.placeBuilding(userId, body.type, body.x, body.y);
    if (result.error) return sendJSON(res, { success: false, error: result.error }, 400);
    return sendJSON(res, result);
  }

  // POST /api/city-builder/upgrade
  if (pathname === '/api/city-builder/upgrade' && method === 'POST') {
    const body = await parseBody(req);
    const userId = body.userId || 'user_tharun';
    const result = cityBuilderManager.upgradeBuilding(userId, body.buildingId);
    if (result.error) return sendJSON(res, { success: false, error: result.error }, 400);
    return sendJSON(res, result);
  }

  // POST /api/city-builder/speedup
  if (pathname === '/api/city-builder/speedup' && method === 'POST') {
    const body = await parseBody(req);
    const userId = body.userId || 'user_tharun';
    const result = cityBuilderManager.speedup(userId, body.buildingId);
    if (result.error) return sendJSON(res, { success: false, error: result.error }, 400);
    return sendJSON(res, result);
  }

  // POST /api/city-builder/move
  if (pathname === '/api/city-builder/move' && method === 'POST') {
    const body = await parseBody(req);
    const userId = body.userId || 'user_tharun';
    const result = cityBuilderManager.moveBuilding(userId, body.buildingId, body.x, body.y);
    if (result.error) return sendJSON(res, { success: false, error: result.error }, 400);
    return sendJSON(res, result);
  }

  // POST /api/city-builder/trade
  if (pathname === '/api/city-builder/trade' && method === 'POST') {
    const body = await parseBody(req);
    const userId = body.userId || 'user_tharun';
    const result = cityBuilderManager.trade(userId, body.fromResource, body.toResource, body.amount);
    if (result.error) return sendJSON(res, { success: false, error: result.error }, 400);
    return sendJSON(res, result);
  }

  // POST /api/city-builder/research
  if (pathname === '/api/city-builder/research' && method === 'POST') {
    const body = await parseBody(req);
    const userId = body.userId || 'user_tharun';
    const result = cityBuilderManager.research(userId, body.techId);
    if (result.error) return sendJSON(res, { success: false, error: result.error }, 400);
    return sendJSON(res, result);
  }

  // POST /api/city-builder/collect
  if (pathname === '/api/city-builder/collect' && (method === 'POST' || method === 'GET')) {
    const body = method === 'POST' ? await parseBody(req) : {};
    const userId = body.userId || query.userId || 'user_tharun';
    const result = cityBuilderManager.getCity(userId);
    return sendJSON(res, { success: true, city: result.city });
  }

  // POST /api/city-builder/train
  if (pathname === '/api/city-builder/train' && method === 'POST') {
    const body = await parseBody(req);
    const userId = body.userId || 'user_tharun';
    const result = cityBuilderManager.trainUnits(userId, body.unitType, body.count);
    if (result.error) return sendJSON(res, { success: false, error: result.error }, 400);
    return sendJSON(res, result);
  }

  // POST /api/city-builder/battle
  if (pathname === '/api/city-builder/battle' && method === 'POST') {
    const body = await parseBody(req);
    const userId = body.userId || 'user_tharun';
    const deployed = body.deployedUnits || body.units || {};
    const result = cityBuilderManager.executeBattle(userId, body.strongholdId, deployed);
    if (result.error) return sendJSON(res, { success: false, error: result.error }, 400);
    return sendJSON(res, result);
  }

  // POST /api/city-builder/claim-mission
  if (pathname === '/api/city-builder/claim-mission' && method === 'POST') {
    const body = await parseBody(req);
    const userId = body.userId || 'user_tharun';
    const result = cityBuilderManager.claimDailyMission(userId, body.missionId);
    if (result.error) return sendJSON(res, { success: false, error: result.error }, 400);
    return sendJSON(res, result);
  }

  // POST /api/city-builder/reset
  if (pathname === '/api/city-builder/reset' && method === 'POST') {
    const body = await parseBody(req);
    const userId = body.userId || 'user_tharun';
    const userName = body.userName || 'Mayor';
    const result = cityBuilderManager.resetCity(userId, userName);
    return sendJSON(res, result);
  }

  // 404 Not Found
  return sendJSON(res, { error: 'API endpoint not found', path: pathname }, 404);
}

module.exports = { handleAPIRoute, chessManager, chessSocketServer, cityBuilderManager };
