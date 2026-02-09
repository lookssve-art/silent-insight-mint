#!/bin/bash
# Script zum Einrichten einer lokalen Domain für Key of Silent Insight

echo "🔑 Key of Silent Insight - Lokale Domain Setup"
echo ""

# Prüfe ob bereits in /etc/hosts vorhanden
if grep -q "keyofsilentinsights.local" /etc/hosts 2>/dev/null; then
    echo "✅ Domain bereits in /etc/hosts vorhanden"
else
    echo "📝 Füge Domain zu /etc/hosts hinzu..."
    echo ""
    echo "Bitte führe diesen Befehl aus (benötigt sudo):"
    echo "sudo sh -c 'echo \"127.0.0.1 keyofsilentinsights.local\" >> /etc/hosts'"
    echo ""
fi

echo ""
echo "🌐 Starte lokalen Server auf Port 8080..."
echo "Die Website ist dann erreichbar unter:"
echo "   http://keyofsilentinsights.local:8080"
echo ""
echo "Drücke Ctrl+C zum Beenden"
echo ""

cd "$(dirname "$0")"
python3 -m http.server 8080
