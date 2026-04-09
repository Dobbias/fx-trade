/**
 * Unit tests for PositionPanel component
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PositionPanel } from "../../components/PositionPanel";
import { usePositions } from "@/lib/hooks/use-fx-protocol";

// Mock the wagmi useAccount hook
vi.mock("wagmi", () => ({
  useAccount: () => ({
    address: "0x1234567890123456789012345678901234567890",
  }),
}));

// Mock the usePositions hook
vi.mock("@/lib/hooks/use-fx-protocol", () => ({
  usePositions: vi.fn(),
}));

describe("PositionPanel", () => {
  it("should show loading state initially", () => {
    vi.mocked(usePositions).mockReturnValue({
      positions: [],
      totalValue: 0,
      totalPnL: 0,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(<PositionPanel />);
    expect(screen.getByText("Loading positions...")).toBeInTheDocument();
  });

  it("should show empty state when no positions", () => {
    vi.mocked(usePositions).mockReturnValue({
      positions: [],
      totalValue: 0,
      totalPnL: 0,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<PositionPanel />);
    expect(screen.getByText("No open positions")).toBeInTheDocument();
    expect(screen.getByText("Open a position to get started")).toBeInTheDocument();
  });

  it("should display positions when available", () => {
    const mockPositions = [
      {
        id: "test-position-1",
        type: "long" as const,
        asset: "stETH" as const,
        collateralAmount: 1000000000000000000n,
        fxUSDAmount: 2000000000000000000n,
        leverage: 2,
        valueUSD: 2000,
        pnlUSD: 100,
        pnlPercent: 5,
        liquidationPrice: 550,
      },
    ];

    vi.mocked(usePositions).mockReturnValue({
      positions: mockPositions,
      totalValue: 2000,
      totalPnL: 100,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<PositionPanel />);
    expect(screen.getByText("stETH")).toBeInTheDocument();
    expect(screen.getByText("2.0x")).toBeInTheDocument();
    expect(screen.getByText("+5.00%")).toBeInTheDocument();
  });

  it("should display error state", () => {
    vi.mocked(usePositions).mockReturnValue({
      positions: [],
      totalValue: 0,
      totalPnL: 0,
      isLoading: false,
      error: new Error("Failed to fetch"),
      refetch: vi.fn(),
    });

    render(<PositionPanel />);
    expect(screen.getByText(/Failed to load positions/)).toBeInTheDocument();
  });

  it("should display formatted collateral amount", () => {
    const mockPositions = [
      {
        id: "test-position-1",
        type: "long" as const,
        asset: "stETH" as const,
        collateralAmount: 1500000000000000000n, // 1.5 stETH
        fxUSDAmount: 3000000000000000000n,
        leverage: 2,
        valueUSD: 3000,
        pnlUSD: 0,
        pnlPercent: 0,
        liquidationPrice: 550,
      },
    ];

    vi.mocked(usePositions).mockReturnValue({
      positions: mockPositions,
      totalValue: 3000,
      totalPnL: 0,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<PositionPanel />);
    expect(screen.getByText("1.5 stETH")).toBeInTheDocument();
  });
});
