import React from 'react';
import { X, Trash2, ArrowDownCircle, Plus, Minus } from 'lucide-react';
import { formatWithCommas } from '../utils/mathEvaluator';

interface MemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  memoryValue: number;
  currentDisplayValue: string;
  onClearMemory: () => void;
  onRecallMemory: () => void;
  onAddToMemory: () => void;
  onSubtractFromMemory: () => void;
}

export const MemoryModal: React.FC<MemoryModalProps> = ({
  isOpen,
  onClose,
  memoryValue,
  currentDisplayValue,
  onClearMemory,
  onRecallMemory,
  onAddToMemory,
  onSubtractFromMemory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 font-mono font-bold flex items-center justify-center text-xs">
              M
            </span>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
              Memory Register
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-5 text-center">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">
            Stored Value in Memory
          </span>
          <div className="mt-2 text-3xl font-mono-numbers font-bold text-slate-900 dark:text-slate-100">
            {formatWithCommas(String(memoryValue))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-medium">
          <button
            onClick={() => {
              onRecallMemory();
              onClose();
            }}
            disabled={memoryValue === 0}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors"
          >
            <ArrowDownCircle className="w-4 h-4" />
            Recall (MR)
          </button>

          <button
            onClick={() => {
              onClearMemory();
            }}
            disabled={memoryValue === 0}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 hover:bg-rose-100 disabled:opacity-40 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear (MC)
          </button>

          <button
            onClick={onAddToMemory}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700 transition-colors"
            title={`Add display (${currentDisplayValue}) to memory`}
          >
            <Plus className="w-3.5 h-3.5" />
            M+ ({currentDisplayValue})
          </button>

          <button
            onClick={onSubtractFromMemory}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700 transition-colors"
            title={`Subtract display (${currentDisplayValue}) from memory`}
          >
            <Minus className="w-3.5 h-3.5" />
            M- ({currentDisplayValue})
          </button>
        </div>
      </div>
    </div>
  );
};
