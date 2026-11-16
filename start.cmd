@echo off
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Install Node.js LTS from https://nodejs.org/
  echo Then close this window and open start.cmd again.
  pause
  exit /b 1
)
node -e "if(Number(process.versions.node.split('.')[0])<20){console.error('Node.js 20 or newer is required. Install the current LTS.');process.exit(1)}"
if errorlevel 1 (
  pause
  exit /b 1
)
node server.mjs
if errorlevel 1 pause
