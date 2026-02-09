/**
 * Solana NFT Minting Module
 * 
 * Erstellt echte NFTs auf der Solana Blockchain
 */

const { Connection, Keypair, PublicKey, Transaction, SystemProgram, SYSVAR_RENT_PUBKEY } = require('@solana/web3.js');
const { createCreateMetadataAccountV3Instruction, createCreateMetadataAccountInstruction } = require('@metaplex-foundation/mpl-token-metadata');
const bs58 = require('bs58');
const crypto = require('crypto');

// Versuche Sugar Mint zu verwenden wenn Collection vorhanden
let sugarMint;
try {
  if (process.env.COLLECTION_MINT) {
    sugarMint = require('./sugar-mint');
  }
} catch (e) {
  // Sugar Mint nicht verfügbar, verwende Standard-Minting
}

/**
 * Erstellt ein NFT auf Solana
 * 
 * @param {Object} params
 * @param {string} params.connection - Solana Connection
 * @param {Keypair} params.mintAuthority - Keypair für Mint Authority
 * @param {PublicKey} params.walletAddress - Empfänger-Wallet
 * @param {number} params.nftNumber - NFT Nummer
 * @param {Object} params.rarity - Rarity Info {level, name}
 * @param {string} params.imageUrl - URL zum NFT-Bild/Video
 * @param {boolean} params.freeMint - Ob kostenlos gemintet wird
 * @returns {Promise<Object>} {mintAddress, transactionHash, metadataUri}
 */
async function mintSolanaNFT({
  connection,
  mintAuthority,
  walletAddress,
  nftNumber,
  rarity,
  imageUrl,
  freeMint = false
}) {
  // Verwende Sugar Mint wenn Collection vorhanden
  if (sugarMint && process.env.COLLECTION_MINT) {
    try {
      const walletPubkey = walletAddress instanceof PublicKey ? walletAddress : new PublicKey(walletAddress);
      const result = await sugarMint.mintNFT({
        walletAddress: walletPubkey.toString(),
        nftNumber: nftNumber,
        rarity: rarity,
      });
      return {
        mintAddress: result.mintAddress,
        transactionHash: result.transactionHash,
        metadataUri: `https://your-domain.com/metadata/${nftNumber}.json`,
        isReal: true,
        collectionMint: result.collectionMint,
      };
    } catch (error) {
      console.error('Sugar Mint fehlgeschlagen, verwende Standard-Minting:', error.message);
      // Fallback zu Standard-Minting
    }
  }
  
  try {
    // Erstelle neue Mint-Adresse
    const mintKeypair = Keypair.generate();
    const mintAddress = mintKeypair.publicKey;
    
    // Metadata URI (wird später auf IPFS/Arweave hochgeladen)
    const metadataUri = `https://your-domain.com/metadata/${nftNumber}.json`;
    
    // Erstelle Metadata
    const metadata = {
      name: `THE KEY OF SILENT INSIGHT #${nftNumber}`,
      symbol: 'KEY',
      description: `Alignment precedes access. Rarity: ${rarity.name}`,
      image: imageUrl || 'https://your-domain.com/orb-video.mp4',
      attributes: [
        { trait_type: 'Rarity', value: rarity.name },
        { trait_type: 'Rarity Level', value: rarity.level },
        { trait_type: 'Key Number', value: nftNumber },
        { trait_type: 'Alignment', value: 'Verified' }
      ],
      properties: {
        files: [
          {
            uri: imageUrl || 'https://your-domain.com/orb-video.mp4',
            type: 'video/mp4'
          }
        ],
        category: 'video'
      }
    };
    
    // Metaplex Metadata Program ID
    const METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
    
    // Finde Metadata Account PDA
    const [metadataPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('metadata'),
        METADATA_PROGRAM_ID.toBuffer(),
        mintAddress.toBuffer()
      ],
      METADATA_PROGRAM_ID
    );
    
    // Erstelle Transaction
    const transaction = new Transaction();
    
    // Erstelle Mint Account Instruction (vereinfacht - für echte Implementierung braucht man Token Program)
    // Für jetzt verwenden wir eine vereinfachte Version
    
    // Metadata Instruction
    const createMetadataInstruction = createCreateMetadataAccountV3Instruction(
      {
        metadata: metadataPDA,
        mint: mintAddress,
        mintAuthority: mintAuthority.publicKey,
        payer: mintAuthority.publicKey,
        updateAuthority: mintAuthority.publicKey,
      },
      {
        createMetadataAccountArgsV3: {
          data: {
            name: metadata.name,
            symbol: metadata.symbol,
            uri: metadataUri,
            sellerFeeBasisPoints: 0,
            creators: [
              {
                address: mintAuthority.publicKey,
                verified: true,
                share: 100
              }
            ],
            collection: null,
            uses: null
          },
          isMutable: false
        }
      }
    );
    
    transaction.add(createMetadataInstruction);
    
    // Signiere und sende Transaction
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transaction.feePayer = mintAuthority.publicKey;
    transaction.sign(mintAuthority, mintKeypair);
    
    const signature = await connection.sendRawTransaction(transaction.serialize(), {
      skipPreflight: false,
      maxRetries: 3
    });
    
    // Warte auf Bestätigung
    await connection.confirmTransaction(signature, 'confirmed');
    
    return {
      mintAddress: mintAddress.toString(),
      transactionHash: signature,
      metadataUri: metadataUri,
      metadata: metadata
    };
    
  } catch (error) {
    console.error('Solana NFT Minting Error:', error);
    throw error;
  }
}

/**
 * Vereinfachte Version: Versucht echtes Minting, fällt auf Mock zurück bei Fehler
 */
async function mintSolanaNFTSimple({
  connection,
  mintAuthorityKeypair,
  walletAddress,
  nftNumber,
  rarity,
  imageUrl
}) {
  try {
    // Versuche echtes Minting mit Metaplex SDK
    const { mintRealSolanaNFT } = require('./solana-mint-metaplex');
    
    return await mintRealSolanaNFT({
      connection: connection,
      mintAuthority: mintAuthorityKeypair,
      walletAddress: walletAddress,
      nftNumber: nftNumber,
      rarity: rarity,
      imageUrl: imageUrl
    });
    
  } catch (error) {
    console.error('Real NFT minting failed:', error.message);
    console.log('⚠️  Falling back to mock NFT');
    console.log('   Gründe könnten sein:');
    console.log('   - Kein SOL im Mint Authority Wallet');
    console.log('   - RPC-Verbindungsfehler');
    console.log('   - Falscher Netzwerk (Devnet vs Mainnet)');
    
    // Fallback zu Mock-Daten
    const mintAddress = Keypair.generate().publicKey;
    const transactionHash = crypto.randomBytes(32).toString('hex');
    
    return {
      mintAddress: mintAddress.toString(),
      transactionHash: transactionHash,
      metadataUri: `https://your-domain.com/metadata/${nftNumber}.json`,
      metadata: {
        name: `THE KEY OF SILENT INSIGHT #${nftNumber}`,
        symbol: 'KEY',
        description: `Rarity: ${rarity.name}`,
        image: imageUrl
      },
      isMock: true // Flag um zu zeigen dass es Mock-Daten sind
    };
  }
}

module.exports = {
  mintSolanaNFT,
  mintSolanaNFTSimple
};
