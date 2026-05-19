#!/usr/bin/env node
/**
 * Copies the static site into public/ for Vercel (outputDirectory: public).
 * Run after generate-env.js so env.js is included in the deployment.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const out = path.join(root, 'public');

const copyFiles = ['index.html', 'firebase-config.js', 'env.js'];
const copyDirs = ['css', 'js', 'pages', 'assets', 'munsimulation', 'fonts'];

if (fs.existsSync(out)) {
  fs.rmSync(out, { recursive: true, force: true });
}
fs.mkdirSync(out, { recursive: true });

for (const file of copyFiles) {
  const src = path.join(root, file);
  if (!fs.existsSync(src)) {
    if (file === 'env.js') {
      console.warn('prepare-vercel: env.js missing — run generate-env or add Firebase env vars in Vercel');
      continue;
    }
    console.warn('prepare-vercel: skipping missing file', file);
    continue;
  }
  fs.copyFileSync(src, path.join(out, file));
}

for (const dir of copyDirs) {
  const src = path.join(root, dir);
  if (!fs.existsSync(src)) continue;
  fs.cpSync(src, path.join(out, dir), { recursive: true });
}

console.log('prepare-vercel: wrote public/ for deployment');
