# 🪙 Echte Solana NFT-Minting - Setup

## ✅ Was wurde implementiert:

1. **Vollständige Metaplex-Integration** (`solana-mint-full.js`)
   - Erstellt echte Mint Accounts
   - Erstellt Metadata Accounts
   - Mintet NFTs zu Wallet-Adressen
   - Verwendet SPL Token Standard

2. **Automatischer Fallback** (`solana-mint.js`)
   - Versucht echtes Minting
   - Fällt auf Mock-Daten zurück wenn Fehler auftreten

## ⚙️ Konfiguration:

### 1. Mint Authority Private Key

Du brauchst einen Private Key (Base58) für die Mint Authority:

```bash
# In backend/.env setzen:
SOLANA_MINT_AUTHORITY_PRIVATE_KEY=dein_private_key_hier_base58
```

**WICHTIG:** 
- Dieser Key muss SOL haben für Transaktionsgebühren
- Er wird verwendet um NFTs zu minten
- Bewahre ihn sicher auf!

### 2. Solana RPC URL

```bash
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

**Für bessere Performance:**
- Helius: `https://mainnet.helius-rpc.com/?api-key=YOUR_KEY`
- QuickNode: `https://YOUR_ENDPOINT.solana-mainnet.quiknode.pro/YOUR_KEY`

### 3. NFT Image URL

```bash
NFT_IMAGE_URL=https://your-domain.com/orb-video.mp4
```

## 🧪 Testen:

### Ohne Mint Authority (Mock-Modus):
```bash
# Lass SOLANA_MINT_AUTHORITY_PRIVATE_KEY leer
# System verwendet Mock-Daten
```

### Mit Mint Authority (Echtes Minting):
```bash
# Setze SOLANA_MINT_AUTHORITY_PRIVATE_KEY in .env
# Stelle sicher dass der Key SOL hat
# Mint ein NFT
```

## 📋 Mint-Prozess:

1. **Mint Account erstellen** - Neue Mint-Adresse
2. **Mint initialisieren** - 0 Decimals (NFT Standard)
3. **Metadata Account erstellen** - Metaplex Metadata
4. **Token Account erstellen** - Für Empfänger-Wallet
5. **Token minten** - 1 Token zu Wallet senden

## 💰 Kosten:

- **Mint Account:** ~0.00144 SOL
- **Metadata Account:** ~0.001 SOL  
- **Token Account:** ~0.00204 SOL
- **Transaction Fee:** ~0.000005 SOL
- **Gesamt:** ~0.0045 SOL pro NFT

## ⚠️ Wichtig:

- **Mainnet:** Echte SOL-Kosten, echte NFTs
- **Devnet:** Kostenlos für Tests (`https://api.devnet.solana.com`)
- **Testnet:** Verwende Devnet zum Testen!

## 🐛 Troubleshooting:

### "Insufficient funds"
- Mint Authority Key braucht SOL
- Mindestens 0.01 SOL empfohlen

### "Transaction failed"
- Prüfe RPC-Verbindung
- Prüfe ob Wallet-Adresse gültig ist
- Prüfe Solana Network Status

### "Metadata creation failed"
- Prüfe Metadata URI (muss erreichbar sein)
- Prüfe Metaplex Program ID

## 📚 Nächste Schritte:

1. Setze `SOLANA_MINT_AUTHORITY_PRIVATE_KEY` in `.env`
2. Stelle sicher dass der Key SOL hat
3. Teste auf Devnet zuerst
4. Dann auf Mainnet deployen
