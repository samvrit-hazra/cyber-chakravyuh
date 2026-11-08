@echo off
REM Cyber Chakravyuh - Start both Backend and Frontend on Windows
echo ==========================================
echo Starting Cyber Chakravyuh Full Stack
echo ==========================================

start "FastAPI Backend" cmd /k "cd backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"
start "Vite Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers launching in new windows!
echo    - Frontend: http://localhost:5173
echo    - Backend API Docs: http://localhost:8000/docs
echo.
pause
