#!/usr/bin/env bash
# Decrypt env.js.enc -> env.js for local run or deploy.
# Usage: ./scripts/decrypt-env.sh   (prompts for passphrase)
#    or: ENV_ENCRYPT_KEY=yoursecret ./scripts/decrypt-env.sh
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE="$ROOT_DIR/env.js"
ENC_FILE="$ROOT_DIR/env.js.enc"

if [ ! -f "$ENC_FILE" ]; then
  echo "Error: env.js.enc not found. Run scripts/encrypt-env.sh first (with a real env.js)."
  exit 1
fi

KEY="${ENV_ENCRYPT_KEY:-}"
if [ -z "$KEY" ]; then
  echo "Enter the passphrase used to encrypt env.js:"
  read -rs KEY
  echo
fi
if [ -z "$KEY" ]; then
  echo "Error: passphrase is required."
  exit 1
fi

openssl enc -aes-256-cbc -pbkdf2 -d -in "$ENC_FILE" -out "$ENV_FILE" -k "$KEY"
echo "Created env.js. Ready to run or deploy."
