#!/usr/bin/env node
/**
 * Writes env.js at deploy time from environment variables (e.g. Vercel Project Settings).
 * If FIREBASE_API_KEY is unset, skips — site works without login.
 */
const fs = require('fs');
const path = require('path');

const apiKey = process.env.FIREBASE_API_KEY;
const outPath = path.join(__dirname, '..', 'env.js');

if (!apiKey) {
  console.log('generate-env: FIREBASE_API_KEY not set — skipping env.js (Firebase login disabled).');
  process.exit(0);
}

const env = {
  FIREBASE_API_KEY: apiKey,
  FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN || '',
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || '',
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET || '',
  FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
  FIREBASE_APP_ID: process.env.FIREBASE_APP_ID || '',
  FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID || '',
  PRIVACY_POLICY_URL: process.env.PRIVACY_POLICY_URL || '',
  TERMS_URL: process.env.TERMS_URL || ''
};

const content =
  '/** Generated at build time — do not edit on the server. */\n' +
  'window.__ENV__ = ' +
  JSON.stringify(env, null, 4) +
  ';\n';

fs.writeFileSync(outPath, content, 'utf8');
console.log('generate-env: wrote env.js for deployment.');
