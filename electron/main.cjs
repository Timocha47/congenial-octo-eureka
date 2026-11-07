const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { app, BrowserWindow } = require('electron');

function createWindow() {
  const appPage = path.resolve(__dirname, '..', 'index.html');
  const appPageUrl = pathToFileURL(appPage).href;
  const window = new BrowserWindow({
    width: 560,
    height: 800,
    minWidth: 360,
    minHeight: 540,
    autoHideMenuBar: true,
    backgroundColor: '#070d18',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  window.webContents.on('will-navigate', (event, url) => {
    if (url !== appPageUrl) {
      event.preventDefault();
    }
  });

  window.loadFile(appPage);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
