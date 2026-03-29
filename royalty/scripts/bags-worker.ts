import dotenv from 'dotenv';
dotenv.config();

import { Connection, PublicKey, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import bs58 from 'bs58';

const CONFIG = {
    memecoinMint: process.env.MEMECOIN_MINT || '',
    rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
    bagsApiKey: process.env.BAGS_API_KEY || '',
    privateKey: process.env.PRIVATE_KEY || '',
    buybackPercent: 0.75,
};

function validateConfig(): boolean {
    const missing: string[] = [];
    if (!CONFIG.bagsApiKey) missing.push('BAGS_API_KEY');
    if (!CONFIG.privateKey) missing.push('PRIVATE_KEY');
    if (!CONFIG.memecoinMint) missing.push('MEMECOIN_MINT');
    
    if (missing.length > 0) {
        console.error('Missing required environment variables:', missing.join(', '));
        return false;
    }
    return true;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let connection: Connection;
let keypair: Keypair;

function initializeConnection() {
    connection = new Connection(CONFIG.rpcUrl, { commitment: 'confirmed' });
    keypair = Keypair.fromSecretKey(bs58.decode(CONFIG.privateKey));
}

async function getBalance(): Promise<number> {
    try {
        const balance = await connection.getBalance(keypair.publicKey);
        return balance / LAMPORTS_PER_SOL;
    } catch {
        return 0;
    }
}

async function claimFees(sdk: any): Promise<number> {
    let totalClaimedLamports = 0;
    
    try {
        const allPositions = await sdk.fee.getAllClaimablePositions(keypair.publicKey);
        const targetPositions = allPositions.filter(
            (pos: any) => pos.baseMint === CONFIG.memecoinMint
        );
        
        if (targetPositions.length === 0) {
            return 0;
        }
        
        const sdkConnection = sdk.state.getConnection();
        const commitment = sdk.state.getCommitment();
        
        for (const position of targetPositions) {
            let claimable = 0;
            if (position.totalClaimableLamportsUserShare) {
                claimable = Number(position.totalClaimableLamportsUserShare);
            } else if (position.virtualPoolClaimableLamportsUserShare) {
                claimable = Number(position.virtualPoolClaimableLamportsUserShare);
            } else if (position.virtualPoolClaimableAmount) {
                claimable = Number(position.virtualPoolClaimableAmount);
            }
            
            if (claimable < 10000) continue;
            
            try {
                const claimTransactions = await sdk.fee.getClaimTransaction(
                    keypair.publicKey, 
                    position
                );
                
                if (claimTransactions && claimTransactions.length > 0) {
                    for (const tx of claimTransactions) {
                        if (!tx.feePayer) tx.feePayer = keypair.publicKey;
                        if (!tx.recentBlockhash) {
                            const { blockhash } = await sdkConnection.getLatestBlockhash();
                            tx.recentBlockhash = blockhash;
                        }
                        tx.signatures = [];
                        tx.sign(keypair);
                        
                        const sig = await sdkConnection.sendRawTransaction(tx.serialize(), {
                            skipPreflight: false,
                            preflightCommitment: commitment
                        });
                        await sdkConnection.confirmTransaction(sig, commitment);
                        
                        console.log(`[CLAIM] ${(claimable / LAMPORTS_PER_SOL).toFixed(6)} SOL - TX: ${sig.slice(0, 20)}...`);
                        totalClaimedLamports += claimable;
                    }
                }
            } catch (err: any) {
                console.log(`[CLAIM] Failed: ${err.message}`);
            }
            
            await sleep(500);
        }
    } catch (err: any) {
        console.log(`[CLAIM] Error: ${err.message}`);
    }
    
    return totalClaimedLamports;
}

async function buybackTokens(sdk: any, amountLamports: number): Promise<string | null> {
    if (amountLamports < 10000) {
        return null;
    }
    
    const SOL_MINT = new PublicKey('So11111111111111111111111111111111111111112');
    const TOKEN_MINT = new PublicKey(CONFIG.memecoinMint);
    
    try {
        const quote = await sdk.trade.getQuote({
            inputMint: SOL_MINT,
            outputMint: TOKEN_MINT,
            amount: amountLamports,
            slippageMode: 'manual',
            slippageBps: 10000
        });
        
        const swapResult = await sdk.trade.createSwapTransaction({
            quoteResponse: quote,
            userPublicKey: keypair.publicKey
        });
        
        const { signAndSendTransaction } = await import('@bagsfm/bags-sdk');
        const sdkConnection = sdk.state.getConnection();
        const commitment = sdk.state.getCommitment();
        
        const signature = await signAndSendTransaction(
            sdkConnection,
            commitment,
            swapResult.transaction,
            keypair
        );
        
        console.log(`[BUY] ${(amountLamports / LAMPORTS_PER_SOL).toFixed(6)} SOL - TX: ${signature}`);
        return signature;
        
    } catch (err: any) {
        console.log(`[BUY] Failed: ${err.message}`);
        return null;
    }
}

let isRunning = false;

async function runCycle() {
    if (isRunning) return;
    
    isRunning = true;
    
    try {
        const { BagsSDK } = await import('@bagsfm/bags-sdk');
        const sdk = new BagsSDK(CONFIG.bagsApiKey, connection, 'confirmed');
        
        const claimedLamports = await claimFees(sdk);
        
        if (claimedLamports === 0) {
            isRunning = false;
            return;
        }
        
        console.log(`[TOTAL] Claimed: ${(claimedLamports / LAMPORTS_PER_SOL).toFixed(6)} SOL`);
        
        const buybackAmount = Math.floor(claimedLamports * CONFIG.buybackPercent);
        
        console.log(`[WAIT] Buying in 10 seconds...`);
        await sleep(10000);
        await buybackTokens(sdk, buybackAmount);
        
    } catch (error: any) {
        console.log(`[ERROR] ${error.message}`);
    } finally {
        isRunning = false;
    }
}

async function main() {
    if (!validateConfig()) {
        process.exit(1);
    }
    
    initializeConnection();
    
    console.log(`Wallet: ${keypair.publicKey.toString()}`);
    console.log(`Token: ${CONFIG.memecoinMint}`);
    
    const balance = await getBalance();
    console.log(`Balance: ${balance.toFixed(4)} SOL`);
    
    await runCycle();
    setInterval(runCycle, 30 * 1000);
}

process.on('SIGINT', () => process.exit(0));
process.on('uncaughtException', (err) => console.error(err.message));
process.on('unhandledRejection', (err: any) => console.error(err?.message || err));

main();
