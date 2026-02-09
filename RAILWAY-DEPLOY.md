# 🚀 Railway Deployment - Schnellstart

## Backend auf Railway deployen (5 Minuten)

### 1. Railway Account
- Gehe zu: https://railway.app
- Login mit GitHub

### 2. Neues Projekt
- "New Project" → "Deploy from GitHub repo"
- Wähle Repository: silent-insight-mint

### 3. Service hinzufügen
- "Add Service" → "GitHub Repo"
- Root Directory: `backend`
- Railway startet automatisch Build

### 4. Environment Variables
Klicke auf Service → "Variables" → Füge hinzu:

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

### 5. Domain generieren
- Settings → Domains → "Generate Domain"
- Merke dir die URL!

### 6. Testen
Öffne: `https://deine-url.up.railway.app/health`

✅ Backend ist öffentlich!
