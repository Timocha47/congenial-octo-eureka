const openSourceLicensesButton = document.getElementById('openSourceLicenses');

if (window.Capacitor?.getPlatform?.() === 'android') {
  openSourceLicensesButton.hidden = false;
  openSourceLicensesButton.addEventListener('click', async () => {
    try {
      await window.Capacitor.Plugins.OpenSourceLicenses.show();
    } catch (error) {
      console.error('Unable to open Android open-source licenses.', error);
      window.alert('Open-source licenses could not be opened. Please try again.');
    }
  });
}
