import React, { useState } from 'react';
import { AngleMode, CalculatorMode } from '../types';
import { formatWithCommas } from '../utils/mathEvaluator';
import { Copy, Check, CornerDownLeft } from 'lucide-react';

interface DisplayProps {
  expression: string;
  result: string;
  error?: string | null;
  mode: CalculatorMode;
  angleMode: AngleMode;
  toggleAngleMode: () => void;
  memoryValue: number;
  onOpenMemory: () => void;
  isEvaluated: boolean;
}

export const Display: React.FC<DisplayProps> = ({
  expression,
  result,
  error,
  mode,
  angleMode,
  toggleAngleMode,
  memoryValue,
  onOpenMemory,
  isEvaluated,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = error ? '' : result;
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Determine dynamic font size based on result length
  const formattedResult = error ? error : formatWithCommas(result);
  const len = formattedResult.length;
  let textSizeClass = 'text-3xl sm:text-4xl md:text-5xl';
  if (len > 16) {
    textSizeClass = 'text-xl sm:text-2xl md:text-3xl';
  } else if (len > 11) {
    textSizeClass = 'text-2xl sm:text-3xl md:text-4xl';
  }

  return (
    <div className="relative p-4 sm:p-6 rounded-2xl bg-slate-900 text-white shadow-inner flex flex-col justify-between min-h-[140px] sm:min-h-[160px] overflow-hidden select-text border border-slate-800">
      {/* Top Status & Indicators */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
        <div className="flex items-center gap-2">
          {mode === 'scientific' && (
            <button
              onClick={toggleAngleMode}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] font-semibold transition-colors uppercase tracking-wider"
              title="Click to toggle Degree / Radian mode"
            >
              {angleMode}
            </button>
          )}

          {memoryValue !== 0 && (
            <button
              onClick={onOpenMemory}
              className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-mono text-[11px] font-bold transition-colors"
              title={`Memory active: ${memoryValue} (Click to inspect)`}
            >
              M ({memoryValue})
            </button>
          )}

          <span className="text-[11px] text-slate-400">
            {mode === 'scientific' ? 'Scientific' : 'Standard'}
          </span>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-[11px]"
          title="Copy result to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Formula / Expression Tape Row */}
      <div
        className="text-right text-xs sm:text-sm text-slate-400 font-mono tracking-tight overflow-x-auto whitespace-nowrap scrollbar-none py-1 min-h-[24px]"
        dir="ltr"
      >
        {expression ? (
          <span>
            {expression.replace(/\*/g, '×').replace(/\//g, '÷')}
            {isEvaluated && <span className="text-amber-400 ml-1.5">=</span>}
          </span>
        ) : (
          <span className="text-slate-600">&nbsp;</span>
        )}
      </div>

      {/* Main Number Output Display */}
      <div className="flex items-end justify-end mt-1">
        <div
          className={`font-mono-numbers font-semibold tracking-tight text-right select-all transition-all duration-150 ${textSizeClass} ${
            error ? 'text-rose-400' : 'text-slate-50'
          }`}
          title={formattedResult}
        >
          {formattedResult}
        </div>
      </div>
    </div>
  );
};
