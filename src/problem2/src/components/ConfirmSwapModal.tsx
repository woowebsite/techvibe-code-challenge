import { useState, useEffect } from 'react';
import {
  X,
  ArrowDown,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Loader2,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Token } from '../types/token';
import { TokenIcon } from './TokenIcon';
import {
  formatCurrency,
  formatAmount,
  generateTxHash,
  truncateHash,
} from '../utils/formatters';

interface ConfirmSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  toAmount: string;
  slippage: number;
  onConfirm: (txHash: string) => void;
}

type SwapStep = 'review' | 'submitting' | 'success';

export function ConfirmSwapModal({
  isOpen,
  onClose,
  fromToken,
  toToken,
  fromAmount,
  toAmount,
  slippage,
  onConfirm,
}: ConfirmSwapModalProps) {
  const [step, setStep] = useState<SwapStep>('review');
  const [txHash, setTxHash] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep('review');
      setTxHash(generateTxHash());
      setCopied(false);
    }
  }, [isOpen]);

  const handleConfirmSwap = () => {
    setStep('submitting');

    // Simulate blockchain confirmation delay
    setTimeout(() => {
      setStep('success');
      onConfirm(txHash);

      // Trigger Confetti effect
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#a855f7', '#ec4899', '#3b82f6', '#10b981'],
        });
      } catch {
        // Fallback
      }
    }, 1800);
  };

  const handleCopyHash = () => {
    if (!txHash) return;
    navigator.clipboard.writeText(txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  const numFromAmount = parseFloat(fromAmount) || 0;
  const numToAmount = parseFloat(toAmount) || 0;
  const rate = fromToken.price / toToken.price;
  const minReceived = numToAmount * (1 - slippage / 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={step === 'submitting' ? undefined : onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden z-10 p-6 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <h3 className="text-lg font-bold text-white">
            {step === 'review' && 'Confirm Swap'}
            {step === 'submitting' && 'Swapping Assets...'}
            {step === 'success' && 'Transaction Submitted'}
          </h3>
          {step !== 'submitting' && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* STEP 1: REVIEW */}
        {step === 'review' && (
          <div className="mt-5 space-y-4">
            {/* From Token Summary */}
            <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TokenIcon symbol={fromToken.currency} size="lg" />
                <div>
                  <div className="text-xs text-zinc-400 font-medium">You Pay</div>
                  <div className="text-base font-bold text-white">
                    {formatAmount(numFromAmount)} {fromToken.currency}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-zinc-500 font-medium">
                  {formatCurrency(numFromAmount * fromToken.price)}
                </div>
              </div>
            </div>

            {/* Divider Arrow */}
            <div className="flex justify-center -my-2">
              <div className="p-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 shadow-md">
                <ArrowDown className="w-4 h-4" />
              </div>
            </div>

            {/* To Token Summary */}
            <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TokenIcon symbol={toToken.currency} size="lg" />
                <div>
                  <div className="text-xs text-zinc-400 font-medium">
                    You Receive (estimated)
                  </div>
                  <div className="text-base font-bold text-emerald-400">
                    {formatAmount(numToAmount)} {toToken.currency}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-zinc-500 font-medium">
                  {formatCurrency(numToAmount * toToken.price)}
                </div>
              </div>
            </div>

            {/* Breakdown Parameters */}
            <div className="p-4 rounded-2xl bg-zinc-800/40 border border-zinc-800 text-xs space-y-2 text-zinc-400">
              <div className="flex justify-between">
                <span>Exchange Rate</span>
                <span className="font-semibold text-zinc-200">
                  1 {fromToken.currency} = {formatAmount(rate, 6)} {toToken.currency}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Slippage Tolerance</span>
                <span className="font-semibold text-zinc-200">{slippage}%</span>
              </div>
              <div className="flex justify-between">
                <span>Minimum Received</span>
                <span className="font-semibold text-zinc-200">
                  {formatAmount(minReceived, 6)} {toToken.currency}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Network Gas Fee</span>
                <span className="font-semibold text-zinc-200">~$1.35</span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-500 text-center leading-relaxed">
              Output is estimated. You will receive at least{' '}
              <span className="text-zinc-300 font-medium">
                {formatAmount(minReceived, 4)} {toToken.currency}
              </span>{' '}
              or the transaction will revert.
            </p>

            <button
              onClick={handleConfirmSwap}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base shadow-lg shadow-indigo-500/25 active:scale-[0.99] transition-all"
            >
              Confirm Swap
            </button>
          </div>
        )}

        {/* STEP 2: SUBMITTING */}
        {step === 'submitting' && (
          <div className="py-10 text-center space-y-5 animate-fade-in">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
              <Loader2 className="w-8 h-8 text-indigo-400 absolute" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-base font-bold text-white">
                Swapping {formatAmount(numFromAmount)} {fromToken.currency} for{' '}
                {formatAmount(numToAmount)} {toToken.currency}
              </h4>
              <p className="text-xs text-zinc-400">
                Broadcasting to the network... Please wait.
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS */}
        {step === 'success' && (
          <div className="mt-5 space-y-5 text-center animate-scale-up">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold text-lg">
                <Sparkles className="w-5 h-5" />
                <span>Swap Successful!</span>
              </div>
              <p className="text-xs text-zinc-400">
                You swapped {formatAmount(numFromAmount)} {fromToken.currency} for{' '}
                <strong className="text-white">
                  {formatAmount(numToAmount)} {toToken.currency}
                </strong>
              </p>
            </div>

            {/* Transaction Hash */}
            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs flex items-center justify-between">
              <div className="text-left">
                <div className="text-[10px] text-zinc-500 uppercase font-semibold">
                  Transaction Hash
                </div>
                <div className="font-mono text-zinc-300">
                  {truncateHash(txHash)}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopyHash}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                  title="Copy Hash"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <a
                  href={`https://etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                  title="View on Explorer"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-sm transition-all"
            >
              Done / Swap Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
