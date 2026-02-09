/**
 * Erstellt eine Metaplex Candy Machine v3 Collection
 * 
 * Collection Details:
 * - Max Supply: 999 NFTs
 * - Price: 0.025 SOL pro NFT
 * - Name: "THE KEY OF SILENT INSIGHT"
 */

require('dotenv').config();
const { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { createUmi } = require('@metaplex-foundation/umi-bundle-defaults');
const { walletAdapterIdentity } = require('@metaplex-foundation/umi-web3js-adapters');
const { keypairIdentity } = require('@metaplex-foundation/umi');
const { createNft, findMetadataPda } = require('@metaplex-foundation/mpl-token-metadata');
const { createCandyMachineV3, addConfigLines, setCollection } = require('@metaplex-foundation/mpl-candy-machine-core');
const { setMintAuthority } = require('@metaplex-foundation/mpl-candy-machine-core');
const bs58 = require('bs58');

const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
const MINT_AUTHORITY_PRIVATE_KEY = process.env.SOLANA_MINT_AUTHORITY_PRIVATE_KEY;

if (!MINT_AUTHORITY_PRIVATE_KEY) {
  console.error('❌ SOLANA_MINT_AUTHORITY_PRIVATE_KEY nicht in .env gefunden!');
  process.exit(1);
}

async function createCollection() {
  try {
    console.log('🚀 Erstelle Metaplex Collection...');
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
    
    if (balanceSOL < 0.1) {
      console.error(`❌ Balance zu niedrig! Benötigt mindestens 0.1 SOL, aktuell: ${balanceSOL} SOL`);
      console.log(`   Bitte sende mehr SOL an: ${mintAuthorityPublicKey.toString()}`);
      process.exit(1);
    }
    
    // Erstelle UMI Instance
    const umi = createUmi(SOLANA_RPC_URL);
    umi.use(keypairIdentity(mintAuthorityKeypair));
    
    console.log('\n📦 Erstelle Collection NFT...');
    
    // Erstelle Collection NFT
    const collectionNft = await createNft(umi, {
      name: 'THE KEY OF SILENT INSIGHT Collection',
      symbol: 'KEY',
      uri: 'https://your-domain.com/collection.json',
      sellerFeeBasisPoints: 0,
      isCollection: true,
    }).sendAndConfirm(umi);
    
    const collectionMint = collectionNft.mint;
    const collectionMetadata = findMetadataPda(umi, { mint: collectionMint });
    
    console.log(`✅ Collection NFT erstellt!`);
    console.log(`   Collection Mint: ${collectionMint.toString()}`);
    console.log(`   Collection Metadata: ${collectionMetadata.toString()}`);
    
    console.log('\n🍬 Erstelle Candy Machine v3...');
    
    // Erstelle Candy Machine v3
    const candyMachine = await createCandyMachineV3(umi, {
      itemsAvailable: 999, // Max 999 NFTs
      symbol: 'KEY',
      sellerFeeBasisPoints: 0,
      collection: {
        mint: collectionMint,
        updateAuthority: mintAuthorityPublicKey,
      },
      creators: [
        {
          address: mintAuthorityPublicKey,
          verified: true,
          share: 100,
        },
      ],
      guards: {
        solPayment: {
          lamports: 0.025 * LAMPORTS_PER_SOL, // 0.025 SOL pro NFT
          destination: new PublicKey('54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7'), // SOL Empfänger
        },
        mintLimit: {
          id: 1,
          limit: 10, // Max 10 NFTs pro Wallet
        },
      },
    }).sendAndConfirm(umi);
    
    const candyMachineAddress = candyMachine.candyMachine;
    
    console.log(`✅ Candy Machine erstellt!`);
    console.log(`   Candy Machine: ${candyMachineAddress.toString()}`);
    console.log(`   Max Supply: 999 NFTs`);
    console.log(`   Price: 0.025 SOL`);
    console.log(`   Max per Wallet: 10 NFTs`);
    
    console.log('\n📝 Speichere Collection Info in .env...');
    
    // Speichere Collection Info in .env
    const fs = require('fs');
    const envPath = require('path').join(__dirname, '.env');
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
    console.log(`   Price: 0.025 SOL pro NFT`);
    console.log(`   Max per Wallet: 10 NFTs`);
    console.log(`   SOL Empfänger: 54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7`);
    console.log(`\n🔗 Explorer Links:`);
    console.log(`   Collection: https://explorer.solana.com/address/${collectionMint.toString()}`);
    console.log(`   Candy Machine: https://explorer.solana.com/address/${candyMachineAddress.toString()}`);
    
  } catch (error) {
    console.error('❌ Fehler beim Erstellen der Collection:', error);
    if (error.logs) {
      console.error('Transaction Logs:', error.logs);
    }
    process.exit(1);
  }
}

createCollection();
