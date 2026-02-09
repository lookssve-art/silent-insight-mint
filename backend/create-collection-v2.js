/**
 * Erstellt eine Metaplex Core Candy Machine Collection
 * 
 * Collection Details:
 * - Max Supply: 999 NFTs
 * - Price: 0.025 SOL pro NFT
 * - Name: "THE KEY OF SILENT INSIGHT"
 */

require('dotenv').config();
const { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { createUmi } = require('@metaplex-foundation/umi-bundle-defaults');
const { keypairIdentity, publicKey } = require('@metaplex-foundation/umi');
const { generateSigner, signerIdentity } = require('@metaplex-foundation/umi');
// Plugins werden automatisch von umi-bundle-defaults geladen
const { createNft, findMetadataPda } = require('@metaplex-foundation/mpl-token-metadata');
const { create } = require('@metaplex-foundation/mpl-core-candy-machine');
const bs58 = require('bs58');
const fs = require('fs');
const path = require('path');

const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
const MINT_AUTHORITY_PRIVATE_KEY = process.env.SOLANA_MINT_AUTHORITY_PRIVATE_KEY;
const SOL_RECIPIENT = '54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7';

if (!MINT_AUTHORITY_PRIVATE_KEY) {
  console.error('❌ SOLANA_MINT_AUTHORITY_PRIVATE_KEY nicht in .env gefunden!');
  process.exit(1);
}

async function createCollection() {
  try {
    console.log('🚀 Erstelle Metaplex Core Candy Machine Collection...');
    console.log(`📡 RPC: ${SOLANA_RPC_URL}`);
    
    // Erstelle Connection
    const connection = new Connection(SOLANA_RPC_URL, 'confirmed');
    
    // Erstelle Keypair aus Private Key
    const mintAuthorityKeypair = Keypair.fromSecretKey(bs58.decode(MINT_AUTHORITY_PRIVATE_KEY));
    const mintAuthorityPublicKey = mintAuthorityKeypair.publicKey;
    
    console.log(`👤 Mint Authority: ${mintAuthorityPublicKey.toString()}`);
    
    // Prüfe Balance
    const balance = await connection.getBalance(mintAuthorityPublicKey);
    const balanceSOL = balance / LAMPORTS_PER_SOL;
    console.log(`💰 Balance: ${balanceSOL} SOL`);
    
    // Mindestbalance für Collection Creation (ca. 0.01 SOL für Fees + Rent)
    const minBalance = 0.01;
    if (balanceSOL < minBalance) {
      console.error(`❌ Balance zu niedrig! Benötigt mindestens ${minBalance} SOL, aktuell: ${balanceSOL} SOL`);
      console.log(`   Bitte sende mehr SOL an: ${mintAuthorityPublicKey.toString()}`);
      process.exit(1);
    }
    console.log(`✅ Balance ausreichend für Collection Creation`);
    
    // Erstelle UMI Instance (Plugins werden automatisch geladen)
    const umi = createUmi(SOLANA_RPC_URL);
    umi.use(keypairIdentity(mintAuthorityKeypair));
    
    // Registriere SPL Token Program korrekt
    umi.programs.add(createSolanaProgram({
      name: 'splAssociatedToken',
      publicKey: publicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'),
    }), { override: true });
    
    console.log('\n📦 Erstelle Collection NFT...');
    
    // Erstelle Collection NFT Mint
    const collectionMintSigner = generateSigner(umi);
    
    // Erstelle Collection NFT
    const createNftTx = await createNft(umi, {
      mint: collectionMintSigner,
      name: 'THE KEY OF SILENT INSIGHT Collection',
      symbol: 'KEY',
      uri: 'https://your-domain.com/collection.json',
      sellerFeeBasisPoints: 0,
      isCollection: true,
    }).sendAndConfirm(umi);
    
    const collectionMint = collectionMintSigner.publicKey;
    const collectionMetadata = findMetadataPda(umi, { mint: collectionMint });
    
    console.log(`✅ Collection NFT erstellt!`);
    console.log(`   Collection Mint: ${collectionMint.toString()}`);
    console.log(`   Collection Metadata: ${collectionMetadata.toString()}`);
    
    console.log('\n🍬 Erstelle Core Candy Machine...');
    
    // Erstelle Candy Machine Signer
    const candyMachine = generateSigner(umi);
    
    // Erstelle Candy Machine
    const createTx = await create(umi, {
      candyMachine: candyMachine.publicKey,
      collection: publicKey(collectionMint.toString()),
      collectionUpdateAuthority: umi.identity.publicKey,
      itemsAvailable: 999, // Max 999 NFTs
      authority: umi.identity.publicKey,
      isMutable: false,
      // Hidden Settings für einfaches Minting ohne vorherige Uploads
      hiddenSettings: {
        name: 'THE KEY OF SILENT INSIGHT #$ID+1$',
        uri: 'https://your-domain.com/metadata/$ID+1$.json',
        hash: Buffer.alloc(32).toString('hex'), // Placeholder hash
      },
    }).sendAndConfirm(umi);
    
    const candyMachineAddress = candyMachine.publicKey;
    
    console.log(`✅ Candy Machine erstellt!`);
    console.log(`   Candy Machine: ${candyMachineAddress.toString()}`);
    console.log(`   Max Supply: 999 NFTs`);
    console.log(`   Price: 0.025 SOL (wird über Guards gesetzt)`);
    console.log(`   Collection: ${collectionMint.toString()}`);
    
    console.log('\n📝 Speichere Collection Info in .env...');
    
    // Speichere Collection Info in .env
    const envPath = path.join(__dirname, '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Entferne alte Collection Einträge
    envContent = envContent.replace(/COLLECTION_MINT=.*\n/g, '');
    envContent = envContent.replace(/COLLECTION_METADATA=.*\n/g, '');
    envContent = envContent.replace(/CANDY_MACHINE=.*\n/g, '');
    
    // Füge neue Einträge hinzu
    envContent += `\n# Metaplex Collection\n`;
    envContent += `COLLECTION_MINT=${collectionMint.toString()}\n`;
    envContent += `COLLECTION_METADATA=${collectionMetadata.toString()}\n`;
    envContent += `CANDY_MACHINE=${candyMachineAddress.toString()}\n`;
    
    fs.writeFileSync(envPath, envContent);
    
    console.log('✅ Collection Info in .env gespeichert!');
    
    console.log('\n🎉 Collection erfolgreich erstellt!');
    console.log('\n📊 Collection Details:');
    console.log(`   Collection Mint: ${collectionMint.toString()}`);
    console.log(`   Candy Machine: ${candyMachineAddress.toString()}`);
    console.log(`   Max Supply: 999 NFTs`);
    console.log(`   Price: 0.025 SOL pro NFT (muss noch über Guards konfiguriert werden)`);
    console.log(`   SOL Empfänger: ${SOL_RECIPIENT}`);
    console.log(`\n🔗 Explorer Links:`);
    console.log(`   Collection: https://explorer.solana.com/address/${collectionMint.toString()}`);
    console.log(`   Candy Machine: https://explorer.solana.com/address/${candyMachineAddress.toString()}`);
    console.log(`\n⚠️  WICHTIG: Candy Guards müssen noch konfiguriert werden für:`);
    console.log(`   - Price: 0.025 SOL`);
    console.log(`   - Max per Wallet: 10 NFTs`);
    console.log(`   - SOL Recipient: ${SOL_RECIPIENT}`);
    
  } catch (error) {
    console.error('❌ Fehler beim Erstellen der Collection:', error);
    if (error.logs) {
      console.error('Transaction Logs:', error.logs);
    }
    if (error.message) {
      console.error('Error Message:', error.message);
    }
    process.exit(1);
  }
}

createCollection();
