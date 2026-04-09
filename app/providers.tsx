"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppKitProvider } from "@reown/appkit/react";
import { mainnet, sepolia } from "@reown/appkit/networks";
import { WagmiProvider } from "wagmi";
import { config } from "@/lib/wagmi-config";
import type { ReactNode } from "react";

// 1. Get projectId from https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || "demo-project-id";

// 2. Create a metadata object
const metadata = {
  name: "f(x) Protocol Trading Interface",
  description: "A modern, professional trading interface for the f(x) Protocol",
  url: "https://fxprotocol.trade",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const appKitConfig = {
  networks: [mainnet, sepolia],
  projectId,
  metadata,
  features: {
    analytics: true,
  },
};

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 30_000, // 30 seconds
      },
    },
  });

  return (
    <WagmiProvider config={config}>
      <AppKitProvider {...(appKitConfig as any)}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </AppKitProvider>
    </WagmiProvider>
  );
}
