"use client";

import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useAccount } from "wagmi";

export function ConnectButton() {
  const { open } = useAppKit();
  const { address: appkitAddress, isConnected } = useAppKitAccount();
  const { address: wagmiAddress } = useAccount();

  // Use whichever address is available
  const address = appkitAddress || wagmiAddress;

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-xs text-slate-400">Connected to</p>
          <p className="text-sm font-medium text-white">{shortenAddress(address)}</p>
        </div>
        <button
          onClick={() => open()}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/20"
        >
          Open Wallet
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => open()}
      className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/20 font-medium"
    >
      Connect Wallet
    </button>
  );
}
