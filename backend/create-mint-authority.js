#!/usr/bin/env node
/**
 * Erstellt einen Mint Authority Keypair für Solana NFT Minting
 * 
 * Usage: node create-mint-authority.js [--devnet]
 */

const { Keypair } = require('@solana/web3.js');
const bs58 = require('bs58');

const isDevnet = process.argv.includes('--devnet');

const keypair = Keypair.generate();
const privateKeyBase58 = bs58.encode(keypair.secretKey);
const publicKey = keypair.publicKey.toString();

console.log('🔑 Neuer Mint Authority Keypair erstellt!\n');
console.log('═══════════════════════════════════════════════════════');
console.log('PUBLIC KEY (Wallet Adresse):');
console.log(publicKey);
console.log('\nPRIVATE KEY (Base58) - NIEMALS TEILEN!');
console.log(privateKeyBase58);
console.log('═══════════════════════════════════════════════════════\n');

console.log('📋 Nächste Schritte:\n');

if (isDevnet) {
  console.log('1. Hole kostenloses Devnet SOL:');
  console.log(`   https://faucet.solana.com/?address=${publicKey}\n`);
  console.log('2. Setze in backend/.env:');
  console.log(`   SOLANA_MINT_AUTHORITY_PRIVATE_KEY=${privateKeyBase58}`);
  console.log('   SOLANA_RPC_URL=https://api.devnet.solana.com\n');
} else {
  console.log('1. Sende SOL zu dieser Adresse:');
  console.log(`   ${publicKey}`);
  console.log('   (Mindestens 0.01 SOL für mehrere NFTs)\n');
  console.log('2. Setze in backend/.env:');
  console.log(`   SOLANA_MINT_AUTHORITY_PRIVATE_KEY=${privateKeyBase58}`);
  console.log('   SOLANA_RPC_URL=https://api.mainnet-beta.solana.com\n');
}

console.log('3. Starte Backend neu');
console.log('4. Mint ein NFT - es wird jetzt ECHT auf Solana gemintet!\n');

console.log('⚠️  WICHTIG:');
console.log('   - Bewahre den Private Key sicher auf!');
console.log('   - Niemals teilen oder committen!');
console.log('   - Für Tests: Verwende --devnet Flag\n');
