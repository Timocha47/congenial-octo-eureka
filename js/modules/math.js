export function formatNumber(value) {
  if (value === null || value === undefined || value === '') return '0';
  const number = Number(value);
  if (!Number.isFinite(number)) return 'Error';
  if (Math.abs(number) >= 1e12 || (Math.abs(number) > 0 && Math.abs(number) < 1e-10)) {
    return number.toExponential(8).replace(/\.0+e/, 'e').replace(/(\.\d*?)0+e/, '$1e');
  }
  return Number(number.toFixed(10)).toString();
}

export function performCalculation(first, second, operator) {
  switch (operator) {
    case '+': return first + second;
    case '-': return first - second;
    case '*': return first * second;
    case '/': return second === 0 ? 'Error' : first / second;
    default: return second;
  }
}

export function evaluateExpression(expression) {
  const tokens = expression.match(/\d*\.?\d+|[()+\-*/]/g);
  if (!tokens || tokens.join('') !== expression.replace(/\s/g, '')) throw new Error('Invalid expression');
  let position = 0;

  function parsePrimary() {
    const token = tokens[position];
    if (token === '(') {
      position += 1;
      const value = parseAdditive();
      if (tokens[position] !== ')') throw new Error('Missing parenthesis');
      position += 1;
      return value;
    }
    if (token === '+' || token === '-') {
      position += 1;
      const value = parsePrimary();
      return token === '-' ? -value : value;
    }
    if (!token || !/^\d*\.?\d+$/.test(token)) throw new Error('Invalid number');
    position += 1;
    return Number(token);
  }

  function parseMultiplicative() {
    let value = parsePrimary();
    while (tokens[position] === '*' || tokens[position] === '/') {
      const operator = tokens[position++];
      const nextValue = parsePrimary();
      if (operator === '/' && nextValue === 0) throw new Error('Division by zero');
      value = operator === '*' ? value * nextValue : value / nextValue;
    }
    return value;
  }

  function parseAdditive() {
    let value = parseMultiplicative();
    while (tokens[position] === '+' || tokens[position] === '-') {
      const operator = tokens[position++];
      const nextValue = parseMultiplicative();
      value = operator === '+' ? value + nextValue : value - nextValue;
    }
    return value;
  }

  const result = parseAdditive();
  if (position !== tokens.length || !Number.isFinite(result)) throw new Error('Invalid expression');
  return result;
}
