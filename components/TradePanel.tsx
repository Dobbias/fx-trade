"use client";

import { useState } from "react";

type PositionType = "long" | "short";
type Asset = "stETH" | "WBTC" | "frxETH" | "ezETH" | "eETH";

export function TradePanel() {
  const [positionType, setPositionType] = useState<PositionType>("long");
  const [asset, setAsset] = useState<Asset>("stETH");
  const [amount, setAmount] = useState("");

  // Mock price data - will be replaced with f(x) oracle data
  const prices: Record<Asset, number> = {
    stETH: 3450.25,
    WBTC: 98500.00,
    frxETH: 3420.80,
    ezETH: 3510.40,
    eETH: 3485.60,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual trade execution through f(x) Protocol
    console.log("Trade:", { positionType, asset, amount });
  };

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
            {(Object.keys(prices) as Asset[]).map((a) => (
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
                <div className="text-xs mt-1">${prices[a].toLocaleString()}</div>
              </button>
            ))}
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
            <span className="text-slate-400">Position Value</span>
            <span className="text-white">
              {amount ? `$${(parseFloat(amount) * prices[asset]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Est. Leverage</span>
            <span className="text-white">Up to 10x</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Liquidation Price</span>
            <span className="text-green-400">
              {amount ? `$${(parseFloat(amount) * prices[asset] * 0.9).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!amount || parseFloat(amount) <= 0}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg shadow-blue-500/20"
        >
          Open {positionType === "long" ? "Long" : "Short"} Position
        </button>

        {/* Disclaimer */}
        <p className="text-xs text-slate-500 text-center">
          Trading involves risk. Positions may be liquidated if they fall below maintenance margin.
        </p>
      </form>
    </div>
  );
}
