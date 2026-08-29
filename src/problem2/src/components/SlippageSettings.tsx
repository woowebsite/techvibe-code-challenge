import { useState } from 'react';
import { Settings, Info, AlertTriangle } from 'lucide-react';

interface SlippageSettingsProps {
  slippage: number;
  onSlippageChange: (value: number) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const PRESETS = [0.1, 0.5, 1.0];

export function SlippageSettings({
  slippage,
  onSlippageChange,
  isOpen,
  onToggle,
}: SlippageSettingsProps) {
  const [customInput, setCustomInput] = useState<string>(
    PRESETS.includes(slippage) ? '' : slippage.toString()
  );

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.]/g, '');
    setCustomInput(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 50) {
      onSlippageChange(parsed);
    }
  };

  const handlePresetSelect = (preset: number) => {
    setCustomInput('');
    onSlippageChange(preset);
  };

  const isCustom = !PRESETS.includes(slippage);
  const isHighSlippage = slippage > 5.0;
  const isLowSlippage = slippage < 0.1;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={`p-2 rounded-2xl border transition-all ${
          isOpen
            ? 'bg-zinc-800 border-zinc-600 text-white'
            : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
        }`}
        title="Transaction Settings"
        aria-label="Settings"
      >
        <Settings className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-80 p-4 rounded-3xl bg-zinc-900 border border-zinc-700/80 shadow-2xl z-30 animate-scale-up">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <span className="text-sm font-semibold text-white">
              Transaction Settings
            </span>
            <div className="flex items-center gap-1 text-zinc-400 text-xs" title="Slippage tolerance is the maximum price movement you are willing to accept.">
              <Info className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-zinc-400">
                Slippage Tolerance
              </span>
              <span className="text-xs font-bold text-indigo-400">
                {slippage}%
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {PRESETS.map((preset) => {
                const active = slippage === preset && !customInput;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePresetSelect(preset)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                      active
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                        : 'bg-zinc-800/80 border-zinc-700/60 text-zinc-300 hover:bg-zinc-700/80'
                    }`}
                  >
                    {preset}%
                  </button>
                );
              })}

              <div
                className={`flex items-center px-2 py-1.5 rounded-xl border text-xs font-semibold ${
                  isCustom
                    ? 'border-indigo-500 bg-indigo-950/20 text-white'
                    : 'border-zinc-700/60 bg-zinc-800/80 text-zinc-300'
                }`}
              >
                <input
                  type="text"
                  placeholder="Custom"
                  value={customInput}
                  onChange={handleCustomChange}
                  className="w-full bg-transparent focus:outline-none text-right placeholder-zinc-500 font-bold"
                />
                <span className="ml-0.5 text-zinc-500">%</span>
              </div>
            </div>

            {/* Warning messages for extreme slippages */}
            {isHighSlippage && (
              <div className="mt-3 p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>High slippage increase risk of front-running transactions!</span>
              </div>
            )}

            {isLowSlippage && (
              <div className="mt-3 p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Low slippage may cause transaction failure due to price movement.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
