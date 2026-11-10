export type CalculatorMode = 'standard' | 'scientific' | 'converter';

export type AngleMode = 'deg' | 'rad';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  ratioToBase: number; // For linear conversion: valueInBase = val * ratioToBase
  offset?: number;     // For temperature: valueInBase = (val + offset) * ratioToBase
}

export interface UnitCategory {
  id: string;
  name: string;
  icon: string;
  baseUnit: string;
  units: UnitDefinition[];
}
