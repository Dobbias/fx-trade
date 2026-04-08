/**
 * Web3 Utilities for f(x) Protocol Integration
 */

import { createPublicClient, http, type Address } from "viem";
import { mainnet } from "viem/chains";

// Public client for read operations
export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

/**
 * Format a token amount with decimals
 */
export function formatTokenAmount(amount: bigint, decimals: number): string {
  const divisor = BigInt(10 ** decimals);
  const integerPart = amount / divisor;
  const fractionalPart = amount % divisor;

  if (fractionalPart === 0n) {
    return integerPart.toString();
  }

  // Pad fractional part with leading zeros
  const fractionalStr = fractionalPart.toString().padStart(decimals, "0");
  // Remove trailing zeros
  const trimmedFractional = fractionalStr.replace(/0+$/, "");

  return `${integerPart}.${trimmedFractional}`;
}

/**
 * Parse a token amount string to bigint
 */
export function parseTokenAmount(amount: string, decimals: number): bigint {
  const [integerStr, fractionalStr = ""] = amount.split(".");
  const integer = BigInt(integerStr || "0");
  const fractional = BigInt((fractionalStr || "0").padEnd(decimals, "0").slice(0, decimals));
  return integer * BigInt(10 ** decimals) + fractional;
}

/**
 * Format USD value with 2 decimal places
 */
export function formatUSD(value: bigint): string {
  const dollars = value / 10n ** 8n; // Assuming 8 decimals for USD
  const cents = (value % 10n ** 8n) / 10n ** 6n;
  return `$${dollars.toLocaleString()}.${cents.toString().padStart(2, "0")}`;
}

/**
 * Shorten an Ethereum address for display
 */
export function shortenAddress(address: Address, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Get price from f(x) oracle
 */
export async function getOraclePrice(oracleAddress: Address): Promise<bigint> {
  try {
    const price = await publicClient.readContract({
      address: oracleAddress,
      abi: [
        {
          constant: true,
          inputs: [],
          name: "getPrice",
          outputs: [{ name: "", type: "uint256" }],
          type: "function",
        },
      ] as const,
      functionName: "getPrice",
    });
    return price as bigint;
  } catch (error) {
    console.error("Error fetching oracle price:", error);
    return 0n;
  }
}

/**
 * Get token balance
 */
export async function getTokenBalance(
  tokenAddress: Address,
  userAddress: Address
): Promise<bigint> {
  try {
    const balance = await publicClient.readContract({
      address: tokenAddress,
      abi: [
        {
          constant: true,
          inputs: [{ name: "_owner", type: "address" }],
          name: "balanceOf",
          outputs: [{ name: "balance", type: "uint256" }],
          type: "function",
        },
      ] as const,
      functionName: "balanceOf",
      args: [userAddress],
    });
    return balance as bigint;
  } catch (error) {
    console.error("Error fetching token balance:", error);
    return 0n;
  }
}
