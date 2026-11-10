import React, { useState } from 'react';
import { HistoryItem } from '../types';
import { formatWithCommas } from '../utils/mathEvaluator';
import { X, Trash2, Download, Copy, Check, ArrowRightCircle } from 'lucide-react';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectResult: (val: string) => void;
  onRestoreExpression: (expr: string) => void;
  onClearHistory: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  isOpen,
  onClose,
  history,
  onSelectResult,
  onRestoreExpression,
  onClearHistory,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (item: HistoryItem) => {
    navigator.clipboard.writeText(`${item.expression} = ${item.result}`);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleExportTxt = () => {
    if (history.length === 0) return;
    const content = history
      .map(
        (h) =>
          `[${new Date(h.timestamp).toLocaleTimeString()}] ${h.expression} = ${h.result}`
      )
      .join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `calculator-history-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base">
              Calculation History
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              ({history.length})
            </span>
          </div>

          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <>
                <button
                  onClick={handleExportTxt}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Download history as text file"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={onClearHistory}
                  className="p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  title="Clear all history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close history"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {history.length === 0 ? (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
              <p>No calculation history yet.</p>
              <p className="text-xs text-slate-400 mt-1">
                Completed equations will automatically appear here.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="group relative p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 hover:border-amber-400/50 dark:hover:border-amber-500/50 transition-all text-right"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="text-[11px] font-mono">
                    {new Date(item.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCopy(item)}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                      title="Copy calculation"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        onRestoreExpression(item.expression);
                        onClose();
                      }}
                      className="p-1 rounded text-slate-400 hover:text-amber-500 transition-colors"
                      title="Load this expression"
                    >
                      <ArrowRightCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div
                  className="font-mono text-xs text-slate-500 dark:text-slate-400 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200"
                  onClick={() => {
                    onRestoreExpression(item.expression);
                    onClose();
                  }}
                  title="Click to reload expression"
                >
                  {item.expression.replace(/\*/g, '×').replace(/\//g, '÷')} =
                </div>

                <div
                  className="font-mono-numbers text-lg font-bold text-slate-900 dark:text-slate-100 cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                  onClick={() => {
                    onSelectResult(item.result);
                    onClose();
                  }}
                  title="Click to insert this result into calculator"
                >
                  {formatWithCommas(item.result)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        {history.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 text-xs text-slate-500 flex items-center justify-between">
            <span>Tap any result to insert into calculator</span>
            <button
              onClick={onClearHistory}
              className="text-xs text-rose-500 hover:text-rose-600 hover:underline"
            >
              Clear Tape
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
