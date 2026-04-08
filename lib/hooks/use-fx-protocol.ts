/**
 * React Hooks for f(x) Protocol Interactions
 *
 * Custom hooks that integrate f(x) Protocol contract functions with React state.
 */

import { useEffect, useState, useCallback } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import {
  type PriceData,
  type UserPosition,
  type PositionType,
  type AssetKey,
  getOraclePrice,
  getAllAssetPrices,
  getUserPositions,
  getUserBalances,
  openLongPosition,
  openShortPosition,
  closePosition,
  simulateOpenLongPosition,
  simulateOpenShortPosition,
  formatTokenAmount,
  formatUSD,
  calculateLiquidationPrice,
  waitForTransaction,
} from "../fx-protocol";
import { ASSETS, LEVERAGE_SETTINGS } from "../constants";

// =============================================================================
// Price Hook
// =============================================================================

export interface UsePriceResult {
  prices: Record<AssetKey, PriceData>;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  getPrice: (asset: AssetKey) => PriceData | null;
}

export function usePrices(): UsePriceResult {
  const [prices, setPrices] = useState<Record<AssetKey, PriceData>>(
    {} as Record<AssetKey, PriceData>
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const publicClient = usePublicClient();

  const fetchPrices = useCallback(async () => {
    if (!publicClient) return;

    setIsLoading(true);
    setError(null);

    try {
      const fetchedPrices = await getAllAssetPrices(publicClient);
      setPrices(fetchedPrices);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch prices"));
    } finally {
      setIsLoading(false);
    }
  }, [publicClient]);

  useEffect(() => {
    fetchPrices();

    // Refresh prices every 30 seconds
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  const getPrice = useCallback(
    (asset: AssetKey): PriceData | null => {
      return prices[asset] || null;
    },
    [prices]
  );

  return {
    prices,
    isLoading,
    error,
    refetch: fetchPrices,
    getPrice,
  };
}

// =============================================================================
// User Balances Hook
// =============================================================================

export interface UseBalancesResult {
  balances: Record<AssetKey, bigint>;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  getBalance: (asset: AssetKey) => bigint;
  getBalanceFormatted: (asset: AssetKey) => string;
  getBalanceUSD: (asset: AssetKey, price: number) => number;
}

export function useBalances(): UseBalancesResult {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [balances, setBalances] = useState<Record<AssetKey, bigint>>(
    {} as Record<AssetKey, bigint>
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchBalances = useCallback(async () => {
    if (!address || !publicClient) return;

    setIsLoading(true);
    setError(null);

    try {
      const fetchedBalances = await getUserBalances(publicClient, address);
      setBalances(fetchedBalances);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch balances"));
    } finally {
      setIsLoading(false);
    }
  }, [address, publicClient]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  const getBalance = useCallback(
    (asset: AssetKey): bigint => {
      return balances[asset] || 0n;
    },
    [balances]
  );

  const getBalanceFormatted = useCallback(
    (asset: AssetKey): string => {
      const balance = getBalance(asset);
      const decimals = ASSETS[asset].decimals;
      return formatTokenAmount(balance, decimals);
    },
    [getBalance]
  );

  const getBalanceUSD = useCallback(
    (asset: AssetKey, price: number): number => {
      const balance = getBalance(asset);
      const decimals = ASSETS[asset].decimals;
      const divisor = BigInt(10 ** decimals);
      const value = Number(balance / divisor);
      return value * price;
    },
    [getBalance]
  );

  return {
    balances,
    isLoading,
    error,
    refetch: fetchBalances,
    getBalance,
    getBalanceFormatted,
    getBalanceUSD,
  };
}

// =============================================================================
// User Positions Hook
// =============================================================================

export interface UsePositionsResult {
  positions: UserPosition[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  totalValue: number;
  totalPnL: number;
}

export function usePositions(): UsePositionsResult {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [positions, setPositions] = useState<UserPosition[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPositions = useCallback(async () => {
    if (!address || !publicClient) return;

    setIsLoading(true);
    setError(null);

    try {
      const fetchedPositions = await getUserPositions(publicClient, address);
      setPositions(fetchedPositions);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch positions"));
    } finally {
      setIsLoading(false);
    }
  }, [address, publicClient]);

  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  const totalValue = positions.reduce((sum, pos) => sum + pos.valueUSD, 0);
  const totalPnL = positions.reduce((sum, pos) => sum + pos.pnlUSD, 0);

  return {
    positions,
    isLoading,
    error,
    refetch: fetchPositions,
    totalValue,
    totalPnL,
  };
}

// =============================================================================
// Trading Hook
// =============================================================================

export interface TradeParams {
  asset: AssetKey;
  amount: string;
  positionType: PositionType;
  slippageBp?: number;
}

export interface UseTradeResult {
  executeTrade: (params: TradeParams) => Promise<string>;
  simulateTrade: (params: TradeParams) => Promise<any>;
  isExecuting: boolean;
  isSimulating: boolean;
  error: Error | null;
  reset: () => void;
}

export function useTrade(): UseTradeResult {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const executeTrade = useCallback(
    async (params: TradeParams): Promise<string> => {
      if (!address || !publicClient || !walletClient) {
        throw new Error("Wallet not connected");
      }

      setIsExecuting(true);
      setError(null);

      try {
        const assetInfo = ASSETS[params.asset];
        const decimals = assetInfo.decimals;
        const amount = BigInt(
          Math.floor(parseFloat(params.amount) * 10 ** decimals)
        );

        let hash: string;

        if (params.positionType === "long") {
          hash = await openLongPosition(
            walletClient as any,
            publicClient,
            address,
            {
              asset: params.asset,
              amount,
              slippageBp: params.slippageBp,
            }
          );
        } else {
          hash = await openShortPosition(
            walletClient as any,
            publicClient,
            address,
            {
              asset: params.asset,
              amount,
              slippageBp: params.slippageBp,
            }
          );
        }

        // Wait for transaction to be mined
        await waitForTransaction(publicClient, hash as any);

        return hash;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Trade failed");
        setError(error);
        throw error;
      } finally {
        setIsExecuting(false);
      }
    },
    [address, publicClient, walletClient]
  );

  const simulateTrade = useCallback(
    async (params: TradeParams) => {
      if (!address || !publicClient) {
        throw new Error("Wallet not connected");
      }

      setIsSimulating(true);
      setError(null);

      try {
        const assetInfo = ASSETS[params.asset];
        const decimals = assetInfo.decimals;
        const amount = BigInt(
          Math.floor(parseFloat(params.amount) * 10 ** decimals)
        );

        let result;

        if (params.positionType === "long") {
          result = await simulateOpenLongPosition(publicClient, address, {
            asset: params.asset,
            amount,
            slippageBp: params.slippageBp,
          });
        } else {
          result = await simulateOpenShortPosition(publicClient, address, {
            asset: params.asset,
            amount,
            slippageBp: params.slippageBp,
          });
        }

        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Simulation failed");
        setError(error);
        throw error;
      } finally {
        setIsSimulating(false);
      }
    },
    [address, publicClient]
  );

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return {
    executeTrade,
    simulateTrade,
    isExecuting,
    isSimulating,
    error,
    reset,
  };
}

// =============================================================================
// Close Position Hook
// =============================================================================

export interface UseClosePositionResult {
  closePosition: (positionId: string, asset: AssetKey) => Promise<string>;
  isClosing: boolean;
  error: Error | null;
}

export function useClosePosition(): UseClosePositionResult {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [isClosing, setIsClosing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const closePositionFn = useCallback(
    async (positionId: string, asset: AssetKey): Promise<string> => {
      if (!address || !publicClient || !walletClient) {
        throw new Error("Wallet not connected");
      }

      setIsClosing(true);
      setError(null);

      try {
        const hash = await closePosition(
          walletClient as any,
          positionId,
          asset
        );

        await waitForTransaction(publicClient, hash as any);

        return hash;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to close position");
        setError(error);
        throw error;
      } finally {
        setIsClosing(false);
      }
    },
    [address, publicClient, walletClient]
  );

  return {
    closePosition: closePositionFn,
    isClosing,
    error,
  };
}

// =============================================================================
// Approval Hook
// =============================================================================

export interface UseApprovalResult {
  approve: (token: AssetKey, spender: string, amount: bigint) => Promise<string>;
  isApproving: boolean;
  error: Error | null;
}

export function useApproval(): UseApprovalResult {
  const { data: walletClient } = useWalletClient();
  const [isApproving, setIsApproving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const approve = useCallback(
    async (token: AssetKey, spender: string, amount: bigint): Promise<string> => {
      if (!walletClient) {
        throw new Error("Wallet not connected");
      }

      setIsApproving(true);
      setError(null);

      try {
        const tokenAddress = ASSETS[token].address;
        const hash = await (walletClient as any).writeContract({
          address: tokenAddress,
          abi: [
            {
              inputs: [
                { name: "spender", type: "address" },
                { name: "amount", type: "uint256" },
              ],
              name: "approve",
              outputs: [{ name: "", type: "bool" }],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
          functionName: "approve",
          args: [spender as `0x${string}`, amount],
        });

        return hash;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Approval failed");
        setError(error);
        throw error;
      } finally {
        setIsApproving(false);
      }
    },
    [walletClient]
  );

  return {
    approve,
    isApproving,
    error,
  };
}
