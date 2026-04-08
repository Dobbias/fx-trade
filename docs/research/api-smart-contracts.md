# f(x) Protocol Trading Interface - API & Smart Contract Research

## Executive Summary

This document outlines the key APIs, smart contracts, and integration patterns needed to build a professional trading interface for the **f(x) Protocol**. This is **f(x) Protocol-specific research** - the protocol has its own leveraged trading mechanisms, not generic DEX swaps like Uniswap.

---

## 1. f(x) Protocol Overview

**Documentation**: https://fxprotocol.gitbook.io/fx-docs

**What is f(x) Protocol?**

f(x) Protocol is a leveraged trading protocol that splits yield-bearing assets into:
- **fxUSD**: A scalable decentralized stablecoin that captures on-chain yield
- **xPOSITION**: Up to 10x leverage long positions on ETH/BTC with minimal liquidation risk
- **sPOSITION**: Short positions with leverage obtained via flashloans

**Key Components**:

| Component | Description |
|----------|-------------|
| fxUSD | Delta-neutral stablecoin capturing real yield |
| xPOSITION | Leveraged LONG positions (stETH, WBTC, frxETH, ezETH, etc.) |
| sPOSITION | Leveraged SHORT positions against collateral |
| fxMINT | Borrowing fxUSD against BTC/ETH collateral |
| Stability Pool | Yield provision + peg-keeping mechanism |
| Liquidation Brake | Auto-rebalancing to reduce liquidation risk |

---

## 2. f(x) Protocol Smart Contracts

**GitHub Repository**: https://github.com/AladdinDAO/fx-protocol-contracts

**Deployed Contracts**: https://fxprotocol.gitbook.io/fx-docs/more/resources/contracts

### 2.1 Core Contracts

**Stablecoin (beta = 0)**:
- **fxUSD**: `0x085780639CC2cACd35E474e71f4D000e2405d8f6`
- **FxUSDRebalancer**: `0x78c3aF23A4DeA2F630C130d2E42717587584BF05`

**Leverage Pools**:
- **fstETH/xstETH**: `0xED803540037B0ae069c93420F89Cd653B6e3Df1f`
- **ffrxETH/xfrxETH**: `0xcfEEfF214b256063110d3236ea12Db49d2dF2359`
- **feETH/xeETH**: `0x781BA968d5cc0b40EB592D5c8a9a3A4000063885`
- **fezETH/xezETH**: `0x38965311507D4E54973F81475a149c09376e241e`
- **fWBTC/xWBTC**: `0x63Fe55B3fe3f74B42840788cFbe6229869590f83`

### 2.2 Price Oracles

**Chainlink + TWAP Hybrid Oracles**:
- **ETH/USD**: `0x460B3CdE57DfbA90DBed02fd83d3990a92DA1230`
- **stETH/USD**: `0xD24AC180e6769Fd5F624e7605B93084171074A77`
- **BTC/USD**: `0x82012139b29BC5Ac2ff4066832c836122bC6c690`

### 2.3 Protocol Mechanisms

**Opening xPOSITION (Long)**:
1. User provides stETH or WBTC as collateral
2. fxUSD is minted using the f(x) Invariant formula
3. System dynamically adjusts leverage ratios

**Opening sPOSITION (Short)**:
1. User provides fxUSD as collateral
2. Leverage obtained via flashloan
3. Flashloan repaid using fxUSD backing assets

**Rebalancing Operations**:
- Automatically adjusts leveraged positions to safe levels
- Significantly reduces liquidation risk
- Handled by keeper bots

---

## 3. Wallet Connection Standards

### 3.1 EIP-1193 (Ethereum Provider JavaScript API)

**Standard**: https://eips.ethereum.org/EIPS/eip-1193

**Core Interface**:
```typescript
interface RequestArguments {
  readonly method: string;
  readonly params?: readonly unknown[] | object;
}

interface Provider {
  request(args: RequestArguments): Promise<unknown>;
  on(event: string, listener: (...args: any[]) => void): void;
  removeListener(event: string, listener: (...args: any[]) => void): void;
}
```

**Essential Events**:
- `accountsChanged`: User switches accounts
- `chainChanged`: User switches networks
- `connect` / `disconnect`: Connection state changes

### 3.2 Reown (formerly WalletConnect) - AppKit

**Documentation**: https://docs.reown.com/web3modal

**Integration Pattern**:
```typescript
import { createAppKit } from "@reown/appkit/react";
import { viemAdapter } from "@reown/appkit-adapter-viem";

const appKit = createAppKit({
  adapters: [viemAdapter()],
  networks: [mainnet],
  projectId: "YOUR_PROJECT_ID"
});
```

---

## 4. Smart Contract Interaction Libraries

### 4.1 Viem (Recommended)

**Repository**: https://github.com/wevm/viem

**Why Viem**:
- Modern TypeScript-first library
- Better type safety than ethers.js
- Smaller bundle size
- Better performance
- Active development

**Integration Pattern for f(x)**:
```typescript
import { createPublicClient, createWalletClient, http } from "viem";
import { mainnet } from "viem/chains";

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http()
});

const walletClient = createWalletClient({
  chain: mainnet,
  transport: window.ethereum
});

// Interact with f(x) contracts
const fxUSD = {
  address: "0x085780639CC2cACd35E474e71f4D000e2405d8f6",
  abi: FXUSD_ABI
};
```

---

## 5. Key Integration Points

### 5.1 Opening a Position

**For xPOSITION (Long)**:
```typescript
// Approve collateral
class interface FxPositionManager {
  function openXPosition(
    address collateral,
    uint256 collateralAmount,
    uint256 minFxUSD
  ) external returns (uint256);
}
```

**For sPOSITION (Short)**:
```typescript
function openSPosition(
  address fxUSD,
  uint256 fxUSDAmount
) external returns (uint256);
```

### 5.2 Limit Orders

**Documentation Reference**: https://fxprotocol.gitbook.io/fx-docs/developers/integrating-the-f-x-limit-orders

f(x) Protocol has built-in limit order functionality that integrates with the trading interface.

### 5.3 fxSAVE Integration

**Documentation Reference**: https://fxprotocol.gitbook.io/fx-docs/developers/integrating-fxsave

For earning yield on fxUSD through the Stability Pool.

---

## 6. Price Data & Oracles

### 6.1 f(x) Protocol Oracles

The protocol uses **Chainlink + TWAP hybrid oracles**:

**Key Oracle Contracts**:
- **ChainlinkTwapOracleV3 ETH/USD**: `0x460B3CdE57DfbA90DBed02fd83d3990a92DA1230`
- **ChainlinkTwapOracleV3 stETH/USD**: `0xD24AC180e6769Fd5F624e7605B93084171074A77`
- **FxChainlinkTwapOracle BTC/USD**: `0x82012139b29BC5Ac2ff4066832c836122bC6c690`

**Oracle Interface**:
```typescript
interface FxOracle {
  function getPrice() external view returns (uint256);
  function updatePrice() external;
}
```

### 6.2 Reading Prices

Use Viem to read from f(x) oracle contracts:
```typescript
const price = await publicClient.readContract({
  address: "0x460B3CdE57DfbA90DBed02fd83d3990a92DA1230",
  abi: ORACLE_ABI,
  functionName: "getPrice"
});
```

---

## 7. Transaction Signing & Simulation

### 7.1 Transaction Simulation

**Viem Simulation Pattern**:
```typescript
const result = await publicClient.simulateContract({
  address: FX_POSITION_MANAGER,
  abi: POSITION_MANAGER_ABI,
  functionName: "openXPosition",
  args: [collateral, amount, minFxUSD],
  account: address
});
```

### 7.2 Signing Flow

1. Build transaction for f(x) contract call
2. Estimate gas
3. Present to user for approval
4. Sign via wallet
5. Submit to mempool
6. Track transaction status

---

## 8. Recommended Tech Stack for f(x) Protocol

### Frontend
```json
{
  "core": "Next.js 15 / React 19",
  "wallet": "Reown AppKit (viem adapter)",
  "web3": "Viem",
  "chain": "Ethereum Mainnet"
}
```

### Smart Contract Interaction
```json
{
  "protocol": "f(x) Protocol v2",
  "contracts": "https://github.com/AladdinDAO/fx-protocol-contracts",
  "oracles": "Chainlink + TWAP hybrid",
  "simulation": "Viem simulateContract"
}
```

### Key NPM Packages
```bash
# Wallet & Web3
npm install @reown/appkit @reown/appkit-adapter-viem viem

# Utilities
npm install @tanstack/react-query
```

---

## 9. Security Considerations

1. **Never commit private keys** - Use environment variables
2. **Validate all user inputs** - Prevent injection attacks
3. **Check oracle price freshness** - f(x) uses hybrid Chainlink+TWAP
4. **Implement slippage protection** - For position openings
5. **Handle rebalancing events** - Positions may be auto-adjusted
6. **Use safe approval patterns** - ERC20 approvals for collateral
7. **Transaction simulation before signing** - Catch errors early
8. **Monitor liquidation brake levels** - Alert users on risk

---

## 10. Next Steps

1. **Coordinate with Technical Writer** to formalize documentation
2. **Clone and study** https://github.com/AladdinDAO/fx-protocol-contracts
3. **Set up development environment** with Viem + Reown
4. **Implement wallet connection** using Reown AppKit
5. **Build xPOSITION opening UI** using f(x) contracts
6. **Integrate price feeds** from f(x) oracles
7. **Add transaction simulation** for all position operations

---

## 11. Key References

- **f(x) Protocol Docs**: https://fxprotocol.gitbook.io/fx-docs
- **f(x) Contracts**: https://github.com/AladdinDAO/fx-protocol-contracts
- **Deployed Addresses**: https://fxprotocol.gitbook.io/fx-docs/more/resources/contracts
- **EIP-1193**: https://eips.ethereum.org/EIPS/eip-1193
- **Reown/Web3Modal**: https://docs.reown.com/web3modal
- **Viem**: https://github.com/wevm/viem
