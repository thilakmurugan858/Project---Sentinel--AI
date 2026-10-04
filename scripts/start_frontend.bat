@echo off
title Sentinel AI - Next.js Startup Frontend
echo ============================================================
echo   STARTING SENTINEL AI FRONTEND (Port 3000)
echo   Next.js 14 + Tailwind CSS + Lucide Icons
echo ============================================================
cd /d "%~dp0..\frontend"
npm run dev
pause
