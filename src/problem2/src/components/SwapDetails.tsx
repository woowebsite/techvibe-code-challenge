import { useState, memo, useMemo } from 'react';
import {
  ArrowLeftRight,
  ChevronDown,
  ChevronUp,
  Fuel,
  Route,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Token } from '@/types/token';
import { formatAmount } from '@/utils/formatters';
import { ESTIMATED_GAS_FEE_USD } from '@/constants/swap';

interface SwapDetailsProps {
  fromToken?: Token;
  toToken?: Token;
  fromAmount: string;
  toAmount: string;
  slippage: number;
}

function SwapDetailsComponent({
  fromToken,
  toToken,
  fromAmount,
  toAmount,
  slippage,
}: SwapDetailsProps) {
  const [isInverted, setIsInverted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const calculations = useMemo(() => {
    if (!fromToken || !toToken || !fromAmount || parseFloat(fromAmount) <= 0) {
      return null;
    }

    const rate = fromToken.price / toToken.price;
    const invertedRate = toToken.price / fromToken.price;
    const parsedToAmount = parseFloat(toAmount) || 0;
    const minReceived = parsedToAmount * (1 - slippage / 100);

    const numFromAmount = parseFloat(fromAmount) || 0;
    const tradeValue = numFromAmount * fromToken.price;
    let priceImpact = 0.02;
    if (tradeValue > 10000) priceImpact = 0.45;
    else if (tradeValue > 2000) priceImpact = 0.18;
    else if (tradeValue > 500) priceImpact = 0.08;

    return {
      rate,
      invertedRate,
      minReceived,
      priceImpact,
    };
  }, [fromToken, toToken, fromAmount, toAmount, slippage]);

  if (!fromToken || !toToken || !calculations) {
    return null;
  }

  const { rate, invertedRate, minReceived, priceImpact } = calculations;

  return (
    <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-3.5 transition-all text-xs">
      {/* Rate Banner */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsInverted((prev) => !prev)}
          className="flex items-center gap-1.5 text-zinc-300 hover:text-white font-medium transition-colors group"
        >
          <Zap className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
          <span>
            {isInverted
              ? `1 ${toToken.currency} ≈ ${formatAmount(invertedRate, 6)} ${fromToken.currency}`
              : `1 ${fromToken.currency} ≈ ${formatAmount(rate, 6)} ${toToken.currency}`}
          </span>
          <ArrowLeftRight className="w-3 h-3 text-zinc-500 group-hover:text-indigo-400 ml-1 transition-colors" />
        </button>

        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <span>Details</span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-zinc-800 space-y-2 text-zinc-400 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Minimum Received
            </span>
            <span className="font-semibold text-zinc-200">
              {formatAmount(minReceived, 6)} {toToken.currency}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span>Price Impact</span>
            <span
              className={`font-semibold ${
                priceImpact < 0.1
                  ? 'text-emerald-400'
                  : priceImpact < 0.5
                    ? 'text-amber-400'
                    : 'text-rose-400'
              }`}
            >
              ~{priceImpact.toFixed(2)}%
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Fuel className="w-3.5 h-3.5 text-purple-400" />
              Est. Network Fee
            </span>
            <span className="font-semibold text-zinc-200">
              ~${ESTIMATED_GAS_FEE_USD.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Route className="w-3.5 h-3.5 text-indigo-400" />
              Routing
            </span>
            <span className="font-semibold text-indigo-300">
              {fromToken.currency} → Uniswap V3 → {toToken.currency}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export const SwapDetails = memo(SwapDetailsComponent);
