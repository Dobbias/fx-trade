/**
 * f(x) Protocol Contract Addresses (Ethereum Mainnet)
 * Source: https://fxprotocol.gitbook.io/fx-docs/more/resources/contracts
 */

export const FX_CONTRACTS = {
  // Stablecoin (beta = 0)
  fxUSD: "0x085780639CC2cACd35E474e71f4D000e2405d8f6" as const,
  fxUSDRebalancer: "0x78c3aF23A4DeA2F630C130d2E42717587584BF05" as const,

  // Leverage Pools (collateral/fPOSITION)
  fstETH: "0xED803540037B0ae069c93420F89Cd653B6e3Df1f" as const,
  xstETH: "0xED803540037B0ae069c93420F89Cd653B6e3Df1f" as const,
  ffrxETH: "0xcfEEfF214b256063110d3236ea12Db49d2dF2359" as const,
  xfrxETH: "0xcfEEfF214b256063110d3236ea12Db49d2dF2359" as const,
  feETH: "0x781BA968d5cc0b40EB592D5c8a9a3A4000063885" as const,
  xeETH: "0x781BA968d5cc0b40EB592D5c8a9a3A4000063885" as const,
  fezETH: "0x38965311507D4E54973F81475a149c09376e241e" as const,
  xezETH: "0x38965311507D4E54973F81475a149c09376e241e" as const,
  fWBTC: "0x63Fe55B3fe3f74B42840788cFbe6229869590f83" as const,
  xWBTC: "0x63Fe55B3fe3f74B42840788cFbe6229869590f83" as const,

  // Price Oracles
  ethUsdOracle: "0x460B3CdE57DfbA90DBed02fd83d3990a92DA1230" as const,
  stEthUsdOracle: "0xD24AC180e6769Fd5F624e7605B93084171074A77" as const,
  btcUsdOracle: "0x82012139b29BC5Ac2ff4066832c836122bC6c690" as const,
} as const;

// ERC20 Token Addresses
export const TOKENS = {
  // Collateral Tokens
  stETH: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84" as const,
  WBTC: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599" as const,
  frxETH: "0x5E8422345178f8a519AeA0EBb53cd32eb8190B6E" as const,
  ezETH: "0xbf5495Efe5DB9ce00f80364C8B423567e58d2110" as const,
  eETH: "0x35f0Dc0b0762C75aA1bCB97221Feb496640B7784" as const,
} as const;

export type FxContractKey = keyof typeof FX_CONTRACTS;
export type TokenKey = keyof typeof TOKENS;
