/**
 * Erstellt eine einfache Metaplex Collection ohne Candy Machine
 * 
 * Collection Details:
 * - Max Supply: 999 NFTs (wird im Backend verwaltet)
 * - Price: 0.025 SOL pro NFT
 * - Name: "THE KEY OF SILENT INSIGHT"
 * 
 * Hinweis: Dies erstellt nur die Collection. Das Backend mintet dann einzelne NFTs
 * zur Collection hinzu.
 */

require('dotenv').config();
const { Connection, Keypair, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { createUmi } = require('@metaplex-foundation/umi-bundle-defaults');
const { keypairIdentity } = require('@metaplex-foundation/umi');
const { generateSigner } = require('@metaplex-foundation/umi');
const { createNft, findMetadataPda } = require('@metaplex-foundation/mpl-token-metadata');
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
    
    if (balanceSOL < 0.01) {
      console.error(`❌ Balance zu niedrig! Benötigt mindestens 0.01 SOL, aktuell: ${balanceSOL} SOL`);
      console.log(`   Bitte sende mehr SOL an: ${mintAuthorityPublicKey.toString()}`);
      process.exit(1);
    }
    
    // Erstelle UMI Instance
    const umi = createUmi(SOLANA_RPC_URL);
    umi.use(keypairIdentity(mintAuthorityKeypair));
    
    // Registriere SPL Associated Token Program für Mainnet
    const { publicKey } = require('@metaplex-foundation/umi');
    umi.programs.add({
      name: 'splAssociatedToken',
      publicKey: publicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'),
    }, { override: true });
    
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
    
    fs.writeFileSync(envPath, envContent);
    
    console.log('✅ Collection Info in .env gespeichert!');
    
    console.log('\n🎉 Collection erfolgreich erstellt!');
    console.log('\n📊 Collection Details:');
    console.log(`   Collection Mint: ${collectionMint.toString()}`);
    console.log(`   Collection Metadata: ${collectionMetadata.toString()}`);
    console.log(`   Max Supply: 999 NFTs (wird im Backend verwaltet)`);
    console.log(`   Price: 0.025 SOL pro NFT`);
    console.log(`   Max per Wallet: 10 NFTs`);
    console.log(`\n🔗 Explorer Link:`);
    console.log(`   Collection: https://explorer.solana.com/address/${collectionMint.toString()}`);
    console.log(`\n⚠️  HINWEIS: Das Backend mintet einzelne NFTs zur Collection hinzu.`);
    console.log(`   Die Collection ist jetzt bereit für das Minting!`);
    
  } catch (error) {
    console.error('❌ Fehler beim Erstellen der Collection:', error);
    if (error.logs) {
      console.error('Transaction Logs:', error.logs);
    }
    if (error.message) {
      console.error('Error Message:', error.message);
    }
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
    process.exit(1);
  }
}

createCollection();
