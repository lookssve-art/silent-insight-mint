# Metaplex Collection Setup für "THE KEY OF SILENT INSIGHT"

## Übersicht

Die Collection wurde noch nicht erstellt. Es gibt zwei Ansätze:

### Option 1: Manuelle Collection-Erstellung (Empfohlen)

Die Collection sollte über die Metaplex CLI oder ein Web-Interface erstellt werden:

1. **Metaplex CLI verwenden:**
   ```bash
   npm install -g @metaplex-foundation/metaplex-cli
   metaplex create-collection --name "THE KEY OF SILENT INSIGHT Collection" --symbol "KEY"
   ```

2. **Oder über Sugar (Metaplex Tool):**
   ```bash
   sugar create-config
   sugar upload
   sugar deploy
   ```

### Option 2: Backend mintet NFTs ohne Collection (Aktuell)

Das Backend kann einzelne NFTs minten. Diese können später zu einer Collection hinzugefügt werden.

## Collection-Konfiguration

- **Name:** THE KEY OF SILENT INSIGHT Collection
- **Symbol:** KEY
- **Max Supply:** 999 NFTs
- **Price:** 0.025 SOL pro NFT
- **Max per Wallet:** 10 NFTs
- **SOL Recipient:** 54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7

## Nächste Schritte

1. Collection erstellen (manuell oder über CLI)
2. Collection Mint Address in `.env` speichern:
   ```
   COLLECTION_MINT=<collection_mint_address>
   COLLECTION_METADATA=<collection_metadata_address>
   ```
3. Backend anpassen, um NFTs zur Collection hinzuzufügen

## Hinweis

Das aktuelle Backend mintet bereits NFTs. Diese können später zu einer Collection hinzugefügt werden, indem die `collection` Property beim Minting gesetzt wird.
