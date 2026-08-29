# Problem 2: OmniSwap - Fancy Currency Swap Platform 🚀

A production-grade, high-performance, and visually captivating **Decentralized Currency Swap (DEX)** web application built with **Vite**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **Axios**, and **TanStack React Query**.

---

## 🏛️ Team Architecture & Code Quality Standards

1. **Git Hooks & Quality Gate (Husky + lint-staged)**:
   - Automated pre-commit hook runs ESLint autofix & Prettier formatting on staged files before every commit.
   - Prevents unformatted code and linting violations from entering the codebase.

2. **Strict ESLint 9 & Prettier**:
   - Modern Flat Config (`eslint.config.js`) enforcing TypeScript best practices, React 19 Hooks rules, and Prettier style alignment.
   - Enforces React 19 pure render derivation without cascading `set-state-in-effect`.

3. **Environment Isolation (`.env` & `.env.example`)**:
   - Variables are typed with `ImportMetaEnv` in `src/vite-env.d.ts` and validated in `src/config/env.ts`.

4. **Service Layer with Interceptors (`apiClient.ts`)**:
   - Centralized Axios client with timeout controls, request metadata timing, and response normalization.

5. **Server State Management (TanStack React Query)**:
   - Auto-polling oracle prices at configurable intervals with cache deduplication and retry backoff.

6. **Comprehensive Automated Test Coverage (Vitest + Testing Library)**:
   - 46/46 unit & integration tests passing across 15 test suites with 80%+ line coverage.

7. **Fault Tolerance & Error Boundary**:
   - React `ErrorBoundary` prevents runtime crashes and white screens.

---

## ⚙️ Environment Variables

| Variable                         | Description                     | Default Value                                                        |
| :------------------------------- | :------------------------------ | :------------------------------------------------------------------- |
| `VITE_APP_NAME`                  | Branding name                   | `OmniSwap`                                                           |
| `VITE_PRICES_API_URL`            | Token price feed API            | `https://interview.switcheo.com/prices.json`                         |
| `VITE_TOKEN_ICON_BASE_URL`       | SVG token icons base repository | `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens` |
| `VITE_PRICE_REFETCH_INTERVAL_MS` | Oracle auto-refresh cycle       | `60000` (60s)                                                        |
| `VITE_PRICE_STALE_TIME_MS`       | Cache freshness duration        | `30000` (30s)                                                        |
| `VITE_API_TIMEOUT_MS`            | HTTP network timeout            | `8000` (8s)                                                          |

---

## 🚀 Development Workflow

```bash
cd src/problem2

# 1. Install dependencies
npm install

# 2. Start local dev server
npm run dev

# 3. Run unit tests
npm test

# 4. Run test coverage report
npm run test:coverage

# 5. Check linting & formatting
npm run lint
npm run format

# 6. Build production bundle
npm run build
```

The application will be accessible at `http://localhost:5173`.

---

## 🐳 Docker Deployment

### Run with Docker Compose:

```bash
cd src/problem2
docker compose up -d --build
```

Access the containerized application at `http://localhost:8080`.

### Build & Run standalone Docker Image:

```bash
cd src/problem2

# Build image
docker build -t omniswap-frontend:latest .

# Run container on port 8080
docker run -d -p 8080:80 --name omniswap-app omniswap-frontend:latest
```
