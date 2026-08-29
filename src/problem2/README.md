# Problem 2: OmniSwap - Fancy Currency Swap Platform 🚀

A modern, high-performance, and visually captivating **Decentralized Currency Swap (DEX)** web application built with **Vite**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

---

## 🌟 Key Features

1. **Real-Time Token Oracle & Deduplication**:
   - Fetches live price feed from `https://interview.switcheo.com/prices.json`.
   - Groups and deduplicates multi-timestamp records (e.g. USDC, BUSD) keeping the latest price.
   - Includes graceful offline fallback data if network connectivity is interrupted.

2. **Official Token Icons**:
   - Dynamic SVGs loaded from `Switcheo/token-icons` repository (`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${symbol}.svg`).
   - Seamless fallback avatar badge generator with distinct gradients and initials for any non-SVG tokens.

3. **Bi-Directional Interactive Exchange**:
   - Enter amount in either **You Pay** or **You Receive** input to automatically calculate counterpart values based on real-time market exchange rates.
   - Live USD valuation preview calculated underneath each input.
   - Quick balance percentage buttons (`50%`, `MAX`) based on the user's wallet.
   - One-click token invert/flip button with a smooth 180° rotation animation.

4. **Comprehensive Trading Details**:
   - Toggleable Exchange Rate (e.g., `1 ETH ≈ 1,645.93 USDC` ⇄ `1 USDC ≈ 0.000607 ETH`).
   - Minimum Received calculation factoring in custom slippage.
   - Dynamic Price Impact indicator (Color-coded Green / Amber / Rose based on trade volume).
   - Estimated Network Gas Fee & Liquidity Routing path.

5. **Configurable Slippage Tolerance**:
   - Quick presets (`0.1%`, `0.5%`, `1.0%`) and Custom percentage input.
   - Safety warning alerts for high slippage (front-running risk) and low slippage (revert risk).

6. **Full Transaction Simulation & History**:
   - **Review Modal** displaying comprehensive trade parameters before signing.
   - **Transaction broadcasting simulation** with animated loaders.
   - **Celebration screen** with confetti animation, mock transaction hash, copy to clipboard, and Etherscan explorer simulation.
   - **Transaction History modal** tracking all completed swaps with timestamps and amounts.
   - **Simulated Wallet** with persistent balances in `localStorage` and a 1-click reset option.

7. **Design & Aesthetics**:
   - Premium DeFi dark mode with glowing ambient neon gradients, frosted glassmorphism borders, Plus Jakarta Sans typography, and fluid micro-interactions.

---

## 🛠️ Tech Stack

- **Framework**: [Vite](https://vite.dev/) + [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Effects**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)

---

## 🚀 Getting Started

### 1. Run via root workspace
```bash
# Start development server
npm run dev:problem2

# Build production bundle
npm run build:problem2
```

### 2. Or run directly inside `src/problem2`
```bash
cd src/problem2

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
The application will be accessible at `http://localhost:5173`.
