"use client";

import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useAccount } from "wagmi";

export function ConnectButton() {
  const { open } = useAppKit();
  const { address: appkitAddress, isConnected } = useAppKitAccount();
  const { address: wagmiAddress } = useAccount();

  const address = appkitAddress || wagmiAddress;

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getAddressColor = (addr: string) => {
    const hash = addr.slice(0, 6);
    const hue = parseInt(hash, 16) % 360;
    return `hsl(${hue}, 70%, 60%)`;
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
          <div
            className="w-5 h-5 rounded-full"
            style={{ background: getAddressColor(address) }}
          />
          <div className="text-right">
            <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Connected</p>
            <p className="text-xs font-mono text-zinc-300">{shortenAddress(address)}</p>
          </div>
        </div>
        <button
          onClick={() => open()}
          className="relative group px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-medium text-sm text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 overflow-hidden"
        >
          <span className="relative z-10">Manage Wallet</span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => open()}
      className="group relative px-5 py-2.5 bg-white text-black rounded-xl font-medium text-sm hover:bg-zinc-100 transition-all duration-300 shadow-lg shadow-white/10 hover:shadow-white/20"
    >
      <span className="flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 19h6m-6-4h6m-6-4h6M5 19h6m-6-4h6m-6-4h6M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
        </svg>
        Connect Wallet
      </span>
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
