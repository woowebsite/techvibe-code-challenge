import { useState, useEffect, useMemo } from 'react';
import { ArrowDownUp, Sparkles, ArrowRightLeft } from 'lucide-react';
import { Token, SwapField } from '../types/token';
import { TokenInput } from './TokenInput';
import { SwapDetails } from './SwapDetails';
import { SlippageSettings } from './SlippageSettings';
import { TokenSelectModal } from './TokenSelectModal';
import { ConfirmSwapModal } from './ConfirmSwapModal';

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

export function SwapCard({
  tokens,
  isLoadingPrices,
  getBalance,
  onExecuteSwap,
}: SwapCardProps) {
  const [fromToken, setFromToken] = useState<Token | undefined>();
  const [toToken, setToToken] = useState<Token | undefined>();

  const [fromAmount, setFromAmount] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('');
  const [lastEditedField, setLastEditedField] = useState<SwapField>('from');

  const [slippage, setSlippage] = useState<number>(0.5);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Modals
  const [modalField, setModalField] = useState<SwapField | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Animation state for swap button flip
  const [isFlipping, setIsFlipping] = useState(false);

  // Initialize default tokens once tokens are loaded
  useEffect(() => {
    if (tokens.length > 0 && !fromToken && !toToken) {
      const defaultFrom = tokens.find((t) => t.currency === 'ETH') || tokens[0];
      const defaultTo =
        tokens.find((t) => t.currency === 'USDC') ||
        tokens.find((t) => t.currency !== defaultFrom.currency) ||
        tokens[1];

      setFromToken(defaultFrom);
      setToToken(defaultTo);
    }
  }, [tokens, fromToken, toToken]);

  // Keep token prices updated if background sync occurs
  useEffect(() => {
    if (tokens.length > 0) {
      if (fromToken) {
        const fresh = tokens.find((t) => t.currency === fromToken.currency);
        if (fresh && fresh.price !== fromToken.price) setFromToken(fresh);
      }
      if (toToken) {
        const fresh = tokens.find((t) => t.currency === toToken.currency);
        if (fresh && fresh.price !== toToken.price) setToToken(fresh);
      }
    }
  }, [tokens, fromToken, toToken]);

  // Dynamic Rate Calculation
  useEffect(() => {
    if (!fromToken || !toToken || fromToken.price <= 0 || toToken.price <= 0) return;

    if (lastEditedField === 'from') {
      const numFrom = parseFloat(fromAmount);
      if (isNaN(numFrom) || numFrom <= 0) {
        setToAmount('');
      } else {
        const calculatedTo = (numFrom * fromToken.price) / toToken.price;
        // Format to max 6 clean decimals
        const formatted = parseFloat(calculatedTo.toFixed(6)).toString();
        setToAmount(formatted);
      }
    } else {
      const numTo = parseFloat(toAmount);
      if (isNaN(numTo) || numTo <= 0) {
        setFromAmount('');
      } else {
        const calculatedFrom = (numTo * toToken.price) / fromToken.price;
        const formatted = parseFloat(calculatedFrom.toFixed(6)).toString();
        setFromAmount(formatted);
      }
    }
  }, [fromAmount, toAmount, fromToken, toToken, lastEditedField]);

  // Handle Token Flip / Invert
  const handleFlipTokens = () => {
    setIsFlipping(true);
    setTimeout(() => setIsFlipping(false), 400);

    const prevFromToken = fromToken;
    const prevToToken = toToken;
    const prevFromAmount = fromAmount;
    const prevToAmount = toAmount;

    setFromToken(prevToToken);
    setToToken(prevFromToken);
    setFromAmount(prevToAmount);
    setToAmount(prevFromAmount);
  };

  // Handle Token Selection
  const handleSelectToken = (token: Token) => {
    if (modalField === 'from') {
      if (toToken && token.currency === toToken.currency) {
        // Swap them if user picks the same
        setToToken(fromToken);
      }
      setFromToken(token);
    } else if (modalField === 'to') {
      if (fromToken && token.currency === fromToken.currency) {
        setFromToken(toToken);
      }
      setToToken(token);
    }
    setModalField(null);
  };

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

  const handleConfirmSuccess = (txHash: string) => {
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
      // Reset input amounts after successful swap
      setFromAmount('');
      setToAmount('');
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Glow ambient background container */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-[36px] blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 -z-10" />

        {/* Swap Card Body */}
        <div className="relative bg-zinc-950/90 backdrop-blur-2xl border border-zinc-800/90 rounded-[32px] p-5 sm:p-7 shadow-2xl">
          {/* Card Top Title & Controls */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Swap Assets
              </h2>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 bg-indigo-950/60 border border-indigo-500/30 px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-indigo-300" />
                Zero Slippage Router
              </span>
            </div>

            <SlippageSettings
              slippage={slippage}
              onSlippageChange={setSlippage}
              isOpen={isSettingsOpen}
              onToggle={() => setIsSettingsOpen(!isSettingsOpen)}
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
                setLastEditedField('from');
                setFromAmount(val);
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
                setLastEditedField('to');
                setToAmount(val);
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
              {[
                ['ETH', 'USDC'],
                ['WBTC', 'USDC'],
                ['ATOM', 'OSMO'],
                ['SWTH', 'USDC'],
              ].map(([pairFrom, pairTo]) => (
                <button
                  key={`${pairFrom}-${pairTo}`}
                  type="button"
                  onClick={() => {
                    const tokenA = tokens.find((t) => t.currency === pairFrom);
                    const tokenB = tokens.find((t) => t.currency === pairTo);
                    if (tokenA && tokenB) {
                      setFromToken(tokenA);
                      setToToken(tokenB);
                    }
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
