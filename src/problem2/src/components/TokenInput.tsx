import { ChevronDown, Wallet } from 'lucide-react';
import { Token } from '@/types/token';
import { TokenIcon } from '@/components/TokenIcon';
import { formatCurrency, formatAmount, formatNumberInput } from '@/utils/formatters';

interface TokenInputProps {
  label: string;
  token?: Token;
  amount: string;
  onChangeAmount?: (value: string) => void;
  onSelectTokenClick: () => void;
  balance: number;
  isReadOnly?: boolean;
  isPayField?: boolean;
  isLoadingPrice?: boolean;
  error?: string | null;
}

export function TokenInput({
  label,
  token,
  amount,
  onChangeAmount,
  onSelectTokenClick,
  balance,
  isReadOnly = false,
  isPayField = false,
  isLoadingPrice = false,
  error,
}: TokenInputProps) {
  const numericAmount = parseFloat(amount) || 0;
  const estimatedUsd = token ? numericAmount * token.price : 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isReadOnly || !onChangeAmount) return;
    const formatted = formatNumberInput(e.target.value);
    onChangeAmount(formatted);
  };

  const handleQuickPercent = (percent: number) => {
    if (!onChangeAmount || balance <= 0) return;
    const targetAmount = (balance * percent) / 100;
    // Format to 6 decimals cleanly
    const rounded = parseFloat(targetAmount.toFixed(6)).toString();
    onChangeAmount(rounded);
  };

  return (
    <div
      className={`relative p-4 rounded-3xl transition-all border ${
        error
          ? 'bg-rose-950/20 border-rose-500/50 shadow-inner'
          : 'bg-zinc-900/90 border-zinc-800/80 hover:border-zinc-700/80 focus-within:border-indigo-500/80 focus-within:ring-1 focus-within:ring-indigo-500/30'
      }`}
    >
      {/* Top row: Label & Balance / Quick buttons */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          {label}
        </span>

        {token && (
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1 text-zinc-400">
              <Wallet className="w-3.5 h-3.5 text-zinc-500" />
              <span>Balance:</span>
              <span className="font-semibold text-zinc-200">
                {formatAmount(balance)}
              </span>
            </div>

            {/* Quick buttons only for Pay / From input */}
            {isPayField && balance > 0 && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleQuickPercent(50)}
                  className="px-2 py-0.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 font-medium text-[11px] transition-colors"
                >
                  50%
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPercent(100)}
                  className="px-2 py-0.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 font-semibold text-[11px] transition-colors"
                >
                  MAX
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main input row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <input
            type="text"
            inputMode="decimal"
            autoComplete="off"
            autoCorrect="off"
            pattern="^[0-9]*[.,]?[0-9]*$"
            placeholder="0.0"
            value={amount}
            onChange={handleInputChange}
            readOnly={isReadOnly}
            className={`w-full bg-transparent text-2xl md:text-3xl font-bold text-white placeholder-zinc-600 focus:outline-none truncate ${
              isReadOnly ? 'cursor-default' : ''
            }`}
          />
        </div>

        {/* Token Selector Trigger Button */}
        <button
          type="button"
          onClick={onSelectTokenClick}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-zinc-800/90 hover:bg-zinc-750 border border-zinc-700/60 hover:border-zinc-600 text-white font-bold transition-all shadow-md active:scale-95 shrink-0"
        >
          {token ? (
            <>
              <TokenIcon symbol={token.currency} size="md" />
              <span className="text-sm font-bold tracking-wide">
                {token.currency}
              </span>
            </>
          ) : (
            <span className="text-sm font-semibold text-indigo-400">
              Select Token
            </span>
          )}
          <ChevronDown className="w-4 h-4 text-zinc-400" />
        </button>
      </div>

      {/* Bottom row: USD value equivalent & error / status */}
      <div className="flex items-center justify-between mt-2 pt-1">
        <div className="text-xs text-zinc-400 font-medium truncate">
          {isLoadingPrice ? (
            <span className="animate-pulse">Calculating USD value...</span>
          ) : (
            <span>≈ {formatCurrency(estimatedUsd)}</span>
          )}
        </div>

        {error && (
          <span className="text-xs font-semibold text-rose-400 animate-fade-in">
            {error}
          </span>
        )}
      </div>
    </div>
  );
}
