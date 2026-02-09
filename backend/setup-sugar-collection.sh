#!/bin/bash

# Metaplex Sugar CLI Setup Script für "THE KEY OF SILENT INSIGHT" Collection
# 
# Collection Details:
# - Max Supply: 999 NFTs
# - Price: 0.025 SOL (außer für kostenloses Wallet)
# - Free Mint Wallet: 54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7
# - SOL Recipient: 54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7
# - NFT Image: orb-video.mp4 (Video Loop)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
SUGAR_DIR="$PROJECT_DIR/sugar-config"

echo "🚀 Setup Metaplex Sugar Collection für 'THE KEY OF SILENT INSIGHT'"
echo ""

# Prüfe ob Sugar installiert ist
if ! command -v sugar &> /dev/null; then
    echo "❌ Sugar CLI nicht gefunden!"
    echo ""
    echo "📦 Versuche Sugar automatisch zu installieren..."
    echo ""
    
    # Versuche Sugar zu installieren
    if [ -f "$SCRIPT_DIR/install-sugar.sh" ]; then
        bash "$SCRIPT_DIR/install-sugar.sh"
        
        # Prüfe erneut
        if ! command -v sugar &> /dev/null; then
            echo ""
            echo "❌ Automatische Installation fehlgeschlagen!"
            echo ""
            echo "Bitte Sugar manuell installieren:"
            echo "  bash $SCRIPT_DIR/install-sugar.sh"
            echo ""
            echo "Oder siehe: https://docs.metaplex.com/developer-tools/sugar/installation"
            exit 1
        fi
    else
        echo "❌ Install-Script nicht gefunden!"
        echo "Bitte Sugar manuell installieren."
        exit 1
    fi
fi

echo "✅ Sugar CLI gefunden: $(sugar --version)"
echo ""

# Erstelle Sugar Config Verzeichnis
mkdir -p "$SUGAR_DIR"
cd "$SUGAR_DIR"

# Prüfe ob Config bereits existiert
if [ -f "config.json" ]; then
    echo "⚠️  Config existiert bereits. Überspringe Erstellung."
    echo "   Lösche config.json um neu zu erstellen."
else
    echo "📝 Erstelle Sugar Config..."
    
    # Lade .env Variablen
    source "$SCRIPT_DIR/.env" 2>/dev/null || true
    
    MINT_AUTHORITY="${SOLANA_MINT_AUTHORITY_PRIVATE_KEY:-}"
    RPC_URL="${SOLANA_RPC_URL:-https://api.mainnet-beta.solana.com}"
    FREE_MINT_WALLET="54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7"
    SOL_RECIPIENT="54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7"
    
    if [ -z "$MINT_AUTHORITY" ]; then
        echo "❌ SOLANA_MINT_AUTHORITY_PRIVATE_KEY nicht in .env gefunden!"
        exit 1
    fi
    
    # Erstelle Sugar Config
    cat > config.json <<EOF
{
  "price": 0.025,
  "number": 999,
  "gatekeeper": null,
  "solTreasuryAccount": "$SOL_RECIPIENT",
  "splTokenAccount": null,
  "splToken": null,
  "goLiveDate": "$(date -u +%s)",
  "endSettings": null,
  "whitelistMintSettings": null,
  "hiddenSettings": null,
  "storage": "bundlr",
  "ipfsInfuraProjectId": null,
  "ipfsInfuraSecret": null,
  "awsS3Bucket": null,
  "noRetainAuthority": false,
  "noMutable": false,
  "symbol": "KEY",
  "sellerFeeBasisPoints": 0,
  "creators": [
    {
      "address": "$SOL_RECIPIENT",
      "share": 100
    }
  ]
}
EOF
    
    echo "✅ Config erstellt: $SUGAR_DIR/config.json"
fi

# Erstelle Assets Verzeichnis
mkdir -p "$SUGAR_DIR/assets"

# Kopiere Video als NFT-Bild
if [ -f "$PROJECT_DIR/orb-video.mp4" ]; then
    echo "📹 Kopiere Video als NFT-Bild..."
    cp "$PROJECT_DIR/orb-video.mp4" "$SUGAR_DIR/assets/0.mp4"
    echo "✅ Video kopiert: $SUGAR_DIR/assets/0.mp4"
else
    echo "⚠️  Video nicht gefunden: $PROJECT_DIR/orb-video.mp4"
    echo "   Bitte Video manuell nach $SUGAR_DIR/assets/0.mp4 kopieren"
fi

# Erstelle Metadata Template
echo "📝 Erstelle Metadata Template..."
cat > "$SUGAR_DIR/assets/0.json" <<EOF
{
  "name": "THE KEY OF SILENT INSIGHT #1",
  "symbol": "KEY",
  "description": "Alignment precedes access. The Key of Silent Insight #1 - Rarity Level 1",
  "image": "0.mp4",
  "animation_url": "0.mp4",
  "attributes": [
    {
      "trait_type": "Rarity",
      "value": "Rarity 1"
    },
    {
      "trait_type": "Rarity Level",
      "value": 1
    },
    {
      "trait_type": "Key Number",
      "value": 1
    },
    {
      "trait_type": "Alignment",
      "value": "Verified"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "0.mp4",
        "type": "video/mp4"
      }
    ],
    "category": "video"
  }
}
EOF

echo "✅ Metadata Template erstellt"
echo ""
echo "📋 Nächste Schritte:"
echo ""
echo "1. Prüfe die Config:"
echo "   cat $SUGAR_DIR/config.json"
echo ""
echo "2. Erstelle die Collection:"
echo "   cd $SUGAR_DIR"
echo "   sugar create-config"
echo "   sugar upload"
echo "   sugar deploy"
echo ""
echo "3. Nach erfolgreicher Erstellung:"
echo "   - Collection Mint Address wird angezeigt"
echo "   - Speichere diese in backend/.env als COLLECTION_MINT"
echo ""
echo "⚠️  WICHTIG:"
echo "   - Free Mint für Wallet $FREE_MINT_WALLET muss im Backend implementiert werden"
echo "   - Sugar unterstützt keine Wallet-spezifischen Preise direkt"
echo "   - Das Backend muss die Free Mint Logik handhaben"
echo ""
