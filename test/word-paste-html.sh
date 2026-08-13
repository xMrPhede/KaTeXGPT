#!/bin/bash
# Puts an HTML file on the macOS pasteboard as the text/html flavour and pastes
# it into a new Word document, then exports that document to PDF.
#
# Usage: test/word-paste-html.sh <html-file> <out.pdf>
set -euo pipefail

SRC="$1"
OUT="$2"

HEX=$(xxd -p "$SRC" | tr -d '\n')

osascript >/dev/null <<APPLESCRIPT
set the clipboard to «data HTML${HEX}»
APPLESCRIPT

osascript >/dev/null <<APPLESCRIPT
tell application "Microsoft Word"
  activate
  make new document
  delay 1
  paste object selection
  delay 2
end tell
APPLESCRIPT

rm -f "$OUT"
osascript >/dev/null <<APPLESCRIPT
tell application "Microsoft Word"
  save as active document file format format PDF file name "$OUT"
end tell
APPLESCRIPT
sleep 2
echo "wrote $OUT"
