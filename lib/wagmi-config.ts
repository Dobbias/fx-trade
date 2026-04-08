import { http, createConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

// Create Wagmi config for f(x) Protocol trading interface
export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || "demo-project-id",
      metadata: {
        name: "f(x) Protocol Trading Interface",
        description: "A modern, professional trading interface for the f(x) Protocol",
        url: "https://fxprotocol.trade",
        icons: ["https://avatars.githubusercontent.com/u/37784886"],
      },
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  ssr: true, // Enable server-side rendering
});
