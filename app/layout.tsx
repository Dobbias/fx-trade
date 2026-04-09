import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "f(x) Protocol | Professional DeFi Trading",
  description: "Advanced leveraged trading on f(x) Protocol. Up to 10x leverage on ETH and BTC with minimal liquidation risk.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <Providers>
          {/* Grain texture overlay */}
          <div className="grain-overlay" aria-hidden="true" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
