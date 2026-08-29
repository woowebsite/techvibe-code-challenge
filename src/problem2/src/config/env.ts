/**
 * Validated and typed environment configuration module.
 * Protects against runtime crashes if env variables are missing or misconfigured.
 */
export const ENV = {
  APP_NAME: import.meta.env.VITE_APP_NAME || 'OmniSwap',
  APP_DESCRIPTION:
    import.meta.env.VITE_APP_DESCRIPTION || 'Decentralized Multi-Asset Currency Swap',
  PRICES_API_URL:
    import.meta.env.VITE_PRICES_API_URL || 'https://interview.switcheo.com/prices.json',
  TOKEN_ICON_BASE_URL:
    import.meta.env.VITE_TOKEN_ICON_BASE_URL ||
    'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens',
  PRICE_REFETCH_INTERVAL_MS: Number(
    import.meta.env.VITE_PRICE_REFETCH_INTERVAL_MS || 60000
  ),
  PRICE_STALE_TIME_MS: Number(import.meta.env.VITE_PRICE_STALE_TIME_MS || 30000),
  API_TIMEOUT_MS: Number(import.meta.env.VITE_API_TIMEOUT_MS || 8000),
} as const;
