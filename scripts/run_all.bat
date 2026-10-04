@echo off
title Sentinel AI - Launch Both Services
echo ============================================================
echo   LAUNCHING SENTINEL AI PLATFORM (Backend + Frontend)
echo ============================================================
start "Sentinel AI Backend" "%~dp0start_backend.bat"
timeout /t 3 /nobreak >nul
start "Sentinel AI Frontend" "%~dp0start_frontend.bat"
echo Services launched! Frontend will open at http://localhost:3000
