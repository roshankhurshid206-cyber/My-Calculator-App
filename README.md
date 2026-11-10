# PrecisionCalc

A modern, tactile, and feature-complete Standard & Scientific Calculator built with React 19, TypeScript, and Tailwind CSS.

![PrecisionCalc](https://img.shields.io/badge/PrecisionCalc-v1.0.0-amber-500?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)

---

## 🌟 Key Features

### 1. Standard Arithmetic Engine
- **Basic Operations**: Addition (`+`), Subtraction (`−`), Multiplication (`×`), Division (`÷`), Percentage (`%`), Equals (`=`).
- **Clear Controls**: All Clear (`AC`), Entry Clear (`C`), and Backspace (`⌫`).
- **Precision Formatting**: Accurate floating-point calculation without IEEE 754 float artifacts (e.g. `0.1 + 0.2 = 0.3`), thousand grouping commas (`1,234,567.89`), dynamic text resizing to prevent screen overflow.
- **Copy to Clipboard**: Quick 1-click copy of results with instant visual toast.

### 2. Scientific Calculator Mode
- **Powers & Roots**: $x^2$, $x^y$, $\sqrt{x}$, $1/x$.
- **Trigonometry**: $\sin$, $\cos$, $\tan$, $\arcsin$, $\arccos$, $\arctan$ with instantaneous **DEG** / **RAD** angle switching.
- **Logarithms & Exponentials**: Natural $\ln(x)$, $\log_{10}(x)$, $e$, $\pi$.
- **Advanced Math**: Factorials ($n!$), absolute values ($|x|$), parentheses nesting `(` and `)`.

### 3. Dedicated Memory Registers
- `MC`: Memory Clear
- `MR`: Memory Recall
- `M+`: Memory Add
- `M-`: Memory Subtract
- `MS`: Memory Store
- Active indicator `[M]` on display with an interactive inspector modal.

### 4. Live Calculation History Tape
- Real-time tape of all completed calculations with timestamps.
- **1-Click Reuse**: Tap any past result to insert directly into your current calculation.
- **Expression Reloading**: Restore past formulas to recalculate or tweak.
- **Export Tape**: Download calculations as `.txt` or clear history.

### 5. Multi-Category Unit Converter
- **Length**: Meters, Kilometers, Centimeters, Millimeters, Miles, Yards, Feet, Inches, Nautical Miles.
- **Mass & Weight**: Kilograms, Grams, Milligrams, Metric Tons, Pounds, Ounces, Stones.
- **Temperature**: Celsius, Fahrenheit, Kelvin.
- **Area**: Square meters, Square kilometers, Square feet, Square miles, Acres, Hectares.
- **Volume**: Liters, Milliliters, Cubic meters, US Gallons, Quarts, Pints, Cups, Fluid ounces.
- **Speed**: m/s, km/h, mph, Knots.
- **Time**: Milliseconds, Seconds, Minutes, Hours, Days, Weeks, Years.
- **Data Storage**: Bytes, KB, MB, GB, TB.
- 1-click **Insert into Calculator** button to seamlessly transition between conversions and equations.

### 6. Tactile Audio Feedback & Haptics
- Synthesized Web Audio API acoustic feedback for mechanical click feel (custom frequency profiles for digits, operators, clear, and equals).
- Native device vibration support via `navigator.vibrate`.
- Can be muted anytime via the header volume toggle.

### 7. Full Keyboard Navigation
| Key | Action |
| --- | --- |
| `0` – `9` | Enter numbers |
| `+`, `-`, `*`, `/` | Arithmetic operators |
| `Enter` or `=` | Calculate equals |
| `Backspace` | Delete last character |
| `Escape` | All Clear (AC) |
| `C` | Clear entry (C) |
| `.` | Decimal point |
| `%` | Percentage |
| `(` and `)` | Parentheses |
| `^` | Power ($x^y$) |
| `S` | Toggle Scientific mode |
| `H` | Toggle History Tape |
| `M` | Open Memory Register |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or bun

### Installation
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/precision-calc.git

# Enter project directory
cd precision-calc

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 🛠️ Tech Stack
- **Framework**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Animations**: Motion
- **Acoustic Feedback**: Web Audio API
- **Build Tool**: Vite
