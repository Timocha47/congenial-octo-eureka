export function parseNumericInput(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function validatePositiveNumber(value, label) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) {
    throw new Error(`${label} must be a positive number`);
  }
  return number;
}

export function validateRequiredFields(fields) {
  return Object.entries(fields).every(([, value]) => String(value ?? '').trim() !== '');
}
