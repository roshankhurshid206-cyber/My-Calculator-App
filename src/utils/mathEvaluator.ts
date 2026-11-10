import { AngleMode } from '../types';

/**
 * High precision, robust mathematical tokenizer and expression evaluator
 */

// Factorial helper
function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) throw new Error('Invalid factorial input');
  if (n > 170) return Infinity; // JS Number max
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) {
    res *= i;
  }
  return res;
}

// Format number to remove floating-point artifacts and format nicely
export function formatResult(num: number): string {
  if (isNaN(num)) return 'Error';
  if (!isFinite(num)) return num > 0 ? 'Infinity' : '-Infinity';

  // Fix common float inaccuracies like 0.1 + 0.2 = 0.30000000000000004
  const rounded = Number(num.toPrecision(12));
  
  // If extreme magnitude, use exponential
  if (Math.abs(rounded) >= 1e14 || (Math.abs(rounded) > 0 && Math.abs(rounded) < 1e-7)) {
    return rounded.toExponential(6).replace(/\.?0+e/, 'e');
  }

  // Convert to string and strip trailing zeroes after decimal
  let str = rounded.toString();
  if (str.includes('.') && !str.includes('e')) {
    str = str.replace(/0+$/, '').replace(/\.$/, '');
  }
  return str;
}

export function formatWithCommas(valStr: string): string {
  if (valStr === 'Error' || valStr === 'Infinity' || valStr === '-Infinity' || valStr.includes('e')) {
    return valStr;
  }
  const parts = valStr.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

type TokenType = 'NUMBER' | 'OP' | 'FUNC' | 'LPAREN' | 'RPAREN' | 'COMMA';

interface Token {
  type: TokenType;
  value: string;
}

export function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const clean = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, `${Math.PI}`)
    .replace(/e(?![a-z])/g, `${Math.E}`);

  while (i < clean.length) {
    const ch = clean[i];

    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    // Number (including decimal and percentage)
    if (/\d|\./.test(ch)) {
      let numStr = '';
      while (i < clean.length && (/\d|\./.test(clean[i]))) {
        numStr += clean[i];
        i++;
      }
      tokens.push({ type: 'NUMBER', value: numStr });
      continue;
    }

    // Function names or identifiers (sin, cos, tan, asin, acos, atan, sqrt, cbrt, ln, log, abs, fact)
    if (/[a-zA-Z]/.test(ch)) {
      let ident = '';
      while (i < clean.length && /[a-zA-Z0-9]/.test(clean[i])) {
        ident += clean[i];
        i++;
      }
      tokens.push({ type: 'FUNC', value: ident.toLowerCase() });
      continue;
    }

    // Parentheses
    if (ch === '(') {
      tokens.push({ type: 'LPAREN', value: '(' });
      i++;
      continue;
    }
    if (ch === ')') {
      tokens.push({ type: 'RPAREN', value: ')' });
      i++;
      continue;
    }

    // Operators
    if ('+-*/%^!'.includes(ch)) {
      tokens.push({ type: 'OP', value: ch });
      i++;
      continue;
    }

    i++;
  }

  return tokens;
}

const PRECEDENCE: Record<string, number> = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
  '%': 2,
  '^': 3,
  'u-': 4, // Unary minus
  '!': 5,  // Postfix factorial
};

/**
 * Shunting-Yard Parser & Evaluator
 */
export function evaluateExpression(expr: string, angleMode: AngleMode = 'deg'): { success: boolean; result?: number; error?: string } {
  if (!expr || expr.trim() === '') {
    return { success: true, result: 0 };
  }

  try {
    let cleanExpr = expr;
    // Auto-close missing parentheses
    const openParenCount = (cleanExpr.match(/\(/g) || []).length;
    const closeParenCount = (cleanExpr.match(/\)/g) || []).length;
    if (openParenCount > closeParenCount) {
      cleanExpr += ')'.repeat(openParenCount - closeParenCount);
    }

    const tokens = tokenize(cleanExpr);
    if (tokens.length === 0) return { success: true, result: 0 };

    // Process tokens into postfix (RPN) while distinguishing unary minus
    const outputQueue: Token[] = [];
    const operatorStack: Token[] = [];

    for (let idx = 0; idx < tokens.length; idx++) {
      const token = tokens[idx];
      const prevToken = idx > 0 ? tokens[idx - 1] : null;

      if (token.type === 'NUMBER') {
        outputQueue.push(token);
      } else if (token.type === 'FUNC') {
        operatorStack.push(token);
      } else if (token.type === 'OP') {
        let op = token.value;
        // Check for unary minus: at start or after another operator or after '('
        if (op === '-' && (!prevToken || prevToken.type === 'OP' || prevToken.type === 'LPAREN')) {
          op = 'u-';
        }

        const currPrec = PRECEDENCE[op] || 0;
        while (operatorStack.length > 0) {
          const top = operatorStack[operatorStack.length - 1];
          if (top.type === 'OP') {
            const topPrec = PRECEDENCE[top.value] || 0;
            // Left-associative unless power (^) or unary minus
            const isRightAssoc = op === '^' || op === 'u-';
            if ((!isRightAssoc && currPrec <= topPrec) || (isRightAssoc && currPrec < topPrec)) {
              outputQueue.push(operatorStack.pop()!);
            } else {
              break;
            }
          } else if (top.type === 'FUNC') {
            outputQueue.push(operatorStack.pop()!);
          } else {
            break;
          }
        }
        operatorStack.push({ type: 'OP', value: op });
      } else if (token.type === 'LPAREN') {
        // If previous token was a number or closing paren, insert implicit multiplication
        if (prevToken && (prevToken.type === 'NUMBER' || prevToken.type === 'RPAREN')) {
          while (operatorStack.length > 0) {
            const top = operatorStack[operatorStack.length - 1];
            if (top.type === 'OP' && (PRECEDENCE[top.value] || 0) >= PRECEDENCE['*']) {
              outputQueue.push(operatorStack.pop()!);
            } else {
              break;
            }
          }
          operatorStack.push({ type: 'OP', value: '*' });
        }
        operatorStack.push(token);
      } else if (token.type === 'RPAREN') {
        while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].type !== 'LPAREN') {
          outputQueue.push(operatorStack.pop()!);
        }
        if (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].type === 'LPAREN') {
          operatorStack.pop(); // Discard '('
        }
        if (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].type === 'FUNC') {
          outputQueue.push(operatorStack.pop()!);
        }
      }
    }

    while (operatorStack.length > 0) {
      const top = operatorStack.pop()!;
      if (top.type !== 'LPAREN' && top.type !== 'RPAREN') {
        outputQueue.push(top);
      }
    }

    // Evaluate RPN
    const evalStack: number[] = [];

    const toRadians = (deg: number) => (deg * Math.PI) / 180;
    const toDegrees = (rad: number) => (rad * 180) / Math.PI;

    for (const item of outputQueue) {
      if (item.type === 'NUMBER') {
        evalStack.push(parseFloat(item.value));
      } else if (item.type === 'OP') {
        if (item.value === 'u-') {
          const a = evalStack.pop() ?? 0;
          evalStack.push(-a);
        } else if (item.value === '!') {
          const a = evalStack.pop();
          if (a === undefined) throw new Error('Missing operand for factorial');
          evalStack.push(factorial(a));
        } else {
          const b = evalStack.pop();
          const a = evalStack.pop();
          if (a === undefined || b === undefined) throw new Error('Malformed expression');

          switch (item.value) {
            case '+':
              evalStack.push(a + b);
              break;
            case '-':
              evalStack.push(a - b);
              break;
            case '*':
              evalStack.push(a * b);
              break;
            case '/':
              if (b === 0) return { success: false, error: 'Cannot divide by 0' };
              evalStack.push(a / b);
              break;
            case '%':
              evalStack.push(a % b);
              break;
            case '^':
              evalStack.push(Math.pow(a, b));
              break;
            default:
              throw new Error(`Unknown operator ${item.value}`);
          }
        }
      } else if (item.type === 'FUNC') {
        const val = evalStack.pop();
        if (val === undefined) throw new Error(`Missing argument for ${item.value}`);

        switch (item.value) {
          case 'sin': {
            const rad = angleMode === 'deg' ? toRadians(val) : val;
            evalStack.push(Math.sin(rad));
            break;
          }
          case 'cos': {
            const rad = angleMode === 'deg' ? toRadians(val) : val;
            // Clean up 90 deg cos near zero
            const res = Math.cos(rad);
            evalStack.push(Math.abs(res) < 1e-15 ? 0 : res);
            break;
          }
          case 'tan': {
            const rad = angleMode === 'deg' ? toRadians(val) : val;
            if (angleMode === 'deg' && Math.abs(val % 180) === 90) {
              return { success: false, error: 'Undefined (tan 90°)' };
            }
            evalStack.push(Math.tan(rad));
            break;
          }
          case 'asin': {
            if (val < -1 || val > 1) return { success: false, error: 'Domain Error' };
            const rad = Math.asin(val);
            evalStack.push(angleMode === 'deg' ? toDegrees(rad) : rad);
            break;
          }
          case 'acos': {
            if (val < -1 || val > 1) return { success: false, error: 'Domain Error' };
            const rad = Math.acos(val);
            evalStack.push(angleMode === 'deg' ? toDegrees(rad) : rad);
            break;
          }
          case 'atan': {
            const rad = Math.atan(val);
            evalStack.push(angleMode === 'deg' ? toDegrees(rad) : rad);
            break;
          }
          case 'sqrt': {
            if (val < 0) return { success: false, error: 'Invalid Root (<0)' };
            evalStack.push(Math.sqrt(val));
            break;
          }
          case 'cbrt':
            evalStack.push(Math.cbrt(val));
            break;
          case 'ln': {
            if (val <= 0) return { success: false, error: 'Domain Error (ln ≤ 0)' };
            evalStack.push(Math.log(val));
            break;
          }
          case 'log': {
            if (val <= 0) return { success: false, error: 'Domain Error (log ≤ 0)' };
            evalStack.push(Math.log10(val));
            break;
          }
          case 'abs':
            evalStack.push(Math.abs(val));
            break;
          case 'fact':
            evalStack.push(factorial(val));
            break;
          case 'exp':
            evalStack.push(Math.exp(val));
            break;
          default:
            throw new Error(`Unknown function ${item.value}`);
        }
      }
    }

    if (evalStack.length !== 1) {
      return { success: false, error: 'Syntax Error' };
    }

    const finalResult = evalStack[0];
    if (isNaN(finalResult)) {
      return { success: false, error: 'Math Error' };
    }

    return { success: true, result: finalResult };
  } catch (err) {
    return { success: false, error: (err as Error).message || 'Invalid Expression' };
  }
}
