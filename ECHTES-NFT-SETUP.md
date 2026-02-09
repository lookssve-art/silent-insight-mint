# 🪙 Echtes Solana NFT-Minting Setup

## ⚠️ Problem erkannt:

**Du hast kein NFT im Wallet, weil:**
- ❌ Kein `SOLANA_MINT_AUTHORITY_PRIVATE_KEY` gesetzt war
- ❌ System hat Mock-Daten verwendet (keine echte Blockchain-Transaktion)
- ❌ Transaction Hash existiert nicht auf Solana

## ✅ Lösung - Echtes NFT-Minting aktivieren:

### Schritt 1: Devnet SOL holen

Ich habe einen Mint Authority Key erstellt:
- **Public Key:** `8GjwnqcxDNEm7b13aHj7X5xpNP2ntQohqyF2Xh5smbau`
- **Private Key:** (bereits in `.env` gesetzt)

**Hole kostenloses Devnet SOL:**
1. Öffne: https://faucet.solana.com/?address=8GjwnqcxDNEm7b13aHj7X5xpNP2ntQohqyF2Xh5smbau
2. Klicke auf "Airdrop SOL"
3. Warte bis du ~2 SOL hast

### Schritt 2: Backend neu starten

```bash
cd backend
pkill -f "node server.js"
node server.js
```

### Schritt 3: NFT minten

```bash
cd ..
SILENT_INSIGHT_API=http://127.0.0.1:3000/v1 node mint_key.js "dein_wallet_private_key" "Intent text"
```

### Schritt 4: NFT in Wallet sehen

1. Öffne Phantom/Solflare Wallet
2. **WICHTIG:** Wechsle zu **Devnet** Netzwerk!
3. NFT sollte unter "Collectibles" erscheinen

## 🔍 Prüfen ob es funktioniert:

### Balance prüfen:
```bash
cd backend
node -e "const { Connection, Keypair } = require('@solana/web3.js'); const bs58 = require('bs58'); const conn = new Connection('https://api.devnet.solana.com'); const key = Keypair.fromSecretKey(bs58.decode('4z3ADcvBCW9ukbMhmEDNYD3dbMAs8gzt9PdNqLbWfcsaATB7LyoP5Ui7VJ7EqgonZPDLgGhjkvh9R8PiVMLL2TK3')); conn.getBalance(key.publicKey).then(b => console.log('Balance:', b/1e9, 'SOL'));"
```

### Transaction prüfen:
Nach dem Minten, prüfe den Transaction Hash auf:
- https://explorer.solana.com/?cluster=devnet
- Oder in deinem Wallet

## ⚠️ Wichtig:

- **Devnet:** Kostenlos, für Tests
- **Mainnet:** Echte SOL-Kosten, echte NFTs
- **Wallet:** Muss auf Devnet-Netzwerk sein um NFTs zu sehen!

## 🎯 Für Mainnet (später):

1. Ändere `SOLANA_RPC_URL` zu `https://api.mainnet-beta.solana.com`
2. Verwende einen Mainnet-Wallet mit SOL
3. Setze Mainnet Private Key als `SOLANA_MINT_AUTHORITY_PRIVATE_KEY`
