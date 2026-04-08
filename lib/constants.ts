// f(x) Protocol Contract Addresses on Ethereum Mainnet
// Source: https://fxprotocol.gitbook.io/fx-docs/more/resources/contracts

export const FX_CONTRACTS = {
  // Stablecoin (beta = 0)
  FXUSD: "0x085780639CC2cACd35E474e71f4D000e2405d8f6" as const,
  REBALANCER: "0x78c3aF23A4DeA2F630C130d2E42717587584BF05" as const,
  // Position Manager (handles xPOSITION and sPOSITION)
  POSITION_MANAGER: "0x78c3aF23A4DeA2F630C130d2E42717587584BF05" as const, // Same as rebalancer for now

  // Leverage Pairs (fTOKEN for collateral, xTOKEN for long positions)
  PAIRS: {
    stETH: {
      fTOKEN: "0xED803540037B0ae069c93420F89Cd653B6e3Df1f" as const,
      xTOKEN: "0xED803540037B0ae069c93420F89Cd653B6e3Df1f" as const, // Same contract
      asset: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84" as const, // stETH
    },
    frxETH: {
      fTOKEN: "0xcfEEfF214b256063110d3236ea12Db49d2dF2359" as const,
      xTOKEN: "0xcfEEfF214b256063110d3236ea12Db49d2dF2359" as const,
      asset: "0xE95A203B1a91a908F9B9CE46459d3477C7c89BB0" as const, // frxETH
    },
    eETH: {
      fTOKEN: "0x781BA968d5cc0b40EB592D5c8a9a3A4000063885" as const,
      xTOKEN: "0x781BA968d5cc0b40EB592D5c8a9a3A4000063885" as const,
      asset: "0xeA1F346faF023Fde4124bB1E2624E9f39A9A8396" as const, // eETH
    },
    ezETH: {
      fTOKEN: "0x38965311507D4E54973F81475a149c09376e241e" as const,
      xTOKEN: "0x38965311507D4E54973F81475a149c09376e241e" as const,
      asset: "0xbf5495Efe5DB9ce00f80364C8B423567e58d2110" as const, // ezETH
    },
    WBTC: {
      fTOKEN: "0x63Fe55B3fe3f74B42840788cFbe6229869590f83" as const,
      xTOKEN: "0x63Fe55B3fe3f74B42840788cFbe6229869590f83" as const,
      asset: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599" as const, // WBTC
    },
  },

  // Price Oracles
  ORACLES: {
    ETH_USD: "0x460B3CdE57DfbA90DBed02fd83d3990a92DA1230" as const,
    STETH_USD: "0xD24AC180e6769Fd5F624e7605B93084171074A77" as const,
    BTC_USD: "0x82012139b29BC5Ac2ff4066832c836122bC6c690" as const,
  },
} as const;

// Asset metadata
export const ASSETS = {
  stETH: {
    symbol: "stETH",
    name: "Liquid Staked Ether",
    decimals: 18,
    address: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84" as const,
    oracle: FX_CONTRACTS.ORACLES.STETH_USD,
    pair: FX_CONTRACTS.PAIRS.stETH,
  },
  frxETH: {
    symbol: "frxETH",
    name: "Frax Ether",
    decimals: 18,
    address: "0xE95A203B1a91a908F9B9CE46459d3477C7c89BB0" as const,
    oracle: FX_CONTRACTS.ORACLES.ETH_USD, // Uses ETH oracle as fallback
    pair: FX_CONTRACTS.PAIRS.frxETH,
  },
  eETH: {
    symbol: "eETH",
    name: "Ether.fi Staked ETH",
    decimals: 18,
    address: "0xeA1F346faF023Fde4124bB1E2624E9f39A9A8396" as const,
    oracle: FX_CONTRACTS.ORACLES.ETH_USD, // Uses ETH oracle as fallback
    pair: FX_CONTRACTS.PAIRS.eETH,
  },
  ezETH: {
    symbol: "ezETH",
    name: "Renzo Restaked ETH",
    decimals: 18,
    address: "0xbf5495Efe5DB9ce00f80364C8B423567e58d2110" as const,
    oracle: FX_CONTRACTS.ORACLES.ETH_USD, // Uses ETH oracle as fallback
    pair: FX_CONTRACTS.PAIRS.ezETH,
  },
  WBTC: {
    symbol: "WBTC",
    name: "Wrapped BTC",
    decimals: 8,
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599" as const,
    oracle: FX_CONTRACTS.ORACLES.BTC_USD,
    pair: FX_CONTRACTS.PAIRS.WBTC,
  },
} as const;

export type AssetKey = keyof typeof ASSETS;

// Leverage settings
export const LEVERAGE_SETTINGS = {
  MAX_LEVERAGE: 10, // 10x max leverage
  MIN_COLLATERAL_RATIO: 1.1, // 110% collateral ratio for liquidation
  REBALANCE_THRESHOLD: 0.9, // 90% of max leverage triggers rebalancing
} as const;

// Slippage tolerance (in basis points: 50 = 0.5%)
export const DEFAULT_SLIPPAGE_BP = 50; // 0.5%
