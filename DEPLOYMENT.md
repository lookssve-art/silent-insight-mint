# Deployment Guide - Öffentliches Hosting

## Was ist das Backend?

Das **Backend** ist der API-Server, der:
- Die NFT-Minting-Logik verwaltet
- Mit der Solana Blockchain kommuniziert
- Die Alignment-Protokolle (4 Stufen) durchführt
- Die Limits (999 NFTs max, 10 pro Wallet) überwacht
- Free Mint für bestimmtes Wallet ermöglicht

**Ohne Backend kann niemand NFTs minten!**

## Deployment-Optionen

### Option 1: Railway (Empfohlen - Einfach & Kostenlos)

Railway bietet kostenloses Hosting für Node.js Apps.

#### Setup:

1. **Railway Account erstellen:**
   - Gehe zu https://railway.app
   - Melde dich mit GitHub an

2. **Neues Projekt erstellen:**
   - Klicke auf "New Project"
   - Wähle "Deploy from GitHub repo"
   - Verbinde dein GitHub Repository

3. **Backend deployen:**
   - Wähle den `backend/` Ordner als Root
   - Railway erkennt automatisch `package.json`
   - Setze Environment Variables (siehe unten)

4. **Environment Variables setzen:**
   ```
   PORT=3000
   SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
   SOLANA_MINT_AUTHORITY_PRIVATE_KEY=<dein_private_key>
   MAX_SUPPLY=999
   MAX_PER_WALLET=10
   FREE_MINT_WALLET=54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7
   SOL_RECIPIENT=54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7
   ```

5. **Domain zuweisen:**
   - Railway gibt dir eine `.railway.app` Domain
   - Oder verbinde deine eigene Domain

### Option 2: Render (Kostenlos)

1. Gehe zu https://render.com
2. Erstelle neuen "Web Service"
3. Verbinde GitHub Repository
4. Root Directory: `backend`
5. Build Command: `npm install`
6. Start Command: `npm start`
7. Setze Environment Variables

### Option 3: Fly.io (Kostenlos)

1. Installiere Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Login: `fly auth login`
3. Erstelle App: `fly launch` im `backend/` Ordner
4. Deploy: `fly deploy`

### Option 4: Vercel (Für Frontend + Backend)

Vercel kann sowohl Frontend als auch Backend hosten.

## Frontend Deployment

Die Website (`index.html`) muss auch öffentlich sein:

### Option A: Cloudflare Pages (Kostenlos)

1. Gehe zu https://pages.cloudflare.com
2. Verbinde GitHub Repository
3. Build Command: (leer lassen, ist statisch)
4. Output Directory: `/` (root)
5. Deploy!

### Option B: Vercel (Kostenlos)

1. Gehe zu https://vercel.com
2. Import GitHub Repository
3. Framework Preset: "Other"
4. Root Directory: `/`
5. Deploy!

### Option C: Netlify (Kostenlos)

1. Gehe zu https://netlify.com
2. Drag & Drop den Ordner
3. Oder verbinde GitHub

## Wichtige Konfiguration

### Backend API URL in Frontend

Nach dem Deployment musst du die API URL im Frontend anpassen:

**In `index.html` und `mint_key.js`:**
```javascript
// Ändere von:
const apiBase = 'http://localhost:3000/v1';

// Zu:
const apiBase = 'https://deine-backend-url.com/v1';
```

### CORS Konfiguration

Das Backend muss CORS für deine Frontend-Domain erlauben:

**In `backend/server.js`:**
```javascript
app.use(cors({
  origin: ['https://deine-website.com', 'https://www.deine-website.com'],
  credentials: true
}));
```

## Vollständiges Setup Beispiel

### 1. Backend auf Railway deployen
- URL: `https://silent-insight-api.railway.app`

### 2. Frontend auf Cloudflare Pages deployen
- URL: `https://key-of-silent-insight.pages.dev`

### 3. Frontend anpassen
- API URL: `https://silent-insight-api.railway.app/v1`

### 4. Backend CORS anpassen
- Erlaube: `https://key-of-silent-insight.pages.dev`

## Sicherheit

⚠️ **WICHTIG:**
- Private Keys NIE im Frontend-Code speichern!
- Private Keys nur im Backend (Environment Variables)
- Backend sollte Rate Limiting haben
- Backend sollte nur von deiner Frontend-Domain erreichbar sein

## Testing

Nach dem Deployment:
1. Öffne deine Website
2. Versuche ein NFT zu minten
3. Prüfe Backend Logs für Fehler
4. Prüfe ob NFTs auf Solana erstellt werden

## Kosten

- **Railway:** Kostenlos bis 500 Stunden/Monat, dann $5/Monat
- **Render:** Kostenlos mit Limits
- **Fly.io:** Kostenlos mit Limits
- **Cloudflare Pages:** Komplett kostenlos
- **Vercel:** Komplett kostenlos

## Nächste Schritte

1. Wähle einen Hosting-Provider
2. Deploy Backend
3. Deploy Frontend
4. Verbinde Frontend mit Backend
5. Teste öffentliches Minting
