@echo off
title Sentinel AI - FastAPI Backend Server
echo ============================================================
echo   STARTING SENTINEL AI BACKEND API (Port 8000)
echo   FastAPI + PyTorch MobileNetV2 + Copernicus + Gemini
echo ============================================================
cd /d "%~dp0..\backend"
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
pause
