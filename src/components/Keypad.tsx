import React from 'react';
import { CalculatorMode } from '../types';
import { Delete } from 'lucide-react';

interface KeypadProps {
  mode: CalculatorMode;
  onNumber: (num: string) => void;
  onOperator: (op: string) => void;
  onEquals: () => void;
  onClear: () => void;
  onAllClear: () => void;
  onBackspace: () => void;
  onToggleSign: () => void;
  onPercentage: () => void;
  onScientificFunc: (fn: string) => void;
  onMemoryAction: (action: 'MC' | 'MR' | 'M+' | 'M-' | 'MS') => void;
  hasMemory: boolean;
  activeKey?: string | null;
}

export const Keypad: React.FC<KeypadProps> = ({
  mode,
  onNumber,
  onOperator,
  onEquals,
  onClear,
  onAllClear,
  onBackspace,
  onToggleSign,
  onPercentage,
  onScientificFunc,
  onMemoryAction,
  hasMemory,
  activeKey,
}) => {
  // Key press sound and vibration are handled in handlers passed down or centrally

  const isKeyActive = (key: string) => activeKey === key;

  return (
    <div className="flex flex-col gap-2.5 select-none">
      {/* Memory Toolbar */}
      <div className="grid grid-cols-5 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold">
        <button
          onClick={() => onMemoryAction('MC')}
          disabled={!hasMemory}
          className={`py-1.5 rounded-lg transition-all text-center ${
            hasMemory
              ? 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xs active:scale-95'
              : 'text-slate-400 dark:text-slate-600 cursor-not-allowed'
          }`}
          title="Memory Clear"
        >
          MC
        </button>
        <button
          onClick={() => onMemoryAction('MR')}
          disabled={!hasMemory}
          className={`py-1.5 rounded-lg transition-all text-center ${
            hasMemory
              ? 'text-amber-700 dark:text-amber-400 font-bold hover:bg-white dark:hover:bg-slate-700 hover:shadow-xs active:scale-95'
              : 'text-slate-400 dark:text-slate-600 cursor-not-allowed'
          }`}
          title="Memory Recall"
        >
          MR
        </button>
        <button
          onClick={() => onMemoryAction('M+')}
          className="py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xs active:scale-95 transition-all text-center"
          title="Memory Add"
        >
          M+
        </button>
        <button
          onClick={() => onMemoryAction('M-')}
          className="py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xs active:scale-95 transition-all text-center"
          title="Memory Subtract"
        >
          M-
        </button>
        <button
          onClick={() => onMemoryAction('MS')}
          className="py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xs active:scale-95 transition-all text-center"
          title="Memory Store"
        >
          MS
        </button>
      </div>

      {/* Scientific Functions Grid (visible in scientific mode) */}
      {mode === 'scientific' && (
        <div className="grid grid-cols-6 gap-1.5 p-2 rounded-xl bg-slate-100/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-xs font-mono font-medium">
          {/* Row S1 */}
          <button
            onClick={() => onScientificFunc('(')}
            className="py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all text-center font-bold"
            title="Open parenthesis"
          >
            (
          </button>
          <button
            onClick={() => onScientificFunc(')')}
            className="py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all text-center font-bold"
            title="Close parenthesis"
          >
            )
          </button>
          <button
            onClick={() => onScientificFunc('sqr')}
            className="py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all text-center"
            title="Square (x²)"
          >
            x²
          </button>
          <button
            onClick={() => onScientificFunc('pow')}
            className="py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all text-center"
            title="Power (xʸ)"
          >
            xʸ
          </button>
          <button
            onClick={() => onScientificFunc('sqrt')}
            className="py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all text-center"
            title="Square Root (√x)"
          >
            √x
          </button>
          <button
            onClick={() => onScientificFunc('inv')}
            className="py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all text-center"
            title="Reciprocal (1/x)"
          >
            1/x
          </button>

          {/* Row S2 */}
          <button
            onClick={() => onScientificFunc('sin')}
            className="py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all text-center"
            title="Sine"
          >
            sin
          </button>
          <button
            onClick={() => onScientificFunc('cos')}
            className="py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all text-center"
            title="Cosine"
          >
            cos
          </button>
          <button
            onClick={() => onScientificFunc('tan')}
            className="py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all text-center"
            title="Tangent"
          >
            tan
          </button>
          <button
            onClick={() => onScientificFunc('ln')}
            className="py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all text-center"
            title="Natural Logarithm (base e)"
          >
            ln
          </button>
          <button
            onClick={() => onScientificFunc('log')}
            className="py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all text-center"
            title="Logarithm (base 10)"
          >
            log
          </button>
          <button
            onClick={() => onScientificFunc('pi')}
            className="py-2 rounded-lg bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-400 font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all text-center"
            title="Pi constant (3.14159...)"
          >
            π
          </button>

          {/* Row S3 */}
          <button
            onClick={() => onScientificFunc('asin')}
            className="py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all text-center"
            title="Arcsine (sin⁻¹)"
          >
            sin⁻¹
          </button>
          <button
            onClick={() => onScientificFunc('acos')}
            className="py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all text-center"
            title="Arccosine (cos⁻¹)"
          >
            cos⁻¹
          </button>
          <button
            onClick={() => onScientificFunc('atan')}
            className="py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all text-center"
            title="Arctangent (tan⁻¹)"
          >
            tan⁻¹
          </button>
          <button
            onClick={() => onScientificFunc('e')}
            className="py-2 rounded-lg bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-400 font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all text-center"
            title="Euler's number e (2.71828...)"
          >
            e
          </button>
          <button
            onClick={() => onScientificFunc('fact')}
            className="py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all text-center font-bold"
            title="Factorial (n!)"
          >
            n!
          </button>
          <button
            onClick={() => onScientificFunc('abs')}
            className="py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all text-center font-bold"
            title="Absolute value |x|"
          >
            |x|
          </button>
        </div>
      )}

      {/* Primary Keypad Grid (4 columns) */}
      <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
        {/* Row 1: AC, C, %, ÷ */}
        <button
          onClick={onAllClear}
          className={`h-12 sm:h-14 rounded-xl font-bold text-sm sm:text-base border transition-all active:scale-95 ${
            isKeyActive('Escape')
              ? 'bg-rose-500 text-white border-rose-600'
              : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-200/80 dark:border-rose-900/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 shadow-xs'
          }`}
          title="All Clear (Escape)"
        >
          AC
        </button>

        <button
          onClick={onClear}
          className="h-12 sm:h-14 rounded-xl font-semibold text-sm sm:text-base bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200/80 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-xs"
          title="Clear current entry (C)"
        >
          C
        </button>

        <button
          onClick={onBackspace}
          className={`h-12 sm:h-14 rounded-xl flex items-center justify-center font-semibold text-sm sm:text-base bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200/80 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-xs ${
            isKeyActive('Backspace') ? 'ring-2 ring-amber-500' : ''
          }`}
          title="Backspace (Delete last character)"
        >
          <Delete className="w-5 h-5" />
        </button>

        <button
          onClick={() => onOperator('÷')}
          className={`h-12 sm:h-14 rounded-xl font-bold text-lg sm:text-xl border transition-all active:scale-95 ${
            isKeyActive('/')
              ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md'
              : 'bg-amber-100/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800/60 hover:bg-amber-200/60 dark:hover:bg-amber-900/60 shadow-xs'
          }`}
          title="Divide (/)"
        >
          ÷
        </button>

        {/* Row 2: 7, 8, 9, × */}
        <button
          onClick={() => onNumber('7')}
          className={`h-12 sm:h-14 rounded-xl font-semibold text-lg sm:text-xl font-mono-numbers bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/70 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-xs ${
            isKeyActive('7') ? 'ring-2 ring-amber-500' : ''
          }`}
        >
          7
        </button>
        <button
          onClick={() => onNumber('8')}
          className={`h-12 sm:h-14 rounded-xl font-semibold text-lg sm:text-xl font-mono-numbers bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/70 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-xs ${
            isKeyActive('8') ? 'ring-2 ring-amber-500' : ''
          }`}
        >
          8
        </button>
        <button
          onClick={() => onNumber('9')}
          className={`h-12 sm:h-14 rounded-xl font-semibold text-lg sm:text-xl font-mono-numbers bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/70 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-xs ${
            isKeyActive('9') ? 'ring-2 ring-amber-500' : ''
          }`}
        >
          9
        </button>
        <button
          onClick={() => onOperator('×')}
          className={`h-12 sm:h-14 rounded-xl font-bold text-lg sm:text-xl border transition-all active:scale-95 ${
            isKeyActive('*')
              ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md'
              : 'bg-amber-100/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800/60 hover:bg-amber-200/60 dark:hover:bg-amber-900/60 shadow-xs'
          }`}
          title="Multiply (*)"
        >
          ×
        </button>

        {/* Row 3: 4, 5, 6, − */}
        <button
          onClick={() => onNumber('4')}
          className={`h-12 sm:h-14 rounded-xl font-semibold text-lg sm:text-xl font-mono-numbers bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/70 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-xs ${
            isKeyActive('4') ? 'ring-2 ring-amber-500' : ''
          }`}
        >
          4
        </button>
        <button
          onClick={() => onNumber('5')}
          className={`h-12 sm:h-14 rounded-xl font-semibold text-lg sm:text-xl font-mono-numbers bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/70 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-xs ${
            isKeyActive('5') ? 'ring-2 ring-amber-500' : ''
          }`}
        >
          5
        </button>
        <button
          onClick={() => onNumber('6')}
          className={`h-12 sm:h-14 rounded-xl font-semibold text-lg sm:text-xl font-mono-numbers bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/70 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-xs ${
            isKeyActive('6') ? 'ring-2 ring-amber-500' : ''
          }`}
        >
          6
        </button>
        <button
          onClick={() => onOperator('−')}
          className={`h-12 sm:h-14 rounded-xl font-bold text-lg sm:text-xl border transition-all active:scale-95 ${
            isKeyActive('-')
              ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md'
              : 'bg-amber-100/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800/60 hover:bg-amber-200/60 dark:hover:bg-amber-900/60 shadow-xs'
          }`}
          title="Subtract (-)"
        >
          −
        </button>

        {/* Row 4: 1, 2, 3, + */}
        <button
          onClick={() => onNumber('1')}
          className={`h-12 sm:h-14 rounded-xl font-semibold text-lg sm:text-xl font-mono-numbers bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/70 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-xs ${
            isKeyActive('1') ? 'ring-2 ring-amber-500' : ''
          }`}
        >
          1
        </button>
        <button
          onClick={() => onNumber('2')}
          className={`h-12 sm:h-14 rounded-xl font-semibold text-lg sm:text-xl font-mono-numbers bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/70 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-xs ${
            isKeyActive('2') ? 'ring-2 ring-amber-500' : ''
          }`}
        >
          2
        </button>
        <button
          onClick={() => onNumber('3')}
          className={`h-12 sm:h-14 rounded-xl font-semibold text-lg sm:text-xl font-mono-numbers bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/70 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-xs ${
            isKeyActive('3') ? 'ring-2 ring-amber-500' : ''
          }`}
        >
          3
        </button>
        <button
          onClick={() => onOperator('+')}
          className={`h-12 sm:h-14 rounded-xl font-bold text-lg sm:text-xl border transition-all active:scale-95 ${
            isKeyActive('+')
              ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md'
              : 'bg-amber-100/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800/60 hover:bg-amber-200/60 dark:hover:bg-amber-900/60 shadow-xs'
          }`}
          title="Add (+)"
        >
          +
        </button>

        {/* Row 5: +/-, 0, ., = */}
        <button
          onClick={onToggleSign}
          className="h-12 sm:h-14 rounded-xl font-semibold text-sm sm:text-base bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200/80 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-xs"
          title="Negate (+/-)"
        >
          ±
        </button>
        <button
          onClick={() => onNumber('0')}
          className={`h-12 sm:h-14 rounded-xl font-semibold text-lg sm:text-xl font-mono-numbers bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/70 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-xs ${
            isKeyActive('0') ? 'ring-2 ring-amber-500' : ''
          }`}
        >
          0
        </button>
        <button
          onClick={() => onNumber('.')}
          className={`h-12 sm:h-14 rounded-xl font-bold text-xl font-mono-numbers bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/70 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-xs ${
            isKeyActive('.') ? 'ring-2 ring-amber-500' : ''
          }`}
          title="Decimal point (.)"
        >
          .
        </button>
        <button
          onClick={onEquals}
          className={`h-12 sm:h-14 rounded-xl font-bold text-xl sm:text-2xl transition-all shadow-md active:scale-95 ${
            isKeyActive('Enter') || isKeyActive('=')
              ? 'bg-amber-600 text-slate-950 ring-2 ring-amber-400'
              : 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 shadow-amber-500/20'
          }`}
          title="Calculate Equals (Enter or =)"
        >
          =
        </button>
      </div>
    </div>
  );
};
