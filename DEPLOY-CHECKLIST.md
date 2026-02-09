# ✅ Deployment Checkliste

## Status: Bereit für Deployment!

### ✅ Erledigt:
- [x] Git Repository initialisiert
- [x] Alle Dateien committet
- [x] Backend Code vorbereitet
- [x] Frontend Code vorbereitet
- [x] Railway Config erstellt (`railway.json`)
- [x] Procfile erstellt
- [x] Environment Variables dokumentiert
- [x] Deployment-Anleitungen erstellt

### ⏳ Noch zu tun:

#### 1. GitHub Repository erstellen
- [ ] Gehe zu: https://github.com/new
- [ ] Repository Name: `silent-insight-mint`
- [ ] Public wählen
- [ ] Create repository

#### 2. Code zu GitHub pushen
```bash
cd /Users/moneyboy/.openclaw/workspace/skills/silent-insight-mint
git remote add origin https://github.com/DEIN-USERNAME/silent-insight-mint.git
git push -u origin main
```

#### 3. Backend auf Railway deployen
- [ ] Gehe zu: https://railway.app
- [ ] Login mit GitHub
- [ ] New Project → Deploy from GitHub repo
- [ ] Wähle Repository
- [ ] Root Directory: `backend`
- [ ] Environment Variables setzen (siehe unten)
- [ ] Domain generieren

#### 4. Frontend auf Cloudflare Pages deployen
- [ ] Gehe zu: https://pages.cloudflare.com
- [ ] Create project → Connect to Git
- [ ] Wähle Repository
- [ ] Build output: `/`
- [ ] Deploy

#### 5. Frontend mit Backend verbinden
- [ ] Backend URL in `index.html` anpassen
- [ ] Committen und pushen
- [ ] Testen!

## Environment Variables für Railway:

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

## Nächster Schritt:

**Öffne:** https://github.com/new

Dann folge `README-DEPLOY.md` für die vollständige Anleitung!
