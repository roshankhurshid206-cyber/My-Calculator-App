import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { key: '0 – 9', desc: 'Enter numbers' },
  { key: '+  −  *  /', desc: 'Basic arithmetic operations' },
  { key: 'Enter or =', desc: 'Calculate result (Equals)' },
  { key: 'Backspace', desc: 'Delete previous character' },
  { key: 'Escape', desc: 'All Clear (AC)' },
  { key: 'C', desc: 'Clear entry (C)' },
  { key: '.', desc: 'Decimal point' },
  { key: '%', desc: 'Percentage' },
  { key: '(  and  )', desc: 'Parentheses' },
  { key: '^', desc: 'Power function (xʸ)' },
  { key: 'S', desc: 'Toggle Scientific mode' },
  { key: 'H', desc: 'Open Calculation History' },
  { key: 'M', desc: 'Memory register inspector' },
];

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-amber-500" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
              Keyboard Shortcuts
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-3 divide-y divide-slate-100 dark:divide-slate-800/80 max-h-[60vh] overflow-y-auto">
          {SHORTCUTS.map((s, idx) => (
            <div
              key={idx}
              className="py-2.5 flex items-center justify-between text-xs"
            >
              <span className="text-slate-600 dark:text-slate-400">{s.desc}</span>
              <kbd className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[11px] font-semibold text-slate-800 dark:text-slate-200 shadow-2xs">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
