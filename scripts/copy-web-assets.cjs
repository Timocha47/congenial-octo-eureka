const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const webOutput = path.join(projectRoot, 'native', 'www');
const appFiles = [
  'index.html',
  'manifest.webmanifest',
  'service-worker.js',
  'css',
  'js',
  'icons'
];

fs.mkdirSync(webOutput, { recursive: true });

for (const name of appFiles) {
  const source = path.join(projectRoot, name);
  if (!fs.existsSync(source)) {
    throw new Error(`Required application asset is missing: ${source}`);
  }
  fs.cpSync(source, path.join(webOutput, name), { recursive: true });
}

console.log(`Copied ${appFiles.length} application assets to ${webOutput}`);
