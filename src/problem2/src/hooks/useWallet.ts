import { useState, useEffect, useCallback } from 'react';
import { WalletBalance, SwapTransaction } from '@/types/token';

const STORAGE_KEY_BALANCES = 'fancy_swap_wallet_balances_v1';
const STORAGE_KEY_HISTORY = 'fancy_swap_tx_history_v1';

const INITIAL_BALANCES: WalletBalance = {
  ETH: 4.825,
  WBTC: 0.285,
  USDC: 8500.0,
  BUSD: 2400.0,
  ATOM: 350.0,
  OSMO: 1250.0,
  SWTH: 120000.0,
  GMX: 25.5,
  BLUR: 4500.0,
  LUNA: 1800.0,
  OKB: 40.0,
  KUJI: 950.0,
};

export function useWallet() {
  const [balances, setBalances] = useState<WalletBalance>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BALANCES);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_BALANCES;
  });

  const [transactions, setTransactions] = useState<SwapTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return [];
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BALANCES, JSON.stringify(balances));
    } catch {
      // Ignore
    }
  }, [balances]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(transactions));
    } catch {
      // Ignore
    }
  }, [transactions]);

  const getBalance = useCallback(
    (currency: string): number => {
      return balances[currency] || 0;
    },
    [balances]
  );

  const executeSwap = useCallback(
    (
      fromCurrency: string,
      fromAmount: number,
      toCurrency: string,
      toAmount: number,
      rate: number,
      slippage: number,
      txHash: string
    ) => {
      setBalances((prev) => {
        const currentFrom = prev[fromCurrency] || 0;
        const currentTo = prev[toCurrency] || 0;

        return {
          ...prev,
          [fromCurrency]: Math.max(0, currentFrom - fromAmount),
          [toCurrency]: currentTo + toAmount,
        };
      });

      const newTx: SwapTransaction = {
        id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        timestamp: Date.now(),
        fromCurrency,
        fromAmount,
        toCurrency,
        toAmount,
        rate,
        slippage,
        status: 'completed',
        txHash,
      };

      setTransactions((prev) => [newTx, ...prev]);
    },
    []
  );

  const resetWallet = useCallback(() => {
    setBalances(INITIAL_BALANCES);
    setTransactions([]);
    localStorage.removeItem(STORAGE_KEY_BALANCES);
    localStorage.removeItem(STORAGE_KEY_HISTORY);
  }, []);

  return {
    balances,
    transactions,
    getBalance,
    executeSwap,
    resetWallet,
  };
}
