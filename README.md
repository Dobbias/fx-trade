# f(x) Protocol Trading Interface

A modern, professional trading interface for the [f(x) Protocol](https://fxprotocol.gitbook.io/fx-docs) - a decentralized leveraged trading protocol.

## Overview

f(x) Protocol enables leveraged trading through:
- **fxUSD**: A scalable decentralized stablecoin that captures on-chain yield
- **xPOSITION**: Up to 10x leverage long positions on ETH/BTC with minimal liquidation risk
- **sPOSITION**: Short positions with leverage obtained via flashloans

## Features

- **Wallet Connection**: Connect via Reown AppKit (WalletConnect, injected wallets)
- **Real-Time Prices**: Live price feeds from f(x) Protocol oracles
- **Long Positions**: Open leveraged long positions on stETH, WBTC, frxETH, ezETH, eETH
- **Short Positions**: Open leveraged short positions (coming soon)
- **Position Tracking**: View your open positions with PnL and liquidation prices
- **Trade Simulation**: Preview trades before executing
- **Slippage Protection**: Set slippage tolerance for trades

## Tech Stack

- **Frontend**: Next.js 15 / React 19
- **Wallet**: Reown AppKit (viem adapter)
- **Web3**: Viem, Wagmi
- **Chain**: Ethereum Mainnet
- **Styling**: Tailwind CSS

## Documentation

- [API & Smart Contract Research](docs/research/api-smart-contracts.md) - Comprehensive research on f(x) Protocol integration
- [Getting Started](docs/guides/getting-started.md) - Development setup guide

## Project Structure

```
├── app/                      # Next.js app directory
│   ├── providers.tsx         # Web3 providers (AppKit, Wagmi)
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/               # React components
│   ├── ConnectButton.tsx     # Wallet connection button
│   ├── PositionPanel.tsx     # User positions display
│   ├── TradePanel.tsx        # Trading form
│   └── TradingInterface.tsx  # Main trading interface
├── lib/                      # Library code
│   ├── abi/                  # Smart contract ABIs
│   │   └── fx-usd.ts         # f(x) Protocol ABIs
│   ├── constants.ts          # Contract addresses & constants
│   ├── fx-protocol.ts        # Contract interaction functions
│   ├── hooks/                # React hooks
│   │   └── use-fx-protocol.ts# Custom Web3 hooks
│   └── wagmi-config.ts       # Wagmi configuration
└── docs/                     # Documentation
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file:

```bash
# Get your project ID from https://cloud.reown.com
NEXT_PUBLIC_REOWN_PROJECT_ID=your-project-id-here
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building

```bash
npm run build
npm start
```

## Supported Assets

| Asset | Type | Oracle |
|-------|------|--------|
| stETH | Long | Chainlink + TWAP |
| WBTC  | Long | Chainlink + TWAP |
| frxETH| Long | ETH Oracle |
| ezETH | Long | ETH Oracle |
| eETH  | Long | ETH Oracle |

## Smart Contract Addresses

### Mainnet
- **fxUSD**: `0x085780639CC2cACd35E474e71f4D000e2405d8f6`
- **Rebalancer**: `0x78c3aF23A4DeA2F630C130d2E42717587584BF05`
- **fstETH/xstETH**: `0xED803540037B0ae069c93420F89Cd653B6e3Df1f`
- **fWBTC/xWBTC**: `0x63Fe55B3fe3f74B42840788cFbe6229869590f83`

See [Deployed Contracts](https://fxprotocol.gitbook.io/fx-docs/more/resources/contracts) for the full list.

## Security Considerations

- Never commit private keys or API keys
- All contract interactions are simulated before execution
- Slippage protection is enabled by default
- Positions may be liquidated if they fall below maintenance margin

## License

See [LICENSE](LICENSE) file.

## Resources

- [f(x) Protocol Documentation](https://fxprotocol.gitbook.io/fx-docs)
- [f(x) Smart Contracts](https://github.com/AladdinDAO/fx-protocol-contracts)
- [Deployed Contract Addresses](https://fxprotocol.gitbook.io/fx-docs/more/resources/contracts)
