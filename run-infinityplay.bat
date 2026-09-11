@echo off
echo ====================================================
echo   ⚡ INFINITYPLAY - AUTO UPDATE ^& START
echo ====================================================
echo.
echo 📡 Pulling latest team updates from GitHub...
git pull origin main
echo.
echo 🚀 Starting InfinityPlay Server...
start http://localhost:3000
node server/server.js
pause
