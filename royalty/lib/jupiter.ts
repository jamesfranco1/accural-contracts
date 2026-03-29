import { Connection, PublicKey, VersionedTransaction } from "@solana/web3.js";
import { USDC_MINT } from "./solana";

// Jupiter API endpoint (mainnet only)
const JUPITER_API = "https://quote-api.jup.ag/v6";

// Native SOL mint address (wrapped SOL)
export const SOL_MINT = new PublicKey("So11111111111111111111111111111111111111112");

// Mainnet USDC mint (Jupiter only works on mainnet)
const MAINNET_USDC = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

// Check if we're on devnet
const isDevnet = () => {
  const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "";
  return rpcUrl.includes("devnet") || !rpcUrl.includes("mainnet");
};

// Fallback SOL price for devnet (no Jupiter)
const FALLBACK_SOL_PRICE = 180; // ~$180 per SOL estimate

interface JupiterQuote {
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  priceImpactPct: string;
  routePlan: any[];
}

interface SwapResult {
  swapTransaction: VersionedTransaction;
  quote: JupiterQuote;
}

/**
 * Get SOL/USDC price from Jupiter (mainnet) or fallback (devnet)
 * Returns the amount of SOL needed for a given USDC amount
 */
export async function getSolPriceForUsdc(usdcAmount: number): Promise<{
  solAmount: number;
  solAmountLamports: bigint;
  pricePerSol: number;
  quote: JupiterQuote | null;
  isEstimate: boolean;
}> {
  // On devnet, use fallback price (Jupiter only works on mainnet)
  if (isDevnet()) {
    console.log("Using fallback SOL price for devnet");
    const solNeeded = usdcAmount / FALLBACK_SOL_PRICE;
    return {
      solAmount: solNeeded,
      solAmountLamports: BigInt(Math.ceil(solNeeded * 1e9)),
      pricePerSol: FALLBACK_SOL_PRICE,
      quote: null,
      isEstimate: true,
    };
  }
  
  try {
    // Convert USDC to smallest unit (6 decimals)
    const usdcAmountSmallest = Math.floor(usdcAmount * 1_000_000);
    
    // Get quote: How much SOL do we need to get this much USDC?
    const quoteResponse = await fetch(
      `${JUPITER_API}/quote?` +
      `inputMint=${SOL_MINT.toString()}` +
      `&outputMint=${MAINNET_USDC.toString()}` +
      `&amount=${usdcAmountSmallest}` +
      `&swapMode=ExactOut` +
      `&slippageBps=100`, // 1% slippage
      { signal: AbortSignal.timeout(5000) } // 5s timeout
    );
    
    if (!quoteResponse.ok) {
      console.warn("Jupiter quote failed, using fallback price");
      const solNeeded = usdcAmount / FALLBACK_SOL_PRICE;
      return {
        solAmount: solNeeded,
        solAmountLamports: BigInt(Math.ceil(solNeeded * 1e9)),
        pricePerSol: FALLBACK_SOL_PRICE,
        quote: null,
        isEstimate: true,
      };
    }
    
    const quote: JupiterQuote = await quoteResponse.json();
    
    // inAmount is the SOL needed (in lamports)
    const solAmountLamports = BigInt(quote.inAmount);
    const solAmount = Number(solAmountLamports) / 1e9;
    const pricePerSol = usdcAmount / solAmount;
    
    return {
      solAmount,
      solAmountLamports,
      pricePerSol,
      quote,
      isEstimate: false,
    };
  } catch (error) {
    console.error("Failed to get SOL price:", error);
    const solNeeded = usdcAmount / FALLBACK_SOL_PRICE;
    return {
      solAmount: solNeeded,
      solAmountLamports: BigInt(Math.ceil(solNeeded * 1e9)),
      pricePerSol: FALLBACK_SOL_PRICE,
      quote: null,
      isEstimate: true,
    };
  }
}

/**
 * Get current SOL price in USD
 */
export async function getCurrentSolPrice(): Promise<number> {
  // On devnet, return fallback price
  if (isDevnet()) {
    return FALLBACK_SOL_PRICE;
  }
  
  try {
    // Get quote for 1 SOL -> USDC
    const quoteResponse = await fetch(
      `${JUPITER_API}/quote?` +
      `inputMint=${SOL_MINT.toString()}` +
      `&outputMint=${MAINNET_USDC.toString()}` +
      `&amount=1000000000` + // 1 SOL in lamports
      `&swapMode=ExactIn` +
      `&slippageBps=100`,
      { signal: AbortSignal.timeout(5000) }
    );
    
    if (!quoteResponse.ok) {
      return FALLBACK_SOL_PRICE;
    }
    
    const quote = await quoteResponse.json();
    // outAmount is USDC received (in 6 decimals)
    const usdcReceived = Number(quote.outAmount) / 1_000_000;
    return usdcReceived;
  } catch (error) {
    console.error("Failed to get SOL price:", error);
    return FALLBACK_SOL_PRICE;
  }
}

/**
 * Check if Jupiter swap is available (mainnet only)
 */
export function isJupiterAvailable(): boolean {
  return !isDevnet();
}

/**
 * Create a swap transaction from SOL to USDC (mainnet only)
 * Returns null on devnet since Jupiter doesn't support devnet
 */
export async function createSwapTransaction(
  connection: Connection,
  userPublicKey: PublicKey,
  usdcAmountNeeded: number, // in USDC (e.g., 100 for $100)
  slippageBps: number = 100 // 1% default slippage
): Promise<SwapResult | null> {
  // Jupiter only works on mainnet
  if (isDevnet()) {
    console.warn("Jupiter swap not available on devnet");
    return null;
  }
  
  try {
    // Convert USDC to smallest unit
    const usdcAmountSmallest = Math.floor(usdcAmountNeeded * 1_000_000);
    
    // Step 1: Get quote
    const quoteResponse = await fetch(
      `${JUPITER_API}/quote?` +
      `inputMint=${SOL_MINT.toString()}` +
      `&outputMint=${MAINNET_USDC.toString()}` +
      `&amount=${usdcAmountSmallest}` +
      `&swapMode=ExactOut` +
      `&slippageBps=${slippageBps}`,
      { signal: AbortSignal.timeout(10000) }
    );
    
    if (!quoteResponse.ok) {
      console.error("Failed to get Jupiter quote");
      return null;
    }
    
    const quote: JupiterQuote = await quoteResponse.json();
    
    // Step 2: Get swap transaction
    const swapResponse = await fetch(`${JUPITER_API}/swap`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quoteResponse: quote,
        userPublicKey: userPublicKey.toString(),
        wrapAndUnwrapSol: true,
        dynamicComputeUnitLimit: true,
        prioritizationFeeLamports: "auto",
      }),
      signal: AbortSignal.timeout(10000),
    });
    
    if (!swapResponse.ok) {
      console.error("Failed to get Jupiter swap transaction");
      return null;
    }
    
    const swapData = await swapResponse.json();
    
    // Deserialize the transaction
    const swapTransactionBuf = Buffer.from(swapData.swapTransaction, "base64");
    const swapTransaction = VersionedTransaction.deserialize(swapTransactionBuf);
    
    return {
      swapTransaction,
      quote,
    };
  } catch (error) {
    console.error("Failed to create swap transaction:", error);
    return null;
  }
}

/**
 * Format SOL amount for display
 */
export function formatSol(lamports: bigint | number): string {
  const sol = typeof lamports === "bigint" 
    ? Number(lamports) / 1e9 
    : lamports / 1e9;
  return sol.toFixed(4);
}

/**
 * Check if user has enough SOL for swap + fees
 */
export async function checkSolBalance(
  connection: Connection,
  userPublicKey: PublicKey,
  requiredLamports: bigint
): Promise<{
  hasEnough: boolean;
  balance: bigint;
  required: bigint;
}> {
  const balance = await connection.getBalance(userPublicKey);
  const balanceBigInt = BigInt(balance);
  // Add buffer for transaction fees (0.01 SOL)
  const requiredWithBuffer = requiredLamports + BigInt(10_000_000);
  
  return {
    hasEnough: balanceBigInt >= requiredWithBuffer,
    balance: balanceBigInt,
    required: requiredWithBuffer,
  };
}

