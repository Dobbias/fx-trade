/**
 * f(x) Protocol Contract ABIs
 * Minimal ABI definitions for key contract interactions
 */

// ERC20 Standard ABI
export const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
] as const;

// Oracle ABI for reading prices
export const ORACLE_ABI = [
  {
    constant: true,
    inputs: [],
    name: "getPrice",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "updatePrice",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
] as const;

// fxUSD ABI
export const FXUSD_ABI = [
  {
    constant: true,
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
] as const;

// f(x) Position Manager ABI (for opening/closing positions)
export const POSITION_MANAGER_ABI = [
  {
    inputs: [
      { name: "collateral", type: "address" },
      { name: "collateralAmount", type: "uint256" },
      { name: "minFxUSD", type: "uint256" },
    ],
    name: "openXPosition",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "fxUSD", type: "address" },
      { name: "fxUSDAmount", type: "uint256" },
    ],
    name: "openSPosition",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "positionId", type: "uint256" },
      { name: "closeAmount", type: "uint256" },
    ],
    name: "closePosition",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
