if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCalculator, { once: true });
} else {
  initCalculator();
}