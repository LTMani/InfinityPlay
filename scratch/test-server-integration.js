/**
 * Automated HTTP Server & Assets Integration Test for InfinityPlay
 */

const http = require('http');
const { spawn } = require('child_process');
const assert = require('assert');

// Start server
const serverProcess = spawn('node', ['server/server.js'], {
  cwd: process.cwd(),
  stdio: 'pipe'
});

serverProcess.stdout.on('data', (d) => {
  // console.log('[Server stdout]:', d.toString());
});

serverProcess.stderr.on('data', (d) => {
  console.error('[Server stderr]:', d.toString());
});

function fetchUrl(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function runTests() {
  // Wait for server to bind port
  await new Promise(r => setTimeout(r, 1200));

  try {
    console.log('1. Checking /api/games endpoint...');
    const gamesRes = await fetchUrl('/api/games');
    assert.strictEqual(gamesRes.statusCode, 200, 'API /api/games should return 200');
    const gamesJson = JSON.parse(gamesRes.body);
    const slGame = gamesJson.games.find(g => g.id === 'snake-and-ladders');
    assert(slGame, 'snake-and-ladders must be present in /api/games');
    assert.strictEqual(slGame.name, 'Snake & Ladders');
    assert.strictEqual(slGame.category, 'Strategy');
    console.log('✔ /api/games contains Snake & Ladders correctly!');

    console.log('2. Checking /api/games/snake-and-ladders endpoint...');
    const singleRes = await fetchUrl('/api/games/snake-and-ladders');
    assert.strictEqual(singleRes.statusCode, 200);
    const singleJson = JSON.parse(singleRes.body);
    assert(singleJson.game && singleJson.game.id === 'snake-and-ladders');
    console.log('✔ /api/games/snake-and-ladders returned game metadata!');

    console.log('3. Checking /games/snake-and-ladders/index.html static serving...');
    const htmlRes = await fetchUrl('/games/snake-and-ladders/index.html');
    assert.strictEqual(htmlRes.statusCode, 200);
    assert(htmlRes.body.includes('Snake & Ladders: Board Arena'), 'HTML must contain title');
    assert(htmlRes.body.includes('id="boardCellsGrid"'), 'HTML must contain board container');
    assert(htmlRes.body.includes('id="cubeDice"'), 'HTML must contain 3D dice');
    console.log('✔ Static HTML served with 200 OK!');

    console.log('4. Checking CSS and JS static serving...');
    const cssRes = await fetchUrl('/games/snake-and-ladders/css/game.css');
    assert.strictEqual(cssRes.statusCode, 200);
    assert(cssRes.body.includes('--board-base'), 'CSS content verified');

    const jsRes = await fetchUrl('/games/snake-and-ladders/js/game.js');
    assert.strictEqual(jsRes.statusCode, 200);
    assert(jsRes.body.includes('GameEngine'), 'JS content verified');
    console.log('✔ CSS and JS static files served with 200 OK!');

    console.log('5. Checking SVG thumbnail assets...');
    const thumbRes = await fetchUrl('/assets/games/thumb_snake_and_ladders.svg');
    assert.strictEqual(thumbRes.statusCode, 200);
    assert.strictEqual(thumbRes.headers['content-type'], 'image/svg+xml');

    const topThumbRes = await fetchUrl('/assets/games/top_snake_and_ladders.svg');
    assert.strictEqual(topThumbRes.statusCode, 200);
    assert.strictEqual(topThumbRes.headers['content-type'], 'image/svg+xml');
    console.log('✔ Both SVG thumbnails served with 200 OK and image/svg+xml header!');

    console.log('6. Checking InfinityPlay Root Index...');
    const rootRes = await fetchUrl('/index.html');
    assert.strictEqual(rootRes.statusCode, 200);
    console.log('✔ InfinityPlay root index served with 200 OK!');

    console.log('====================================');
    console.log('ALL SERVER & ASSET INTEGRATION TESTS PASSED! 🚀');
    console.log('====================================');
  } catch (err) {
    console.error('Test failed:', err);
    process.exitCode = 1;
  } finally {
    serverProcess.kill('SIGTERM');
  }
}

runTests();
