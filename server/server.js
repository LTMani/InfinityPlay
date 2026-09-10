/**
 * InfinityPlay - Node.js Backend Server
 * Serves static frontend & handles REST API endpoints
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { handleAPIRoute } = require('./routes/api');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.resolve(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

function serveStaticFile(req, res, pathname) {
  let relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '');
  let filePath = path.join(PUBLIC_DIR, relativePath);

  // Security check: prevent path traversal attacks outside PUBLIC_DIR
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
      return serveStaticFile(req, res, path.relative(PUBLIC_DIR, filePath).replace(/\\/g, '/'));
    }

    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end('<h1>404 Not Found</h1><p>The requested file does not exist on InfinityPlay.</p>');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400'
    });

    const stream = fs.createReadStream(filePath);
    stream.on('error', () => {
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      }
    });
    stream.pipe(res);
  });
}

const server = http.createServer((req, res) => {
  try {
    const host = req.headers.host || 'localhost:3000';
    const myUrl = new URL(req.url, `http://${host}`);
    const pathname = myUrl.pathname;

    // Route API calls
    if (pathname.startsWith('/api/')) {
      return handleAPIRoute(req, res);
    }

    // Route Static Files
    serveStaticFile(req, res, pathname);
  } catch (err) {
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Server error', message: err.message }));
    }
  }
});

process.on('uncaughtException', (err) => {
  console.error('Server uncaughtException:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Server unhandledRejection:', reason);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`⚠️ Port ${PORT} is already in use. Retrying or terminating conflict...`);
  } else {
    console.error('Server error:', err);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('====================================================');
  console.log('⚡ INFINITYPLAY NODE.JS SERVER RUNNING');
  console.log(`🌐 Dashboard:    http://localhost:${PORT}`);
  console.log(`📡 API Base:     http://localhost:${PORT}/api`);
  console.log(`🎮 Games API:    http://localhost:${PORT}/api/games`);
  console.log(`🎯 Categories:   http://localhost:${PORT}/api/categories`);
  console.log(`👑 Leaderboard:  http://localhost:${PORT}/api/leaderboard`);
  console.log(`🕒 Recents API:  http://localhost:${PORT}/api/recently-played`);
  console.log(`⭐ Favorites:    http://localhost:${PORT}/api/favorites`);
  console.log('====================================================');
});
