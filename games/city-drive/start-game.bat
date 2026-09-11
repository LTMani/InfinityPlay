@echo off
title Launching CITY DRIVE...
echo ========================================================
echo  Initializing CITY DRIVE 3D Driving Prototype...
echo ========================================================
cd /d "%~dp0"
where node >nul 2>nul
if %errorlevel% equ 0 (
  echo Starting local server on http://localhost:8080 ...
  start "CityDriveServer" /min node server.js
  timeout /t 2 >nul
  start http://localhost:8080
) else (
  echo Node.js not detected in PATH. Opening index.html directly...
  start "" "%~dp0index.html"
)
exit

