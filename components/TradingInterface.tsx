"use client";

import { useAccount } from "wagmi";
import { PositionPanel } from "./PositionPanel";
import { TradePanel } from "./TradePanel";

export function TradingInterface() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Connect Your Wallet</h2>
          <p className="text-slate-400 mb-6">
            Connect your wallet to start trading on the f(x) Protocol with up to 10x leverage on ETH and BTC positions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-2xl mx-auto">
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
              <div className="text-blue-400 font-semibold mb-2">Leverage Long</div>
              <p className="text-sm text-slate-400">Up to 10x long positions on ETH/BTC with minimal liquidation risk</p>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
              <div className="text-purple-400 font-semibold mb-2">Leverage Short</div>
              <p className="text-sm text-slate-400">Short positions with leverage obtained via flashloans</p>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
              <div className="text-green-400 font-semibold mb-2">Earn Yield</div>
              <p className="text-sm text-slate-400">fxUSD captures on-chain yield while maintaining delta-neutral stability</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Trade Panel - Takes 2 columns */}
      <div className="lg:col-span-2">
        <TradePanel />
      </div>

      {/* Position Panel - Takes 1 column */}
      <div className="lg:col-span-1">
        <PositionPanel />
      </div>
    </div>
  );
}
