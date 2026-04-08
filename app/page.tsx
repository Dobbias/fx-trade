import { ConnectButton } from "@/components/ConnectButton";
import { TradingInterface } from "@/components/TradingInterface";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">fx</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">f(x) Protocol</h1>
              <p className="text-xs text-slate-400">Trading Interface</p>
            </div>
          </div>
          <ConnectButton />
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <TradingInterface />
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 backdrop-blur-sm mt-8">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-slate-400">
          <p>
            Powered by{" "}
            <a
              href="https://fxprotocol.gitbook.io/fx-docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              f(x) Protocol
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
