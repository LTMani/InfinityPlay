#!/bin/bash
echo "===================================================="
echo "  ⚡ INFINITYPLAY - AUTO UPDATE & START"
echo "===================================================="
echo ""
echo "📡 Pulling latest team updates from GitHub..."
git pull origin main
echo ""
echo "🚀 Starting InfinityPlay Server..."
if which xdg-open > /dev/null 2>&1; then
  xdg-open http://localhost:3000 &
elif which open > /dev/null 2>&1; then
  open http://localhost:3000 &
fi
node server/server.js
