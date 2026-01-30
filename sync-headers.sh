#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

# Build header chunk from index.html: from <body> to first </nav>
HEADER_CHUNK_FILE=".header_nav.chunk.tmp"
awk '
  BEGIN{inbody=0}
  /<body[^>]*>/ { inbody=1; print; next }
  inbody==1 { print; if ($0 ~ /<\/nav>/) { exit } }
' index.html > "$HEADER_CHUNK_FILE"

# Verify chunk contains </nav>
if ! grep -q "</nav>" "$HEADER_CHUNK_FILE"; then
  echo "Failed to extract header/nav from index.html" >&2
  exit 1
fi

# Process all html files except excluded ones
shopt -s nullglob
for f in *.html; do
  case "$f" in
    index.html|clear-cache.html|debug.html|test-*.html|clear-all.html)
      echo "Skipping $f"
      continue
      ;;
  esac

  tmpfile="$f.tmp"
# Replace from <body> to first </nav> with the chunk
  awk -v chunkfile="$HEADER_CHUNK_FILE" '
    BEGIN{inreplace=0}
    /<body[^>]*>/ {
      while ((getline line < chunkfile) > 0) print line;
      close(chunkfile);
      inreplace=1;
      next
    }
    inreplace==1 {
      if ($0 ~ /<\/nav>/) { inreplace=0; next } else { next }
    }
    { print }
  ' "$f" > "$tmpfile"
  mv "$tmpfile" "$f"
  echo "Updated $f"

done

rm -f "$HEADER_CHUNK_FILE"
echo "All headers synchronized."










