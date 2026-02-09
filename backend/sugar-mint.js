/**
 * Mintet NFTs über Metaplex Sugar Collection
 * 
 * Features:
 * - Free Mint für Wallet: 54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7
 * - 0.025 SOL für alle anderen Wallets
 * - SOL geht an: 54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7
 * - NFT Bild: orb-video.mp4 (Video Loop)
 */

require('dotenv').config();
const { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram } = require('@solana/web3.js');
const { createUmi } = require('@metaplex-foundation/umi-bundle-defaults');
const { keypairIdentity, publicKey } = require('@metaplex-foundation/umi');
const { mintV1 } = require('@metaplex-foundation/mpl-token-metadata');
const bs58 = require('bs58');

const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
const MINT_AUTHORITY_PRIVATE_KEY = process.env.SOLANA_MINT_AUTHORITY_PRIVATE_KEY;
const COLLECTION_MINT = process.env.COLLECTION_MINT;
const FREE_MINT_WALLET = '54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7';
const SOL_RECIPIENT = '54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7';
const MINT_PRICE = 0.025 * LAMPORTS_PER_SOL; // 0.025 SOL

if (!MINT_AUTHORITY_PRIVATE_KEY) {
  throw new Error('SOLANA_MINT_AUTHORITY_PRIVATE_KEY nicht in .env gefunden!');
}

if (!COLLECTION_MINT) {
  throw new Error('COLLECTION_MINT nicht in .env gefunden! Bitte zuerst Collection erstellen.');
}

/**
 * Mintet ein NFT zur Collection
 */
async function mintNFT({
  walletAddress, // PublicKey des Empfängers
  nftNumber,
  rarity
}) {
  try {
    const connection = new Connection(SOLANA_RPC_URL, 'confirmed');
    const mintAuthorityKeypair = Keypair.fromSecretKey(bs58.decode(MINT_AUTHORITY_PRIVATE_KEY));
    const walletPubkey = new PublicKey(walletAddress);
    const isFreeMint = walletPubkey.toString() === FREE_MINT_WALLET;
    
    console.log(`🪙 Minting NFT #${nftNumber} to ${walletPubkey.toString()}...`);
    console.log(`   Free Mint: ${isFreeMint ? '✅ YES' : '❌ NO'}`);
    
    // Prüfe Balance für bezahlte Mints
    if (!isFreeMint) {
      const balance = await connection.getBalance(walletPubkey);
      if (balance < MINT_PRICE + 5000) { // + 5000 für Fees
        throw new Error(`Insufficient balance: ${balance / LAMPORTS_PER_SOL} SOL. Need at least ${(MINT_PRICE + 5000) / LAMPORTS_PER_SOL} SOL`);
      }
    }
    
    // Erstelle UMI Instance
    const umi = createUmi(SOLANA_RPC_URL);
    umi.use(keypairIdentity(mintAuthorityKeypair));
    
    // Erstelle NFT Mint
    const { generateSigner } = require('@metaplex-foundation/umi');
    const nftMint = generateSigner(umi);
    
    const name = `THE KEY OF SILENT INSIGHT #${nftNumber}`;
    const symbol = 'KEY';
    const uri = `https://your-domain.com/metadata/${nftNumber}.json`;
    
    // Mint NFT zur Collection
    const mintTx = await mintV1(umi, {
      mint: nftMint.publicKey,
      authority: umi.identity,
      tokenOwner: publicKey(walletPubkey.toString()),
      tokenStandard: 0, // NonFungible
      collection: publicKey(COLLECTION_MINT),
      collectionAuthority: umi.identity,
      name: name,
      symbol: symbol,
      uri: uri,
      sellerFeeBasisPoints: 0,
      creators: [
        {
          address: publicKey(SOL_RECIPIENT),
          verified: true,
          share: 100,
        },
      ],
    }).sendAndConfirm(umi);
    
    // Wenn nicht kostenlos, sende SOL an Empfänger
    if (!isFreeMint) {
      const solRecipientPubkey = new PublicKey(SOL_RECIPIENT);
      const transferTx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: walletPubkey,
          toPubkey: solRecipientPubkey,
          lamports: MINT_PRICE,
        })
      );
      
      // Note: Der Wallet-Besitzer muss diese Transaction signieren
      // Dies sollte im Frontend passieren, bevor mintV1 aufgerufen wird
      console.log(`⚠️  SOL Transfer muss separat durchgeführt werden: ${MINT_PRICE / LAMPORTS_PER_SOL} SOL`);
    }
    
    console.log(`✅ NFT erfolgreich gemintet!`);
    console.log(`   Mint Address: ${nftMint.publicKey.toString()}`);
    console.log(`   Collection: ${COLLECTION_MINT}`);
    
    return {
      mintAddress: nftMint.publicKey.toString(),
      collectionMint: COLLECTION_MINT,
      transactionHash: mintTx.signature,
      isFreeMint: isFreeMint,
      solRequired: isFreeMint ? 0 : MINT_PRICE / LAMPORTS_PER_SOL,
    };
    
  } catch (error) {
    console.error('❌ NFT Minting Error:', error.message);
    if (error.logs) {
      console.error('Transaction Logs:', error.logs);
    }
    throw error;
  }
}

module.exports = {
  mintNFT,
  FREE_MINT_WALLET,
  SOL_RECIPIENT,
  MINT_PRICE: MINT_PRICE / LAMPORTS_PER_SOL,
};
