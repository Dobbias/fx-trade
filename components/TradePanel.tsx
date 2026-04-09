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

  const currentPrice = getPrice(asset);
  const priceDisplay = currentPrice
    ? `$${currentPrice.priceInUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : "Loading...";

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
          slippageBp: 50,
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

  const isLong = positionType === "long";

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl overflow-hidden">
      {/* Header with Long/Short Toggle */}
      <div className="p-4 lg:p-6 border-b border-white/[0.06]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg lg:text-xl font-semibold text-white">Open Position</h2>
          <div className="flex items-center gap-1.5 p-1 bg-[#121215] rounded-xl border border-white/[0.06]">
            <button
              type="button"
              onClick={() => setPositionType("long")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isLong
                  ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Long
            </button>
            <button
              type="button"
              onClick={() => setPositionType("short")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                !isLong
                  ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Short
            </button>
          </div>
        </div>

        {/* Asset Selection */}
        <div>
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Select Asset</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(ASSETS) as AssetKey[]).map((a) => {
              const price = getPrice(a);
              const isSelected = asset === a;
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAsset(a)}
                  className={`relative p-3 rounded-xl border transition-all duration-200 group ${
                    isSelected
                      ? isLong
                        ? "border-green-500/50 bg-green-500/10"
                        : "border-red-500/50 bg-red-500/10"
                      : "border-white/[0.06] bg-[#121215] hover:border-white/[0.12]"
                  }`}
                >
                  <div className={`font-medium text-sm ${isSelected ? "text-white" : "text-zinc-400 group-hover:text-zinc-300"}`}>
                    {a}
                  </div>
                  <div className={`text-xs mt-1 font-mono ${isSelected ? "text-white/70" : "text-zinc-500"}`}>
                    {price ? `$${price.priceInUSD.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : "..."}
                  </div>
                  {isSelected && (
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${isLong ? "from-green-500/10 to-transparent" : "from-red-500/10 to-transparent"} pointer-events-none`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Amount Input */}
      <div className="p-4 lg:p-6 border-b border-white/[0.06]">
        <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Amount</label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full bg-[#121215] border border-white/[0.08] rounded-xl px-4 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-mono text-lg"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <span className="text-zinc-500 font-mono text-sm">{asset}</span>
            <button
              type="button"
              onClick={() => setAmount("1.0")}
              className="px-3 py-1 text-xs font-medium text-zinc-400 bg-white/[0.04] rounded-lg hover:bg-white/[0.08] transition-colors"
            >
              MAX
            </button>
          </div>
        </div>
      </div>

      {/* Trade Summary */}
      <div className="p-4 lg:p-6 border-b border-white/[0.06]">
        <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Trade Summary</label>
        <div className="space-y-3">
          <SummaryRow label="Current Price" value={priceDisplay} />
          <SummaryRow
            label="Position Value"
            value={`$${positionValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          />
          <SummaryRow
            label="Est. Leverage"
            value={isSimulating ? "Computing..." : `Up to ${estimatedLeverage.toFixed(1)}x`}
            highlight
          />
          <SummaryRow
            label="Liquidation Price"
            value={`$${liquidationPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            valueClass={isLong ? "text-green-400" : "text-red-400"}
          />
          {simulationResult?.gasEstimate && (
            <SummaryRow label="Est. Gas" value={`${simulationResult.gasEstimate.toString()} gwei`} />
          )}
        </div>
      </div>

      {/* Status Messages */}
      {(localError || hookError) && (
        <div className="p-4 mx-4 lg:mx-6 mt-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-400">{localError || hookError?.message}</p>
          </div>
        </div>
      )}

      {txHash && (
        <div className="p-4 mx-4 lg:mx-6 mt-4 rounded-xl bg-green-500/10 border border-green-500/20">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-green-400">Transaction submitted!</p>
              <p className="text-xs text-green-400/70 mt-1 break-all font-mono">{txHash}</p>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="p-4 lg:p-6">
        <button
          type="submit"
          disabled={!amount || parseFloat(amount) <= 0 || isExecuting}
          className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group ${
            isLong
              ? "bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/20 hover:shadow-green-500/40"
              : "bg-gradient-to-r from-red-500 to-rose-600 shadow-lg shadow-red-500/20 hover:shadow-red-500/40"
          }`}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isExecuting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Executing...
              </>
            ) : (
              <>
                {isLong ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                )}
                Open {isLong ? "Long" : "Short"} Position
              </>
            )}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

        <p className="text-xs text-zinc-600 text-center mt-4 flex items-center justify-center gap-1.5">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Trading involves risk. Positions may be liquidated if they fall below maintenance margin.
        </p>
      </div>
    </form>
  );
}

function SummaryRow({
  label,
  value,
  valueClass,
  highlight,
}: {
  label: string;
  value: string;
  valueClass?: string;
  highlight?: boolean;
}) {
  return (
    <div className={`flex justify-between items-center ${highlight ? "py-2 px-3 -mx-3 rounded-lg bg-white/[0.03]" : ""}`}>
      <span className="text-sm text-zinc-500">{label}</span>
      <span className={`text-sm font-mono font-medium ${valueClass || "text-zinc-300"}`}>{value}</span>
    </div>
  );
}

function calculateLiquidationPrice(
  entryPrice: number,
  leverage: number,
  isLong: boolean
): number {
  const liquidationRatio = 1.1;
  if (isLong) {
    return entryPrice * liquidationRatio / leverage;
  } else {
    return entryPrice * (2 - liquidationRatio / leverage);
  }
}
