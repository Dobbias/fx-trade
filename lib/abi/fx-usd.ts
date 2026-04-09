// ERC20 Standard ABI
export const ERC20_ABI = [
  // Read
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "owner", type: "address" }, { name: "spender", type: "address" }],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  // Write
  {
    inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

// f(x) Protocol Oracle ABI
export const ORACLE_ABI = [
  {
    inputs: [],
    name: "getPrice",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lastUpdateTime",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "updatePrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

// f(x) Protocol Leverage Pool ABI (for xPOSITION and sPOSITION)
export const LEVERAGE_POOL_ABI = [
  // Read
  {
    inputs: [],
    name: "totalAsset",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalFxUSD",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "", type: "address" }],
    name: "userStates",
    outputs: [
      { name: "collateralAmount", type: "uint256" },
      { name: "fxUSDAmount", type: "uint256" },
      { name: "lastUpdateTime", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "asset",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "fxUSD",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  // Write
  {
    inputs: [
      { name: "collateralAmount", type: "uint256" },
      { name: "minFxUSD", type: "uint256" },
    ],
    name: "deposit",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "fxUSDAmount", type: "uint256" },
      { name: "minCollateral", type: "uint256" },
    ],
    name: "withdraw",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

// f(x) Protocol Position Manager ABI
export const POSITION_MANAGER_ABI = [
  // Read
  {
    inputs: [{ name: "", type: "address" }],
    name: "userPositions",
    outputs: [
      { name: "collateral", type: "address" },
      { name: "collateralAmount", type: "uint256" },
      { name: "fxUSDAmount", type: "uint256" },
      { name: "leverage", type: "uint256" },
      { name: "isLong", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  // Write - Open Long Position (xPOSITION)
  {
    inputs: [
      { name: "collateral", type: "address" },
      { name: "collateralAmount", type: "uint256" },
      { name: "minFxUSD", type: "uint256" },
    ],
    name: "openXPosition",
    outputs: [{ name: "positionId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Write - Open Short Position (sPOSITION)
  {
    inputs: [
      { name: "fxUSDAmount", type: "uint256" },
      { name: "minCollateral", type: "uint256" },
    ],
    name: "openSPosition",
    outputs: [{ name: "positionId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Write - Close Position
  {
    inputs: [{ name: "positionId", type: "uint256" }],
    name: "closePosition",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

// f(x) Protocol Rebalancer ABI
export const REBALANCER_ABI = [
  {
    inputs: [],
    name: "isRebalancing",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lastRebalanceTime",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
