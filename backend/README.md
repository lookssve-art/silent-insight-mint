# Key of Silent Insight - Backend API

Backend-Server für das "Key of Silent Insight" NFT-Minting-System mit vierstufigem Alignment-Protokoll.

## 🚀 Schnellstart

### 1. Dependencies installieren

```bash
cd backend
npm install
```

### 2. Umgebungsvariablen konfigurieren

```bash
cp .env.example .env
```

Bearbeite `.env` und setze deine Konfiguration:
- Redis-Verbindung (optional, aber empfohlen)
- PostgreSQL-Verbindung (optional, aber empfohlen)
- Solana RPC URL
- NFT-Konfiguration

### 3. Datenbank einrichten (optional)

Falls PostgreSQL verwendet wird:

```bash
# PostgreSQL installieren (falls nicht vorhanden)
# macOS: brew install postgresql
# Linux: sudo apt-get install postgresql

# Datenbank erstellen
createdb silent_insight

# Tabellen erstellen
npm run setup-db
```

### 4. Redis starten (optional)

```bash
# macOS: brew install redis && brew services start redis
# Linux: sudo apt-get install redis-server && sudo systemctl start redis
```

### 5. Server starten

```bash
# Development (mit Auto-Reload)
npm run dev

# Production
npm start
```

Der Server läuft dann auf `http://localhost:3000`

## 📡 API Endpunkte

### Stage I: Intent Declaration
```
POST /v1/alignment/declare
```

### Stage II: Silent Execution Window
```
GET /v1/alignment/silence/:session_id
```

### Stage III: Verify Consistency
```
POST /v1/alignment/verify
```

### Stage IV: Authorize Mint
```
POST /v1/alignment/authorize
```

### Stats
```
GET /v1/alignment/stats?wallet=WALLET_ADDRESS
```

### Health Check
```
GET /health
```

## 🔧 Konfiguration

### Erforderlich:
- **PORT**: Server-Port (Standard: 3000)
- **SOLANA_RPC_URL**: Solana RPC Endpoint

### Optional (aber empfohlen):
- **REDIS_HOST/PORT**: Für Session-Management
- **DB_HOST/PORT/NAME/USER/PASSWORD**: Für persistente Speicherung

### NFT-Konfiguration:
- **NFT_NAME**: Name des NFTs
- **NFT_COST_SOL**: Kosten pro Mint (Standard: 0.025)
- **MAX_SUPPLY**: Maximale Anzahl NFTs (Standard: 999)
- **MAX_PER_WALLET**: Max pro Wallet (Standard: 10)
- **FREE_MINT_WALLET**: Wallet-Adresse für kostenloses Minten
- **SOL_RECIPIENT**: Empfänger-Adresse für SOL-Zahlungen

## 🗄️ Datenbank-Schema

### sessions
- `session_id` (PK)
- `wallet`
- `intent`
- `state_hash`
- `silence_duration`
- `silence_begins`
- `violations`
- `status`

### mints
- `id` (PK)
- `session_id` (FK)
- `wallet`
- `nft_number`
- `rarity_level`
- `mint_address`
- `transaction_hash`
- `metadata_uri`

### wallet_mints
- `wallet` (PK)
- `count`

## 🔄 Fallback-Modus

Falls Redis oder PostgreSQL nicht verfügbar sind, verwendet der Server einen In-Memory-Fallback:
- Sessions werden im RAM gespeichert
- Mints werden im RAM gezählt
- **WICHTIG**: Daten gehen bei Neustart verloren!

Für Produktion sollten Redis und PostgreSQL verwendet werden.

## 🧪 Testing

```bash
# Health Check
curl http://localhost:3000/health

# Stats
curl http://localhost:3000/v1/alignment/stats

# Mit Wallet
curl http://localhost:3000/v1/alignment/stats?wallet=YOUR_WALLET_ADDRESS
```

## 📝 Deployment

### Lokal
```bash
npm start
```

### Mit PM2
```bash
pm2 start server.js --name silent-insight-api
```

### Docker (kommt später)
```bash
docker build -t silent-insight-backend .
docker run -p 3000:3000 silent-insight-backend
```

## 🐛 Troubleshooting

### Redis-Verbindungsfehler
- Prüfe, ob Redis läuft: `redis-cli ping`
- Prüfe REDIS_HOST und REDIS_PORT in `.env`

### PostgreSQL-Verbindungsfehler
- Prüfe, ob PostgreSQL läuft
- Prüfe DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD in `.env`
- Prüfe, ob Datenbank existiert: `psql -l | grep silent_insight`

### Solana-Verbindungsfehler
- Prüfe SOLANA_RPC_URL in `.env`
- Verwende einen öffentlichen RPC oder eigenen RPC-Provider

## 📚 Weitere Informationen

Siehe `SKILL.md` für die vollständige API-Dokumentation und das Alignment-Protokoll.
