import { UnitCategory } from '../types';

export const UNIT_CATEGORIES: UnitCategory[] = [
  {
    id: 'length',
    name: 'Length',
    icon: 'Ruler',
    baseUnit: 'm',
    units: [
      { id: 'm', name: 'Meters', symbol: 'm', ratioToBase: 1 },
      { id: 'km', name: 'Kilometers', symbol: 'km', ratioToBase: 1000 },
      { id: 'cm', name: 'Centimeters', symbol: 'cm', ratioToBase: 0.01 },
      { id: 'mm', name: 'Millimeters', symbol: 'mm', ratioToBase: 0.001 },
      { id: 'mi', name: 'Miles', symbol: 'mi', ratioToBase: 1609.344 },
      { id: 'yd', name: 'Yards', symbol: 'yd', ratioToBase: 0.9144 },
      { id: 'ft', name: 'Feet', symbol: 'ft', ratioToBase: 0.3048 },
      { id: 'in', name: 'Inches', symbol: 'in', ratioToBase: 0.0254 },
      { id: 'nmi', name: 'Nautical Miles', symbol: 'NM', ratioToBase: 1852 },
    ],
  },
  {
    id: 'weight',
    name: 'Mass & Weight',
    icon: 'Scale',
    baseUnit: 'kg',
    units: [
      { id: 'kg', name: 'Kilograms', symbol: 'kg', ratioToBase: 1 },
      { id: 'g', name: 'Grams', symbol: 'g', ratioToBase: 0.001 },
      { id: 'mg', name: 'Milligrams', symbol: 'mg', ratioToBase: 0.000001 },
      { id: 't', name: 'Metric Tons', symbol: 't', ratioToBase: 1000 },
      { id: 'lb', name: 'Pounds', symbol: 'lb', ratioToBase: 0.45359237 },
      { id: 'oz', name: 'Ounces', symbol: 'oz', ratioToBase: 0.028349523125 },
      { id: 'st', name: 'Stones', symbol: 'st', ratioToBase: 6.35029318 },
    ],
  },
  {
    id: 'temperature',
    name: 'Temperature',
    icon: 'Thermometer',
    baseUnit: 'c',
    units: [
      { id: 'c', name: 'Celsius', symbol: '°C', ratioToBase: 1 },
      { id: 'f', name: 'Fahrenheit', symbol: '°F', ratioToBase: 1 },
      { id: 'k', name: 'Kelvin', symbol: 'K', ratioToBase: 1 },
    ],
  },
  {
    id: 'area',
    name: 'Area',
    icon: 'Square',
    baseUnit: 'sqm',
    units: [
      { id: 'sqm', name: 'Square Meters', symbol: 'm²', ratioToBase: 1 },
      { id: 'sqkm', name: 'Square Kilometers', symbol: 'km²', ratioToBase: 1000000 },
      { id: 'sqft', name: 'Square Feet', symbol: 'ft²', ratioToBase: 0.092903 },
      { id: 'sqmi', name: 'Square Miles', symbol: 'mi²', ratioToBase: 2589988.11 },
      { id: 'acre', name: 'Acres', symbol: 'ac', ratioToBase: 4046.8564224 },
      { id: 'ha', name: 'Hectares', symbol: 'ha', ratioToBase: 10000 },
    ],
  },
  {
    id: 'volume',
    name: 'Volume',
    icon: 'CupSoda',
    baseUnit: 'l',
    units: [
      { id: 'l', name: 'Liters', symbol: 'L', ratioToBase: 1 },
      { id: 'ml', name: 'Milliliters', symbol: 'mL', ratioToBase: 0.001 },
      { id: 'cum', name: 'Cubic Meters', symbol: 'm³', ratioToBase: 1000 },
      { id: 'gal', name: 'Gallons (US)', symbol: 'gal', ratioToBase: 3.78541 },
      { id: 'qt', name: 'Quarts (US)', symbol: 'qt', ratioToBase: 0.946353 },
      { id: 'pt', name: 'Pints (US)', symbol: 'pt', ratioToBase: 0.473176 },
      { id: 'cup', name: 'Cups (US)', symbol: 'cup', ratioToBase: 0.236588 },
      { id: 'floz', name: 'Fluid Ounces (US)', symbol: 'fl oz', ratioToBase: 0.0295735 },
    ],
  },
  {
    id: 'speed',
    name: 'Speed',
    icon: 'Gauge',
    baseUnit: 'mps',
    units: [
      { id: 'mps', name: 'Meters per Second', symbol: 'm/s', ratioToBase: 1 },
      { id: 'kmh', name: 'Kilometers per Hour', symbol: 'km/h', ratioToBase: 0.277778 },
      { id: 'mph', name: 'Miles per Hour', symbol: 'mph', ratioToBase: 0.44704 },
      { id: 'knot', name: 'Knots', symbol: 'kn', ratioToBase: 0.514444 },
    ],
  },
  {
    id: 'time',
    name: 'Time',
    icon: 'Clock',
    baseUnit: 's',
    units: [
      { id: 'ms', name: 'Milliseconds', symbol: 'ms', ratioToBase: 0.001 },
      { id: 's', name: 'Seconds', symbol: 's', ratioToBase: 1 },
      { id: 'min', name: 'Minutes', symbol: 'min', ratioToBase: 60 },
      { id: 'hr', name: 'Hours', symbol: 'h', ratioToBase: 3600 },
      { id: 'day', name: 'Days', symbol: 'd', ratioToBase: 86400 },
      { id: 'wk', name: 'Weeks', symbol: 'wk', ratioToBase: 604800 },
      { id: 'yr', name: 'Years', symbol: 'yr', ratioToBase: 31536000 },
    ],
  },
  {
    id: 'data',
    name: 'Data Storage',
    icon: 'HardDrive',
    baseUnit: 'b',
    units: [
      { id: 'b', name: 'Bytes', symbol: 'B', ratioToBase: 1 },
      { id: 'kb', name: 'Kilobytes', symbol: 'KB', ratioToBase: 1024 },
      { id: 'mb', name: 'Megabytes', symbol: 'MB', ratioToBase: 1048576 },
      { id: 'gb', name: 'Gigabytes', symbol: 'GB', ratioToBase: 1073741824 },
      { id: 'tb', name: 'Terabytes', symbol: 'TB', ratioToBase: 1099511627776 },
    ],
  },
];

export function convertUnits(
  categoryId: string,
  fromUnitId: string,
  toUnitId: string,
  amount: number
): number {
  if (isNaN(amount)) return 0;
  if (fromUnitId === toUnitId) return amount;

  if (categoryId === 'temperature') {
    // Celsius as base
    let celsius = 0;
    if (fromUnitId === 'c') celsius = amount;
    else if (fromUnitId === 'f') celsius = (amount - 32) * (5 / 9);
    else if (fromUnitId === 'k') celsius = amount - 273.15;

    if (toUnitId === 'c') return celsius;
    if (toUnitId === 'f') return celsius * (9 / 5) + 32;
    if (toUnitId === 'k') return celsius + 273.15;
    return celsius;
  }

  const category = UNIT_CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return amount;

  const fromUnit = category.units.find((u) => u.id === fromUnitId);
  const toUnit = category.units.find((u) => u.id === toUnitId);

  if (!fromUnit || !toUnit) return amount;

  // Convert to base unit then to target unit
  const baseValue = amount * fromUnit.ratioToBase;
  const targetValue = baseValue / toUnit.ratioToBase;

  return Number(targetValue.toPrecision(10));
}
