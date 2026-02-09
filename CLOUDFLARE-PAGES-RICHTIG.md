# ✅ Cloudflare Pages - RICHTIGE Anleitung

## ⚠️ WICHTIG: Du bist im falschen Bereich!

Du bist aktuell bei **Cloudflare Workers** - das ist für dynamische Apps.
Für deine Website brauchst du **Cloudflare Pages** (für statische Websites).

## 📍 So kommst du zu Cloudflare Pages:

### Schritt 1: Navigation
1. Gehe zum Cloudflare Dashboard: https://dash.cloudflare.com/
2. Im **linken Menü** findest du verschiedene Bereiche
3. Suche nach **"Pages"** (nicht "Workers"!)
4. Klicke auf **"Pages"**

### Schritt 2: Neues Projekt erstellen
1. Klicke auf **"Create a project"** (oder "Create application")
2. Wähle **"Upload assets"** (nicht "Connect to Git")
3. Du siehst jetzt ein Drag & Drop Feld

### Schritt 3: Dateien hochladen
1. Ziehe diese **BEIDEN** Dateien per Drag & Drop hoch:
   - `index.html`
   - `orb-video.mp4`
2. **WICHTIG:** Beide Dateien müssen gleichzeitig hochgeladen werden!

### Schritt 4: Projekt konfigurieren
1. **Project name:** `key-of-silent-insight` (oder ähnlich)
2. **Production branch:** (kann leer bleiben)
3. Klicke auf **"Deploy site"**

### Schritt 5: Warten und testen
1. Warte 1-2 Minuten
2. Klicke auf **"View deployment"**
3. Deine Website sollte jetzt unter `https://key-of-silent-insight.pages.dev` erreichbar sein

## 🔍 Unterschied zwischen Workers und Pages:

- **Workers:** Für dynamische Apps, APIs, Serverless Functions
- **Pages:** Für statische Websites (HTML, CSS, JS, Videos, Bilder)

## ✅ Was du sehen solltest:

Nach erfolgreichem Deployment siehst du:
- Eine grüne Erfolgsmeldung
- Eine URL wie: `https://key-of-silent-insight.pages.dev`
- Die Website sollte sofort funktionieren

## 🆘 Falls du Pages nicht findest:

1. Prüfe, ob du einen kostenlosen Cloudflare Account hast
2. Gehe direkt zu: https://dash.cloudflare.com/pages
3. Falls du dort nichts siehst, erstelle einen neuen Account
