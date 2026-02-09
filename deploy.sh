#!/bin/bash

# Deployment Script für Silent Insight Mint
# Führt die notwendigen Schritte für das Deployment durch

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🚀 Silent Insight Mint - Deployment Script"
echo "=========================================="
echo ""

# Prüfe Git Status
if [ ! -d ".git" ]; then
    echo "❌ Kein Git Repository gefunden!"
    exit 1
fi

echo "✅ Git Repository gefunden"
echo ""

# Prüfe ob Remote existiert
REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "")

if [ -z "$REMOTE_URL" ]; then
    echo "⚠️  Kein GitHub Remote konfiguriert"
    echo ""
    echo "📋 Nächste Schritte:"
    echo ""
    echo "1. Erstelle GitHub Repository:"
    echo "   → https://github.com/new"
    echo "   → Name: silent-insight-mint"
    echo "   → Public"
    echo ""
    echo "2. Dann führe aus:"
    echo "   git remote add origin https://github.com/DEIN-USERNAME/silent-insight-mint.git"
    echo "   git push -u origin main"
    echo ""
    echo "3. Oder gib deinen GitHub Username ein:"
    read -p "GitHub Username: " GITHUB_USER
    
    if [ ! -z "$GITHUB_USER" ]; then
        echo ""
        echo "🔗 Füge Remote hinzu..."
        git remote add origin "https://github.com/$GITHUB_USER/silent-insight-mint.git" 2>/dev/null || \
        git remote set-url origin "https://github.com/$GITHUB_USER/silent-insight-mint.git"
        
        echo "✅ Remote hinzugefügt: https://github.com/$GITHUB_USER/silent-insight-mint.git"
        echo ""
        echo "⚠️  Stelle sicher, dass das Repository auf GitHub existiert!"
        echo "   → https://github.com/new"
        echo ""
        read -p "Drücke Enter wenn Repository erstellt ist, oder Ctrl+C zum Abbrechen..."
        
        echo ""
        echo "📤 Pushe Code zu GitHub..."
        git push -u origin main || {
            echo ""
            echo "❌ Push fehlgeschlagen!"
            echo "   Stelle sicher, dass:"
            echo "   1. Repository auf GitHub existiert"
            echo "   2. Du eingeloggt bist"
            echo "   3. Repository Name korrekt ist"
            exit 1
        }
        
        echo ""
        echo "✅ Code erfolgreich zu GitHub gepusht!"
    fi
else
    echo "✅ GitHub Remote gefunden: $REMOTE_URL"
    echo ""
    echo "📤 Pushe Code zu GitHub..."
    git push -u origin main || {
        echo ""
        echo "⚠️  Push fehlgeschlagen oder bereits aktuell"
    }
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "✅ Code ist auf GitHub!"
echo ""
echo "📋 Nächste Schritte:"
echo ""
echo "1️⃣  Backend auf Railway deployen:"
echo "   → https://railway.app"
echo "   → New Project → Deploy from GitHub repo"
echo "   → Root Directory: backend"
echo "   → Environment Variables setzen (siehe README-DEPLOY.md)"
echo ""
echo "2️⃣  Frontend auf Cloudflare Pages deployen:"
echo "   → https://pages.cloudflare.com"
echo "   → Create project → Connect to Git"
echo "   → Build output: /"
echo ""
echo "📚 Vollständige Anleitung: README-DEPLOY.md"
echo "═══════════════════════════════════════════════════════════"
