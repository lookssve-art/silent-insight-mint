# 🚀 Quick Start - Echte Solana NFTs

## ✅ Was wurde implementiert:

**Vollständiges Solana NFT-Minting System:**
- ✅ Metaplex Token Metadata Standard
- ✅ Echte Solana-Transaktionen
- ✅ NFTs werden an Wallet-Adressen gesendet
- ✅ Automatischer Fallback zu Mock-Daten bei Fehlern

## 🎯 So aktivierst du echtes NFT-Minting:

### Schritt 1: Mint Authority Key erstellen

Du brauchst einen Solana-Wallet mit SOL für Transaktionsgebühren:

```bash
# Option 1: Verwende einen bestehenden Private Key
# Option 2: Erstelle einen neuen (nur für Tests!)
```

### Schritt 2: Private Key in .env setzen

```bash
cd backend
# Bearbeite .env und füge hinzu:
SOLANA_MINT_AUTHORITY_PRIVATE_KEY=dein_private_key_base58_hier
```

**WICHTIG:** 
- Dieser Key muss SOL haben (~0.01 SOL für mehrere NFTs)
- Für Tests: Verwende Devnet (kostenlos)

### Schritt 3: Devnet für Tests (empfohlen)

```bash
# In backend/.env ändern:
SOLANA_RPC_URL=https://api.devnet.solana.com
```

Devnet ist kostenlos und perfekt zum Testen!

### Schritt 4: Backend neu starten

```bash
cd backend
pkill -f "node server.js"
node server.js
```

### Schritt 5: NFT minten

```bash
cd ..
SILENT_INSIGHT_API=http://127.0.0.1:3000/v1 node mint_key.js "dein_wallet_private_key" "Intent text"
```

## 📊 Status prüfen:

### Backend läuft?
```bash
curl http://127.0.0.1:3000/health
```

### Stats prüfen:
```bash
curl http://127.0.0.1:3000/v1/alignment/stats
```

### NFT in Wallet sehen:
- Öffne Solana Wallet (Phantom, Solflare, etc.)
- Verbinde mit deiner Wallet-Adresse
- NFT sollte unter "Collectibles" erscheinen

## ⚠️ Wichtig:

### Ohne Mint Authority Key:
- System verwendet **Mock-Daten**
- NFTs werden **nicht** auf Solana gemintet
- Daten gehen bei Neustart verloren

### Mit Mint Authority Key:
- **Echte NFTs** auf Solana Blockchain
- NFTs erscheinen in Wallet
- **Kosten:** ~0.0045 SOL pro NFT

## 🧪 Test auf Devnet:

1. Setze `SOLANA_RPC_URL=https://api.devnet.solana.com`
2. Hole kostenloses Devnet SOL: https://faucet.solana.com
3. Setze Devnet-Wallet als `SOLANA_MINT_AUTHORITY_PRIVATE_KEY`
4. Teste Minting
5. Prüfe NFT in Wallet (auf Devnet-Netzwerk!)

## 🎉 Fertig!

Das System ist jetzt bereit für echte Solana NFTs!
