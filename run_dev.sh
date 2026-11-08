#!/usr/bin/env bash
# Cyber Chakravyuh - Start both Backend and Frontend

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "=========================================="
echo "🛡️  Starting Cyber Chakravyuh Full Stack"
echo "=========================================="

cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $(jobs -p) 2>/dev/null || true
}
trap cleanup EXIT

echo "1. Starting FastAPI Backend (Groq AI) on http://localhost:8000..."
cd "$DIR/backend"
./venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

echo "2. Starting Vite Frontend on http://localhost:5173..."
cd "$DIR/frontend"
npm run dev -- --host 0.0.0.0 --port 5173 &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers running!"
echo "   - Frontend: http://localhost:5173"
echo "   - Backend API Docs: http://localhost:8000/docs"
echo "Press Ctrl+C to stop both."
echo ""

wait
