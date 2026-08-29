# Problem 2: OmniSwap - Fancy Currency Swap Platform 🚀

A production-grade, high-performance, and visually captivating **Decentralized Currency Swap (DEX)** web application built with **Vite**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **Axios**, and **TanStack React Query**.

---

## 🏛️ Architecture & Enterprise Design Patterns

1. **Environment Configuration (`.env` & `.env.example`)**:
   - Environment variables are isolated and validated in [`src/config/env.ts`](./src/config/env.ts).
   - Strict typing with `ImportMetaEnv` defined in [`src/vite-env.d.ts`](./src/vite-env.d.ts) for autocomplete and compile-time validation.

2. **Clean Service Layer & Intercepted HTTP Client**:
   - Centralized Axios instance ([`src/services/apiClient.ts`](./src/services/apiClient.ts)) with timeout controls, request metadata timing, and response interceptors.
   - Dedicated [`src/services/priceService.ts`](./src/services/priceService.ts) for oracle fetching and data deduplication.

3. **Server State Management via TanStack React Query**:
   - Auto-polling oracle prices at configurable intervals (`VITE_PRICE_REFETCH_INTERVAL_MS`).
   - Caching, deduplication, retry exponential backoff, and window focus refetching.

4. **Domain Constants & Modular Structure**:
   - [`src/constants/tokens.ts`](./src/constants/tokens.ts): Token names, popular badges, fallback oracle prices.
   - [`src/constants/swap.ts`](./src/constants/swap.ts): Slippage presets, network fee estimates, trade thresholds.

5. **Fault Tolerance & Error Boundary**:
   - [`src/components/ErrorBoundary.tsx`](./src/components/ErrorBoundary.tsx) to catch runtime exceptions gracefully with user-friendly recovery UI.

6. **Comprehensive Automated Test Coverage (Vitest + Testing Library)**:
   - 38/38 unit and component tests passing across 11 test suites.

---

## ⚙️ Environment Variables

| Variable | Description | Default Value |
| :--- | :--- | :--- |
| `VITE_APP_NAME` | Branding name | `OmniSwap` |
| `VITE_PRICES_API_URL` | Token price feed API | `https://interview.switcheo.com/prices.json` |
| `VITE_TOKEN_ICON_BASE_URL` | SVG token icons base repository | `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens` |
| `VITE_PRICE_REFETCH_INTERVAL_MS`| Oracle auto-refresh cycle | `60000` (60s) |
| `VITE_PRICE_STALE_TIME_MS` | Cache freshness duration | `30000` (30s) |
| `VITE_API_TIMEOUT_MS` | HTTP network timeout | `8000` (8s) |

---

## 🚀 Getting Started

### 1. From workspace root
```bash
# Run unit tests
npm run test:problem2

# Start development server
npm run dev:problem2

# Build production bundle
npm run build:problem2
```

### 2. Or inside `src/problem2`
```bash
cd src/problem2

# Copy environment config
cp .env.example .env

# Install dependencies
npm install

# Run unit tests
npm test

# Start development server
npm run dev

# Run TypeScript checks & production build
npm run build
```
Open `http://localhost:5173` to explore the application.
