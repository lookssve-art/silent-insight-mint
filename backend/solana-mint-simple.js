/**
 * Vereinfachte, funktionierende Solana NFT Minting
 * Verwendet nur @solana/web3.js und @solana/spl-token (keine komplexe Metaplex-Integration)
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

// Metaplex Metadata Program
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
 * Erstellt Metadata Instruction V3 mit korrektem Metaplex-Format
 */
function createMetadataInstructionV3({
  metadataAccount,
  mint,
  mintAuthority,
  payer,
  updateAuthority,
  name,
  symbol,
  uri
}) {
  // Metaplex CreateMetadataAccountV3 Instruction Format
  // Instruction discriminator: 33 (0x21)
  const nameBuffer = Buffer.from(name, 'utf8');
  const symbolBuffer = Buffer.from(symbol, 'utf8');
  const uriBuffer = Buffer.from(uri, 'utf8');
  
  // Korrekte Instruction-Daten-Struktur für CreateMetadataAccountV3
  const instructionData = Buffer.concat([
    Buffer.from([33]), // instruction discriminator (CreateMetadataAccountV3)
    // Accounts werden als Keys übergeben, nicht im Data
    Buffer.from([0]), // is_mutable (false = 0)
    // DataV2 structure
    Buffer.from([nameBuffer.length]), // name length (1 byte)
    nameBuffer, // name (variable)
    Buffer.from([symbolBuffer.length]), // symbol length (1 byte)  
    symbolBuffer, // symbol (variable)
    Buffer.from([uriBuffer.length]), // uri length (1 byte)
    uriBuffer, // uri (variable)
    Buffer.from([0, 0]), // seller_fee_basis_points (u16, little-endian, 0)
    Buffer.from([0]), // has_creators (bool, false = 0)
    Buffer.from([0, 0, 0, 0]), // creators array length (u32, little-endian, 0)
    Buffer.from([0]), // collection (Option<Collection>, None = 0)
    Buffer.from([0]) // uses (Option<Uses>, None = 0)
  ]);
  
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
    const balance = await connection.getBalance(mintAuthority.publicKey);
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
    
    // Berechne Lamports
    const mintLamports = await getMinimumBalanceForRentExemptMint(connection);
    const metadataLamports = await connection.getMinimumBalanceForRentExemption(679); // Metadata account size
    
    console.log(`📊 Mint Lamports: ${mintLamports}, Metadata Lamports: ${metadataLamports}`);
    
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
        null // freeze authority
      )
    );
    
    // 3. Erstelle Metadata Account
    const metadataInstruction = createMetadataInstructionV3({
      metadataAccount: metadataAccount,
      mint: mintAddress,
      mintAuthority: mintAuthority.publicKey,
      payer: mintAuthority.publicKey,
      updateAuthority: mintAuthority.publicKey,
      name: name,
      symbol: symbol,
      uri: metadataUri
    });
    
    transaction.add({
      programId: metadataInstruction.programId,
      keys: metadataInstruction.keys,
      data: metadataInstruction.data
    });
    
    // 4. Erstelle Associated Token Account für Wallet
    const associatedTokenAddress = await getAssociatedTokenAddress(
      mintAddress,
      walletAddress
    );
    
    try {
      await getAccount(connection, associatedTokenAddress);
      console.log('✅ Token Account existiert bereits');
    } catch (e) {
      // Account existiert nicht, erstelle ihn
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
        1, // amount (1 für NFT)
        []
      )
    );
    
    // Signiere und sende
    console.log('📤 Sending transaction to Solana...');
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
    
    console.log(`✅ NFT erfolgreich gemintet!`);
    console.log(`   Mint Address: ${mintAddress.toString()}`);
    console.log(`   Transaction: ${signature}`);
    console.log(`   Metadata: ${metadataAccount.toString()}`);
    console.log(`   Token Account: ${associatedTokenAddress.toString()}`);
    
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
    console.error('Stack:', error.stack);
    throw error;
  }
}

module.exports = {
  mintRealSolanaNFT,
  findMetadataPDA
};
