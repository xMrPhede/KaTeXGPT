#!/bin/bash
# Pastes every MathML result for a given harness shape into a fresh Word
# document, one labelled equation per line, so the render can be eyeballed.
#
# Usage: test/word-paste.sh [shape]      (shape defaults to "chatgpt")
set -euo pipefail
cd "$(dirname "$0")/.."

SHAPE="${1:-chatgpt}"

osascript -e 'tell application "Microsoft Word" to activate' \
          -e 'delay 1' \
          -e 'tell application "Microsoft Word" to make new document' \
          -e 'delay 1' >/dev/null

names=$(node -e "
const r=require('./test/results.json');
console.log(r['$SHAPE'].filter(c=>c.out).map(c=>c.name).join(' '));
")

for name in $names; do
  node -e "
const r=require('./test/results.json');
process.stdout.write(r['$SHAPE'].find(c=>c.name==='$name').out);
" | pbcopy

  osascript >/dev/null <<APPLESCRIPT
tell application "Microsoft Word"
  type text selection text "${name}:  "
  paste object selection
  type text selection text return
end tell
APPLESCRIPT
  # Word needs a beat to finish the MathML -> OMML conversion.
  sleep 0.6
  echo "pasted $name"
done

echo "done: $SHAPE"
