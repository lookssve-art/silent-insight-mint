/**
 * Vollständige Solana NFT Minting Implementierung
 * Verwendet Metaplex Token Metadata Standard
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
  getMint,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  getAccount,
  createMintToInstruction,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  getMinimumBalanceForRentExemptMint
} = require('@solana/spl-token');
const bs58 = require('bs58');
const crypto = require('crypto');

// Metaplex Metadata Program ID
const METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

/**
 * Findet Metadata Account PDA
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
 * Erstellt Metadata Instruction für Metaplex
 */
function createMetadataInstruction({
  metadataAccount,
  mint,
  mintAuthority,
  payer,
  updateAuthority,
  metadataUri,
  name,
  symbol
}) {
  const data = Buffer.alloc(1 + 4 + name.length + 4 + symbol.length + 4 + metadataUri.length + 2 + 1 + 4);
  let offset = 0;
  
  // Key (1 byte) - MetadataV1 = 4
  data.writeUInt8(4, offset);
  offset += 1;
  
  // Update Authority (32 bytes) - wird später gesetzt
  // Data (variable)
  // Name length
  data.writeUInt32LE(name.length, offset);
  offset += 4;
  data.write(name, offset, 'utf8');
  offset += name.length;
  
  // Symbol length
  data.writeUInt32LE(symbol.length, offset);
  offset += 4;
  data.write(symbol, offset, 'utf8');
  offset += symbol.length;
  
  // URI length
  data.writeUInt32LE(metadataUri.length, offset);
  offset += 4;
  data.write(metadataUri, offset, 'utf8');
  offset += metadataUri.length;
  
  // Seller Fee Basis Points (2 bytes) - 0 = keine Royalties
  data.writeUInt16LE(0, offset);
  offset += 2;
  
  // Creators (1 byte) - has_creators = false
  data.writeUInt8(0, offset);
  offset += 1;
  
  // Creators array length (4 bytes) - 0
  data.writeUInt32LE(0, offset);
  
  // Erstelle Account Creation Instruction
  const lamports = 1000000; // ~0.001 SOL für Metadata Account
  
  const keys = [
    { pubkey: metadataAccount, isSigner: false, isWritable: true },
    { pubkey: mint, isSigner: false, isWritable: false },
    { pubkey: mintAuthority, isSigner: true, isWritable: false },
    { pubkey: payer, isSigner: true, isWritable: true },
    { pubkey: updateAuthority, isSigner: false, isWritable: false },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false }
  ];
  
  return {
    programId: METADATA_PROGRAM_ID,
    keys: keys,
    data: Buffer.concat([
      Buffer.from([33]), // create_metadata_accounts_v3 instruction
      Buffer.from(metadataAccount.toBuffer()),
      Buffer.from(mint.toBuffer()),
      Buffer.from(mintAuthority.toBuffer()),
      Buffer.from(payer.toBuffer()),
      Buffer.from(updateAuthority.toBuffer()),
      Buffer.from([0, 0, 0, 0]), // is_mutable = false
      Buffer.from([name.length]),
      Buffer.from(name, 'utf8'),
      Buffer.from([symbol.length]),
      Buffer.from(symbol, 'utf8'),
      Buffer.from([metadataUri.length]),
      Buffer.from(metadataUri, 'utf8'),
      Buffer.from([0, 0]), // seller_fee_basis_points = 0
      Buffer.from([0]), // has_creators = false
      Buffer.from([0, 0, 0, 0]), // creators array length = 0
      Buffer.from([0]), // collection = null
      Buffer.from([0]), // uses = null
    ])
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
    console.log(`🪙 Minting NFT #${nftNumber} to wallet ${walletAddress.toString()}...`);
    
    // Erstelle neue Mint-Adresse
    const mintKeypair = Keypair.generate();
    const mintAddress = mintKeypair.publicKey;
    
    // Metadata URI
    const metadataUri = `https://your-domain.com/metadata/${nftNumber}.json`;
    const name = `THE KEY OF SILENT INSIGHT #${nftNumber}`;
    const symbol = 'KEY';
    
    // Finde Metadata PDA
    const metadataAccount = findMetadataPDA(mintAddress);
    
    // Berechne Lamports für Mint Account
    const lamports = await getMinimumBalanceForRentExemptMint(connection);
    
    // Erstelle Transaction
    const transaction = new Transaction();
    
    // 1. Erstelle Mint Account
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: mintAuthority.publicKey,
        newAccountPubkey: mintAddress,
        space: MINT_SIZE,
        lamports: lamports,
        programId: TOKEN_PROGRAM_ID
      })
    );
    
    // 2. Initialisiere Mint
    transaction.add(
      createInitializeMintInstruction(
        mintAddress,
        0, // Decimals (NFTs haben 0)
        mintAuthority.publicKey,
        null // Freeze Authority (null = kann nicht eingefroren werden)
      )
    );
    
    // 3. Erstelle Metadata Account und Instruction
    const metadataInstruction = createMetadataInstruction({
      metadataAccount: metadataAccount,
      mint: mintAddress,
      mintAuthority: mintAuthority.publicKey,
      payer: mintAuthority.publicKey,
      updateAuthority: mintAuthority.publicKey,
      metadataUri: metadataUri,
      name: name,
      symbol: symbol
    });
    
    transaction.add({
      keys: metadataInstruction.keys,
      programId: metadataInstruction.programId,
      data: metadataInstruction.data
    });
    
    // 4. Erstelle Associated Token Account für Wallet
    const associatedTokenAddress = await getAssociatedTokenAddress(
      mintAddress,
      walletAddress
    );
    
    try {
      await getAccount(connection, associatedTokenAddress);
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
    
    // 5. Mint Token zu Wallet
    transaction.add(
      createMintToInstruction(
        mintAddress,
        associatedTokenAddress,
        mintAuthority.publicKey,
        1, // Amount (1 für NFT)
        []
      )
    );
    
    // Signiere und sende
    transaction.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash;
    transaction.feePayer = mintAuthority.publicKey;
    transaction.sign(mintAuthority, mintKeypair);
    
    console.log('📤 Sending transaction to Solana...');
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [mintAuthority, mintKeypair],
      { commitment: 'confirmed', skipPreflight: false }
    );
    
    console.log(`✅ NFT minted successfully!`);
    console.log(`   Mint Address: ${mintAddress.toString()}`);
    console.log(`   Transaction: ${signature}`);
    console.log(`   Metadata: ${metadataAccount.toString()}`);
    
    return {
      mintAddress: mintAddress.toString(),
      transactionHash: signature,
      metadataUri: metadataUri,
      metadataAccount: metadataAccount.toString(),
      associatedTokenAddress: associatedTokenAddress.toString()
    };
    
  } catch (error) {
    console.error('❌ Solana NFT Minting Error:', error);
    throw error;
  }
}

module.exports = {
  mintRealSolanaNFT,
  findMetadataPDA
};
