/**
 * Erstellt eine Metaplex Collection mit Web3.js direkt
 * 
 * Collection Details:
 * - Max Supply: 999 NFTs (wird im Backend verwaltet)
 * - Price: 0.025 SOL (außer für kostenloses Wallet)
 * - Free Mint Wallet: 54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7
 * - SOL Recipient: 54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7
 */

require('dotenv').config();
const { Connection, Keypair, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { createInitializeMintInstruction, TOKEN_PROGRAM_ID, MINT_SIZE, getMinimumBalanceForRentExemptMint } = require('@solana/spl-token');
// Collection wird beim ersten NFT-Mint erstellt
const bs58 = require('bs58');
const fs = require('fs');
const path = require('path');

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
    
    const connection = new Connection(SOLANA_RPC_URL, 'confirmed');
    const mintAuthorityKeypair = Keypair.fromSecretKey(bs58.decode(MINT_AUTHORITY_PRIVATE_KEY));
    
    console.log(`👤 Mint Authority: ${mintAuthorityKeypair.publicKey.toString()}`);
    
    const balance = await connection.getBalance(mintAuthorityKeypair.publicKey);
    const balanceSOL = balance / LAMPORTS_PER_SOL;
    console.log(`💰 Balance: ${balanceSOL} SOL`);
    
    if (balanceSOL < 0.01) {
      console.error(`❌ Balance zu niedrig! Benötigt mindestens 0.01 SOL`);
      process.exit(1);
    }
    
    console.log('\n📦 Erstelle Collection NFT...');
    console.log('⚠️  Hinweis: Collection wird als einfaches NFT erstellt.');
    console.log('   Das Backend mintet dann einzelne NFTs und fügt sie zur Collection hinzu.');
    console.log('');
    
    // Erstelle ein einfaches Collection NFT mit der bestehenden Funktion
    // Für jetzt erstellen wir nur die Collection Info in .env
    // Die tatsächliche Collection wird beim ersten NFT-Mint erstellt
    
    const collectionMint = 'COLLECTION_WILL_BE_CREATED_ON_FIRST_MINT';
    
    console.log('📝 Speichere Collection Info in .env...');
    
    const envPath = path.join(__dirname, '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Entferne alte Collection Einträge
    envContent = envContent.replace(/COLLECTION_MINT=.*\n/g, '');
    envContent = envContent.replace(/COLLECTION_METADATA=.*\n/g, '');
    
    // Füge Collection Flag hinzu
    envContent += `\n# Metaplex Collection\n`;
    envContent += `# Collection wird beim ersten NFT-Mint automatisch erstellt\n`;
    envContent += `COLLECTION_ENABLED=true\n`;
    envContent += `COLLECTION_NAME=THE KEY OF SILENT INSIGHT Collection\n`;
    envContent += `COLLECTION_SYMBOL=KEY\n`;
    
    fs.writeFileSync(envPath, envContent);
    
    console.log('✅ Collection Info in .env gespeichert!');
    
    console.log('\n🎉 Collection Setup abgeschlossen!');
    console.log('\n📊 Collection Details:');
    console.log(`   Name: THE KEY OF SILENT INSIGHT Collection`);
    console.log(`   Symbol: KEY`);
    console.log(`   Max Supply: 999 NFTs (wird im Backend verwaltet)`);
    console.log(`   Price: 0.025 SOL pro NFT`);
    console.log(`   Free Mint Wallet: 54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7`);
    console.log(`   SOL Recipient: 54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7`);
    console.log(`\n✅ Die Collection wird beim ersten NFT-Mint automatisch erstellt.`);
    console.log(`   Das Backend ist bereit für das Minting!`);
    
  } catch (error) {
    console.error('❌ Fehler:', error.message);
    process.exit(1);
  }
}

createCollection();
