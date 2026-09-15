/**
 * HTTP Integration Test for InfinityPlay Server and Tic-Tac-Toe Game
 */

const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

console.log('🚀 Starting InfinityPlay server for HTTP verification...');

const serverProcess = spawn('node', ['server/server.js'], {
  cwd: path.resolve(__dirname, '..'),
  env: { ...process.env, PORT: '3042' },
  stdio: 'pipe'
});

let serverStarted = false;

serverProcess.stdout.on('data', (data) => {
  const str = data.toString();
  if (str.includes('Server running') || str.includes('http://')) {
    if (!serverStarted) {
      serverStarted = true;
      runTests();
    }
  }
});

serverProcess.stderr.on('data', (data) => {
  console.error('Server err:', data.toString());
});

// Fallback timer if stdout string is slightly different
setTimeout(() => {
  if (!serverStarted) {
    serverStarted = true;
    runTests();
  }
}, 1500);

function request(urlPath) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3042${urlPath}`, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, headers: res.headers, body: data });
      });
    }).on('error', reject);
  });
}

async function runTests() {
  try {
    console.log('Testing endpoints on http://localhost:3042...');

    // 1. Home page
    const home = await request('/');
    console.log(`[GET /] Status: ${home.statusCode} (${home.body.length} bytes)`);
    if (home.statusCode !== 200) throw new Error('Home page returned non-200');

    // 2. Games API
    const apiGames = await request('/api/games');
    console.log(`[GET /api/games] Status: ${apiGames.statusCode}`);
    const parsed = JSON.parse(apiGames.body);
    const ttt = parsed.games.find(g => g.id === 'tic-tac-toe');
    if (!ttt) throw new Error('tic-tac-toe missing from /api/games');
    console.log(`✔ /api/games found game: "${ttt.name}", Category: ${ttt.category}`);

    // 3. Game HTML
    const gameHtml = await request('/games/tic-tac-toe/index.html');
    console.log(`[GET /games/tic-tac-toe/index.html] Status: ${gameHtml.statusCode}`);
    if (gameHtml.statusCode !== 200) throw new Error('game index.html returned non-200');
    if (!gameHtml.body.includes('TIC-TAC-TOE')) throw new Error('game index.html missing title');
    console.log('✔ Tic-Tac-Toe index.html served properly');

    // 4. Game CSS
    const gameCss = await request('/games/tic-tac-toe/css/game.css');
    console.log(`[GET /games/tic-tac-toe/css/game.css] Status: ${gameCss.statusCode}`);
    if (gameCss.statusCode !== 200) throw new Error('game.css returned non-200');
    console.log('✔ Game CSS served properly');

    // 5. Game JS
    const gameJs = await request('/games/tic-tac-toe/js/game.js');
    console.log(`[GET /games/tic-tac-toe/js/game.js] Status: ${gameJs.statusCode}`);
    if (gameJs.statusCode !== 200) throw new Error('game.js returned non-200');
    console.log('✔ Game JS served properly');

    // 6. SVG Thumbnails
    const thumb = await request('/assets/games/thumb_tic_tac_toe.svg');
    console.log(`[GET /assets/games/thumb_tic_tac_toe.svg] Status: ${thumb.statusCode}`);
    if (thumb.statusCode !== 200) throw new Error('thumb_tic_tac_toe.svg returned non-200');
    console.log('✔ Thumbnail SVG served properly');

    const topBanner = await request('/assets/games/top_tic_tac_toe.svg');
    console.log(`[GET /assets/games/top_tic_tac_toe.svg] Status: ${topBanner.statusCode}`);
    if (topBanner.statusCode !== 200) throw new Error('top_tic_tac_toe.svg returned non-200');
    console.log('✔ Top Banner SVG served properly');

    console.log('\n🎉 ALL HTTP INTEGRATION TESTS PASSED!');
    cleanup(0);
  } catch (err) {
    console.error('❌ HTTP Test Failed:', err);
    cleanup(1);
  }
}

function cleanup(exitCode) {
  serverProcess.kill('SIGTERM');
  setTimeout(() => {
    process.exit(exitCode);
  }, 300);
}

