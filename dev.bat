@echo off
title Digital Sheba - Dev Server
color 0A
cls
echo.
echo   ╔══════════════════════════════════════════╗
echo   ║      🚀 Digital Sheba Dev Server         ║
echo   ╚══════════════════════════════════════════╝
echo.
echo   Choose how to run:
echo.
echo   [1] Single terminal (merged logs)
echo   [2] Split windows (3 separate windows)
echo   [3] Dashboard (interactive split-pane)
echo.
set /p choice="  Enter choice (1/2/3): "

if "%choice%"=="1" goto :single
if "%choice%"=="2" goto :split
if "%choice%"=="3" goto :dashboard
goto :single

:single
echo.
echo   Starting in single terminal mode...
echo.
node scripts/dev-logs.js
goto :end

:split
echo.
echo   Opening 3 separate windows...
echo.
start "Landing | Port 3000" cmd /k "title Landing | Port 3000 && color 0B && cd /d %~dp0apps\landing && echo. && echo   🌐 LANDING - Port 3000 && echo   ───────────────────── && echo. && bun run dev"
start "Admin | Port 3001" cmd /k "title Admin | Port 3001 && color 0D && cd /d %~dp0apps\admin && echo. && echo   ⚙️  ADMIN - Port 3001 && echo   ───────────────────── && echo. && bun run dev"
start "API | Port 4000" cmd /k "title API | Port 4000 && color 0E && cd /d %~dp0apps\api && echo. && echo   🔗 API - Port 4000 && echo   ───────────────────── && echo. && bun run dev"
echo.
echo   ┌─────────────────────────────────────────┐
echo   │  Three windows opened:                   │
echo   │  🌐 Landing  → http://localhost:3000     │
echo   │  ⚙️  Admin    → http://localhost:3001     │
echo   │  🔗 API      → http://localhost:4000     │
echo   │                                          │
echo   │  Press any key to close this window...   │
echo   └─────────────────────────────────────────┘
echo.
pause >nul
goto :end

:dashboard
echo.
echo   Starting dashboard mode...
echo.
bun scripts/dev-dashboard.ts
goto :end

:end
