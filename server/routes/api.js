/**
 * InfinityPlay Backend - API Router
 */

const store = require('../data/store');
const CityBuilderManager = require('../city-builder/city-builder-manager');
const cityBuilderManager = new CityBuilderManager(store);

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
  // CITY BUILDER API ROUTES
  // ==========================================
  if (pathname.startsWith('/api/city-builder/')) {
    const action = pathname.replace('/api/city-builder/', '');

    // GET /api/city-builder/state
    if (action === 'state' && method === 'GET') {
      const result = cityBuilderManager.getCity(query.userId || 'default_user', query.userName || 'Mayor');
      return sendJSON(res, { success: true, ...result });
    }

    // GET /api/city-builder/rankings
    if (action === 'rankings' && method === 'GET') {
      return sendJSON(res, { success: true, rankings: cityBuilderManager.getRankings() });
    }

    const body = await parseBody(req);
    const userId = body.userId || query.userId || 'default_user';

    // POST /api/city-builder/place
    if (action === 'place' && method === 'POST') {
      const result = cityBuilderManager.placeBuilding(userId, body.type, body.x, body.y);
      return sendJSON(res, result, result.error ? 400 : 200);
    }

    // POST /api/city-builder/upgrade
    if (action === 'upgrade' && method === 'POST') {
      const result = cityBuilderManager.upgradeBuilding(userId, body.buildingId);
      return sendJSON(res, result, result.error ? 400 : 200);
    }

    // POST /api/city-builder/speedup
    if (action === 'speedup' && method === 'POST') {
      const result = cityBuilderManager.speedup(userId, body.buildingId);
      return sendJSON(res, result, result.error ? 400 : 200);
    }

    // POST /api/city-builder/move
    if (action === 'move' && method === 'POST') {
      const result = cityBuilderManager.moveBuilding(userId, body.buildingId, body.x, body.y);
      return sendJSON(res, result, result.error ? 400 : 200);
    }

    // POST /api/city-builder/trade
    if (action === 'trade' && method === 'POST') {
      const result = cityBuilderManager.trade(userId, body.fromResource, body.toResource, body.amount);
      return sendJSON(res, result, result.error ? 400 : 200);
    }

    // POST /api/city-builder/research
    if (action === 'research' && method === 'POST') {
      const result = cityBuilderManager.research(userId, body.techId);
      return sendJSON(res, result, result.error ? 400 : 200);
    }

    // POST /api/city-builder/collect
    if (action === 'collect' && method === 'POST') {
      const result = cityBuilderManager.getCity(userId);
      cityBuilderManager.progressDailyMission(result.city, 'm_collect', 1);
      store.saveCitySave(userId, result.city);
      return sendJSON(res, { success: true, ...result });
    }

    // POST /api/city-builder/train
    if (action === 'train' && method === 'POST') {
      const result = cityBuilderManager.trainTroops(userId, body.unitId || body.unitType, body.count);
      return sendJSON(res, result, result.error ? 400 : 200);
    }

    // POST /api/city-builder/battle-result
    if (action === 'battle-result' && method === 'POST') {
      const result = cityBuilderManager.resolveBattle(userId, body.targetId || body.nodeId, body.destructionPercent, body.stars, body.casualties);
      return sendJSON(res, result, result.error ? 400 : 200);
    }

    // POST /api/city-builder/claim-mission
    if (action === 'claim-mission' && method === 'POST') {
      const result = cityBuilderManager.claimMission(userId, body.missionId);
      return sendJSON(res, result, result.error ? 400 : 200);
    }

    // POST /api/city-builder/claim-achievement
    if (action === 'claim-achievement' && method === 'POST') {
      const result = cityBuilderManager.claimAchievement(userId, body.achievementId || body.achId);
      return sendJSON(res, result, result.error ? 400 : 200);
    }

    // POST /api/city-builder/reset
    if (action === 'reset' && method === 'POST') {
      const result = cityBuilderManager.resetCity(userId, body.userName || 'Mayor');
      return sendJSON(res, result);
    }
  }

  // 404 Not Found
  return sendJSON(res, { error: 'API endpoint not found', path: pathname }, 404);
}

module.exports = { handleAPIRoute };
