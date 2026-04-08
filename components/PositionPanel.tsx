"use client";

import { useAppKitAccount } from "@reown/appkit/react";

export function PositionPanel() {
  const { address } = useAppKitAccount();

  // Mock position data - will be replaced with f(x) Protocol data
  const mockPositions = [
    {
      id: "1",
      type: "long",
      asset: "stETH",
      amount: "1.5",
      value: "$5,175.38",
      leverage: "5.2x",
      pnl: "+$234.50",
      pnlPercent: "+4.53%",
    },
  ];

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6">
      <h2 className="text-xl font-bold text-white mb-6">Your Positions</h2>

      {/* Account Summary */}
      <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
        <div className="text-sm text-slate-400 mb-1">Total Value</div>
        <div className="text-2xl font-bold text-white">$5,175.38</div>
        <div className="text-sm text-green-400 mt-1">+$234.50 (4.53%)</div>
      </div>

      {/* Positions List */}
      {mockPositions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-400">No open positions</p>
          <p className="text-sm text-slate-500 mt-2">Open a position to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {mockPositions.map((position) => (
            <div
              key={position.id}
              className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50 hover:border-slate-500 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${position.type === "long" ? "bg-green-400" : "bg-red-400"}`} />
                  <span className="font-medium text-white">{position.asset}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${position.type === "long" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                    {position.leverage}
                  </span>
                </div>
                <div className="text-green-400 text-sm font-medium">{position.pnlPercent}</div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount</span>
                  <span className="text-white">{position.amount} {position.asset}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Value</span>
                  <span className="text-white">{position.value}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">PnL</span>
                  <span className="text-green-400">{position.pnl}</span>
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
