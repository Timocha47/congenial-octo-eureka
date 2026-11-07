const installButton = document.getElementById('installApp');
const installDialog = document.getElementById('installDialog');
const installInstructions = document.getElementById('installInstructions');
const closeInstallDialogButton = document.getElementById('closeInstallDialog');
let deferredInstallPrompt;

function isAppInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches
    || navigator.standalone === true
    || navigator.userAgent.includes('Electron/')
    || window.Capacitor?.isNativePlatform?.() === true;
}

function showInstallInstructions() {
  const isAppleMobile = /iPhone|iPad|iPod/.test(navigator.userAgent);
  installInstructions.textContent = isAppleMobile
    ? 'In Safari, tap Share, then choose “Add to Home Screen”.'
    : 'Open your browser menu and choose “Install app” or “Add to Home screen”.';
  installDialog.showModal();
}

if (isAppInstalled()) {
  installButton.hidden = true;
}

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = undefined;
  installButton.hidden = true;
});

installButton.addEventListener('click', async () => {
  if (!deferredInstallPrompt) {
    showInstallInstructions();
    return;
  }

  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = undefined;
});

closeInstallDialogButton.addEventListener('click', () => installDialog.close());

if ('serviceWorker' in navigator && location.protocol !== 'file:' && window.Capacitor?.isNativePlatform?.() !== true) {
  navigator.serviceWorker.register('./service-worker.js')
    .catch((error) => console.error('Service worker registration failed:', error));
}
