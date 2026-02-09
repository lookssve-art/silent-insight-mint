# ✅ Cloudflare Pages Deployment Checklist

## Schritt-für-Schritt Anleitung

### 1. Dateien prüfen
- [ ] `index.html` existiert
- [ ] `orb-video.mp4` existiert
- [ ] Beide Dateien sind im selben Ordner

### 2. Cloudflare Pages Upload
- [ ] Gehe zu: https://dash.cloudflare.com/
- [ ] Klicke auf "Pages" → "Create a project"
- [ ] Wähle "Upload assets"
- [ ] **WICHTIG:** Ziehe BEIDE Dateien gleichzeitig hoch:
  - `index.html`
  - `orb-video.mp4`
- [ ] Projektname: `key-of-silent-insight` (oder ähnlich)
- [ ] Klicke auf "Deploy"

### 3. Nach dem Deployment
- [ ] Warte 1-2 Minuten
- [ ] Klicke auf "View deployment"
- [ ] Die URL sollte sein: `https://key-of-silent-insight.pages.dev`

### 4. Häufige Probleme

**Problem: Weißer Bildschirm**
- Lösung: Prüfe Browser-Konsole (F12) auf Fehler
- Lösung: Stelle sicher, dass beide Dateien hochgeladen wurden

**Problem: Video lädt nicht**
- Lösung: Prüfe, ob `orb-video.mp4` wirklich hochgeladen wurde
- Lösung: Prüfe Browser-Netzwerk-Tab (F12 → Network)

**Problem: 404 Fehler**
- Lösung: Stelle sicher, dass die Datei `index.html` heißt (nicht `Index.html` oder `INDEX.HTML`)

**Problem: Website lädt endlos**
- Lösung: Prüfe Cloudflare Dashboard → Deployments → Logs
- Lösung: Versuche ein neues Deployment

### 5. Test lokal
Falls Cloudflare nicht funktioniert, teste lokal:
```bash
cd /Users/moneyboy/.openclaw/workspace/skills/silent-insight-mint
python3 -m http.server 8080
```
Dann öffne: http://localhost:8080

### 6. Support
Falls nichts funktioniert:
- Prüfe Cloudflare Dashboard → Deployments → Logs
- Prüfe Browser-Konsole (F12)
- Stelle sicher, dass beide Dateien hochgeladen wurden
