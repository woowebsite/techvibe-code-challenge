import React, { useMemo } from 'react';

// ==========================================
// 1. TYPES & DOMAIN MODELS
// ==========================================
export type Blockchain = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo' | string;

export interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: Blockchain;
}

export interface FormattedWalletBalance extends WalletBalance {
    formatted: string;
    usdValue: number;
}

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
    // Extensible for design system box props
}

export interface WalletPageProps extends BoxProps {}

// Ambient declarations for external context/components in the challenge
declare function useWalletBalances(): WalletBalance[];
declare function usePrices(): Record<string, number>;
declare const classes: { readonly [key: string]: string };
interface WalletRowProps {
    className?: string;
    amount: number;
    usdValue: number;
    formattedAmount: string;
}
declare const WalletRow: React.FC<WalletRowProps>;

// ==========================================
// 2. CONSTANTS & CONFIGURATIONS
// ==========================================
const BLOCKCHAIN_PRIORITY: Record<string, number> = {
    Osmosis: 100,
    Ethereum: 50,
    Arbitrum: 30,
    Zilliqa: 20,
    Neo: 20,
};

const DEFAULT_PRIORITY = -99;

// ==========================================
// 3. PURE HELPER FUNCTIONS
// ==========================================
const getPriority = (blockchain: Blockchain): number => {
    return BLOCKCHAIN_PRIORITY[blockchain] ?? DEFAULT_PRIORITY;
};

const formatAmount = (amount: number): string => {
    return amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
    });
};

// ==========================================
// 4. CUSTOM HOOK: SEPARATION OF BUSINESS LOGIC
// ==========================================
export const useFormattedBalances = (
    balances: WalletBalance[],
    prices: Record<string, number>
): FormattedWalletBalance[] => {
    return useMemo(() => {
        return balances
            .filter((balance) => {
                const priority = getPriority(balance.blockchain);
                return priority > DEFAULT_PRIORITY && balance.amount > 0;
            })
            .sort((lhs, rhs) => {
                return getPriority(rhs.blockchain) - getPriority(lhs.blockchain);
            })
            .map((balance) => {
                const unitPrice = prices[balance.currency] ?? 0;
                return {
                    ...balance,
                    formatted: formatAmount(balance.amount),
                    usdValue: unitPrice * balance.amount,
                };
            });
    }, [balances, prices]);
};

// ==========================================
// 5. PRESENTATIONAL COMPONENT
// ==========================================
export const WalletPage: React.FC<WalletPageProps> = ({ className, ...restProps }) => {
    const balances = useWalletBalances();
    const prices = usePrices();

    const formattedBalances = useFormattedBalances(balances, prices);

    return (
        <div className={className} {...restProps}>
            {formattedBalances.map((balance) => (
                <WalletRow
                    className={classes.row}
                    key={`${balance.blockchain}-${balance.currency}`}
                    amount={balance.amount}
                    usdValue={balance.usdValue}
                    formattedAmount={balance.formatted}
                />
            ))}
        </div>
    );
};

export default WalletPage;