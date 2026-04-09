"use client";

import { useAccount } from "wagmi";
import { PositionPanel } from "./PositionPanel";
import { TradePanel } from "./TradePanel";

export function TradingInterface() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-sm font-medium text-blue-400">Live on Mainnet</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            Advanced <span className="gradient-text">Leverage Trading</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Trade with up to 10x leverage on ETH and BTC. Minimal liquidation risk through f(x) Protocol's innovative collateral model.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger--items mb-12">
          <div className="group relative p-6 rounded-2xl bg-[#0a0a0e] border border-white/[0.06] hover:border-green-500/30 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-bl-full" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Long Positions</h3>
              <p className="text-sm text-zinc-500">Amplify your upside with up to 10x leverage on ETH and BTC positions.</p>
            </div>
          </div>

          <div className="group relative p-6 rounded-2xl bg-[#0a0a0e] border border-white/[0.06] hover:border-red-500/30 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent rounded-bl-full" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Short Positions</h3>
              <p className="text-sm text-zinc-500">Profit from downside with short positions powered by flashloan leverage.</p>
            </div>
          </div>

          <div className="group relative p-6 rounded-2xl bg-[#0a0a0e] border border-white/[0.06] hover:border-purple-500/30 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Earn Yield</h3>
              <p className="text-sm text-zinc-500">fxUSD captures on-chain yield while maintaining delta-neutral stability.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-600/10 border border-white/[0.08] p-8 text-center overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Ready to Trade?</h3>
            <p className="text-zinc-500 mb-4 max-w-md mx-auto">
              Connect your wallet to access professional leverage trading with minimal fees and maximum capital efficiency.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
      {/* Trade Panel */}
      <div className="xl:col-span-2">
        <TradePanel />
      </div>

      {/* Position Panel */}
      <div className="xl:col-span-1">
        <PositionPanel />
      </div>
    </div>
  );
}
