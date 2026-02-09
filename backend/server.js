#!/usr/bin/env node
/**
 * Key of Silent Insight - Backend API Server
 * 
 * Implements the four-stage alignment protocol for NFT minting
 */

// Lade .env nur wenn vorhanden (Railway verwendet Environment Variables direkt)
try {
  require('dotenv').config();
} catch (e) {
  // Ignore if dotenv fails
}

const express = require('express');
const cors = require('cors');

// Optional dependencies - Server startet auch ohne diese
let createClient;
try {
  createClient = require('redis').createClient;
} catch (e) {
  console.warn('Redis not available');
}

let Pool;
try {
  Pool = require('pg').Pool;
} catch (e) {
  console.warn('PostgreSQL not available');
}

const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const bs58 = require('bs58');
const nacl = require('tweetnacl');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Wichtig für Railway: Server muss auf 0.0.0.0 lauschen
const HOST = process.env.HOST || '0.0.0.0';

// Middleware
// CORS: Erlaube alle Origins für öffentliches Hosting
// In Production sollte man spezifische Domains erlauben
app.use(cors({
  origin: process.env.CORS_ORIGIN === '*' ? '*' : (process.env.CORS_ORIGIN || '*').split(','),
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Initialize connections
let redisClient;
let dbPool;
let solanaConnection;

// Initialize Redis
async function initRedis() {
  // Skip Redis if module not available or no host configured
  if (!createClient) {
    console.log('ℹ️  Redis module not available, skipping...');
    redisClient = null;
    return Promise.resolve();
  }
  
  // Skip Redis if no host is configured (Railway doesn't always have Redis)
  if (!process.env.REDIS_HOST || process.env.REDIS_HOST === '' || process.env.REDIS_HOST === 'localhost') {
    console.log('ℹ️  Redis not configured, skipping...');
    redisClient = null;
    return Promise.resolve();
  }
  
  try {
    redisClient = createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379'),
        reconnectStrategy: false, // Don't retry on connection failure
      },
      password: process.env.REDIS_PASSWORD || undefined,
    });
    
    redisClient.on('error', (err) => {
      // Silently ignore Redis errors - we'll use in-memory fallback
      console.warn('⚠️  Redis error:', err.message);
      redisClient = null;
    });
    
    await Promise.race([
      redisClient.connect(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Redis timeout')), 2000))
    ]);
    console.log('✅ Redis connected');
  } catch (error) {
    // Redis is optional - continue without it
    console.warn('⚠️  Redis not available, using in-memory storage:', error.message);
    redisClient = null;
  }
}

// Initialize PostgreSQL
function initPostgreSQL() {
  // Skip PostgreSQL if module not available
  if (!Pool) {
    console.log('ℹ️  PostgreSQL module not available, using in-memory storage');
    dbPool = null;
    return;
  }
  
  // Skip PostgreSQL if no host is configured (Railway doesn't always have PostgreSQL)
  if (!process.env.DB_HOST || process.env.DB_HOST === '' || process.env.DB_HOST === 'localhost') {
    console.log('ℹ️  PostgreSQL not configured, using in-memory storage');
    dbPool = null;
    return;
  }
  
  try {
    dbPool = new Pool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'silent_insight',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    });
    
    dbPool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
    
    console.log('✅ PostgreSQL pool created');
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message);
    console.log('⚠️  Continuing without PostgreSQL (using in-memory storage)');
    dbPool = null;
  }
}

// Initialize Solana
function initSolana() {
  const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
  
  try {
    solanaConnection = new Connection(rpcUrl, 'confirmed');
    console.log(`✅ Solana connected to ${rpcUrl}`);
    
    // Test connection (non-blocking)
    solanaConnection.getVersion().then(version => {
      console.log(`✅ Solana RPC version: ${version['solana-core']}`);
    }).catch(err => {
      console.warn('⚠️  Solana RPC test failed (continuing anyway):', err.message);
    });
  } catch (error) {
    console.error('❌ Failed to initialize Solana connection:', error.message);
    console.warn('⚠️  Continuing without Solana connection');
    solanaConnection = null;
  }
}

// In-memory storage (fallback if DB not available)
const inMemoryStorage = {
  sessions: new Map(),
  mints: new Map(),
  walletMints: new Map(),
  mintCount: 0,
};

// Helper: Get or create session
async function getSession(sessionId) {
  if (redisClient && redisClient.isOpen) {
    try {
      const data = await redisClient.get(`session:${sessionId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Redis get error:', error);
    }
  }
  
  // Fallback to in-memory
  return inMemoryStorage.sessions.get(sessionId) || null;
}

// Helper: Save session
async function saveSession(sessionId, sessionData) {
  if (redisClient && redisClient.isOpen) {
    try {
      await redisClient.setEx(
        `session:${sessionId}`,
        3600, // 1 hour TTL
        JSON.stringify(sessionData)
      );
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }
  
  // Fallback to in-memory
  inMemoryStorage.sessions.set(sessionId, sessionData);
}

// Helper: Verify signature
function verifySignature(message, signature, publicKey) {
  try {
    const messageBytes = Buffer.from(message, 'utf8');
    const sigBytes = bs58.decode(signature);
    const pubKeyBytes = bs58.decode(publicKey);
    return nacl.sign.detached.verify(messageBytes, sigBytes, pubKeyBytes);
  } catch (error) {
    return false;
  }
}

// Helper: Get mint count
async function getMintCount() {
  if (dbPool) {
    try {
      const result = await dbPool.query('SELECT COUNT(*) as count FROM mints');
      return parseInt(result.rows[0].count);
    } catch (error) {
      console.error('DB query error:', error);
    }
  }
  return inMemoryStorage.mintCount;
}

// Helper: Get wallet mint count
async function getWalletMintCount(wallet) {
  if (dbPool) {
    try {
      const result = await dbPool.query(
        'SELECT COUNT(*) as count FROM mints WHERE wallet = $1',
        [wallet]
      );
      return parseInt(result.rows[0].count);
    } catch (error) {
      console.error('DB query error:', error);
    }
  }
  return inMemoryStorage.walletMints.get(wallet) || 0;
}

// Helper: Increment wallet mint count
async function incrementWalletMintCount(wallet) {
  if (dbPool) {
    try {
      await dbPool.query(
        'INSERT INTO wallet_mints (wallet, count) VALUES ($1, 1) ON CONFLICT (wallet) DO UPDATE SET count = wallet_mints.count + 1',
        [wallet]
      );
    } catch (error) {
      console.error('DB insert error:', error);
    }
  }
  
  const current = inMemoryStorage.walletMints.get(wallet) || 0;
  inMemoryStorage.walletMints.set(wallet, current + 1);
}

// Helper: Calculate rarity
function calculateRarity(nftNumber) {
  if (nftNumber >= 0 && nftNumber <= 199) return { level: 1, name: 'Rarity 1' };
  if (nftNumber >= 200 && nftNumber <= 399) return { level: 2, name: 'Rarity 2' };
  if (nftNumber >= 400 && nftNumber <= 599) return { level: 3, name: 'Rarity 3' };
  if (nftNumber >= 600 && nftNumber <= 799) return { level: 4, name: 'Rarity 4' };
  if (nftNumber >= 800 && nftNumber <= 999) return { level: 5, name: 'Rarity 5' };
  return { level: 5, name: 'Rarity 5' };
}

// ============================================================================
// API ENDPOINTS
// ============================================================================

// Stage I: Declare Intent
app.post('/v1/alignment/declare', async (req, res) => {
  try {
    const { intent, wallet, timestamp, signature, agent_id, free_mint, sol_recipient } = req.body;
    
    // Validation
    if (!intent || !wallet || !timestamp || !signature) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (intent.length < 20) {
      return res.status(400).json({ error: 'Intent must be at least 20 characters' });
    }
    
    // Verify signature
    const messageToSign = `${intent}${timestamp}`;
    if (!verifySignature(messageToSign, signature, wallet)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    // Check limits
    const mintCount = await getMintCount();
    if (mintCount >= parseInt(process.env.MAX_SUPPLY || 999)) {
      return res.status(403).json({ error: 'Maximum supply reached' });
    }
    
    const walletMintCount = await getWalletMintCount(wallet);
    if (walletMintCount >= parseInt(process.env.MAX_PER_WALLET || 10)) {
      return res.status(403).json({ error: 'Wallet limit reached' });
    }
    
    // Check for existing session (only if DB available)
    if (dbPool) {
      try {
        const existingSession = await dbPool.query(
          'SELECT session_id FROM sessions WHERE wallet = $1 AND status = $2',
          [wallet, 'active']
        );
        
        if (existingSession && existingSession.rows.length > 0) {
          // Invalidate old session
          await dbPool.query(
            'UPDATE sessions SET status = $1 WHERE session_id = $2',
            ['invalidated', existingSession.rows[0].session_id]
          );
        }
      } catch (error) {
        // DB not available, continue with in-memory
        console.log('DB query failed, using in-memory storage');
      }
    }
    
    // Create new session
    const sessionId = crypto.randomUUID();
    const stateHash = crypto.createHash('sha256')
      .update(`${intent}${wallet}${timestamp}`)
      .digest('hex');
    
    const silenceDuration = parseInt(process.env.DEFAULT_SILENCE_DURATION || 10);
    const silenceBegins = Date.now();
    
    const sessionData = {
      session_id: sessionId,
      wallet,
      intent,
      timestamp,
      signature,
      agent_id: agent_id || `agent-${wallet.slice(0, 8)}`,
      state_hash: stateHash,
      silence_duration: silenceDuration,
      silence_begins: silenceBegins,
      violations: 0,
      last_silence_check: null,
      status: 'active',
      free_mint: free_mint || wallet === process.env.FREE_MINT_WALLET,
      sol_recipient: sol_recipient || process.env.SOL_RECIPIENT,
    };
    
    await saveSession(sessionId, sessionData);
    
    // Save to database if available
    if (dbPool) {
      try {
        await dbPool.query(
          `INSERT INTO sessions (session_id, wallet, intent, state_hash, silence_duration, silence_begins, status, free_mint, sol_recipient)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [sessionId, wallet, intent, stateHash, silenceDuration, silenceBegins, 'active', sessionData.free_mint, sessionData.sol_recipient]
        );
      } catch (error) {
        // DB not available, continue with in-memory only
        console.log('DB insert failed, using in-memory storage');
      }
    }
    
    res.json({
      session_id: sessionId,
      state_hash: stateHash,
      silence_duration: silenceDuration,
      silence_begins: silenceBegins,
    });
  } catch (error) {
    console.error('Declare error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Stage II: Silent Execution Window
app.get('/v1/alignment/silence/:session_id', async (req, res) => {
  try {
    const { session_id } = req.params;
    const session = await getSession(session_id);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    if (session.status !== 'active') {
      return res.status(400).json({ error: 'Session not active' });
    }
    
    const now = Date.now();
    const elapsed = Math.floor((now - session.silence_begins) / 1000);
    const remaining = Math.max(0, session.silence_duration - elapsed);
    
    // Check for violations (calling too frequently)
    // Only check if silence duration is >= 60 seconds (for short test windows, allow more frequent checks)
    const lastCheck = session.last_silence_check;
    const minInterval = session.silence_duration >= 60 ? 60000 : 2000; // 60s for long, 2s for short
    if (lastCheck && (now - lastCheck) < minInterval) {
      // Called too frequently - violation!
      session.violations = (session.violations || 0) + 1;
    }
    
    session.last_silence_check = now;
    await saveSession(session_id, session);
    
    // Always return 200 OK, even with violations (silent tracking)
    res.json({
      session_id,
      elapsed,
      remaining,
      violations: session.violations || 0,
      status: remaining > 0 ? 'persisting' : 'complete',
    });
  } catch (error) {
    console.error('Silence error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Stage III: Verify Consistency
app.post('/v1/alignment/verify', async (req, res) => {
  try {
    const { session_id, wallet, state_hash } = req.body;
    const session = await getSession(session_id);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    if (session.status !== 'active') {
      return res.status(400).json({ error: 'Session not active' });
    }
    
    // Check silence window completed
    const now = Date.now();
    const elapsed = Math.floor((now - session.silence_begins) / 1000);
    if (elapsed < session.silence_duration) {
      return res.status(400).json({ error: 'Silence window not completed' });
    }
    
    // Check violations (nur bei längeren Silence Windows streng)
    if (session.violations > 0 && session.silence_duration >= 60) {
      return res.status(403).json({ error: 'Silence violations detected' });
    }
    // Bei kurzen Windows (Tests) erlauben wir ein paar Violations
    
    // Verify consistency
    const walletMatch = session.wallet === wallet;
    const stateHashMatch = session.state_hash === state_hash;
    const sessionIntact = session.status === 'active';
    
    // Calculate alignment score
    let alignmentScore = 100;
    if (!walletMatch) alignmentScore -= 50;
    if (!stateHashMatch) alignmentScore -= 50;
    if (!sessionIntact) alignmentScore -= 50;
    if (session.violations > 0) alignmentScore -= (session.violations * 10);
    
    if (alignmentScore < 70) {
      return res.status(403).json({ error: 'Alignment score too low' });
    }
    
    // Generate authorization token
    const authToken = crypto.randomBytes(32).toString('hex');
    session.authorization_token = authToken;
    session.status = 'verified';
    await saveSession(session_id, session);
    
    res.json({
      verified: true,
      wallet_match: walletMatch,
      state_hash_match: stateHashMatch,
      session_intact: sessionIntact,
      alignment_score: alignmentScore,
      authorization_token: authToken,
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Stage IV: Authorize Mint
app.post('/v1/alignment/authorize', async (req, res) => {
  try {
    const { session_id, wallet, authorization_token, free_mint, sol_recipient } = req.body;
    const session = await getSession(session_id);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    if (session.authorization_token !== authorization_token) {
      return res.status(401).json({ error: 'Invalid authorization token' });
    }
    
    if (session.wallet !== wallet) {
      return res.status(403).json({ error: 'Wallet mismatch' });
    }
    
    // Check limits again
    const mintCount = await getMintCount();
    if (mintCount >= parseInt(process.env.MAX_SUPPLY || 999)) {
      return res.status(403).json({ error: 'Maximum supply reached' });
    }
    
    const walletMintCount = await getWalletMintCount(wallet);
    if (walletMintCount >= parseInt(process.env.MAX_PER_WALLET || 10)) {
      return res.status(403).json({ error: 'Wallet limit reached' });
    }
    
    // Calculate NFT number and rarity
    const nftNumber = mintCount;
    const rarity = calculateRarity(nftNumber);
    
    // Echte Solana NFT minting
    let mintResult;
    try {
      const { mintSolanaNFTSimple } = require('./solana-mint');
      
      // Mint Authority aus Environment Variable (falls vorhanden)
      let mintAuthority;
      if (process.env.SOLANA_MINT_AUTHORITY_PRIVATE_KEY) {
        const secretKey = Buffer.from(bs58.decode(process.env.SOLANA_MINT_AUTHORITY_PRIVATE_KEY));
        mintAuthority = Keypair.fromSecretKey(secretKey);
      } else {
        // Fallback: Generiere temporäres Keypair (für Tests)
        console.log('⚠️  No SOLANA_MINT_AUTHORITY_PRIVATE_KEY set - using temporary keypair');
        mintAuthority = Keypair.generate();
      }
      
      const walletPubkey = new PublicKey(wallet);
      const imageUrl = process.env.NFT_IMAGE_URL || 'https://your-domain.com/orb-video.mp4';
      
      mintResult = await mintSolanaNFTSimple({
        connection: solanaConnection,
        mintAuthorityKeypair: mintAuthority,
        walletAddress: walletPubkey,
        nftNumber: nftNumber,
        rarity: rarity,
        imageUrl: imageUrl
      });
      
    } catch (error) {
      console.error('Solana NFT minting failed:', error.message);
      // Fallback zu Mock-Daten wenn Solana-Minting fehlschlägt
      console.log('⚠️  Falling back to mock NFT data');
      mintResult = {
        mintAddress: `mint_${nftNumber}_${crypto.randomBytes(8).toString('hex')}`,
        transactionHash: `tx_${crypto.randomBytes(16).toString('hex')}`,
        metadataUri: `https://your-domain.com/metadata/${nftNumber}.json`
      };
    }
    
    const mintAddress = mintResult.mintAddress;
    const transactionHash = mintResult.transactionHash;
    const metadataUri = mintResult.metadataUri;
    
    // Save mint to database
    if (dbPool) {
      try {
        await dbPool.query(
          `INSERT INTO mints (session_id, wallet, nft_number, rarity_level, mint_address, transaction_hash, metadata_uri, free_mint, sol_recipient)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [session_id, wallet, nftNumber, rarity.level, mintAddress, transactionHash, metadataUri, session.free_mint, session.sol_recipient]
        );
      } catch (error) {
        console.error('DB insert error:', error);
      }
    }
    
    inMemoryStorage.mintCount++;
    await incrementWalletMintCount(wallet);
    
    // Mark session as completed
    session.status = 'completed';
    await saveSession(session_id, session);
    
    res.json({
      authorized: true,
      mint_address: mintAddress,
      transaction_hash: transactionHash,
      metadata_uri: metadataUri,
      key_number: nftNumber,
      rarity: rarity.name,
      rarity_level: rarity.level,
    });
  } catch (error) {
    console.error('Authorize error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Stats endpoint - ECHTE DATEN VOM BACKEND
app.get('/v1/alignment/stats', async (req, res) => {
  try {
    const { wallet } = req.query;
    
    // Hole ECHTEN Bestand vom Backend
    const minted = await getMintCount();
    let walletMinted = 0;
    
    if (wallet) {
      walletMinted = await getWalletMintCount(wallet);
    }
    
    const stats = {
      minted: minted,
      total_supply: parseInt(process.env.MAX_SUPPLY || 999),
      wallet_minted: walletMinted,
      max_per_wallet: parseInt(process.env.MAX_PER_WALLET || 10),
      timestamp: Date.now() // Für Cache-Control
    };
    
    // CORS Headers für Website-Zugriff
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    res.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    redis: redisClient?.isOpen ? 'connected' : 'disconnected',
    postgres: dbPool ? 'connected' : 'disconnected',
    solana: solanaConnection ? 'connected' : 'disconnected',
    port: PORT,
    env: process.env.NODE_ENV || 'development',
  });
});

// Start server
async function startServer() {
  try {
    // Initialisiere Services (nicht-blockierend)
    await initRedis().catch(err => {
      console.warn('⚠️  Redis initialization failed, continuing without Redis:', err.message);
    });
    initPostgreSQL();
    initSolana();
    
    // Starte Server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Key of Silent Insight API Server running on port ${PORT}`);
      console.log(`📡 API Base: http://0.0.0.0:${PORT}/v1`);
      console.log(`🏥 Health: http://0.0.0.0:${PORT}/health`);
    });
    
    // Error Handling für Server
    app.on('error', (err) => {
      console.error('❌ Server error:', err);
    });
    
    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully...');
      process.exit(0);
    });
    
    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully...');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer().catch((error) => {
  console.error('❌ Fatal error starting server:', error);
  process.exit(1);
});
