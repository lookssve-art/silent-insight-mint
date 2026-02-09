# Cloudflare Pages - Häufige Probleme und Lösungen

## Problem: Website öffnet nicht

### Lösung 1: Dateien-Struktur prüfen
Stelle sicher, dass beide Dateien im Root-Verzeichnis sind:
- `index.html` (muss genau so heißen!)
- `orb-video.mp4`

### Lösung 2: Video-Pfad prüfen
Das Video sollte mit relativem Pfad referenziert sein: `orb-video.mp4`

### Lösung 3: Deployment-Logs prüfen
1. Gehe zu Cloudflare Dashboard
2. Klicke auf dein Projekt
3. Gehe zu "Deployments"
4. Klicke auf das neueste Deployment
5. Prüfe die Logs auf Fehler

### Lösung 4: Browser-Konsole prüfen
1. Öffne die Website
2. Drücke F12 (Developer Tools)
3. Gehe zu "Console"
4. Schaue nach Fehlermeldungen

### Lösung 5: Cache leeren
- Drücke Ctrl+Shift+R (Windows/Linux)
- Oder Cmd+Shift+R (Mac)

### Lösung 6: Manuelles Deployment
Falls Upload nicht funktioniert:
1. Erstelle einen GitHub Account
2. Erstelle ein neues Repository
3. Lade die Dateien hoch
4. Verbinde Cloudflare Pages mit GitHub
5. Deploy automatisch

## Was sollte funktionieren:
- Die Website sollte unter `https://dein-projekt-name.pages.dev` erreichbar sein
- Das Video sollte automatisch abgespielt werden
- Der Counter sollte angezeigt werden
