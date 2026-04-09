/**
 * Unit tests for f(x) Protocol library functions
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  formatTokenAmount,
  formatUSD,
  calculateLiquidationPrice,
  NetworkError,
} from "../fx-protocol";

describe("formatTokenAmount", () => {
  it("should format whole number amounts correctly", () => {
    expect(formatTokenAmount(1000000000000000000n, 18)).toBe("1");
    expect(formatTokenAmount(5000000000000000000n, 18)).toBe("5");
  });

  it("should format fractional amounts correctly", () => {
    expect(formatTokenAmount(1500000000000000000n, 18)).toBe("1.5");
    expect(formatTokenAmount(1234567890000000000n, 18)).toBe("1.2345");
    expect(formatTokenAmount(1000000000000000n, 18)).toBe("0.001");
  });

  it("should trim trailing zeros", () => {
    expect(formatTokenAmount(1000100000000000000n, 18)).toBe("1.0001");
    expect(formatTokenAmount(1000000000000000000n, 18)).toBe("1");
  });

  it("should handle different decimals", () => {
    expect(formatTokenAmount(100000000n, 8)).toBe("1");
    expect(formatTokenAmount(150000000n, 8)).toBe("1.5");
    expect(formatTokenAmount(12345678n, 8)).toBe("0.1234");
  });

  it("should handle zero amounts", () => {
    expect(formatTokenAmount(0n, 18)).toBe("0");
  });

  it("should respect maxDecimals parameter", () => {
    expect(formatTokenAmount(1234567890000000000n, 18, 2)).toBe("1.23");
    expect(formatTokenAmount(1234567890000000000n, 18, 6)).toBe("1.234567");
  });
});

describe("formatUSD", () => {
  it("should format USD values correctly", () => {
    expect(formatUSD(1000)).toBe("$1,000.00");
    expect(formatUSD(1234.56)).toBe("$1,234.56");
    expect(formatUSD(0.99)).toBe("$0.99");
    expect(formatUSD(1000000)).toBe("$1,000,000.00");
  });

  it("should handle negative values", () => {
    expect(formatUSD(-100)).toBe("-$100.00");
    expect(formatUSD(-1234.56)).toBe("-$1,234.56");
  });

  it("should handle zero", () => {
    expect(formatUSD(0)).toBe("$0.00");
  });
});

describe("calculateLiquidationPrice", () => {
  const MIN_COLLATERAL_RATIO = 1.1;

  it("should calculate liquidation price for long positions", () => {
    const entryPrice = 1000;
    const leverage = 2;

    // Long: liquidationPrice = entryPrice * MIN_COLLATERAL_RATIO / leverage
    // = 1000 * 1.1 / 2 = 550
    const result = calculateLiquidationPrice(entryPrice, leverage, true);
    expect(result).toBeCloseTo(550, 2);
  });

  it("should calculate liquidation price for short positions", () => {
    const entryPrice = 1000;
    const leverage = 2;

    // Short: liquidationPrice = entryPrice * (2 - MIN_COLLATERAL_RATIO / leverage)
    // = 1000 * (2 - 1.1 / 2) = 1000 * 1.45 = 1450
    const result = calculateLiquidationPrice(entryPrice, leverage, false);
    expect(result).toBeCloseTo(1450, 2);
  });

  it("should handle higher leverage for long positions", () => {
    const entryPrice = 1000;
    const leverage = 5;

    // Long: 1000 * 1.1 / 5 = 220
    const result = calculateLiquidationPrice(entryPrice, leverage, true);
    expect(result).toBeCloseTo(220, 2);
  });

  it("should handle 1x leverage", () => {
    const entryPrice = 1000;
    const leverage = 1;

    // Long at 1x: 1000 * 1.1 / 1 = 1100
    const longResult = calculateLiquidationPrice(entryPrice, leverage, true);
    expect(longResult).toBeCloseTo(1100, 2);

    // Short at 1x: 1000 * (2 - 1.1 / 1) = 1000 * 0.9 = 900
    const shortResult = calculateLiquidationPrice(entryPrice, leverage, false);
    expect(shortResult).toBeCloseTo(900, 2);
  });
});

describe("NetworkError", () => {
  it("should create NetworkError with message", () => {
    const error = new NetworkError("Network error occurred");
    expect(error.message).toBe("Network error occurred");
    expect(error.name).toBe("NetworkError");
    expect(error.cause).toBeUndefined();
  });

  it("should create NetworkError with cause", () => {
    const cause = new Error("Underlying RPC error");
    const error = new NetworkError("Network error occurred", cause);
    expect(error.message).toBe("Network error occurred");
    expect(error.cause).toBe(cause);
  });

  it("should be instanceof Error", () => {
    const error = new NetworkError("Network error occurred");
    expect(error instanceof Error).toBe(true);
    expect(error instanceof NetworkError).toBe(true);
  });
});
