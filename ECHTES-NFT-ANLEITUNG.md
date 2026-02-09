# 🪙 Echtes Solana NFT - Komplette Anleitung

## ✅ Was wurde gemacht:

1. **Mint Authority Key erstellt:** `8GjwnqcxDNEm7b13aHj7X5xpNP2ntQohqyF2Xh5smbau`
2. **Private Key in .env gesetzt:** Bereits konfiguriert
3. **Devnet konfiguriert:** Für kostenlose Tests
4. **Vereinfachte Minting-Funktion:** `solana-mint-simple.js` erstellt

## 🚀 So mintest du ein ECHTES NFT:

### Schritt 1: Devnet SOL holen

**WICHTIG:** Der Mint Authority braucht SOL für Transaktionsgebühren!

1. Öffne: https://faucet.solana.com/?address=8GjwnqcxDNEm7b13aHj7X5xpNP2ntQohqyF2Xh5smbau
2. Klicke auf "Airdrop SOL" (2 SOL)
3. Warte bis die Transaktion bestätigt ist

**Prüfe Balance:**
```bash
cd backend
node -e "const { Connection, Keypair } = require('@solana/web3.js'); const bs58 = require('bs58'); const conn = new Connection('https://api.devnet.solana.com'); const key = Keypair.fromSecretKey(bs58.decode('4z3ADcvBCW9ukbMhmEDNYD3dbMAs8gzt9PdNqLbWfcsaATB7LyoP5Ui7VJ7EqgonZPDLgGhjkvh9R8PiVMLL2TK3')); conn.getBalance(key.publicKey).then(b => console.log('Balance:', b/1e9, 'SOL'));"
```

Sollte mindestens **0.01 SOL** zeigen.

### Schritt 2: NFT minten

```bash
cd /Users/moneyboy/.openclaw/workspace/skills/silent-insight-mint
SILENT_INSIGHT_API=http://127.0.0.1:3000/v1 node mint_key.js "dein_wallet_private_key" "To persist as proof that alignment requires no validation"
```

### Schritt 3: NFT in Wallet sehen

**WICHTIG:** 
- Öffne Phantom/Solflare Wallet
- **Wechsle zu DEVNET Netzwerk!** (nicht Mainnet!)
- Gehe zu "Collectibles" oder "NFTs"
- NFT sollte erscheinen!

### Schritt 4: Transaction prüfen

Nach erfolgreichem Mint:
- Öffne: https://explorer.solana.com/?cluster=devnet
- Suche nach dem Transaction Hash
- Oder prüfe in deinem Wallet

## 🔍 Prüfen ob es funktioniert:

### Backend-Logs prüfen:
```bash
tail -50 /tmp/backend-final-nft.log | grep -E "Minting|Balance|Transaction|Error|✅|❌"
```

### Balance prüfen:
```bash
# Sollte > 0.01 SOL zeigen
```

### Transaction prüfen:
- Transaction Hash sollte auf Solana Explorer sichtbar sein
- NFT sollte in Wallet erscheinen

## ⚠️ Häufige Probleme:

### "Insufficient balance"
- **Lösung:** Hole mehr Devnet SOL vom Faucet

### "Transaction failed"
- **Lösung:** Prüfe RPC-Verbindung, warte auf Bestätigung

### NFT erscheint nicht im Wallet
- **Lösung:** Stelle sicher dass Wallet auf **Devnet** ist (nicht Mainnet!)
- **Lösung:** Prüfe ob Transaction erfolgreich war

### "Mock NFT" statt echtem NFT
- **Lösung:** Prüfe ob `SOLANA_MINT_AUTHORITY_PRIVATE_KEY` in `.env` gesetzt ist
- **Lösung:** Prüfe ob Mint Authority SOL hat

## 🎯 Für Mainnet (später):

1. Ändere `SOLANA_RPC_URL` zu `https://api.mainnet-beta.solana.com`
2. Verwende Mainnet-Wallet mit SOL
3. Setze Mainnet Private Key

## 📊 Kosten:

- **Devnet:** Kostenlos (für Tests)
- **Mainnet:** ~0.0045 SOL pro NFT (~$0.50)
