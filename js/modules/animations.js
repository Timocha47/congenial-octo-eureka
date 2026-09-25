export function flashElement(element, className = 'is-updated', duration = 220) {
  if (!element) return;
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
  window.setTimeout(() => element.classList.remove(className), duration);
}

export function animateNumber(element, value, formatter = String) {
  if (!element) return;
  element.textContent = formatter(value);
  flashElement(element);
}
