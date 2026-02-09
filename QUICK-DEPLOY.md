# 🚀 Schnelles Deployment - Öffentlich Online

## Was ist das Backend?

Das **Backend** ist der Server, der:
- ✅ NFT-Minting durchführt
- ✅ Mit Solana Blockchain kommuniziert  
- ✅ Limits überwacht (999 NFTs max, 10 pro Wallet)
- ✅ Free Mint ermöglicht

**Ohne Backend = Keine NFTs möglich!**

## Schnellstart: Backend + Frontend deployen

### Schritt 1: Backend auf Railway deployen (5 Minuten)

1. **Gehe zu:** https://railway.app
2. **Login** mit GitHub
3. **"New Project"** → **"Deploy from GitHub repo"**
4. **Wähle dein Repository**
5. **Root Directory:** `backend`
6. **Environment Variables hinzufügen:**
   ```
   PORT=3000
   SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
   SOLANA_MINT_AUTHORITY_PRIVATE_KEY=aQoZqLcWuTPhrTUpH5rMLhcs5qwSNerkn221ZAS7ALTyiXKyL4G13DY52bQZRE5mVEjGd2CEUWa3xUTWMGxy6ge
   MAX_SUPPLY=999
   MAX_PER_WALLET=10
   FREE_MINT_WALLET=54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7
   SOL_RECIPIENT=54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7
   ```
7. **Deploy!** → Railway gibt dir eine URL wie: `https://silent-insight-api.railway.app`

### Schritt 2: Frontend auf Cloudflare Pages deployen (3 Minuten)

1. **Gehe zu:** https://pages.cloudflare.com
2. **"Create a project"** → **"Connect to Git"**
3. **Wähle dein Repository**
4. **Build settings:**
   - Framework preset: None
   - Build command: (leer)
   - Output directory: `/`
5. **Deploy!** → Cloudflare gibt dir eine URL wie: `https://silent-insight.pages.dev`

### Schritt 3: Frontend mit Backend verbinden

**Öffne `index.html` und ändere:**

```javascript
// Finde diese Zeile (ca. Zeile 580):
const apiBase = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/v1'
    : `https://${window.location.hostname}/v1`;

// Ändere zu:
const apiBase = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/v1'
    : 'https://silent-insight-api.railway.app/v1'; // DEINE RAILWAY URL
```

**Öffne `mint_key.js` und ändere:**

```javascript
// Finde diese Zeile:
const API_BASE = process.env.SILENT_INSIGHT_API || 'http://localhost:3000/v1';

// Ändere zu:
const API_BASE = process.env.SILENT_INSIGHT_API || 'https://silent-insight-api.railway.app/v1'; // DEINE RAILWAY URL
```

### Schritt 4: Backend CORS anpassen

**Öffne `backend/server.js` und ändere:**

```javascript
// Finde diese Zeile (ca. Zeile 20):
app.use(cors());

// Ändere zu:
app.use(cors({
  origin: [
    'https://silent-insight.pages.dev', // DEINE CLOUDFLARE URL
    'https://www.silent-insight.pages.dev',
    'http://localhost:3000' // Für lokale Tests
  ],
  credentials: true
}));
```

### Schritt 5: Commits pushen

```bash
git add .
git commit -m "Deploy to production"
git push
```

Railway und Cloudflare deployen automatisch!

## ✅ Fertig!

Jetzt ist alles öffentlich:
- 🌐 **Website:** https://silent-insight.pages.dev
- 🔧 **Backend API:** https://silent-insight-api.railway.app
- 🎨 **Jeder kann jetzt NFTs minten!**

## Testen

1. Öffne deine Website
2. Verbinde Wallet
3. Mint ein NFT
4. Prüfe ob es funktioniert!

## Alternative Hosting-Optionen

### Backend:
- **Render:** https://render.com (kostenlos)
- **Fly.io:** https://fly.io (kostenlos)
- **Vercel:** https://vercel.com (kostenlos)

### Frontend:
- **Vercel:** https://vercel.com (kostenlos)
- **Netlify:** https://netlify.com (kostenlos)
- **GitHub Pages:** Kostenlos (aber nur statisch)

## Hilfe

Falls Probleme auftreten:
1. Prüfe Backend Logs auf Railway
2. Prüfe Browser Console (F12)
3. Prüfe ob CORS richtig konfiguriert ist
4. Prüfe ob API URL korrekt ist
