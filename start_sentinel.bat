@echo off
title SENTINEL AI - Startup Launcher
color 0A

echo =========================================================
echo       SENTINEL AI - PADDY CROP INTELLIGENCE PLATFORM
echo               Chennai Institute of Technology
echo =========================================================
echo.

cd /d "C:\Users\Thilak Ram\OneDrive\Desktop\ML PROJECT 1"

echo [1/3] Starting FastAPI ML Backend on Port 8000...
start "Sentinel AI - Backend Server" cmd /k "cd backend && python -m uvicorn main:app --port 8000"

timeout /t 3 /nobreak >nul

echo [2/3] Starting Next.js Web Frontend on Port 3000...
start "Sentinel AI - Frontend Server" cmd /k "cd frontend && npm run dev"

timeout /t 4 /nobreak >nul

echo [3/3] Launching Web Browser at http://localhost:3000...
start http://localhost:3000

echo.
echo =========================================================
echo   Sentinel AI is LIVE! You can now use the website.
echo   Press any key to close this launcher window.
echo =========================================================
pause >nul
