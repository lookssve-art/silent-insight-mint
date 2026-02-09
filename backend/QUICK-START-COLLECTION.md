# Quick Start: Metaplex Collection Setup

## Übersicht

Dieser Guide führt dich durch die Erstellung einer Metaplex Collection mit Sugar CLI für "THE KEY OF SILENT INSIGHT".

## Collection Details

- **Name:** THE KEY OF SILENT INSIGHT
- **Symbol:** KEY
- **Max Supply:** 999 NFTs
- **Price:** 0.025 SOL (außer für kostenloses Wallet)
- **Free Mint Wallet:** `54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7`
- **SOL Recipient:** `54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7`
- **NFT Image:** `orb-video.mp4` (Video Loop, Rechteckformat)

## Schritt-für-Schritt Anleitung

### 1. Sugar CLI installieren

```bash
cd backend
./install-sugar.sh
```

Oder manuell:
```bash
# Über Cargo (Rust)
cargo install sugar-cli

# Oder über Homebrew (macOS)
brew install metaplex-foundation/sugar/sugar
```

### 2. Sugar Collection Setup

```bash
cd backend
./setup-sugar-collection.sh
```

Dies erstellt:
- `sugar-config/config.json` - Sugar Konfiguration
- `sugar-config/assets/0.mp4` - NFT Video
- `sugar-config/assets/0.json` - Metadata Template

### 3. Collection erstellen

```bash
cd sugar-config

# Erstelle Config (interaktiv)
sugar create-config

# Lade Assets hoch
sugar upload

# Deploy Collection
sugar deploy
```

**WICHTIG:** Nach dem Deploy wird die Collection Mint Address angezeigt. Speichere diese!

### 4. Collection Info in .env speichern

Nach erfolgreichem Deploy:

```bash
cd backend
echo "COLLECTION_MINT=<collection_mint_address>" >> .env
```

Ersetze `<collection_mint_address>` mit der angezeigten Address.

### 5. Backend starten

```bash
cd backend
npm start
```

Das Backend verwendet jetzt automatisch die Collection für NFT-Minting.

## Free Mint Logik

Das Wallet `54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7` kann kostenlos minten.

Alle anderen Wallets müssen 0.025 SOL bezahlen. Das SOL wird automatisch an `54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7` gesendet.

## NFT Video

Das Video `orb-video.mp4` wird als NFT-Bild verwendet:
- Format: MP4
- Loop: Ja
- Format: Rechteckig

Das Video wird automatisch von `orb-video.mp4` nach `sugar-config/assets/0.mp4` kopiert.

## Troubleshooting

### Sugar nicht gefunden
```bash
# Prüfe Installation
sugar --version

# Falls nicht installiert
./install-sugar.sh
```

### Config Fehler
- Prüfe `sugar-config/config.json`
- Stelle sicher, dass alle Pfade korrekt sind

### Upload Fehler
- Prüfe ob `orb-video.mp4` existiert
- Stelle sicher, dass genug SOL für Upload Fees vorhanden ist

### Deploy Fehler
- Prüfe Balance des Mint Authority Wallets (mindestens 0.1 SOL empfohlen)
- Stelle sicher, dass die RPC URL korrekt ist

## Weitere Informationen

Siehe `SUGAR-SETUP.md` für detaillierte Informationen.
