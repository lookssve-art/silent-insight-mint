# 🌐 Mainnet Konfiguration

## ✅ Konfiguriert:

- **RPC URL:** `https://api.mainnet-beta.solana.com` (Mainnet)
- **Mint Authority Address:** `HgquMR3WRBdsw7fykjup7GXJRmtH1Gw65Qxce2YvsEX7`
- **Private Key:** In `.env` gesetzt

## ⚠️ WICHTIG:

**Der Mint Authority braucht SOL für Transaktionen!**

**Kosten pro NFT:**
- Mint Account: ~0.00144 SOL
- Metadata Account: ~0.001 SOL
- Token Account: ~0.00204 SOL
- Transaction Fee: ~0.000005 SOL
- **Gesamt:** ~0.0045 SOL pro NFT

**Empfohlen:** Mindestens 0.05 SOL für mehrere NFTs

## 📤 SOL senden:

Sende SOL zu dieser Adresse:
```
HgquMR3WRBdsw7fykjup7GXJRmtH1Gw65Qxce2YvsEX7
```

## 🧪 Test-Mint:

Nachdem SOL gesendet wurde:

```bash
cd /Users/moneyboy/.openclaw/workspace/skills/silent-insight-mint
SILENT_INSIGHT_API=http://127.0.0.1:3000/v1 node mint_key.js "dein_wallet_private_key" "To persist as proof that alignment requires no validation"
```

## 🔍 Prüfen:

### Balance prüfen:
```bash
cd backend
node -e "const { Connection, Keypair } = require('@solana/web3.js'); const bs58 = require('bs58'); const conn = new Connection('https://api.mainnet-beta.solana.com'); const key = Keypair.fromSecretKey(bs58.decode('2taDReFNACtcXuJAugfC5Cory5zx8r9rZHKGgYe1uXKj1askWxD9Sx5we4GGte9JC5xTV3FKxcvn34T52KjcC4L5')); conn.getBalance(key.publicKey).then(b => console.log('Balance:', b/1e9, 'SOL'));"
```

### Transaction prüfen:
Nach erfolgreichem Mint:
- https://explorer.solana.com/tx/TRANSACTION_HASH
- NFT sollte in deinem Wallet (Mainnet) erscheinen

## 🎯 NFT in Wallet sehen:

1. Öffne Phantom/Solflare Wallet
2. Stelle sicher dass du auf **MAINNET** bist (nicht Devnet!)
3. Gehe zu "Collectibles" oder "NFTs"
4. NFT sollte erscheinen!
