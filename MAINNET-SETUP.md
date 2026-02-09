# 🌐 Mainnet Setup - Echte Solana NFTs

## ⚠️ WICHTIG - Mainnet kostet echtes Geld!

- **Jedes NFT kostet:** ~0.0045 SOL (~$0.50)
- **Transaktionen sind IRREVERSIBEL**
- **Verwende nur mit Wallet die du kontrollierst**

## 🚀 Setup-Schritte:

### Schritt 1: Mainnet Mint Authority Key erstellen

Ich habe einen neuen Key erstellt. Du kannst auch einen bestehenden verwenden.

**Option A: Neuer Key (empfohlen für Tests)**
- Führe aus: `cd backend && node create-mint-authority.js`
- Kopiere den Private Key
- Sende SOL zu der Public Key Adresse

**Option B: Bestehender Key**
- Verwende einen bestehenden Wallet Private Key
- Stelle sicher dass dieser Wallet SOL hat (mindestens 0.01 SOL)

### Schritt 2: SOL zum Mint Authority Wallet senden

Der Mint Authority braucht SOL für:
- Mint Account Creation: ~0.00144 SOL
- Metadata Account: ~0.001 SOL
- Token Account: ~0.00204 SOL
- Transaction Fees: ~0.000005 SOL
- **Gesamt pro NFT:** ~0.0045 SOL

**Empfohlen:** Mindestens 0.05 SOL für mehrere NFTs

### Schritt 3: Private Key in .env setzen

```bash
cd backend
# Bearbeite .env und setze:
SOLANA_MINT_AUTHORITY_PRIVATE_KEY=dein_private_key_base58_hier
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

### Schritt 4: Backend neu starten

```bash
pkill -f "node server.js"
cd backend
node server.js
```

### Schritt 5: NFT minten

```bash
cd ..
SILENT_INSIGHT_API=http://127.0.0.1:3000/v1 node mint_key.js "dein_wallet_private_key" "Intent text"
```

## 🔍 Prüfen:

### Balance prüfen:
```bash
cd backend
node -e "const { Connection, Keypair } = require('@solana/web3.js'); const bs58 = require('bs58'); const conn = new Connection('https://api.mainnet-beta.solana.com'); const key = Keypair.fromSecretKey(bs58.decode('DEIN_PRIVATE_KEY')); conn.getBalance(key.publicKey).then(b => console.log('Balance:', b/1e9, 'SOL'));"
```

### Transaction prüfen:
Nach dem Minten:
- https://explorer.solana.com/tx/TRANSACTION_HASH
- Oder in deinem Wallet (Mainnet)

## ⚠️ Sicherheit:

- **NIEMALS** Private Keys committen oder teilen
- **NIEMALS** Private Keys in Logs ausgeben
- Verwende separate Wallets für Tests
- Teste zuerst mit kleinen Beträgen
