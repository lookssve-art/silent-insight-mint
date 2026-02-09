# 🔍 Railway Projekt prüfen

## Dein Railway Projekt:
https://railway.com/project/2c99a780-df55-45a5-90bd-ecca0c754776

## ✅ Was zu prüfen ist:

### 1. Service Status
- Öffne das Railway Dashboard
- Prüfe ob der Service läuft oder gecrasht ist
- Status sollte "Running" sein

### 2. Root Directory
- Klicke auf den Service
- Gehe zu "Settings"
- Prüfe ob "Root Directory" auf `backend` gesetzt ist
- Falls nicht: Ändere zu `backend` und redeploy

### 3. Environment Variables
- Klicke auf den Service → "Variables" Tab
- Prüfe ob alle Variablen gesetzt sind (siehe unten)
- Falls fehlend: Füge sie hinzu

### 4. Domain
- Settings → "Domains"
- Prüfe ob eine Domain generiert wurde
- Falls nicht: Klicke "Generate Domain"
- **Merke dir die URL!**

### 5. Logs
- Service → "View Logs"
- Prüfe auf Fehler
- Suche nach: "Key of Silent Insight API Server running"

### 6. Health Check
- Öffne: `https://deine-railway-url.up.railway.app/health`
- Sollte zurückgeben:
  ```json
  {"status":"ok","redis":"disconnected","postgres":"connected","solana":"connected"}
  ```

## 📋 Environment Variables Checkliste:

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

## 🔧 Häufige Probleme:

### Problem: Service crasht
**Lösung:** 
- Prüfe Logs für Fehlermeldungen
- Stelle sicher dass Root Directory = `backend` ist
- Prüfe Environment Variables

### Problem: Build fehlgeschlagen
**Lösung:**
- Prüfe ob `package.json` im `backend/` Ordner existiert
- Stelle sicher dass Root Directory = `backend` ist

### Problem: Health Check gibt Fehler
**Lösung:**
- Prüfe ob Server läuft (Logs)
- Prüfe ob PORT Variable gesetzt ist
- Prüfe ob Domain korrekt ist

## 📞 Nächste Schritte:

Nach erfolgreicher Prüfung:
1. Merke dir die Railway URL
2. Passe Frontend an (Backend URL in index.html)
3. Deploy Frontend auf Cloudflare Pages
