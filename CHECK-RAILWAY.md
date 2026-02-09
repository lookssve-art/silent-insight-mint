# ✅ Railway Projekt prüfen

## Checkliste für Railway Deployment:

### 1. Service Konfiguration
- [ ] Service existiert
- [ ] Root Directory ist auf `backend` gesetzt
- [ ] Build läuft erfolgreich durch
- [ ] Keine Build-Fehler

### 2. Environment Variables
Prüfe ob diese gesetzt sind:
- [ ] PORT=3000
- [ ] NODE_ENV=production
- [ ] CORS_ORIGIN=*
- [ ] SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
- [ ] SOLANA_MINT_AUTHORITY_PRIVATE_KEY=aQoZqLcWuTPhrTUpH5rMLhcs5qwSNerkn221ZAS7ALTyiXKyL4G13DY52bQZRE5mVEjGd2CEUWa3xUTWMGxy6ge
- [ ] MAX_SUPPLY=999
- [ ] MAX_PER_WALLET=10
- [ ] FREE_MINT_WALLET=54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7
- [ ] SOL_RECIPIENT=54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7
- [ ] COLLECTION_ENABLED=true
- [ ] COLLECTION_NAME=THE KEY OF SILENT INSIGHT Collection
- [ ] COLLECTION_SYMBOL=KEY

### 3. Domain
- [ ] Domain wurde generiert
- [ ] Domain ist aktiv
- [ ] Health Endpoint funktioniert: https://deine-url.up.railway.app/health

### 4. Logs
- [ ] Keine Crash-Fehler
- [ ] Server startet erfolgreich
- [ ] Siehst du: "Key of Silent Insight API Server running"

## Was zu prüfen ist:

1. **Service Status:** Läuft der Service oder crasht er?
2. **Logs:** Was steht in den Logs?
3. **Domain:** Welche URL wurde generiert?
4. **Health Check:** Funktioniert /health Endpoint?

