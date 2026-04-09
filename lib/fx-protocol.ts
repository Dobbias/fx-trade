/**
 * f(x) Protocol Contract Interaction Functions
 *
 * This module provides functions to interact with the f(x) Protocol smart contracts
 * using Viem for Web3 interactions.
 */

import { type Address, type PublicClient, type WalletClient } from "viem";
import {
  ERC20_ABI,
  ORACLE_ABI,
  LEVERAGE_POOL_ABI,
  POSITION_MANAGER_ABI,
  REBALANCER_ABI,
} from "./abi/fx-usd";
import {
  FX_CONTRACTS,
  ASSETS,
  LEVERAGE_SETTINGS,
  DEFAULT_SLIPPAGE_BP,
} from "./constants";

// =============================================================================
// Types
// =============================================================================

export type AssetKey = keyof typeof ASSETS;
export type PositionType = "long" | "short";

export class NetworkError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = "NetworkError";
  }
}

export class ContractError extends Error {
  constructor(message: string, public readonly data?: unknown) {
    super(message);
    this.name = "ContractError";
  }
}

/**
 * Wraps async operations with network error handling
 */
async function withNetworkErrorHandling<T>(
  operation: () => Promise<T>,
  context: string
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof Error) {
      // Check for RPC/network errors
      if (
        error.message.includes("network") ||
        error.message.includes("RPC") ||
        error.message.includes("timeout") ||
        error.message.includes("ECONNREFUSED") ||
        error.message.includes("fetch failed")
      ) {
        throw new NetworkError(
          `Network error while ${context}. Please check your connection.`,
          error
        );
      }
      // Check for user rejection
      if (error.message.includes("User rejected") || error.message.includes("user rejected")) {
        throw new Error("Transaction was rejected by user.");
      }
    }
    throw error;
  }
}

export interface PriceData {
  price: bigint;
  priceInUSD: number;
  lastUpdate: bigint;
  timestamp: number;
}

export interface UserPosition {
  id: string;
  type: PositionType;
  asset: AssetKey;
  collateralAmount: bigint;
  fxUSDAmount: bigint;
  leverage: number;
  valueUSD: number;
  pnlUSD: number;
  pnlPercent: number;
  liquidationPrice: number;
}

export interface PositionParams {
  asset: AssetKey;
  amount: bigint;
  slippageBp?: number; // Slippage in basis points (50 = 0.5%)
}

export interface TradeSimulationResult {
  success: boolean;
  estimatedFxUSD?: bigint;
  estimatedLeverage?: number;
  liquidationPrice?: number;
  gasEstimate?: bigint;
  error?: string;
}

// =============================================================================
// Price Oracle Functions
// =============================================================================

/**
 * Fetches the current price from an f(x) Protocol oracle
 */
export async function getOraclePrice(
  publicClient: PublicClient,
  oracleAddress: Address
): Promise<PriceData> {
  return withNetworkErrorHandling(async () => {
    const [price, lastUpdate] = await publicClient.multicall({
      contracts: [
        {
          address: oracleAddress,
          abi: ORACLE_ABI,
          functionName: "getPrice",
        },
        {
          address: oracleAddress,
          abi: ORACLE_ABI,
          functionName: "lastUpdateTime",
        },
      ],
      allowFailure: false,
    });

    // f(x) oracles return prices with 18 decimals
    const priceInUSD = Number(price) / 1e18;

    return {
      price,
      priceInUSD,
      lastUpdate,
      timestamp: Date.now(),
    };
  }, "fetching oracle price");
}

/**
 * Fetches prices for all supported assets
 */
export async function getAllAssetPrices(
  publicClient: PublicClient
): Promise<Record<AssetKey, PriceData>> {
  const prices = {} as Record<AssetKey, PriceData>;

  for (const [key, asset] of Object.entries(ASSETS)) {
    try {
      prices[key as AssetKey] = await getOraclePrice(publicClient, asset.oracle);
    } catch (error) {
      console.error(`Failed to fetch price for ${key}:`, error);
      // Fallback to a default price if oracle fails
      prices[key as AssetKey] = {
        price: 0n,
        priceInUSD: 0,
        lastUpdate: 0n,
        timestamp: Date.now(),
      };
    }
  }

  return prices;
}

// =============================================================================
// ERC20 Token Functions
// =============================================================================

/**
 * Gets the token balance of an address
 */
export async function getTokenBalance(
  publicClient: PublicClient,
  tokenAddress: Address,
  address: Address
): Promise<bigint> {
  const balance = await publicClient.readContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [address],
  });

  return balance;
}

/**
 * Gets the allowance for a spender
 */
export async function getTokenAllowance(
  publicClient: PublicClient,
  tokenAddress: Address,
  owner: Address,
  spender: Address
): Promise<bigint> {
  const allowance = await publicClient.readContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: [owner, spender],
  });

  return allowance;
}

/**
 * Approves a token for spending by a contract
 */
export async function approveToken(
  walletClient: WalletClient,
  tokenAddress: Address,
  spender: Address,
  amount: bigint
): Promise<Address> {
  const hash = await (walletClient as any).writeContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "approve",
    args: [spender, amount],
  });

  return hash;
}

/**
 * Revokes token approval
 */
export async function revokeApproval(
  walletClient: WalletClient,
  tokenAddress: Address,
  spender: Address
): Promise<Address> {
  return approveToken(walletClient, tokenAddress, spender, 0n);
}

// =============================================================================
// Position Simulation Functions
// =============================================================================

/**
 * Simulates opening a long position (xPOSITION)
 */
export async function simulateOpenLongPosition(
  publicClient: PublicClient,
  userAddress: Address,
  params: PositionParams
): Promise<TradeSimulationResult> {
  try {
    const asset = ASSETS[params.asset];
    const poolAddress = asset.pair.xTOKEN;

    // Calculate minimum output with slippage
    const slippageBp = params.slippageBp ?? DEFAULT_SLIPPAGE_BP;
    const slippageMultiplier = BigInt(10000 - slippageBp);
    const minFxUSD = (params.amount * slippageMultiplier) / 10000n;

    // Simulate the deposit transaction
    const { request } = await publicClient.simulateContract({
      address: poolAddress,
      abi: LEVERAGE_POOL_ABI,
      functionName: "deposit",
      args: [params.amount, minFxUSD],
      account: userAddress,
    });

    // Estimate the leverage
    // This is a simplified calculation - actual leverage depends on pool state
    const estimatedLeverage = Math.min(
      LEVERAGE_SETTINGS.MAX_LEVERAGE,
      1.0 + (1.0 / LEVERAGE_SETTINGS.MIN_COLLATERAL_RATIO - 1.0) * 0.8
    );

    const gasEstimate = await publicClient.estimateContractGas({
      address: poolAddress,
      abi: LEVERAGE_POOL_ABI,
      functionName: "deposit",
      args: [params.amount, minFxUSD],
      account: userAddress,
    });

    return {
      success: true,
      estimatedFxUSD: params.amount * BigInt(Math.floor(estimatedLeverage * 10)) / 10n,
      estimatedLeverage: estimatedLeverage,
      liquidationPrice: 0, // Will be calculated based on entry price
      gasEstimate,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Simulation failed",
    };
  }
}

/**
 * Simulates opening a short position (sPOSITION)
 */
export async function simulateOpenShortPosition(
  publicClient: PublicClient,
  userAddress: Address,
  params: PositionParams
): Promise<TradeSimulationResult> {
  try {
    // For short positions, we need fxUSD as collateral
    const slippageBp = params.slippageBp ?? DEFAULT_SLIPPAGE_BP;
    const slippageMultiplier = BigInt(10000 - slippageBp);
    const minCollateral = (params.amount * slippageMultiplier) / 10000n;

    // Short position logic would be implemented here
    // This is a placeholder as sPOSITION requires fxUSD collateral
    return {
      success: true,
      estimatedLeverage: LEVERAGE_SETTINGS.MAX_LEVERAGE,
      gasEstimate: 200000n, // Estimated gas for short position
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Simulation failed",
    };
  }
}

// =============================================================================
// Position Execution Functions
// =============================================================================

/**
 * Opens a long position (xPOSITION) in the f(x) Protocol
 */
export async function openLongPosition(
  walletClient: WalletClient,
  publicClient: PublicClient,
  userAddress: Address,
  params: PositionParams
): Promise<Address> {
  const asset = ASSETS[params.asset];
  const poolAddress = asset.pair.xTOKEN;
  const tokenAddress = asset.address;

  // Step 1: Check and approve token if needed
  const currentAllowance = await getTokenAllowance(
    publicClient,
    tokenAddress,
    userAddress,
    poolAddress
  );

  if (currentAllowance < params.amount) {
    const approvalHash = await approveToken(
      walletClient,
      tokenAddress,
      poolAddress,
      params.amount
    );
    // Wait for transaction confirmation instead of hardcoded delay
    await waitForTransaction(publicClient, approvalHash);
  }

  // Step 2: Calculate minimum output with slippage
  const slippageBp = params.slippageBp ?? DEFAULT_SLIPPAGE_BP;
  const slippageMultiplier = BigInt(10000 - slippageBp);
  const minFxUSD = (params.amount * slippageMultiplier) / 10000n;

  // Step 3: Execute the deposit (open position)
  const hash = await (walletClient as any).writeContract({
    address: poolAddress,
    abi: LEVERAGE_POOL_ABI,
    functionName: "deposit",
    args: [params.amount, minFxUSD],
  });

  return hash;
}

/**
 * Opens a short position (sPOSITION) in the f(x) Protocol
 *
 * Short positions require fxUSD as collateral. The position manager
 * handles the flashloan and collateral management.
 */
export async function openShortPosition(
  walletClient: WalletClient,
  publicClient: PublicClient,
  userAddress: Address,
  params: PositionParams
): Promise<Address> {
  const fxUSDAddress = FX_CONTRACTS.FXUSD;
  const positionManagerAddress = FX_CONTRACTS.POSITION_MANAGER ?? FX_CONTRACTS.REBALANCER;

  // Step 1: Check if protocol is paused (security check)
  try {
    const rebalancerAddress = FX_CONTRACTS.REBALANCER;
    // Note: Rebalancer doesn't have a pause check in the current ABI
    // This would be added based on actual contract capabilities
  } catch (error) {
    console.warn("Could not check protocol status:", error);
  }

  // Step 2: Check and approve fxUSD for Position Manager
  const currentAllowance = await getTokenAllowance(
    publicClient,
    fxUSDAddress,
    userAddress,
    positionManagerAddress
  );

  if (currentAllowance < params.amount) {
    const approvalHash = await approveToken(
      walletClient,
      fxUSDAddress,
      positionManagerAddress,
      params.amount
    );
    // Wait for transaction confirmation instead of hardcoded delay
    await waitForTransaction(publicClient, approvalHash);
  }

  // Step 3: Calculate minimum collateral with slippage
  const slippageBp = params.slippageBp ?? DEFAULT_SLIPPAGE_BP;
  const slippageMultiplier = BigInt(10000 - slippageBp);
  const minCollateral = (params.amount * slippageMultiplier) / 10000n;

  // Step 4: Execute short position opening via Position Manager
  const hash = await (walletClient as any).writeContract({
    address: positionManagerAddress,
    abi: POSITION_MANAGER_ABI,
    functionName: "openSPosition",
    args: [params.amount, minCollateral],
  });

  return hash;
}

/**
 * Closes a position in the f(x) Protocol
 */
export async function closePosition(
  walletClient: WalletClient,
  positionId: string,
  asset: AssetKey
): Promise<Address> {
  const assetInfo = ASSETS[asset];
  const poolAddress = assetInfo.pair.xTOKEN;

  // Execute withdrawal to close position
  const hash = await (walletClient as any).writeContract({
    address: poolAddress,
    abi: LEVERAGE_POOL_ABI,
    functionName: "withdraw",
    args: [2n**256n - 1n, 0n], // Withdraw all, accept any amount
  });

  return hash;
}

// =============================================================================
// User Data Functions
// =============================================================================

/**
 * Fetches all user positions from the f(x) Protocol
 */
export async function getUserPositions(
  publicClient: PublicClient,
  userAddress: Address
): Promise<UserPosition[]> {
  const positions: UserPosition[] = [];

  // Check each asset pair for user positions
  for (const [key, asset] of Object.entries(ASSETS)) {
    try {
      const userState = await publicClient.readContract({
        address: asset.pair.xTOKEN,
        abi: LEVERAGE_POOL_ABI,
        functionName: "userStates",
        args: [userAddress],
      });

      const [collateralAmount, fxUSDAmount] = userState as [bigint, bigint, bigint];

      // Only include positions with non-zero collateral
      if (collateralAmount > 0n) {
        const priceData = await getOraclePrice(publicClient, asset.oracle);
        const collateralValueUSD =
          Number(collateralAmount) * priceData.priceInUSD;
        const leverage = fxUSDAmount > 0n
          ? Number(fxUSDAmount) / Number(collateralAmount)
          : 1;

        positions.push({
          id: `${userAddress}-${key}`,
          type: "long",
          asset: key as AssetKey,
          collateralAmount,
          fxUSDAmount,
          leverage,
          valueUSD: collateralValueUSD * leverage,
          pnlUSD: 0, // PnL calculation requires historical data
          pnlPercent: 0,
          liquidationPrice: priceData.priceInUSD * LEVERAGE_SETTINGS.MIN_COLLATERAL_RATIO,
        });
      }
    } catch (error) {
      console.error(`Failed to fetch position for ${key}:`, error);
    }
  }

  return positions;
}

/**
 * Fetches the user's token balances for all supported assets
 */
export async function getUserBalances(
  publicClient: PublicClient,
  userAddress: Address
): Promise<Record<AssetKey, bigint>> {
  const balances = {} as Record<AssetKey, bigint>;

  for (const [key, asset] of Object.entries(ASSETS)) {
    try {
      const balance = await getTokenBalance(
        publicClient,
        asset.address,
        userAddress
      );
      balances[key as AssetKey] = balance;
    } catch (error) {
      console.error(`Failed to fetch balance for ${key}:`, error);
      balances[key as AssetKey] = 0n;
    }
  }

  return balances;
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Formats a token amount for display
 */
export function formatTokenAmount(
  amount: bigint,
  decimals: number,
  maxDecimals = 4
): string {
  const divisor = BigInt(10 ** decimals);
  const whole = amount / divisor;
  const fraction = amount % divisor;

  if (fraction === 0n) {
    return whole.toString();
  }

  const fractionStr = fraction.toString().padStart(decimals, "0");
  // Find first non-zero position
  const firstNonZero = fractionStr.search(/[^0]/);

  if (firstNonZero === -1) {
    return whole.toString(); // All zeros
  }

  // Calculate how many decimals we can show
  // We want to show up to maxDecimals significant digits
  let endPos = Math.min(firstNonZero + maxDecimals, fractionStr.length);

  let trimmedFraction = fractionStr.slice(0, endPos);
  // Trim trailing zeros
  trimmedFraction = trimmedFraction.replace(/0+$/, "");

  // If all zeros were trimmed, return whole number only
  if (trimmedFraction === "") {
    return whole.toString();
  }

  return `${whole}.${trimmedFraction}`;
}

/**
 * Formats a USD value for display
 */
export function formatUSD(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Calculates the liquidation price for a position
 */
export function calculateLiquidationPrice(
  entryPrice: number,
  leverage: number,
  isLong: boolean
): number {
  const liquidationRatio = LEVERAGE_SETTINGS.MIN_COLLATERAL_RATIO;
  if (isLong) {
    return entryPrice * liquidationRatio / leverage;
  } else {
    return entryPrice * (2 - liquidationRatio / leverage);
  }
}

/**
 * Waits for a transaction to be confirmed
 */
export async function waitForTransaction(
  publicClient: PublicClient,
  hash: Address
): Promise<void> {
  await publicClient.waitForTransactionReceipt({
    hash: hash as `0x${string}`,
  });
}
