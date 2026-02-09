#!/usr/bin/env node
/**
 * Database Setup Script
 * Creates all necessary tables for the Silent Insight system
 */

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'silent_insight',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function setupDatabase() {
  try {
    console.log('📊 Setting up database...');
    
    // Create sessions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        session_id VARCHAR(255) PRIMARY KEY,
        wallet VARCHAR(255) NOT NULL,
        intent TEXT NOT NULL,
        state_hash VARCHAR(255) NOT NULL,
        silence_duration INTEGER NOT NULL,
        silence_begins BIGINT NOT NULL,
        violations INTEGER DEFAULT 0,
        last_silence_check BIGINT,
        authorization_token VARCHAR(255),
        status VARCHAR(50) DEFAULT 'active',
        free_mint BOOLEAN DEFAULT FALSE,
        sol_recipient VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create index on wallet for faster lookups
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_sessions_wallet ON sessions(wallet)
    `);
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status)
    `);
    
    // Create mints table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mints (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL,
        wallet VARCHAR(255) NOT NULL,
        nft_number INTEGER NOT NULL,
        rarity_level INTEGER NOT NULL,
        mint_address VARCHAR(255) NOT NULL,
        transaction_hash VARCHAR(255) NOT NULL,
        metadata_uri TEXT,
        free_mint BOOLEAN DEFAULT FALSE,
        sol_recipient VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES sessions(session_id)
      )
    `);
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_mints_wallet ON mints(wallet)
    `);
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_mints_nft_number ON mints(nft_number)
    `);
    
    // Create wallet_mints table for tracking per-wallet limits
    await pool.query(`
      CREATE TABLE IF NOT EXISTS wallet_mints (
        wallet VARCHAR(255) PRIMARY KEY,
        count INTEGER DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Database setup complete!');
    console.log('📋 Tables created:');
    console.log('   - sessions');
    console.log('   - mints');
    console.log('   - wallet_mints');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase();
