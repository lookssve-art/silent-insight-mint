#!/bin/bash

# Installiert Metaplex Sugar CLI

set -e

echo "🚀 Installiere Metaplex Sugar CLI..."
echo ""

# Prüfe Betriebssystem
OS="$(uname -s)"
ARCH="$(uname -m)"

echo "📋 System: $OS $ARCH"
echo ""

# Prüfe ob Sugar bereits installiert ist
if command -v sugar &> /dev/null; then
    echo "✅ Sugar bereits installiert: $(sugar --version)"
    exit 0
fi

# Prüfe ob Rust/Cargo installiert ist
if command -v cargo &> /dev/null; then
    echo "✅ Rust/Cargo gefunden"
    echo "📦 Installiere Sugar über Cargo..."
    cargo install sugar-cli
    echo "✅ Sugar installiert!"
    exit 0
fi

# Prüfe ob Homebrew installiert ist (macOS)
if [[ "$OS" == "Darwin" ]] && command -v brew &> /dev/null; then
    echo "✅ Homebrew gefunden"
    echo "📦 Installiere Sugar über Homebrew..."
    brew install metaplex-foundation/sugar/sugar
    echo "✅ Sugar installiert!"
    exit 0
fi

# Binary Download
echo "📦 Lade Sugar Binary herunter..."

if [[ "$OS" == "Darwin" ]]; then
    if [[ "$ARCH" == "arm64" ]]; then
        BINARY_URL="https://github.com/metaplex-foundation/sugar/releases/latest/download/sugar-cli-aarch64-apple-darwin.tar.gz"
        BINARY_NAME="sugar-cli-aarch64-apple-darwin"
    else
        BINARY_URL="https://github.com/metaplex-foundation/sugar/releases/latest/download/sugar-cli-x86_64-apple-darwin.tar.gz"
        BINARY_NAME="sugar-cli-x86_64-apple-darwin"
    fi
elif [[ "$OS" == "Linux" ]]; then
    BINARY_URL="https://github.com/metaplex-foundation/sugar/releases/latest/download/sugar-cli-x86_64-unknown-linux-gnu.tar.gz"
    BINARY_NAME="sugar-cli-x86_64-unknown-linux-gnu"
else
    echo "❌ Betriebssystem nicht unterstützt: $OS"
    echo ""
    echo "Bitte Sugar manuell installieren:"
    echo "  https://docs.metaplex.com/developer-tools/sugar/installation"
    exit 1
fi

echo "📥 Lade herunter: $BINARY_URL"
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"

curl -L "$BINARY_URL" -o sugar.tar.gz
tar -xzf sugar.tar.gz
chmod +x sugar

# Installiere nach /usr/local/bin
if [ -w /usr/local/bin ]; then
    sudo mv sugar /usr/local/bin/
    echo "✅ Sugar installiert nach /usr/local/bin/sugar"
else
    echo "⚠️  Keine Schreibrechte für /usr/local/bin"
    echo "   Kopiere Sugar nach ~/bin oder füge zum PATH hinzu:"
    mkdir -p ~/bin
    mv sugar ~/bin/
    echo "   export PATH=\$PATH:~/bin" >> ~/.bashrc
    echo "   export PATH=\$PATH:~/bin" >> ~/.zshrc
    echo "✅ Sugar installiert nach ~/bin/sugar"
fi

# Cleanup
cd -
rm -rf "$TEMP_DIR"

echo ""
echo "✅ Sugar erfolgreich installiert!"
echo "   Prüfe Installation: sugar --version"
