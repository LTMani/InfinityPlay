@echo off
title Launching RAILWAY COMMANDER...
echo ========================================================
echo  Initializing RAILWAY COMMANDER (2.5D Train Simulator)...
echo ========================================================
cd /d "%~dp0"
where node >nul 2>nul
if %errorlevel% equ 0 (
  echo Starting local server on http://localhost:8082 ...
  start "RailwayCommanderServer" /min node server.js
  timeout /t 2 >nul
  start http://localhost:8082
) else (
  echo Node.js not detected in PATH. Opening index.html directly...
  start "" "%~dp0index.html"
)
exit
