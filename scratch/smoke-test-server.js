const http = require('http');
const { spawn } = require('child_process');

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            text: () => Promise.resolve(data),
            json: () => Promise.resolve(JSON.parse(data))
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            text: () => Promise.resolve(data),
            json: () => Promise.reject(e)
          });
        }
      });
    });
    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runSmokeTest() {
  console.log('🚀 Starting server process...');
  const server = spawn('node', ['server/server.js'], {
    cwd: process.cwd(),
    stdio: ['ignore', 'pipe', 'pipe']
  });

  server.stdout.on('data', d => process.stdout.write(`[SERVER] ${d}`));
  server.stderr.on('data', d => process.stderr.write(`[SERVER ERR] ${d}`));

  let passed = 0;
  let failed = 0;

  try {
    // Wait for server to boot
    await wait(2000);

    const endpoints = [
      { name: 'Health Check', url: 'http://localhost:3000/api/health', check: (d) => d.status === 'healthy' },
      { name: 'Games Catalog has Quick Math', url: 'http://localhost:3000/api/games', check: (d) => d.games && d.games.some(g => g.id === 'quick-math') },
      { name: 'Quick Math index.html', url: 'http://localhost:3000/games/quick-math/index.html', raw: true, check: (d) => d.includes('QUICK MATH') },
      { name: 'Quick Math CSS', url: 'http://localhost:3000/games/quick-math/css/game.css', raw: true, check: (d) => d.includes('quick-math') || d.includes('arena') },
      { name: 'Quick Math JS Engine', url: 'http://localhost:3000/games/quick-math/js/game.js', raw: true, check: (d) => d.includes('GameManager') },
      { name: 'Quick Math Questions JS', url: 'http://localhost:3000/games/quick-math/js/questions.js', raw: true, check: (d) => d.includes('QuestionEngine') },
      { name: 'Quick Math Thumbnail SVG', url: 'http://localhost:3000/assets/games/thumb_quick_math.svg', raw: true, check: (d) => d.includes('<svg') },
      { name: 'Quick Math Top Banner SVG', url: 'http://localhost:3000/assets/games/top_quick_math.svg', raw: true, check: (d) => d.includes('<svg') },
      { name: 'Quick Math Logo SVG', url: 'http://localhost:3000/games/quick-math/assets/images/logo.svg', raw: true, check: (d) => d.includes('<svg') },
      { name: 'Chess Leaderboard', url: 'http://localhost:3000/api/chess/leaderboard', check: (d) => Array.isArray(d.leaderboard) && d.leaderboard.length > 0 },
      { name: 'Chess Match History', url: 'http://localhost:3000/api/chess/history', check: (d) => Array.isArray(d.history) },
      { name: 'Chess Stats', url: 'http://localhost:3000/api/chess/stats', check: (d) => d.stats && typeof d.stats.totalGames === 'number' },
      { name: 'Chess index.html', url: 'http://localhost:3000/games/chess/index.html', raw: true, check: (d) => d.includes('Chess Grandmaster') },
      { name: 'Chess CSS', url: 'http://localhost:3000/games/chess/css/chess-board.css', raw: true, check: (d) => d.includes('chess-board') },
      { name: 'Chess JS App', url: 'http://localhost:3000/games/chess/js/chess-app.js', raw: true, check: (d) => d.includes('ChessApp') },
    ];

    for (const ep of endpoints) {
      try {
        const res = await fetch(ep.url);
        if (res.status !== 200) {
          throw new Error(`Status ${res.status}`);
        }
        const data = ep.raw ? await res.text() : await res.json();
        if (ep.check(data)) {
          console.log(`  ✅ ${ep.name} OK`);
          passed++;
        } else {
          console.error(`  ❌ ${ep.name} Failed validation`, data);
          failed++;
        }
      } catch (err) {
        console.error(`  ❌ ${ep.name} Error: ${err.message}`);
        failed++;
      }
    }

    // Test Room Creation via POST /api/chess/rooms/create
    try {
      const createRes = await fetch('http://localhost:3000/api/chess/rooms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timeControlKey: 'blitz_5',
          preferredColor: 'w',
          user: { id: 'smoke_user', name: 'SmokeTester', elo: 1550 }
        })
      });
      const data = await createRes.json();
      if (createRes.status === 200 && data.success && data.roomId) {
        console.log(`  ✅ Create Room API OK (Room ID: ${data.roomId}, Color: ${data.color})`);
        passed++;

        // Test GET Room Info
        const roomGetRes = await fetch(`http://localhost:3000/api/chess/rooms/${data.roomId}`);
        const roomGetData = await roomGetRes.json();
        if (roomGetRes.status === 200 && roomGetData.room) {
          console.log(`  ✅ GET Room Info OK`);
          passed++;
        } else {
          console.error(`  ❌ GET Room Info Failed`, roomGetData);
          failed++;
        }
      } else {
        console.error(`  ❌ Create Room API Failed:`, data);
        failed++;
      }
    } catch (err) {
      console.error(`  ❌ Create Room API Error: ${err.message}`);
      failed++;
    }

  } finally {
    console.log('🛑 Stopping test server...');
    server.kill();
    await wait(500);
  }

  console.log(`\n========================================`);
  console.log(`Smoke Test Results: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================`);
  process.exit(failed > 0 ? 1 : 0);
}

runSmokeTest();

