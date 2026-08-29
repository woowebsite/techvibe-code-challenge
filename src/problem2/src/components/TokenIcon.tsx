import { useState } from 'react';
import { getTokenIconUrl } from '@/services/priceService';

interface TokenIconProps {
  symbol: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZE_MAP = {
  sm: 'w-5 h-5 text-[10px]',
  md: 'w-7 h-7 text-xs',
  lg: 'w-9 h-9 text-sm',
  xl: 'w-12 h-12 text-base',
};

// Distinct colors for fallback badges
const COLOR_PALETTE = [
  'from-blue-600 to-indigo-600',
  'from-purple-600 to-pink-600',
  'from-emerald-600 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-cyan-500 to-blue-600',
  'from-rose-500 to-pink-600',
];

function getSymbolColor(symbol: string): string {
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLOR_PALETTE.length;
  return COLOR_PALETTE[index];
}

export function TokenIcon({ symbol, className = '', size = 'md' }: TokenIconProps) {
  const [hasError, setHasError] = useState(false);
  const sizeClasses = SIZE_MAP[size] || SIZE_MAP.md;

  const iconUrl = getTokenIconUrl(symbol);

  if (hasError || !symbol) {
    const bgGradient = getSymbolColor(symbol || '??');
    return (
      <div
        className={`${sizeClasses} rounded-full bg-gradient-to-br ${bgGradient} text-white font-bold flex items-center justify-center shrink-0 shadow-sm border border-white/20 select-none ${className}`}
        title={symbol}
      >
        {symbol ? symbol.slice(0, 3).toUpperCase() : '?'}
      </div>
    );
  }

  return (
    <img
      src={iconUrl}
      alt={symbol}
      onError={() => setHasError(true)}
      className={`${sizeClasses} rounded-full object-contain shrink-0 bg-zinc-900/60 p-0.5 border border-white/10 shadow-sm ${className}`}
      loading="lazy"
    />
  );
}
