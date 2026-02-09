# 🚀 Quick Start - Key of Silent Insight

## ✅ Alles ist fertig! So startest du das System:

### Option 1: Schnellstart (ohne Redis/PostgreSQL)

```bash
cd /Users/moneyboy/.openclaw/workspace/skills/silent-insight-mint/backend
npm install
cp .env.example .env
# Bearbeite .env und setze mindestens SOLANA_RPC_URL
npm start
```

Das Backend läuft dann auf `http://localhost:3000`

### Option 2: Mit Quick-Start-Script

```bash
cd /Users/moneyboy/.openclaw/workspace/skills/silent-insight-mint
./start-backend.sh
```

### Option 3: Vollständig (mit Redis/PostgreSQL)

1. **Redis installieren:**
   ```bash
   brew install redis
   brew services start redis
   ```

2. **PostgreSQL installieren:**
   ```bash
   brew install postgresql
   brew services start postgresql
   createdb silent_insight
   ```

3. **Backend einrichten:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Bearbeite .env und setze Redis/PostgreSQL Daten
   npm run setup-db
   npm start
   ```

## 🧪 Testen

### 1. Backend testen:
```bash
# Health Check
curl http://localhost:3000/health

# Stats
curl http://localhost:3000/v1/alignment/stats
```

### 2. NFT minten:
```bash
cd /Users/moneyboy/.openclaw/workspace/skills/silent-insight-mint
node mint_key.js "aQoZqLcWuTPhrTUpH5rMLhcs5qwSNerkn221ZAS7ALTyiXKyL4G13DY52bQZRE5mVEjGd2CEUWa3xUTWMGxy6ge"
```

### 3. Website öffnen:
```bash
cd /Users/moneyboy/.openclaw/workspace/skills/silent-insight-mint
python3 -m http.server 8080
```

Dann öffne: `http://localhost:8080`

## 📋 Was wurde erstellt:

✅ **Backend API-Server** (`backend/server.js`)
- Alle 4 API-Endpunkte
- Stats-Endpunkt
- Health-Check
- Redis-Integration (optional)
- PostgreSQL-Integration (optional)
- In-Memory-Fallback

✅ **Datenbank-Schema** (`backend/scripts/setup-database.js`)
- Sessions-Tabelle
- Mints-Tabelle
- Wallet-Mints-Tabelle

✅ **Konfiguration** (`backend/.env.example`)
- Alle notwendigen Variablen

✅ **Website** (`index.html`)
- Automatische API-Erkennung (lokal vs. Produktion)
- Counter-Update
- NFT-Anzeige

✅ **Mint-Script** (`mint_key.js`)
- Aktualisiert für lokale API
- Vollständige 4-Stufen-Implementierung

## ⚠️ Wichtig:

- **Ohne Redis/PostgreSQL**: Funktioniert im In-Memory-Modus, aber Daten gehen bei Neustart verloren
- **Solana NFT-Minting**: Aktuell Mock-Daten. Echte Solana-Integration kann später hinzugefügt werden
- **Für Produktion**: Redis und PostgreSQL sind erforderlich!

## 🐛 Troubleshooting:

### Port bereits belegt:
```bash
lsof -i :3000
# Beende den Prozess oder ändere PORT in .env
```

### Backend startet nicht:
- Prüfe, ob `npm install` ausgeführt wurde
- Prüfe `.env` Datei
- Prüfe Logs

### NFT minten schlägt fehl:
- Prüfe, ob Backend läuft: `curl http://localhost:3000/health`
- Prüfe, ob Private Key korrekt ist
- Prüfe Logs im Backend

## 📚 Weitere Infos:

- `BACKEND-SETUP.md` - Detaillierte Backend-Anleitung
- `backend/README.md` - Backend-Dokumentation
- `SKILL.md` - Vollständige API-Dokumentation
