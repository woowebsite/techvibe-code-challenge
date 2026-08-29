import { useState, useMemo, useEffect, useRef, useCallback, memo } from 'react';
import { Search, X, Check, Sparkles } from 'lucide-react';
import { Token } from '@/types/token';
import { TokenIcon } from '@/components/TokenIcon';
import { formatCurrency, formatAmount } from '@/utils/formatters';

interface TokenSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (token: Token) => void;
  tokens: Token[];
  selectedToken?: Token;
  otherToken?: Token;
  getBalance: (currency: string) => number;
}

interface TokenRowItemProps {
  token: Token;
  isSelected: boolean;
  isOther: boolean;
  balance: number;
  onSelect: (token: Token) => void;
}

const TokenRowItem = memo(function TokenRowItem({
  token,
  isSelected,
  isOther,
  balance,
  onSelect,
}: TokenRowItemProps) {
  return (
    <button
      key={token.currency}
      onClick={() => onSelect(token)}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-left transition-all ${
        isSelected
          ? 'bg-indigo-600/15 border border-indigo-500/30 text-white'
          : 'hover:bg-zinc-800/60 text-zinc-200 border border-transparent'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <TokenIcon symbol={token.currency} size="lg" />
        <div className="truncate">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">{token.currency}</span>
            {isOther && (
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                Swapping with
              </span>
            )}
          </div>
          <div className="text-xs text-zinc-400 truncate">{token.name}</div>
        </div>
      </div>

      <div className="text-right shrink-0 ml-3">
        <div className="text-xs font-semibold text-zinc-200">
          {formatAmount(balance)} {token.currency}
        </div>
        <div className="text-[11px] text-zinc-400">{formatCurrency(token.price)}</div>
      </div>

      {isSelected && (
        <div className="ml-2 pl-2 text-indigo-400">
          <Check className="w-4 h-4" />
        </div>
      )}
    </button>
  );
});

function TokenSelectModalComponent({
  isOpen,
  onClose,
  onSelect,
  tokens,
  selectedToken,
  otherToken,
  getBalance,
}: TokenSelectModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleClose = useCallback(() => {
    setSearchQuery('');
    onClose();
  }, [onClose]);

  const handleSelect = useCallback(
    (token: Token) => {
      setSearchQuery('');
      onSelect(token);
      onClose();
    },
    [onSelect, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  const filteredTokens = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return tokens;

    return tokens.filter(
      (t) =>
        t.currency.toLowerCase().includes(query) || t.name.toLowerCase().includes(query)
    );
  }, [tokens, searchQuery]);

  const popularTokens = useMemo(() => {
    return tokens.filter((t) => t.popular).slice(0, 6);
  }, [tokens]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-zinc-900/95 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh] animate-scale-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-white">Select a token</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-medium">
              {tokens.length} available
            </span>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 pb-2">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-zinc-400 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by name or symbol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950/80 border border-zinc-800 text-white placeholder-zinc-500 rounded-2xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-zinc-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Popular Tokens Quick Select */}
          {!searchQuery && popularTokens.length > 0 && (
            <div className="mt-3">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-2 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Popular</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularTokens.map((token) => {
                  const isSelected = selectedToken?.currency === token.currency;
                  return (
                    <button
                      key={token.currency}
                      onClick={() => handleSelect(token)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-indigo-600/30 border-indigo-500/50 text-indigo-300 ring-1 ring-indigo-500/40'
                          : 'bg-zinc-800/60 border-zinc-700/60 text-zinc-200 hover:bg-zinc-700/60 hover:border-zinc-600'
                      }`}
                    >
                      <TokenIcon symbol={token.currency} size="sm" />
                      <span>{token.currency}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Token List */}
        <div className="flex-1 overflow-y-auto px-2 py-2 divide-y divide-zinc-800/40 custom-scrollbar">
          {filteredTokens.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 text-sm">
              <p>No tokens found for "{searchQuery}"</p>
              <p className="text-xs text-zinc-600 mt-1">
                Try searching another symbol or name
              </p>
            </div>
          ) : (
            filteredTokens.map((token) => {
              const isSelected = selectedToken?.currency === token.currency;
              const isOther = otherToken?.currency === token.currency;
              const balance = getBalance(token.currency);

              return (
                <TokenRowItem
                  key={token.currency}
                  token={token}
                  isSelected={isSelected}
                  isOther={isOther}
                  balance={balance}
                  onSelect={handleSelect}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export const TokenSelectModal = memo(TokenSelectModalComponent);
