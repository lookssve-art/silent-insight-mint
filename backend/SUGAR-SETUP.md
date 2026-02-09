# Metaplex Sugar Collection Setup

## Übersicht

Dieses Setup erstellt eine Metaplex Collection mit Sugar CLI für "THE KEY OF SILENT INSIGHT".

## Collection Details

- **Name:** THE KEY OF SILENT INSIGHT
- **Symbol:** KEY
- **Max Supply:** 999 NFTs
- **Price:** 0.025 SOL (außer für kostenloses Wallet)
- **Free Mint Wallet:** `54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7`
- **SOL Recipient:** `54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7`
- **NFT Image:** `orb-video.mp4` (Video Loop, Rechteckformat)

## Schritt 1: Sugar CLI Installation

### Option A: Über Cargo (Rust)

```bash
# Installiere Rust falls nicht vorhanden
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Installiere Sugar
cargo install sugar-cli
```

### Option B: Über Binary Download

```bash
# Für macOS (Apple Silicon)
curl -L https://github.com/metaplex-foundation/sugar/releases/latest/download/sugar-cli-aarch64-apple-darwin.tar.gz | tar -xz
sudo mv sugar /usr/local/bin/

# Für macOS (Intel)
curl -L https://github.com/metaplex-foundation/sugar/releases/latest/download/sugar-cli-x86_64-apple-darwin.tar.gz | tar -xz
sudo mv sugar /usr/local/bin/
```

### Option C: Über Homebrew (macOS)

```bash
brew install metaplex-foundation/sugar/sugar
```

## Schritt 2: Setup Script ausführen

```bash
cd backend
./setup-sugar-collection.sh
```

Dies erstellt:
- `sugar-config/config.json` - Sugar Konfiguration
- `sugar-config/assets/0.mp4` - NFT Video (kopiert von `orb-video.mp4`)
- `sugar-config/assets/0.json` - Metadata Template

## Schritt 3: Collection erstellen

```bash
cd sugar-config

# 1. Erstelle Config (interaktiv)
sugar create-config

# 2. Lade Assets hoch
sugar upload

# 3. Deploy Collection
sugar deploy
```

Nach dem Deploy wird die Collection Mint Address angezeigt.

## Schritt 4: Collection Info speichern

Nach erfolgreichem Deploy, speichere die Collection Mint Address in `backend/.env`:

```bash
echo "COLLECTION_MINT=<collection_mint_address>" >> backend/.env
echo "COLLECTION_METADATA=<collection_metadata_address>" >> backend/.env
```

## Schritt 5: Backend anpassen

Das Backend verwendet jetzt `sugar-mint.js` um NFTs zur Collection hinzuzufügen.

### Free Mint Logik

Das Wallet `54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7` kann kostenlos minten.
Alle anderen Wallets müssen 0.025 SOL bezahlen.

Das Backend prüft automatisch:
- Ob das Wallet das kostenlose Wallet ist
- Ob genug SOL vorhanden ist (für bezahlte Mints)
- Sendet SOL an `54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7` nach erfolgreichem Mint

## NFT Metadata Format

Jedes NFT hat folgende Metadata:

```json
{
  "name": "THE KEY OF SILENT INSIGHT #<number>",
  "symbol": "KEY",
  "description": "Alignment precedes access. The Key of Silent Insight #<number> - Rarity Level <level>",
  "image": "<number>.mp4",
  "animation_url": "<number>.mp4",
  "attributes": [
    {
      "trait_type": "Rarity",
      "value": "Rarity <level>"
    },
    {
      "trait_type": "Rarity Level",
      "value": <level>
    },
    {
      "trait_type": "Key Number",
      "value": <number>
    },
    {
      "trait_type": "Alignment",
      "value": "Verified"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "<number>.mp4",
        "type": "video/mp4"
      }
    ],
    "category": "video"
  }
}
```

## Rarity Levels

- **0-199:** Rarity 1 (Level 1)
- **200-399:** Rarity 2 (Level 2)
- **400-599:** Rarity 3 (Level 3)
- **600-799:** Rarity 4 (Level 4)
- **800-999:** Rarity 5 (Level 5)

## Wichtige Hinweise

1. **Video Format:** Das Video `orb-video.mp4` wird als NFT-Bild verwendet. Es sollte ein Loop sein und Rechteckformat haben.

2. **Free Mint:** Sugar unterstützt keine Wallet-spezifischen Preise direkt. Die Free Mint Logik wird im Backend (`sugar-mint.js`) implementiert.

3. **SOL Transfer:** Für bezahlte Mints muss der SOL-Transfer separat durchgeführt werden (im Frontend, bevor das NFT gemintet wird).

4. **Collection Limit:** Das Limit von 999 NFTs wird von Sugar verwaltet. Das Backend sollte auch prüfen, ob das Limit erreicht ist.

## Troubleshooting

### Sugar nicht gefunden
- Stelle sicher, dass Sugar installiert ist: `sugar --version`
- Füge Sugar zum PATH hinzu falls nötig

### Config Fehler
- Prüfe `sugar-config/config.json`
- Stelle sicher, dass alle Pfade korrekt sind

### Upload Fehler
- Prüfe ob `orb-video.mp4` existiert
- Stelle sicher, dass genug SOL für Upload Fees vorhanden ist

### Deploy Fehler
- Prüfe Balance des Mint Authority Wallets
- Stelle sicher, dass genug SOL für Collection Creation vorhanden ist (mindestens 0.1 SOL empfohlen)
