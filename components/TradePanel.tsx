"use client";

import { useState, useEffect } from "react";
import { usePrices, useTrade } from "@/lib/hooks/use-fx-protocol";
import type { PositionType, AssetKey } from "@/lib/fx-protocol";
import { ASSETS, LEVERAGE_SETTINGS } from "@/lib/constants";

export function TradePanel() {
  const [positionType, setPositionType] = useState<PositionType>("long");
  const [asset, setAsset] = useState<AssetKey>("stETH");
  const [amount, setAmount] = useState("");
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const { prices, getPrice, isLoading: pricesLoading } = usePrices();
  const { executeTrade, simulateTrade, isExecuting, error: hookError, reset } = useTrade();
  const [localError, setLocalError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  // Get current asset price
  const currentPrice = getPrice(asset);
  const priceDisplay = currentPrice
    ? `$${currentPrice.priceInUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : "Loading...";

  // Simulate trade when inputs change
  useEffect(() => {
    const runSimulation = async () => {
      if (!amount || parseFloat(amount) <= 0) {
        setSimulationResult(null);
        return;
      }

      setIsSimulating(true);
      try {
        const result = await simulateTrade({
          asset,
          amount,
          positionType,
          slippageBp: 50, // 0.5% slippage
        });
        setSimulationResult(result);
      } catch (err) {
        console.error("Simulation error:", err);
        setSimulationResult(null);
      } finally {
        setIsSimulating(false);
      }
    };

    const timer = setTimeout(runSimulation, 500);
    return () => clearTimeout(timer);
  }, [amount, asset, positionType, simulateTrade]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setTxHash(null);
    reset();

    if (!amount || parseFloat(amount) <= 0) {
      setLocalError("Please enter a valid amount");
      return;
    }

    try {
      const hash = await executeTrade({
        asset,
        amount,
        positionType,
        slippageBp: 50,
      });
      setTxHash(hash);
      // Reset form on success
      setAmount("");
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Trade failed");
    }
  };

  const amountNum = parseFloat(amount) || 0;
  const positionValue = currentPrice ? amountNum * currentPrice.priceInUSD : 0;
  const estimatedLeverage = simulationResult?.estimatedLeverage || LEVERAGE_SETTINGS.MAX_LEVERAGE;
  const liquidationPrice = currentPrice
    ? calculateLiquidationPrice(currentPrice.priceInUSD, estimatedLeverage, positionType === "long")
    : 0;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Open Position</h2>
        <div className="flex gap-2 bg-slate-700/50 rounded-lg p-1">
          <button
            onClick={() => setPositionType("long")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              positionType === "long"
                ? "bg-green-500 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Long
          </button>
          <button
            onClick={() => setPositionType("short")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              positionType === "short"
                ? "bg-red-500 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Short
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Asset Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Select Asset</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(ASSETS) as AssetKey[]).map((a) => {
              const price = getPrice(a);
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAsset(a)}
                  className={`p-3 rounded-lg border transition-all ${
                    asset === a
                      ? "border-blue-500 bg-blue-500/10 text-white"
                      : "border-slate-600 bg-slate-700/30 text-slate-400 hover:border-slate-500"
                  }`}
                >
                  <div className="font-medium">{a}</div>
                  <div className="text-xs mt-1">
                    {price ? `$${price.priceInUSD.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : "..."}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Amount</label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
              {asset}
            </div>
          </div>
        </div>

        {/* Trade Summary */}
        <div className="bg-slate-700/30 rounded-lg p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Current Price</span>
            <span className="text-white">{priceDisplay}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Position Value</span>
            <span className="text-white">
              ${positionValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Est. Leverage</span>
            <span className="text-white">
              {isSimulating ? "..." : `Up to ${estimatedLeverage.toFixed(1)}x`}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Liquidation Price</span>
            <span className={positionType === "long" ? "text-green-400" : "text-red-400"}>
              ${liquidationPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          {simulationResult?.gasEstimate && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Est. Gas</span>
              <span className="text-slate-300">{simulationResult.gasEstimate.toString()}</span>
            </div>
          )}
        </div>

        {/* Error Display */}
        {(localError || hookError) && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
            {localError || hookError?.message}
          </div>
        )}

        {/* Success Display */}
        {txHash && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 text-green-400 text-sm">
            <div className="font-medium mb-1">Transaction submitted!</div>
            <div className="text-xs break-all">{txHash}</div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!amount || parseFloat(amount) <= 0 || isExecuting}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg shadow-blue-500/20"
        >
          {isExecuting ? "Executing..." : `Open ${positionType === "long" ? "Long" : "Short"} Position`}
        </button>

        {/* Disclaimer */}
        <p className="text-xs text-slate-500 text-center">
          Trading involves risk. Positions may be liquidated if they fall below maintenance margin.
        </p>
      </form>
    </div>
  );
}

// Helper function to calculate liquidation price
function calculateLiquidationPrice(
  entryPrice: number,
  leverage: number,
  isLong: boolean
): number {
  const liquidationRatio = 1.1; // 110% collateral ratio
  if (isLong) {
    return entryPrice * liquidationRatio / leverage;
  } else {
    return entryPrice * (2 - liquidationRatio / leverage);
  }
}
