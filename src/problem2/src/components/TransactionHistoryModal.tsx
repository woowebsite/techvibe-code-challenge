import { X, ArrowRight, CheckCircle2, Trash2 } from 'lucide-react';
import { SwapTransaction } from '../types/token';
import { TokenIcon } from './TokenIcon';
import { formatAmount, truncateHash } from '../utils/formatters';

interface TransactionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: SwapTransaction[];
  onClearHistory: () => void;
}

export function TransactionHistoryModal({
  isOpen,
  onClose,
  transactions,
  onClearHistory,
}: TransactionHistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh] animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-medium">
              {transactions.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {transactions.length > 0 && (
              <button
                onClick={onClearHistory}
                className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                title="Clear History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {transactions.length === 0 ? (
            <div className="py-16 text-center text-zinc-500">
              <div className="w-12 h-12 rounded-full bg-zinc-800/80 flex items-center justify-center mx-auto mb-3 text-zinc-500">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-zinc-400">
                No transactions yet
              </p>
              <p className="text-xs text-zinc-600 mt-1">
                Your completed swaps will appear here
              </p>
            </div>
          ) : (
            transactions.map((tx) => {
              const dateStr = new Date(tx.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              });

              return (
                <div
                  key={tx.id}
                  className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700/80 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    {/* From -> To */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <TokenIcon symbol={tx.fromCurrency} size="sm" />
                        <span className="font-bold text-white text-sm">
                          {formatAmount(tx.fromAmount)} {tx.fromCurrency}
                        </span>
                      </div>

                      <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />

                      <div className="flex items-center gap-1">
                        <TokenIcon symbol={tx.toCurrency} size="sm" />
                        <span className="font-bold text-emerald-400 text-sm">
                          {formatAmount(tx.toAmount)} {tx.toCurrency}
                        </span>
                      </div>
                    </div>

                    {/* Status badge */}
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      Success
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-900 text-xs text-zinc-500">
                    <span className="font-mono">{truncateHash(tx.txHash)}</span>
                    <span>{dateStr}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
