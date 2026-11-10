import React, { useState, useEffect, useCallback } from 'react';
import { AngleMode, CalculatorMode, HistoryItem } from './types';
import { Header } from './components/Header';
import { Display } from './components/Display';
import { Keypad } from './components/Keypad';
import { HistoryPanel } from './components/HistoryPanel';
import { MemoryModal } from './components/MemoryModal';
import { UnitConverterPanel } from './components/UnitConverterPanel';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { GitHubModal } from './components/GitHubModal';
import { evaluateExpression, formatResult, formatWithCommas } from './utils/mathEvaluator';
import { soundManager } from './utils/audio';
import { History as HistoryIcon, Trash2, ArrowRightCircle, Sparkles } from 'lucide-react';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('precision_calc_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Sound state
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(soundManager.isEnabled());

  // Calculator Mode: standard, scientific, converter
  const [mode, setMode] = useState<CalculatorMode>('standard');
  const [angleMode, setAngleMode] = useState<AngleMode>('deg');

  // Calculation state
  const [expression, setExpression] = useState<string>('');
  const [displayResult, setDisplayResult] = useState<string>('0');
  const [error, setError] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  // Memory state
  const [memoryValue, setMemoryValue] = useState<number>(() => {
    const saved = localStorage.getItem('precision_calc_memory');
    return saved ? parseFloat(saved) || 0 : 0;
  });

  // History state
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('precision_calc_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isMemoryOpen, setIsMemoryOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isGitHubOpen, setIsGitHubOpen] = useState(false);

  // Sync theme to document element
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('precision_calc_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('precision_calc_theme', 'light');
    }
  }, [isDark]);

  // Persist history
  useEffect(() => {
    try {
      localStorage.setItem('precision_calc_history', JSON.stringify(history));
    } catch {
      // Ignore storage error
    }
  }, [history]);

  // Persist memory
  useEffect(() => {
    localStorage.setItem('precision_calc_memory', String(memoryValue));
  }, [memoryValue]);

  const toggleDark = () => setIsDark((prev) => !prev);
  const toggleSound = () => {
    const next = !isSoundEnabled;
    setIsSoundEnabled(next);
    soundManager.setEnabled(next);
  };
  const toggleAngleMode = () => {
    setAngleMode((prev) => (prev === 'deg' ? 'rad' : 'deg'));
    soundManager.play('action');
  };

  // Sound feedback helper
  const playSound = (type: 'number' | 'operator' | 'action' | 'equals' | 'clear' | 'error') => {
    soundManager.play(type);
  };

  // Flash key for visual keyboard feedback
  const triggerKeyHighlight = (key: string) => {
    setActiveKey(key);
    setTimeout(() => setActiveKey(null), 150);
  };

  // Digit & Decimal Input Handler
  const handleNumber = useCallback(
    (val: string) => {
      playSound('number');
      setError(null);

      if (isEvaluated) {
        // Start fresh calculation after an evaluated equals
        if (val === '.') {
          setExpression('0.');
          setDisplayResult('0.');
        } else {
          setExpression(val);
          setDisplayResult(val);
        }
        setIsEvaluated(false);
        return;
      }

      // If initial state
      if (expression === '' || expression === '0') {
        if (val === '.') {
          setExpression('0.');
          setDisplayResult('0.');
        } else {
          setExpression(val);
          setDisplayResult(val);
        }
        return;
      }

      // Check decimal rules in current number token
      if (val === '.') {
        // Find last number token
        const match = expression.match(/(\d+\.?\d*)$/);
        if (match && match[0].includes('.')) {
          // Already has decimal
          return;
        }
        if (!match) {
          // Following an operator like '5 + '
          setExpression((prev) => prev + '0.');
          setDisplayResult('0.');
          return;
        }
      }

      const nextExpr = expression + val;
      setExpression(nextExpr);

      // Extract current number chunk for displayResult
      const lastNumMatch = nextExpr.match(/(\d+\.?\d*)$/);
      if (lastNumMatch) {
        setDisplayResult(lastNumMatch[0]);
      } else {
        setDisplayResult(nextExpr);
      }
    },
    [expression, isEvaluated]
  );

  // Operator Input Handler (+, -, ×, ÷)
  const handleOperator = useCallback(
    (opSymbol: string) => {
      playSound('operator');
      setError(null);

      // Normalize display symbol to standard token
      let opToken = opSymbol;
      if (opSymbol === '×') opToken = '*';
      if (opSymbol === '÷') opToken = '/';
      if (opSymbol === '−') opToken = '-';

      if (isEvaluated) {
        // Continue from evaluated result
        setExpression(displayResult + ' ' + opToken + ' ');
        setIsEvaluated(false);
        return;
      }

      if (expression === '') {
        if (opToken === '-') {
          setExpression('-');
          setDisplayResult('-');
        } else {
          setExpression('0 ' + opToken + ' ');
        }
        return;
      }

      // Check if expression ends with an operator, replace it
      const trailingOpMatch = expression.match(/(\s*[\+\-\*\/]\s*)$/);
      if (trailingOpMatch) {
        setExpression((prev) => prev.slice(0, prev.length - trailingOpMatch[0].length) + ' ' + opToken + ' ');
        return;
      }

      setExpression((prev) => prev + ' ' + opToken + ' ');
    },
    [expression, displayResult, isEvaluated]
  );

  // Equals / Calculate Handler
  const handleEquals = useCallback(() => {
    if (!expression || expression.trim() === '') return;

    const evalRes = evaluateExpression(expression, angleMode);
    if (!evalRes.success || evalRes.result === undefined) {
      playSound('error');
      setError(evalRes.error || 'Syntax Error');
      return;
    }

    playSound('equals');
    const resultStr = formatResult(evalRes.result);
    setDisplayResult(resultStr);
    setIsEvaluated(true);
    setError(null);

    // Record into history
    const newItem: HistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      expression: expression,
      result: resultStr,
      timestamp: Date.now(),
    };
    setHistory((prev) => [newItem, ...prev.slice(0, 49)]); // Keep last 50
  }, [expression, angleMode]);

  // Clear current entry
  const handleClear = useCallback(() => {
    playSound('clear');
    setError(null);
    if (isEvaluated) {
      setExpression('');
      setDisplayResult('0');
      setIsEvaluated(false);
      return;
    }

    // Clear last operand or reset if minimal
    const tokens = expression.trim().split(' ');
    if (tokens.length <= 1) {
      setExpression('');
      setDisplayResult('0');
    } else {
      tokens.pop();
      const updated = tokens.join(' ') + ' ';
      setExpression(updated);
      setDisplayResult(tokens[tokens.length - 1] || '0');
    }
  }, [expression, isEvaluated]);

  // All Clear (AC)
  const handleAllClear = useCallback(() => {
    playSound('clear');
    setExpression('');
    setDisplayResult('0');
    setError(null);
    setIsEvaluated(false);
  }, []);

  // Backspace
  const handleBackspace = useCallback(() => {
    playSound('action');
    setError(null);

    if (isEvaluated) {
      setExpression('');
      setDisplayResult('0');
      setIsEvaluated(false);
      return;
    }

    if (expression.length <= 1) {
      setExpression('');
      setDisplayResult('0');
      return;
    }

    let updated = expression.slice(0, -1);
    // If it ends with trailing space, trim it
    if (updated.endsWith(' ')) {
      updated = updated.trimEnd();
    }
    setExpression(updated);

    const match = updated.match(/(\d+\.?\d*)$/);
    setDisplayResult(match ? match[0] : updated.slice(-1) || '0');
  }, [expression, isEvaluated]);

  // Toggle Sign (+/-)
  const handleToggleSign = useCallback(() => {
    playSound('action');
    if (isEvaluated || !expression) {
      const num = parseFloat(displayResult) || 0;
      const toggled = (-num).toString();
      setDisplayResult(toggled);
      setExpression(toggled);
      setIsEvaluated(false);
      return;
    }

    // Toggle the last number in expression
    const lastNumRegex = /(\d+\.?\d*)$/;
    const match = expression.match(lastNumRegex);
    if (match) {
      const numStr = match[0];
      const startIdx = expression.length - numStr.length;
      // Check if preceded by '-'
      if (expression.slice(startIdx - 1, startIdx) === '-') {
        // remove the minus
        setExpression(expression.slice(0, startIdx - 1) + numStr);
      } else {
        // insert minus or unary minus
        setExpression(expression.slice(0, startIdx) + '-' + numStr);
      }
      setDisplayResult((-parseFloat(numStr)).toString());
    }
  }, [expression, displayResult, isEvaluated]);

  // Percentage (%)
  const handlePercentage = useCallback(() => {
    playSound('action');
    if (isEvaluated || !expression) {
      const num = parseFloat(displayResult) || 0;
      const res = (num / 100).toString();
      setDisplayResult(res);
      setExpression(res);
      setIsEvaluated(false);
      return;
    }

    setExpression((prev) => prev + ' % ');
  }, [expression, displayResult, isEvaluated]);

  // Scientific Functions
  const handleScientificFunc = useCallback(
    (fn: string) => {
      playSound('action');
      setError(null);

      if (fn === '(') {
        if (isEvaluated) {
          setExpression('(');
          setDisplayResult('(');
          setIsEvaluated(false);
        } else {
          setExpression((prev) => prev + '(');
        }
        return;
      }

      if (fn === ')') {
        setExpression((prev) => prev + ')');
        return;
      }

      if (fn === 'pi') {
        const val = 'π';
        if (isEvaluated) {
          setExpression(val);
          setDisplayResult(String(Math.PI));
          setIsEvaluated(false);
        } else {
          setExpression((prev) => prev + val);
          setDisplayResult(String(Math.PI));
        }
        return;
      }

      if (fn === 'e') {
        const val = 'e';
        if (isEvaluated) {
          setExpression(val);
          setDisplayResult(String(Math.E));
          setIsEvaluated(false);
        } else {
          setExpression((prev) => prev + val);
          setDisplayResult(String(Math.E));
        }
        return;
      }

      if (fn === 'pow') {
        setExpression((prev) => prev + ' ^ ');
        return;
      }

      if (fn === 'sqr') {
        // Square current: wrap or append ^2
        if (isEvaluated) {
          setExpression(`${displayResult} ^ 2`);
          setIsEvaluated(false);
        } else {
          setExpression((prev) => `(${prev}) ^ 2`);
        }
        return;
      }

      if (fn === 'inv') {
        if (isEvaluated) {
          setExpression(`1 / (${displayResult})`);
          setIsEvaluated(false);
        } else {
          setExpression((prev) => `1 / (${prev})`);
        }
        return;
      }

      // Standard scientific prefix functions: sin, cos, tan, asin, acos, atan, sqrt, ln, log, abs, fact
      if (['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sqrt', 'ln', 'log', 'abs', 'fact'].includes(fn)) {
        if (isEvaluated) {
          setExpression(`${fn}(${displayResult})`);
          setIsEvaluated(false);
        } else {
          setExpression((prev) => `${prev}${fn}(`);
        }
      }
    },
    [displayResult, isEvaluated]
  );

  // Memory Actions
  const handleMemoryAction = useCallback(
    (action: 'MC' | 'MR' | 'M+' | 'M-' | 'MS') => {
      playSound('action');
      const currentNum = parseFloat(displayResult) || 0;

      switch (action) {
        case 'MC':
          setMemoryValue(0);
          break;
        case 'MR':
          handleNumber(String(memoryValue));
          break;
        case 'M+':
          setMemoryValue((prev) => prev + currentNum);
          break;
        case 'M-':
          setMemoryValue((prev) => prev - currentNum);
          break;
        case 'MS':
          setMemoryValue(currentNum);
          break;
      }
    },
    [displayResult, memoryValue, handleNumber]
  );

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if focus is in an input field (e.g. Unit converter or GitHub input)
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        return;
      }

      const key = e.key;

      if (/\d/.test(key)) {
        e.preventDefault();
        triggerKeyHighlight(key);
        handleNumber(key);
      } else if (key === '.') {
        e.preventDefault();
        triggerKeyHighlight('.');
        handleNumber('.');
      } else if (key === '+') {
        e.preventDefault();
        triggerKeyHighlight('+');
        handleOperator('+');
      } else if (key === '-') {
        e.preventDefault();
        triggerKeyHighlight('-');
        handleOperator('−');
      } else if (key === '*' || key === 'x' || key === 'X') {
        e.preventDefault();
        triggerKeyHighlight('*');
        handleOperator('×');
      } else if (key === '/') {
        e.preventDefault();
        triggerKeyHighlight('/');
        handleOperator('÷');
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        triggerKeyHighlight('Enter');
        handleEquals();
      } else if (key === 'Backspace') {
        e.preventDefault();
        triggerKeyHighlight('Backspace');
        handleBackspace();
      } else if (key === 'Escape') {
        e.preventDefault();
        triggerKeyHighlight('Escape');
        handleAllClear();
      } else if (key === 'c' || key === 'C') {
        e.preventDefault();
        handleClear();
      } else if (key === '%') {
        e.preventDefault();
        handlePercentage();
      } else if (key === '(' || key === ')') {
        e.preventDefault();
        handleScientificFunc(key);
      } else if (key === '^') {
        e.preventDefault();
        handleScientificFunc('pow');
      } else if (key === 'h' || key === 'H') {
        e.preventDefault();
        setIsHistoryOpen((prev) => !prev);
      } else if (key === 's' || key === 'S') {
        e.preventDefault();
        setMode((prev) => (prev === 'scientific' ? 'standard' : 'scientific'));
      } else if (key === 'm' || key === 'M') {
        e.preventDefault();
        setIsMemoryOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleNumber,
    handleOperator,
    handleEquals,
    handleBackspace,
    handleAllClear,
    handleClear,
    handlePercentage,
    handleScientificFunc,
  ]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Bar Header */}
      <Header
        mode={mode}
        setMode={setMode}
        isDark={isDark}
        toggleDark={toggleDark}
        isSoundEnabled={isSoundEnabled}
        toggleSound={toggleSound}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenGitHub={() => setIsGitHubOpen(true)}
        historyCount={history.length}
      />

      {/* Main App Workspace Canvas */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-6 md:p-8">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
          {/* Left/Main Card: Calculator or Converter */}
          <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-200 dark:border-slate-800 backdrop-blur-md flex flex-col gap-4">
            {mode === 'converter' ? (
              <UnitConverterPanel
                onInsertToCalculator={(val) => {
                  setExpression(val);
                  setDisplayResult(val);
                  setMode('standard');
                  playSound('action');
                }}
              />
            ) : (
              <>
                {/* Calculator Display */}
                <Display
                  expression={expression}
                  result={displayResult}
                  error={error}
                  mode={mode}
                  angleMode={angleMode}
                  toggleAngleMode={toggleAngleMode}
                  memoryValue={memoryValue}
                  onOpenMemory={() => setIsMemoryOpen(true)}
                  isEvaluated={isEvaluated}
                />

                {/* Tactile Keypad */}
                <Keypad
                  mode={mode}
                  onNumber={handleNumber}
                  onOperator={handleOperator}
                  onEquals={handleEquals}
                  onClear={handleClear}
                  onAllClear={handleAllClear}
                  onBackspace={handleBackspace}
                  onToggleSign={handleToggleSign}
                  onPercentage={handlePercentage}
                  onScientificFunc={handleScientificFunc}
                  onMemoryAction={handleMemoryAction}
                  hasMemory={memoryValue !== 0}
                  activeKey={activeKey}
                />
              </>
            )}
          </div>

          {/* Right Column: Desktop Tape Stream & Quick Shortcuts Widget */}
          <div className="hidden lg:flex flex-col gap-4">
            {/* Desktop Calculation History Tape */}
            <div className="bg-white dark:bg-slate-900/80 rounded-3xl p-5 shadow-lg border border-slate-200 dark:border-slate-800 flex flex-col h-[520px]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <HistoryIcon className="w-4 h-4 text-amber-500" />
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                    Calculation Tape
                  </h3>
                </div>
                {history.length > 0 && (
                  <button
                    onClick={() => setHistory([])}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    title="Clear history"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Tape Scroll List */}
              <div className="flex-1 overflow-y-auto py-3 space-y-2.5 pr-1">
                {history.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400 text-xs">
                    <p>No calculations yet.</p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                      Equations you evaluate with = appear here in real-time.
                    </p>
                  </div>
                ) : (
                  history.map((item) => (
                    <div
                      key={item.id}
                      className="group p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/80 hover:border-amber-400/50 dark:hover:border-amber-500/50 transition-all text-right"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                        <span className="font-mono">
                          {new Date(item.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <button
                          onClick={() => {
                            setExpression(item.expression);
                            setDisplayResult(item.result);
                            setIsEvaluated(false);
                            playSound('action');
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 text-slate-400 hover:text-amber-500"
                          title="Restore expression"
                        >
                          <ArrowRightCircle className="w-3 h-3" />
                        </button>
                      </div>

                      <div
                        className="font-mono text-xs text-slate-500 truncate cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
                        onClick={() => {
                          setExpression(item.expression);
                          setDisplayResult(item.result);
                          setIsEvaluated(false);
                        }}
                      >
                        {item.expression.replace(/\*/g, '×').replace(/\//g, '÷')} =
                      </div>

                      <div
                        className="font-mono-numbers text-base font-bold text-slate-900 dark:text-slate-100 cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                        onClick={() => {
                          handleNumber(item.result);
                        }}
                        title="Click to insert into calculation"
                      >
                        {formatWithCommas(item.result)}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Tape footer */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Click result to insert</span>
                <button
                  onClick={() => setIsHistoryOpen(true)}
                  className="text-amber-600 dark:text-amber-400 hover:underline"
                >
                  Full History
                </button>
              </div>
            </div>

            {/* Quick Pro-Tip Card */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  Keyboard Enabled
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Type on your numpad or keys directly. Press <kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 font-mono text-[10px]">S</kbd> for scientific mode.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Modals */}
      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectResult={(res) => handleNumber(res)}
        onRestoreExpression={(expr) => {
          setExpression(expr);
          setIsEvaluated(false);
        }}
        onClearHistory={() => setHistory([])}
      />

      <MemoryModal
        isOpen={isMemoryOpen}
        onClose={() => setIsMemoryOpen(false)}
        memoryValue={memoryValue}
        currentDisplayValue={displayResult}
        onClearMemory={() => setMemoryValue(0)}
        onRecallMemory={() => handleNumber(String(memoryValue))}
        onAddToMemory={() => {
          const num = parseFloat(displayResult) || 0;
          setMemoryValue((prev) => prev + num);
        }}
        onSubtractFromMemory={() => {
          const num = parseFloat(displayResult) || 0;
          setMemoryValue((prev) => prev - num);
        }}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <GitHubModal
        isOpen={isGitHubOpen}
        onClose={() => setIsGitHubOpen(false)}
      />
    </div>
  );
}
