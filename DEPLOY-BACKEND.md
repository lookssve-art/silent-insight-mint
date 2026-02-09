# 🚀 Backend öffentlich deployen - Schritt für Schritt

## Was ist das Backend?

**Das Backend ist der Server, der:**
- ✅ NFTs auf Solana erstellt
- ✅ Die 4 Alignment-Stufen durchführt
- ✅ Limits überwacht (999 NFTs max, 10 pro Wallet)
- ✅ Free Mint ermöglicht
- ✅ SOL an `54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7` sendet

**Ohne Backend = Keine NFTs möglich!**

## Schnellste Methode: Railway (5 Minuten)

### Schritt 1: Railway Account erstellen

1. Gehe zu: **https://railway.app**
2. Klicke auf **"Start a New Project"**
3. Login mit **GitHub** (empfohlen) oder Email

### Schritt 2: Projekt erstellen

1. Klicke auf **"New Project"**
2. Wähle **"Deploy from GitHub repo"**
3. Falls noch nicht verbunden: **"Configure GitHub App"** → Erlaube Zugriff
4. Wähle dein Repository: `silent-insight-mint`

### Schritt 3: Backend deployen

1. Railway zeigt deine Dateien
2. Klicke auf **"Add Service"** → **"GitHub Repo"**
3. Wähle wieder dein Repository
4. **WICHTIG:** Setze **"Root Directory"** auf: `backend`
5. Railway erkennt automatisch `package.json`

### Schritt 4: Environment Variables setzen

Klicke auf deinen Service → **"Variables"** → Füge hinzu:

```
PORT=3000
NODE_ENV=production
CORS_ORIGIN=*
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_MINT_AUTHORITY_PRIVATE_KEY=aQoZqLcWuTPhrTUpH5rMLhcs5qwSNerkn221ZAS7ALTyiXKyL4G13DY52bQZRE5mVEjGd2CEUWa3xUTWMGxy6ge
MAX_SUPPLY=999
MAX_PER_WALLET=10
FREE_MINT_WALLET=54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7
SOL_RECIPIENT=54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7
COLLECTION_ENABLED=true
COLLECTION_NAME=THE KEY OF SILENT INSIGHT Collection
COLLECTION_SYMBOL=KEY
```

### Schritt 5: Deploy!

1. Railway startet automatisch den Build
2. Warte bis **"Deploy Successful"** erscheint
3. Klicke auf **"Settings"** → **"Generate Domain"**
4. Du bekommst eine URL wie: `https://silent-insight-api.railway.app`

### Schritt 6: Testen

Öffne im Browser:
```
https://deine-railway-url.railway.app/health
```

Du solltest sehen:
```json
{"status":"ok","redis":"disconnected","postgres":"connected","solana":"connected"}
```

## ✅ Backend ist jetzt öffentlich!

**Deine Backend URL:** `https://deine-railway-url.railway.app`

## Nächste Schritte

1. **Frontend anpassen:** Ändere die Backend URL in `index.html`
2. **Frontend deployen:** Auf Cloudflare Pages oder Vercel
3. **Testen:** Öffne Website und mint ein NFT!

Siehe `QUICK-DEPLOY.md` für vollständige Anleitung!

## Alternative: Render (auch kostenlos)

1. Gehe zu: **https://render.com**
2. **"New +"** → **"Web Service"**
3. Verbinde GitHub Repository
4. Settings:
   - **Name:** `silent-insight-api`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Environment Variables hinzufügen (wie oben)
6. **"Create Web Service"**

## Alternative: Fly.io

```bash
# Installiere Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Im backend/ Ordner:
cd backend
fly launch
# Folge den Anweisungen

# Deploy
fly deploy
```

## Wichtige Hinweise

⚠️ **Sicherheit:**
- Private Keys sind sicher in Environment Variables gespeichert
- Niemals Private Keys im Code committen!
- Backend sollte Rate Limiting haben (später hinzufügen)

💰 **Kosten:**
- Railway: Kostenlos bis 500 Stunden/Monat
- Render: Kostenlos mit Limits
- Fly.io: Kostenlos mit Limits

## Hilfe

Falls Probleme:
1. Prüfe Railway Logs: Service → "Deployments" → "View Logs"
2. Prüfe ob Environment Variables gesetzt sind
3. Prüfe ob Port 3000 korrekt ist
4. Prüfe Backend Health Endpoint
