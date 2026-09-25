const display = document.getElementById('display');
const expression = document.getElementById('expression');
const historyList = document.getElementById('history');
const clearHistoryButton = document.getElementById('clear-history');

const state = {
  currentValue: '0',
  previousValue: null,
  operator: null,
  awaitingNextValue: false,
  lastExpression: '0',
  history: []
};

function isErrorState() {
  return state.currentValue === 'Error';
}

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return 'Error';
  }

  return Number(value.toFixed(10)).toString();
}

function render() {
  display.textContent = state.currentValue;
  expression.textContent = state.lastExpression;

  if (!state.history.length) {
    const emptyItem = document.createElement('li');
    emptyItem.className = 'history__empty';
    emptyItem.textContent = 'No calculations yet.';
    historyList.replaceChildren(emptyItem);
    return;
  }

  historyList.replaceChildren(
    ...state.history.map((entry) => {
      const item = document.createElement('li');
      item.textContent = entry;
      return item;
    })
  );
}

function resetCalculator() {
  state.currentValue = '0';
  state.previousValue = null;
  state.operator = null;
  state.awaitingNextValue = false;
  state.lastExpression = '0';
  render();
}

function inputNumber(number) {
  if (isErrorState()) {
    resetCalculator();
  }

  if (state.awaitingNextValue) {
    state.currentValue = number;
    state.awaitingNextValue = false;
  } else {
    state.currentValue = state.currentValue === '0' ? number : `${state.currentValue}${number}`;
  }

  state.lastExpression = state.operator && state.previousValue !== null
    ? `${state.previousValue} ${state.operator} ${state.currentValue}`
    : state.currentValue;
}

function inputDecimal() {
  if (isErrorState()) {
    resetCalculator();
  }

  if (state.awaitingNextValue) {
    state.currentValue = '0.';
    state.awaitingNextValue = false;
  } else if (!state.currentValue.includes('.')) {
    state.currentValue = `${state.currentValue}.`;
  }

  state.lastExpression = state.operator && state.previousValue !== null
    ? `${state.previousValue} ${state.operator} ${state.currentValue}`
    : state.currentValue;
}

function deleteLastDigit() {
  if (state.awaitingNextValue || isErrorState()) {
    return;
  }

  state.currentValue = state.currentValue.length > 1 ? state.currentValue.slice(0, -1) : '0';
  state.lastExpression = state.operator && state.previousValue !== null
    ? `${state.previousValue} ${state.operator} ${state.currentValue}`
    : state.currentValue;
}

function toggleSign() {
  if (state.currentValue === '0' || isErrorState()) {
    return;
  }

  state.currentValue = state.currentValue.startsWith('-')
    ? state.currentValue.slice(1)
    : `-${state.currentValue}`;

  state.lastExpression = state.operator && state.previousValue !== null
    ? `${state.previousValue} ${state.operator} ${state.currentValue}`
    : state.currentValue;
}

function convertPercent() {
  if (isErrorState()) {
    return;
  }

  state.currentValue = formatNumber(Number(state.currentValue) / 100);
  state.lastExpression = state.operator && state.previousValue !== null
    ? `${state.previousValue} ${state.operator} ${state.currentValue}`
    : state.currentValue;
}

function calculate(firstValue, secondValue, operator) {
  const operations = {
    '+': firstValue + secondValue,
    '-': firstValue - secondValue,
    '*': firstValue * secondValue,
    '/': secondValue === 0 ? Infinity : firstValue / secondValue
  };

  return operations[operator];
}

function chooseOperator(nextOperator) {
  if (isErrorState()) {
    return;
  }

  const inputValue = Number(state.currentValue);

  if (state.operator && !state.awaitingNextValue) {
    const result = calculate(Number(state.previousValue), inputValue, state.operator);
    state.currentValue = formatNumber(result);

    if (isErrorState()) {
      state.previousValue = null;
      state.operator = null;
      state.awaitingNextValue = false;
      state.lastExpression = state.currentValue;
      return;
    }

    state.previousValue = state.currentValue;
  } else {
    state.previousValue = state.currentValue;
  }

  state.operator = nextOperator;
  state.awaitingNextValue = true;
  state.lastExpression = `${state.previousValue} ${state.operator}`;
}

function runCalculation() {
  if (!state.operator || state.previousValue === null || state.awaitingNextValue || isErrorState()) {
    return;
  }

  const firstValue = Number(state.previousValue);
  const secondValue = Number(state.currentValue);
  const result = calculate(firstValue, secondValue, state.operator);
  const formatted = formatNumber(result);
  const historyEntry = `${firstValue} ${state.operator} ${secondValue} = ${formatted}`;

  state.history = [historyEntry, ...state.history].slice(0, 8);
  state.currentValue = formatted;
  state.previousValue = null;
  state.operator = null;
  state.awaitingNextValue = false;
  state.lastExpression = historyEntry;
}

document.querySelector('.keypad').addEventListener('click', (event) => {
  const { target } = event;

  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const { number, operator, action } = target.dataset;

  if (number) {
    inputNumber(number);
  } else if (operator) {
    chooseOperator(operator);
  } else {
    const actions = {
      clear: resetCalculator,
      delete: deleteLastDigit,
      sign: toggleSign,
      percent: convertPercent,
      decimal: inputDecimal,
      calculate: runCalculation
    };

    actions[action]?.();
  }

  render();
});

clearHistoryButton.addEventListener('click', () => {
  state.history = [];
  render();
});

render();
