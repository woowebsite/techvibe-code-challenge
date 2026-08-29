/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_DESCRIPTION?: string;
  readonly VITE_PRICES_API_URL: string;
  readonly VITE_TOKEN_ICON_BASE_URL: string;
  readonly VITE_PRICE_REFETCH_INTERVAL_MS?: string;
  readonly VITE_PRICE_STALE_TIME_MS?: string;
  readonly VITE_API_TIMEOUT_MS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
