import React, { useState } from 'react';
import { UNIT_CATEGORIES, convertUnits } from '../utils/unitConverter';
import {
  ArrowRightLeft,
  Copy,
  Check,
  CornerDownRight,
  Ruler,
  Scale,
  Thermometer,
  Square,
  CupSoda,
  Gauge,
  Clock,
  HardDrive,
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface UnitConverterPanelProps {
  onInsertToCalculator: (val: string) => void;
}

const CATEGORY_ICONS: Record<string, React.FC<{ className?: string }>> = {
  length: Ruler,
  weight: Scale,
  temperature: Thermometer,
  area: Square,
  volume: CupSoda,
  speed: Gauge,
  time: Clock,
  data: HardDrive,
};

export const UnitConverterPanel: React.FC<UnitConverterPanelProps> = ({
  onInsertToCalculator,
}) => {
  const [selectedCatId, setSelectedCatId] = useState('length');
  const category =
    UNIT_CATEGORIES.find((c) => c.id === selectedCatId) || UNIT_CATEGORIES[0];

  const [fromUnitId, setFromUnitId] = useState(category.units[0].id);
  const [toUnitId, setToUnitId] = useState(
    category.units[1]?.id || category.units[0].id
  );
  const [inputValue, setInputValue] = useState('1');
  const [copied, setCopied] = useState(false);

  // Switch category
  const handleCategorySelect = (id: string) => {
    setSelectedCatId(id);
    const newCat = UNIT_CATEGORIES.find((c) => c.id === id) || UNIT_CATEGORIES[0];
    setFromUnitId(newCat.units[0].id);
    setToUnitId(newCat.units[1]?.id || newCat.units[0].id);
    soundManager.play('action');
  };

  // Swap units
  const handleSwap = () => {
    setFromUnitId(toUnitId);
    setToUnitId(fromUnitId);
    soundManager.play('action');
  };

  const numericInput = parseFloat(inputValue) || 0;
  const result = convertUnits(
    selectedCatId,
    fromUnitId,
    toUnitId,
    numericInput
  );

  const fromUnit = category.units.find((u) => u.id === fromUnitId);
  const toUnit = category.units.find((u) => u.id === toUnitId);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(result));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Category selector row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {UNIT_CATEGORIES.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.id] || Ruler;
          const isSelected = cat.id === selectedCatId;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Conversion Cards & Swap */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-3">
        {/* From Box */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col gap-2">
          <label className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            From
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full text-2xl font-mono-numbers font-semibold bg-transparent text-slate-900 dark:text-slate-100 outline-none"
              placeholder="0"
            />
          </div>
          <select
            value={fromUnitId}
            onChange={(e) => setFromUnitId(e.target.value)}
            className="w-full mt-1 p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-700 outline-none cursor-pointer"
          >
            {category.units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center my-1 md:my-0">
          <button
            onClick={handleSwap}
            className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all shadow-xs active:scale-95"
            title="Swap Units"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>

        {/* To Box */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Converted Result
            </label>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 p-1 px-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
                title="Copy result"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="text-2xl font-mono-numbers font-semibold text-amber-400 truncate py-0.5">
            {result}
          </div>

          <select
            value={toUnitId}
            onChange={(e) => setToUnitId(e.target.value)}
            className="w-full mt-1 p-2 rounded-lg bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700 outline-none cursor-pointer"
          >
            {category.units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Formula & Send to Calculator */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs">
        <div className="text-slate-600 dark:text-slate-400 font-mono">
          <span className="font-semibold text-slate-900 dark:text-slate-200">
            {inputValue || 0} {fromUnit?.symbol}
          </span>{' '}
          ={' '}
          <span className="font-semibold text-amber-600 dark:text-amber-400">
            {result} {toUnit?.symbol}
          </span>
        </div>

        <button
          onClick={() => onInsertToCalculator(String(result))}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors text-xs font-medium"
        >
          <CornerDownRight className="w-3.5 h-3.5 text-amber-400" />
          <span>Insert into Calculator</span>
        </button>
      </div>

      {/* Quick Common Conversions Matrix */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
        <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
          Common {category.name} Equivalents
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono text-slate-600 dark:text-slate-400">
          {category.units.slice(0, 6).map((u) => {
            const equiv = convertUnits(selectedCatId, fromUnitId, u.id, 1);
            return (
              <div
                key={u.id}
                className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800"
              >
                <div className="text-slate-400 text-[10px]">1 {fromUnit?.symbol} in {u.name}</div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 font-mono-numbers">
                  {equiv} {u.symbol}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
