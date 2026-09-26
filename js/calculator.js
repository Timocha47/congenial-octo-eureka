const { evaluateExpression, formatNumber, performCalculation } = window.CalcMath;
const { parseNumericInput } = window.CalcValidation;
const { animateNumber } = window.CalcAnimations;

const initCalculator = () => {
  const body = document.body || document.querySelector('body');
  if (!body) return;

  const display = document.getElementById('display');
  const expressionText = document.getElementById('expressionText');
  const themeToggle = document.getElementById('themeToggle');
  const fxToggle = document.getElementById('fxToggle');
  const historyList = document.getElementById('historyList');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');
  const memoryStorageKey = 'timur-industries-calculator-memory';
  let savedMemory = 0;
  try {
    savedMemory = Number(localStorage.getItem(memoryStorageKey));
  } catch (error) {
    savedMemory = 0;
  }

  const state = {
    displayValue: '0',
    firstValue: null,
    operator: null,
    expression: null,
    waitingForSecondValue: false,
    memory: Number.isFinite(savedMemory) ? savedMemory : 0,
    memoryRecallPresses: 0,
    history: [],
    angleMode: 'DEG',
    currentTab: 'standard',
    scientificVisible: false,
    percentPending: false,
  };

  function saveMemory() {
    localStorage.setItem(memoryStorageKey, String(state.memory));
  }

  function updateDisplay() {
    if (state.expression !== null) {
      display.textContent = state.expression || '0';
    } else {
      animateNumber(display, state.displayValue, formatNumber);
    }
    const expressionLabel = state.expression !== null ? 'Expression' : state.operator && state.firstValue !== null
      ? `${formatNumber(state.firstValue)} ${state.operator}`
      : '';
    expressionText.textContent = expressionLabel;
    expressionText.classList.toggle('is-empty', expressionLabel === '');
  }

  function renderHistory() {
    if (!historyList) return;
    if (!state.history.length) {
      historyList.innerHTML = '<li class="history-empty">No calculations yet</li>';
      return;
    }

    historyList.innerHTML = state.history
      .map((entry) => `
        <li class="history-item">
          <small>${entry.label}</small>
          <span>${entry.value}</span>
        </li>
      `)
      .join('');
  }

  function updateHistory() {
    state.history = state.history.slice(0, 8);
    renderHistory();
  }

  function pushHistory(label, value) {
    state.history.unshift({ label, value: String(value) });
    updateHistory();
  }

  function clearAll() {
    const savedMemory = state.memory;
    state.displayValue = '0';
    state.firstValue = null;
    state.operator = null;
    state.expression = null;
    state.waitingForSecondValue = false;
    state.percentPending = false;
    state.memory = savedMemory;
    state.memoryRecallPresses = 0;
    updateDisplay();
  }

  function inputDigit(digit) {
    if (state.percentPending) {
      state.displayValue = digit;
      state.percentPending = false;
      state.waitingForSecondValue = false;
      updateDisplay();
      return;
    }
    if (state.expression !== null) {
      state.expression += digit;
      state.displayValue = state.expression;
      updateDisplay();
      return;
    }
    if (state.waitingForSecondValue) {
      state.displayValue = digit;
      state.waitingForSecondValue = false;
    } else {
      state.displayValue = state.displayValue === '0' ? digit : state.displayValue + digit;
    }
    updateDisplay();
  }

  function inputDecimal() {
    if (state.expression !== null) {
      state.expression += state.expression.endsWith('.') ? '' : '.';
      state.displayValue = state.expression;
      updateDisplay();
      return;
    }
    if (state.waitingForSecondValue) {
      state.displayValue = '0.';
      state.waitingForSecondValue = false;
      updateDisplay();
      return;
    }
    if (!state.displayValue.includes('.')) {
      state.displayValue += '.';
      updateDisplay();
    }
  }

  function toggleSign() {
    state.displayValue = String(Number(state.displayValue) * -1);
    updateDisplay();
  }

  function deleteLast() {
    if (state.expression !== null) {
      state.expression = state.expression.slice(0, -1);
      state.displayValue = state.expression || '0';
      updateDisplay();
      return;
    }
    if (state.waitingForSecondValue && state.operator !== null) {
      state.displayValue = formatNumber(state.firstValue);
      state.operator = null;
      state.firstValue = null;
      state.waitingForSecondValue = false;
      updateDisplay();
      return;
    }
    state.displayValue = state.displayValue.length > 1 ? state.displayValue.slice(0, -1) : '0';
    updateDisplay();
  }

  function inputParenthesis(parenthesis) {
    if (state.expression === null) {
      state.expression = state.displayValue === '0' ? '' : state.displayValue;
    }
    state.expression += parenthesis;
    state.displayValue = state.expression;
    updateDisplay();
  }

  function toggleParenthesis() {
    const expression = state.expression || '';
    const openCount = (expression.match(/\(/g) || []).length;
    const closeCount = (expression.match(/\)/g) || []).length;
    const lastCharacter = expression.slice(-1);
    const shouldClose = openCount > closeCount
      && lastCharacter
      && !/[+\-*/.(]$/.test(lastCharacter);
    inputParenthesis(shouldClose ? ')' : '(');
  }

  function getMemoryInput() {
    if (state.expression !== null) {
      try {
        return evaluateExpression(state.expression);
      } catch (error) {
        return null;
      }
    }
    const value = Number(state.displayValue);
    return Number.isFinite(value) ? value : null;
  }

  function addCurrentResultToMemory() {
    if (state.expression !== null) {
      try {
        const result = evaluateExpression(state.expression);
        state.displayValue = String(result);
        state.expression = null;
        state.firstValue = null;
        state.operator = null;
        state.waitingForSecondValue = false;
      } catch (error) {
        return;
      }
    } else if (state.operator !== null && state.firstValue !== null) {
      computeResult();
    }

    const value = getMemoryInput();
    if (value !== null) {
      state.memory += value;
      state.memoryRecallPresses = 0;
      saveMemory();
    }
    updateDisplay();
  }

  function handleOperator(nextOperator) {
    if (state.expression !== null) {
      state.expression += nextOperator;
      state.displayValue = state.expression;
      updateDisplay();
      return;
    }
    const inputValue = Number(state.displayValue);

    if (state.firstValue === null) {
      state.firstValue = inputValue;
    } else if (state.operator) {
      if (!state.waitingForSecondValue) {
        state.expression = `${formatNumber(state.firstValue)}${state.operator}${formatNumber(inputValue)}${nextOperator}`;
        state.displayValue = state.expression;
        state.firstValue = null;
        state.operator = null;
        state.waitingForSecondValue = true;
        state.percentPending = false;
        updateDisplay();
        return;
      }
      const result = performCalculation(Number(state.firstValue), inputValue, state.operator);
      state.firstValue = result;
      state.displayValue = String(result);
    }

    state.operator = nextOperator;
    state.waitingForSecondValue = true;
    updateDisplay();
  }

  function applyPercent() {
    const value = Number(state.displayValue);
    if (!Number.isFinite(value)) {
      state.displayValue = 'Error';
      state.percentPending = false;
      updateDisplay();
      return;
    }

    if (state.operator !== null && state.firstValue !== null) {
      state.percentPending = true;
      state.displayValue = String(value);
      updateDisplay();
      return;
    }

    state.percentPending = false;
    state.displayValue = String(value / 100);
    updateDisplay();
  }

  function computeResult() {
    if (state.expression !== null) {
      try {
        const result = evaluateExpression(state.expression);
        pushHistory(state.expression, formatNumber(result));
        state.displayValue = String(result);
      } catch (error) {
        state.displayValue = 'Error';
      }
      state.expression = null;
      state.firstValue = null;
      state.operator = null;
      state.waitingForSecondValue = false;
      updateDisplay();
      return;
    }
    if (state.operator === null || state.firstValue === null) return;

    const first = Number(state.firstValue);
    const second = Number(state.displayValue);
    let adjustedSecond = second;

    if (state.percentPending && state.operator && (state.operator === '+' || state.operator === '-' || state.operator === '*' || state.operator === '/')) {
      const isPercentInput = Number.isFinite(second) && second >= 0 && second <= 100;
      const percentFactor = second / 100;

      if (isPercentInput && state.operator === '*') {
        adjustedSecond = percentFactor;
      }
      if (isPercentInput && state.operator === '/') {
        adjustedSecond = percentFactor;
      }
      if (isPercentInput && state.operator === '+') {
        adjustedSecond = first * percentFactor;
      }
      if (isPercentInput && state.operator === '-') {
        adjustedSecond = first * percentFactor;
      }
    }

    const result = performCalculation(first, adjustedSecond, state.operator);

    if (result === 'Error') {
      state.displayValue = 'Error';
      state.firstValue = null;
      state.operator = null;
      state.waitingForSecondValue = true;
      updateDisplay();
      return;
    }

    const formatted = formatNumber(result);
    const secondLabel = state.percentPending ? `${formatNumber(second)}%` : formatNumber(second);
    pushHistory(`${formatNumber(first)} ${state.operator} ${secondLabel}`, formatted);
    state.displayValue = String(result);
    state.firstValue = null;
    state.operator = null;
    state.waitingForSecondValue = false;
    state.percentPending = false;
    updateDisplay();
  }

  function applyUnary(op) {
    let value = Number(state.displayValue);
    let result = value;

    switch (op) {
      case 'sqrt': result = Math.sqrt(value); break;
      case 'square': result = value * value; break;
      case 'cube': result = value * value * value; break;
      case 'factorial':
        applyFactorial();
        return;
      case 'sin': result = state.angleMode === 'DEG' ? Math.sin(value * Math.PI / 180) : Math.sin(value); break;
      case 'cos': result = state.angleMode === 'DEG' ? Math.cos(value * Math.PI / 180) : Math.cos(value); break;
      case 'tan': result = state.angleMode === 'DEG' ? Math.tan(value * Math.PI / 180) : Math.tan(value); break;
      case 'asin': result = state.angleMode === 'DEG' ? (Math.asin(value) * 180 / Math.PI) : Math.asin(value); break;
      case 'acos': result = state.angleMode === 'DEG' ? (Math.acos(value) * 180 / Math.PI) : Math.acos(value); break;
      case 'atan': result = state.angleMode === 'DEG' ? (Math.atan(value) * 180 / Math.PI) : Math.atan(value); break;
      case 'log': result = Math.log10(value); break;
      case 'ln': result = Math.log(value); break;
      case 'exp': result = Math.exp(value); break;
      case 'abs': result = Math.abs(value); break;
      case 'pi': result = Math.PI; break;
      case 'e': result = Math.E; break;
      default: break;
    }

    if (result === 'Error') {
      state.displayValue = 'Error';
    } else {
      state.displayValue = String(result);
      pushHistory(op, formatNumber(result));
    }
    state.firstValue = null;
    state.operator = null;
    state.waitingForSecondValue = false;
    updateDisplay();
  }

  function applyPower() {
    const exponent = Number(prompt('Enter exponent:', '2'));
    if (Number.isNaN(exponent)) return;
    state.displayValue = String(Math.pow(Number(state.displayValue), exponent));
    pushHistory(`x^y ${exponent}`, formatNumber(state.displayValue));
    updateDisplay();
  }

  function applyRoot() {
    const root = Number(prompt('Enter root degree:', '2'));
    if (Number.isNaN(root) || root === 0) return;
    state.displayValue = String(Math.pow(Number(state.displayValue), 1 / root));
    pushHistory(`${root} root`, formatNumber(state.displayValue));
    updateDisplay();
  }

  function applyFactorial() {
    const value = Number(state.displayValue);
    if (!Number.isInteger(value) || value < 0) {
      state.displayValue = 'Error';
      updateDisplay();
      return;
    }
    let fact = 1;
    for (let i = 2; i <= value; i += 1) fact *= i;
    state.displayValue = String(fact);
    pushHistory(`${formatNumber(value)}!`, formatNumber(fact));
    updateDisplay();
  }

  function toggleAngleMode() {
    state.angleMode = state.angleMode === 'DEG' ? 'RAD' : 'DEG';
    fxToggle.textContent = state.angleMode;
  }

  function updateTabs() {
    document.querySelectorAll('.tab-btn').forEach((button) => {
      button.classList.toggle('active', button.dataset.panel === state.currentTab);
    });
    document.querySelectorAll('.panel-wrap').forEach((panel) => {
      panel.classList.toggle('active', panel.dataset.panel === state.currentTab);
    });
  }

  document.querySelectorAll('.tab-btn').forEach((button) => {
    button.addEventListener('click', () => {
      state.currentTab = button.dataset.panel;
      updateTabs();
    });
  });

  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-action]');
    if (!target) return;

    const action = target.dataset.action;
    const value = target.dataset.value;

    switch (action) {
      case 'digit': inputDigit(value); break;
      case 'decimal': inputDecimal(); break;
      case 'operator': handleOperator(value); break;
      case 'equals': computeResult(); break;
      case 'clear': clearAll(); break;
      case 'delete': deleteLast(); break;
      case 'toggle-sign': toggleSign(); break;
      case 'percent': applyPercent(); break;
      case 'parenthesis': inputParenthesis(value); break;
      case 'parenthesis-toggle': toggleParenthesis(); break;
      case 'square': applyUnary('square'); break;
      case 'cube': applyUnary('cube'); break;
      case 'factorial': applyFactorial(); break;
      case 'power': applyPower(); break;
      case 'toggle-root': applyRoot(); break;
      case 'scientific': applyUnary(value); break;
      case 'constant': applyUnary(value); break;
      case 'pi': applyUnary('pi'); break;
      case 'angle-mode': toggleAngleMode(); break;
      case 'memory-clear':
        state.memory = 0;
        state.memoryRecallPresses = 0;
        saveMemory();
        updateDisplay();
        break;
      case 'memory-read':
        state.displayValue = String(state.memory);
        state.memoryRecallPresses = 1;
        updateDisplay();
        break;
      case 'memory-add': {
        addCurrentResultToMemory();
        break;
      }
      case 'memory-sub': {
        const value = getMemoryInput();
        if (value !== null) {
          state.memory -= value;
          state.memoryRecallPresses = 0;
          saveMemory();
        }
        updateDisplay();
        break;
      }
      case 'memory-rc':
        if (state.memoryRecallPresses === 1) {
          state.memory = 0;
          state.memoryRecallPresses = 0;
          saveMemory();
        } else {
          state.displayValue = String(state.memory);
          state.memoryRecallPresses = 1;
        }
        updateDisplay();
        break;
      default: break;
    }
  });

  themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-mode');
    themeToggle.textContent = isLight ? 'Moon' : 'Sun';
  });

  fxToggle.addEventListener('click', () => {
    state.scientificVisible = !state.scientificVisible;
    const scientificTab = document.querySelector('.tab-btn[data-panel="scientific"]');
    if (state.scientificVisible) {
      scientificTab.style.display = 'inline-flex';
      state.currentTab = 'scientific';
    } else {
      scientificTab.style.display = 'none';
      state.currentTab = 'standard';
    }
    updateTabs();
  });

  const converterConfigs = {
    length: { label: 'Length', units: { kilometer: { label: 'Kilometers', value: 1000 }, meter: { label: 'Meters', value: 1 }, mile: { label: 'Miles', value: 1609.344 }, inch: { label: 'Inches', value: 0.0254 } } },
    mass: { label: 'Mass', units: { kilogram: { label: 'Kilograms', value: 1000 }, pound: { label: 'Pounds', value: 453.59237 }, ounce: { label: 'Ounces', value: 28.349523125 }, gram: { label: 'Grams', value: 1 } } },
    temperature: { label: 'Temperature', units: { celsius: { label: 'Celsius', value: 'c' }, fahrenheit: { label: 'Fahrenheit', value: 'f' }, kelvin: { label: 'Kelvin', value: 'k' } } },
    volume: { label: 'Volume', units: { gallon: { label: 'Gallons', value: 3.785411784 }, liter: { label: 'Liters', value: 1 }, cup: { label: 'Cups', value: 0.2365882365 }, milliliter: { label: 'Milliliters', value: 0.001 } } },
    speed: { label: 'Speed', units: { ms: { label: 'm/s', value: 3.6 }, kmh: { label: 'km/h', value: 1 }, mph: { label: 'mph', value: 0.621371 } } },
    time: { label: 'Time', units: { day: { label: 'Days', value: 86400 }, hour: { label: 'Hours', value: 3600 }, minute: { label: 'Minutes', value: 60 }, second: { label: 'Seconds', value: 1 } } },
    data: { label: 'Data', units: { gigabyte: { label: 'GB', value: 1073741824 }, megabyte: { label: 'MB', value: 1048576 }, kilobyte: { label: 'KB', value: 1024 }, byte: { label: 'Bytes', value: 1 } } },
    area: { label: 'Area', units: { hectare: { label: 'Hectares', value: 10000 }, acre: { label: 'Acres', value: 4046.8564224 }, sqm: { label: 'm^2', value: 1 } } },
  };

  function populateConverterOptions() {
    const category = document.getElementById('converterCategory').value;
    const config = converterConfigs[category];
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');

    fromUnit.innerHTML = Object.entries(config.units).map(([key, unit]) => `<option value="${key}">${unit.label}</option>`).join('');
    toUnit.innerHTML = Object.entries(config.units).map(([key, unit]) => `<option value="${key}">${unit.label}</option>`).join('');
    fromUnit.value = Object.keys(config.units)[0];
    toUnit.value = Object.keys(config.units)[Math.min(1, Object.keys(config.units).length - 1)];
  }

  function convertValue() {
    const category = document.getElementById('converterCategory').value;
    const config = converterConfigs[category];
    const inputValue = parseNumericInput(document.getElementById('converterValue').value, 0);
    const from = document.getElementById('fromUnit').value;
    const to = document.getElementById('toUnit').value;

    let result = inputValue;

    if (config.units[from].value === 'c' || config.units[from].value === 'f' || config.units[from].value === 'k') {
      const normalized = config.units[from].value === 'c' ? inputValue : config.units[from].value === 'f' ? (inputValue - 32) * 5 / 9 : inputValue - 273.15;
      const converted = config.units[to].value === 'c' ? normalized : config.units[to].value === 'f' ? (normalized * 9 / 5) + 32 : normalized + 273.15;
      result = converted;
    } else {
      const base = inputValue * config.units[from].value;
      result = base / config.units[to].value;
    }

    const fromLabel = config.units[from].label;
    const toLabel = config.units[to].label;
    const isTemperature = ['c', 'f', 'k'].includes(config.units[from].value);
    const showTargetFirst = !isTemperature && config.units[from].value < config.units[to].value;
    const firstValue = showTargetFirst
      ? result
      : inputValue;
    const firstLabel = showTargetFirst
      ? toLabel
      : fromLabel;
    const secondValue = firstValue === result ? inputValue : result;
    const secondLabel = firstValue === result ? fromLabel : toLabel;
    document.getElementById('converterResult').textContent = `${formatNumber(firstValue)} ${firstLabel} = ${formatNumber(secondValue)} ${secondLabel}`;
  }

  document.getElementById('converterCategory').addEventListener('change', populateConverterOptions);
  document.getElementById('fromUnit').addEventListener('change', convertValue);
  document.getElementById('toUnit').addEventListener('change', convertValue);
  document.getElementById('converterValue').addEventListener('input', convertValue);
  document.getElementById('convertBtn').addEventListener('click', convertValue);
  populateConverterOptions();
  convertValue();

  document.getElementById('bmiBtn').addEventListener('click', () => {
    const height = parseNumericInput(document.getElementById('bmiHeight').value, 0) / 100;
    const weight = parseNumericInput(document.getElementById('bmiWeight').value, 0);
    const bmi = weight / (height * height);
    document.getElementById('bmiResult').textContent = `BMI: ${formatNumber(bmi)} (${bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obesity'})`;
  });

  document.getElementById('dateBtn').addEventListener('click', () => {
    const start = new Date(document.getElementById('dateStart').value);
    const end = new Date(document.getElementById('dateEnd').value);
    const diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24));
    document.getElementById('dateResult').textContent = `${diffDays} days`;
  });

  document.getElementById('discountBtn').addEventListener('click', () => {
    const price = parseNumericInput(document.getElementById('discountPrice').value, 0);
    const discount = parseNumericInput(document.getElementById('discountPercent').value, 0);
    const tax = parseNumericInput(document.getElementById('taxPercent').value, 0);
    const discounted = price * (1 - discount / 100);
    const final = discounted * (1 + tax / 100);
    document.getElementById('discountFinal').value = formatNumber(final);
  });

  document.getElementById('tipBtn').addEventListener('click', () => {
    const bill = parseNumericInput(document.getElementById('tipBill').value, 0);
    const percent = parseNumericInput(document.getElementById('tipPercent').value, 0);
    const people = parseNumericInput(document.getElementById('tipPeople').value, 1);
    const total = bill * (1 + percent / 100);
    const each = total / people;
    document.getElementById('tipEach').value = formatNumber(each);
  });

  clearHistoryBtn.addEventListener('click', () => {
    state.history = [];
    updateHistory();
  });

  document.addEventListener('keydown', (event) => {
    const isFormField = ['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement?.tagName || '');
    if (isFormField) return;

    const key = event.key.toLowerCase();
    const hasCtrl = event.ctrlKey || event.metaKey;

    if (hasCtrl && event.shiftKey && key === 'm') {
      event.preventDefault();
      state.memory -= getMemoryInput() || 0;
      state.memoryRecallPresses = 0;
      saveMemory();
      updateDisplay();
      return;
    }

    if (hasCtrl && key === 'm') {
      event.preventDefault();
      addCurrentResultToMemory();
      return;
    }

    if (hasCtrl && key === 'r') {
      event.preventDefault();
      state.displayValue = String(state.memory);
      state.memoryRecallPresses = 1;
      updateDisplay();
      return;
    }

    if (hasCtrl && key === 't') {
      event.preventDefault();
      themeToggle.click();
      return;
    }

    if (hasCtrl && key === 'f') {
      event.preventDefault();
      fxToggle.click();
      return;
    }

    if (event.altKey && /^[1-5]$/.test(key)) {
      event.preventDefault();
      const panels = ['standard', 'scientific', 'converter', 'special', 'history'];
      const panel = panels[Number(key) - 1];
      if (panel === 'scientific' && !state.scientificVisible) fxToggle.click();
      state.currentTab = panel;
      updateTabs();
      return;
    }

    if (/^[0-9]$/.test(event.key)) {
      event.preventDefault();
      inputDigit(event.key);
      return;
    }

    if (event.key === '.' || event.key === ',') {
      event.preventDefault();
      inputDecimal();
      return;
    }

    if (['+', '-', '*', '/'].includes(event.key)) {
      event.preventDefault();
      handleOperator(event.key);
      return;
    }

    if (event.key === 'Enter' || event.key === '=') {
      event.preventDefault();
      computeResult();
      return;
    }

    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      deleteLast();
      return;
    }

    if (event.key === 'Escape' || key === 'c') {
      event.preventDefault();
      clearAll();
      return;
    }

    if (event.key === '%') {
      event.preventDefault();
      applyPercent();
      return;
    }

    if (event.key === '(' || event.key === ')') {
      event.preventDefault();
      inputParenthesis(event.key);
      return;
    }

    const keyboardActions = {
      u: () => toggleSign(),
      q: () => applyUnary('square'),
      b: () => applyUnary('cube'),
      '!': () => applyFactorial(),
      s: () => applyUnary('sin'),
      o: () => applyUnary('cos'),
      t: () => applyUnary('tan'),
      l: () => applyUnary('log'),
      n: () => applyUnary('ln'),
      r: () => applyUnary('sqrt'),
      x: () => applyUnary('exp'),
      a: () => applyUnary('abs'),
      p: () => applyUnary('pi'),
      e: () => applyUnary('e'),
      d: () => toggleAngleMode(),
    };

    if (keyboardActions[key] && !hasCtrl && !event.altKey) {
      event.preventDefault();
      keyboardActions[key]();
    }
  });

  updateDisplay();
  updateHistory();
  updateTabs();
  document.querySelector('.tab-btn[data-panel="scientific"]').style.display = 'none';
  fxToggle.textContent = state.angleMode;
};

window.initCalculator = initCalculator;
