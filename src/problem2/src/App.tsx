import { useState } from 'react';
import { usePrices } from '@/hooks/usePrices';
import { useWallet } from '@/hooks/useWallet';
import { Header } from '@/components/Header';
import { SwapCard } from '@/components/SwapCard';
import { TransactionHistoryModal } from '@/components/TransactionHistoryModal';
import { TokenIcon } from '@/components/TokenIcon';
import { formatCurrency } from '@/utils/formatters';
import { Shield, Zap, TrendingUp, AlertCircle } from 'lucide-react';

export default function App() {
  const { tokens, isLoading, error, lastUpdated, refreshPrices } = usePrices();
  const { balances, transactions, getBalance, executeSwap, resetWallet } = useWallet();

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Top tokens for the ticker
  const tickerTokens = tokens
    .filter((t) => ['ETH', 'WBTC', 'USDC', 'ATOM', 'OSMO', 'GMX', 'SWTH'].includes(t.currency))
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-indigo-500 selection:text-white relative overflow-hidden font-sans">
      {/* Dynamic Background Glow Orbs */}
      <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none -z-0 animate-pulse" />
      <div className="absolute top-[30%] right-[15%] w-[450px] h-[450px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none -z-0" />
      <div className="absolute bottom-[-10%] left-[30%] w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[160px] pointer-events-none -z-0" />

      {/* Navigation Header */}
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        txCount={transactions.length}
        balances={balances}
        onResetWallet={resetWallet}
        onRefreshPrices={refreshPrices}
        isLoadingPrices={isLoading}
        lastUpdated={lastUpdated}
      />

      {/* Main App Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative z-10">
        {/* Error notification banner if API fetch failed and using fallback */}
        {error && (
          <div className="mb-6 max-w-lg w-full p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Live price API unreachable. Using cached offline pricing.</span>
            </div>
            <button
              onClick={refreshPrices}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {/* Live Market Price Ticker */}
        {tickerTokens.length > 0 && (
          <div className="mb-8 w-full max-w-2xl overflow-x-auto no-scrollbar py-1">
            <div className="flex items-center justify-center gap-3 min-w-max">
              {tickerTokens.map((token) => (
                <div
                  key={token.currency}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 text-xs shadow-sm hover:border-zinc-700 transition-colors"
                >
                  <TokenIcon symbol={token.currency} size="sm" />
                  <span className="font-bold text-zinc-200">{token.currency}</span>
                  <span className="text-zinc-400 font-mono">
                    {formatCurrency(token.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Swap Card */}
        <SwapCard
          tokens={tokens}
          isLoadingPrices={isLoading}
          getBalance={getBalance}
          onExecuteSwap={executeSwap}
        />

        {/* Value Proposition Highlights */}
        <div className="mt-12 w-full max-w-2xl grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 hover:border-zinc-700/60 transition-all">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-2.5">
              <Zap className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Instant Execution</h4>
            <p className="text-xs text-zinc-400">
              Optimal route matching across liquidity pools with zero delay.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 hover:border-zinc-700/60 transition-all">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-2.5">
              <Shield className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Slippage Guard</h4>
            <p className="text-xs text-zinc-400">
              Guaranteed minimum received amount protects against front-running.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 hover:border-zinc-700/60 transition-all">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-2.5">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Best Rates</h4>
            <p className="text-xs text-zinc-400">
              Real-time market prices synced continuously with multi-asset feed.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto px-4 py-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Switcheo Price Oracle Connected</span>
        </div>
        <div>
          <span>Designed with Vite, React & Tailwind CSS for TechVibe Challenge</span>
        </div>
      </footer>

      {/* Transaction History Modal */}
      <TransactionHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        transactions={transactions}
        onClearHistory={() => {
          // Clear history by resetting transactions
          localStorage.removeItem('fancy_swap_tx_history_v1');
          window.location.reload();
        }}
      />
    </div>
  );
}
