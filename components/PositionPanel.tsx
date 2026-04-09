"use client";

import { useAccount } from "wagmi";
import { usePositions } from "@/lib/hooks/use-fx-protocol";
import { formatUSD, formatTokenAmount } from "@/lib/fx-protocol";
import { ASSETS } from "@/lib/constants";

export function PositionPanel() {
  const { address } = useAccount();
  const {
    positions,
    totalValue,
    totalPnL,
    isLoading,
    error,
    refetch,
  } = usePositions();

  const totalPnLPercent = totalValue > 0 ? (totalPnL / totalValue) * 100 : 0;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Your Positions</h2>
        <button
          onClick={refetch}
          className="text-xs text-slate-400 hover:text-white transition-colors"
        >
          {isLoading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Account Summary */}
      <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
        <div className="text-sm text-slate-400 mb-1">Total Value</div>
        <div className="text-2xl font-bold text-white">
          {formatUSD(totalValue)}
        </div>
        <div className={`text-sm mt-1 ${totalPnL >= 0 ? "text-green-400" : "text-red-400"}`}>
          {totalPnL >= 0 ? "+" : ""}
          {formatUSD(totalPnL)} ({totalPnLPercent >= 0 ? "+" : ""}
          {totalPnLPercent.toFixed(2)}%)
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4 text-red-400 text-sm">
          Failed to load positions: {error.message}
        </div>
      )}

      {/* Loading State */}
      {isLoading && positions.length === 0 && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          <p className="text-slate-400 mt-2">Loading positions...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && positions.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <p className="text-slate-400">No open positions</p>
          <p className="text-sm text-slate-500 mt-2">Open a position to get started</p>
        </div>
      )}

      {/* Positions List */}
      {!isLoading && positions.length > 0 && (
        <div className="space-y-4">
          {positions.map((position) => (
            <div
              key={position.id}
              className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50 hover:border-slate-500 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${position.type === "long" ? "bg-green-400" : "bg-red-400"}`} />
                  <span className="font-medium text-white">{position.asset}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${position.type === "long" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                    {position.leverage.toFixed(1)}x
                  </span>
                </div>
                <div className={position.pnlPercent >= 0 ? "text-green-400" : "text-red-400"} text-sm font-medium>
                  {position.pnlPercent >= 0 ? "+" : ""}{position.pnlPercent.toFixed(2)}%
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount</span>
                  <span className="text-white">
                    {formatTokenAmount(position.collateralAmount, ASSETS[position.asset].decimals)} {position.asset}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Value</span>
                  <span className="text-white">{formatUSD(position.valueUSD)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">PnL</span>
                  <span className={position.pnlUSD >= 0 ? "text-green-400" : "text-red-400"}>
                    {position.pnlUSD >= 0 ? "+" : ""}{formatUSD(position.pnlUSD)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Liquidation Price</span>
                  <span className="text-yellow-400">
                    ${position.liquidationPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <button className="w-full mt-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium">
                Close Position
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
