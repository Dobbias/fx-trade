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
  const isPositive = totalPnL >= 0;

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-white/[0.06] flex items-center justify-between">
        <h2 className="text-lg lg:text-xl font-semibold text-white">Your Positions</h2>
        <button
          onClick={refetch}
          className="p-2 rounded-lg hover:bg-white/[0.04] transition-colors group"
          disabled={isLoading}
        >
          <svg
            className={`w-5 h-5 text-zinc-500 ${isLoading ? "animate-spin" : "group-hover:text-zinc-300"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Portfolio Summary */}
      <div className="p-4 lg:p-6 border-b border-white/[0.06]">
        <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Total Portfolio Value</div>
        <div className="flex items-baseline gap-3">
          <div className="text-3xl lg:text-4xl font-bold text-white font-mono tracking-tight">
            {formatUSD(totalValue)}
          </div>
        </div>
        <div className={`inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-lg ${
          isPositive ? "bg-green-500/10" : "bg-red-500/10"
        }`}>
          <svg className={`w-4 h-4 ${isPositive ? "text-green-400" : "text-red-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isPositive ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            )}
          </svg>
          <span className={`text-sm font-medium font-mono ${isPositive ? "text-green-400" : "text-red-400"}`}>
            {isPositive ? "+" : ""}{formatUSD(totalPnL)} ({isPositive ? "+" : ""}{totalPnLPercent.toFixed(2)}%)
          </span>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 mx-4 mt-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-400">Failed to load positions</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && positions.length === 0 && (
        <div className="p-8 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-white/[0.04] flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
          <p className="text-sm text-zinc-500">Loading positions...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && positions.length === 0 && (
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-600/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-zinc-400 font-medium">No open positions</p>
          <p className="text-sm text-zinc-600 mt-2">Open a position to get started</p>
        </div>
      )}

      {/* Positions List */}
      {!isLoading && positions.length > 0 && (
        <div className="divide-y divide-white/[0.04]">
          {positions.map((position) => {
            const isPosLong = position.type === "long";
            const isPositivePnL = position.pnlPercent >= 0;

            return (
              <div
                key={position.id}
                className="p-4 lg:p-5 hover:bg-white/[0.02] transition-colors group"
              >
                {/* Position Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isPosLong ? "bg-green-500/10" : "bg-red-500/10"
                    }`}>
                      <svg className={`w-4 h-4 ${isPosLong ? "text-green-400" : "text-red-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isPosLong ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                        )}
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{position.asset}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          isPosLong
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}>
                          {position.leverage.toFixed(1)}x
                        </span>
                      </div>
                      <div className="text-xs text-zinc-500 mt-0.5">
                        {isPosLong ? "Long" : "Short"} Position
                      </div>
                    </div>
                  </div>
                  <div className={`text-right ${
                    isPositivePnL ? "text-green-400" : "text-red-400"
                  }`}>
                    <div className="text-sm font-medium font-mono">
                      {isPositivePnL ? "+" : ""}{position.pnlPercent.toFixed(2)}%
                    </div>
                    <div className="text-xs font-mono opacity-70">
                      {isPositivePnL ? "+" : ""}{formatUSD(position.pnlUSD)}
                    </div>
                  </div>
                </div>

                {/* Position Details */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-[#121215] rounded-lg p-3">
                    <div className="text-xs text-zinc-600 mb-1">Collateral</div>
                    <div className="text-sm font-mono text-zinc-300">
                      {formatTokenAmount(position.collateralAmount, ASSETS[position.asset].decimals)} {position.asset}
                    </div>
                  </div>
                  <div className="bg-[#121215] rounded-lg p-3">
                    <div className="text-xs text-zinc-600 mb-1">Position Value</div>
                    <div className="text-sm font-mono text-zinc-300">
                      {formatUSD(position.valueUSD)}
                    </div>
                  </div>
                  <div className="bg-[#121215] rounded-lg p-3">
                    <div className="text-xs text-zinc-600 mb-1">Unrealized PnL</div>
                    <div className={`text-sm font-mono ${position.pnlUSD >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {position.pnlUSD >= 0 ? "+" : ""}{formatUSD(position.pnlUSD)}
                    </div>
                  </div>
                  <div className="bg-[#121215] rounded-lg p-3">
                    <div className="text-xs text-zinc-600 mb-1">Liquidation Price</div>
                    <div className="text-sm font-mono text-yellow-400">
                      ${position.liquidationPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>

                {/* Close Button */}
                <button className="w-full py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium border border-red-500/20 hover:border-red-500/30">
                  Close Position
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
