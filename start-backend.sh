#!/bin/bash
# Quick Start Script für das Backend

echo "🔑 Key of Silent Insight - Backend Start"
echo ""

cd "$(dirname "$0")/backend"

# Prüfe ob node_modules existiert
if [ ! -d "node_modules" ]; then
    echo "📦 Installiere Dependencies..."
    npm install
fi

# Prüfe ob .env existiert
if [ ! -f ".env" ]; then
    echo "⚙️  Erstelle .env aus .env.example..."
    cp .env.example .env
    echo ""
    echo "⚠️  WICHTIG: Bearbeite .env und setze mindestens:"
    echo "   - SOLANA_RPC_URL"
    echo ""
    read -p "Drücke Enter zum Fortfahren..."
fi

echo ""
echo "🚀 Starte Backend-Server..."
echo "   API: http://localhost:3000/v1"
echo "   Health: http://localhost:3000/health"
echo ""
echo "Drücke Ctrl+C zum Beenden"
echo ""

npm start
