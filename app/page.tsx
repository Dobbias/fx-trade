import { ConnectButton } from "@/components/ConnectButton";
import { TradingInterface } from "@/components/TradingInterface";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background layers */}
      <div className="fixed inset-0 bg-grid opacity-40" aria-hidden="true" />
      <div className="fixed inset-0 bg-grid-radial" aria-hidden="true" />

      {/* Animated gradient orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#09090b]/80 border-b border-white/[0.06]">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-20">
              {/* Logo */}
              <div className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
                    <span className="text-white font-bold text-lg">fx</span>
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-semibold text-white tracking-tight">f(x) Protocol</h1>
                  <p className="text-xs text-zinc-500 font-medium">Professional Trading</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                <a href="#" className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]">
                  Trade
                </a>
                <a href="#" className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]">
                  Portfolio
                </a>
                <a href="#" className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]">
                  Docs
                </a>
              </nav>

              {/* Connect button */}
              <ConnectButton />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 lg:px-8 py-6 lg:py-10">
          <TradingInterface />
        </div>

        {/* Footer */}
        <footer className="border-t border-white/[0.06] mt-12 lg:mt-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="py-6 lg:py-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-6 text-sm text-zinc-500">
                  <span className="font-medium">f(x) Protocol</span>
                  <a
                    href="https://fxprotocol.gitbook.io/fx-docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-zinc-300 transition-colors flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Documentation
                  </a>
                  <a
                    href="https://github.com/Dobbias/fx-trade"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-zinc-300 transition-colors flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    GitHub
                  </a>
                </div>
                <p className="text-xs text-zinc-600">
                  © 2024 f(x) Protocol. Trade responsibly.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
