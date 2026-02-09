# 🚀 JETZT DEPLOYEN - Schritt für Schritt

## ✅ Vorbereitung abgeschlossen!

Alle Dateien sind bereit. Jetzt musst du nur noch:

## Schritt 1: GitHub Repository erstellen (falls noch nicht vorhanden)

1. Gehe zu: **https://github.com/new**
2. Repository Name: `silent-insight-mint` (oder anderer Name)
3. **Public** oder **Private** wählen
4. **"Create repository"**

## Schritt 2: Code zu GitHub pushen

```bash
cd /Users/moneyboy/.openclaw/workspace/skills/silent-insight-mint

# Falls noch kein Remote:
git remote add origin https://github.com/DEIN-USERNAME/silent-insight-mint.git

# Code pushen:
git branch -M main
git push -u origin main
```

## Schritt 3: Backend auf Railway deployen

1. **Gehe zu:** https://railway.app
2. **"Start a New Project"**
3. **Login** mit GitHub
4. **"New Project"** → **"Deploy from GitHub repo"**
5. **Wähle dein Repository:** `silent-insight-mint`
6. **Klicke auf dein Repository**
7. **"Add Service"** → **"GitHub Repo"** (nochmal)
8. **WICHTIG:** Setze **"Root Directory"** auf: `backend`
9. Railway erkennt automatisch `package.json` und startet Build

## Schritt 4: Environment Variables setzen

Klicke auf deinen Service → **"Variables"** Tab → **"New Variable"**

Füge diese Variablen hinzu (eine nach der anderen):

```
PORT=3000
```

```
NODE_ENV=production
```

```
CORS_ORIGIN=*
```

```
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

```
SOLANA_MINT_AUTHORITY_PRIVATE_KEY=aQoZqLcWuTPhrTUpH5rMLhcs5qwSNerkn221ZAS7ALTyiXKyL4G13DY52bQZRE5mVEjGd2CEUWa3xUTWMGxy6ge
```

```
MAX_SUPPLY=999
```

```
MAX_PER_WALLET=10
```

```
FREE_MINT_WALLET=54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7
```

```
SOL_RECIPIENT=54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7
```

```
COLLECTION_ENABLED=true
```

```
COLLECTION_NAME=THE KEY OF SILENT INSIGHT Collection
```

```
COLLECTION_SYMBOL=KEY
```

## Schritt 5: Domain generieren

1. Klicke auf deinen Service
2. Gehe zu **"Settings"** Tab
3. Scrolle zu **"Domains"**
4. Klicke **"Generate Domain"**
5. Du bekommst eine URL wie: `https://silent-insight-api.up.railway.app`

**Merke dir diese URL!** Das ist deine Backend-URL.

## Schritt 6: Backend testen

Öffne im Browser:
```
https://deine-railway-url.up.railway.app/health
```

Du solltest sehen:
```json
{"status":"ok","redis":"disconnected","postgres":"connected","solana":"connected"}
```

✅ **Backend ist jetzt öffentlich!**

## Schritt 7: Frontend anpassen

Öffne `index.html` und ändere die Backend URL:

**Finde diese Zeile (ca. Zeile 403):**
```javascript
const BACKEND_URL = window.BACKEND_API_URL || 'https://silent-insight-api.railway.app';
```

**Ändere zu deiner Railway URL:**
```javascript
const BACKEND_URL = window.BACKEND_API_URL || 'https://deine-railway-url.up.railway.app';
```

Oder füge am Anfang von `index.html` (im `<head>`) hinzu:
```html
<script>
  window.BACKEND_API_URL = 'https://deine-railway-url.up.railway.app';
</script>
```

## Schritt 8: Frontend auf Cloudflare Pages deployen

1. **Gehe zu:** https://pages.cloudflare.com
2. **"Create a project"** → **"Connect to Git"**
3. **Wähle GitHub** → Erlaube Zugriff
4. **Wähle dein Repository:** `silent-insight-mint`
5. **Build settings:**
   - **Project name:** `silent-insight` (oder anderer Name)
   - **Framework preset:** None
   - **Build command:** (leer lassen)
   - **Build output directory:** `/` (root)
6. **"Save and Deploy"**

Cloudflare gibt dir eine URL wie: `https://silent-insight.pages.dev`

## Schritt 9: Frontend mit Backend verbinden

Öffne `index.html` und stelle sicher, dass die Backend URL korrekt ist (siehe Schritt 7).

Dann committe und pushe:
```bash
git add index.html
git commit -m "Update backend URL for production"
git push
```

Cloudflare deployt automatisch neu!

## Schritt 10: CORS anpassen (falls nötig)

Falls du Fehler bekommst, passe Backend CORS an:

1. Gehe zu Railway → Dein Service → Variables
2. Ändere `CORS_ORIGIN` zu deiner Cloudflare URL:
   ```
   CORS_ORIGIN=https://silent-insight.pages.dev
   ```
3. Railway deployt automatisch neu

## ✅ FERTIG!

Jetzt ist alles öffentlich:
- 🌐 **Website:** `https://silent-insight.pages.dev`
- 🔧 **Backend:** `https://deine-railway-url.up.railway.app`
- 🎨 **Jeder kann jetzt NFTs minten!**

## Testen

1. Öffne deine Website
2. Verbinde Wallet (Phantom, Solflare, etc.)
3. Führe die 4 Alignment-Stufen durch
4. Mint ein NFT
5. Prüfe ob es auf Solana erstellt wurde!

## Hilfe

Falls Probleme:
- **Backend Logs:** Railway → Service → Deployments → View Logs
- **Frontend Console:** F12 im Browser → Console Tab
- **Health Check:** `https://deine-backend-url/health`

## Kosten

- **Railway:** Kostenlos bis 500 Stunden/Monat
- **Cloudflare Pages:** Komplett kostenlos
- **Gesamt:** $0/Monat! 🎉
