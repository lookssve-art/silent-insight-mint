/**
 * Solana NFT Minting mit Metaplex SDK
 * Verwendet die installierten Metaplex-Pakete für korrektes Minting
 */

const { 
  Connection, 
  Keypair, 
  PublicKey, 
  Transaction,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  sendAndConfirmTransaction
} = require('@solana/web3.js');
const {
  createInitializeMintInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  getAccount,
  createMintToInstruction,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  getMinimumBalanceForRentExemptMint
} = require('@solana/spl-token');

// Versuche Metaplex SDK zu verwenden
let createCreateMetadataAccountV3Instruction;
try {
  const metaplex = require('@metaplex-foundation/mpl-token-metadata');
  createCreateMetadataAccountV3Instruction = metaplex.createCreateMetadataAccountV3Instruction;
} catch (e) {
  console.log('⚠️  Metaplex SDK nicht verfügbar, verwende manuelle Methode');
}

// Metaplex Metadata Program ID
const METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

/**
 * Findet Metadata PDA
 */
function findMetadataPDA(mintAddress) {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata'),
      METADATA_PROGRAM_ID.toBuffer(),
      mintAddress.toBuffer()
    ],
    METADATA_PROGRAM_ID
  )[0];
}

/**
 * Erstellt korrekte Metadata Instruction mit Metaplex Serializer
 */
function createMetadataInstruction({
  metadataAccount,
  mint,
  mintAuthority,
  payer,
  updateAuthority,
  name,
  symbol,
  uri
}) {
  // Verwende Metaplex Serializer für korrekte Datenstruktur
  let instructionData;
  try {
    const mpl = require('@metaplex-foundation/mpl-token-metadata');
    const serializer = mpl.getCreateMetadataAccountV3InstructionDataSerializer();
    
    // Serialisiere die Instruction-Daten korrekt (discriminator wird automatisch hinzugefügt)
    const serialized = serializer.serialize({
      data: {
        name: name,
        symbol: symbol,
        uri: uri,
        sellerFeeBasisPoints: 0,
        creators: null,
        collection: null,
        uses: null
      },
      isMutable: false,
      collectionDetails: null
    });
    
    instructionData = Buffer.from(serialized);
    console.log('✅ Metaplex Serializer verwendet');
  } catch (e) {
    console.log('⚠️  Metaplex Serializer Fehler, verwende manuelle Methode:', e.message);
    
    // Fallback: Manuelle Serialisierung basierend auf Metaplex V3 Format
    // DataV2 Struktur:
    // - name: string (4 bytes length + data)
    // - symbol: string (4 bytes length + data)
    // - uri: string (4 bytes length + data)
    // - sellerFeeBasisPoints: u16 (2 bytes)
    // - creators: Option<Vec<Creator>> (1 byte + optional data)
    // - collection: Option<Collection> (1 byte + optional data)
    // - uses: Option<Uses> (1 byte + optional data)
    
    const nameBuffer = Buffer.from(name, 'utf8');
    const symbolBuffer = Buffer.from(symbol, 'utf8');
    const uriBuffer = Buffer.from(uri, 'utf8');
    
    // DataV2 serialization
    const dataV2 = Buffer.concat([
      Buffer.alloc(4), dataV2.writeUInt32LE(nameBuffer.length, 0), nameBuffer, // name (u32 length + data)
      Buffer.alloc(4), dataV2.writeUInt32LE(symbolBuffer.length, 0), symbolBuffer, // symbol
      Buffer.alloc(4), dataV2.writeUInt32LE(uriBuffer.length, 0), uriBuffer, // uri
      Buffer.from([0, 0]), // sellerFeeBasisPoints (u16 LE)
      Buffer.from([0]), // creators: Option::None
      Buffer.from([0]), // collection: Option::None
      Buffer.from([0]) // uses: Option::None
    ]);
    
    // Instruction Data: discriminator (u8) + DataV2 + isMutable (bool) + collectionDetails (Option)
    instructionData = Buffer.concat([
      Buffer.from([33]), // discriminator
      dataV2, // DataV2
      Buffer.from([0]), // isMutable (false)
      Buffer.from([0]) // collectionDetails: Option::None
    ]);
  }
  
  return {
    programId: METADATA_PROGRAM_ID,
    keys: [
      { pubkey: metadataAccount, isSigner: false, isWritable: true },
      { pubkey: mint, isSigner: false, isWritable: false },
      { pubkey: mintAuthority, isSigner: true, isWritable: false },
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: updateAuthority, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false }
    ],
    data: instructionData
  };
}

/**
 * Mintet ein echtes Solana NFT
 */
async function mintRealSolanaNFT({
  connection,
  mintAuthority,
  walletAddress,
  nftNumber,
  rarity,
  imageUrl
}) {
  try {
    console.log(`🪙 Minting REAL NFT #${nftNumber} to ${walletAddress.toString()}...`);
    
    // Prüfe Balance
    let balance = await connection.getBalance(mintAuthority.publicKey);
    if (balance < 0.01 * 1e9) {
      throw new Error(`Insufficient balance: ${balance / 1e9} SOL. Need at least 0.01 SOL`);
    }
    console.log(`✅ Balance OK: ${balance / 1e9} SOL`);
    
    // Erstelle neue Mint-Adresse
    const mintKeypair = Keypair.generate();
    const mintAddress = mintKeypair.publicKey;
    
    // Metadata
    const metadataUri = `https://your-domain.com/metadata/${nftNumber}.json`;
    const name = `THE KEY OF SILENT INSIGHT #${nftNumber}`;
    const symbol = 'KEY';
    
    // Finde Metadata PDA
    const metadataAccount = findMetadataPDA(mintAddress);
    
    // Berechne Lamports für Mint Account
    const mintLamports = await getMinimumBalanceForRentExemptMint(connection);
    
    // Berechne Lamports für Metadata Account (ca. 679 bytes)
    const metadataLamports = await connection.getMinimumBalanceForRentExemption(679);
    
    // Berechne Lamports für Associated Token Account (ca. 165 bytes)
    const ataLamports = await connection.getMinimumBalanceForRentExemption(165);
    
    const totalNeeded = mintLamports + metadataLamports + ataLamports + (5000); // + 5000 lamports für Fees
    balance = await connection.getBalance(mintAuthority.publicKey); // Aktualisiere Balance
    
    console.log(`📊 Mint Lamports: ${mintLamports}`);
    console.log(`📊 Metadata Lamports: ${metadataLamports}`);
    console.log(`📊 ATA Lamports: ${ataLamports}`);
    console.log(`📊 Total benötigt: ${totalNeeded / 1e9} SOL`);
    console.log(`📊 Aktuelle Balance: ${balance / 1e9} SOL`);
    
    if (balance < totalNeeded) {
      throw new Error(`Insufficient balance: ${balance / 1e9} SOL. Need at least ${totalNeeded / 1e9} SOL`);
    }
    
    // Erstelle Transaction
    const transaction = new Transaction();
    
    // 1. Erstelle Mint Account
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: mintAuthority.publicKey,
        newAccountPubkey: mintAddress,
        space: MINT_SIZE,
        lamports: mintLamports,
        programId: TOKEN_PROGRAM_ID
      })
    );
    
    // 2. Initialisiere Mint (0 decimals für NFT)
    transaction.add(
      createInitializeMintInstruction(
        mintAddress,
        0,
        mintAuthority.publicKey,
        null
      )
    );
    
    // 3. Erstelle Metadata Account
    const metadataInstruction = createMetadataInstruction({
      metadataAccount: metadataAccount,
      mint: mintAddress,
      mintAuthority: mintAuthority.publicKey,
      payer: mintAuthority.publicKey,
      updateAuthority: mintAuthority.publicKey,
      name: name,
      symbol: symbol,
      uri: metadataUri
    });
    
    transaction.add(metadataInstruction);
    
    // 4. Erstelle Associated Token Account für Wallet
    const associatedTokenAddress = await getAssociatedTokenAddress(
      mintAddress,
      walletAddress
    );
    
    try {
      await getAccount(connection, associatedTokenAddress);
      console.log('✅ Token Account existiert bereits');
    } catch (e) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          mintAuthority.publicKey,
          associatedTokenAddress,
          walletAddress,
          mintAddress
        )
      );
    }
    
    // 5. Mint Token zu Wallet (1 Token = NFT)
    transaction.add(
      createMintToInstruction(
        mintAddress,
        associatedTokenAddress,
        mintAuthority.publicKey,
        1,
        []
      )
    );
    
    // Signiere und sende
    console.log('📤 Sending transaction to Solana Mainnet...');
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [mintAuthority, mintKeypair],
      { 
        commitment: 'confirmed',
        skipPreflight: false,
        maxRetries: 3
      }
    );
    
    console.log(`✅✅✅ NFT ERFOLGREICH AUF SOLANA MAINNET GEMINTET!`);
    console.log(`   Mint Address: ${mintAddress.toString()}`);
    console.log(`   Transaction: ${signature}`);
    console.log(`   Metadata: ${metadataAccount.toString()}`);
    console.log(`   Token Account: ${associatedTokenAddress.toString()}`);
    console.log(`   Explorer: https://explorer.solana.com/tx/${signature}`);
    
    return {
      mintAddress: mintAddress.toString(),
      transactionHash: signature,
      metadataUri: metadataUri,
      metadataAccount: metadataAccount.toString(),
      associatedTokenAddress: associatedTokenAddress.toString(),
      isReal: true
    };
    
  } catch (error) {
    console.error('❌ Solana NFT Minting Error:', error.message);
    if (error.logs) {
      console.error('Transaction Logs:', error.logs);
    }
    throw error;
  }
}

module.exports = {
  mintRealSolanaNFT,
  findMetadataPDA
};
