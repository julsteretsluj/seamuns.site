#!/usr/bin/env bash
# Encrypt env.js -> env.js.enc so you can commit the encrypted file safely.
# Usage: ./scripts/encrypt-env.sh   (prompts for passphrase)
#    or: ENV_ENCRYPT_KEY=yoursecret ./scripts/encrypt-env.sh
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE="$ROOT_DIR/env.js"
ENC_FILE="$ROOT_DIR/env.js.enc"

if [ ! -f "$ENV_FILE" ]; then
  echo "Error: env.js not found. Copy env.example.js to env.js and add your Firebase credentials first."
  exit 1
fi

KEY="${ENV_ENCRYPT_KEY:-}"
if [ -z "$KEY" ]; then
  echo "Enter a passphrase to encrypt env.js (you'll need it to decrypt on deploy):"
  read -rs KEY
  echo
fi
if [ -z "$KEY" ]; then
  echo "Error: passphrase is required."
  exit 1
fi

openssl enc -aes-256-cbc -pbkdf2 -salt -in "$ENV_FILE" -out "$ENC_FILE" -k "$KEY"
echo "Created env.js.enc. Commit this file; keep the passphrase secret."
