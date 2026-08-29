import { useState } from 'react';
import {
  Wallet,
  History,
  RotateCw,
  Sparkles,
  ChevronDown,
  RefreshCcw,
  CircleDot,
} from 'lucide-react';
import { WalletBalance } from '@/types/token';
import { formatAmount } from '@/utils/formatters';
import { ENV } from '@/config/env';

interface HeaderProps {
  onOpenHistory: () => void;
  txCount: number;
  balances: WalletBalance;
  onResetWallet: () => void;
  onRefreshPrices: () => void;
  isLoadingPrices: boolean;
  lastUpdated: Date | null;
}

export function Header({
  onOpenHistory,
  txCount,
  balances,
  onResetWallet,
  onRefreshPrices,
  isLoadingPrices,
  lastUpdated,
}: HeaderProps) {
  const [isWalletMenuOpen, setIsWalletMenuOpen] = useState(false);

  // Calculate total non-zero tokens
  const nonZeroBalances = Object.entries(balances).filter(([, bal]) => bal > 0);

  return (
    <header className="w-full max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-lg shadow-indigo-500/30">
          <Sparkles className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl tracking-tight text-white">
              {ENV.APP_NAME.slice(0, 4)}<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">{ENV.APP_NAME.slice(4) || 'Swap'}</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              DeFi v2
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 hidden sm:block">
            {ENV.APP_DESCRIPTION}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live Price Refresh Button */}
        <button
          onClick={onRefreshPrices}
          disabled={isLoadingPrices}
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-white transition-all shadow-sm"
          title={`Last updated: ${
            lastUpdated ? lastUpdated.toLocaleTimeString() : 'Loading'
          }`}
        >
          <RotateCw
            className={`w-3.5 h-3.5 text-indigo-400 ${
              isLoadingPrices ? 'animate-spin' : ''
            }`}
          />
          <span className="hidden md:inline">
            {isLoadingPrices ? 'Syncing...' : 'Live Rates'}
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </button>

        {/* Transaction History Button */}
        <button
          onClick={onOpenHistory}
          className="relative flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition-all shadow-sm"
          title="Transaction History"
        >
          <History className="w-4 h-4 text-purple-400" />
          <span className="hidden sm:inline">History</span>
          {txCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-indigo-600 text-[10px] text-white font-bold">
              {txCount}
            </span>
          )}
        </button>

        {/* Mock Wallet Button with Menu */}
        <div className="relative">
          <button
            onClick={() => setIsWalletMenuOpen(!isWalletMenuOpen)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 hover:from-indigo-900/60 hover:to-purple-900/60 border border-indigo-500/30 text-xs font-bold text-indigo-200 transition-all shadow-sm active:scale-95"
          >
            <Wallet className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Demo Wallet</span>
            <span className="font-mono text-zinc-400">0x99...F8e2</span>
            <ChevronDown className="w-3.5 h-3.5 text-indigo-300" />
          </button>

          {isWalletMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setIsWalletMenuOpen(false)}
              />
              <div className="absolute right-0 top-12 w-64 p-4 rounded-3xl bg-zinc-900 border border-zinc-700/80 shadow-2xl z-30 animate-scale-up">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <CircleDot className="w-3 h-3 text-emerald-400" />
                    <span>Connected Assets</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {nonZeroBalances.length} tokens
                  </span>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar text-xs">
                  {nonZeroBalances.map(([curr, bal]) => (
                    <div
                      key={curr}
                      className="flex justify-between items-center py-1 px-2 rounded-xl bg-zinc-950/60"
                    >
                      <span className="font-semibold text-zinc-300">{curr}</span>
                      <span className="font-mono text-zinc-400">
                        {formatAmount(bal, 4)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t border-zinc-800">
                  <button
                    onClick={() => {
                      onResetWallet();
                      setIsWalletMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-zinc-800 hover:bg-rose-950/50 hover:border-rose-500/40 border border-zinc-700/60 text-xs font-semibold text-zinc-300 hover:text-rose-300 transition-all"
                  >
                    <RefreshCcw className="w-3.5 h-3.5" />
                    <span>Reset Demo Balances</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
