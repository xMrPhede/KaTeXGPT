#!/bin/bash
# Pastes hand-written MathML variants into Word to decide which attributes the
# sanitizer may strip. Reads "label<TAB>mathml" lines from test/variants.tsv.
set -euo pipefail
cd "$(dirname "$0")/.."

OUT="${1:-/tmp/word_variants.pdf}"

osascript -e 'tell application "Microsoft Word" to activate' \
          -e 'delay 1' \
          -e 'tell application "Microsoft Word" to make new document' \
          -e 'delay 1' >/dev/null

while IFS=$'\t' read -r label xml; do
  [ -z "$label" ] && continue
  printf '%s' "$xml" | pbcopy
  osascript >/dev/null <<APPLESCRIPT
tell application "Microsoft Word"
  type text selection text "${label}:  "
  paste object selection
  type text selection text return
end tell
APPLESCRIPT
  sleep 0.6
  echo "pasted $label"
done < test/variants.tsv

rm -f "$OUT"
osascript >/dev/null <<APPLESCRIPT
tell application "Microsoft Word"
  save as active document file format format PDF file name "$OUT"
end tell
APPLESCRIPT
sleep 2
echo "wrote $OUT"
