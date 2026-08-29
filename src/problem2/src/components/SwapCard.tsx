import { useState, useMemo, useCallback, memo } from 'react';
import { ArrowDownUp, Sparkles, ArrowRightLeft } from 'lucide-react';
import { Token, SwapField } from '@/types/token';
import { TokenInput } from '@/components/TokenInput';
import { SwapDetails } from '@/components/SwapDetails';
import { SlippageSettings } from '@/components/SlippageSettings';
import { TokenSelectModal } from '@/components/TokenSelectModal';
import { ConfirmSwapModal } from '@/components/ConfirmSwapModal';
import { DEFAULT_SLIPPAGE, DEFAULT_QUICK_PAIRS } from '@/constants/swap';

interface SwapCardProps {
  tokens: Token[];
  isLoadingPrices: boolean;
  getBalance: (currency: string) => number;
  onExecuteSwap: (
    fromCurrency: string,
    fromAmount: number,
    toCurrency: string,
    toAmount: number,
    rate: number,
    slippage: number,
    txHash: string
  ) => void;
}

function SwapCardComponent({
  tokens,
  isLoadingPrices,
  getBalance,
  onExecuteSwap,
}: SwapCardProps) {
  const [fromCurrency, setFromCurrency] = useState<string>('ETH');
  const [toCurrency, setToCurrency] = useState<string>('USDC');

  const [activeAmount, setActiveAmount] = useState<string>('');
  const [activeField, setActiveField] = useState<SwapField>('from');

  const [slippage, setSlippage] = useState<number>(DEFAULT_SLIPPAGE);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Modals
  const [modalField, setModalField] = useState<SwapField | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Animation state for swap button flip
  const [isFlipping, setIsFlipping] = useState(false);

  // O(1) Token Map lookup cache for instantaneous resolution
  const tokensMap = useMemo(
    () => new Map<string, Token>(tokens.map((t) => [t.currency, t])),
    [tokens]
  );

  // Derive tokens directly from tokensMap during render
  const fromToken = useMemo(() => {
    if (tokens.length === 0) return undefined;
    return tokensMap.get(fromCurrency) || tokens[0];
  }, [tokens, tokensMap, fromCurrency]);

  const toToken = useMemo(() => {
    if (tokens.length === 0) return undefined;
    const found = tokensMap.get(toCurrency);
    if (found) return found;
    return tokens.find((t) => t.currency !== fromCurrency) || tokens[1] || tokens[0];
  }, [tokens, tokensMap, toCurrency, fromCurrency]);

  // Derived two-way conversion amounts
  const { fromAmount, toAmount } = useMemo(() => {
    if (!fromToken || !toToken || fromToken.price <= 0 || toToken.price <= 0) {
      return { fromAmount: '', toAmount: '' };
    }

    if (activeField === 'from') {
      const numFrom = parseFloat(activeAmount);
      if (isNaN(numFrom) || numFrom <= 0) {
        return { fromAmount: activeAmount, toAmount: '' };
      }
      const calculatedTo = (numFrom * fromToken.price) / toToken.price;
      const formatted = parseFloat(calculatedTo.toFixed(6)).toString();
      return { fromAmount: activeAmount, toAmount: formatted };
    } else {
      const numTo = parseFloat(activeAmount);
      if (isNaN(numTo) || numTo <= 0) {
        return { fromAmount: '', toAmount: activeAmount };
      }
      const calculatedFrom = (numTo * toToken.price) / fromToken.price;
      const formatted = parseFloat(calculatedFrom.toFixed(6)).toString();
      return { fromAmount: formatted, toAmount: activeAmount };
    }
  }, [activeAmount, activeField, fromToken, toToken]);

  // Handle Token Flip / Invert with memoized callback
  const handleFlipTokens = useCallback(() => {
    setIsFlipping(true);
    setTimeout(() => setIsFlipping(false), 400);

    setFromCurrency((prevFrom) => {
      setToCurrency(prevFrom);
      return toCurrency;
    });
  }, [toCurrency]);

  // Handle Token Selection with memoized callback
  const handleSelectToken = useCallback(
    (token: Token) => {
      if (modalField === 'from') {
        if (token.currency === toCurrency) {
          setToCurrency(fromCurrency);
        }
        setFromCurrency(token.currency);
      } else if (modalField === 'to') {
        if (token.currency === fromCurrency) {
          setFromCurrency(toCurrency);
        }
        setToCurrency(token.currency);
      }
      setModalField(null);
    },
    [modalField, fromCurrency, toCurrency]
  );

  // Validation logic
  const fromBalance = fromToken ? getBalance(fromToken.currency) : 0;
  const toBalance = toToken ? getBalance(toToken.currency) : 0;
  const numFromAmount = parseFloat(fromAmount) || 0;

  const validation = useMemo(() => {
    if (!fromToken || !toToken) {
      return { isValid: false, buttonText: 'Select a token', error: null };
    }
    if (!fromAmount || numFromAmount <= 0) {
      return { isValid: false, buttonText: 'Enter an amount', error: null };
    }
    if (numFromAmount > fromBalance) {
      return {
        isValid: false,
        buttonText: `Insufficient ${fromToken.currency} Balance`,
        error: `Insufficient balance (You have ${fromBalance} ${fromToken.currency})`,
      };
    }
    return { isValid: true, buttonText: 'Swap Now', error: null };
  }, [fromToken, toToken, fromAmount, numFromAmount, fromBalance]);

  const handleConfirmSuccess = useCallback(
    (txHash: string) => {
      if (fromToken && toToken) {
        const rate = fromToken.price / toToken.price;
        onExecuteSwap(
          fromToken.currency,
          parseFloat(fromAmount),
          toToken.currency,
          parseFloat(toAmount),
          rate,
          slippage,
          txHash
        );
        setActiveAmount('');
      }
    },
    [fromToken, toToken, fromAmount, toAmount, slippage, onExecuteSwap]
  );

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Ambient glow container */}
      <div className="relative">
        <div className="glow-backdrop" />

        {/* Swap Card Body */}
        <div className="relative glass-panel rounded-[32px] p-5 sm:p-7 shadow-2xl">
          {/* Card Top Title & Controls */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">Swap Assets</h2>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 bg-indigo-950/60 border border-indigo-500/30 px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-indigo-300" />
                Zero Slippage Router
              </span>
            </div>

            <SlippageSettings
              slippage={slippage}
              onSlippageChange={setSlippage}
              isOpen={isSettingsOpen}
              onToggle={() => setIsSettingsOpen((prev) => !prev)}
            />
          </div>

          {/* Swap Inputs Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (validation.isValid) setIsConfirmOpen(true);
            }}
            className="space-y-2"
          >
            {/* Pay / From Input */}
            <TokenInput
              label="You Pay"
              token={fromToken}
              amount={fromAmount}
              onChangeAmount={(val) => {
                setActiveField('from');
                setActiveAmount(val);
              }}
              onSelectTokenClick={() => setModalField('from')}
              balance={fromBalance}
              isPayField={true}
              isLoadingPrice={isLoadingPrices}
              error={validation.error}
            />

            {/* Invert / Flip Button */}
            <div className="relative flex justify-center -my-3 z-10">
              <button
                type="button"
                onClick={handleFlipTokens}
                className={`p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 hover:border-indigo-500/60 text-zinc-300 hover:text-white shadow-xl transition-all duration-300 active:scale-90 ${
                  isFlipping ? 'rotate-180 text-indigo-400' : ''
                }`}
                title="Swap Direction"
                aria-label="Switch token positions"
              >
                <ArrowDownUp className="w-4 h-4" />
              </button>
            </div>

            {/* Receive / To Input */}
            <TokenInput
              label="You Receive"
              token={toToken}
              amount={toAmount}
              onChangeAmount={(val) => {
                setActiveField('to');
                setActiveAmount(val);
              }}
              onSelectTokenClick={() => setModalField('to')}
              balance={toBalance}
              isPayField={false}
              isLoadingPrice={isLoadingPrices}
            />

            {/* Swap Details Accordion */}
            {fromToken && toToken && (
              <div className="pt-2">
                <SwapDetails
                  fromToken={fromToken}
                  toToken={toToken}
                  fromAmount={fromAmount}
                  toAmount={toAmount}
                  slippage={slippage}
                />
              </div>
            )}

            {/* Action Swap Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={!validation.isValid}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                  validation.isValid
                    ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30 hover:shadow-indigo-600/50 active:scale-[0.98]'
                    : 'bg-zinc-800/80 text-zinc-500 border border-zinc-800 cursor-not-allowed'
                }`}
              >
                {validation.isValid && <ArrowRightLeft className="w-4 h-4" />}
                <span>{validation.buttonText}</span>
              </button>
            </div>
          </form>

          {/* Quick Popular Pairs Footer */}
          <div className="mt-5 pt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
            <span className="text-[11px] font-semibold text-zinc-400">Quick Pairs:</span>
            <div className="flex gap-2">
              {DEFAULT_QUICK_PAIRS.map(([pairFrom, pairTo]) => (
                <button
                  key={`${pairFrom}-${pairTo}`}
                  type="button"
                  onClick={() => {
                    setFromCurrency(pairFrom);
                    setToCurrency(pairTo);
                  }}
                  className="px-2 py-1 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-[11px] font-medium text-zinc-300 hover:text-white transition-all"
                >
                  {pairFrom}/{pairTo}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Token Select Modal */}
      <TokenSelectModal
        isOpen={modalField !== null}
        onClose={() => setModalField(null)}
        onSelect={handleSelectToken}
        tokens={tokens}
        selectedToken={modalField === 'from' ? fromToken : toToken}
        otherToken={modalField === 'from' ? toToken : fromToken}
        getBalance={getBalance}
      />

      {/* Confirmation Modal */}
      {fromToken && toToken && (
        <ConfirmSwapModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          fromToken={fromToken}
          toToken={toToken}
          fromAmount={fromAmount}
          toAmount={toAmount}
          slippage={slippage}
          onConfirm={handleConfirmSuccess}
        />
      )}
    </div>
  );
}

export const SwapCard = memo(SwapCardComponent);
