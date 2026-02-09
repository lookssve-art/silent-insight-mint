# 🚀 Backend Setup - Komplette Anleitung

## ✅ Was wurde erstellt:

1. **Backend API-Server** (`backend/server.js`)
   - Express.js Server
   - Alle 4 API-Endpunkte implementiert
   - Stats-Endpunkt für Counter
   - Health-Check

2. **Datenbank-Schema** (`backend/scripts/setup-database.js`)
   - PostgreSQL-Tabellen
   - Indizes für Performance

3. **Konfiguration** (`backend/.env.example`)
   - Alle notwendigen Umgebungsvariablen

## 📋 Setup-Schritte:

### Schritt 1: Backend-Dependencies installieren

```bash
cd /Users/moneyboy/.openclaw/workspace/skills/silent-insight-mint/backend
npm install
```

### Schritt 2: Umgebungsvariablen konfigurieren

```bash
cp .env.example .env
```

Bearbeite `.env` und setze mindestens:
```env
PORT=3000
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

### Schritt 3: Redis installieren (optional, aber empfohlen)

**macOS:**
```bash
brew install redis
brew services start redis
```

**Linux:**
```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

**Windows:**
- Download von: https://redis.io/download
- Oder Docker: `docker run -d -p 6379:6379 redis`

### Schritt 4: PostgreSQL installieren (optional, aber empfohlen)

**macOS:**
```bash
brew install postgresql
brew services start postgresql
createdb silent_insight
```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb silent_insight
```

**Windows:**
- Download von: https://www.postgresql.org/download/windows/
- Oder Docker: `docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres`

### Schritt 5: Datenbank einrichten

```bash
cd backend
npm run setup-db
```

### Schritt 6: Backend starten

```bash
# Development (mit Auto-Reload)
npm run dev

# Oder Production
npm start
```

Der Server sollte jetzt auf `http://localhost:3000` laufen.

### Schritt 7: Testen

```bash
# Health Check
curl http://localhost:3000/health

# Stats
curl http://localhost:3000/v1/alignment/stats
```

### Schritt 8: NFT minten testen

```bash
cd ..
node mint_key.js "aQoZqLcWuTPhrTUpH5rMLhcs5qwSNerkn221ZAS7ALTyiXKyL4G13DY52bQZRE5mVEjGd2CEUWa3xUTWMGxy6ge"
```

## 🔧 Konfiguration

### Minimal (ohne Redis/PostgreSQL):
```env
PORT=3000
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

### Vollständig (mit Redis/PostgreSQL):
```env
PORT=3000
REDIS_HOST=localhost
REDIS_PORT=6379
DB_HOST=localhost
DB_PORT=5432
DB_NAME=silent_insight
DB_USER=postgres
DB_PASSWORD=postgres
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

## ⚠️ Wichtig:

- **Ohne Redis/PostgreSQL**: Der Server funktioniert im In-Memory-Modus, aber Daten gehen bei Neustart verloren!
- **Für Produktion**: Redis und PostgreSQL sind erforderlich!
- **Solana RPC**: Verwende einen eigenen RPC-Provider für bessere Performance (z.B. Helius, QuickNode)

## 🐛 Troubleshooting

### Port bereits belegt:
```bash
# Prüfe, was auf Port 3000 läuft
lsof -i :3000

# Beende den Prozess oder ändere PORT in .env
```

### Redis-Verbindungsfehler:
- Prüfe, ob Redis läuft: `redis-cli ping`
- Falls nicht: `brew services start redis` (macOS)

### PostgreSQL-Verbindungsfehler:
- Prüfe, ob PostgreSQL läuft: `pg_isready`
- Falls nicht: `brew services start postgresql` (macOS)

## 📝 Nächste Schritte:

1. Backend starten
2. NFT minten testen
3. Website mit Backend verbinden (API-URL aktualisieren)
4. Deployment vorbereiten
