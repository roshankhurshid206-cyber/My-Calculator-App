import React from 'react';
import { CalculatorMode } from '../types';
import { Volume2, VolumeX, Moon, Sun, Keyboard, Github, History, RotateCcw } from 'lucide-react';

interface HeaderProps {
  mode: CalculatorMode;
  setMode: (mode: CalculatorMode) => void;
  isDark: boolean;
  toggleDark: () => void;
  isSoundEnabled: boolean;
  toggleSound: () => void;
  onOpenHistory: () => void;
  onOpenShortcuts: () => void;
  onOpenGitHub: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  setMode,
  isDark,
  toggleDark,
  isSoundEnabled,
  toggleSound,
  onOpenHistory,
  onOpenShortcuts,
  onOpenGitHub,
  historyCount,
}) => {
  return (
    <header className="flex items-center justify-between gap-4 md:gap-8 px-4 md:px-8 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 transition-colors">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-2 shrink-0">
        <a href="/" className="flex items-center gap-2 group text-slate-900 dark:text-slate-100">
          <div className="w-8 h-8 rounded-lg bg-amber-500 dark:bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-sm shadow-sm font-mono-numbers">
            ±
          </div>
          <span className="text-base md:text-lg font-bold tracking-tight whitespace-nowrap">
            Precision<span className="text-amber-600 dark:text-amber-400">Calc</span>
          </span>
        </a>
      </div>

      {/* Zone 2: Navigation tabs (Standard, Scientific, Unit Converter) */}
      <nav className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs md:text-sm font-medium">
        <button
          onClick={() => setMode('standard')}
          className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
            mode === 'standard'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          title="Standard 4-function & business calculator"
        >
          Standard
        </button>
        <button
          onClick={() => setMode('scientific')}
          className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
            mode === 'scientific'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          title="Scientific functions, powers, roots & trigonometry"
        >
          Scientific
        </button>
        <button
          onClick={() => setMode('converter')}
          className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
            mode === 'converter'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          title="Unit converter for length, mass, temperature, speed, etc."
        >
          Unit Converter
        </button>
      </nav>

      {/* Zone 3: Functional utilities */}
      <div className="flex items-center gap-1 md:gap-2 shrink-0">
        {/* History button */}
        <button
          onClick={onOpenHistory}
          className="relative p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Calculation History Tape"
          aria-label="History"
        >
          <History className="w-4 h-4 md:w-4.5 md:h-4.5" />
          {historyCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
          )}
        </button>

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isSoundEnabled ? 'Mute sound effects' : 'Enable tactile audio clicks'}
          aria-label="Toggle sound"
        >
          {isSoundEnabled ? (
            <Volume2 className="w-4 h-4 md:w-4.5 md:h-4.5 text-amber-600 dark:text-amber-400" />
          ) : (
            <VolumeX className="w-4 h-4 md:w-4.5 md:h-4.5 text-slate-400" />
          )}
        </button>

        {/* Keyboard Shortcuts */}
        <button
          onClick={onOpenShortcuts}
          className="hidden sm:flex p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="View Keyboard Shortcuts"
          aria-label="Keyboard Shortcuts"
        >
          <Keyboard className="w-4 h-4 md:w-4.5 md:h-4.5" />
        </button>

        {/* Dark/Light Theme */}
        <button
          onClick={toggleDark}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme"
        >
          {isDark ? (
            <Sun className="w-4 h-4 md:w-4.5 md:h-4.5 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 md:w-4.5 md:h-4.5" />
          )}
        </button>

        {/* GitHub & Push modal button */}
        <button
          onClick={onOpenGitHub}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white transition-colors ml-1"
          title="Push to your GitHub repository"
        >
          <Github className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">GitHub</span>
        </button>
      </div>
    </header>
  );
};
