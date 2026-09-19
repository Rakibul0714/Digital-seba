@echo off
title Digital Sheba - Dev Server
color 0A

echo.
echo  ========================================
echo    Digital Sheba - Dev Server
echo  ========================================
echo.

echo  Starting all apps...
echo.

:: Start all 3 apps in parallel with labeled output
start "Landing" cmd /k "cd apps\landing && title Landing - Port 3000 && color 0B && bun run dev"
start "Admin" cmd /k "cd apps\admin && title Admin - Port 3001 && color 0D && bun run dev"
start "API" cmd /k "cd apps\api && title API - Port 4000 && color 0E && bun run dev"

echo  All apps started! Three windows opened:
echo.
echo    Landing  -> http://localhost:3000
echo    Admin    -> http://localhost:3001
echo    API      -> http://localhost:4000
echo.
echo  Close this window or press any key to keep running...
echo.
pause >nul
