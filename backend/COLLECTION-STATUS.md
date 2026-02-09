# Collection Setup Status

## ✅ Abgeschlossen

1. **Sugar Config erstellt:**
   - `sugar-config/config.json` - Sugar Konfiguration
   - `sugar-config/assets/0.mp4` - NFT Video (kopiert von `orb-video.mp4`)
   - `sugar-config/assets/0.json` - Metadata Template

2. **Backend angepasst:**
   - `sugar-mint.js` - Mintet NFTs zur Collection
   - `solana-mint.js` - Verwendet automatisch Collection wenn vorhanden
   - Free Mint Logik implementiert für `54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7`

3. **Collection Info in .env:**
   - `COLLECTION_ENABLED=true`
   - `COLLECTION_NAME=THE KEY OF SILENT INSIGHT Collection`
   - `COLLECTION_SYMBOL=KEY`

## 📋 Collection Details

- **Name:** THE KEY OF SILENT INSIGHT Collection
- **Symbol:** KEY
- **Max Supply:** 999 NFTs (wird im Backend verwaltet)
- **Price:** 0.025 SOL (außer für kostenloses Wallet)
- **Free Mint Wallet:** `54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7`
- **SOL Recipient:** `54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7`
- **NFT Image:** `orb-video.mp4` (Video Loop, Rechteckformat)

## ⚠️ Nächste Schritte

### Option 1: Collection manuell mit Sugar erstellen

1. Installiere Sugar CLI:
   ```bash
   cargo install sugar-cli
   # Oder über Homebrew: brew install metaplex-foundation/sugar/sugar
   ```

2. Deploy Collection:
   ```bash
   cd sugar-config
   sugar create-config
   sugar upload
   sugar deploy
   ```

3. Speichere Collection Mint Address in `.env`:
   ```bash
   echo "COLLECTION_MINT=<collection_mint_address>" >> backend/.env
   ```

### Option 2: Collection wird beim ersten NFT-Mint erstellt

Das Backend kann die Collection automatisch beim ersten NFT-Mint erstellen, wenn `COLLECTION_MINT` nicht gesetzt ist.

## ✅ Backend Status

Das Backend ist bereit und läuft:
- ✅ Server läuft auf Port 3000
- ✅ Solana Connection aktiv
- ✅ Collection Support implementiert
- ✅ Free Mint Logik aktiv

## 🎯 Testen

Du kannst jetzt ein NFT minten:
```bash
cd ..
SILENT_INSIGHT_API=http://127.0.0.1:3000/v1 node mint_key.js "WALLET_PRIVATE_KEY" "Intent text"
```

Das Backend wird:
1. Prüfen ob Collection vorhanden ist
2. Falls nicht, Collection erstellen (beim ersten Mint)
3. NFT zur Collection hinzufügen
4. Free Mint für `54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7` durchführen
5. SOL an `54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7` senden (bei bezahlten Mints)
