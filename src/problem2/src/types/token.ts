export interface RawPriceItem {
  currency: string;
  date: string;
  price: number;
}

export interface Token {
  currency: string;
  name: string;
  symbol: string;
  price: number;
  date: string;
  change24h?: number;
  iconUrl: string;
  popular?: boolean;
}

export interface WalletBalance {
  [currency: string]: number;
}

export interface SwapTransaction {
  id: string;
  timestamp: number;
  fromCurrency: string;
  fromAmount: number;
  toCurrency: string;
  toAmount: number;
  rate: number;
  slippage: number;
  status: 'completed' | 'pending' | 'failed';
  txHash: string;
}

export type SwapField = 'from' | 'to';
