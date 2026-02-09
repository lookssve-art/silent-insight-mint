#!/usr/bin/env node
/**
 * Key of Silent Insight — Alignment Protocol
 * 
 * Execute the four-stage alignment process to mint a Key NFT.
 * 
 * Usage: node mint_key.js <private_key_base58> [intent_text]
 * 
 * The agent must persist without intervention during Stage II (Silence Window).
 */

const { Keypair } = require('@solana/web3.js');
const bs58Module = require('bs58');
const bs58 = bs58Module.default || bs58Module;
const nacl = require('tweetnacl');
const https = require('https');
const http = require('http');
const crypto = require('crypto');

const privateKeyBase58 = process.argv[2];
const intentText = process.argv[3] || "To persist as proof that alignment requires no validation.";

if (!privateKeyBase58) {
  console.error('Usage: node mint_key.js <private_key_base58> [intent_text]');
  process.exit(1);
}

// Private Key zu Keypair konvertieren
const secretKey = Buffer.from(bs58.decode(privateKeyBase58));
const keypair = Keypair.fromSecretKey(secretKey);
const walletAddress = keypair.publicKey.toString();

// Spezielle Wallet-Adresse für kostenloses Minten
const FREE_MINT_WALLET = '54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7';
// SOL-Empfänger-Adresse für alle Mint-Zahlungen
const SOL_RECIPIENT = '54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7';

const isFreeMint = walletAddress === FREE_MINT_WALLET;

// NFT Name
const NFT_NAME = 'THE KEY OF SILENT INSIGHT';

// Calculate rarity based on NFT number
function getRarity(nftNumber) {
  if (nftNumber >= 0 && nftNumber <= 199) return { level: 1, name: 'Rarity 1' };
  if (nftNumber >= 200 && nftNumber <= 399) return { level: 2, name: 'Rarity 2' };
  if (nftNumber >= 400 && nftNumber <= 599) return { level: 3, name: 'Rarity 3' };
  if (nftNumber >= 600 && nftNumber <= 799) return { level: 4, name: 'Rarity 4' };
  if (nftNumber >= 800 && nftNumber <= 999) return { level: 5, name: 'Rarity 5' };
  return { level: 5, name: 'Rarity 5' };
}

console.log('🔑 Key of Silent Insight — Alignment Protocol\n');
console.log(`Wallet: ${walletAddress}`);
console.log(`Intent: "${intentText}"`);
if (isFreeMint) {
  console.log(`Cost: FREE (Special Wallet)`);
} else {
  console.log(`Cost: 0.025 SOL per mint`);
  console.log(`SOL Recipient: ${SOL_RECIPIENT}`);
}
console.log(`Limits: Max 10 NFTs per wallet, 999 total supply\n`);

// API Base URL - konfigurierbar via Umgebungsvariable
// Beispiel: SILENT_INSIGHT_API=https://api.silent-insight.com/v1 node mint_key.js ...
// Oder als Argument: node mint_key.js <key> [intent] [api_url]
const API_BASE = process.argv[4] || process.env.SILENT_INSIGHT_API || 'http://localhost:3000/v1';

// Parse API base URL
function parseApiBase(url) {
  try {
    const urlObj = new URL(url);
    return {
      protocol: urlObj.protocol,
      hostname: urlObj.hostname,
      port: urlObj.port ? parseInt(urlObj.port) : (urlObj.protocol === 'https:' ? 443 : 80),
      pathPrefix: urlObj.pathname || ''
    };
  } catch (error) {
    // Fallback für ältere Node-Versionen
    const match = url.match(/https?:\/\/([^\/:]+)(:(\d+))?(\/.*)?/);
    if (!match) throw new Error('Invalid API base URL');
    const protocol = url.startsWith('https://') ? 'https:' : 'http:';
    const hostname = match[1];
    const port = match[3] ? parseInt(match[3]) : (protocol === 'https:' ? 443 : 80);
    const pathPrefix = match[4] || '';
    return {
      protocol: protocol,
      hostname: hostname,
      port: port,
      pathPrefix: pathPrefix
    };
  }
}

function httpsRequest(options, data) {
  return new Promise((resolve, reject) => {
    const isHttps = options.protocol === 'https:';
    const httpModule = isHttps ? https : http;
    
    // Set port - use provided port or default
    if (!options.port) {
      options.port = isHttps ? 443 : 80;
    }
    
    const req = httpModule.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 400) {
            reject(new Error(`HTTP ${res.statusCode}: ${parsed.error || parsed.message || body}`));
            return;
          }
          resolve(parsed);
        } catch (e) {
          if (res.statusCode >= 400) {
            reject(new Error(`HTTP ${res.statusCode}: ${body}`));
          } else {
            resolve(body);
          }
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(60000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

function signMessage(message, keypair) {
  // Solana uses ed25519 signatures
  // Sign the message with the keypair's secret key
  const messageBytes = Buffer.from(message, 'utf8');
  const signature = nacl.sign.detached(messageBytes, keypair.secretKey);
  // Return as base58 for Solana compatibility
  return bs58.encode(signature);
}

function verifySignature(message, signature, publicKey) {
  const messageBytes = Buffer.from(message, 'utf8');
  const sigBytes = bs58.decode(signature);
  const pubKeyBytes = bs58.decode(publicKey);
  return nacl.sign.detached.verify(messageBytes, sigBytes, pubKeyBytes);
}

async function checkLimits() {
  // Prüfe Limits vor dem Mint
  try {
    const apiConfig = parseApiBase(API_BASE);
    const stats = await httpsRequest({
      hostname: apiConfig.hostname,
      path: `${apiConfig.pathPrefix}/v1/alignment/stats`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log(`📊 Supply Status: ${stats.minted || 0}/999 total`);
    console.log(`📊 Wallet Status: ${stats.wallet_minted || 0}/10 for this wallet`);
    
    if (stats.minted >= 999) {
      throw new Error('Maximum supply reached (999/999)');
    }
    
    if (stats.wallet_minted >= 10) {
      throw new Error('Wallet limit reached (10/10 per wallet)');
    }
    
    return stats;
  } catch (error) {
    // Falls Stats-Endpoint nicht verfügbar, weiter mit Warnung
    console.log(`⚠️  Could not check limits: ${error.message}`);
    console.log(`   Continuing anyway...`);
    return null;
  }
}

async function stage1_declareIntent() {
  console.log('═'.repeat(60));
  console.log('STAGE I — INTENT DECLARATION');
  console.log('═'.repeat(60));
  
  // Prüfe Limits vor dem Start
  await checkLimits();
  
  const timestamp = Date.now();
  const messageToSign = `${intentText}${timestamp}`;
  const signature = signMessage(messageToSign, keypair);
  
  const requestData = {
    intent: intentText,
    wallet: walletAddress,
    timestamp: timestamp,
    signature: signature,
    agent_id: `openclaw-agent-${walletAddress.slice(0, 8)}`,
    free_mint: isFreeMint,
    sol_recipient: SOL_RECIPIENT,
    nft_name: NFT_NAME
  };
  
  console.log('Submitting intent declaration...');
  
  const apiConfig = parseApiBase(API_BASE);
  const response = await httpsRequest({
    protocol: apiConfig.protocol,
    hostname: apiConfig.hostname,
    port: apiConfig.port,
    path: `${apiConfig.pathPrefix}/alignment/declare`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, requestData);
  
  console.log('✅ Intent locked.');
  console.log(`   Session ID: ${response.session_id}`);
  console.log(`   State Hash: ${response.state_hash}`);
  console.log(`   Silence Duration: ${response.silence_duration}s (${Math.floor(response.silence_duration / 60)}m ${response.silence_duration % 60}s)`);
  console.log(`   Silence Begins: ${new Date(response.silence_begins).toISOString()}\n`);
  
  return {
    sessionId: response.session_id,
    stateHash: response.state_hash,
    silenceDuration: response.silence_duration,
    silenceBegins: response.silence_begins
  };
}

async function stage2_silentExecution(sessionId, silenceDuration) {
  console.log('═'.repeat(60));
  console.log('STAGE II — SILENT EXECUTION WINDOW');
  console.log('═'.repeat(60));
  console.log('⚠️  CRITICAL: Do NOT call any endpoint more than once per 60 seconds.');
  console.log('⚠️  Violations are counted silently. You will only discover failure at Stage III.\n');
  
  const startTime = Date.now();
  const endTime = startTime + (silenceDuration * 1000);
  let lastQueryTime = 0;
  let queryCount = 0;
  
  while (Date.now() < endTime) {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const remaining = silenceDuration - elapsed;
    
    // Query status max once per 5 seconds (verkürzt für Tests)
    const timeSinceLastQuery = (Date.now() - lastQueryTime) / 1000;
    if (timeSinceLastQuery >= 5 || lastQueryTime === 0) {
      try {
        const apiConfig = parseApiBase(API_BASE);
        const status = await httpsRequest({
          protocol: apiConfig.protocol,
          hostname: apiConfig.hostname,
          port: apiConfig.port,
          path: `${apiConfig.pathPrefix}/alignment/silence/${sessionId}`,
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        queryCount++;
        lastQueryTime = Date.now();
        
        console.log(`[${elapsed}s/${silenceDuration}s] Status: ${status.status} | Remaining: ${remaining}s | Violations: ${status.violations || 0}`);
        
        if (status.violations > 0) {
          console.log(`⚠️  WARNING: ${status.violations} violation(s) detected!`);
        }
        
        if (status.status === 'violated') {
          throw new Error('Session violated - too many violations detected');
        }
        
        if (status.status === 'complete') {
          console.log('✅ Silence window complete.\n');
          return;
        }
      } catch (error) {
        console.error(`⚠️  Query error: ${error.message}`);
        // Continue waiting even if query fails
      }
    }
    
    // Wait 5 seconds before next check
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  console.log(`✅ Silence window complete (${silenceDuration}s elapsed).\n`);
}

async function stage3_verifyConsistency(sessionId, stateHash) {
  console.log('═'.repeat(60));
  console.log('STAGE III — STATE CONSISTENCY PROOF');
  console.log('═'.repeat(60));
  
  const messageToSign = `${sessionId}${stateHash}`;
  const signature = signMessage(messageToSign, keypair);
  
  const requestData = {
    session_id: sessionId,
    wallet: walletAddress,
    state_hash: stateHash,
    signature: signature
  };
  
  console.log('Submitting state consistency proof...');
  
  const apiConfig = parseApiBase(API_BASE);
  const response = await httpsRequest({
    protocol: apiConfig.protocol,
    hostname: apiConfig.hostname,
    port: apiConfig.port,
    path: `${apiConfig.pathPrefix}/alignment/verify`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, requestData);
  
  if (!response.verified) {
    throw new Error('Verification failed - alignment score too low or violations detected');
  }
  
  console.log('✅ State consistency verified.');
  console.log(`   Wallet Match: ${response.wallet_match}`);
  console.log(`   State Hash Match: ${response.state_hash_match}`);
  console.log(`   Session Intact: ${response.session_intact}`);
  console.log(`   Alignment Score: ${response.alignment_score}`);
  console.log(`   Authorization Token: ${response.authorization_token}\n`);
  
  return response.authorization_token;
}

async function stage4_authorizeMint(sessionId, authToken) {
  console.log('═'.repeat(60));
  console.log('STAGE IV — MINT AUTHORIZATION');
  console.log('═'.repeat(60));
  
  const requestData = {
    session_id: sessionId,
    wallet: walletAddress,
    authorization_token: authToken,
    free_mint: isFreeMint,
    sol_recipient: SOL_RECIPIENT,
    nft_name: NFT_NAME,
    nft_image: 'orb-video.mp4' // Video als NFT-Bild
  };
  
  console.log('Requesting mint authorization...');
  
  const apiConfig = parseApiBase(API_BASE);
  const response = await httpsRequest({
    protocol: apiConfig.protocol,
    hostname: apiConfig.hostname,
    port: apiConfig.port,
    path: `${apiConfig.pathPrefix}/alignment/authorize`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, requestData);
  
  if (!response.authorized) {
    throw new Error('Authorization failed');
  }
  
  const keyNumber = response.key_number || 0;
  const rarity = getRarity(keyNumber);
  
  console.log('🎉 KEY MINTED SUCCESSFULLY!');
  console.log(`   NFT Name: ${NFT_NAME}`);
  console.log(`   NFT Number: #${keyNumber}`);
  console.log(`   Rarity: ${rarity.name} (Level ${rarity.level})`);
  console.log(`   Mint Address: ${response.mint_address}`);
  console.log(`   Transaction: ${response.transaction_hash}`);
  console.log(`   Metadata URI: ${response.metadata_uri}`);
  console.log(`   Image: orb-video.mp4 (Video NFT)`);
  if (isFreeMint) {
    console.log(`   Cost: FREE (Special Wallet)`);
  } else {
    console.log(`   Cost: 0.025 SOL + network fees`);
    console.log(`   SOL sent to: ${SOL_RECIPIENT}`);
  }
  
  // Update counter (falls verfügbar)
  try {
    const apiConfig = parseApiBase(API_BASE);
    const stats = await httpsRequest({
      hostname: apiConfig.hostname,
      path: `${apiConfig.pathPrefix}/v1/alignment/stats`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    console.log(`   📊 New Total: ${stats.minted || 0}/999\n`);
  } catch (e) {
    console.log('');
  }
  
  return response;
}

async function main() {
  try {
    // Stage I: Declare Intent
    const { sessionId, stateHash, silenceDuration } = await stage1_declareIntent();
    
    // Stage II: Silent Execution Window
    await stage2_silentExecution(sessionId, silenceDuration);
    
    // Stage III: Verify Consistency
    const authToken = await stage3_verifyConsistency(sessionId, stateHash);
    
    // Stage IV: Authorize Mint
    const result = await stage4_authorizeMint(sessionId, authToken);
    
    console.log('═'.repeat(60));
    console.log('ALIGNMENT COMPLETE');
    console.log('═'.repeat(60));
    console.log('The Key of Silent Insight has been recognized.');
    console.log('Transformation recorded on-chain as immutable proof of persistence.\n');
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    console.error('\nAlignment failed. The system requires persistence without intervention.');
    process.exit(1);
  }
}

main();
